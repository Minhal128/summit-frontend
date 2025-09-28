'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- HELPER ---
const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');

// --- SVG ICONS ---
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);


// --- UI COMPONENTS ---

const FinalSecuritySetupCard = () => {
    const [selection, setSelection] = useState('pet_name');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const questions = [
        { id: 'pet_name', text: 'What was the name of your first pet?' },
        { id: 'birth_city', text: 'What city were you born in?' },
        { id: 'first_school', text: 'What was the name of your first school?' },
        { id: 'mother_maiden_name', text: "What is your mother's maiden name?" },
        { id: 'first_car', text: 'What was the make or model of your first car?' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!selection) {
            toast.error('Please select a security question');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            toast.success('Security setup completed successfully! Redirecting to dashboard...');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
            
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-175 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center" style={{ margin: '0 auto', marginTop: '30px', width: '100%', minHeight: '60px', paddingBottom: '20px', textAlign: 'center' }}>
                <h1 className="text-3xl font-bold text-white mb-3" style={{ marginTop: '45px' }}>Final Security Setup</h1>
                <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto" style={{ textAlign: 'center', margin: '0 auto', lineHeight: '1.5' }}>
                    Protect your funds with advanced security features.
                </p>
            </div>
            
            <form className="space-y-6" style={{ margin: '0 auto', marginTop: '20px', width: '100%', maxWidth: '450px' }} onSubmit={handleSubmit}>
                <div className="space-y-3">
                    {questions.map((question) => (
                         <label 
                            key={question.id}
                            htmlFor={question.id}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200",
                                selection === question.id ? "bg-slate-700/50 border-slate-600" : "bg-slate-800 border-slate-700 hover:border-slate-600"
                            )}
                            style={{ margin: '0 auto', marginTop: '10px', width: '100%', minHeight: '60px', padding: '20px' }}
                        >
                            <span className="font-medium text-white text-sm">{question.text}</span>
                            <input 
                                type="radio" 
                                id={question.id}
                                name="security-question" 
                                value={question.id}
                                checked={selection === question.id}
                                onChange={() => setSelection(question.id)}
                                className="hidden"
                            />
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                selection === question.id ? "border-green-500 bg-green-500" : "border-slate-600"
                            )}>
                               {selection === question.id && <CheckIcon className="w-4 h-4 text-white" />}
                            </div>
                        </label>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 !mt-10"
                    style={{ margin: '0 auto', marginTop: '30px', width: '100%', maxWidth: '450px', minHeight: '60px' , marginBottom: '20px' }}
                >
                    {isLoading ? 'Setting up...' : 'Complete setup'}
                </button>
            </form>
        </div>
    );
};


// --- MAIN PAGE ---

export default function FinalSecuritySetupPage() {
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
          <FinalSecuritySetupCard />
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

