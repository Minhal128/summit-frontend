import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function OTPVerificationModal() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOpen, setIsOpen] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleConfirm = () => {
    const otpString = otp.join('');
    console.log('OTP confirmed:', otpString);
    // Handle OTP confirmation logic here
  };

  const handleResend = () => {
    console.log('Resend OTP');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const SummitLogo = () => (
    <div className="flex items-center justify-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="text-blue-600 font-bold text-lg">S</div>
        </div>
      </div>
      <span className="text-white text-xl font-semibold tracking-wide">SUMMIT EXCHANGE</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header with Summit Exchange Logo */}
      <div className="pt-12 pb-8">
        <SummitLogo />
      </div>

      {/* shadcn/ui Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md mx-auto bg-slate-800/95 border-slate-600 backdrop-blur-lg shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <DialogTitle className="text-white text-2xl font-semibold mb-4">
                OTP Verification
              </DialogTitle>
              <p className="text-slate-300 text-sm leading-relaxed px-2">
                Enter the OTP code sent to your phone number, or use your email address to complete verification.
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 mb-10">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-400 focus:bg-slate-700/80 focus:outline-none transition-all duration-200 hover:border-slate-500"
                />
              ))}
            </div>

            {/* Confirm Button */}
            <div className="mb-8">
              <button
                onClick={handleConfirm}
                disabled={otp.some(digit => !digit)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white text-base font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Confirm code
              </button>
            </div>

            {/* Resend Section */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Didn&apos;t receive any code?{' '}
                <button
                  onClick={handleResend}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 underline decoration-transparent hover:decoration-current"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}