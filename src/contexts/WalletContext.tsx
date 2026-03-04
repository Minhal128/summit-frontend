"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

interface WalletBalance {
  symbol: string
  name: string
  amount: number
  amountFormatted: string
  valueUSD: number
  valueFormatted: string
  addresses: string[]
  icon: string
  color: string
}

interface WalletAddresses {
  ETH?: string
  BTC?: string
  SOL?: string
  TRX?: string
  [key: string]: string | undefined
}

interface WalletContextType {
  balances: WalletBalance[]
  totalValueUSD: number
  totalValueFormatted: string
  usdBalance: number
  usdBalanceFormatted: string
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refreshBalances: () => Promise<void>
  isAuthenticated: boolean
  walletAddresses: WalletAddresses
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Icon colors for different cryptocurrencies
const CRYPTO_COLORS: Record<string, { icon: string; color: string }> = {
  BTC: { icon: 'B', color: 'bg-orange-500' },
  ETH: { icon: 'E', color: 'bg-purple-500' },
  SOL: { icon: 'S', color: 'bg-teal-500' },
  TRX: { icon: 'T', color: 'bg-red-500' },
  USDT: { icon: 'U', color: 'bg-green-500' },
  BNB: { icon: 'B', color: 'bg-yellow-500' },
  XRP: { icon: 'X', color: 'bg-gray-600' },
  ADA: { icon: 'A', color: 'bg-blue-600' },
  DOGE: { icon: 'D', color: 'bg-yellow-400' },
  MATIC: { icon: 'M', color: 'bg-purple-600' },
  DOT: { icon: 'D', color: 'bg-pink-500' },
  AVAX: { icon: 'A', color: 'bg-red-600' },
  LINK: { icon: 'L', color: 'bg-blue-500' },
  UNI: { icon: 'U', color: 'bg-pink-400' },
  LTC: { icon: 'L', color: 'bg-gray-400' },
}

function formatAmount(amount: unknown, symbol: string): string {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0
  if (num === 0) return `0 ${symbol}`
  if (num < 0.00001) return `<0.00001 ${symbol}`
  if (num < 1) return `${num.toFixed(6)} ${symbol}`
  if (num < 1000) return `${num.toFixed(4)} ${symbol}`
  return `${num.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${symbol}`
}

function formatUSD(value: number): string {
  if (value === 0) return '$0.00'
  if (value < 0.01) return '<$0.01'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balances, setBalances] = useState<WalletBalance[]>([])
  const [totalValueUSD, setTotalValueUSD] = useState(0)
  const [usdBalance, setUsdBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddresses, setWalletAddresses] = useState<WalletAddresses>({})

  // Helper to fetch wallet addresses from NFC endpoint
  const fetchWalletAddresses = async (token: string) => {
    try {
      const cardId = localStorage.getItem('nfc_card_id')
      if (!cardId) {
        console.log('No nfc_card_id found in localStorage')
        return
      }

      console.log('Fetching wallet addresses for cardId:', cardId)
      const response = await fetch(`${API_BASE}/api/nfc/transactions/receive/all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardUid: cardId })
      })

      const result = await response.json()
      console.log('Wallet addresses response:', result)
      
      // Handle both response formats: {success: true} or {status: 'success'}
      if ((result.success || result.status === 'success') && result.wallets) {
        const addresses: WalletAddresses = {}
        result.wallets.forEach((w: any) => {
          if (w.cryptocurrency && w.address) {
            // Map cryptocurrency to uppercase symbol
            const symbol = w.cryptocurrency.toUpperCase()
            addresses[symbol] = w.address
          }
        })
        console.log('Parsed wallet addresses:', addresses)
        if (Object.keys(addresses).length > 0) {
          setWalletAddresses(addresses)
        }
      }
    } catch (err) {
      console.error('Failed to fetch wallet addresses:', err)
    }
  }

  const refreshBalances = useCallback(async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
      
      if (!token) {
        setIsAuthenticated(false)
        setBalances([])
        setTotalValueUSD(0)
        setUsdBalance(0)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)

      // Fetch both wallet balance and USD balance in parallel
      const [walletResponse, usdResponse] = await Promise.all([
        fetch(`${API_BASE}/api/wallet/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE}/api/deposit/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => null) // Don't fail if deposit endpoint doesn't exist
      ])

      if (walletResponse.status === 401) {
        setIsAuthenticated(false)
        setBalances([])
        setTotalValueUSD(0)
        setUsdBalance(0)
        return
      }

      const result = await walletResponse.json()
      
      // Parse USD balance
      if (usdResponse && usdResponse.ok) {
        const usdResult = await usdResponse.json()
        if (usdResult.status === 'success' && usdResult.data) {
          setUsdBalance(usdResult.data.usdBalance || 0)
        }
      }

      if (result.status === 'success' && result.balances) {
        const formattedBalances: WalletBalance[] = result.balances.map((b: any) => {
          const cryptoInfo = CRYPTO_COLORS[b.symbol] || { icon: b.symbol.charAt(0), color: 'bg-blue-500' }
          return {
            symbol: b.symbol,
            name: b.currency || b.symbol,
            amount: b.amount || 0,
            amountFormatted: formatAmount(b.amount || 0, b.symbol),
            valueUSD: b.valueUSD || 0,
            valueFormatted: formatUSD(b.valueUSD || 0),
            addresses: b.addresses || [],
            icon: cryptoInfo.icon,
            color: cryptoInfo.color,
          }
        })

        setBalances(formattedBalances)
        setTotalValueUSD(result.totalValueUSD || 0)
        setLastUpdated(new Date())
        setError(null)
        
        // Build wallet addresses map from general balance endpoint
        const addresses: WalletAddresses = {}
        formattedBalances.forEach((b) => {
          if (b.addresses && b.addresses.length > 0) {
            addresses[b.symbol] = b.addresses[0]
          }
        })
        
        // If no addresses from balance endpoint, or if NFC card exists, fetch from NFC endpoint
        if (Object.keys(addresses).length === 0 || localStorage.getItem('nfc_card_id')) {
          await fetchWalletAddresses(token)
        } else {
          setWalletAddresses(addresses)
        }
      } else {
        // No wallets yet or API error - try to fetch addresses from NFC endpoint
        setBalances([])
        setTotalValueUSD(0)
        await fetchWalletAddresses(token)
      }
    } catch (err: any) {
      console.error('Wallet fetch error:', err)
      setError(err.message || 'Failed to load wallet data')
      setBalances([])
      setTotalValueUSD(0)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch and auto-refresh
  useEffect(() => {
    refreshBalances()
    const interval = setInterval(refreshBalances, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [refreshBalances])

  // Listen for auth changes (cross-tab and same-tab)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshBalances()
    }
    // Cross-tab storage events
    window.addEventListener('storage', handleStorageChange)
    // Same-tab custom event (dispatched by NFC login/linkCard)
    window.addEventListener('auth-changed', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-changed', handleStorageChange)
    }
  }, [refreshBalances])

  return (
    <WalletContext.Provider
      value={{
        balances,
        totalValueUSD: totalValueUSD + usdBalance,
        totalValueFormatted: formatUSD(totalValueUSD + usdBalance),
        usdBalance,
        usdBalanceFormatted: formatUSD(usdBalance),
        loading,
        error,
        lastUpdated,
        refreshBalances,
        isAuthenticated,
        walletAddresses,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export default WalletContext
