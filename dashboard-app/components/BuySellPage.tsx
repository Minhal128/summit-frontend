"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  ArrowUpDown,
  DollarSign,
  RefreshCw,
  Check,
  ExternalLink,
  Shield,
  Zap,
  Globe,
  AlertCircle,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getProviderQuotes,
  createProviderOrder,
  type ProviderQuote,
} from "@/lib/exchangeApi"
import { useWallet } from "@/contexts/WalletContext"

const PROVIDERS = [
  { id: "mercuryo", name: "Mercuryo", icon: "💳", color: "from-blue-500 to-blue-600" },
  { id: "moonpay", name: "MoonPay", icon: "🌙", color: "from-purple-500 to-purple-600" },
  { id: "transak", name: "Transak", icon: "🔄", color: "from-green-500 to-green-600" },
  { id: "simplex", name: "Simplex", icon: "💎", color: "from-orange-500 to-orange-600" },
  { id: "coinbase", name: "Coinbase Pay", icon: "🪙", color: "from-blue-600 to-blue-700" },
]

const CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "bg-purple-500" },
  { symbol: "USDT", name: "Tether", icon: "$", color: "bg-green-500" },
  { symbol: "SOL", name: "Solana", icon: "◎", color: "bg-gradient-to-r from-purple-500 to-green-400" },
  { symbol: "BNB", name: "BNB", icon: "B", color: "bg-yellow-500" },
]

export default function BuySellPage({ className }: { className?: string }) {
  const { balances, isAuthenticated, loading: walletLoading } = useWallet()
  const [mode, setMode] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOS[0])
  const [quotes, setQuotes] = useState<ProviderQuote[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [orderLoading, setOrderLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user's balance for selected crypto
  const getUserBalance = (symbol: string): number => {
    const balance = balances.find(b => b.symbol === symbol)
    return balance?.amount || 0
  }

  const userBalance = getUserBalance(selectedCrypto.symbol)
  const hasInsufficientBalance = mode === "sell" && parseFloat(amount || "0") > userBalance

  const fetchQuotes = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    
    // Check for insufficient balance when selling
    if (mode === "sell" && hasInsufficientBalance) {
      setError(`Insufficient ${selectedCrypto.symbol} balance. You have ${(Number(userBalance) || 0).toFixed(6)} ${selectedCrypto.symbol}`)
      setQuotes([])
      return
    }
    
    setError(null)
    setLoading(true)
    try {
      const response = await getProviderQuotes({
        action: mode,
        cryptocurrency: selectedCrypto.symbol,
        amount: parseFloat(amount),
        fiatCurrency: "USD",
        amountType: "fiat"
      })
      setQuotes(response.quotes || [])
    } catch (err: any) {
      console.error("Failed to fetch quotes:", err)
      setError(err.message || "Failed to fetch quotes")
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (amount) fetchQuotes()
    }, 500)
    return () => clearTimeout(debounce)
  }, [amount, selectedCrypto, mode])

  const handleCreateOrder = async (providerId: string) => {
    if (!amount) return
    
    // Check authentication
    if (!isAuthenticated) {
      setError("Please login to create an order")
      return
    }
    
    // Check for insufficient balance when selling
    if (mode === "sell" && hasInsufficientBalance) {
      setError(`Insufficient ${selectedCrypto.symbol} balance. You have ${(Number(userBalance) || 0).toFixed(6)} ${selectedCrypto.symbol}`)
      return
    }
    
    setError(null)
    setSelectedProvider(providerId)
    setOrderLoading(true)
    try {
      const response = await createProviderOrder(providerId, {
        action: mode,
        cryptocurrency: selectedCrypto.symbol,
        fiatCurrency: "USD",
        amount: parseFloat(amount),
        walletAddress: "0x...", // This should come from user's wallet
        returnUrl: window.location.href
      })
      
      if (response.redirectUrl) {
        window.open(response.redirectUrl, "_blank")
      }
    } catch (err: any) {
      console.error("Failed to create order:", err)
      if (err.message?.includes("authorization") || err.message?.includes("token")) {
        setError("Please login to create an order. Scan your NFC card to authenticate.")
      } else {
        setError(err.message || "Failed to create order")
      }
    } finally {
      setOrderLoading(false)
      setSelectedProvider(null)
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-400" />
          Buy & Sell Crypto
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
            {/* Buy/Sell Toggle */}
            <div className="flex p-1 bg-slate-800 rounded-xl mb-6">
              <button
                onClick={() => setMode("buy")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  mode === "buy"
                    ? "bg-green-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setMode("sell")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  mode === "sell"
                    ? "bg-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                {mode === "buy" ? "You pay" : "You sell"}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-white text-2xl font-bold h-16 pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  USD
                </span>
              </div>
            </div>

            {/* Crypto Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                {mode === "buy" ? "You receive" : "You're selling"}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {CRYPTOS.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`p-3 rounded-xl transition-all text-center ${
                      selectedCrypto.symbol === crypto.symbol
                        ? "bg-blue-600 ring-2 ring-blue-400"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className={`w-8 h-8 ${crypto.color} rounded-full flex items-center justify-center mx-auto mb-1 text-white font-bold text-sm`}>
                      {crypto.icon}
                    </div>
                    <span className="text-xs text-white">{crypto.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              {mode === "sell" && (
                <div className="flex items-center justify-between text-sm mb-3 p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">Your {selectedCrypto.symbol} Balance:</span>
                  <span className={`font-semibold ${userBalance > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    {(Number(userBalance) || 0).toFixed(6)} {selectedCrypto.symbol}
                  </span>
                </div>
              )}
              {!isAuthenticated && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Login with NFC card to trade</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Instant</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Best rates compared</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Multiple payment methods</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Provider Quotes */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {quotes.length > 0 ? "Compare Rates" : "Available Providers"}
              </h3>
              {amount && (
                <Button
                  onClick={fetchQuotes}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-gray-400"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : quotes.length > 0 ? (
              <div className="space-y-3">
                {quotes.map((quote, index) => {
                  const provider = PROVIDERS.find(p => p.id === quote.providerId)
                  const isBest = index === 0
                  
                  return (
                    <div
                      key={quote.providerId}
                      className={`p-4 rounded-xl border transition-all ${
                        isBest
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50"
                          : "bg-slate-800 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${provider?.color || "from-gray-500 to-gray-600"} rounded-xl flex items-center justify-center text-2xl`}>
                            {provider?.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">
                                {quote.providerName || provider?.name || quote.providerId}
                              </span>
                              {isBest && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                  Best Rate
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">
                              Fee: ${(Number(quote.totalFees) || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">
                            {(Number(quote.cryptoAmount) || 0).toFixed(6)} {selectedCrypto.symbol}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Rate: ${quote.exchangeRate?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCreateOrder(quote.providerId)}
                        disabled={orderLoading && selectedProvider === quote.providerId}
                        className={`w-full mt-4 ${
                          isBest
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-700 hover:bg-slate-600"
                        } text-white`}
                      >
                        {orderLoading && selectedProvider === quote.providerId ? (
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <ExternalLink className="w-4 h-4 mr-2" />
                        )}
                        {mode === "buy" ? "Buy Now" : "Sell Now"}
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {PROVIDERS.map((provider) => (
                  <div
                    key={provider.id}
                    className="p-4 rounded-xl bg-slate-800 border border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${provider.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {provider.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-semibold">{provider.name}</span>
                        <p className="text-gray-400 text-sm">Enter an amount to see rates</p>
                      </div>
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
