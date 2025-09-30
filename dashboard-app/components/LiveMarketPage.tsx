"use client"

import { Search } from "lucide-react"
import { useState } from "react"

interface LiveMarketPageProps {
  className?: string
}

const marketData = [
  {
    id: 1,
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "blue",
    icon: "B",
  },
  {
    id: 2,
    symbol: "ETH",
    name: "Ethereum",
    pair: "ETH/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "yellow",
    icon: "E",
  },
  {
    id: 3,
    symbol: "SOL",
    name: "Solana",
    pair: "SOL/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "blue",
    icon: "S",
  },
  {
    id: 4,
    symbol: "TON",
    name: "Ton",
    pair: "TON/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "-1.56%",
    isPositive: false,
    chartColor: "red",
    icon: "T",
  },
  {
    id: 5,
    symbol: "USDT",
    name: "Tether",
    pair: "USDT/USD",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "green",
    icon: "U",
  },
  {
    id: 6,
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "blue",
    icon: "B",
  },
  {
    id: 7,
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "blue",
    icon: "B",
  },
  {
    id: 8,
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USDT",
    price: "$110,738",
    marketCap: "$2.0B",
    change: "+1.56%",
    isPositive: true,
    chartColor: "blue",
    icon: "B",
  },
]

const MiniChart = ({ color, isPositive }: { color: string; isPositive: boolean }) => {
  const getChartColor = () => {
    switch (color) {
      case "blue":
        return "#3B82F6"
      case "yellow":
        return "#EAB308"
      case "green":
        return "#10B981"
      case "red":
        return "#EF4444"
      default:
        return "#3B82F6"
    }
  }

  return (
    <div className="w-16 h-8">
      <svg width="64" height="32" viewBox="0 0 64 32" className="overflow-visible">
        <path
          d="M2,20 Q8,15 16,18 T32,12 T48,16 T62,10"
          stroke={getChartColor()}
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
        {/* Add some dots for visual appeal */}
        <circle cx="16" cy="18" r="1.5" fill={getChartColor()} />
        <circle cx="32" cy="12" r="1.5" fill={getChartColor()} />
        <circle cx="48" cy="16" r="1.5" fill={getChartColor()} />
      </svg>
    </div>
  )
}

export default function LiveMarketPage({ className }: LiveMarketPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMarketData = marketData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.pair.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={`bg-[#1E293B] rounded-2xl p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl text-white font-bold">Live Market</h2>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-gray-400 text-sm font-medium pb-3">Date</th>
              <th className="text-left text-gray-400 text-sm font-medium pb-3">Price</th>
              <th className="text-left text-gray-400 text-sm font-medium pb-3">Market cap</th>
              <th className="text-left text-gray-400 text-sm font-medium pb-3">Change (7D)</th>
              <th className="text-left text-gray-400 text-sm font-medium pb-3">Chart</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarketData.map((coin) => (
              <tr key={coin.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                        coin.symbol === "BTC"
                          ? "bg-orange-500"
                          : coin.symbol === "ETH"
                            ? "bg-purple-500"
                            : coin.symbol === "SOL"
                              ? "bg-teal-500"
                              : coin.symbol === "TON"
                                ? "bg-blue-500"
                                : "bg-green-500"
                      }`}
                    >
                      {coin.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{coin.name}</p>
                      <p className="text-xs text-gray-400">{coin.pair}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-white text-sm font-medium">{coin.price}</td>
                <td className="py-4 text-white text-sm">{coin.marketCap}</td>
                <td className="py-4">
                  <span className={`text-sm font-medium ${coin.isPositive ? "text-green-400" : "text-red-400"}`}>
                    {coin.change}
                  </span>
                </td>
                <td className="py-4">
                  <MiniChart color={coin.chartColor} isPositive={coin.isPositive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
