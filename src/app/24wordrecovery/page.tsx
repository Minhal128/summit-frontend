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
    const [checkingWallet, setCheckingWallet] = useState(true);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            // If reset_token not in localStorage, try to get from URL query param
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const tokenFromUrl = urlParams.get('token');
                if (!localStorage.getItem('reset_token') && tokenFromUrl) {
                    try { localStorage.setItem('reset_token', tokenFromUrl); } catch(e) {}
                }
            } catch (e) {
                // ignore (no window during SSR)
            }
            try {
                const resetToken = localStorage.getItem('reset_token') || '';
                if (!resetToken) {
                    setCheckingWallet(false);
                    return;
                }
                const { apiFetch } = await import('../../lib/api');
                const resp: any = await apiFetch('/api/auth/forgot-password/check-wallet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resetToken })
                });

                if (!resp.hasWallet) {
                    toast.error("No wallet found for this account. If you didn't create a wallet previously, use another recovery method.");
                    setTokenValid(false);
                    setTokenError("No wallet associated with this account");
                    // don't auto-redirect; allow user to restart manually
                } else {
                    setTokenValid(true);
                }
            } catch (err: any) {
                // Ignore validation errors here but surface token expiry
                const serverMessage = err?.data?.message || err?.message || '';
                if (serverMessage.toLowerCase().includes('invalid') || serverMessage.toLowerCase().includes('expired')) {
                    toast.error('Reset token invalid or expired. Please restart password recovery.');
                    setTokenValid(false);
                    setTokenError('Reset token invalid or expired');
                    // do not auto-redirect — show button so user can restart flow intentionally
                }
            } finally {
                setCheckingWallet(false);
            }
        })();
    }, [router]);

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
            const { apiFetch } = await import('../../lib/api');
            const resetToken = localStorage.getItem('reset_token') || '';
            if (!resetToken) {
                toast.error('No reset token found. Please complete the identity verification (OTP) step first.');
                setIsLoading(false);
                return;
            }

            const mnemonic = recoveryWords.join(' ').trim();

            const data: any = await apiFetch('/api/auth/forgot-password/additional-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, verificationType: 'seed_phrase', mnemonic })
            });

            if (data.finalResetToken) {
                try { localStorage.setItem('final_reset_token', data.finalResetToken); } catch (e) {}
            }

            toast.success(data.message || 'Recovery phrase verified successfully! Redirecting to create new password...');
            router.push('/createnewpassword');
        } catch (err: any) {
            console.error('Recovery verify api error:', err);

            const serverMessage = err?.data?.message || err?.message || err?.text || '';

            if (serverMessage.toLowerCase().includes('no wallet')) {
                // Common case when a user never created a wallet on their account
                toast.error("No wallet found for this account. If you didn't create a wallet previously, choose a different recovery method or contact support.");
            } else if (serverMessage.toLowerCase().includes('invalid reset token') || serverMessage.toLowerCase().includes('expired')) {
                toast.error('Reset token is invalid or expired. Please restart the password recovery process.');
                // Redirect user back to start of forgot-password flow
                try { router.push('/forgot-password'); } catch (e) {}
            } else {
                toast.error(serverMessage || 'Invalid recovery phrase. Please check your words and try again.');
            }

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
                {checkingWallet && (
                    <div className="text-center text-sm text-gray-400 mb-4">Checking recovery token and wallet...</div>
                )}
                {tokenValid === false && (
                    <div className="mb-6 text-center">
                        <p className="text-yellow-300 mb-2">{tokenError || 'There was an issue with your recovery token.'}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => { try { localStorage.removeItem('reset_token'); } catch(e){}; router.push('/forgot-password'); }}
                                className="px-4 py-2 rounded bg-blue-600 text-white"
                            >
                                Restart recovery
                            </button>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((number, index) => (
                        <Input 
                            key={number}
                            type="text" 
                            value={recoveryWords[index]}
                            onChange={(e) => handleWordChange(index, e.target.value)}
                            placeholder={`No ${number}`}
                            disabled={isLoading || checkingWallet || tokenValid === false}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={isLoading || checkingWallet || tokenValid === false}
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

