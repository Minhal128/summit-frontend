/**
 * Exchange API Service - Complete API integration for Summit Crypto Exchange
 * Integrates with market data, wallets, DEX, P2P, providers, and admin endpoints
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app';

interface ApiResponse<T = any> {
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
}

/**
 * Helper function for API calls
 */
async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  // Attach Authorization header if token exists
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') || localStorage.getItem('nfc_token') 
    : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
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
// MARKET DATA API
// ==========================================

export interface MarketRate {
  symbol: string;
  currency: string;
  marketRate: number;
  msRate: number;
  change24h: string;
  priceChangePercentage24h: number;
}

export async function getMarketRates(): Promise<{ data: MarketRate[] }> {
  return apiFetch('/api/market/rates');
}

export async function getCryptoRate(symbol: string, fiatCurrency = 'usd'): Promise<any> {
  return apiFetch(`/api/market/rate/${symbol}?fiatCurrency=${fiatCurrency}`);
}

export async function getPriceHistory(symbol: string, days = 7, fiatCurrency = 'usd'): Promise<any> {
  return apiFetch(`/api/market/history/${symbol}?days=${days}&fiatCurrency=${fiatCurrency}`);
}

// ==========================================
// FEE API
// ==========================================

export interface FeeTier {
  tier: string;
  name: string;
  tradingFeePercent: number;
  withdrawalFeePercent: number;
  depositFeePercent: number;
}

export async function getFeeTiers(): Promise<{ data: FeeTier[] }> {
  return apiFetch('/api/fees/tiers');
}

export async function calculateFee(params: {
  amount: number;
  type: 'send' | 'swap' | 'buy' | 'sell';
  cryptocurrency: string;
  cardTier?: string;
}): Promise<any> {
  const queryParams = new URLSearchParams({
    amount: params.amount.toString(),
    type: params.type,
    cryptocurrency: params.cryptocurrency,
    ...(params.cardTier && { cardTier: params.cardTier }),
  });
  return apiFetch(`/api/fees/calculate?${queryParams}`);
}

// ==========================================
// WALLET API
// ==========================================

export interface Wallet {
  currency: string;
  symbol: string;
  amount: number;
  valueUSD: number;
  addresses?: string[];
}

export async function generateWallet(currency: string, cardId = 'default_card'): Promise<any> {
  return apiFetch('/api/wallet/generate', {
    method: 'POST',
    body: JSON.stringify({ currency, cardId }),
  });
}

export async function getWalletAddresses(cardId = 'default_card'): Promise<any> {
  return apiFetch(`/api/wallet/address?cardId=${cardId}`);
}

export async function getWalletBalance(cardId = 'default_card'): Promise<{ 
  totalValueUSD: number; 
  balances: Wallet[];
  lastUpdated: string;
}> {
  return apiFetch(`/api/wallet/balance?cardId=${cardId}`);
}

// ==========================================
// TRANSACTIONS API
// ==========================================

export interface SendTransactionParams {
  fromAddress: string;
  to: string;
  amount: number;
  currency: string;
  privateKey?: string;
}

export async function sendTransaction(params: SendTransactionParams, nfcScan = true): Promise<any> {
  return apiFetch('/api/transactions/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-nfc-scan': nfcScan ? 'true' : 'false',
    },
    body: JSON.stringify(params),
  });
}

export interface SwapParams {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
}

export async function swapTransaction(params: SwapParams, nfcScan = true): Promise<any> {
  return apiFetch('/api/transactions/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-nfc-scan': nfcScan ? 'true' : 'false',
    },
    body: JSON.stringify(params),
  });
}

// ==========================================
// DEX API
// ==========================================

export interface DexToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  priceImpact: number;
  estimatedGas: string;
  route: string;
}

export async function getDexTokens(): Promise<{ tokens: DexToken[] }> {
  return apiFetch('/api/dex/tokens');
}

export async function getDexPairs(): Promise<{ pairs: string[][] }> {
  return apiFetch('/api/dex/pairs');
}

// DEX Quote response from API
export interface DexQuoteResponse {
  success: boolean;
  fromToken: string;
  toToken: string;
  amountIn: string;
  amountOut: string;
  minAmountOut: string;
  exchangeRate: string;
  slippageTolerance: number;
  fee: string;
  priceImpact: string;
  route: string[];
  estimatedGas: string;
  dex: string;
  network: string;
  timestamp: string;
  isSimulated: boolean;
}

export async function getDexQuote(fromToken: string, toToken: string, amount: number): Promise<DexQuoteResponse> {
  return apiFetch(`/api/dex/quote?fromToken=${fromToken}&toToken=${toToken}&amount=${amount}`);
}

export async function executeDexSwap(params: {
  fromToken: string;
  toToken: string;
  amount: number;
  slippageTolerance?: number;
  walletAddress: string;
  privateKey?: string;
}, nfcAuthorization: string): Promise<any> {
  return apiFetch('/api/dex/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-nfc-authorization': nfcAuthorization,
    },
    body: JSON.stringify(params),
  });
}

// ==========================================
// P2P API
// ==========================================

export interface P2POrder {
  orderId: string;
  type: 'buy' | 'sell';
  cryptocurrency: string;
  fiatCurrency: string;
  amount: number;
  pricePerUnit: number;
  totalPrice: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  paymentMethods: string[];
  status: string;
  createdBy: string;
  createdAt: string;
}

export async function getP2POrderbook(params: {
  type?: 'buy' | 'sell';
  cryptocurrency?: string;
  fiatCurrency?: string;
  paymentMethod?: string;
  page?: number;
  limit?: number;
}): Promise<{ orders: P2POrder[]; total: number }> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  return apiFetch(`/api/p2p/orderbook?${queryParams}`);
}

