/**
 * NFC Crypto Utilities for Browser
 * 
 * Supports two modes:
 * 
 * 1. REAL CARD MODE (production):
 *    - Physical DESFire EV3 card stores cardId as NDEF text
 *    - User taps card → phone reads cardId via Web NFC API
 *    - Backend holds the private key (generated during provisioning)
 *    - Authentication uses server-side signing via /nfc/auth-tap endpoint
 * 
 * 2. DEMO MODE (development/testing):
 *    - Key pair generated in browser via Web Crypto API
 *    - Private key stored in localStorage (NEVER do this in production)
 *    - Used when no physical card is available
 */

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyType: 'P-256' | 'Ed25519' | 'secp256k1';
}

/**
 * Scan for a physical NFC card using Web NFC API.
 * Returns the cardId (from NDEF text record) and serialNumber (UID).
 * 
 * This is the PRIMARY method for real card authentication.
 */
export async function scanNfcCard(): Promise<{ cardId: string; cardUid: string }> {
  if (!isWebNfcAvailable()) {
    throw new Error('Web NFC not available. Use Chrome on Android with NFC enabled.');
  }

  return new Promise((resolve, reject) => {
    const ndef = new (window as any).NDEFReader();
    let resolved = false;

    ndef.scan().then(() => {
      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        if (resolved) return;
        resolved = true;

        let cardId = '';

        // Read cardId from NDEF text record
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            cardId = textDecoder.decode(record.data);
            break;
          }
        }

        // Fallback: use serial number if no text record found
        if (!cardId) {
          cardId = `NFC-${serialNumber.replace(/:/g, '').toUpperCase()}`;
        }

        resolve({
          cardId,
          cardUid: serialNumber.replace(/:/g, '').toUpperCase()
        });
      });

      ndef.addEventListener('readingerror', () => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Error reading NFC card. Please try again.'));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('NFC scan timed out. Please try again.'));
        }
      }, 30000);
    }).catch((err: Error) => {
      reject(new Error(`NFC scan failed: ${err.message}`));
    });
  });
}

// ══════════════════════════════════════════════════════════════
// DEMO MODE - Browser-simulated crypto (for development only)
// ══════════════════════════════════════════════════════════════

/**
 * Generate a key pair for demonstration
 * In production, keys are generated during card provisioning (on your computer)
 */
export async function generateKeyPair(keyType: 'P-256' | 'Ed25519' | 'secp256k1' = 'P-256'): Promise<KeyPair> {
  try {
    if (keyType === 'P-256') {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256'
        },
        true,
        ['sign', 'verify']
      );

      const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
      const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);

      return {
        publicKey: JSON.stringify(publicKeyJwk),
        privateKey: JSON.stringify(privateKeyJwk),
        keyType: 'P-256'
      };
    }

    throw new Error('Only P-256 is currently supported in browser demo');
  } catch (error) {
    console.error('Key generation error:', error);
    throw new Error('Failed to generate key pair');
  }
}

/**
 * Sign a message with the private key (DEMO MODE ONLY)
 * In production, the backend signs using the key generated during provisioning
 */
export async function signMessage(message: string, privateKeyJwk: string): Promise<string> {
  try {
    const privateKey = await window.crypto.subtle.importKey(
      'jwk',
      JSON.parse(privateKeyJwk),
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const signature = await window.crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' }
      },
      privateKey,
      data
    );

    // Convert to base64
    return arrayBufferToBase64(signature);
  } catch (error) {
    console.error('Signing error:', error);
    throw new Error('Failed to sign message');
  }
}

/**
 * Convert ArrayBuffer to base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert JWK to PEM format for backend
 */
export function jwkToPem(jwk: string): string {
  // For demo purposes, we'll send JWK directly
  // In production, proper PEM conversion would be needed
  const jwkObj = JSON.parse(jwk);
  
  // This is a simplified version - in production you'd need proper PEM encoding
  const pem = `-----BEGIN PUBLIC KEY-----
${btoa(JSON.stringify(jwkObj))}
-----END PUBLIC KEY-----`;
  
  return pem;
}

/**
 * Create authentication message format
 */
export function createAuthMessage(nonce: string, cardId: string, timestamp: number): string {
  return `${nonce}:${cardId}:${timestamp}`;
}

/**
 * Create action message format
 */
export function createActionMessage(nonce: string, actionPayload: any): string {
  return `${nonce}:${JSON.stringify(actionPayload)}`;
}

/**
 * Store key pair (DEMO MODE - localStorage)
 * WARNING: Never store private keys in localStorage in production!
 * In production, keys are on the backend from card provisioning.
 */
export function storeKeyPair(cardId: string, keyPair: KeyPair): void {
  if (typeof window === 'undefined') return;
  
  // WARNING: Never store private keys in localStorage in production!
  // This is only for demonstration purposes
  localStorage.setItem(`nfc_keypair_${cardId}`, JSON.stringify(keyPair));
}

/**
 * Retrieve stored key pair
 */
export function getStoredKeyPair(cardId: string): KeyPair | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(`nfc_keypair_${cardId}`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Simulate NFC card tap (DEMO MODE ONLY)
 * In production, use scanNfcCard() to read cardId from physical card,
 * then call authenticateWithTap() from nfcApi.ts
 */
export async function simulateNfcTap(cardId: string, message: string): Promise<string> {
  // Simulate delay of physical card tap
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const keyPair = getStoredKeyPair(cardId);
  if (!keyPair) {
    throw new Error('Card not found. Please provision card first.');
  }
  
  return await signMessage(message, keyPair.privateKey);
}

/**
 * Check if Web NFC is available
 */
export function isWebNfcAvailable(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

/**
 * Request Web NFC permission (if available)
 */
export async function requestNfcPermission(): Promise<boolean> {
  if (!isWebNfcAvailable()) {
    console.warn('Web NFC not available in this browser');
    return false;
  }
  
  try {
    // Web NFC API doesn't require explicit permission request
    // Permission is requested when first using NDEFReader
    return true;
  } catch (error) {
    console.error('NFC permission error:', error);
    return false;
  }
}
