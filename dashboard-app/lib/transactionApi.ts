/**
 * Transaction API Service
 * Handles all transaction-related API calls for Send, Receive, and Swap functions
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Helper function for API calls with authentication
 */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  // Attach Authorization header if token exists
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('nfc_token') || localStorage.getItem('auth_token') 
    : null;
    
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });
  
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

  return text as unknown as T;
}

// ==========================================
// TYPES
// ==========================================

export interface FeeEstimate {
  success: boolean;
  fees: {
    platformFee: string;
    networkFee: string;
    totalFee: string;
    feePercentage: number;
    userTier: string;
  };
  breakdown: {
    sendAmount: string;
    platformFee: string;
    networkFee: string;
    totalDeducted: string;
    recipientReceives: string;
    currency: string;
  };
}

export interface SwapQuote {
  success: boolean;
  quote: {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    rate: string;
    inverseRate: string;
    fees: {
      platformFee: string;
      networkFee: string;
      totalFee: string;
      feePercentage: number;
    };
    priceImpact: string;
    minimumReceived: string;
    expiresAt: string;
    market: {
      fromTokenPrice: number;
      toTokenPrice: number;
      bufferApplied: string;
    };
  };
}

export interface SendTransactionRequest {
  toAddress: string;
  amount: string;
  currency: string;
  walletId: string;
  memo?: string;
}

export interface SendTransactionResponse {
  success: boolean;
  message: string;
  transaction: {
    id: string;
    type: string;
    status: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    currency: string;
    fees: {
      platform: string;
      network: string;
      total: string;
    };
    nfcRequired: boolean;
    actionId?: string;
    createdAt: string;
  };
}

export interface ExecuteSendRequest {
  transactionId: string;
  nfcAuthId: string;
}

export interface ExecuteSendResponse {
  success: boolean;
  message: string;
  transaction: {
    id: string;
    status: string;
    txHash?: string;
    completedAt?: string;
  };
}

export interface SwapTransactionRequest {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  walletId: string;
  slippageTolerance?: number;
}

export interface SwapTransactionResponse {
  success: boolean;
  message: string;
  transaction: {
    id: string;
    type: string;
    status: string;
    fromToken: string;
    toToken: string;
    fromAmount: string;
    estimatedToAmount: string;
    fees: {
      platform: string;
      network: string;
      total: string;
    };
    nfcRequired: boolean;
    actionId?: string;
    createdAt: string;
  };
}

export interface ExecuteSwapRequest {
  transactionId: string;
  nfcAuthId: string;
}

export interface ExecuteSwapResponse {
  success: boolean;
  message: string;
  transaction: {
    id: string;
    status: string;
    txHash?: string;
    actualToAmount?: string;
    completedAt?: string;
  };
}

export interface TransactionHistoryResponse {
  success: boolean;
  transactions: Array<{
    id: string;
    type: string;
    status: string;
    fromAddress?: string;
    toAddress?: string;
    amount: string;
    currency: string;
    txHash?: string;
    createdAt: string;
    completedAt?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface QRCodeResponse {
  success: boolean;
  qrCode: string;
  wallet: {
    address: string;
    currency: string;
    network: string;
  };
  uri: string;
}

// ==========================================
// SEND FUNCTIONS
// ==========================================

/**
 * Estimate fees for a send transaction
 */
export async function estimateSendFee(
  amount: string, 
  currency: string,
  toAddress?: string
): Promise<FeeEstimate> {
  const params = new URLSearchParams({
    amount,
    currency,
    ...(toAddress && { toAddress })
  });
  
  return apiFetch<FeeEstimate>(`/api/transactions/estimate-fee?${params}`);
}

/**
 * Create a send transaction (requires NFC authorization)
 */
export async function createSendTransaction(
  data: SendTransactionRequest
): Promise<SendTransactionResponse> {
  return apiFetch<SendTransactionResponse>('/api/transactions/send/create', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Execute a send transaction after NFC authorization
 */
export async function executeSendTransaction(
  data: ExecuteSendRequest
): Promise<ExecuteSendResponse> {
  return apiFetch<ExecuteSendResponse>('/api/transactions/send/execute', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// ==========================================
// SWAP FUNCTIONS
// ==========================================

/**
 * Get a swap quote with market rates
 */
export async function getSwapQuote(
  fromToken: string,
  toToken: string,
  fromAmount: string
): Promise<SwapQuote> {
  const params = new URLSearchParams({
    fromToken,
    toToken,
    fromAmount
  });
  
  return apiFetch<SwapQuote>(`/api/transactions/swap/quote?${params}`);
}

/**
 * Create a swap transaction (requires NFC authorization)
 */
export async function createSwapTransaction(
  data: SwapTransactionRequest
): Promise<SwapTransactionResponse> {
  return apiFetch<SwapTransactionResponse>('/api/transactions/swap/create', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Execute a swap transaction after NFC authorization
 */
export async function executeSwapTransaction(
  data: ExecuteSwapRequest
): Promise<ExecuteSwapResponse> {
  return apiFetch<ExecuteSwapResponse>('/api/transactions/swap/execute', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// ==========================================
// RECEIVE FUNCTIONS
// ==========================================

/**
 * Generate QR code for receiving crypto
 */
export async function generateReceiveQRCode(
  walletId: string,
  amount?: string
): Promise<QRCodeResponse> {
  const params = new URLSearchParams();
  if (amount) {
    params.append('amount', amount);
  }
  
  const queryString = params.toString();
  const path = `/api/transactions/receive/qr/${walletId}${queryString ? `?${queryString}` : ''}`;
  
  return apiFetch<QRCodeResponse>(path);
}

// ==========================================
// HISTORY FUNCTIONS
// ==========================================

/**
 * Get user's transaction history
 */
export async function getTransactionHistory(
  options: {
    page?: number;
    limit?: number;
    type?: 'send' | 'receive' | 'swap' | 'buy' | 'sell';
    currency?: string;
    status?: string;
  } = {}
): Promise<TransactionHistoryResponse> {
  const params = new URLSearchParams();
  
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.type) params.append('type', options.type);
  if (options.currency) params.append('currency', options.currency);
  if (options.status) params.append('status', options.status);
  
  const queryString = params.toString();
  const path = `/api/transactions/history${queryString ? `?${queryString}` : ''}`;
  
  return apiFetch<TransactionHistoryResponse>(path);
}

/**
 * Get a specific transaction by ID
 */
export async function getTransaction(
  transactionId: string
): Promise<{
  success: boolean;
  transaction: TransactionHistoryResponse['transactions'][0];
}> {
  return apiFetch(`/api/transactions/${transactionId}`);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format currency amount for display
 */
export function formatCryptoAmount(amount: string | number, decimals: number = 8): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Format USD amount for display
 */
export function formatUsdAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
}

/**
 * Get transaction status color for UI
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-500';
    case 'pending':
    case 'nfc_required':
      return 'text-yellow-500';
    case 'processing':
      return 'text-blue-500';
    case 'failed':
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get transaction status badge variant
 */
export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'completed':
      return 'default';
    case 'pending':
    case 'nfc_required':
    case 'processing':
      return 'secondary';
    case 'failed':
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}