export async function createP2POrder(params: {
  type: 'buy' | 'sell';
  cryptocurrency: string;
  fiatCurrency: string;
  amount: number;
  pricePerUnit: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  paymentMethods: string[];
}): Promise<{ order: P2POrder }> {
  return apiFetch('/api/p2p/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function matchP2POrder(orderId: string, amount: number, paymentMethod: string): Promise<any> {
  return apiFetch(`/api/p2p/orders/${orderId}/match`, {
    method: 'POST',
    body: JSON.stringify({ amount, paymentMethod }),
  });
}

export async function confirmP2PEscrow(orderId: string, txHash?: string): Promise<any> {
  return apiFetch(`/api/p2p/orders/${orderId}/escrow`, {
    method: 'POST',
    body: JSON.stringify({ txHash }),
  });
}

export async function markP2PPaymentSent(orderId: string, paymentProof?: string): Promise<any> {
  return apiFetch(`/api/p2p/orders/${orderId}/payment-sent`, {
    method: 'POST',
    body: JSON.stringify({ paymentProof }),
  });
}

export async function confirmP2PRelease(orderId: string): Promise<any> {
  return apiFetch(`/api/p2p/orders/${orderId}/confirm-release`, {
    method: 'POST',
  });
}

export async function sendP2PChatMessage(orderId: string, message: string): Promise<any> {
  return apiFetch(`/api/p2p/orders/${orderId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

// ==========================================
// PROVIDERS API (Buy/Sell Fiat)
// ==========================================

export interface Provider {
  id: string;
  name: string;
  description: string;
  supportedCryptos: string[];
  supportedFiat: string[];
  supportsBuy: boolean;
  supportsSell: boolean;
  minAmount: number;
  maxAmount: number;
  fees: { type: string; value: number }[];
  processingTime: string;
  paymentMethods: string[];
}

export interface ProviderQuote {
  providerId: string;
  providerName: string;
  action: string;
  cryptocurrency: string;
  fiatCurrency: string;
  fiatAmount: number;
  cryptoAmount: number;
  exchangeRate: number;
  fees: { type: string; amount: number }[];
  totalFees: number;
  estimatedProcessingTime: string;
}

export async function getAllProviders(): Promise<{ providers: Provider[] }> {
  return apiFetch('/api/providers');
}

export async function getProvidersForAction(action: 'buy' | 'sell', cryptocurrency?: string): Promise<any> {
  const params = cryptocurrency ? `?cryptocurrency=${cryptocurrency}` : '';
  return apiFetch(`/api/providers/for/${action}${params}`);
}

export async function getProviderQuotes(params: {
  action: 'buy' | 'sell';
  cryptocurrency: string;
  fiatCurrency?: string;
  amount: number;
  amountType?: 'fiat' | 'crypto';
}): Promise<{ quotes: ProviderQuote[]; bestQuote: ProviderQuote }> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  return apiFetch(`/api/providers/quotes?${queryParams}`);
}

export async function getProviderKycRequirements(providerId: string): Promise<any> {
  return apiFetch(`/api/providers/${providerId}/kyc`);
}

export async function createProviderOrder(providerId: string, params: {
  action: 'buy' | 'sell';
  cryptocurrency: string;
  fiatCurrency?: string;
  amount: number;
  walletAddress: string;
  paymentMethod?: string;
  returnUrl?: string;
}): Promise<any> {
  return apiFetch(`/api/providers/${providerId}/order`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ==========================================
// ADMIN API
// ==========================================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCards: number;
  activeCards: number;
  totalTransactionVolume: number;
  todayTransactionVolume: number;
  totalWallets: number;
  pendingKyc: number;
}

export interface UserData {
  id: string;
  email: string;
  username?: string;
  phoneNumber?: string;
  createdAt: string;
  lastLogin?: string;
  kycStatus: string;
  cardCount: number;
}

export interface CardData {
  id: string;
  serialNumber: string;
  tier: string;
  status: string;
  userId?: string;
  activatedAt?: string;
  createdAt: string;
}

export interface TransactionAnalytics {
  totalTransactions: number;
  totalVolume: number;
  avgTransactionSize: number;
  transactionsByType: Record<string, number>;
  transactionsByDay: { date: string; count: number; volume: number }[];
}

export async function getAdminDashboard(): Promise<{ stats: DashboardStats }> {
  return apiFetch('/api/admin/dashboard');
}

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
}): Promise<{ users: UserData[]; total: number; page: number; pages: number }> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  return apiFetch(`/api/admin/users?${queryParams}`);
}

export async function getAdminCards(params: {
  page?: number;
  limit?: number;
  tier?: string;
  status?: string;
}): Promise<{ cards: CardData[]; total: number; page: number; pages: number }> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  return apiFetch(`/api/admin/cards?${queryParams}`);
}

export async function getAdminWallets(params: {
  page?: number;
  limit?: number;
  cryptocurrency?: string;
}): Promise<any> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  return apiFetch(`/api/admin/wallets?${queryParams}`);
}

export async function getTransactionAnalytics(startDate?: string, endDate?: string): Promise<{ analytics: TransactionAnalytics }> {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  return apiFetch(`/api/admin/analytics/transactions?${queryParams}`);
}

export async function generateReport(params: {
  reportType: 'users' | 'transactions' | 'revenue' | 'cards';
  startDate: string;
  endDate: string;
  format?: 'json' | 'csv';
}): Promise<any> {
  return apiFetch('/api/admin/reports/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ==========================================
// HEALTH CHECK
// ==========================================

export async function getHealthStatus(): Promise<{
  status: string;
  message: string;
  database: string;
  timestamp: string;
}> {
  return apiFetch('/api/health');
}

export async function getDatabaseStatus(): Promise<any> {
  return apiFetch('/api/db-status');
}
