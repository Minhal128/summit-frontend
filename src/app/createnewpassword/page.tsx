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



const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

// --- UI COMPONENTS ---

const Header = () => (
    <header className="w-full max-w-6xl mx-auto py-12 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
            {/* <LogoIcon className="w-9 h-9" /> */}
            <span className="text-2xl font-bold tracking-wider" style={{ marginBottom: '20px', marginTop: '80px'}}>SUMMIT EXCHANGE</span>
        </div>
    </header>
);

const CreatePasswordCard = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!newPassword) {
            toast.error('New password is required');
            return;
        }
        
        if (!confirmPassword) {
            toast.error('Please confirm your password');
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate API call to create new password
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success message
            toast.success('Password created successfully! Redirecting to login...');
            
            // Redirect to login page
            setTimeout(() => {
                router.push('/login');
            }, 1500);
            
        } catch (error) {
            toast.error('Failed to create password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-150 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12" style={{ padding: '100px' }}>
            <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-3" style={{ marginTop: '10px', whiteSpace: 'nowrap' }}>Create New Password</h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto" style={{ marginTop: '20px', marginBottom: '30px' }}>
                    Set a strong and secure password to protect your account and keep your information safe
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center" style={{ marginBottom: '50px', paddingBottom: '50px' }}>
                <div className="relative">
                    <Input 
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create new password"
                        className="h-16 text-xl px-9 text-center"
                        style={{ fontSize: '15px', textAlign: 'center', width: '500px', marginBottom: '20px', paddingRight: '50px' }}
                        disabled={isLoading}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
                    >
                        {showNewPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                </div>
                <div className="relative">
                    <Input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="h-16 text-xl px-9 text-center"
                        style={{ fontSize: '15px', textAlign: 'center', width: '500px', marginBottom: '20px', paddingRight: '50px' }}
                        disabled={isLoading}
                    />
                     <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
                    >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white font-semibold h-14 rounded-lg text-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                    style={{ fontSize: '18px', width: '500px' }}
                >
                    {isLoading ? 'Creating...' : 'Proceed'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function CreatePasswordPage() {
  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-gray-200 flex flex-col items-center justify-start p-4 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <Header />
      <main className="flex-grow flex items-center justify-center w-full -mt-24">
          <CreatePasswordCard />
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

