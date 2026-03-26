'use client';

import React from 'react';
import Header from "@/components/Header";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
// These are simplified versions to make this a single, runnable file.

const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border border-slate-700 bg-slate-800/50 p-6 sm:p-10 backdrop-blur-sm", className)}
    {...props}
  />
));
Card.displayName = 'Card';


const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "form-input flex h-12 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-base text-gray-200 placeholder:text-gray-500 transition duration-200",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';


const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "form-input flex w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-base text-gray-200 placeholder:text-gray-500 transition duration-200 resize-none",
       "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';


const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
    <button
        className={cn(
            "w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-600/20",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500",
            className
        )}
        ref={ref}
        {...props}
    />
));
Button.displayName = 'Button';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none text-gray-300", className)}
    {...props}
  />
));
Label.displayName = 'Label';


// --- SVG ICONS ---

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);


// --- MAIN CONTACT PAGE COMPONENT ---

export default function ContactPage() {
  return (
    <div className="bg-[#0F172A] min-h-screen">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .background-gradient {
          background-image: radial-gradient(circle at top right, rgba(30, 64, 175, 0.2), transparent 40%);
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .min-h-screen {
            padding: 1rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          .max-w-2xl {
            max-width: 100% !important;
          }
          
          .grid-cols-1 {
            grid-template-columns: 1fr !important;
          }
          
          .p-5 {
            padding: 1rem !important;
          }
        }
      `}</style>
      
      {/* Header Component */}
      <Header />
      
      <div className="min-h-screen flex flex-col items-center p-5 text-gray-200 background-gradient" style={{ paddingTop: '120px' }}>
        <div className="w-full max-w-2xl mx-auto">
            
          <header className="text-center mb-12">
            <span className="text-sm font-semibold tracking-[0.2em] text-gray-400 block">CONTACT</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">Get in Touch with Us</h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Have questions or need AI solutions? Let us know by filling out the form, and we&apos;ll be in touch!
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4" style={{ margin: '20px', height: '80px' }}>
                <div className="bg-slate-700 p-2 rounded-lg" style={{ marginLeft: '10px' }}><MailIcon /></div>
                <div>
                    <h3 className="font-semibold text-white text-sm">Email address</h3>
                    <p className="text-gray-400 text-xs">admin@summit.exchange.com</p>
                </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4" style={{ margin: '20px', height: '80px' }}>
                <div className="bg-slate-700 p-2 rounded-lg" style={{ marginLeft: '10px' }}><PhoneIcon /></div>
                <div>
                    <h3 className="font-semibold text-white text-sm">Phone Number</h3>
                    <p className="text-gray-400 text-xs">+1 (979) 265-6373</p>
                </div>
            </div>
          </div>

          <Card>
            <form action="#" method="POST" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-9 gap-y-7">
                <div>
                  <Label htmlFor="first-name" style={{ display: 'block', marginTop: '29px', marginLeft: '10px'  }}>First Name</Label>
                  <Input id="first-name" type="text" name="first-name" placeholder="Enter your name" style={{ marginTop: '20px', marginLeft: '10px', paddingLeft: '10px' }} />
                </div> 
                <div>
                  <Label htmlFor="last-name" style={{ display: 'block', marginTop: '20px', marginLeft: '-10px' }}>Last Name</Label>
                  <Input id="last-name" type="text" name="last-name" placeholder="Enter your name" style={{ marginTop: '20px', marginLeft: '-10px', paddingLeft: '10px' }}/>
                </div>
                <div>
                  <Label htmlFor="email" style={{ display: 'block', marginTop: '20px', marginLeft: '10px' }}>Email</Label>
                  <Input id="email" type="email" name="email" placeholder="Enter your email" style={{ marginTop: '20px', marginLeft: '10px', paddingLeft: '10px' }}/>
                </div>
                <div>
                  <Label htmlFor="phone-number" style={{ display: 'block', marginTop: '20px', marginLeft: '-10px' }}>Phone Number</Label>
                  <Input id="phone-number" type="tel" name="phone-number" placeholder="Enter your mobile number" style={{ marginTop: '20px', marginLeft: '-10px', paddingLeft: '10px' }} />
                </div>
              </div>
              <div>
                <Label htmlFor="message" style={{ display: 'block', marginTop: '20px', marginLeft: '10px', paddingLeft: '10px' }}>Message</Label>
                <Textarea id="message" name="message" rows={5} placeholder="Hi, I'm Max ..." style={{ marginTop: '20px', paddingLeft: '10px', width: 'calc(100% - 20px)', marginLeft: '10px' }} />
              </div>
              <div style={{ marginTop: '30px' }}>
                <Button type="submit" style={{ margin: '20px', marginLeft: '0px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '16px', paddingBottom: '16px', fontSize: '16px', fontWeight: 'bold', minHeight: '56px' }}>Send message</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      
      {/* CTA Section Component */}
      <CTASection />
      
      {/* Footer Component */}
      <Footer />
    </div>
  );
}

