/**
 * NFC Crypto Utilities for Browser
 * Simulates NFC card operations for demonstration
 * In production, this would interface with actual NFC hardware via Web NFC API
 */

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyType: 'P-256' | 'Ed25519' | 'secp256k1';
}

/**
 * Generate a key pair for demonstration
 * In production, this would be done on the NFC card's secure element
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
 * Sign a message with the private key
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
  const jwkObj = JSON.parse(jwk);
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
 * Store key pair securely (for demo - in production this stays on card)
 */
export function storeKeyPair(cardId: string, keyPair: KeyPair): void {
  if (typeof window === 'undefined') return;
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
 * Simulate NFC card tap (for demo)
 */
export async function simulateNfcTap(cardId: string, message: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const keyPair = getStoredKeyPair(cardId);
  if (!keyPair) {
    throw new Error('Card not found. Please provision card first.');
  }
  return await signMessage(message, keyPair.privateKey);
}
