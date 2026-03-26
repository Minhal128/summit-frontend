'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Truck, MapPin, ShieldCheck, CheckCircle, CreditCard, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const ShippingPage = () => {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load checkout data from sessionStorage
    const data = sessionStorage.getItem('checkoutData');
    if (!data) {
      router.push('/cart');
      return;
    }
    setCheckoutData(JSON.parse(data));
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Store shipping info in sessionStorage
      sessionStorage.setItem('shippingInfo', JSON.stringify(formData));
      
      toast.success('Shipping information saved!');
      
      // Redirect to payment page
      setTimeout(() => {
        router.push('/payment');
      }, 1000);

    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return null;
  }

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#0A1A2F',
      color: '#EBE2FF',
      minHeight: '100vh',
      paddingTop: '70px'
    }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        padding: '60px 20px 40px',
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(0, 59, 252, 0.05) 100%)',
        borderBottom: '1px solid rgba(235, 226, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Back Button */}
          <Link href="/checkout">
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(235, 226, 255, 0.7)',
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#4CAF50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(235, 226, 255, 0.7)';
            }}>
              <ArrowLeft size={20} />
              <span>Back to Checkout</span>
            </button>
          </Link>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Shipping Information
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(235, 226, 255, 0.7)',
            marginBottom: '0'
          }}>
            Enter your delivery details to complete your order
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {/* Left Column - Form */}
          <div style={{ gridColumn: 'span 2 / auto' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(235, 226, 255, 0.1)',
              borderRadius: '16px',
              padding: '40px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <MapPin size={28} style={{ color: '#4CAF50' }} />
                Delivery Address
              </h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Full Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(235, 226, 255, 0.9)'
                  }}>Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: errors.fullName ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      color: '#EBE2FF',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid #4CAF50';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = errors.fullName ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(235, 226, 255, 0.9)'
                  }}>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: errors.email ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      color: '#EBE2FF',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid #4CAF50';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = errors.email ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(235, 226, 255, 0.9)'
                  }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: errors.phone ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      color: '#EBE2FF',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid #4CAF50';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = errors.phone ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(235, 226, 255, 0.9)'
                  }}>Street Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: errors.address ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      color: '#EBE2FF',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid #4CAF50';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = errors.address ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.address && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.address}</p>}
                </div>

                {/* City, State, ZIP */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'rgba(235, 226, 255, 0.9)'
                    }}>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: errors.city ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '16px',
                        color: '#EBE2FF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.border = '1px solid #4CAF50'}
                      onBlur={(e) => e.currentTarget.style.border = errors.city ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)'}
                      placeholder="New York"
                    />
                    {errors.city && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.city}</p>}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'rgba(235, 226, 255, 0.9)'
                    }}>State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: errors.state ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '16px',
                        color: '#EBE2FF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.border = '1px solid #4CAF50'}
                      onBlur={(e) => e.currentTarget.style.border = errors.state ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)'}
                      placeholder="NY"
                    />
                    {errors.state && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.state}</p>}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'rgba(235, 226, 255, 0.9)'
                    }}>ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: errors.zipCode ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '16px',
                        color: '#EBE2FF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.border = '1px solid #4CAF50'}
                      onBlur={(e) => e.currentTarget.style.border = errors.zipCode ? '1px solid #ff4444' : '1px solid rgba(235, 226, 255, 0.2)'}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{errors.zipCode}</p>}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(235, 226, 255, 0.9)'
                  }}>Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(235, 226, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      color: '#EBE2FF',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.border = '1px solid #4CAF50'}
                    onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(235, 226, 255, 0.2)'}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '18px 32px',
                    background: loading ? 'rgba(150, 150, 150, 0.3)' : 'linear-gradient(45deg, #4CAF50, #003BFC)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(76, 175, 80, 0.4)',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 30px rgba(76, 175, 80, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.4)';
                    }
                  }}
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <CreditCard size={22} />
                      Continue to Payment
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(235, 226, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShoppingCart size={24} style={{ color: '#4CAF50' }} />
                Order Summary
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>${checkoutData.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)' }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: '600' }}>${checkoutData.shippingCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)' }}>
                  <span>Tax</span>
                  <span style={{ fontWeight: '600' }}>${checkoutData.tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '12px'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
                  <span style={{ fontSize: '22px', fontWeight: '700', color: '#4CAF50' }}>${checkoutData.total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(235, 226, 255, 0.1)',
                borderRadius: '12px'
              }}>
                <p style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'rgba(235, 226, 255, 0.7)',
                  marginBottom: '12px'
                }}>
                  <CheckCircle size={16} style={{ color: '#4CAF50' }} />
                  Secure payment processing
                </p>
                <p style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'rgba(235, 226, 255, 0.7)'
                }}>
                  <Truck size={16} style={{ color: '#4CAF50' }} />
                  Fast & reliable shipping
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingPage;
