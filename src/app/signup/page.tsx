'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
// These are simplified versions to make this a single, runnable file.

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

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-slate-600 bg-slate-800 text-blue-600",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = 'Checkbox';

// --- SVG ICONS ---

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.9231 3H3V12.9231H12.9231V3Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23.0769 12.9231H12.9231V23.0769H23.0769V12.9231Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M33 23.0769H23.0769V33H33V23.0769Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

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

// --- MAIN SIGNUP PAGE COMPONENT ---

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        countryCode: '+01',
        phone: '',
        password: '',
        agreeToPolicy: false,
        agreeToMarketing: false
    });
    const router = useRouter();

    // Form validation
    const validateForm = () => {
        if (!formData.email) {
            toast.error('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (!formData.phone) {
            toast.error('Phone number is required');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.password) {
            toast.error('Password is required');
            return false;
        }
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }
        if (!formData.agreeToPolicy) {
            toast.error('Please agree to the Policy Notice');
            return false;
        }
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate API call for signup
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            toast.success('Account created successfully! Please verify your email.');
            
            // Redirect to OTP verification after a short delay
            setTimeout(() => {
                router.push(`/otp-verification?email=${encodeURIComponent(formData.email)}`);
            }, 1500);
            
        } catch (error) {
            toast.error('Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen w-full text-gray-200 flex flex-col"
            style={{
                fontFamily: 'Inter, sans-serif',
                background: '#0A1A2F'
            }}
        >
            {/* Corner glow effects */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                <div
                    style={{
                        position: 'absolute',
                        top: -80,
                        left: -80,
                        width: 220,
                        height: 220,
                        background:
                            'radial-gradient(closest-side, rgba(69,79,187,0.35) 0%, rgba(69,79,187,0.18) 45%, rgba(69,79,187,0.0) 70%)',
                        filter: 'blur(18px)'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: -140,
                        left: -140,
                        width: 540,
                        height: 540,
                        background:
                            'radial-gradient(closest-side, rgba(69,79,187,0.14), rgba(69,79,187,0))',
                        filter: 'blur(12px)'
                    }}
                />
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    /* Mobile-only styles - only apply to actual mobile devices */
                    @media screen and (max-width: 768px) {
                        body {
                            overflow-x: hidden;
                        }
                        
                        .mobile-container {
                            max-width: 100vw !important;
                            margin: 0.5rem !important;
                            padding: 0 !important;
                        }
                        
                        .mobile-form {
                            padding: 1rem !important;
                            margin-top: 0 !important;
                        }
                        
                        .mobile-title {
                            font-size: 1.5rem !important;
                            text-align: center !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                            line-height: 1.3 !important;
                        }
                        
                        .mobile-subtitle {
                            text-align: center !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                        }
                        
                        .mobile-input-container {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                            margin-bottom: 1rem !important;
                        }
                        
                        .mobile-button {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            margin: 0 1rem 1rem 1rem !important;
                            width: calc(100% - 2rem) !important;
                        }
                        
                        .mobile-checkbox {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                        }
                    }
                    
                    @media screen and (max-width: 480px) {
                        .mobile-title {
                            font-size: 1.25rem !important;
                        }
                        
                        .main-title {
                            font-size: 1.5rem !important;
                            margin-top: 1rem !important;
                            margin-bottom: 1rem !important;
                            padding: 0 1rem !important;
                        }
                        
                        .mobile-form {
                            padding: 0.75rem !important;
                        }
                    }
                `
            }} />
            {/* <Header /> */}
            <h1 className="text-3xl font-bold text-white mb-2 text-center main-title" style={{ marginTop: '50px' ,marginBottom: '50px', fontFamily: 'Inter, sans-serif' }}>SUMMIT EXCHANGE</h1>
            <main className="relative z-10 flex-grow flex items-center justify-center p-2 sm:p-6 py-8 sm:py-24">
                <div className="w-full max-w-3xl bg-[#10233D] backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 overflow-hidden mb-16 mobile-container">
                
                    {/* Form Section */}
                    <div className="p-8 rounded-l-2xl mobile-form" style={{ marginTop: '30px', }}>
                        <h1 className="text-3xl font-bold text-white mb-2 mobile-title" style={{ marginLeft: '20px' }}>Create an account</h1>
                        <p className="text-gray-400 text-sm mb-8 mobile-subtitle" style={{ marginLeft: '20px' }}>
                            Already have an account?{' '}
                            <a href="/login" className="font-medium text-blue-400 hover:underline">
                                Log in
                            </a>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="mobile-input-container" style={{ marginLeft: '15px', marginTop: '30px' }}>
                                <Input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Please enter your email address" 
                                    style={{ paddingLeft: '15px', width: '100%' }} 
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 mobile-input-container" style={{ marginLeft: '15px', marginTop: '30px' }}>
                                <div className="relative" style={{ minWidth: '140px', width: '140px' }}>
                                    <select 
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleInputChange}
                                        className="appearance-none h-12 w-full rounded-lg border border-slate-700 bg-slate-800 pl-6 pr-10 text-sm text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-center"
                                        disabled={isLoading}
                                    >
                                        <option value="+01">🇺🇸 +01</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+91">🇮🇳 +91</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <Input 
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="000 000 0000" 
                                    style={{ paddingLeft: '15px', flex: '1', width: '100%' }} 
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="relative mobile-input-container" style={{ marginLeft: '15px', marginTop: '30px' }}>
                                <Input 
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="pr-12"
                                    style={{ paddingLeft: '15px', width: '100%' }}
                                    disabled={isLoading}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 mobile-button" 
                                style={{ marginTop: '20px', marginLeft: '10px' }}
                            >
                                {isLoading ? 'Creating Account...' : 'Create new account'}
                            </button>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-start gap-3 mobile-checkbox" style={{ marginLeft: '15px', marginTop: '30px' }}>
                                    <Checkbox 
                                        id="policy" 
                                        name="agreeToPolicy"
                                        checked={formData.agreeToPolicy}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="policy" className="text-sm text-gray-400">
                                        By submitting your email, you confirm you&apos;ve read this <a href="#" className="text-blue-400 hover:underline">Policy Notice</a>
                                    </label>
                                </div>
                                <div className="flex items-start gap-3 mobile-checkbox" style={{ marginLeft: '15px', marginBottom: '20px' }}>
                                    <Checkbox 
                                        id="marketing" 
                                        name="agreeToMarketing"
                                        checked={formData.agreeToMarketing}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="marketing" className="text-sm text-gray-400">
                                        I agree to receive marketing updates and offers
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Image Section */}
                    <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-r-2xl">
                        <img 
                            src="/signup.png" 
                            alt="Summit Exchange Wallet" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>
                
            </main>
            {/* <CTASection />
            <Footer /> */}
            
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