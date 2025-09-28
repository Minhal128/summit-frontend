'use client';

import { X, ArrowLeft, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Network } from '@/types';

// Sample data for networks
const networks: Network[] = [
  { id: 'trc20', name: 'Tron (TRC20)', symbol: 'TRX', icon: '' },
  { id: 'bep20', name: 'BNB (BEP20)', symbol: 'BNB', icon: '' },
  { id: 'erc20', name: 'ETHEREUM (ERC20)', symbol: 'ETH', icon: '' },
];

// Main Modal Component
interface ChooseNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  selectedToken?: string;
  onProceed: (network: Network) => void;
}

const ChooseNetworkModal: React.FC<ChooseNetworkModalProps> = ({ 
  isOpen, 
  onClose, 
  onBack, 
  selectedToken = 'BTC',
  onProceed 
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProceed = () => {
    const network = networks.find(n => n.id === selectedNetwork);
    if (network) {
      onProceed(network);
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-sm text-white shadow-2xl flex flex-col h-[70vh]" style={{padding:'12px'}} >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0" style={{padding:'12px'}}>
          <button 
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
            style={{padding:'12px'}}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Choose network</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow" >
          {/* Search Bar */}
          <div className="relative mb-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{marginLeft:'280px'}}/>
            <input 
              type="text" 
              placeholder="Search Networks" 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            />
          </div>

          {/* Network List */}
          <div className="space-y-2 flex-grow overflow-y-auto" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
            {networks.map(network => (
              <div 
                key={network.id} 
                onClick={() => setSelectedNetwork(network.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedNetwork === network.id 
                    ? 'bg-blue-500/20 border-blue-500' 
                    : 'bg-transparent border-transparent hover:bg-slate-700/50'
                }`}
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
              >
                <p className="font-semibold text-white">{network.name}</p>
                <p className="text-xs text-gray-400">{network.symbol}</p>
              </div>
            ))}
          </div>
          
          {/* Action Button */}
          <div className="mt-4 flex-shrink-0">
            <button 
              onClick={handleProceed}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
              disabled={!selectedNetwork}
            >
                Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseNetworkModal;
