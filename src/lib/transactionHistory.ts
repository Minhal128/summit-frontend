/**
 * Transaction History API
 * Fetches real transaction data from the backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap' | 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'lending'
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'completed'
  fromCurrency: string
  toCurrency?: string
  fromAddress?: string
  toAddress?: string
  amount: number
  amountUSD?: number
  receivedAmount?: number
  fee: number
  feeUSD?: number
  txHash?: string
  blockNumber?: number
  confirmations?: number
  network?: string
  createdAt: string
  confirmedAt?: string
}

export interface TransactionHistoryResponse {
  success: boolean
  transactions: Transaction[]
  total: number
  page: number
  limit: number
}

// Etherscan/blockchain explorer URLs
const EXPLORER_URLS: Record<string, string> = {
  ETH: 'https://sepolia.etherscan.io/tx/',
  BTC: 'https://mempool.space/testnet/tx/',
  TRX: 'https://nile.tronscan.org/#/transaction/',
  SOL: 'https://explorer.solana.com/tx/',
  USDT: 'https://sepolia.etherscan.io/tx/', // ERC-20 USDT
}

export function getExplorerUrl(txHash: string, currency: string): string {
  const baseUrl = EXPLORER_URLS[currency.toUpperCase()] || EXPLORER_URLS.ETH
  return `${baseUrl}${txHash}`
}

export async function getTransactionHistory(
  options: {
    page?: number
    limit?: number
    type?: string
    status?: string
    currency?: string
  } = {}
): Promise<TransactionHistoryResponse> {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
  
  if (!token) {
    console.warn('[Activity] No auth token found in localStorage')
    return { success: false, transactions: [], total: 0, page: 1, limit: 10 }
  }

  const params = new URLSearchParams()
  if (options.page) params.append('page', options.page.toString())
  if (options.limit) params.append('limit', options.limit.toString())
  if (options.type) params.append('type', options.type)
  if (options.status) params.append('status', options.status)
  if (options.currency) params.append('currency', options.currency)

  const url = `${API_BASE}/api/transactions/history?${params}`
  console.log('[Activity] Fetching transactions from:', url)

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('[Activity] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Activity] HTTP error:', response.status, errorText)
      throw new Error(`Failed to fetch transactions: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('[Activity] API response:', data)
    
    if (data.success) {
      const transactions = data.transactions || data.data?.transactions || []
      const total = data.pagination?.total ?? data.total ?? data.data?.total ?? 0
      console.log(`[Activity] Loaded ${transactions.length} transactions (total: ${total})`)
      return {
        success: true,
        transactions,
        total,
        page: data.pagination?.page ?? data.page ?? 1,
        limit: data.pagination?.limit ?? data.limit ?? 10
      }
    }
    
    console.warn('[Activity] API returned success: false', data)
    return { success: false, transactions: [], total: 0, page: 1, limit: 10 }
  } catch (error) {
    console.error('[Activity] Transaction history error:', error)
    return { success: false, transactions: [], total: 0, page: 1, limit: 10 }
  }
}

export function formatAmount(amount: number | undefined, currency?: string): string {
  if (amount === undefined || amount === null) return '0.00'
  if (currency === 'USD') return `$${amount.toFixed(2)}`
  if (['USDT', 'USDC'].includes(currency?.toUpperCase() || '')) return `$${amount.toFixed(2)}`
  return `${amount.toFixed(8)} ${currency || ''}`
}

export function formatTransactionDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
  return date.toLocaleString('en-US', options).replace(',', ' |')
}

