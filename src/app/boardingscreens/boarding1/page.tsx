'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---
const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');


// --- UI COMPONENTS ---

const SelectCountryCard = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!selectedCountry) {
            toast.error('Please select your country to continue');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            toast.success(`Country selected: ${selectedCountry}. Redirecting to next step!`);
            
            // Redirect to boarding2 screen
            setTimeout(() => {
                router.push('/boardingscreens/boarding2');
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
                <h1 className="text-3xl font-bold text-white mb-3">Select Your Country</h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto" style={{ marginBottom: '10px', marginTop: '20px' }}>
                    Choose your country of residence to personalize your experience
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        
                    </div>
                    <select 
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="appearance-none h-12 w-full rounded-lg border border-slate-700 bg-slate-800 pl-12 pr-4 text-sm text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        style={{ marginBottom: '50px', marginTop: '20px',paddingLeft: '12px' }}
                        disabled={isLoading}
                    >
                        <option value="">Select your country</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Canada">Canada</option>
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 flex items-center text-gray-400" style={{ right: '10px',bottom: '30px' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                >
                    {isLoading ? 'Processing...' : 'Proceed'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function SelectCountryPage() {
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
          <SelectCountryCard />
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
