'use client';

import { Search, SlidersHorizontal, Loader2, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getTransactionHistory, formatTransactionDate, formatAmount, getExplorerUrl, Transaction } from '@/lib/transactionHistory';

// Main Component
interface ActivityTableProps {
  className?: string;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const typeFilter = activeTab === 'All' ? undefined : activeTab.toLowerCase();
        const result = await getTransactionHistory({ 
          limit: 20, 
          type: typeFilter 
        });
        if (result.success) {
          setTransactions(result.transactions);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeTab]);

  // Filter transactions by search query
  const filteredTransactions = transactions.filter(tx => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tx.fromCurrency?.toLowerCase().includes(query) ||
      tx.toAddress?.toLowerCase().includes(query) ||
      tx.txHash?.toLowerCase().includes(query)
    );
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return 'N/A';
    if (address.length <= 13) return address;
    return `${address.slice(0, 6)}***${address.slice(-3)}`;
  };

  return (
    <div className={`bg-[#1E293B] p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50 w-full max-w-full ${className}`}>
      {/* Header and Filters */}
      <div className="mb-8 mt-6">
        {/* Tab Buttons - Mobile: Full width, Desktop: Left side */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 min-w-0 flex-shrink-0">
            <button 
              onClick={() => setActiveTab('All')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap ${activeTab === 'All' ? 'bg-white text-slate-900' : 'bg-[#2A3B51] hover:bg-slate-600 text-white'}`}>
              All
            </button>
            {['Send', 'Receive', 'Swap'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap ${activeTab === tab ? 'bg-white text-slate-900' : 'bg-transparent hover:bg-slate-700 text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          
          {/* Search and Filter */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
              <input 
                type="text" 
                placeholder="Search Tokens" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
              />
            </div>
            <button className="p-2 bg-[#2A3B51] rounded-lg hover:bg-slate-600 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No transactions found</p>
          <p className="text-gray-500 text-sm mt-2">Your transaction history will appear here</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-6 w-full">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className="bg-[#0F172A] border border-slate-700 rounded-xl p-5 hover:bg-slate-700/20 transition-colors w-full max-w-full cursor-pointer"
                onClick={() => tx.txHash && window.open(getExplorerUrl(tx.txHash, tx.fromCurrency), '_blank')}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      tx.type === 'send' ? 'text-red-400 bg-red-500/10' : 
                      tx.type === 'receive' ? 'text-blue-400 bg-blue-500/10' :
                      'text-purple-400 bg-purple-500/10'
                    }`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                    <p className="text-gray-400 text-sm mt-2">{formatDate(tx.createdAt)} • {formatTime(tx.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tx.status === 'confirmed' ? 'text-green-400 bg-green-500/10' :
                    tx.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10' :
                    'text-red-400 bg-red-500/10'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-base">Amount:</span>
                    <span className="text-white font-semibold text-base">{formatAmount(tx.amount, tx.fromCurrency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-base">To:</span>
                    <span className="text-white text-base">{truncateAddress(tx.toAddress)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-base">Network Fee:</span>
                    <span className="text-white text-base">${(tx.feeUSD || tx.fee || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto w-full">
            <table className="w-full text-left min-w-full">
              <thead>
                <tr className="text-gray-400 border-b border-slate-700">
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold">Counterparty</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-left font-semibold hidden lg:table-cell">TxID</th>
                  <th className="p-4 text-left font-semibold hidden md:table-cell">Network Fee</th>
                  <th className="p-4 text-left font-semibold hidden lg:table-cell">Time</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors cursor-pointer"
                    onClick={() => tx.txHash && window.open(getExplorerUrl(tx.txHash, tx.fromCurrency), '_blank')}
                  >
                    <td className="p-4 text-white text-base">{formatDate(tx.createdAt)}</td>
                    <td className={`p-4 font-semibold text-base ${
                      tx.type === 'send' ? 'text-red-400' : 
                      tx.type === 'receive' ? 'text-blue-400' :
                      'text-purple-400'
                    }`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td className="p-4 text-white text-base">
                      {tx.type === 'send' ? 'To ' : 'From '}{truncateAddress(tx.toAddress || tx.fromAddress)}
                    </td>
                    <td className="p-4 font-semibold text-white text-base">{formatAmount(tx.amount, tx.fromCurrency)}</td>
                    <td className="p-4 text-white text-base hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        {truncateAddress(tx.txHash || 'Pending')}
                        {tx.txHash && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      </div>
                    </td>
                    <td className="p-4 text-white text-base hidden md:table-cell">${(tx.feeUSD || tx.fee || 0).toFixed(2)}</td>
                    <td className="p-4 text-white text-base hidden lg:table-cell">{formatTime(tx.createdAt)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-2 rounded-full font-medium text-sm ${
                        tx.status === 'confirmed' ? 'text-green-400 bg-green-500/10' :
                        tx.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10' :
                        'text-red-400 bg-red-500/10'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityTable;
