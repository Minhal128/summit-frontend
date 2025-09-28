'use client';

import type { NextPage } from 'next';
import { 
  LayoutDashboard, 
  Clock, 
  Settings, 
  BarChart, 
  Search, 
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  ChevronUp,
  Settings2,
  Wallet,
  Send,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import RecentTransactionsModal from '@/components/RecentTransactionsModal';
import SendReceiveModal from '@/components/SendReceiveModal';
import SendCoinModal from '@/components/SendCoinModal';
import TransactionAuthorizedModal from '@/components/TransactionAuthorizedModal';
import ChooseNetworkModal from '@/components/ChooseNetworkModal';
import PortfolioDetailsModal from '@/components/PortfolioDetailsModal';
import BuySellModal from '@/components/BuySellModal';
import BuyCoinModal from '@/components/BuyCoinModal';
import SellCoinModal from '@/components/SellCoinModal';
import ActivityTable from '@/components/ActivityTable';
import SettingsPage from '@/components/SettingsPage';
import LiveMarketPage from '@/components/LiveMarketPage';
import Header from '@/components/Header';
import { Token, ChartDataPoint, TooltipProps, Network } from '@/types';

// Data for the chart
const chartData = [
  { name: 'Sun', value: 26.50 },
  { name: 'Mon', value: 26.80 },
  { name: 'Tue', value: 27.20 },
  { name: 'Wed', value: 27.55 },
  { name: 'Thu', value: 27.20 },
  { name: 'Fri', value: 27.40 },
  { name: 'Sat', value: 26.90 },
];

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    // Mocking time for the tooltip as in the screenshot
    const time = "11:33:58 AM"; 
    return (
      <div className="bg-white text-black p-3 rounded-md shadow-lg text-center">
        <p className="font-bold text-sm">{`${time}`}</p>
        <p className="text-xs font-semibold">{`$${payload[0].value.toFixed(3)}`}</p>
      </div>
    );
  }
  return null;
};

