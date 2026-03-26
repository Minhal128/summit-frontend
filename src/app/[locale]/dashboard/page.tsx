"use client"

import type { NextPage } from "next"
import Image from "next/image"
import {
  LayoutDashboard,
  Clock,
  Settings,
  BarChart,
  Search,
  Globe,
  Banknote as BanknoteIcon,
  CreditCard as CreditCardIcon,
  Map,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  ChevronUp,
  Settings2,
  Send,
  Download,
  RefreshCw,
  Banknote,
  Shield,
  ShoppingCart,
  Users,
  ArrowLeftRight,
  ShieldCheck,
  LogOut,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import RecentTransactionsModal from "@/components/modals/RecentTransactionsModal"
import SendReceiveModal from "@/components/modals/SendReceiveModal"
import SendCoinModal from "@/components/modals/SendCoinModal"
import TransactionAuthorizedModal from "@/components/modals/TransactionAuthorizedModal"
import ChooseNetworkModal from "@/components/modals/ChooseNetworkModal"
import PortfolioDetailsModal from "@/components/modals/PortfolioDetailsModal"
import BuySellModal from "@/components/modals/BuySellModal"
import BuyCoinModal from "@/components/modals/BuyCoinModal"
import SellCoinModal from "@/components/modals/SellCoinModal"
import ActivityTable from "@/components/ActivityTable"
import SettingsPage from "@/components/SettingsPage"
import LiveMarketPage from "@/components/LiveMarketPage"
import HardwareWalletModal from "@/components/modals/HardwareWalletModal"
import ReceiveModal from "@/components/modals/ReceiveModal"
import DepositModal from "@/components/modals/DepositModal"
import NfcManagement from "@/components/NfcManagement"
import AdminDashboard from "@/components/AdminDashboard"
import BuySellPage from "@/components/BuySellPage"
import P2PTradingPage from "@/components/P2PTradingPage"
import DexSwapPage from "@/components/DexSwapPage"
import LendingPage from "@/components/LendingPage"
import NfcShopPage from "@/components/NfcShopPage"
import PartnersMapPage from "@/components/PartnersMapPage"
import type { Token, TooltipProps, Network } from "@/types"
import { useTranslation } from "@/contexts/I18nContext"
import { useWallet } from "@/contexts/WalletContext"
import { getTransactionHistory, formatTransactionDate, formatAmount, getExplorerUrl, Transaction } from "@/lib/transactionHistory"

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const value = typeof payload[0].value === 'number' ? payload[0].value : Number(payload[0].value) || 0
    return (
      <div className="bg-white text-black p-3 rounded-md shadow-lg text-center">
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs font-semibold">{`$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}</p>
      </div>
    )
  }
  return null
}

