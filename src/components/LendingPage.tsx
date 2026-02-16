"use client"

import { useState, useEffect } from "react"
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
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getLendingPools,
  getLendingStats,
  createLendingDeposit,
  getUserLendingPositions,
  withdrawLendingPosition,
  type LendingPool,
  type LendingPosition,
} from "@/lib/exchangeApi"

const POOL_ICONS: Record<string, { icon: string; color: string }> = {
  BTC: { icon: "₿", color: "bg-orange-500" },
  ETH: { icon: "Ξ", color: "bg-purple-500" },
  USDT: { icon: "$", color: "bg-green-500" },
  USDC: { icon: "$", color: "bg-blue-500" },
  BNB: { icon: "B", color: "bg-yellow-500" },
  SOL: { icon: "◎", color: "bg-gradient-to-r from-purple-500 to-green-400" },
  ADA: { icon: "₳", color: "bg-blue-600" },
  DOT: { icon: "•", color: "bg-pink-500" },
  AVAX: { icon: "A", color: "bg-red-600" },
  LINK: { icon: "⬡", color: "bg-blue-700" },
  DAI: { icon: "◈", color: "bg-yellow-600" },
  MATIC: { icon: "M", color: "bg-purple-600" },
}

function formatLockPeriod(lp: string): string {
  if (lp === 'flexible') return 'Flexible'
  return lp.replace('d', ' Days')
}

export default function LendingPage({ className }: { className?: string }) {
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null)
  const [lendAmount, setLendAmount] = useState("")
  const [activeTab, setActiveTab] = useState<"lend" | "my-lending">("lend")
  const [pools, setPools] = useState<LendingPool[]>([])
  const [positions, setPositions] = useState<LendingPosition[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [positionSummary, setPositionSummary] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === "my-lending") {
      loadPositions()
    }
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      const [poolsRes, statsRes] = await Promise.all([
        getLendingPools(),
        getLendingStats().catch(() => ({ data: null }))
      ])
      setPools(poolsRes.pools || [])
      setStats(statsRes.data)
    } catch (err) {
      console.error("Failed to load lending data:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadPositions = async () => {
    try {
      const res = await getUserLendingPositions()
      setPositions(res.positions || [])
      setPositionSummary(res.summary || null)
    } catch (err) {
      console.error("Failed to load positions:", err)
    }
  }

  const handleDeposit = async () => {
    if (!selectedPool || !lendAmount) return
    setDepositLoading(true)
    setError(null)
    try {
      await createLendingDeposit(selectedPool.poolId, parseFloat(lendAmount))
      setLendAmount("")
      loadData()
      loadPositions()
    } catch (err: any) {
      setError(err.message || "Failed to create deposit")
    } finally {
      setDepositLoading(false)
    }
  }

  const handleWithdraw = async (positionId: string) => {
    setWithdrawLoading(positionId)
    try {
      await withdrawLendingPosition(positionId)
      loadPositions()
      loadData()
    } catch (err: any) {
      setError(err.message || "Failed to withdraw")
    } finally {
      setWithdrawLoading(null)
    }
  }

  const calculateEarnings = () => {
    if (!selectedPool || !lendAmount) return 0
    const amount = parseFloat(lendAmount)
    const dailyRate = selectedPool.apy / 365 / 100
    return amount * dailyRate * 30 // 30 days estimate
  }

  const getPoolIcon = (asset: string) => POOL_ICONS[asset] || { icon: asset.charAt(0), color: "bg-gray-500" }

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
            <span className="text-gray-400 text-sm">Total Deposited</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalDeposited?.toLocaleString() || '0'}</p>
          <p className="text-green-400 text-sm mt-1">{stats?.totalPools || 0} pools</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Total Borrowed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalBorrowed?.toLocaleString() || '0'}</p>
          <p className="text-gray-400 text-sm mt-1">{stats?.utilization || '0'}% utilization</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Avg APY</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.averageApy || '0'}%</p>
          <p className="text-gray-400 text-sm mt-1">Weighted average</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Active Positions</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.activePositions || 0}</p>
          <p className="text-gray-400 text-sm mt-1">{stats?.totalPositions || 0} total</p>
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : pools.length > 0 ? (
              pools.map((pool) => {
                const { icon, color } = getPoolIcon(pool.asset)
                return (
                <div
                  key={pool.poolId}
                  className={`bg-[#1E293B] rounded-xl p-6 border transition-all cursor-pointer ${
                    selectedPool?.poolId === pool.poolId
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-700/50 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                        {icon}
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
                        {formatLockPeriod(pool.lockPeriod)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Min Amount</p>
                      <p className="text-white font-medium">{pool.minAmount} {pool.asset}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Deposited</p>
                      <p className="text-white font-medium text-sm">{pool.totalDeposited.toLocaleString()} {pool.asset}</p>
                    </div>
                  </div>
                </div>
                )
              })
            ) : (
              <div className="text-center py-12 bg-[#1E293B] rounded-xl border border-slate-700/50">
                <Banknote className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No lending pools available</p>
              </div>
            )}
          </div>

          {/* Lend Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lend Crypto</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {selectedPool ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Selected Pool</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      <div className={`w-8 h-8 ${getPoolIcon(selectedPool.asset).color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {getPoolIcon(selectedPool.asset).icon}
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
                      <span className="text-white">{formatLockPeriod(selectedPool.lockPeriod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Type</span>
                      <span className="text-white">Compound Daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Borrow APY</span>
                      <span className="text-yellow-400">{selectedPool.borrowApy}%</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={depositLoading || !lendAmount || parseFloat(lendAmount) < selectedPool.minAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold"
                  >
                    {depositLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    Start Lending
                  </Button>

                  <div className="mt-4 flex items-start gap-2 text-gray-400 text-xs">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Your funds will be locked for {formatLockPeriod(selectedPool.lockPeriod)}. Interest is calculated daily and auto-compounded.
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Lending Positions</h3>
              {positionSummary && (
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Total Interest Earned</p>
                  <p className="text-green-400 font-bold">{positionSummary.totalInterestEarned?.toFixed(6) || '0'}</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {positions.length > 0 ? (
                positions.map((position) => {
                  const { icon, color } = getPoolIcon(position.asset)
                  const isMatured = position.maturesAt && new Date(position.maturesAt) <= new Date()
                  const daysLeft = position.maturesAt
                    ? Math.max(0, Math.ceil((new Date(position.maturesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                    : null
                  return (
                    <div key={position.positionId} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold`}>
                          {icon}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{position.amount} {position.asset}</p>
                          <p className="text-gray-400 text-sm capitalize">{position.type} &middot; {formatLockPeriod(position.lockPeriod)}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-green-400 font-bold">{position.apy}% APY</p>
                        <p className="text-gray-400 text-xs">
                          {daysLeft !== null ? (isMatured ? 'Matured' : `${daysLeft} days left`) : 'Flexible'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">+{(position.accruedInterest || 0).toFixed(6)} {position.asset}</p>
                        <p className="text-gray-400 text-xs">Interest Earned</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-gray-400"
                        disabled={withdrawLoading === position.positionId || (daysLeft !== null && daysLeft > 0)}
                        onClick={() => handleWithdraw(position.positionId)}
                      >
                        {withdrawLoading === position.positionId ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : 'Withdraw'}
                      </Button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Banknote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No active positions</p>
                  <p className="text-gray-500 text-sm mt-1">Start lending to earn interest</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
