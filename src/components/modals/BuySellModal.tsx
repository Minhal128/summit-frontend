"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Loader2 } from "lucide-react"
import { useState, useMemo } from "react"
import type { Token } from "@/types"
import { useWallet } from "@/contexts/WalletContext"

interface BuySellModalProps {
  isOpen: boolean
  onClose: () => void
  onBuyTokenSelect: (token: Token) => void
  onSellTokenSelect: (token: Token) => void
}

// Default tokens if wallet has no balances
const defaultTokens: Token[] = [
  { symbol: "BTC", name: "Bitcoin", balance: "0 BTC", value: "$0.00", icon: "₿", color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", balance: "0 ETH", value: "$0.00", icon: "Ξ", color: "bg-purple-500" },
  { symbol: "SOL", name: "Solana", balance: "0 SOL", value: "$0.00", icon: "◎", color: "bg-teal-500" },
  { symbol: "TRX", name: "Tron", balance: "0 TRX", value: "$0.00", icon: "T", color: "bg-red-500" },
  { symbol: "USDT", name: "Tether USDT", balance: "0 USDT", value: "$0.00", icon: "₮", color: "bg-green-500" },
]

const tokenIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  SOL: "◎",
  TRX: "T",
  USDT: "₮",
  USDC: "$",
  BNB: "B",
}

export default function BuySellModal({ isOpen, onClose, onBuyTokenSelect, onSellTokenSelect }: BuySellModalProps) {
  const [activeTab, setActiveTab] = useState<"Buy" | "Sell">("Buy")
  const [searchQuery, setSearchQuery] = useState("")
  const [sellError, setSellError] = useState<string | null>(null)
  const { balances, loading } = useWallet()

  // Convert wallet balances to token format
  const tokens: Token[] = useMemo(() => {
    if (balances.length === 0) return defaultTokens
    
    return balances.map(b => ({
      symbol: b.symbol,
      name: b.name,
      balance: b.amountFormatted,
      value: b.valueFormatted,
      icon: tokenIcons[b.symbol] || b.symbol.charAt(0),
      color: b.color
    }))
  }, [balances])

  // Filter tokens by search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens
    const query = searchQuery.toLowerCase()
    return tokens.filter(t => 
      t.symbol.toLowerCase().includes(query) || 
      t.name.toLowerCase().includes(query)
    )
  }, [tokens, searchQuery])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold">Buy & Sell</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex border-b border-slate-600">
            <button
              onClick={() => setActiveTab("Buy")}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "Buy" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab("Sell")}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "Sell" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search Coins"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0F172A] border-slate-700 text-white pl-10 placeholder:text-gray-500"
            />
          </div>

          {sellError && (
            <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {sellError}
            </div>
          )}

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            ) : filteredTokens.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No tokens found</p>
            ) : (
              filteredTokens.map((token) => (
                <div
                  key={token.symbol}
                  className={`flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors ${
                    activeTab === "Sell" && parseFloat(token.balance || '0') === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (activeTab === "Buy") {
                      setSellError(null)
                      onBuyTokenSelect(token)
                    } else {
                      // Check if user has balance to sell
                      const balanceStr = token.balance?.split(' ')[0] || '0'
                      const balance = parseFloat(balanceStr)
                      if (balance <= 0) {
                        setSellError(`You don't have any ${token.symbol} to sell`)
                        return
                      }
                      setSellError(null)
                      onSellTokenSelect(token)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${token.color} rounded-full flex items-center justify-center font-bold text-white text-lg`}
                    >
                      {token.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-sm text-gray-400">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{token.balance}</p>
                    <p className="text-xs text-gray-400">{token.value}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
