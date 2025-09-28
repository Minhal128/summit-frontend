import React from 'react';

// Icon props interface
interface IconProps {
  className?: string;
}

// SVG Icon components for reusability
const MailIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);


// Main App Component
export default function App() {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0A101E; /* Dark blue background from image */
          background-image: radial-gradient(circle at 90% 10%, #1E293B 0%, #0A101E 50%);
        }
        /* Custom styles to mimic shadcn UI input components */
        .form-input {
          background-color: #1E293B;
          border: 1px solid #334155;
          color: #CBD5E1;
          transition: border-color 0.2s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: #38BDF8; /* Light blue focus */
        }
        .form-input::placeholder {
          color: #64748B;
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Header */}
          <header className="text-center mb-12">
            <span className="text-sm font-semibold text-gray-400 tracking-widest uppercase">CONTACT</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Get in Touch with Us</h1>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              Have questions or need AI solutions? Let us know by filling out the form, and we&apos;ll be in touch!
            </p>
          </header>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155] flex items-center">
              <MailIcon className="text-gray-400 w-6 h-6 mr-4"/>
              <div>
                <h3 className="text-lg font-semibold text-white">Email address</h3>
                <p className="text-gray-400">admin@summit.exchange.com</p>
              </div>
            </div>
            <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155] flex items-center">
              <PhoneIcon className="text-gray-400 w-6 h-6 mr-4"/>
              <div>
                <h3 className="text-lg font-semibold text-white">Phone Number</h3>
                <p className="text-gray-400">+1 (979) 265-36-373</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#1E293B] p-8 rounded-lg border border-[#334155]">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName1" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input type="text" id="firstName1" name="firstName1" placeholder="Enter your name" className="form-input w-full px-4 py-3 rounded-md"/>
                </div>
                {/* Replicating the design with two "First Name" fields */}
                <div>
                  <label htmlFor="firstName2" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input type="text" id="firstName2" name="firstName2" placeholder="Enter your name" className="form-input w-full px-4 py-3 rounded-md"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" id="email" name="email" placeholder="Enter your email" className="form-input w-full px-4 py-3 rounded-md"/>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input type="tel" id="phone" name="phone" placeholder="Enter your mobile number" className="form-input w-full px-4 py-3 rounded-md"/>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea id="message" name="message" placeholder="Hi, I&apos;m Max ..." rows={4} className="form-input w-full px-4 py-3 rounded-md resize-none"></textarea>
                </div>
                <div className="md:col-span-2">
                   <button type="submit" className="w-full bg-[#007BFF] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#0069D9] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] focus:ring-offset-[#0A101E]">
                    Send message
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
