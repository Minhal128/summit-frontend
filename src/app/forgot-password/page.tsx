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
            "flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-gray-200 placeholder:text-gray-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            className
        )}
        ref={ref}
        {...props}
    />
));
Input.displayName = 'Input';

// --- SVG ICONS ---

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.9231 3H3V12.9231H12.9231V3Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23.0769 12.9231H12.9231V23.0769H23.0769V12.9231Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M33 23.0769H23.0769V33H33V23.0769Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- UI COMPONENTS ---

const Header = () => (
    <header className="w-full max-w-6xl mx-auto py-12 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
            <img src="/logo.png" alt="Summit Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold tracking-wider">SUMMIT EXCHANGE</span>
        </div>
    </header>
);

const ForgotPasswordCard = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!email) {
            toast.error('Email address is required');
            return;
        }
        
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const { apiFetch } = await import('../../lib/api');
            const data: any = await apiFetch('/api/auth/forgot-password/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: email })
            });

            toast.success(data.message || 'OTP code sent to your email address successfully!');
            router.push(`/otp-verification?email=${encodeURIComponent(email)}&type=forgot-password`);
        } catch (err: any) {
            console.error('Forgot password api error:', err);
            toast.error(err?.message || err?.text || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-150 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '150px' }}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginTop: '-120px', whiteSpace: 'nowrap' }}>Forgot Your Password?</h1>
                <p className="text-gray-400 text-sm mb-8" style={{ marginTop: '20px' , marginBottom: '30px'}}>
                    Enter the associated email address to receive the OTP code
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center" style={{ marginBottom: '50px',paddingBottom: '50px' }}>
                <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Please enter your email address" 
                    className="h-16 text-xl px-9 text-center"
                    style={{ fontSize: '15px', textAlign: 'center', width: '500px',marginBottom: '20px' }}
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white font-semibold h-14 rounded-lg text-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                    style={{ fontSize: '18px', width: '500px' }}
                >
                    {isLoading ? 'Sending...' : 'Get OTP Code'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-gray-200 flex flex-col items-center justify-start p-4 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <Header />
      <main className="flex-grow flex items-center justify-center w-full -mt-24">
          <ForgotPasswordCard />
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

