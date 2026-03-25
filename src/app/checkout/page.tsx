'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, CreditCard, Truck, ShieldCheck, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, getCartCount } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = 10.00;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const handleProceedToShipping = () => {
    setLoading(true);
    // Store checkout data in sessionStorage for shipping page
    sessionStorage.setItem('checkoutData', JSON.stringify({
      items: cartItems,
      subtotal,
      shippingCost,
      tax,
      total
    }));
    router.push('/shipping');
  };

  if (cartItems.length === 0) {
    return null; // Will redirect
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
          <Link href="/nfc-access">
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
              <span>Back to Products</span>
            </button>
          </Link>

          <h1 className="checkout-hero-title" style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Secure Checkout
          </h1>
          <p className="checkout-hero-subtitle" style={{
            fontSize: '18px',
            color: 'rgba(235, 226, 255, 0.7)',
            marginBottom: '0'
          }}>
            Complete your purchase securely with Stripe
          </p>
        </div>
      </section>

      <style jsx>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
          gap: 32px;
          width: 100%;
          box-sizing: border-box;
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }
        .order-summary-box, .checkout-form-box {
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          box-sizing: border-box;
          width: 100%;
        }
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .cart-item {
            gap: 16px;
            padding: 16px;
            flex-direction: column;
            align-items: flex-start;
          }
          .cart-item > div {
            width: 100%;
            text-align: left !important;
          }
          .cart-item > div:first-child {
            width: auto; /* for the icon */
          }
          .cart-item-icon {
            width: 60px !important;
            height: 60px !important;
          }
          .order-summary-box, .checkout-form-box {
            padding: 20px;
          }
          .checkout-hero-title {
            font-size: 32px !important;
          }
          .checkout-hero-subtitle {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px', width: '100%', boxSizing: 'border-box' }} className="main-container">
        <div className="checkout-grid">
          {/* Left Column - Order Summary */}
          <div className="order-summary-box">
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <ShoppingCart size={28} style={{ color: '#4CAF50' }} />
              Order Summary
            </h2>
            
            {/* Cart Items */}
            <div style={{ marginBottom: '32px' }}>
              {cartItems.map((item, idx) => (
                <div key={item.productId} className="cart-item" style={{
                  marginBottom: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(235, 226, 255, 0.1)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="cart-item-icon" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(0, 212, 255, 0.1))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '32px'
                  }}>
                    💳
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#4CAF50',
                        textTransform: 'uppercase'
                      }}>
                        {item.product.cardType}
                      </span>
                      <span style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.6)' }}>
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50', marginBottom: '4px' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.5)' }}>
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div style={{
              borderTop: '1px solid rgba(235, 226, 255, 0.1)',
              paddingTop: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px', color: 'rgba(235, 226, 255, 0.7)' }}>
                <span>Subtotal ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})</span>
                <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px', color: 'rgba(235, 226, 255, 0.7)' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: '600' }}>${shippingCost.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '16px', color: 'rgba(235, 226, 255, 0.7)' }}>
                <span>Tax (10%)</span>
                <span style={{ fontWeight: '600' }}>${tax.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '24px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '12px',
                marginTop: '24px'
              }}>
                <span style={{ fontSize: '20px', fontWeight: '700' }}>Total</span>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#4CAF50' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Info */}
          <div className="checkout-form-box">
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CreditCard size={28} style={{ color: '#4CAF50' }} />
              Checkout Process
            </h2>
            
            <div style={{ marginBottom: '40px' }}>
              {/* Step 1 - Current */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '32px',
                padding: '20px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
                }}>
                  1
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    Review Your Order
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)', lineHeight: '1.6' }}>
                    Review the items in your cart. You have {getCartCount()} item{getCartCount() !== 1 ? 's' : ''} ready for checkout.
                  </p>
                  <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#4CAF50'
                  }}>
                    <CheckCircle size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Completed</span>
                  </div>
                </div>
              </div>

              {/* Step 2 - Next */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '32px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(235, 226, 255, 0.1)',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(235, 226, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    Shipping Information
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)', lineHeight: '1.6' }}>
                    Enter your shipping address and contact details.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(235, 226, 255, 0.1)',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(235, 226, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    Payment
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)', lineHeight: '1.6' }}>
                    Securely pay with Stripe. All transactions are encrypted.
                  </p>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToShipping}
              disabled={loading}
              style={{
                width: '100%',
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
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  <Truck size={22} />
                  Proceed to Shipping
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Security Badges */}
            <div style={{
              marginTop: '32px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(235, 226, 255, 0.1)',
              borderRadius: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <ShieldCheck size={20} style={{ color: '#4CAF50' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#4CAF50' }}>
                  Secure Checkout
                </span>
              </div>
              <p style={{
                fontSize: '12px',
                color: 'rgba(235, 226, 255, 0.6)',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                Your payment information is encrypted and secure. Powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
