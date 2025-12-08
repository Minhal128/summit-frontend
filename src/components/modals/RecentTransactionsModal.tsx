"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownLeft, Search, X } from "lucide-react"

interface RecentTransactionsModalProps {
  isOpen: boolean
  onClose: () => void
}

const transactions = [
  {
    id: 1,
    symbol: "BTC",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "receive" as const,
  },
  {
    id: 2,
    symbol: "ETH",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "send" as const,
  },
  {
    id: 3,
    symbol: "ETH",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "send" as const,
  },
  {
    id: 4,
    symbol: "ETH",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "send" as const,
  },
  {
    id: 5,
    symbol: "ETH",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "send" as const,
  },
  {
    id: 6,
    symbol: "ETH",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "send" as const,
  },
  {
    id: 7,
    symbol: "BTC",
    amount: "0.003644BTC",
    date: "September 1, 2025 | 9:12AM",
    type: "receive" as const,
  },
]

export default function RecentTransactionsModal({ isOpen, onClose }: RecentTransactionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Recent Transactions</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search Transactions"
              className="bg-[#0F172A] border-slate-600 text-white pl-10 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="px-6 pb-6 space-y-2 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "receive" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  {transaction.type === "receive" ? (
                    <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{transaction.symbol}</p>
                  <p className="text-xs text-gray-400">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white text-sm">{transaction.amount}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    transaction.type === "receive" ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {transaction.type === "receive" ? "Receive" : "Send"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
