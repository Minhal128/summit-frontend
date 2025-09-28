'use client';

import { Search, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import React from 'react';

// Define the structure for a transaction
interface Transaction {
  id: string;
  type: 'send' | 'receive';
  currency: 'BTC' | 'ETH';
  amount: string;
  date: string;
  time: string;
}

// Sample data for recent transactions
const transactions: Transaction[] = [
  { id: '1', type: 'receive', currency: 'BTC', amount: '0.003644BTC', date: 'September 1, 2025', time: '9:12AM' },
  { id: '2', type: 'send', currency: 'ETH', amount: '0.003644ETH', date: 'September 1, 2025', time: '9:12AM' },
  { id: '3', type: 'send', currency: 'ETH', amount: '0.002144ETH', date: 'August 31, 2025', time: '8:45AM' },
  { id: '4', type: 'receive', currency: 'BTC', amount: '0.001234BTC', date: 'August 31, 2025', time: '7:30AM' },
  { id: '5', type: 'send', currency: 'ETH', amount: '0.005678ETH', date: 'August 30, 2025', time: '6:15PM' },
  { id: '6', type: 'receive', currency: 'BTC', amount: '0.000987BTC', date: 'August 30, 2025', time: '3:22PM' },
  { id: '7', type: 'send', currency: 'ETH', amount: '0.001456ETH', date: 'August 29, 2025', time: '11:45AM' },
  { id: '8', type: 'receive', currency: 'BTC', amount: '0.002345BTC', date: 'August 29, 2025', time: '10:30AM' },
];

// Reusable TransactionItem component
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isSend = transaction.type === 'send';
  
  return (
    <div className="flex items-center justify-between py-3" style={{padding:'10px'}}>
      <div className="flex items-center gap-4" style={{padding:'10px'}}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSend ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
          {isSend ? <ArrowUpRight className="w-4 h-4 text-red-400" /> : <ArrowDownLeft className="w-4 h-4 text-green-400" />}
        </div>
        <div>
          <p className="font-semibold text-white">{transaction.currency}</p>
          <p className="text-xs text-gray-400">{transaction.date} | {transaction.time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-white">{transaction.amount}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${isSend ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
          {isSend ? 'Send' : 'Receive'}
        </span>
      </div>
    </div>
  );
};

// Main Modal Component
interface RecentTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecentTransactionsModal: React.FC<RecentTransactionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-md text-white font-sans shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700" style={{padding:'10px'}}>
          <h2 className="text-lg font-bold">Recent Transactions</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" style={{marginLeft:'350px'}}/>
            <input 
              type="text" 
              placeholder="Search Transactions" 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            />
          </div>
        </div>

        {/* Transaction List */}
        <div className="px-4 pb-4 overflow-y-auto max-h-[60vh]">
          <div className="divide-y divide-slate-700">
            {transactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionsModal;
