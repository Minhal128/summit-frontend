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

interface WalletContextType {
  balances: WalletBalance[]
  totalValueUSD: number
  totalValueFormatted: string
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refreshBalances: () => Promise<void>
  isAuthenticated: boolean
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

function formatAmount(amount: number, symbol: string): string {
  if (amount === 0) return `0 ${symbol}`
  if (amount < 0.00001) return `<0.00001 ${symbol}`
  if (amount < 1) return `${amount.toFixed(6)} ${symbol}`
  if (amount < 1000) return `${amount.toFixed(4)} ${symbol}`
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${symbol}`
}

function formatUSD(value: number): string {
  if (value === 0) return '$0.00'
  if (value < 0.01) return '<$0.01'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balances, setBalances] = useState<WalletBalance[]>([])
  const [totalValueUSD, setTotalValueUSD] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const refreshBalances = useCallback(async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
      
      if (!token) {
        setIsAuthenticated(false)
        setBalances([])
        setTotalValueUSD(0)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)

      const response = await fetch(`${API_BASE}/api/wallet/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        setIsAuthenticated(false)
        setBalances([])
        setTotalValueUSD(0)
        return
      }

      const result = await response.json()

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
      } else {
        // No wallets yet or API error
        setBalances([])
        setTotalValueUSD(0)
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

  // Listen for auth changes
  useEffect(() => {
    const handleStorageChange = () => {
      refreshBalances()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshBalances])

  return (
    <WalletContext.Provider
      value={{
        balances,
        totalValueUSD,
        totalValueFormatted: formatUSD(totalValueUSD),
        loading,
        error,
        lastUpdated,
        refreshBalances,
        isAuthenticated,
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
