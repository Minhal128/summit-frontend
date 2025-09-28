'use client';

import { Check } from 'lucide-react';
import React from 'react';

// Main Modal Component
interface TransactionAuthorizedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionAuthorizedModal: React.FC<TransactionAuthorizedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-sm text-white shadow-2xl text-center p-8" style={{padding:'12px'}}>
        
        {/* Icon */}
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center shadow-inner-lg" style={{marginLeft:'125px'}}>
            <div className="h-16 w-16 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                 <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold mb-3" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Transaction Authorized</h2>
        <p className="text-gray-400 mb-8 text-sm max-w-xs mx-auto" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
          Your transaction has been successfully confirmed and is now being processed
        </p>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
        >
            Okay, I Got It!
        </button>
      </div>
    </div>
  );
};

export default TransactionAuthorizedModal;
