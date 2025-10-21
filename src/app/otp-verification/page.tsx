'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
// These are simplified versions to make this a single, runnable file.

const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-[#10233D] text-gray-200 shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl min-h-[500px] rounded-2xl border border-slate-800 mx-4 mobile-responsive-card", className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-4 text-center px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6", className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-4xl font-bold tracking-tight text-white mobile-responsive-title", className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-base text-gray-400 max-w-md mx-auto leading-relaxed mobile-responsive-description", className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 sm:px-8 pb-6 sm:pb-8 pt-6 sm:pt-8", className)} {...props} />
));
CardContent.displayName = 'CardContent';

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
    <button
        className={cn(
            "w-full bg-blue-600 text-white font-semibold h-14 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500",
            className
        )}
        ref={ref}
        {...props}
    />
));
Button.displayName = 'Button';


// --- CUSTOM OTP INPUT COMPONENT ---

const InputOTP = ({ length = 6, onComplete }: { length: number, onComplete?: (otp: string) => void }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      } else {
         const finalOtp = newOtp.join('');
         if (finalOtp.length === length) {
            onComplete?.(finalOtp);
         }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index-1] = "";
      setOtp(newOtp);
    }
  };
  
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-8 mobile-responsive-otp">
      {otp.map((data, index) => (
        <React.Fragment key={index}>
          <input
            ref={el => { inputsRef.current[index] = el; }}
            type="text"
            maxLength={1}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            className="text-center font-bold text-white bg-[#1F2A3A] border border-white/10 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            style={{ width: '60px', height: '72px', fontSize: '32px' }}
          />
          {index === 2 && <span className="mx-2 text-2xl sm:text-3xl text-slate-400 font-light">-</span>}
        </React.Fragment>
      ))}
    </div>
  );
};


// --- UI COMPONENTS ---

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.9231 3H3V12.9231H12.9231V3Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23.0769 12.9231H12.9231V23.0769H23.0769V12.9231Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M33 23.0769H23.0769V33H33V23.0769Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Header = () => (
    <header className="w-full max-w-4xl mx-auto py-8 sm:py-12 flex items-center justify-center mobile-responsive-header" style={{ marginTop: '5rem' }}>
        <div className="flex items-center">
            <span className="text-2xl font-bold tracking-wider text-white">SUMMIT EXCHANGE</span>
        </div>
    </header>
);

