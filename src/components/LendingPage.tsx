"use client"

import { useState } from "react"
import {
  Banknote,
  TrendingUp,
  Clock,
  Shield,
  Info,
  ArrowRight,
  Percent,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const LENDING_POOLS = [
  {
    id: "btc-flexible",
    asset: "BTC",
    name: "Bitcoin",
    icon: "₿",
    color: "bg-orange-500",
    apy: 5.2,
    minAmount: 0.001,
    lockPeriod: "Flexible",
    totalLent: "1,234.56 BTC",
    available: true,
  },
  {
    id: "eth-30d",
    asset: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    color: "bg-purple-500",
    apy: 7.5,
    minAmount: 0.01,
    lockPeriod: "30 Days",
    totalLent: "12,345.67 ETH",
    available: true,
  },
  {
    id: "usdt-flexible",
    asset: "USDT",
    name: "Tether",
    icon: "$",
    color: "bg-green-500",
    apy: 8.0,
    minAmount: 10,
    lockPeriod: "Flexible",
    totalLent: "5,678,901 USDT",
    available: true,
  },
  {
    id: "usdc-90d",
    asset: "USDC",
    name: "USD Coin",
    icon: "$",
    color: "bg-blue-500",
    apy: 10.5,
    minAmount: 100,
    lockPeriod: "90 Days",
    totalLent: "3,456,789 USDC",
    available: true,
  },
  {
    id: "bnb-60d",
    asset: "BNB",
    name: "BNB",
    icon: "B",
    color: "bg-yellow-500",
    apy: 6.8,
    minAmount: 0.1,
    lockPeriod: "60 Days",
    totalLent: "45,678 BNB",
    available: true,
  },
  {
    id: "sol-flexible",
    asset: "SOL",
    name: "Solana",
    icon: "◎",
    color: "bg-gradient-to-r from-purple-500 to-green-400",
    apy: 9.2,
    minAmount: 1,
    lockPeriod: "Flexible",
    totalLent: "123,456 SOL",
    available: true,
  },
]

export default function LendingPage({ className }: { className?: string }) {
  const [selectedPool, setSelectedPool] = useState<typeof LENDING_POOLS[0] | null>(null)
  const [lendAmount, setLendAmount] = useState("")
  const [activeTab, setActiveTab] = useState<"lend" | "my-lending">("lend")

  const calculateEarnings = () => {
    if (!selectedPool || !lendAmount) return 0
    const amount = parseFloat(lendAmount)
    const dailyRate = selectedPool.apy / 365 / 100
    return amount * dailyRate * 30 // 30 days estimate
  }

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <Banknote className="w-8 h-8 text-blue-400" />
          Crypto Lending
        </h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Shield className="w-4 h-4 text-green-400" />
          Secured by Smart Contracts
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-white">$12,456.78</p>
          <p className="text-green-400 text-sm mt-1">+15.2% this month</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Total Lent</span>
          </div>
          <p className="text-2xl font-bold text-white">$45,890.00</p>
          <p className="text-gray-400 text-sm mt-1">Across 6 pools</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Avg APY</span>
          </div>
          <p className="text-2xl font-bold text-white">7.8%</p>
          <p className="text-gray-400 text-sm mt-1">Weighted average</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Active Loans</span>
          </div>
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-gray-400 text-sm mt-1">2 maturing soon</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-[#1E293B] rounded-xl border border-slate-700/50">
        <button
          onClick={() => setActiveTab("lend")}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === "lend"
              ? "bg-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Available Pools
        </button>
        <button
          onClick={() => setActiveTab("my-lending")}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === "my-lending"
              ? "bg-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Lending
        </button>
      </div>

      {activeTab === "lend" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lending Pools */}
          <div className="lg:col-span-2 space-y-4">
            {LENDING_POOLS.map((pool) => (
              <div
                key={pool.id}
                className={`bg-[#1E293B] rounded-xl p-6 border transition-all cursor-pointer ${
                  selectedPool?.id === pool.id
                    ? "border-blue-500 ring-2 ring-blue-500/20"
                    : "border-slate-700/50 hover:border-slate-600"
                }`}
                onClick={() => setSelectedPool(pool)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${pool.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                      {pool.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{pool.name}</h3>
                      <p className="text-gray-400 text-sm">{pool.asset}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-2xl">{pool.apy}%</p>
                    <p className="text-gray-400 text-sm">APY</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Lock Period</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {pool.lockPeriod}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Min Amount</p>
                    <p className="text-white font-medium">{pool.minAmount} {pool.asset}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total Lent</p>
                    <p className="text-white font-medium text-sm">{pool.totalLent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lend Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lend Crypto</h3>

              {selectedPool ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Selected Pool</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      <div className={`w-8 h-8 ${selectedPool.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {selectedPool.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedPool.name}</p>
                        <p className="text-green-400 text-sm">{selectedPool.apy}% APY</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Amount to Lend</label>
                    <Input
                      type="number"
                      value={lendAmount}
                      onChange={(e) => setLendAmount(e.target.value)}
                      placeholder={`Min: ${selectedPool.minAmount}`}
                      className="bg-slate-800 border-slate-700 text-white text-lg"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Available: 0.00 {selectedPool.asset}
                    </p>
                  </div>

                  {lendAmount && parseFloat(lendAmount) >= selectedPool.minAmount && (
                    <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Estimated Earnings (30 days)</p>
                      <p className="text-white font-bold text-xl">
                        {calculateEarnings().toFixed(6)} {selectedPool.asset}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        ≈ ${(calculateEarnings() * 50000).toFixed(2)} USD
                      </p>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-slate-800/50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Period</span>
                      <span className="text-white">{selectedPool.lockPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Type</span>
                      <span className="text-white">Compound Daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Early Withdrawal</span>
                      <span className="text-yellow-400">2% Fee</span>
                    </div>
                  </div>

                  <Button
                    disabled={!lendAmount || parseFloat(lendAmount) < selectedPool.minAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Start Lending
                  </Button>

                  <div className="mt-4 flex items-start gap-2 text-gray-400 text-xs">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Your funds will be locked for {selectedPool.lockPeriod}. Interest is calculated daily and auto-compounded.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Banknote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Select a lending pool to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* My Active Lending */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Active Lending Positions</h3>
            <div className="space-y-3">
              {[
                { asset: "BTC", amount: 0.5, apy: 5.2, earned: 0.00216, daysLeft: "Flexible", value: 25000 },
                { asset: "ETH", amount: 5.2, apy: 7.5, earned: 0.0325, daysLeft: 15, value: 16900 },
                { asset: "USDT", amount: 10000, apy: 8.0, earned: 65.75, daysLeft: "Flexible", value: 10000 },
              ].map((position, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {position.asset.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{position.amount} {position.asset}</p>
                      <p className="text-gray-400 text-sm">≈ ${position.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-bold">{position.apy}% APY</p>
                    <p className="text-gray-400 text-xs">
                      {typeof position.daysLeft === 'number' ? `${position.daysLeft} days left` : position.daysLeft}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">+{position.earned} {position.asset}</p>
                    <p className="text-gray-400 text-xs">Total Earned</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700 text-gray-400">
                    Withdraw
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
