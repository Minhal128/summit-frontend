'use client';

import { X, ArrowLeft, Copy, ArrowRightLeft } from 'lucide-react';
import React, { useState } from 'react';

// A simple SVG component to mimic a QR code
const QrCodePlaceholder = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="white"/>
    {/* Simple pattern to represent a QR code */}
    <rect x="10" y="10" width="25" height="25" fill="black"/>
    <rect x="15" y="15" width="15" height="15" fill="white"/>
    <rect x="65" y="10" width="25" height="25" fill="black"/>
    <rect x="70" y="15" width="15" height="15" fill="white"/>
    <rect x="10" y="65" width="25" height="25" fill="black"/>
    <rect x="15" y="70" width="15" height="15" fill="white"/>
    <path d="M40 40 H80 V80 H40 Z" fill="black" fillOpacity="0.1"/>
    <path d="M45 45 H75 V75 H45 Z" fill="black" fillOpacity="0.1"/>
    <path d="M40 10 H55 V25 H40 Z" fill="black"/>
    <path d="M10 40 H25 V55 H10 Z" fill="black"/>
    <path d="M40 65 H55 V80 H40 Z" fill="black"/>
    <path d="M65 40 H80 V55 H65 Z" fill="black"/>
    <rect x="40" y="40" width="8" height="8" fill="black"/>
    <rect x="52" y="40" width="8" height="8" fill="black"/>
    <rect x="64" y="40" width="8" height="8" fill="black"/>
    <rect x="40" y="52" width="8" height="8" fill="black"/>
    <rect x="52" y="52" width="8" height="8" fill="black"/>
    <rect x="64" y="52" width="8" height="8" fill="black"/>
    <rect x="40" y="64" width="8" height="8" fill="black"/>
    <rect x="52" y="64" width="8" height="8" fill="black"/>
    <rect x="64" y="64" width="8" height="8" fill="black"/>
  </svg>
);

import { Network } from '@/types';

// Main Modal Component
interface PortfolioDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  selectedToken?: string;
  selectedNetwork: Network | null;
}

const PortfolioDetailsModal: React.FC<PortfolioDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onBack, 
  selectedToken = 'BTC',
  selectedNetwork
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const depositAddress = '4663GFFJFIRIHJFFNBJHUIB';

  if (!isOpen || !selectedNetwork) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address: ', err);
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-sm text-white shadow-2xl" style={{padding:'100px'}}>
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Portfolio details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 pt-0"style={{ marginLeft: 'px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg w-48 h-48 mx-auto my-4">
            <QrCodePlaceholder />
          </div>

          {/* Deposit Address */}
          <div className="flex justify-between items-center py-4 border-b border-slate-700">
              <div className="flex-1 min-w-0" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <p className="font-mono text-sm text-gray-200 truncate">{depositAddress}</p>
                <p className="text-xs text-gray-400">Deposit Address</p>
              </div>
              <button 
                onClick={copyToClipboard} 
                className="p-2 rounded-full hover:bg-slate-700 transition-colors ml-2 flex-shrink-0"
                title={copySuccess ? "Copied!" : "Copy address"}
              >
                  <Copy className={`w-4 h-4 ${copySuccess ? 'text-green-400' : 'text-gray-300'}`}/>
              </button>
          </div>

          {/* Network */}
          <div className="flex justify-between items-center py-4">
              <div>
                  <p className="font-semibold text-white">{selectedNetwork.name}</p>
                  <p className="text-xs text-gray-400">Network</p>
              </div>
               <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                  <ArrowRightLeft className="w-4 h-4 text-gray-300"/>
              </button>
          </div>

          {/* Success message for copy */}
          {copySuccess && (
            <div className="text-center text-green-400 text-sm mt-2">
              Address copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailsModal;
