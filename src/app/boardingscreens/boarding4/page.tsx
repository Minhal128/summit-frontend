'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---



// --- DUMMY DATA ---
const secretPhrase = [
    "doll", "lazy", "tumble", "race",
    "rural", "long", "tank", "dolphin",
    "silent", "damp", "want", "craft",
    "silent", "damp", "want", "craft",
    "silent", "damp", "want", "craft",
    "silent", "damp", "want", "craft"
];

// --- UI COMPONENTS ---

const SecretPhraseCard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleBackupSeedPhrase = async () => {
        setIsLoading(true);
        
        try {
            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success message
            toast.success('Seed phrase backup confirmed! Redirecting to next step...');
            
            // Redirect to boarding5 screen
            setTimeout(() => {
                router.push('/boardingscreens/boarding5');
            }, 1500);
            
        } catch (error) {
            toast.error('Failed to backup seed phrase. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-180 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '100px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginBottom: '30px', marginTop: '20px' }}>Your new 24 words secret phrase</h1>
                <p className="text-gray-400 text-sm mb-10" style={{ marginBottom: '50px', marginTop: '20px' }}>
                    Write it down and don&apos;t screenshot
                </p>
            </div>
            
            <div className="grid grid-cols-4 gap-x-8 gap-y-4 mb-10">
                {secretPhrase.map((word, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 font-medium">{`${index + 1}.`}</span>
                        <span className="text-white font-medium">{word}</span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleBackupSeedPhrase}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                style={{marginTop: '50px'}}
            >
                {isLoading ? 'Backing up...' : 'Back up seed phrase'}
            </button>
        </div>
    );
};


// --- MAIN PAGE ---

export default function SecretPhrasePage() {
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
          <SecretPhraseCard />
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

