"use client"

import { useState, useEffect } from "react"
import {
  Users,
  ArrowUpDown,
  Plus,
  RefreshCw,
  Search,
  Filter,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Lock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getP2POrderbook,
  createP2POrder,
  matchP2POrder,
  type P2POrder,
} from "@/lib/exchangeApi"

const CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "bg-purple-500" },
  { symbol: "USDT", name: "Tether", icon: "$", color: "bg-green-500" },
  { symbol: "SOL", name: "Solana", icon: "◎", color: "bg-gradient-to-r from-purple-500 to-green-400" },
]

const PAYMENT_METHODS = [
  { id: "bank_transfer", name: "Bank Transfer", icon: "🏦" },
  { id: "paypal", name: "PayPal", icon: "💳" },
  { id: "wise", name: "Wise", icon: "💸" },
  { id: "revolut", name: "Revolut", icon: "🔄" },
  { id: "venmo", name: "Venmo", icon: "📱" },
]

export default function P2PTradingPage({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "my-orders">("buy")
  const [orders, setOrders] = useState<P2POrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOS[0])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Create order form state
  const [orderType, setOrderType] = useState<"buy" | "sell">("sell")
  const [orderAmount, setOrderAmount] = useState("")
  const [orderPrice, setOrderPrice] = useState("")
  const [orderMinLimit, setOrderMinLimit] = useState("")
  const [orderMaxLimit, setOrderMaxLimit] = useState("")
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [createLoading, setCreateLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    loadOrders()
  }, [activeTab, selectedCrypto])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const type = activeTab === "my-orders" ? undefined : activeTab
      const response = await getP2POrderbook({
        type,
        cryptocurrency: selectedCrypto.symbol,
        fiatCurrency: "USD"
      })
      setOrders(response.orders || [])
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrder = async () => {
    if (!orderAmount || !orderPrice) return
    
    if (!isAuthenticated) {
      setError("Please login with your NFC card to create orders")
      return
    }
    
    setError(null)
    setCreateLoading(true)
    try {
      await createP2POrder({
        type: orderType,
        cryptocurrency: selectedCrypto.symbol,
        fiatCurrency: "USD",
        amount: parseFloat(orderAmount),
        pricePerUnit: parseFloat(orderPrice),
        minOrderAmount: parseFloat(orderMinLimit) || 10,
        maxOrderAmount: parseFloat(orderMaxLimit) || parseFloat(orderAmount) * parseFloat(orderPrice),
        paymentMethods: selectedPaymentMethods,
      })
      
      setShowCreateModal(false)
      setOrderAmount("")
      setOrderPrice("")
      setOrderMinLimit("")
      setOrderMaxLimit("")
      setSelectedPaymentMethods([])
      loadOrders()
    } catch (error) {
      console.error("Failed to create order:", error)
    } finally {
      setCreateLoading(false)
    }
  }

  const handleMatchOrder = async (orderId: string, amount: number) => {
    try {
      await matchP2POrder(orderId, amount, selectedPaymentMethods[0] || "bank_transfer")
      loadOrders()
    } catch (error) {
      console.error("Failed to match order:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "disputed":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-blue-400" />
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    return (
      order.cryptocurrency?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-400" />
          P2P Trading
        </h2>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Order
        </Button>
      </div>

      {/* Crypto Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CRYPTOS.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => setSelectedCrypto(crypto)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              selectedCrypto.symbol === crypto.symbol
                ? "bg-blue-600 text-white"
                : "bg-[#1E293B] text-gray-400 hover:text-white border border-slate-700"
            }`}
          >
            <div className={`w-6 h-6 ${crypto.color} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
              {crypto.icon}
            </div>
            {crypto.symbol}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-[#1E293B] rounded-xl border border-slate-700/50">
        <button
          onClick={() => setActiveTab("buy")}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === "buy"
              ? "bg-green-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Buy Orders
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === "sell"
              ? "bg-red-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Sell Orders
        </button>
        <button
          onClick={() => setActiveTab("my-orders")}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === "my-orders"
              ? "bg-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Orders
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1E293B] border-slate-700 text-white"
          />
        </div>
        <Button
          onClick={loadOrders}
          variant="outline"
          className="border-slate-700 text-gray-400"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                    {order.createdBy?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {order.createdBy || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Price</p>
                    <p className="text-white font-bold">${order.pricePerUnit?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Amount</p>
                    <p className="text-white font-bold">
                      {order.amount} {order.cryptocurrency}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Limit</p>
                    <p className="text-white text-sm">
                      ${order.minOrderAmount} - ${order.maxOrderAmount}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.paymentMethods?.map((method) => (
                    <span
                      key={method}
                      className="px-3 py-1 bg-slate-700/50 rounded-full text-gray-300 text-xs"
                    >
                      {PAYMENT_METHODS.find(p => p.id === method)?.icon}{" "}
                      {PAYMENT_METHODS.find(p => p.id === method)?.name || method}
                    </span>
                  ))}
                </div>

                {order.status === "open" && activeTab !== "my-orders" && (
                  <Button
                    onClick={() => handleMatchOrder(order.orderId, order.amount)}
                    className={`${
                      activeTab === "buy"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    {activeTab === "buy" ? "Buy" : "Sell"}
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#1E293B] rounded-xl border border-slate-700/50">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No orders found</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to create an order!
            </p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1E293B] rounded-2xl p-6 w-full max-w-lg border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6">Create P2P Order</h3>

            {/* Order Type */}
            <div className="flex p-1 bg-slate-800 rounded-xl mb-6">
              <button
                onClick={() => setOrderType("sell")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  orderType === "sell"
                    ? "bg-red-500 text-white"
                    : "text-gray-400"
                }`}
              >
                I want to Sell
              </button>
              <button
                onClick={() => setOrderType("buy")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  orderType === "buy"
                    ? "bg-green-500 text-white"
                    : "text-gray-400"
                }`}
              >
                I want to Buy
              </button>
            </div>

            {/* Amount & Price */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount ({selectedCrypto.symbol})</label>
                <Input
                  type="number"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Price per Unit (USD)</label>
                <Input
                  type="number"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Min Limit (USD)</label>
                <Input
                  type="number"
                  value={orderMinLimit}
                  onChange={(e) => setOrderMinLimit(e.target.value)}
                  placeholder="10"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Max Limit (USD)</label>
                <Input
                  type="number"
                  value={orderMaxLimit}
                  onChange={(e) => setOrderMaxLimit(e.target.value)}
                  placeholder="1000"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Payment Methods</label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      if (selectedPaymentMethods.includes(method.id)) {
                        setSelectedPaymentMethods(prev => prev.filter(m => m !== method.id))
                      } else {
                        setSelectedPaymentMethods(prev => [...prev, method.id])
                      }
                    }}
                    className={`px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedPaymentMethods.includes(method.id)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {method.icon} {method.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1 border-slate-700 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={createLoading || !orderAmount || !orderPrice}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {createLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Order"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
