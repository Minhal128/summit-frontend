"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState } from "react"
import type { Token } from "@/types"

interface SendReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  onTokenSelect: (token: Token, action: "send" | "receive") => void
}

const tokens: Token[] = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.003644BTC", value: "$680.67", icon: "₿", color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", balance: "0.3644ETH", value: "$280.00", icon: "Ξ", color: "bg-blue-500" },
  { symbol: "SOL", name: "Solana", balance: "2.5SOL", value: "$150.00", icon: "◎", color: "bg-purple-500" },
  { symbol: "TON", name: "Ton", balance: "10.5TON", value: "$45.00", icon: "💎", color: "bg-blue-600" },
  { symbol: "USDT", name: "Tether USDT", balance: "500USDT", value: "$500.00", icon: "₮", color: "bg-green-500" },
]

export default function SendReceiveModal({ isOpen, onClose, onTokenSelect }: SendReceiveModalProps) {
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Send & Receive</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6">
          <div className="flex border-b border-slate-600 mb-6">
            <button
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "send" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("send")}
            >
              Send
            </button>
            <button
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "receive" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("receive")}
            >
              Receive
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search Tokens"
              className="bg-[#0F172A] border-slate-600 text-white pl-10 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="px-6 pb-6 space-y-2 max-h-80 overflow-y-auto">
          {tokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center gap-3 p-3 hover:bg-slate-700/20 rounded-xl transition-colors cursor-pointer"
              onClick={() => onTokenSelect(token, activeTab)}
            >
              <div
                className={`w-10 h-10 ${token.color} rounded-full flex items-center justify-center font-bold text-white text-lg`}
              >
                {token.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{token.symbol}</p>
                <p className="text-sm text-gray-400">{token.name}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
