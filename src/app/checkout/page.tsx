'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, TriangleAlert } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { useCart, Product } from '@/contexts/CartContext';

interface FormData {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  phone: string;
  saveInfo: boolean;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
}

// Left Side - Checkout Form Component
const CheckoutForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    country: 'us',
    firstName: '',
    lastName: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: '+1',
    phone: '',
    saveInfo: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // State validation
    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    // Postal code validation
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Information saved successfully! Redirecting to shipping...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to shipping page after a short delay
      setTimeout(() => {
        router.push('/shipping');
      }, 2000);

    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: keyof FormErrors) => {
    const baseClass = "w-full bg-[#1E293B]/70 backdrop-blur-sm border rounded-md p-3 focus:outline-none focus:ring-2 transition-all placeholder-gray-400";
    const errorClass = errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-slate-600/50 focus:ring-blue-500";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <div className="bg-[#10233D]/80 backdrop-blur-lg border border-white/10 p-8 rounded-lg max-w-2xl w-full text-white font-sans shadow-2xl" style={{padding: '1rem'}}>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-400 mb-8" style={{padding: '1rem'}}>
        <span className="text-blue-400" style={{gap: '0.5rem', marginRight: '0.5rem'}}>Information</span>
        <span className="mx-2" style={{gap: '2rem'}}>&gt;</span>
        <span className="font-semibold text-white" style={{gap: '0.5rem', marginRight: '0.5rem'}}>Shipping</span>
        <span className="mx-2" style={{gap: '2rem'}}>&gt;</span>
        <span style={{gap: '0.5rem', marginRight: '0.5rem'}}>Payments</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={getInputClassName('email')}
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 ml-4">{errors.email}</p>
            )}
          </div>
        </section>

        {/* Shipping Address Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
          <div className="space-y-4">
            {/* Country */}
            <div className="relative">
              <select 
                value={formData.country} 
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full bg-[#1E293B]/70 backdrop-blur-sm border border-slate-600/50 rounded-md p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
                style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
              >
                <option value="us">🇺🇸 United States</option>
                <option value="ca">🇨🇦 Canada</option>
                <option value="mx">🇲🇽 Mexico</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={getInputClassName('firstName')} 
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}} 
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1 ml-4">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={getInputClassName('lastName')} 
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}} 
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1 ml-4">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Apartment */}
            <input 
              type="text" 
              placeholder="Enter apartment suite (optional)" 
              value={formData.apartment}
              onChange={(e) => handleInputChange('apartment', e.target.value)}
              className="w-full bg-[#1E293B]/70 backdrop-blur-sm border border-slate-600/50 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" 
              style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}} 
            />
            
            {/* City, State, Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr,1fr] gap-4">
              <div>
                <input 
                  type="text" 
                  placeholder="City" 
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={getInputClassName('city')} 
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}} 
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1 ml-4">{errors.city}</p>
                )}
              </div>
              <div className="relative">
                <select 
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={getInputClassName('state')} 
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                >
                  <option value="">State</option>
                  <option value="AL">Alabama</option>
                  <option value="CA">California</option>
                  <option value="FL">Florida</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                {errors.state && (
                  <p className="text-red-400 text-sm mt-1 ml-4">{errors.state}</p>
                )}
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Postal code" 
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className={getInputClassName('postalCode')} 
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}} 
                />
                {errors.postalCode && (
                  <p className="text-red-400 text-sm mt-1 ml-4">{errors.postalCode}</p>
                )}
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex">
              <div className="relative">
                <select 
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  className="bg-[#1E293B]/70 backdrop-blur-sm border border-r-0 border-slate-600/50 rounded-l-md p-3 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full" 
                  style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'5px'}}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+1">🇨🇦 +1</option>
                  <option value="+52">🇲🇽 +52</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex-1">
                <input 
                  type="tel" 
                  placeholder="000 000 0000" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`${getInputClassName('phone')} rounded-l-none`} 
                  style={{ paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'1px'}} 
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Save Info */}
            <div className="flex items-center pt-2">
              <input 
                id="save-info" 
                type="checkbox" 
                checked={formData.saveInfo}
                onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                className="h-4 w-4 rounded border-gray-500 bg-[#1E293B]/70 text-blue-500 focus:ring-blue-600" 
                style={{marginTop:'30px'}} 
              />
              <label htmlFor="save-info" className="ml-3 text-sm text-gray-300" style={{marginTop:'30px'}}>Save this information for next time</label>
            </div>
          </div>
        </section>
        
        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between">
           <a href="#" className="text-blue-400 hover:text-blue-300 order-2 sm:order-1 mt-4 sm:mt-0" style={{marginTop:'30px'}}>
            Refund policy
          </a>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-md transition-colors order-1 sm:order-2" 
            style={{padding:'10px'}}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Shipping'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Right Side - Order Summary Component
const OrderSummary = () => {
  const { products, getTotalPrice, getTotalItems } = useCart();
  const shippingFee = 0;
  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  return (
    <div className="bg-[#10233D]/80 backdrop-blur-lg border border-white/10 p-8 rounded-lg max-w-lg w-full text-white font-sans shadow-2xl" style={{padding:'1rem',marginTop:'2rem', marginBottom:'2rem'}}>
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

// Main Checkout Page Component
const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#10233D] to-[#1E293B]">
      <Header />
      
      {/* Main Content with Glassmorphism */}
      <main className="flex items-center justify-center p-4 sm:p-8 pt-24">
        <div className="w-full max-w-7xl mx-auto">
          {/* Two Column Layout with Gap-4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            
            {/* Left Side: Checkout Form */}
            <div className="flex justify-center lg:justify-end">
              <CheckoutForm />
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

export default CheckoutPage;