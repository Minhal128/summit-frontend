'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck, Package, Truck, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/lib/cartApi';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment Form Component
const PaymentForm = ({ clientSecret, orderData }: { clientSecret: string; orderData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment?success=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        
        // Clear cart and session data
        localStorage.removeItem('cart');
        sessionStorage.removeItem('checkoutData');
        sessionStorage.removeItem('shippingInfo');
        
        // Redirect to success page
        setTimeout(() => {
          router.push(`/payment?success=true&orderId=${orderData.orderId}`);
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(235, 226, 255, 0.1)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <PaymentElement options={{
          layout: 'tabs',
          defaultValues: {},
        }} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: '100%',
          padding: '18px 32px',
          background: (!stripe || loading) ? 'rgba(150, 150, 150, 0.3)' : 'linear-gradient(45deg, #4CAF50, #003BFC)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          cursor: (!stripe || loading) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          transition: 'all 0.3s ease',
          boxShadow: (!stripe || loading) ? 'none' : '0 4px 20px rgba(76, 175, 80, 0.4)',
          opacity: (!stripe || loading) ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (stripe && !loading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(76, 175, 80, 0.6)';
          }
        }}
        onMouseLeave={(e) => {
          if (stripe && !loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.4)';
          }
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard size={22} />
            Pay ${orderData.total.toFixed(2)}
          </>
        )}
      </button>

      <div style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(235, 226, 255, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <ShieldCheck size={18} style={{ color: '#4CAF50' }} />
        <span style={{ fontSize: '13px', color: 'rgba(235, 226, 255, 0.7)' }}>
          Your payment information is secure and encrypted
        </span>
      </div>
    </form>
  );
};

// Success Component
const PaymentSuccess = ({ orderId }: { orderId?: string }) => {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(235, 226, 255, 0.1)',
        borderRadius: '16px',
        padding: '60px 40px'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'rgba(76, 175, 80, 0.2)',
          border: '3px solid rgba(76, 175, 80, 0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px'
        }}>
          <CheckCircle size={60} style={{ color: '#4CAF50' }} />
        </div>
        
        <h1 style={{
          fontSize: '42px',
          fontWeight: '700',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Payment Successful!</h1>
        <p style={{ fontSize: '18px', color: 'rgba(235, 226, 255, 0.7)', marginBottom: '8px' }}>
          Thank you for your purchase
        </p>
        {orderId && (
          <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.5)', marginBottom: '40px' }}>
            Order ID: {orderId}
          </p>
        )}
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(235, 226, 255, 0.1)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
            What's Next?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle size={20} style={{ color: '#4CAF50', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'rgba(235, 226, 255, 0.8)' }}>
                You'll receive a confirmation email shortly
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Package size={20} style={{ color: '#4CAF50', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'rgba(235, 226, 255, 0.8)' }}>
                Your NFC card will be shipped within 2-3 business days
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Truck size={20} style={{ color: '#4CAF50', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'rgba(235, 226, 255, 0.8)' }}>
                Track your order status in your account
              </span>
            </div>
          </div>
        </div>

        {/* Important Next Step */}
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '32px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#4CAF50' }}>
            📦 When your card arrives (2-3 days)...
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.8)', marginBottom: '16px' }}>
            You'll need to activate your NFC card to access the crypto dashboard and wallets.
          </p>
          <button
            onClick={() => router.push('/activate-card')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Go to Activation Page →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/website')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(76, 175, 80, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.4)';
            }}
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/nfc-access')}
            style={{
              padding: '14px 32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(235, 226, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Payment Page Component
const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if payment was successful
    if (searchParams.get('success') === 'true') {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // Load data from sessionStorage
    const checkout = sessionStorage.getItem('checkoutData');
    const shipping = sessionStorage.getItem('shippingInfo');

    if (!checkout || !shipping) {
      router.push('/cart');
      return;
    }

    const checkoutObj = JSON.parse(checkout);
    const shippingObj = JSON.parse(shipping);

    setCheckoutData(checkoutObj);
    setShippingInfo(shippingObj);

    // Create payment intent
    createPaymentIntent(checkoutObj.items, shippingObj)
      .then((response) => {
        setClientSecret(response.clientSecret);
        setOrderData({
          orderId: response.orderId,
          orderNumber: response.orderNumber,
          total: response.total
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        toast.error('Failed to initialize payment. Please try again.');
        setTimeout(() => router.push('/shipping'), 2000);
      });
  }, [router, searchParams]);

  if (success) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0A1A2F',
        color: '#EBE2FF',
        minHeight: '100vh',
        paddingTop: '70px'
      }}>
        <Header />
        
        <section style={{
          padding: '60px 20px 40px',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(0, 59, 252, 0.05) 100%)',
          borderBottom: '1px solid rgba(235, 226, 255, 0.1)'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center'
            }}>
              Order Complete
            </h1>
          </div>
        </section>
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
          <PaymentSuccess orderId={searchParams.get('orderId') || undefined} />
        </div>
        
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0A1A2F',
        color: '#EBE2FF',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(76, 175, 80, 0.2)',
            borderTop: '4px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '16px', color: 'rgba(235, 226, 255, 0.7)' }}>Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret || !orderData) {
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
          <Link href="/shipping">
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
              <span>Back to Shipping</span>
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
            Payment
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(235, 226, 255, 0.7)',
            marginBottom: '0'
          }}>
            Complete your purchase securely
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {/* Left Column - Payment Form */}
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
                <CreditCard size={28} style={{ color: '#4CAF50' }} />
                Payment Details
              </h2>
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm clientSecret={clientSecret} orderData={orderData} />
              </Elements>
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
                marginBottom: '24px'
              }}>Order Summary</h2>
              
              {/* Shipping Info */}
              <div style={{
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid rgba(235, 226, 255, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: 'rgba(235, 226, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MapPin size={16} />
                  Shipping To:
                </h3>
                <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: '600' }}>{shippingInfo.fullName}</p>
                <p style={{ fontSize: '13px', color: 'rgba(235, 226, 255, 0.7)', marginBottom: '2px' }}>{shippingInfo.address}</p>
                <p style={{ fontSize: '13px', color: 'rgba(235, 226, 255, 0.7)', marginBottom: '2px' }}>
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(235, 226, 255, 0.7)' }}>{shippingInfo.country}</p>
              </div>

              {/* Price Breakdown */}
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
                  <span style={{ fontSize: '22px', fontWeight: '700', color: '#4CAF50' }}>${orderData.total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'rgba(235, 226, 255, 0.6)'
              }}>
                <p>Order Number: <strong>{orderData.orderNumber}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
