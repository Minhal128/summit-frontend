"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeftRight,
  RefreshCw,
  Settings,
  ChevronDown,
  ArrowDown,
  Zap,
  Info,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getDexQuote,
  executeDexSwap,
  getDexTokens,
  type DexToken,
  type SwapQuote,
} from "@/lib/exchangeApi"
type DexQuote = SwapQuote

const DEFAULT_TOKENS: DexToken[] = [
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
  { symbol: "USDC", name: "USD Coin", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
  { symbol: "USDT", name: "Tether", address: "0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", decimals: 8 },
  { symbol: "DAI", name: "Dai", address: "0x6b175474e89094c44da98b954eedeac495271d0f", decimals: 18 },
  { symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", decimals: 18 },
  { symbol: "LINK", name: "Chainlink", address: "0x514910771af9ca656af840dff83e8264ecf986ca", decimals: 18 },
]

const TOKEN_COLORS: Record<string, string> = {
  ETH: "bg-purple-500",
  USDC: "bg-blue-500",
  USDT: "bg-green-500",
  WBTC: "bg-orange-500",
  DAI: "bg-yellow-500",
  UNI: "bg-pink-500",
  LINK: "bg-blue-600",
}

export default function DexSwapPage({ className }: { className?: string }) {
  const [tokens, setTokens] = useState<DexToken[]>(DEFAULT_TOKENS)
  const [fromToken, setFromToken] = useState<DexToken>(DEFAULT_TOKENS[0])
  const [toToken, setToToken] = useState<DexToken>(DEFAULT_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [quote, setQuote] = useState<DexQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [showFromTokens, setShowFromTokens] = useState(false)
  const [showToTokens, setShowToTokens] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadTokens()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        fetchQuote()
      } else {
        setToAmount("")
        setQuote(null)
      }
    }, 500)
    return () => clearTimeout(debounce)
  }, [fromAmount, fromToken, toToken])

  const loadTokens = async () => {
    try {
      const response = await getDexTokens()
      if (response.tokens?.length > 0) {
        setTokens(response.tokens)
      }
    } catch (error) {
      console.error("Failed to load tokens:", error)
    }
  }

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const response = await getDexQuote(
        fromToken.address,
        toToken.address,
        parseFloat(fromAmount)
      )
      setQuote(response.quote)
      setToAmount(response.quote.toAmount?.toString() || "")
    } catch (error) {
      console.error("Failed to get quote:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!quote || !fromAmount) return

    setSwapping(true)
    try {
      await executeDexSwap(
        {
          fromToken: fromToken.address,
          toToken: toToken.address,
          amount: parseFloat(fromAmount),
          slippageTolerance: slippage,
          walletAddress: "", // TODO: Add user's wallet address
          privateKey: "", // TODO: Add user's private key securely
        },
        "" // TODO: Add NFC authorization token
      )
      // Reset form on success
      setFromAmount("")
      setToAmount("")
      setQuote(null)
    } catch (error) {
      console.error("Swap failed:", error)
    } finally {
      setSwapping(false)
    }
  }

  const switchTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const TokenSelector = ({ 
    selected, 
    onSelect, 
    show, 
    onClose 
  }: { 
    selected: DexToken; 
    onSelect: (token: DexToken) => void; 
    show: boolean;
    onClose: () => void;
  }) => (
    show ? (
      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 max-h-64 overflow-y-auto">
        {tokens.filter(t => t.symbol !== selected.symbol).map((token) => (
          <button
            key={token.symbol}
            onClick={() => {
              onSelect(token)
              onClose()
            }}
            className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors"
          >
            <div className={`w-8 h-8 ${TOKEN_COLORS[token.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
              {token.symbol.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-white font-medium">{token.symbol}</p>
              <p className="text-gray-400 text-xs">{token.name}</p>
            </div>
          </button>
        ))}
      </div>
    ) : null
  )

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <ArrowLeftRight className="w-8 h-8 text-blue-400" />
          DEX Swap
        </h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Zap className="w-4 h-4 text-yellow-400" />
          Powered by Uniswap V3
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Swap</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6 p-4 bg-slate-800 rounded-xl">
              <p className="text-gray-400 text-sm mb-3">Slippage Tolerance</p>
              <div className="flex gap-2">
                {[0.1, 0.5, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      slippage === s
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}%
                  </button>
                ))}
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                    className="bg-slate-700 border-slate-600 text-white text-right pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
            </div>
          )}

          {/* From Token */}
          <div className="relative mb-2">
            <label className="block text-gray-400 text-sm mb-2">You pay</label>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent border-0 text-white text-2xl font-bold p-0 focus:ring-0 w-1/2"
                />
                <button
                  onClick={() => setShowFromTokens(!showFromTokens)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                >
                  <div className={`w-6 h-6 ${TOKEN_COLORS[fromToken.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                    {fromToken.symbol.charAt(0)}
                  </div>
                  <span className="text-white font-medium">{fromToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Balance: 0.00 {fromToken.symbol}
              </p>
            </div>
            <TokenSelector
              selected={fromToken}
              onSelect={(token) => {
                setFromToken(token)
                setFromAmount("")
                setToAmount("")
              }}
              show={showFromTokens}
              onClose={() => setShowFromTokens(false)}
            />
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={switchTokens}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl border-4 border-[#1E293B] transition-all hover:rotate-180"
            >
              <ArrowDown className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* To Token */}
          <div className="relative mt-2">
            <label className="block text-gray-400 text-sm mb-2">You receive</label>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-1/2">
                  {loading ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {toAmount || "0.0"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowToTokens(!showToTokens)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                >
                  <div className={`w-6 h-6 ${TOKEN_COLORS[toToken.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                    {toToken.symbol.charAt(0)}
                  </div>
                  <span className="text-white font-medium">{toToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Balance: 0.00 {toToken.symbol}
              </p>
            </div>
            <TokenSelector
              selected={toToken}
              onSelect={(token) => {
                setToToken(token)
                setToAmount("")
              }}
              show={showToTokens}
              onClose={() => setShowToTokens(false)}
            />
          </div>

          {/* Quote Details */}
          {quote && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">
                  1 {fromToken.symbol} = {quote.exchangeRate?.toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Price Impact</span>
                <span className={`${(quote.priceImpact || 0) > 3 ? "text-red-400" : "text-green-400"}`}>
                  {quote.priceImpact?.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Est. Gas</span>
                <span className="text-white">{quote.estimatedGas} units</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Route</span>
                <span className="text-white">{quote.route || "Direct"}</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!quote || swapping || !fromAmount}
            className="w-full mt-6 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
          >
            {swapping ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Swapping...
              </>
            ) : !fromAmount ? (
              "Enter an amount"
            ) : loading ? (
              "Fetching quote..."
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Swap
              </>
            )}
          </Button>

          {/* Info */}
          <div className="mt-4 flex items-start gap-2 text-gray-400 text-xs">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Swaps are executed on Uniswap V3. Make sure you have enough ETH for gas fees.
              Slippage tolerance: {slippage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
