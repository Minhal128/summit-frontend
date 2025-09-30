"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState } from "react"
import type { Token } from "@/types"

interface BuySellModalProps {
  isOpen: boolean
  onClose: () => void
  onBuyTokenSelect: (token: Token) => void
  onSellTokenSelect: (token: Token) => void
}

const tokens: Token[] = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.003644BTC", value: "$680.67", icon: "₿", color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", balance: "0.3644ETH", value: "$280.00", icon: "Ξ", color: "bg-blue-500" },
  { symbol: "SOL", name: "Solana", balance: "2.5SOL", value: "$150.00", icon: "◎", color: "bg-black" },
  { symbol: "TON", name: "Ton", balance: "10.2TON", value: "$45.00", icon: "💎", color: "bg-blue-600" },
  { symbol: "USDT", name: "Tether USDT", balance: "500USDT", value: "$500.00", icon: "₮", color: "bg-green-500" },
]

export default function BuySellModal({ isOpen, onClose, onBuyTokenSelect, onSellTokenSelect }: BuySellModalProps) {
  const [activeTab, setActiveTab] = useState<"Buy" | "Sell">("Buy")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                activeTab === "Buy" ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab("Sell")}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "Sell" ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"
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

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredTokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors cursor-pointer"
                onClick={() => (activeTab === "Buy" ? onBuyTokenSelect(token) : onSellTokenSelect(token))}
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
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
