"use client"

import { useState, useEffect } from "react"
import {
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Activity,
  DollarSign,
  Shield,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getAdminDashboard,
  getAdminUsers,
  getAdminCards,
  getTransactionAnalytics,
  generateReport,
  type DashboardStats,
  type UserData,
  type CardData,
  type TransactionAnalytics,
} from "@/lib/exchangeApi"

// Stat Card Component
function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = "neutral" 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="bg-[#1E293B] rounded-xl p-6 shadow-sm border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        {change && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            changeType === "positive" ? "bg-green-500/10 text-green-400" :
            changeType === "negative" ? "bg-red-500/10 text-red-400" :
            "bg-gray-500/10 text-gray-400"
          }`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function AdminDashboard({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "cards" | "analytics" | "reports">("overview")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [cards, setCards] = useState<CardData[]>([])
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [userPage, setUserPage] = useState(1)
  const [totalUserPages, setTotalUserPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers()
    }
  }, [activeTab, userPage, searchQuery])

  const loadData = async () => {
    setLoading(true)
    try {
      const [dashboardData, cardsData, analyticsData] = await Promise.all([
        getAdminDashboard(),
        getAdminCards({}),
        getTransactionAnalytics()
      ])
      
      setStats(dashboardData.stats)
      setCards(cardsData.cards || [])
      setAnalytics(analyticsData.analytics)
    } catch (error) {
      console.error("Failed to load admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const userData = await getAdminUsers({ page: userPage, limit: 10, search: searchQuery || undefined })
      setUsers(userData.users || [])
      setTotalUserPages(userData.pages || 1)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  const handleGenerateReport = async (type: 'users' | 'transactions' | 'revenue' | 'cards') => {
    setReportLoading(true)
    try {
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const report = await generateReport({
        reportType: type,
        startDate: thirtyDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        format: 'json'
      })
      // Download the report
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setReportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-400" />
          Admin Dashboard
        </h2>
        <Button
          onClick={loadData}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#1E293B] rounded-xl border border-slate-700/50">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "users", label: "Users", icon: Users },
          { id: "cards", label: "NFC Cards", icon: CreditCard },
          { id: "analytics", label: "Analytics", icon: Activity },
          { id: "reports", label: "Reports", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats.totalUsers?.toLocaleString() || "0"}
              change="+12%"
              changeType="positive"
            />
            <StatCard
              icon={Wallet}
              title="Total Wallets"
              value={stats.totalWallets?.toLocaleString() || "0"}
              change="+8%"
              changeType="positive"
            />
            <StatCard
              icon={CreditCard}
              title="Active NFC Cards"
              value={stats.activeCards?.toLocaleString() || "0"}
              change="+5%"
              changeType="positive"
            />
            <StatCard
              icon={DollarSign}
              title="Total Volume"
              value={`$${(stats.totalTransactionVolume || 0).toLocaleString()}`}
              change="+15%"
              changeType="positive"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "New user registered", time: "2 minutes ago", icon: Users },
                { action: "NFC card activated", time: "5 minutes ago", icon: CreditCard },
                { action: "Large transaction detected", time: "10 minutes ago", icon: AlertCircle },
                { action: "Report generated", time: "1 hour ago", icon: FileText },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.action}</p>
                    <p className="text-gray-400 text-sm">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1E293B] border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.length > 0 ? users.map((user, i) => (
                  <tr key={i} className="hover:bg-slate-700/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white">{user.username || user.email?.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.kycStatus === 'verified' ? "bg-green-500/10 text-green-400" : 
                        user.kycStatus === 'pending' ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {user.kycStatus || 'Not Started'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Page {userPage} of {totalUserPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
                disabled={userPage === 1}
                className="border-slate-700 text-gray-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                disabled={userPage === totalUserPages}
                className="border-slate-700 text-gray-400"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Tab */}
      {activeTab === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.length > 0 ? cards.map((card, i) => (
            <div key={i} className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-blue-400" />
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  card.status === "active" ? "bg-green-500/10 text-green-400" :
                  card.status === "suspended" ? "bg-red-500/10 text-red-400" :
                  "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {card.status}
                </span>
              </div>
              <p className="text-white font-mono text-lg mb-2">
                •••• •••• •••• {card.serialNumber?.slice(-4)}
              </p>
              <p className="text-gray-400 text-sm">Tier: {card.tier}</p>
              <p className="text-gray-400 text-sm">ID: {card.id?.slice(0, 8)}...</p>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              No NFC cards found
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={TrendingUp}
              title="Total Transactions"
              value={analytics.totalTransactions?.toLocaleString() || "0"}
            />
            <StatCard
              icon={DollarSign}
              title="Total Volume"
              value={`$${(analytics.totalVolume || 0).toLocaleString()}`}
            />
            <StatCard
              icon={Activity}
              title="Avg Transaction"
              value={`$${(analytics.avgTransactionSize || 0).toFixed(2)}`}
            />
          </div>

          {/* Transaction Types */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Transaction Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.transactionsByType && Object.entries(analytics.transactionsByType).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-slate-700/20 rounded-lg">
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-gray-400 text-sm capitalize">{type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: "users" as const, title: "User Report", description: "Complete user data and statistics", icon: Users },
            { type: "transactions" as const, title: "Transaction Report", description: "All transaction history", icon: Activity },
            { type: "revenue" as const, title: "Revenue Report", description: "Fee collection and revenue", icon: DollarSign },
            { type: "cards" as const, title: "NFC Cards Report", description: "Card usage and status", icon: CreditCard },
          ].map((report) => (
            <div key={report.type} className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <report.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{report.title}</h3>
                  <p className="text-gray-400 text-sm">{report.description}</p>
                </div>
              </div>
              <Button
                onClick={() => handleGenerateReport(report.type)}
                disabled={reportLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {reportLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" /> Generate
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
