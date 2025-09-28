'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---
const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');


// --- UI COMPONENTS ---

const CreatePasscodeCard = () => {
    const [passcode, setPasscode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const totalDigits = 8;
    const router = useRouter();

    const handleKeyPress = (e: React.KeyboardEvent) => {
        const key = e.key;
        
        if (key >= '0' && key <= '9' && passcode.length < totalDigits) {
            setPasscode(prev => prev + key);
        } else if (key === 'Backspace' && passcode.length > 0) {
            setPasscode(prev => prev.slice(0, -1));
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (passcode.length !== totalDigits) {
            toast.error('Please enter a complete 8-digit passcode');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            toast.success('8-digit passcode created successfully! Redirecting to next step...');
            
            // Redirect to boarding4 screen
            setTimeout(() => {
                router.push('/boardingscreens/boarding4');
            }, 1500);
            
        } catch (error) {
            toast.error('Failed to create passcode. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full max-w-150 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '150px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginBottom: '30px', marginTop: '20px' }}>
                    Create your wallet with<br />8-digit passcode
                </h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto" style={{ marginBottom: '50px', marginTop: '20px' }}>
                    This password locks your wallet on your device. Keep it private and secure.
                </p>
            </div>
            
            <div 
                className="space-y-8" 
                tabIndex={0} 
                onKeyDown={handleKeyPress}
                style={{ outline: 'none' }}
            >
                {/* Passcode Dots Indicator */}
                <div className="flex justify-center items-center gap-4 my-4">
                    {Array.from({ length: totalDigits }).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-5 h-5 rounded-full transition-colors duration-300 border-2",
                                index < passcode.length 
                                    ? "bg-blue-500 border-blue-500" 
                                    : "bg-transparent border-slate-600"
                            )}
                        />
                    ))}
                </div>


                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={passcode.length !== totalDigits || isLoading}
                    className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                    style={{marginTop: '30px'}}
                >
                    {isLoading ? 'Creating...' : 'Proceed'}
                </button>
            </div>
        </div>
    );
};


// --- MAIN PAGE ---

export default function CreatePasscodePage() {
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
          <CreatePasscodeCard />
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

