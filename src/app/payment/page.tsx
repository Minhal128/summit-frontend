'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, TriangleAlert, CheckCircle2, X } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleContinueShopping = () => {
    onClose();
    router.push('/cart');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" style={{padding:'1rem',marginTop:'2rem'}}>
      <div className="bg-[#10233D] border border-white/20 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl relative" style={{padding:'1rem',marginTop:'2rem'}}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Content */}
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4" style={{marginLeft:'10rem'}}>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>

          {/* Success Message */}
          <h3 className="text-xl font-semibold text-white mb-2" style={{padding:'1rem',marginTop:'0rem'}}>Payment Successful!</h3>
          <p className="text-gray-300 mb-6" style={{padding:'1rem',marginTop:'',marginBottom:'2rem'}}>
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>

          {/* Action Button */}
          <button
            onClick={handleContinueShopping}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Form Component
const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
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
        <div className="flex justify-between items-center p-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}>
          <span className="text-gray-400">Shipping method</span>
          <span className="font-medium">Standard courier</span>
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

      {/* Payment Section */}
      <section style={{ marginTop: '30px', marginBottom: '30px' }}>
        <h2 className="text-xl font-semibold mb-6" style={{marginBottom:'25px',marginTop:'25px'}}>Payment</h2>
        
        {/* Payment Method Tabs */}
        <div className="grid grid-cols-2 gap-px bg-slate-700 rounded-lg overflow-hidden border border-slate-700 mb-6" style={{ marginBottom: '25px' }}>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`py-4 font-semibold transition-colors ${
              paymentMethod === 'card' ? ' text-white' : ' text-gray-400 hover:bg-slate-800'
            }`}
            style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}
          >
            Credit or Debit card
          </button>
          <button
            onClick={() => setPaymentMethod('more')}
            className={`py-4 font-semibold transition-colors ${
              paymentMethod === 'more' ? 'bg-[#1E293B] text-white' : 'bg-[#10233D] text-gray-400 hover:bg-slate-800'
            }`}
          >
            More payment option
          </button>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-6 space-y-6" style={{ padding: '20px', marginBottom: '20px' }}>
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Card number" 
                    className="w-full bg-transparent border-b-2 border-slate-600 focus:border-blue-500 py-3 focus:outline-none transition-colors text-white placeholder-gray-400"
                    style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}
                />
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
             </div>
             <input 
                type="text" 
                placeholder="Name on card" 
                className="w-full bg-transparent border-b-2 border-slate-600 focus:border-blue-500 py-3 focus:outline-none transition-colors text-white placeholder-gray-400"
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}
             />
             <div className="grid grid-cols-2 gap-6">
                <input 
                    type="text" 
                    placeholder="Expiration Date (MM/YY)" 
                    className="w-full bg-transparent border-b-2 border-slate-600 focus:border-blue-500 py-3 focus:outline-none transition-colors text-white placeholder-gray-400"
                    style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}
                />
                <input 
                    type="text" 
                    placeholder="Security code" 
                    className="w-full bg-transparent border-b-2 border-slate-600 focus:border-blue-500 py-3 focus:outline-none transition-colors text-white placeholder-gray-400"
                    style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'15px'}}
                />
             </div>
          </div>
        )}
        
        {/* Placeholder for other payment options */}
        {paymentMethod === 'more' && (
            <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-8 text-center text-gray-400" style={{ padding: '30px', marginBottom: '20px' }}>
                <p>Other payment options would be displayed here.</p>
                <p className="text-sm mt-2">PayPal, Apple Pay, Google Pay, etc.</p>
            </div>
        )}
      </section>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center gap-6" style={{ marginTop: '40px' }}>
        <button 
          type="button"
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-md transition-colors" 
          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '20px', width: 'calc(100% - 15px)',padding:'15px' ,marginBottom:'20px'}}
        >
          {isProcessing ? 'Processing Payment...' : 'Pay Now'}
        </button>
        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm" style={{ marginTop: '10px' }}>
          Refund policy
        </a>
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />
    </div>
  );
};

// Right Side - Order Summary Component (same as other pages)
const OrderSummary = () => {
  const { products, getTotalPrice, getTotalItems } = useCart();
  const shippingFee = 0;
  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  return (
    <div className="bg-[#10233D]/80 backdrop-blur-lg border border-white/10 p-8 rounded-lg max-w-lg w-full text-white font-sans shadow-2xl" style={{padding:'1rem',marginTop:'2rem'}}>
      <div className="space-y-5" style={{padding:'1rem'}}>
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1E293B]/70 backdrop-blur-sm rounded-md flex-shrink-0 border border-white/10 relative">
                {/* Placeholder for an image */}
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2"/>
                {product.quantity > 1 && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {product.quantity}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-400">{product.variant}</p>
                {product.quantity > 1 && (
                  <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                )}
              </div>
            </div>
            <p className="font-semibold text-lg">${(product.price * product.quantity).toFixed(2)}</p>
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

// Main Payment Page Component
const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#10233D] to-[#1E293B]">
      <Header />
      
      {/* Main Content with Glassmorphism */}
      <main className="flex items-center justify-center p-4 sm:p-8 pt-24">
        <div className="w-full max-w-7xl mx-auto">
          {/* Two Column Layout with Gap-4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            
            {/* Left Side: Payment Form */}
            <div className="flex justify-center lg:justify-end">
              <PaymentForm />
            </div>
            
            {/* Right Side: Order Summary */}
            <div className="flex justify-center lg:justify-start">
              <OrderSummary />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;