'use client';

import { X, ArrowLeft, ChevronDown, Wallet } from 'lucide-react';
import React, { useState } from 'react';

// Main Modal Component
interface SellCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  selectedToken?: string;
  onProceed: () => void;
}

const SellCoinModal: React.FC<SellCoinModalProps> = ({ 
  isOpen, 
  onClose, 
  onBack, 
  selectedToken = 'Bitcoin',
  onProceed 
}) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleProceed = () => {
    // Validate form here if needed
    onProceed();
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-sm text-white shadow-2xl" style={{padding:'50px'}}>
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Sell {selectedToken}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 pt-0">
          <div className="space-y-4">
            {/* Amount Input */}
            <div className="bg-[#0F172A] p-4 rounded-lg flex items-center justify-end h-24" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount" 
                className="bg-transparent text-white text-3xl font-bold w-full text-right focus:outline-none placeholder-gray-500"
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
              />
            </div>

            {/* Coin Selector */}
            <div className="bg-[#0F172A] p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-800/60" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                   {selectedToken?.charAt(0) || 'B'}
                 </div>
                 <div>
                    <p className="font-semibold text-white">{selectedToken}</p>
                    <p className="text-xs text-gray-400">{selectedToken?.toUpperCase()}/USDT</p>
                 </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400"/>
            </div>

            {/* Receive Method Selector */}
            <div className="bg-[#0F172A] p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-800/60" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-slate-700 rounded-md">
                    <Wallet className="w-5 h-5 text-green-400"/>
                 </div>
                 <div>
                    <p className="text-xs text-gray-400">Receive to</p>
                    <p className="font-semibold text-white">Wallet Balance (USDT)</p>
                 </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400"/>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button 
                onClick={handleProceed}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors"
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
              >
                  Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCoinModal;
