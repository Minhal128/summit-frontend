"use client"

import { Search, RefreshCw, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface LiveMarketPageProps {
  className?: string
}

interface MarketCoin {
  id: number
  symbol: string
  name: string
  pair: string
  price: number
  priceFormatted: string
  marketCap: number
  marketCapFormatted: string
  change24h: number
  changeFormatted: string
  isPositive: boolean
  volume24h: number
  msRate: number
  lastUpdated: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

// Format large numbers (market cap, volume)
function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

// Format price based on value
function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (price >= 1) return `$${price.toFixed(2)}`
  return `$${price.toFixed(6)}`
}

// Get icon colors based on symbol
function getIconColor(symbol: string): string {
  const colors: Record<string, string> = {
    BTC: "bg-orange-500",
    ETH: "bg-purple-500",
    SOL: "bg-gradient-to-r from-purple-500 to-teal-400",
    TRX: "bg-red-500",
    USDT: "bg-green-500",
    BNB: "bg-yellow-500",
    XRP: "bg-gray-600",
    ADA: "bg-blue-600",
    DOGE: "bg-yellow-400",
    MATIC: "bg-purple-600",
    DOT: "bg-pink-500",
    AVAX: "bg-red-600",
    LINK: "bg-blue-500",
    UNI: "bg-pink-400",
    LTC: "bg-gray-400",
  }
  return colors[symbol] || "bg-blue-500"
}

const MiniChart = ({ isPositive, change }: { isPositive: boolean; change: number }) => {
  const color = isPositive ? "#10B981" : "#EF4444"
  // Generate a simple chart path based on change magnitude
  const magnitude = Math.min(Math.abs(change) * 2, 15)
  const midY = isPositive ? 20 - magnitude : 12 + magnitude
  
  return (
    <div className="w-16 h-8">
      <svg width="64" height="32" viewBox="0 0 64 32" className="overflow-visible">
        <path
          d={`M2,${isPositive ? 22 : 10} Q16,${midY} 32,16 T62,${isPositive ? 10 : 22}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
        <circle cx="32" cy="16" r="1.5" fill={color} />
        <circle cx="62" cy={isPositive ? 10 : 22} r="1.5" fill={color} />
      </svg>
    </div>
  )
}

export default function LiveMarketPage({ className }: LiveMarketPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [marketData, setMarketData] = useState<MarketCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchMarketData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true)
      else setLoading(true)
      
      const response = await fetch(`${API_BASE}/api/market/rates`)
      const result = await response.json()
      
      if (result.status === 'success' && result.data) {
        const formattedData: MarketCoin[] = result.data.map((coin: any, index: number) => ({
          id: index + 1,
          symbol: coin.symbol,
          name: coin.name,
          pair: `${coin.symbol}/USDT`,
          price: coin.marketRate || 0,
          priceFormatted: formatPrice(coin.marketRate || 0),
          marketCap: coin.marketCap || 0,
          marketCapFormatted: formatLargeNumber(coin.marketCap || 0),
          change24h: coin.change24h || 0,
          changeFormatted: coin.change24hFormatted || '+0.00%',
          isPositive: coin.isPositive ?? (coin.change24h >= 0),
          volume24h: coin.volume24h || 0,
          msRate: coin.msRate || 0,
          lastUpdated: coin.lastUpdated || new Date().toISOString(),
        }))
        
        setMarketData(formattedData)
        setLastRefresh(new Date())
        setError(null)
      } else {
        throw new Error(result.message || 'Failed to fetch market data')
      }
    } catch (err: any) {
      console.error('Market data fetch error:', err)
      setError(err.message || 'Failed to load market data')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(() => fetchMarketData(true), 30000)
    return () => clearInterval(interval)
  }, [fetchMarketData])

  const filteredMarketData = marketData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.pair.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={`bg-[#1E293B] rounded-2xl p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl text-white font-bold">Live Market</h2>
          {lastRefresh && (
            <span className="text-xs text-gray-400">
              Updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={() => fetchMarketData(true)}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg">
            Send & Receive
          </button>
          <button className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg">
            Buy & Sell
          </button>
          <button className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg">
            Stake
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Coins"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-white placeholder:text-gray-400"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-400">Loading market data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button 
            onClick={() => fetchMarketData()}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Coin</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">Price (USD)</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">MS Rate</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">Market Cap</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">24h Change</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3 pl-4">Chart</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarketData.map((coin) => (
                <tr key={coin.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${getIconColor(coin.symbol)}`}
                      >
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{coin.name}</p>
                        <p className="text-xs text-gray-400">{coin.pair}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right text-white text-sm font-medium">{coin.priceFormatted}</td>
                  <td className="py-4 text-right text-blue-400 text-sm font-medium">{formatPrice(coin.msRate)}</td>
                  <td className="py-4 text-right text-white text-sm">{coin.marketCapFormatted}</td>
                  <td className="py-4 text-right">
                    <span className={`text-sm font-medium ${coin.isPositive ? "text-green-400" : "text-red-400"}`}>
                      {coin.changeFormatted}
                    </span>
                  </td>
                  <td className="py-4 pl-4">
                    <MiniChart isPositive={coin.isPositive} change={coin.change24h} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMarketData.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No coins found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
      
      {/* Live indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Live data from CoinGecko API • Auto-refreshes every 30 seconds
      </div>
    </div>
  )
}
