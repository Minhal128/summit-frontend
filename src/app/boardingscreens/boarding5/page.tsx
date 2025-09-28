'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---
const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');


// --- UI COMPONENTS ---

const VerifySeedPhraseCard = () => {
    const [seedWords, setSeedWords] = useState<string[]>(Array(24).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleWordChange = (index: number, value: string) => {
        const newWords = [...seedWords];
        newWords[index] = value.trim();
        setSeedWords(newWords);
    };

    const validateSeedPhrase = () => {
        const emptyFields = seedWords.filter(word => !word).length;
        
        if (emptyFields > 0) {
            toast.error(`Please fill in all 24 seed words. ${emptyFields} field(s) remaining.`);
            return false;
        }
        
        // Check for minimum word length
        const invalidWords = seedWords.filter(word => word.length < 3);
        if (invalidWords.length > 0) {
            toast.error('Each seed word must be at least 3 characters long.');
            return false;
        }
        
        return true;
    };

    const handleConfirm = async () => {
        if (!validateSeedPhrase()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate seed phrase verification
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success message
            toast.success('Seed phrase verified successfully! Redirecting to next step...');
            
            // Redirect to boarding6 screen
            setTimeout(() => {
                router.push('/boardingscreens/boarding6');
            }, 1500);
            
        } catch (error) {
            toast.error('Seed phrase verification failed. Please check your words and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-180 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '100px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginBottom: '30px', marginTop: '20px' }}>Back up seed phrase</h1>
                <p className="text-gray-400 text-sm mb-10" style={{marginBottom:'20px'}}>
                    Please verify the seed phrase in order
                </p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-10">
                {Array.from({ length: 24 }, (_, index) => (
                    <input
                        key={index}
                        type="text"
                        value={seedWords[index]}
                        onChange={(e) => handleWordChange(index, e.target.value)}
                        placeholder={`No ${index + 1}`}
                        className="flex items-center justify-center h-12 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                style={{marginTop:'50px'}}
            >
                {isLoading ? 'Verifying...' : 'Confirm'}
            </button>
        </div>
    );
};


// --- MAIN PAGE ---

export default function VerifySeedPhrasePage() {
  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-gray-200 flex flex-col items-center justify-center p-4 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        body {
            background-color: #0F172A;
            background-image: 
                radial-gradient(circle at top left, rgba(30, 64, 175, 0.15), transparent 40%),
                radial-gradient(circle at bottom right, rgba(30, 64, 175, 0.15), transparent 40%);
        }
      `}</style>
      
      <main className="flex-grow flex items-center justify-center w-full">
          <VerifySeedPhraseCard />
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1E293B',
          color: '#F1F5F9',
          border: '1px solid #475569'
        }}
      />
    </div>
  );
}

