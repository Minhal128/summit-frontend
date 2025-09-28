'use client';

import { X, ArrowLeft, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

// Define the structure for a recent transaction
interface RecentTransaction {
  id: string;
  address: string;
  network: string;
}

// Sample data for recent transactions
const recentTransactions: RecentTransaction[] = [
  { id: '1', address: 'TDGD735DDHDJDDGDHD', network: 'Tron (TRC20)' },
  { id: '2', address: 'TDGD735DDHDJDDGDHD', network: 'Tron (TRC20)' },
];

// Main Modal Component
interface SendCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  selectedToken?: string;
  onProceed: () => void;
}

const SendCoinModal: React.FC<SendCoinModalProps> = ({ 
  isOpen, 
  onClose, 
  onBack, 
  selectedToken = 'BTC',
  onProceed 
}) => {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('XXXXXXXXXXXXXXXXXXXX');
  const [network, setNetwork] = useState('');
  const [description, setDescription] = useState('Thank You');

  if (!isOpen) return null;

  const handleProceed = () => {
    // Validate form here if needed
    onProceed();
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50" style={{padding:'10px'}}>
      <div className="bg-[#1E293B] rounded-xl w-full max-w-md text-white shadow-2xl" style={{padding:'12px'}}>
        {/* Header */}
        <div className="flex justify-between items-center p-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
          <button 
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
            
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Send {selectedToken}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-4 space-y-5">
            {/* Amount Input */}
            <div className="bg-[#0F172A] border border-slate-700 rounded-lg p-4 h-24 flex items-center justify-between">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-2xl font-semibold text-white placeholder-gray-400 outline-none flex-1"
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                />
                <span className="text-2xl text-gray-400 font-semibold ml-2">{selectedToken}</span>
            </div>

            {/* Recipient Address Input */}
            <div>
                 <label htmlFor="recipient-address" className="text-xs text-gray-400 mb-1 block" style={{marginTop:'10px'}}>Recipient Address</label>
                 <div className="relative">
                    <input
                        id="recipient-address"
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.readText().then(text => {
                          setRecipientAddress(text);
                        });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors"
                      style={{padding:'10px'}}
                    >
                        Paste
                    </button>
                 </div>
            </div>

            {/* Network Select */}
            <div>
                 <label htmlFor="network" className="text-xs text-gray-400 mb-1 block" style={{marginTop:'10px'}}>Network</label>
                 <div className="relative">
                    <select
                        id="network"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                    >
                        <option value="">Select Network</option>
                        <option value="trc20">Tron (TRC20)</option>
                        <option value="erc20">Ethereum (ERC20)</option>
                        <option value="bep20">Binance Smart Chain (BEP20)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                 </div>
            </div>

            {/* Description Input */}
            <div>
                <label htmlFor="description" className="text-xs text-gray-400 mb-1 block" style={{marginTop:'10px'}}>Description</label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                />
            </div>

            {/* Proceed Button */}
            <button 
              onClick={handleProceed}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            >
                Proceed
            </button>
        </div>

        {/* Recent Transactions Section */}
        <div className="p-4">
            <div className="flex justify-between items-center mb-3" style={{marginTop:'10px'}}>
                <h3 className="font-bold text-white">Recent Transactions</h3>
                <a href="#" className="text-sm text-blue-400 hover:underline">See More</a>
            </div>
            <div className="space-y-3">
                {recentTransactions.map(tx => (
                    <div key={tx.id} className="cursor-pointer hover:bg-slate-700/30 p-2 rounded transition-colors">
                        <p className="font-mono text-sm text-gray-300">{tx.address}</p>
                        <p className="text-xs text-gray-500">{tx.network}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SendCoinModal;