const OtpVerificationCard = () => {
    const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationType = searchParams.get('type');

    const handleOtpComplete = (otpValue: string) => {
        setOtp(otpValue);
        console.log("OTP Completed:", otpValue);
    };

    const handleConfirmCode = () => {
        if (otp.length === 6) {
      (async () => {
        try {
          const { apiFetch } = await import('../../lib/api');
          if (verificationType === 'forgot-password') {
            const data: any = await apiFetch('/api/auth/forgot-password/verify-identity', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ identifier: searchParams.get('email') || '', verificationMethod: 'otp', otp })
            });

            toast.success('OTP verified successfully! Redirecting to recovery...', { autoClose: 2000 });
            if (data.resetToken) {
              try { localStorage.setItem('reset_token', data.resetToken); } catch (e) {}
            }
            // Pass token and email in query to make sure the next page can recover it if localStorage is cleared
            const tokenParam = data.resetToken ? `?token=${encodeURIComponent(data.resetToken)}&email=${encodeURIComponent(searchParams.get('email')||'')}` : '';
            router.push(`/24wordrecovery${tokenParam}`);
          } else {
            const data: any = await apiFetch('/api/auth/verify-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: searchParams.get('email') || '', otp })
            });

            if (data.token) {
              try { localStorage.setItem('auth_token', data.token); } catch (e) {}
            }
            toast.success('OTP verified successfully! Redirecting to login...', { autoClose: 1500 });
            router.push('/login');
          }
        } catch (err: any) {
          console.error('OTP verify api error', err);
          toast.error(err?.message || err?.text || 'OTP verification failed. Please try again.');
        }
      })();
        } else {
            toast.info('Please enter a complete 6-digit OTP code', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    };

    const handleResend = () => {
      (async () => {
        const email = searchParams.get('email') || '';
        if (!email) {
          toast.error('No email present to resend OTP to');
          return;
        }
        setIsResending(true);
        try {
          const { apiFetch } = await import('../../lib/api');
          await apiFetch('/api/auth/forgot-password/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: email })
          });

          toast.info('OTP sent to email', { autoClose: 3000 });
        } catch (err: any) {
          console.error('Resend OTP error', err);
          toast.error(err?.message || err?.text || `Failed to resend OTP (${err?.status})`);
        } finally {
          setIsResending(false);
        }
      })();
    };

    return (
        <Card>
            <CardHeader style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-white" style={{ marginTop: '3rem', marginBottom: '2rem' ,marginLeft: '0.5rem'}}>OTP Verification</CardTitle>
                <CardDescription className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed text-center" style={{ marginBottom: '1rem', paddingLeft: '1rem', paddingRight: '1rem',marginLeft: '3.2rem' }}>
                    Enter the OTP code sent to your phone number, or use your email address to complete verification.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center pt-10" style={{ marginBottom: '4rem' }}>
                    <div className="mb-8" style={{ marginBottom: '3rem' }}>
                        <InputOTP 
                            length={6} 
                            onComplete={handleOtpComplete}
                        />
                    </div>
                    
                    <div className="w-full max-w-sm mb-8">
                        <Button 
                            type="submit" 
                            onClick={handleConfirmCode}
                            className="w-full h-12 text-base rounded-lg mobile-responsive-button"
                            style={{ marginBottom: '2rem' }}
                        >
                            Confirm code
                        </Button>
                    </div>
                    
                    <div className="mt-4 mobile-responsive-resend">
                        <p className="text-sm text-center text-gray-400">
                            Didn&apos;t receive any code?{' '}
                            <button 
                                className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none font-medium transition-colors"
                                onClick={handleResend}
                                disabled={isResending}
                            >
                              {isResending ? 'Sending...' : 'Resend'}
                            </button>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


// --- MAIN PAGE ---

export default function OtpPage() {
  return (
    <div className="relative min-h-screen w-full text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 py-16 sm:py-20 font-sans"
         style={{ background: '#0A1A2F' }}>
      {/* Corner glow effects (match signup) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div style={{ position:'absolute', top:-80, left:-80, width:220, height:220, background:'radial-gradient(closest-side, rgba(69,79,187,0.35) 0%, rgba(69,79,187,0.18) 45%, rgba(69,79,187,0) 70%)', filter:'blur(18px)' }} />
        <div style={{ position:'absolute', top:-140, left:-140, width:540, height:540, background:'radial-gradient(closest-side, rgba(69,79,187,0.14), rgba(69,79,187,0))', filter:'blur(12px)' }} />
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        
        @media (max-width: 1024px) {
          .mobile-responsive-card {
            max-width: 95vw !important;
            margin: 1rem !important;
            padding: 0.5rem !important;
          }
          .mobile-responsive-header {
            font-size: 1.25rem !important;
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .mobile-responsive-main {
            padding: 1rem !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          .mobile-responsive-title {
            font-size: 1.5rem !important;
            margin-top: 2rem !important;
            margin-bottom: 1rem !important;
          }
          .mobile-responsive-description {
            font-size: 0.875rem !important;
            margin-bottom: 1rem !important;
            padding: 0 1rem !important;
          }
          .mobile-responsive-otp {
            gap: 0.5rem !important;
            margin: 1rem 0 !important;
          }
          .mobile-responsive-otp input {
            width: 2.5rem !important;
            height: 3rem !important;
            font-size: 1.25rem !important;
          }
          .mobile-responsive-button {
            margin-top: 1.5rem !important;
            margin-bottom: 1rem !important;
            height: 2.5rem !important;
            font-size: 0.875rem !important;
          }
          .mobile-responsive-resend {
            margin-top: 1rem !important;
            font-size: 0.75rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .mobile-responsive-card {
            max-width: 98vw !important;
            margin: 0.5rem !important;
            min-height: auto !important;
          }
          .mobile-responsive-main {
            padding: 0.5rem !important;
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          .mobile-responsive-title {
            font-size: 1.25rem !important;
            margin-top: 1rem !important;
            margin-bottom: 0.5rem !important;
          }
          .mobile-responsive-description {
            font-size: 0.75rem !important;
            margin-bottom: 1rem !important;
            padding: 0 0.5rem !important;
          }
          .mobile-responsive-otp {
            gap: 0.25rem !important;
            margin: 1rem 0 !important;
            padding: 0 0.5rem !important;
          }
          .mobile-responsive-otp input {
            width: 2.25rem !important;
            height: 2.75rem !important;
            font-size: 1.125rem !important;
          }
          .mobile-responsive-button {
            margin-top: 1rem !important;
            margin-bottom: 0.75rem !important;
            height: 2.25rem !important;
            font-size: 0.8125rem !important;
          }
          .mobile-responsive-resend {
            margin-top: 0.75rem !important;
            font-size: 0.6875rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-responsive-main {
            padding: 0.25rem !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .mobile-responsive-header {
            font-size: 1rem !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .mobile-responsive-title {
            font-size: 1.125rem !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.25rem !important;
          }
          .mobile-responsive-description {
            font-size: 0.6875rem !important;
            margin-bottom: 0.75rem !important;
            padding: 0 0.25rem !important;
          }
          .mobile-responsive-otp {
            gap: 0.125rem !important;
            margin: 0.75rem 0 !important;
            padding: 0 0.25rem !important;
          }
          .mobile-responsive-otp input {
            width: 2rem !important;
            height: 2.5rem !important;
            font-size: 1rem !important;
          }
          .mobile-responsive-button {
            margin-top: 0.75rem !important;
            margin-bottom: 0.5rem !important;
            height: 2rem !important;
            font-size: 0.75rem !important;
          }
          .mobile-responsive-resend {
            margin-top: 0.5rem !important;
            font-size: 0.625rem !important;
          }
        }
      `}</style>
      
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-7xl mx-auto mobile-responsive-main">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <OtpVerificationCard />
          </Suspense>
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
          color: '#EBE2FF',
          border: '1px solid #475569'
        }}
      />
    </div>
  );
}

