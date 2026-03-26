'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---
const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');


// --- UI COMPONENTS ---

const GetStartedCard = () => {
    const [selection, setSelection] = useState('create');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!selection) {
            toast.error('Please select an option to continue');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message based on selection
            if (selection === 'create') {
                toast.success('Creating new wallet... Redirecting to next step!');
            } else {
                toast.success('Preparing wallet import... Redirecting to next step!');
            }
            
            // Redirect to boarding3 screen
            setTimeout(() => {
                router.push('/boardingscreens/boarding3');
            }, 1500);
            
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-150 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '150px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginBottom: '30px', marginTop: '20px' }}>How would you like to get started?</h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto" style={{ marginBottom: '50px', marginTop: '20px' }}>
                    Create a new secure wallet or import an existing one with your seed phrase.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <div className="space-y-4">
                    <label 
                        htmlFor="create-wallet" 
                        className={cn(
                            "flex items-center justify-between p-6 rounded-lg border-2 cursor-pointer transition-colors duration-200",
                            selection === 'create' ? "bg-blue-600/20 border-blue-500" : "bg-slate-800 border-slate-700 hover:border-slate-600"
                        )}
                        style={{ marginLeft: '-70px', paddingLeft: '15px', marginTop: '30px', width: 'calc(450px)', minHeight: '60px' }}
                    >
                        <span className="font-medium text-white text-left flex-1 pr-4">Create a new secure wallet</span>
                        <input 
                            type="radio" 
                            id="create-wallet" 
                            name="wallet-option" 
                            value="create"
                            checked={selection === 'create'}
                            onChange={() => setSelection('create')}
                            className="hidden"
                            disabled={isLoading}
                        />
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            selection === 'create' ? "border-blue-500 bg-blue-500" : "border-slate-600"
                        )}>
                           {selection === 'create' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                    </label>

                     <label 
                        htmlFor="import-wallet" 
                        className={cn(
                            "flex items-center justify-between p-6 rounded-lg border-2 cursor-pointer transition-colors duration-200",
                            selection === 'import' ? "bg-blue-600/20 border-blue-500" : "bg-slate-800 border-slate-700 hover:border-slate-600"
                        )}
                        style={{ marginLeft: '-70px', paddingLeft: '15px', marginTop: '30px', width: 'calc(450px)', minHeight: '60px' }}
                    >
                        <span className="font-medium text-white text-left flex-1 pr-4">Import an existing wallet with your seed phrase</span>
                         <input 
                            type="radio" 
                            id="import-wallet" 
                            name="wallet-option" 
                            value="import"
                            checked={selection === 'import'}
                            onChange={() => setSelection('import')}
                            className="hidden"
                            disabled={isLoading}
                        />
                         <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            selection === 'import' ? "border-blue-500 bg-blue-500" : "border-slate-600"
                            
                        )}>
                           {selection === 'import' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                    style={{marginTop: '30px'}}
                >
                    {isLoading ? 'Processing...' : 'Proceed'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function GetStartedPage() {
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
          <GetStartedCard />
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

