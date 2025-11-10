import { apiFetch } from './api';
import {
  NonceResponse,
  ActionNonceResponse,
  NfcAuthResponse,
  ActionAuthorizationResponse,
  ProvisionCardRequest,
  UserCardsResponse,
  ActivityResponse
} from '@/types/nfc';

/**
 * NFC API Service
 * Handles all NFC-related API calls
 */

// ==========================================
// PUBLIC ENDPOINTS (No authentication required)
// ==========================================

/**
 * Step 1: Request authentication nonce
 */
export async function createAuthNonce(cardId: string): Promise<NonceResponse> {
  return apiFetch('/api/nfc/nonce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId })
  });
}

/**
 * Step 2: Authenticate with NFC card
 */
export async function authenticateWithNfc(data: {
  cardId: string;
  nonce: string;
  signature: string;
  timestamp: number;
}): Promise<NfcAuthResponse> {
  const response = await apiFetch('/api/nfc/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  // Store NFC token in localStorage
  if (response.success && response.token) {
    localStorage.setItem('nfc_token', response.token);
    localStorage.setItem('auth_token', response.token); // Also store as main auth token
  }

  return response;
}

// ==========================================
// PROTECTED ENDPOINTS (Require authentication)
// ==========================================

/**
 * Provision new NFC card
 */
export async function provisionCard(data: ProvisionCardRequest): Promise<any> {
  return apiFetch('/api/nfc/provision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

/**
 * Step 3: Request action nonce for transaction authorization
 */
export async function createActionNonce(data: {
  cardId: string;
  actionType: 'send' | 'swap' | 'buy' | 'sell';
  amount?: string;
  toAddress?: string;
  fromToken?: string;
  toToken?: string;
  params?: Record<string, any>;
}): Promise<ActionNonceResponse> {
  return apiFetch('/api/nfc/action-nonce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

/**
 * Step 4: Authorize action with NFC signature
 */
export async function authorizeAction(data: {
  actionId: string;
  cardId: string;
  nonce: string;
  signature: string;
}): Promise<ActionAuthorizationResponse> {
  return apiFetch('/api/nfc/authorize-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

/**
 * Get user's NFC cards
 */
export async function getUserCards(): Promise<UserCardsResponse> {
  return apiFetch('/api/nfc/cards', {
    method: 'GET'
  });
}

/**
 * Get user's NFC activity logs
 */
export async function getUserActivity(limit: number = 50): Promise<ActivityResponse> {
  return apiFetch(`/api/nfc/activity?limit=${limit}`, {
    method: 'GET'
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if user has an NFC token
 */
export function hasNfcToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('nfc_token');
}

/**
 * Clear NFC token
 */
export function clearNfcToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nfc_token');
}

/**
 * Get stored card ID
 */
export function getStoredCardId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nfc_card_id');
}

/**
 * Store card ID
 */
export function storeCardId(cardId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nfc_card_id', cardId);
}

/**
 * Clear stored card ID
 */
export function clearCardId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nfc_card_id');
}
