"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownLeft, Search, X, ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getTransactionHistory, formatTransactionDate, formatAmount, getExplorerUrl, Transaction } from "@/lib/transactionHistory"

interface RecentTransactionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RecentTransactionsModal({ isOpen, onClose }: RecentTransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isOpen) {
      loadTransactions()
    }
  }, [isOpen])

  const loadTransactions = async () => {
    setLoading(true)
    const result = await getTransactionHistory({ limit: 20 })
    if (result.success) {
      setTransactions(result.transactions)
    }
    setLoading(false)
  }

  const filteredTransactions = transactions.filter(tx => 
    tx.fromCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeDisplay = (type: string): 'receive' | 'send' => {
    return type === 'receive' || type === 'buy' ? 'receive' : 'send'
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0F172A] border-slate-600 text-white pl-10 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="px-6 pb-6 space-y-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Loading transactions...</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchTerm ? 'No transactions match your search' : 'No transactions yet'}
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const displayType = getTypeDisplay(transaction.type)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors cursor-pointer"
                  onClick={() => {
                    if (transaction.txHash) {
                      window.open(getExplorerUrl(transaction.txHash, transaction.fromCurrency), '_blank')
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        displayType === "receive" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {displayType === "receive" ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{transaction.fromCurrency}</p>
                      <p className="text-xs text-gray-400">{formatTransactionDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {formatAmount(transaction.amount, transaction.fromCurrency)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          displayType === "receive" ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </div>
                    {transaction.txHash && (
                      <ExternalLink className="w-4 h-4 text-gray-500 hover:text-blue-400" />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
