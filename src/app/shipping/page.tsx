'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, TriangleAlert } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { useCart, Product } from '@/contexts/CartContext';

// Define the structure for a shipping option
interface ShippingOption {
  id: string;
  name: string;
  duration: string;
  price: number | 'Free';
}

// Sample data for shipping options
const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Courier',
    duration: '35-55 business days',
    price: 'Free',
  },
  {
    id: 'express',
    name: 'Express Courier (Air)',
    duration: '4-6 business days',
    price: 45,
  },
];

// Left Side - Shipping Method Component
const ShippingMethod = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueToPayment = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call to save shipping method
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Shipping method saved! Redirecting to payment...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to payment page after a short delay
      setTimeout(() => {
        router.push('/payment');
      }, 2000);

    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#10233D]/80 backdrop-blur-lg border border-white/10 p-8 rounded-lg max-w-2xl w-full text-white font-sans shadow-2xl" style={{padding:'1rem',marginTop:'2rem'}}>
      {/* Back Button */}
      <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6" style={{padding:'1rem'}}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Information Summary */}
      <div className="border border-slate-700 rounded-lg mb-8">
        <div className="flex justify-between items-center p-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}>
          <span className="text-gray-400">Contact</span>
          <span className="font-medium">myaccount@gmail.com</span>
          <a href="#" className="text-blue-400 hover:underline text-sm">Change</a>
        </div>
        <div className="border-t border-slate-700"></div>
        <div className="flex justify-between items-start p-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}>
          <span className="text-gray-400 mt-1">Ship to</span>
          <p className="text-right font-medium">
            House 40, Reageant Avenue,<br />
            Illinois, United States
          </p>
          <a href="#" className="text-blue-400 hover:underline text-sm mt-1">Change</a>
        </div>
      </div>

      {/* Shipping Method Section */}
      <section style={{ marginTop: '30px', marginBottom: '30px' }}>
        <h2 className="text-xl font-semibold mb-6" style={{marginBottom:'25px',marginTop:'25px'}}>Shipping method</h2>
        <div className="space-y-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '20px', width: 'calc(100% - 15px)', marginBottom:'25px'}}>
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              className={`flex items-center justify-between p-6 rounded-lg cursor-pointer border-2 transition-all  ${
                selectedMethod === option.id
                  ? 'bg-blue-500/10 border-blue-500'
                  : 'bg-[#1E293B] border-slate-700 hover:border-slate-500'

              }`}
              style={{ marginBottom: '20px', padding:'15px' }}
            >
              <div className="flex items-center gap-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-500" >
                  {selectedMethod === option.id && (
                     <CheckCircle2 className="w-6 h-6 text-green-400 bg-[#10233D] rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">{option.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{option.duration}</p>
                </div>
              </div>
              <p className="font-semibold">
                {typeof option.price === 'string' ? option.price : `$${option.price.toFixed(2)}` }
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center gap-6" style={{ marginTop: '40px' }}>
        <button 
          type="button" 
          onClick={handleContinueToPayment}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-md transition-colors" 
          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '20px', width: 'calc(100% - 15px)',padding:'15px' ,marginBottom:'20px'}}
        >
          {isSubmitting ? 'Processing...' : 'Continue to payment'}
        </button>
        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm" style={{ marginTop: '10px' }}>
          Refund policy
        </a>
      </div>
    </div>
  );
};

// Right Side - Order Summary Component
const OrderSummary = () => {
  const { products, getTotalPrice, getTotalItems } = useCart();
  const subtotal = getTotalPrice();
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-[#10233D]/80 backdrop-blur-lg border border-white/10 p-8 rounded-lg max-w-lg w-full text-white font-sans shadow-2xl" style={{padding:'1rem',marginTop:'2rem'}}>
      <div className="space-y-5" style={{padding:'1rem'}}>
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1E293B]/70 backdrop-blur-sm rounded-md flex-shrink-0 border border-white/10">
                 {/* Placeholder for an image */}
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2"/>
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-400">{product.variant}</p>
              </div>
            </div>
            <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700/50 my-6"></div>

      {/* Discount Code */}
      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Discount code" 
          className="w-full bg-[#1E293B]/70 backdrop-blur-sm border border-slate-600/50 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all" 
          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
        />
        <button 
          type="button" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors whitespace-nowrap"
          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
        >
          Apply
        </button>
      </div>

      <div className="border-t border-slate-700/50 my-6"></div>

      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-300" style={{marginBottom:'10px',marginTop:'10px'}}>
          <p>Subtotal ({getTotalItems()} items)</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-gray-300" style={{marginBottom:'10px',marginTop:'10px'}}>
          <p>Shipping fee</p>
          <p>${shippingFee.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-slate-800/50">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Tax Notice */}
      <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center text-sm text-yellow-400/80" style={{marginTop:'30px'}}>
        <TriangleAlert className="w-5 h-5 mr-3 flex-shrink-0"/>
        <span>Local taxes, duties or customs clearance fees may apply</span>
      </div>
    </div>
  );
};

// Main Shipping Page Component
const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#10233D] to-[#1E293B]">
      <Header />
      
      {/* Main Content with Glassmorphism */}
      <main className="flex items-center justify-center p-4 sm:p-8 pt-24">
        <div className="w-full max-w-7xl mx-auto">
          {/* Two Column Layout with Gap-4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            
            {/* Left Side: Shipping Method */}
            <div className="flex justify-center lg:justify-end">
              <ShippingMethod />
            </div>
            
            {/* Right Side: Order Summary */}
            <div className="flex justify-center lg:justify-start">
              <OrderSummary />
            </div>
            
          </div>
        </div>
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
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
    </div>
  );
};

export default ShippingPage;