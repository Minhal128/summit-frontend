"use client"

import { Search, Copy } from "lucide-react"
import { useState } from "react"

interface ActivityTableProps {
  className?: string
}

const transactionData = [
  {
    id: 1,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
  {
    id: 2,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
  {
    id: 3,
    date: "Today",
    type: "Receive",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: true,
  },
  {
    id: 4,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
  {
    id: 5,
    date: "Today",
    type: "Receive",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: true,
  },
  {
    id: 6,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
  {
    id: 7,
    date: "Today",
    type: "Receive",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: true,
  },
  {
    id: 8,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
  {
    id: 9,
    date: "Today",
    type: "Receive",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: true,
  },
  {
    id: 10,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
  {
    id: 11,
    date: "Today",
    type: "Receive",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: true,
  },
  {
    id: 12,
    date: "Today",
    type: "Send",
    counterparty: "0x4567***353",
    amount: "0.04BTC",
    txId: "0x4567***353",
    networkFee: "$1.34",
    time: "11:45 AM",
    status: "Completed",
    isPositive: false,
  },
]

export default function ActivityTable({ className }: ActivityTableProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactionData.filter((transaction) => {
    const matchesFilter = activeFilter === "All" || transaction.type === activeFilter
    const matchesSearch =
      transaction.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.txId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className={`bg-[#1E293B] rounded-2xl p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl text-white font-bold">Activity</h2>
        <div className="flex items-center gap-2">
          {["All", "Send", "Receive", "Stake"].map((filter) => (
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
                          : "text-blue-400"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-4 text-white text-sm">To {transaction.counterparty}</td>
                <td className="py-4 text-white text-sm font-medium">{transaction.amount}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{transaction.txId}</span>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="py-4 text-white text-sm">{transaction.networkFee}</td>
                <td className="py-4 text-white text-sm">{transaction.time}</td>
                <td className="py-4">
                  <span className="text-green-400 text-sm font-medium">{transaction.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
