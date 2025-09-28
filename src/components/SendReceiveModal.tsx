'use client';

import { Search, X } from 'lucide-react';
import React, { useState } from 'react';

import { Token } from '@/types';

// Reusable TokenIcon component for colored circle icons
const TokenIcon = ({ symbol, bgColor }: { symbol: string; bgColor: string }) => (
    <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center font-bold text-white text-sm`}>
        {symbol.charAt(0)}
    </div>
);

// Sample data for tokens
const tokens: Token[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', icon: <TokenIcon symbol="B" bgColor="bg-orange-500" />, balance: 0, value: 0, change: 0 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', icon: <TokenIcon symbol="E" bgColor="bg-purple-500" />, balance: 0, value: 0, change: 0 },
  { id: '3', symbol: 'SOL', name: 'Solana', icon: <TokenIcon symbol="S" bgColor="bg-teal-500" />, balance: 0, value: 0, change: 0 },
  { id: '4', symbol: 'TON', name: 'Ton', icon: <TokenIcon symbol="T" bgColor="bg-cyan-500" />, balance: 0, value: 0, change: 0 },
  { id: '5', symbol: 'USDT', name: 'Tether USDT', icon: <TokenIcon symbol="T" bgColor="bg-green-500" />, balance: 0, value: 0, change: 0 },
  { id: '6', symbol: 'SOL', name: 'SOL', icon: <TokenIcon symbol="S" bgColor="bg-teal-500" />, balance: 0, value: 0, change: 0 },
];

// Main Modal Component
interface SendReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: Token) => void;
  onReceiveTokenSelect: (token: Token) => void;
}

const SendReceiveModal: React.FC<SendReceiveModalProps> = ({ isOpen, onClose, onTokenSelect, onReceiveTokenSelect }) => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');

  const handleTokenClick = (token: Token) => {
    if (activeTab === 'send') {
      onTokenSelect(token);
    } else if (activeTab === 'receive') {
      onReceiveTokenSelect(token);
    }
  };

  if (!isOpen) return null;

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50" style={{padding:'10px'}}>
      <div className="bg-[#1E293B] rounded-xl w-[900px] max-w-[500px] text-white shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700" style={{padding:'10px'}}>
          <h2 className="text-lg font-bold" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Send & Receive</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
            <button 
                onClick={() => setActiveTab('send')}
                className={`w-1/2 py-3 font-semibold transition-colors text-sm ${activeTab === 'send' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
                Send
            </button>
            <button 
                onClick={() => setActiveTab('receive')}
                className={`w-1/2 py-3 font-semibold transition-colors text-sm ${activeTab === 'receive' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
                Receive
            </button>
        </div>

        {/* Content based on tab */}
        <div className="p-4">
           {/* Search Bar */}
           <div className="relative mb-4" >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{marginLeft:'420px'}} />
              <input 
                type="text" 
                placeholder="Search Tokens" 
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
              />
            </div>

            {/* Token List */}
            <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                 <div className="space-y-3">
                    {tokens.map(token => (
                        <div 
                          key={token.id} 
                          onClick={() => handleTokenClick(token)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors" 
                          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                        >
                            {token.icon}
                            <div>
                                <p className="font-semibold text-white">{token.symbol}</p>
                                <p className="text-xs text-gray-400">{token.name}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SendReceiveModal;