// Main Dashboard Component
const DashboardPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { totalValueFormatted, balances, loading: walletLoading, refreshBalances, walletAddresses, usdBalance, usdBalanceFormatted } = useWallet()
  const [activeTab, setActiveTab] = useState("Swap")
  const [activePage, setActivePage] = useState("Dashboard")
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false)
  const [isSendReceiveModalOpen, setIsSendReceiveModalOpen] = useState(false)
  const [isSendCoinModalOpen, setIsSendCoinModalOpen] = useState(false)
  const [isTransactionAuthorizedModalOpen, setIsTransactionAuthorizedModalOpen] = useState(false)
  const [isChooseNetworkModalOpen, setIsChooseNetworkModalOpen] = useState(false)
  const [isPortfolioDetailsModalOpen, setIsPortfolioDetailsModalOpen] = useState(false)
  const [isBuySellModalOpen, setIsBuySellModalOpen] = useState(false)
  const [isBuyCoinModalOpen, setIsBuyCoinModalOpen] = useState(false)
  const [isSellCoinModalOpen, setIsSellCoinModalOpen] = useState(false)
  const [isHardwareWalletModalOpen, setIsHardwareWalletModalOpen] = useState(false)
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Real data states
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [btcPrice, setBtcPrice] = useState<number>(0)
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([])
  const [swapFromAmount, setSwapFromAmount] = useState("")
  const [swapToAmount, setSwapToAmount] = useState("")
  const [swapFromToken, setSwapFromToken] = useState("BTC")
  const [swapToToken, setSwapToToken] = useState("ETH")
  const [selectedChartCrypto, setSelectedChartCrypto] = useState("BTC")
  const [isCryptoDropdownOpen, setIsCryptoDropdownOpen] = useState(false)
  const [isSwapFromDropdownOpen, setIsSwapFromDropdownOpen] = useState(false)
  const [isSwapToDropdownOpen, setIsSwapToDropdownOpen] = useState(false)
  const [swapLoading, setSwapLoading] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null)
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [chartPeriod, setChartPeriod] = useState("1W")
  const [chartDays, setChartDays] = useState(7)

  // Swap tokens configuration
  const swapTokenOptions = [
    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500', icon: 'B' },
    { symbol: 'ETH', name: 'Ethereum', color: 'bg-purple-500', icon: 'E' },
    { symbol: 'SOL', name: 'Solana', color: 'bg-teal-500', icon: 'S' },
    { symbol: 'TRX', name: 'Tron', color: 'bg-red-500', icon: 'T' },
    { symbol: 'USDT', name: 'Tether', color: 'bg-green-500', icon: 'U' },
  ]

  // Get ETH wallet address from context
  const ethWalletAddress = walletAddresses?.ETH || ''

  // Crypto options for dropdown
  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin USD' },
    { symbol: 'ETH', name: 'Ethereum USD' },
    { symbol: 'SOL', name: 'Solana USD' },
    { symbol: 'TRX', name: 'Tron USD' },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isCryptoDropdownOpen) setIsCryptoDropdownOpen(false)
      if (isSwapFromDropdownOpen) setIsSwapFromDropdownOpen(false)
      if (isSwapToDropdownOpen) setIsSwapToDropdownOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isCryptoDropdownOpen, isSwapFromDropdownOpen, isSwapToDropdownOpen])

  // Calculate swap output amount based on exchange rates
  useEffect(() => {
    if (swapFromAmount && parseFloat(swapFromAmount) > 0 && exchangeRates[swapFromToken] && exchangeRates[swapToToken]) {
      const fromUSD = parseFloat(swapFromAmount) * exchangeRates[swapFromToken]
      const toAmount = fromUSD / exchangeRates[swapToToken]
      setSwapToAmount(toAmount.toFixed(6))
    } else {
      setSwapToAmount("")
    }
  }, [swapFromAmount, swapFromToken, swapToToken, exchangeRates])

  // Fetch real data on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch recent transactions
      const txResult = await getTransactionHistory({ limit: 5 })
      if (txResult.success) {
        setRecentTransactions(txResult.transactions)
      }

      // Fetch market prices and build exchange rates
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'
        const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
        const response = await fetch(`${API_BASE}/api/market/rates`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        const data = await response.json()
        if (data.status === 'success' && data.data) {
          const rates: Record<string, number> = {}
          data.data.forEach((r: any) => {
            rates[r.symbol] = r.marketRate || r.msRate || 0
          })
          setExchangeRates(rates)
          const btc = data.data.find((r: any) => r.symbol === 'BTC')
          if (btc) setBtcPrice(btc.marketRate || btc.msRate || 0)
        }
      } catch (err) {
        console.error('Failed to fetch prices:', err)
      }

      // Fetch price history for chart from CoinGecko (with fallback)
      try {
        const coinIds: Record<string, string> = {
          BTC: 'bitcoin',
          ETH: 'ethereum',
          SOL: 'solana',
          TRX: 'tron'
        }
        const coinId = coinIds[selectedChartCrypto] || 'bitcoin'
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${chartDays}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.prices && data.prices.length > 0) {
            // Create labels based on period
            const numPoints = Math.min(7, data.prices.length)
            const interval = Math.floor(data.prices.length / numPoints)
            const chartPoints = []
            
            for (let i = 0; i < numPoints && i * interval < data.prices.length; i++) {
              const idx = Math.min(i * interval, data.prices.length - 1)
              const [timestamp, price] = data.prices[idx]
              const date = new Date(timestamp)
              
              // Format label based on period
              let label: string
              if (chartDays <= 1) {
                label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              } else if (chartDays <= 7) {
                label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
              } else if (chartDays <= 30) {
                label = `${date.getMonth() + 1}/${date.getDate()}`
              } else {
                label = date.toLocaleDateString([], { month: 'short' })
              }
              
              chartPoints.push({
                name: label,
                value: price / 1000 // Convert to K for chart display
              })
            }
            if (chartPoints.length > 0) setChartData(chartPoints)
            return
          }
        }
        
        // Fallback: generate mock data based on current price
        const basePrices: Record<string, number> = { BTC: 95, ETH: 3.2, SOL: 0.15, TRX: 0.0002 }
        const basePrice = basePrices[selectedChartCrypto] || 95
        const labels = chartDays <= 1 
          ? ['12am', '4am', '8am', '12pm', '4pm', '8pm', 'Now']
          : chartDays <= 7 
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        const mockData = labels.map((label, i) => ({
          name: label,
          value: basePrice * (0.95 + Math.random() * 0.1)
        }))
        setChartData(mockData)
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
        // Generate fallback data
        const basePrices: Record<string, number> = { BTC: 95, ETH: 3.2, SOL: 0.15, TRX: 0.0002 }
        const basePrice = basePrices[selectedChartCrypto] || 95
        const labels = chartDays <= 1 
          ? ['12am', '4am', '8am', '12pm', '4pm', '8pm', 'Now']
          : chartDays <= 7 
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        const mockData = labels.map((label, i) => ({
          name: label,
          value: basePrice * (0.95 + Math.random() * 0.1)
        }))
        setChartData(mockData)
      }
    }
    
    fetchData()
  }, [selectedChartCrypto, chartDays])

  // Get balances for swap section
  const btcBalance = balances.find(b => b.symbol === 'BTC')
  const ethBalance = balances.find(b => b.symbol === 'ETH')
  const getBalance = (symbol: string) => balances.find(b => b.symbol === symbol)
  const swapFromBalance = getBalance(swapFromToken)
  const swapToBalance = getBalance(swapToToken)

  // Handle swap tokens switch
  const handleSwitchTokens = () => {
    const tempToken = swapFromToken
    const tempAmount = swapFromAmount
    setSwapFromToken(swapToToken)
    setSwapToToken(tempToken)
    setSwapFromAmount(swapToAmount)
  }

  // Handle swap execution
  const handleSwapExecute = async () => {
    setSwapError(null)
    setSwapSuccess(null)
    
    const amount = parseFloat(swapFromAmount)
    if (!amount || amount <= 0) {
      setSwapError('Please enter a valid amount')
      return
    }

    if (swapFromBalance && amount > swapFromBalance.amount) {
      setSwapError(`Insufficient balance. You have ${swapFromBalance.amountFormatted}`)
      return
    }

    setSwapLoading(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'
      const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
      
      if (!token) {
        setSwapError('Please login to perform swaps')
        return
      }

      const response = await fetch(`${API_BASE}/api/transactions/swap/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromCurrency: swapFromToken,
          toCurrency: swapToToken,
          fromAmount: amount
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setSwapSuccess(`Swap created! You'll receive ~${swapToAmount} ${swapToToken}`)
        setSwapFromAmount('')
        setSwapToAmount('')
        refreshBalances()
      } else {
        setSwapError(result.message || 'Swap failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Swap error:', err)
      setSwapError(err.message || 'Swap failed. Please try again.')
    } finally {
      setSwapLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear all authentication tokens
    localStorage.removeItem('auth_token')
    localStorage.removeItem('nfc_token')
    localStorage.removeItem('user')
    localStorage.removeItem('nfc_card_id')
    // Redirect to login page
    router.push('/login')
  }

  // Auth guard: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('nfc_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    const handleHardwareWalletConfirmed = () => {
      setIsTransactionAuthorizedModalOpen(true)
    }

    window.addEventListener("hardwareWalletConfirmed", handleHardwareWalletConfirmed)
    return () => window.removeEventListener("hardwareWalletConfirmed", handleHardwareWalletConfirmed)
  }, [])

  const handleTokenSelect = (token: Token, action: "send" | "receive") => {
    setSelectedToken(token)
    setIsSendReceiveModalOpen(false)

    if (action === "send") {
      setIsSendCoinModalOpen(true)
    } else {
      setIsReceiveModalOpen(true)
    }
  }

  const handleSendCoinBack = () => {
    setIsSendCoinModalOpen(false)
    setIsSendReceiveModalOpen(true)
  }

  const handleSendCoinProceed = () => {
    setIsSendCoinModalOpen(false)
    setIsHardwareWalletModalOpen(true)
  }

  const handleHardwareWalletConfirm = () => {
    setIsHardwareWalletModalOpen(false)
    setIsTransactionAuthorizedModalOpen(true)
  }

  const handleHardwareWalletCancel = () => {
    setIsHardwareWalletModalOpen(false)
    setIsSendCoinModalOpen(true)
  }

  // Receive flow handlers
  const handleReceiveBack = () => {
    setIsReceiveModalOpen(false)
    setIsSendReceiveModalOpen(true)
  }

  const handleReceiveClose = () => {
    setIsReceiveModalOpen(false)
    setSelectedToken(null)
  }

  const handleChooseNetworkBack = () => {
    setIsChooseNetworkModalOpen(false)
    setIsSendReceiveModalOpen(true)
  }

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network)
    setIsChooseNetworkModalOpen(false)
    setIsPortfolioDetailsModalOpen(true)
  }

  const handlePortfolioDetailsBack = () => {
    setIsPortfolioDetailsModalOpen(false)
    setIsChooseNetworkModalOpen(true)
  }

  const handlePortfolioDetailsClose = () => {
    setIsPortfolioDetailsModalOpen(false)
    setIsSendReceiveModalOpen(false)
    setSelectedToken(null)
    setSelectedNetwork(null)
  }

  // Buy & Sell flow handlers
  const handleBuyTokenSelect = (token: Token) => {
    setSelectedToken(token)
    setIsBuySellModalOpen(false)
    setIsBuyCoinModalOpen(true)
  }

  const handleSellTokenSelect = (token: Token) => {
    setSelectedToken(token)
    setIsBuySellModalOpen(false)
    setIsSellCoinModalOpen(true)
  }

  const handleBuyCoinBack = () => {
    setIsBuyCoinModalOpen(false)
    setIsBuySellModalOpen(true)
  }

  const handleBuyCoinProceed = () => {
    setIsBuyCoinModalOpen(false)
    setIsTransactionAuthorizedModalOpen(true)
  }

  const handleSellCoinBack = () => {
    setIsSellCoinModalOpen(false)
    setIsBuySellModalOpen(true)
  }

  const handleSellCoinProceed = () => {
    setIsSellCoinModalOpen(false)
    setIsTransactionAuthorizedModalOpen(true)
  }

  const handleBuySellClose = () => {
    setIsBuySellModalOpen(false)
    setSelectedToken(null)
  }

  // Function to render content based on active page
  const renderPageContent = () => {
    switch (activePage) {
      case "Activity":
        return <ActivityTable className="w-full" />
      case "Settings":
        return <SettingsPage className="w-full" />
      case "Live Market":
        return <LiveMarketPage className="w-full" />
      case "NFC":
        return <NfcManagement />
      case "Admin":
        return <AdminDashboard className="w-full" />
      case "Buy & Sell":
        return <BuySellPage className="w-full" />
      case "P2P":
        return <P2PTradingPage className="w-full" />
      case "DEX":
        return <DexSwapPage className="w-full" />
      case "Lending":
        return <LendingPage className="w-full" />
      case "NFC Shop":
        return <NfcShopPage className="w-full" />
      case "Partners":
        return <PartnersMapPage className="w-full" />
      default: // Dashboard
        return (
          <>
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className="text-2xl sm:text-3xl text-white font-bold">Dashboard</h2>
              <div className="grid grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center gap-3 w-full lg:w-auto">
                <Button
                  onClick={() => setIsSendReceiveModalOpen(true)}
                  className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 text-xs lg:text-sm rounded-xl shadow-lg"
                >
                  <Send className="w-4 h-4" /> Send & Receive
                </Button>
                <Button
                  onClick={() => setIsBuySellModalOpen(true)}
                  className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 text-xs lg:text-sm rounded-xl shadow-lg"
                >
                  <Download className="w-4 h-4" /> Buy & Sell
                </Button>
                <Button
                  onClick={() => setActivePage("DEX")}
                  className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 text-xs lg:text-sm rounded-xl shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" /> Swap
                </Button>
                <Button
                  onClick={() => setActivePage("Lending")}
                  className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 text-xs lg:text-sm rounded-xl shadow-lg"
                >
                  <Banknote className="w-4 h-4" /> {t('nav.lending')}
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Portfolio and Quick Action */}
              <div className="lg:col-span-2 space-y-6">
                {/* Portfolio Section */}
                <section className="bg-[#1E293B] p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50">
                  <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex-1">
                      <h3 className="text-gray-400 text-base mb-2">Portfolio</h3>
                      <p className="text-3xl sm:text-4xl text-white font-bold flex flex-wrap items-center gap-2">
                        {walletLoading ? (
                          <span className="animate-pulse bg-slate-600 rounded w-40 h-10 inline-block"></span>
                        ) : (
                          totalValueFormatted || '$0.00'
                        )}
                        <span className="text-sm text-green-500 bg-green-500/10 px-3 py-1 rounded-full">↑ 3.56%</span>
                      </p>
                      
                      {/* USD Balance Display */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
                          <span className="text-xs text-gray-400">USD Balance</span>
                          <p className="text-lg font-bold text-green-400">
                            {walletLoading ? '...' : usdBalanceFormatted || '$0.00'}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsDepositModalOpen(true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Funds
                        </button>
                      </div>

                      {ethWalletAddress && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">ETH Wallet:</span>
                          <code className="text-xs text-blue-400 bg-slate-800 px-2 py-1 rounded font-mono">
                            {ethWalletAddress.slice(0, 10)}...{ethWalletAddress.slice(-8)}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ethWalletAddress)
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Copy address"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setIsSendReceiveModalOpen(true)}
                        className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        View Wallet Details
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full lg:w-auto gap-3">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsCryptoDropdownOpen(!isCryptoDropdownOpen)
                          }}
                          className="flex items-center bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 gap-2 min-w-[160px] hover:bg-slate-800 transition-colors"
                        >
                          <span className="font-semibold text-sm text-white whitespace-nowrap">
                            {cryptoOptions.find(c => c.symbol === selectedChartCrypto)?.name || 'Bitcoin USD'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isCryptoDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isCryptoDropdownOpen && (
                          <div className="absolute top-full mt-1 left-0 w-full bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden z-50 shadow-xl">
                            {cryptoOptions.map((crypto) => (
                              <button
                                key={crypto.symbol}
                                onClick={() => {
                                  setSelectedChartCrypto(crypto.symbol)
                                  setIsCryptoDropdownOpen(false)
                                }}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700 transition-colors ${
                                  selectedChartCrypto === crypto.symbol ? 'bg-slate-700 text-blue-400' : 'text-white'
                                }`}
                              >
                                {crypto.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="hover:bg-slate-700 transition-colors border border-slate-700 rounded-xl p-3 flex items-center justify-center">
                        <Settings2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center sm:justify-end mb-6">
                    <div className="flex bg-[#0F172A] rounded-xl border border-slate-700 p-1 gap-1">
                      {[
                        { label: '1D', days: 1 },
                        { label: '1W', days: 7 },
                        { label: '1M', days: 30 },
                        { label: '3M', days: 90 },
                        { label: '1Y', days: 365 },
                        { label: 'YTD', days: Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) }
                      ].map((period) => (
                        <button
                          key={period.label}
                          onClick={() => {
                            setChartPeriod(period.label)
                            setChartDays(period.days)
                          }}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                            chartPeriod === period.label 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="w-full h-48 sm:h-56 md:h-64" style={{ minHeight: '192px', minWidth: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={192}>
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#64748B"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={["dataMin - 1", "dataMax + 1"]}
                          tickFormatter={(value) => `${(typeof value === 'number' ? value : Number(value) || 0).toFixed(2)}K`}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "3 3" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="bg-[#1E293B] p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex border-b border-slate-700 gap-4">
                      {["Swap", "Send", "Receive"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setActiveTab(tab)
                            if (tab === "Send" || tab === "Receive") {
                              setIsSendReceiveModalOpen(true)
                            }
                          }}
                          className={`py-2 px-4 font-semibold transition-colors ${activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      1 BTC = ${btcPrice > 0 ? btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '---'}
                    </span>
                  </div>

                  {/* Swap Form */}
                  <div className="space-y-4">
                    {swapError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{swapError}</p>
                      </div>
                    )}
                    {swapSuccess && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-green-400 text-sm">{swapSuccess}</p>
                      </div>
                    )}
                    <div className="bg-[#0F172A] p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">From</p>
                        <input
                          type="number"
                          value={swapFromAmount}
                          onChange={(e) => setSwapFromAmount(e.target.value)}
                          placeholder="0.00"
                          className="text-white text-2xl font-bold bg-transparent border-none outline-none w-32"
                        />
                        {swapFromBalance && (
                          <p className="text-gray-500 text-xs">Balance: {swapFromBalance.amountFormatted}</p>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsSwapFromDropdownOpen(!isSwapFromDropdownOpen)
                            setIsSwapToDropdownOpen(false)
                          }}
                          className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <div className={`w-6 h-6 ${swapTokenOptions.find(t => t.symbol === swapFromToken)?.color || 'bg-orange-500'} rounded-full flex items-center justify-center font-bold text-white text-xs`}>
                            {swapTokenOptions.find(t => t.symbol === swapFromToken)?.icon || 'B'}
                          </div>
                          <span className="font-semibold text-white">{swapFromToken}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSwapFromDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSwapFromDropdownOpen && (
                          <div className="absolute top-full mt-1 right-0 w-40 bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden z-50 shadow-xl">
                            {swapTokenOptions.filter(t => t.symbol !== swapToToken).map((token) => (
                              <button
                                key={token.symbol}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSwapFromToken(token.symbol)
                                  setIsSwapFromDropdownOpen(false)
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 transition-colors ${
                                  swapFromToken === token.symbol ? 'bg-slate-700 text-blue-400' : 'text-white'
                                }`}
                              >
                                <div className={`w-5 h-5 ${token.color} rounded-full flex items-center justify-center font-bold text-white text-xs`}>
                                  {token.icon}
                                </div>
                                {token.symbol}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center my-2">
                      <button 
                        onClick={handleSwitchTokens}
                        className="bg-slate-600 p-2 rounded-full border-4 border-[#1E293B] text-white hover:bg-slate-500 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-[#0F172A] p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">To</p>
                        <input
                          type="number"
                          value={swapToAmount}
                          readOnly
                          placeholder="0.00"
                          className="text-white text-2xl font-bold bg-transparent border-none outline-none w-32"
                        />
                        {swapToBalance && (
                          <p className="text-gray-500 text-xs">Balance: {swapToBalance.amountFormatted}</p>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsSwapToDropdownOpen(!isSwapToDropdownOpen)
                            setIsSwapFromDropdownOpen(false)
                          }}
                          className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <div className={`w-6 h-6 ${swapTokenOptions.find(t => t.symbol === swapToToken)?.color || 'bg-purple-500'} rounded-full flex items-center justify-center font-bold text-white text-xs`}>
                            {swapTokenOptions.find(t => t.symbol === swapToToken)?.icon || 'E'}
                          </div>
                          <span className="font-semibold text-white">{swapToToken}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSwapToDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSwapToDropdownOpen && (
                          <div className="absolute top-full mt-1 right-0 w-40 bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden z-50 shadow-xl">
                            {swapTokenOptions.filter(t => t.symbol !== swapFromToken).map((token) => (
                              <button
                                key={token.symbol}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSwapToToken(token.symbol)
                                  setIsSwapToDropdownOpen(false)
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 transition-colors ${
                                  swapToToken === token.symbol ? 'bg-slate-700 text-blue-400' : 'text-white'
                                }`}
                              >
                                <div className={`w-5 h-5 ${token.color} rounded-full flex items-center justify-center font-bold text-white text-xs`}>
                                  {token.icon}
                                </div>
                                {token.symbol}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={handleSwapExecute}
                      disabled={swapLoading || !swapFromAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {swapLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Swap'
                      )}
                    </button>
                  </div>
                </section>
              </div>

              <aside className="lg:col-span-1 bg-[#1E293B] rounded-2xl h-fit shadow-xl border border-slate-700/50">
                <div className="p-6">
                  <h3 className="text-xl text-white font-bold mb-6">Recent transactions</h3>
                  <div className="space-y-4">
                    {recentTransactions.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
                    ) : (
                      recentTransactions.slice(0, 3).map((tx) => {
                        const isReceive = tx.type === 'receive' || tx.type === 'buy'
                        return (
                          <div 
                            key={tx.id}
                            onClick={() => {
                              if (tx.txHash) {
                                window.open(getExplorerUrl(tx.txHash, tx.fromCurrency), '_blank')
                              }
                            }}
                            className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${isReceive ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                                {isReceive ? (
                                  <ArrowDownLeft className="w-4 h-4 text-green-400" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-white text-sm">{tx.fromCurrency}</p>
                                <p className="text-xs text-gray-400">{formatTransactionDate(tx.createdAt)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white text-sm">{formatAmount(tx.amount, tx.fromCurrency)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${isReceive ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => setIsTransactionsModalOpen(true)}
                      className="w-full text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm"
                    >
                      See More
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )
    }
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-gray-300 font-sans flex flex-col">
      {/* Mobile Header with Hamburger */}
      <header className="md:hidden bg-[#1E293B] px-6 py-4 flex items-center justify-between border-b border-slate-700 shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <Image src="/logo.png" alt="Summit Logo" width={60} height={60} className="object-contain" />
           
          </div>
        </div>
        <button
          className="p-3 text-white hover:bg-slate-700 rounded-xl transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12M6 12h12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 bg-[#1E293B] p-4 flex-col justify-between border-r border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-8 p-2">
              <div>
                <Image src="/logo.png" alt="Summit Logo" width={100} height={32} className="object-contain" />
                <span className="text-xs text-green-400 flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Connected
                </span>
              </div>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActivePage("Dashboard")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Dashboard" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <LayoutDashboard className="w-5 h-5" /> {t('nav.dashboard')}
              </button>
              <button
                onClick={() => setActivePage("Activity")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Activity" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <Clock className="w-5 h-5" /> Activity
              </button>
              <button
                onClick={() => setActivePage("Buy & Sell")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Buy & Sell" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <ShoppingCart className="w-5 h-5" /> {t('nav.buy_sell')}
              </button>
              <button
                onClick={() => setActivePage("DEX")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "DEX" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <ArrowLeftRight className="w-5 h-5" /> {t('nav.dex_swap')}
              </button>
              <button
                onClick={() => setActivePage("P2P")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "P2P" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <Users className="w-5 h-5" /> {t('nav.p2p_trading')}
              </button>
              <button
                onClick={() => setActivePage("Live Market")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Live Market" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <BarChart className="w-5 h-5" /> {t('nav.live_market')}
              </button>
              <button
                onClick={() => setActivePage("Lending")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Lending" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <BanknoteIcon className="w-5 h-5" /> {t('nav.lending')}
              </button>
              <button
                onClick={() => setActivePage("NFC Shop")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "NFC Shop" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <CreditCardIcon className="w-5 h-5" /> {t('nav.nfc_shop')}
              </button>
              <button
                onClick={() => setActivePage("Partners")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Partners" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <Map className="w-5 h-5" /> {t('nav.partners')}
              </button>
              <button
                onClick={() => setActivePage("Settings")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Settings" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <Settings className="w-5 h-5" /> {t('nav.settings')}
              </button>
              <button
                onClick={() => setActivePage("Admin")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${activePage === "Admin" ? "bg-blue-500 text-white" : "hover:bg-slate-700/50 text-gray-300"}`}
              >
                <ShieldCheck className="w-5 h-5" /> {t('nav.admin')}
              </button>
            </nav>
            
            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left hover:bg-red-500/10 text-red-400 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" /> {t('nav.logout')}
              </button>
            </div>
            
            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Tokens"
                className="bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            <div className="mt-6 space-y-4">
              {balances.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No tokens yet</p>
              ) : (
                balances.slice(0, 5).map((balance) => (
                  <div key={balance.symbol} className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${balance.color} rounded-full flex items-center justify-center font-bold text-white`}>
                        {balance.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{balance.symbol}</p>
                        <p className="text-xs text-gray-400">{balance.amountFormatted}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-white">{balance.valueFormatted}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="bg-[#1E293B] w-80 h-full shadow-2xl border-r border-slate-600/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 h-full overflow-y-auto flex flex-col" style={{ paddingTop: "24px" }}>
                {/* Navigation Section */}
                <div style={{ marginBottom: "50px" }}>
                  <div
                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2"
                    style={{ marginBottom: "30px" }}
                  >
                    NAVIGATION
                  </div>
                  <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <button
                      onClick={() => {
                        setActivePage("Dashboard")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === "Dashboard" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      {t('nav.dashboard')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("Activity")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === "Activity" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      Activity
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("Buy & Sell")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 ${activePage === "Buy & Sell" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t('nav.buy_sell')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("DEX")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 ${activePage === "DEX" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      {t('nav.dex_swap')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("P2P")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 ${activePage === "P2P" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      <Users className="w-4 h-4" />
                      {t('nav.p2p_trading')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("Live Market")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === "Live Market" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      {t('nav.live_market')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("Settings")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === "Settings" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      {t('nav.settings')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("NFC")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 ${activePage === "NFC" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      <Shield className="w-4 h-4" />
                      NFC Security
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("NFC Shop")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 ${activePage === "NFC Shop" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t('nav.nfc_shop')}
                    </button>
                    <button
                      onClick={() => {
                        setActivePage("Admin")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 ${activePage === "Admin" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "hover:bg-slate-700/50 text-gray-300 hover:text-white"}`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {t('nav.admin')}
                    </button>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium flex items-center gap-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 border-t border-slate-700 mt-4 pt-6"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </nav>
                </div>

                {/* Search Section */}
                <div style={{ marginBottom: "50px", paddingLeft: "8px", paddingRight: "8px" }}>
                  <div
                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2"
                    style={{ marginBottom: "30px" }}
                  >
                    SEARCH
                  </div>
                  <input
                    type="text"
                    placeholder="Search Tokens"
                    className="bg-[#0F172A] border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-gray-500 transition-all duration-200"
                    style={{ width: "100%", minWidth: "280px" }}
                  />
                </div>

                {/* Assets Section */}
                <div className="flex-1" style={{ marginBottom: "40px" }}>
                  <div
                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2"
                    style={{ marginBottom: "30px" }}
                  >
                    ASSETS
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {balances.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No assets yet</p>
                    ) : (
                      balances.slice(0, 5).map((balance) => (
                        <div key={balance.symbol} className="flex items-center justify-between p-4 hover:bg-slate-700/30 rounded-xl transition-all duration-200 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 ${balance.color} rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg`}>
                              {balance.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors">
                                {balance.symbol}
                              </p>
                              <p className="text-sm text-gray-400">{balance.amountFormatted}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white text-base">{balance.valueFormatted}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto">{renderPageContent()}</div>
        </main>
      </div>

      {/* Recent Transactions Modal */}
      <RecentTransactionsModal isOpen={isTransactionsModalOpen} onClose={() => setIsTransactionsModalOpen(false)} />

      {/* Send & Receive Modal */}
      <SendReceiveModal
        isOpen={isSendReceiveModalOpen}
        onClose={() => setIsSendReceiveModalOpen(false)}
        onTokenSelect={handleTokenSelect}
      />

      {/* Send Coin Modal */}
      <SendCoinModal
        isOpen={isSendCoinModalOpen}
        onClose={() => setIsSendCoinModalOpen(false)}
        onBack={handleSendCoinBack}
        selectedToken={selectedToken?.symbol}
        onProceed={handleSendCoinProceed}
      />

      <HardwareWalletModal
        isOpen={isHardwareWalletModalOpen}
        onClose={handleHardwareWalletCancel}
        onCancel={handleHardwareWalletCancel}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={handleReceiveClose}
        onBack={handleReceiveBack}
        selectedToken={selectedToken?.symbol}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={(amount, newBalance) => {
          refreshBalances()
          setIsDepositModalOpen(false)
        }}
      />

      {/* Transaction Authorized Modal */}
      <TransactionAuthorizedModal
        isOpen={isTransactionAuthorizedModalOpen}
        onClose={() => setIsTransactionAuthorizedModalOpen(false)}
      />

      {/* Choose Network Modal */}
      <ChooseNetworkModal
        isOpen={isChooseNetworkModalOpen}
        onClose={() => setIsChooseNetworkModalOpen(false)}
        onBack={handleChooseNetworkBack}
        selectedToken={selectedToken?.symbol}
        onProceed={handleNetworkSelect}
      />

      {/* Portfolio Details Modal */}
      <PortfolioDetailsModal
        isOpen={isPortfolioDetailsModalOpen}
        onClose={handlePortfolioDetailsClose}
        onBack={handlePortfolioDetailsBack}
        selectedToken={selectedToken?.symbol}
        selectedNetwork={selectedNetwork}
      />

      {/* Buy & Sell Modal */}
      <BuySellModal
        isOpen={isBuySellModalOpen}
        onClose={handleBuySellClose}
        onBuyTokenSelect={handleBuyTokenSelect}
        onSellTokenSelect={handleSellTokenSelect}
      />

      {/* Buy Coin Modal */}
      <BuyCoinModal
        isOpen={isBuyCoinModalOpen}
        onClose={() => setIsBuyCoinModalOpen(false)}
        onBack={handleBuyCoinBack}
        selectedToken={selectedToken?.name}
        onProceed={handleBuyCoinProceed}
      />

      {/* Sell Coin Modal */}
      <SellCoinModal
        isOpen={isSellCoinModalOpen}
        onClose={() => setIsSellCoinModalOpen(false)}
        onBack={handleSellCoinBack}
        selectedToken={selectedToken?.name}
        onProceed={handleSellCoinProceed}
      />
    </div>
  )
}

export default DashboardPage
