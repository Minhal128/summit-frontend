/**
 * Transaction History API
 * Fetches real transaction data from the backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap' | 'buy' | 'sell'
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
  fromCurrency: string
  toCurrency?: string
  fromAddress: string
  toAddress: string
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
    return { success: false, transactions: [], total: 0, page: 1, limit: 10 }
  }

  const params = new URLSearchParams()
  if (options.page) params.append('page', options.page.toString())
  if (options.limit) params.append('limit', options.limit.toString())
  if (options.type) params.append('type', options.type)
  if (options.status) params.append('status', options.status)
  if (options.currency) params.append('currency', options.currency)

  try {
    const response = await fetch(`${API_BASE}/api/transactions/history?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }

    const data = await response.json()
    
    if (data.success) {
      return {
        success: true,
        transactions: data.transactions || data.data?.transactions || [],
        total: data.total || data.data?.total || 0,
        page: data.page || 1,
        limit: data.limit || 10
      }
    }
    
    return { success: false, transactions: [], total: 0, page: 1, limit: 10 }
  } catch (error) {
    console.error('Transaction history error:', error)
    return { success: false, transactions: [], total: 0, page: 1, limit: 10 }
  }
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

export function formatAmount(amount: number, symbol: string): string {
  if (amount === 0) return `0 ${symbol}`
  if (amount < 0.000001) return `<0.000001 ${symbol}`
  if (amount < 1) return `${amount.toFixed(6)}${symbol}`
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 4 })}${symbol}`
}
