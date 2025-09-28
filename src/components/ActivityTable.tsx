'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';

// Define the structure for a transaction
interface Transaction {
  id: number;
  date: string;
  type: 'Send' | 'Receive';
  counterparty: string;
  amount: string;
  txId: string;
  networkFee: string;
  time: string;
  status: 'Completed';
}

// Sample data for transactions
const transactions: Transaction[] = [
  { id: 1, date: 'Today', type: 'Send', counterparty: 'To 0x95***353', amount: '0.904BTC', txId: '0x95***353', networkFee: '$1.34', time: '11:45 AM', status: 'Completed' },
  { id: 2, date: 'Today', type: 'Send', counterparty: 'To 0x95***353', amount: '0.904BTC', txId: '0x95***353', networkFee: '$1.34', time: '11:45 AM', status: 'Completed' },
  { id: 3, date: 'Today', type: 'Receive', counterparty: 'To 0x95***353', amount: '0.904BTC', txId: '0x95***353', networkFee: '$1.34', time: '11:45 AM', status: 'Completed' },
  { id: 4, date: 'Today', type: 'Send', counterparty: 'To 0x95***353', amount: '0.904BTC', txId: '0x95***353', networkFee: '$1.34', time: '11:45 AM', status: 'Completed' },
  { id: 5, date: 'Today', type: 'Receive', counterparty: 'To 0x95***353', amount: '0.904BTC', txId: '0x95***353', networkFee: '$1.34', time: '11:45 AM', status: 'Completed' },
  
];

// Main Component
interface ActivityTableProps {
  className?: string;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('All');

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
            {['Send', 'Receive', 'Stake'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap ${activeTab === tab ? 'bg-white text-slate-900' : 'bg-transparent hover:bg-slate-700 text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          
          {/* Search and Filter - Hidden on Mobile */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
              <input 
                type="text" 
                placeholder="Search Tokens" 
                className="w-48 bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
              />
            </div>
            <button className="p-2 bg-[#2A3B51] rounded-lg hover:bg-slate-600 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-6 w-full">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-[#0F172A] border border-slate-700 rounded-xl p-5 hover:bg-slate-700/20 transition-colors w-full max-w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${tx.type === 'Send' ? 'text-red-400 bg-red-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                  {tx.type}
                </span>
                <p className="text-gray-400 text-sm mt-2">{tx.date} • {tx.time}</p>
              </div>
              <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-sm font-medium">
                {tx.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-base">Amount:</span>
                <span className="text-white font-semibold text-base">{tx.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-base">To:</span>
                <span className="text-white text-base">{tx.counterparty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-base">Network Fee:</span>
                <span className="text-white text-base">{tx.networkFee}</span>
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
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-white text-base">{tx.date}</td>
                <td className={`p-4 font-semibold text-base ${tx.type === 'Send' ? 'text-red-400' : 'text-blue-400'}`}>
                  {tx.type}
                </td>
                <td className="p-4 text-white text-base">{tx.counterparty}</td>
                <td className="p-4 font-semibold text-white text-base">{tx.amount}</td>
                <td className="p-4 text-white text-base hidden lg:table-cell">{tx.txId}</td>
                <td className="p-4 text-white text-base hidden md:table-cell">{tx.networkFee}</td>
                <td className="p-4 text-white text-base hidden lg:table-cell">{tx.time}</td>
                <td className="p-4">
                  <span className="text-green-400 bg-green-500/10 px-3 py-2 rounded-full font-medium text-sm">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