// Main Dashboard Component
const DashboardPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState('Swap');
  const [activePage, setActivePage] = useState('Dashboard');
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isSendReceiveModalOpen, setIsSendReceiveModalOpen] = useState(false);
  const [isSendCoinModalOpen, setIsSendCoinModalOpen] = useState(false);
  const [isTransactionAuthorizedModalOpen, setIsTransactionAuthorizedModalOpen] = useState(false);
  const [isChooseNetworkModalOpen, setIsChooseNetworkModalOpen] = useState(false);
  const [isPortfolioDetailsModalOpen, setIsPortfolioDetailsModalOpen] = useState(false);
  const [isBuySellModalOpen, setIsBuySellModalOpen] = useState(false);
  const [isBuyCoinModalOpen, setIsBuyCoinModalOpen] = useState(false);
  const [isSellCoinModalOpen, setIsSellCoinModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsSendReceiveModalOpen(false);
    setIsSendCoinModalOpen(true);
  };

  const handleSendCoinBack = () => {
    setIsSendCoinModalOpen(false);
    setIsSendReceiveModalOpen(true);
  };

  const handleSendCoinProceed = () => {
    setIsSendCoinModalOpen(false);
    setIsTransactionAuthorizedModalOpen(true);
  };

  const handleTransactionAuthorizedClose = () => {
    setIsTransactionAuthorizedModalOpen(false);
    // Reset all modals
    setIsSendReceiveModalOpen(false);
    setSelectedToken(null);
  };

  // Receive flow handlers
  const handleReceiveTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsSendReceiveModalOpen(false);
    setIsChooseNetworkModalOpen(true);
  };

  const handleChooseNetworkBack = () => {
    setIsChooseNetworkModalOpen(false);
    setIsSendReceiveModalOpen(true);
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsChooseNetworkModalOpen(false);
    setIsPortfolioDetailsModalOpen(true);
  };

  const handlePortfolioDetailsBack = () => {
    setIsPortfolioDetailsModalOpen(false);
    setIsChooseNetworkModalOpen(true);
  };

  const handlePortfolioDetailsClose = () => {
    setIsPortfolioDetailsModalOpen(false);
    // Reset all modals
    setIsSendReceiveModalOpen(false);
    setSelectedToken(null);
    setSelectedNetwork(null);
  };

  // Buy & Sell flow handlers
  const handleBuyTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsBuySellModalOpen(false);
    setIsBuyCoinModalOpen(true);
  };

  const handleSellTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsBuySellModalOpen(false);
    setIsSellCoinModalOpen(true);
  };

  const handleBuyCoinBack = () => {
    setIsBuyCoinModalOpen(false);
    setIsBuySellModalOpen(true);
  };

  const handleBuyCoinProceed = () => {
    setIsBuyCoinModalOpen(false);
    setIsTransactionAuthorizedModalOpen(true);
  };

  const handleSellCoinBack = () => {
    setIsSellCoinModalOpen(false);
    setIsBuySellModalOpen(true);
  };

  const handleSellCoinProceed = () => {
    setIsSellCoinModalOpen(false);
    setIsTransactionAuthorizedModalOpen(true);
  };

  const handleBuySellClose = () => {
    setIsBuySellModalOpen(false);
    setSelectedToken(null);
  };

  // Function to render content based on active page
  const renderPageContent = () => {
    switch (activePage) {
      case 'Activity':
        return <ActivityTable className="w-full" />;
      case 'Settings':
        return <SettingsPage className="w-full" />;
      case 'Live Market':
        return <LiveMarketPage className="w-full" />;
      default: // Dashboard
        return (
          <>
            <header className="dashboard-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 mt-4 sm:mt-6 gap-4 px-2 sm:px-0">
              <h2 className="text-2xl md:text-3xl text-white font-bold">Dashboard</h2>
              <div className="dashboard-buttons flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => setIsSendReceiveModalOpen(true)}
                  className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 min-w-0 sm:min-w-[160px] px-6 py-3 text-sm rounded-xl shadow-lg"
                >
                  <Send className="w-4 h-4" /> Send & Receive
                </Button>
                <Button 
                  onClick={() => setIsBuySellModalOpen(true)}
                  className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 min-w-0 sm:min-w-[160px] px-6 py-3 text-sm rounded-xl shadow-lg"
                >
                  <Download className="w-4 h-4" /> Buy & Sell
                </Button>
              </div>
            </header>

            <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-6">
              {/* Left Column: Portfolio and Quick Action */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Portfolio Section */}
                <section className="bg-[#1E293B] p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50 mx-4 sm:mx-6">
                  <div className="portfolio-header flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div className="px-2 sm:px-0">
                      <h3 className="text-gray-400 text-base mb-2">Portfolio</h3>
                      <p className="portfolio-value text-3xl sm:text-4xl text-white font-bold flex flex-wrap items-center gap-2">
                        $40,974.35 
                        <span className="text-sm text-green-500 bg-green-500/10 px-3 py-1 rounded-full">↑ 3.56%</span>
                      </p>
                    </div>
                    <div className="portfolio-controls flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto gap-3">
                        <div className="flex items-center bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 gap-2 min-w-[140px]">
                            <span className="font-semibold text-sm text-white whitespace-nowrap">Bitcoin USD</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                        </div>
                       <button className="hover:bg-slate-700 transition-colors border border-slate-700 rounded-xl p-3 flex items-center justify-center">
                         <Settings2 className="w-5 h-5 text-gray-400" />
                       </button>
                    </div>
                  </div>

                   <div className="flex justify-center sm:justify-end mb-6 px-2 sm:px-0">
                      <div className="flex bg-[#0F172A] rounded-xl border border-slate-700 p-1 gap-1">
                        <button className="text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-colors px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer">1D</button>
                        <button className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg border-none cursor-pointer">1W</button>
                        <button className="text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-colors px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer">1M</button>
                        <button className="text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-colors px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer">3M</button>
                        <button className="text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-colors px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer">1Y</button>
                        <button className="text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-colors px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer">YTD</button>
                      </div>
                    </div>

                  {/* Chart */}
                  <div className="w-full h-48 sm:h-56 md:h-64 px-4 sm:px-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(value) => `${value.toFixed(2)}K`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                
                {/* Quick Action Section */}
                <section className="bg-[#1E293B] p-6 rounded-xl mx-4 sm:mx-6" style={{ marginTop: '10px', padding:'10px', marginBottom:'10px'}}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex border-b border-slate-700 gap-4" >
                      {['Swap', 'Send', 'Receive'].map(tab => (
                        <button 
                          key={tab} 
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 px-4 font-semibold transition-colors ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">1 BTC = $22,741.01</span>
                  </div>
                  
                  {/* Swap Form */}
                  <div className="space-y-4">
                    <div className="bg-[#0F172A] p-4 rounded-lg flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                      <div>
                        <p className="text-gray-400 text-sm">From</p>
                        <p className="text-white text-2xl font-bold">0.5433</p>
                      </div>
                      <div className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-lg">
                         <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-xs">B</div>
                         <span className="font-semibold text-white">BTC</span>
                         <ChevronDown className="w-4 h-4"/>
                      </div>
                    </div>
                    <div className="flex justify-center my-[-10px] z-10">
                        <button className="bg-slate-600 p-2 rounded-full border-4 border-[#1E293B] text-white hover:bg-slate-500">
                            <ChevronUp className="w-4 h-4"/>
                            <ChevronDown className="w-4 h-4"/>
                        </button>
                    </div>
                    <div className="bg-[#0F172A] p-4 rounded-lg flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                      <div>
                        <p className="text-gray-400 text-sm">To</p>
                        <p className="text-white text-2xl font-bold">0.5433</p>
                      </div>
                       <div className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-lg">
                         <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-xs">E</div>
                         <span className="font-semibold text-white">ETH</span>
                         <ChevronDown className="w-4 h-4"/>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Swap</button>
                  </div>

                </section>
              </div>
              
              {/* Right Column: Recent Transactions */}
              <aside className="lg:col-span-1 bg-[#1E293B] rounded-2xl h-fit shadow-xl border border-slate-700/50 mx-4 sm:mx-6" style={{ marginBottom: '50px' }}>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl text-white font-bold mb-6">Recent transactions</h3>
                  <div className="space-y-4 px-2">
                    {/* Transaction Item */}
                    <div className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <ArrowDownLeft className="w-4 h-4 text-green-400"/>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">BTC</p>
                          <p className="text-xs text-gray-400">September 1, 2025 | 9:12AM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white text-sm">0.003644BTC</p>
                        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Receive</span>
                      </div>
                    </div>
                    {/* Transaction Item */}
                    <div className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-red-400"/>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">ETH</p>
                          <p className="text-xs text-gray-400">September 1, 2025 | 9:12AM</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-semibold text-white text-sm">0.003644ETH</p>
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Send</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 mt-8 mb-6">
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
        );
    }
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-gray-300 font-sans flex flex-col" >
      {/* Mobile Header with Hamburger */}
      <header className="md:hidden bg-[#1E293B] px-6 py-4 flex items-center justify-between border-b border-slate-700 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">SUMMIT FLEX 3</h1>
            <span className="text-sm text-green-400 flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
              Connected
            </span>
          </div>
        </div>
        <button 
          className="p-3 text-white hover:bg-slate-700 rounded-xl transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#1E293B] p-4 flex-col justify-between border-r border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-8 p-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">SUMMIT FLEX 3</h1>
                <span className="text-xs text-green-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Connected
                </span>
              </div>
            </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActivePage('Dashboard')}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left ${activePage === 'Dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-slate-700/50 text-gray-300'}`} 
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button 
              onClick={() => setActivePage('Activity')}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left ${activePage === 'Activity' ? 'bg-blue-500 text-white' : 'hover:bg-slate-700/50 text-gray-300'}`} 
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
              <Clock className="w-5 h-5" /> Activity
            </button>
            <button 
              onClick={() => setActivePage('Settings')}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left ${activePage === 'Settings' ? 'bg-blue-500 text-white' : 'hover:bg-slate-700/50 text-gray-300'}`} 
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
              <Settings className="w-5 h-5" /> Settings
            </button>
            <button 
              onClick={() => setActivePage('Live Market')}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left ${activePage === 'Live Market' ? 'bg-blue-500 text-white' : 'hover:bg-slate-700/50 text-gray-300'}`} 
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
              <BarChart className="w-5 h-5" /> Live Market
            </button>
          </nav>
          <div className="relative mt-6" style={{ marginLeft: '15px', marginRight: '15px', marginTop: '10px', marginBottom: '10px' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input type="text" placeholder="Search Tokens" className="bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" style={{ width: 'calc(100% - 30px)', paddingLeft: '40px' }}/>
          </div>
          <div className="mt-6 space-y-4">
            {/* Wallet Items */}
            <div className="flex items-center justify-between" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">B</div>
                <div>
                  <p className="font-semibold text-white">BTC</p>
                  <p className="text-xs text-gray-400">0.003644BTC</p>
                </div>
              </div>
              <p className="font-semibold text-white">$680.67</p>
            </div>
             <div className="flex items-center justify-between" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">E</div>
                <div>
                  <p className="font-semibold text-white">ETH</p>
                  <p className="text-xs text-gray-400">0.3644ETH</p>
                </div>
              </div>
              <p className="font-semibold text-white">$280.00</p>
            </div>
            <div className="mt-6 space-y-4">
              {/* Wallet Items */}
              <div className="flex items-center justify-between" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">B</div>
                  <div>
                    <p className="font-semibold text-white">BTC</p>
                    <p className="text-xs text-gray-400">0.003644BTC</p>
                  </div>
                </div>
                <p className="font-semibold text-white">$680.67</p>
              </div>
               <div className="flex items-center justify-between" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">E</div>
                  <div>
                    <p className="font-semibold text-white">ETH</p>
                    <p className="text-xs text-gray-400">0.3644ETH</p>
                  </div>
                </div>
                <p className="font-semibold text-white">$280.00</p>
              </div>
               <div className="flex items-center justify-between" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold text-white">S</div>
                  <div>
                    <p className="font-semibold text-white">SOL</p>
                    <p className="text-xs text-gray-400">456SOL</p>
                  </div>
                </div>
                <p className="font-semibold text-white">$1,280.00</p>
              </div>
            </div>
          </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-[#1E293B] w-80 h-full shadow-2xl border-r border-slate-600/50" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 h-full overflow-y-auto flex flex-col" style={{ paddingTop: '24px' }}>
                {/* Navigation Section */}
                <div style={{ marginBottom: '50px' }}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2" style={{ marginBottom: '30px' }}>NAVIGATION</div>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <button 
                      onClick={() => {setActivePage('Dashboard'); setIsMobileMenuOpen(false);}}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === 'Dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'}`}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {setActivePage('Activity'); setIsMobileMenuOpen(false);}}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === 'Activity' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'}`}
                    >
                      Activity
                    </button>
                    <button 
                      onClick={() => {setActivePage('Settings'); setIsMobileMenuOpen(false);}}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === 'Settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'}`}
                    >
                      Settings
                    </button>
                    <button 
                      onClick={() => {setActivePage('Live Market'); setIsMobileMenuOpen(false);}}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium ${activePage === 'Live Market' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'}`}
                    >
                      Live Market
                    </button>
                  </nav>
                </div>

                {/* Search Section */}
                <div style={{ marginBottom: '50px', paddingLeft: '8px', paddingRight: '8px' }}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2" style={{ marginBottom: '30px' }}>SEARCH</div>
                  <input 
                    type="text" 
                    placeholder="Search Tokens" 
                    className="bg-[#0F172A] border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-gray-500 transition-all duration-200"
                    style={{ width: '100%', minWidth: '280px' }}
                  />
                </div>

                {/* Assets Section */}
                <div className="flex-1" style={{ marginBottom: '40px' }}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2" style={{ marginBottom: '30px' }}>ASSETS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 rounded-xl transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">B</div>
                        <div>
                          <p className="font-semibold text-white text-base group-hover:text-orange-400 transition-colors">BTC</p>
                          <p className="text-sm text-gray-400">0.003644BTC</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white text-base">$680.67</p>
                        <p className="text-sm text-green-400">+2.4%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 rounded-xl transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">E</div>
                        <div>
                          <p className="font-semibold text-white text-base group-hover:text-purple-400 transition-colors">ETH</p>
                          <p className="text-sm text-gray-400">0.3644ETH</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white text-base">$280.00</p>
                        <p className="text-sm text-green-400">+1.8%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 rounded-xl transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">S</div>
                        <div>
                          <p className="font-semibold text-white text-base group-hover:text-teal-400 transition-colors">SOL</p>
                          <p className="text-sm text-gray-400">456SOL</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white text-base">$1,280.00</p>
                        <p className="text-sm text-red-400">-0.5%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto">
            {renderPageContent()}
          </div>
        </main>
      </div>

      {/* Recent Transactions Modal */}
      <RecentTransactionsModal 
        isOpen={isTransactionsModalOpen} 
        onClose={() => setIsTransactionsModalOpen(false)} 
      />

      {/* Send & Receive Modal */}
      <SendReceiveModal 
        isOpen={isSendReceiveModalOpen} 
        onClose={() => setIsSendReceiveModalOpen(false)}
        onTokenSelect={handleTokenSelect}
        onReceiveTokenSelect={handleReceiveTokenSelect}
      />

      {/* Send Coin Modal */}
      <SendCoinModal 
        isOpen={isSendCoinModalOpen}
        onClose={() => setIsSendCoinModalOpen(false)}
        onBack={handleSendCoinBack}
        selectedToken={selectedToken?.symbol}
        onProceed={handleSendCoinProceed}
      />

      {/* Transaction Authorized Modal */}
      <TransactionAuthorizedModal 
        isOpen={isTransactionAuthorizedModalOpen}
        onClose={handleTransactionAuthorizedClose}
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
  );
};

export default DashboardPage;

