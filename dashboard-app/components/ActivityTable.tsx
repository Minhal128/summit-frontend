"use client"

import { Search, Copy, Loader2, RefreshCw, ExternalLink } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface ActivityTableProps {
  className?: string
}

interface Transaction {
  id: string
  date: string
  dateFormatted: string
  type: "Send" | "Receive" | "Swap" | "Stake"
  counterparty: string
  counterpartyShort: string
  amount: string
  amountFormatted: string
  currency: string
  txId: string
  txIdShort: string
  networkFee: string
  networkFeeFormatted: string
  time: string
  status: "Completed" | "Pending" | "Failed"
  blockExplorerUrl?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

// Helper to shorten addresses/txids
function shortenAddress(addr: string, chars = 4): string {
  if (!addr || addr.length < chars * 2 + 3) return addr
  return `${addr.slice(0, chars + 2)}***${addr.slice(-chars)}`
}

// Helper to format date
function formatDate(dateStr: string): { date: string; time: string } {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()
  
  let dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (isToday) dateFormatted = 'Today'
  else if (isYesterday) dateFormatted = 'Yesterday'
  
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  
  return { date: dateFormatted, time }
}

// Get block explorer URL based on currency
function getBlockExplorerUrl(currency: string, txId: string): string {
  const explorers: Record<string, string> = {
    BTC: `https://blockstream.info/tx/${txId}`,
    ETH: `https://etherscan.io/tx/${txId}`,
    TRX: `https://tronscan.org/#/transaction/${txId}`,
    SOL: `https://solscan.io/tx/${txId}`,
    BNB: `https://bscscan.com/tx/${txId}`,
  }
  return explorers[currency] || '#'
}

export default function ActivityTable({ className }: ActivityTableProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true)
      else setLoading(true)
      
      // Get auth token
      const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
      
      if (!token) {
        // No token - show empty state with message
        setTransactions([])
        setLoading(false)
        setIsRefreshing(false)
        return
      }
      
      const response = await fetch(`${API_BASE}/api/wallet/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 401) {
        // Not authenticated - show empty state
        setTransactions([])
        return
      }
      
      const result = await response.json()
      
      if (result.status === 'success' && result.data) {
        const formattedTxs: Transaction[] = result.data.map((tx: any) => {
          const { date, time } = formatDate(tx.createdAt || tx.timestamp)
          return {
            id: tx._id || tx.txHash || Math.random().toString(),
            date,
            dateFormatted: tx.createdAt || tx.timestamp,
            type: tx.type || 'Send',
            counterparty: tx.to || tx.counterparty || '',
            counterpartyShort: shortenAddress(tx.to || tx.counterparty || ''),
            amount: tx.amount?.toString() || '0',
            amountFormatted: `${tx.amount} ${tx.currency || 'BTC'}`,
            currency: tx.currency || 'BTC',
            txId: tx.txHash || tx.txId || '',
            txIdShort: shortenAddress(tx.txHash || tx.txId || ''),
            networkFee: tx.fee?.toString() || '0',
            networkFeeFormatted: `$${(tx.feeUsd || tx.fee || 0).toFixed(2)}`,
            time,
            status: tx.status || 'Completed',
            blockExplorerUrl: getBlockExplorerUrl(tx.currency || 'BTC', tx.txHash || tx.txId || '')
          }
        })
        setTransactions(formattedTxs)
      } else {
        // API might not have this endpoint yet - show empty state
        setTransactions([])
      }
    } catch (err: any) {
      console.error('Transaction fetch error:', err)
      setTransactions([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleCopyTxId = async (txId: string, id: string) => {
    try {
      await navigator.clipboard.writeText(txId)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = activeFilter === "All" || transaction.type === activeFilter
    const matchesSearch =
      transaction.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.currency.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className={`bg-[#1E293B] rounded-2xl p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl text-white font-bold">Activity</h2>
          <button 
            onClick={() => fetchTransactions(true)}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh transactions"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {["All", "Send", "Receive", "Swap", "Stake"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-[#0F172A] text-gray-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Tokens"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-white placeholder:text-gray-400"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-400">Loading transactions...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Your transaction history will appear here once you start sending, receiving, or swapping crypto.
          </p>
        </div>
      )}

      {/* Transaction Table */}
      {!loading && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Date</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Type</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Counterparty</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Amount</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">TxID (short)</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Network fee</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Time</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 text-white text-sm">{transaction.date}</td>
                  <td className="py-4">
                    <span
                      className={`text-sm font-medium ${
                        transaction.type === "Send"
                          ? "text-red-400"
                          : transaction.type === "Receive"
                            ? "text-green-400"
                            : transaction.type === "Swap"
                              ? "text-purple-400"
                              : "text-blue-400"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 text-white text-sm">
                    {transaction.type === "Send" ? "To " : "From "}
                    {transaction.counterpartyShort}
                  </td>
                  <td className="py-4 text-white text-sm font-medium">{transaction.amountFormatted}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{transaction.txIdShort}</span>
                      <button 
                        onClick={() => handleCopyTxId(transaction.txId, transaction.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy TxID"
                      >
                        <Copy className={`w-3 h-3 ${copiedId === transaction.id ? 'text-green-400' : ''}`} />
                      </button>
                      {transaction.blockExplorerUrl && transaction.blockExplorerUrl !== '#' && (
                        <a 
                          href={transaction.blockExplorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="View on block explorer"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-white text-sm">{transaction.networkFeeFormatted}</td>
                  <td className="py-4 text-white text-sm">{transaction.time}</td>
                  <td className="py-4">
                    <span className={`text-sm font-medium ${
                      transaction.status === 'Completed' ? 'text-green-400' :
                      transaction.status === 'Pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && transactions.length > 0 && (
            <div className="text-center py-8 text-gray-400">
              No transactions matching your filters
            </div>
          )}
        </div>
      )}
    </div>
  )
}
