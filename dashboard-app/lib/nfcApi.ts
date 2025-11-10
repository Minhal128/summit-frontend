import {
  NonceResponse,
  ActionNonceResponse,
  NfcAuthResponse,
  ActionAuthorizationResponse,
  ProvisionCardRequest,
  UserCardsResponse,
  ActivityResponse
} from '@/types/nfc';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Helper function for API calls
 */
async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  
  // Attach Authorization header if token exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('nfc_token') || localStorage.getItem('auth_token') : null;
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data?.message || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  const text = await res.text();
  if (!res.ok) {
    const err: any = new Error(text || `Request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return text;
}

// ==========================================
// PUBLIC ENDPOINTS
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

  // Store NFC token
  if (response.success && response.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nfc_token', response.token);
      localStorage.setItem('auth_token', response.token);
    }
  }

  return response;
}

// ==========================================
// PROTECTED ENDPOINTS
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
