'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { fetchProducts, NfcProduct } from '@/lib/cartApi';
import { toast } from 'react-toastify';

export default function NfcAccessPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedTier, setSelectedTier] = useState('premium');
  const [products, setProducts] = useState<NfcProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('🔄 Fetching products from backend...');
        console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000');
        
        const fetchedProducts = await fetchProducts();
        
        console.log('✅ Products fetched successfully:', fetchedProducts);
        console.log('Products count:', fetchedProducts.length);
        
        setProducts(fetchedProducts);
      } catch (error: any) {
        console.error('❌ Failed to load products:', error);
        toast.error(`Failed to load products: ${error?.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const cardTiers = [
    {
      id: 'standard',
      name: 'Standard NFC Card',
      price: 29.99,
      features: [
        'Secure NFC chip',
        'Wallet authentication',
        'Basic security features',
        'Compatible with major wallets',
        '1-2 wallets per crypto'
      ],
      color: 'from-gray-500 to-gray-700',
      highlight: false,
      backendType: 'standard'
    },
    {
      id: 'premium',
      name: 'Premium NFC Card',
      price: 49.99,
      features: [
        'Advanced security chip',
        'Multi-signature support',
        'Waterproof design',
        'Extended warranty',
        'Priority support',
        '3 wallets per crypto'
      ],
      color: 'from-blue-500 to-blue-700',
      highlight: false,
      backendType: 'premium'
    },
    {
      id: 'enterprise',
      name: 'Enterprise NFC Card',
      price: 99.99,
      features: [
        'Military-grade encryption',
        'Multi-wallet support',
        'Biometric integration',
        'Custom branding available',
        'Dedicated account manager',
        'API access',
        'Unlimited wallets'
      ],
      color: 'from-purple-500 via-pink-500 to-orange-500',
      highlight: true,
      backendType: 'enterprise'
    }
  ];

  const handlePurchase = (tierId: string, tierBackendType: string) => {
    console.log('=== Purchase Debug ===');
    console.log('Products loaded:', products.length);
    console.log('All products:', products);
    console.log('Looking for cardType:', tierBackendType);
    
    // Check if products are loaded
    if (loading) {
      toast.error('Please wait, products are still loading...');
      return;
    }

    if (products.length === 0) {
      toast.error('No products available. Please ensure backend is running on port 5000.');
      console.error('Backend might not be running or products not seeded');
      return;
    }

    // Find the matching product from backend based on card type
    const matchingProduct = products.find(p => {
      const cardType = p.cardType?.toLowerCase();
      console.log(`Checking product: ${p.name}, cardType: ${cardType}, match: ${cardType === tierBackendType.toLowerCase()}`);
      return cardType === tierBackendType.toLowerCase();
    });

    if (matchingProduct) {
      console.log('✅ Found product:', matchingProduct);
      // Add to cart
      addToCart(matchingProduct);
      toast.success(`✅ ${matchingProduct.name} added to cart!`);
      // Navigate directly to checkout
      setTimeout(() => router.push('/checkout'), 1000);
    } else {
      // If product not found, show error
      toast.error('Product not found. Please ensure backend is running and products are seeded.');
      console.log('❌ No matching product found');
      console.log('Available products:', products);
      console.log('Looking for cardType:', tierBackendType);
    }
  };

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
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(0, 59, 252, 0.1) 100%)',
        borderBottom: '1px solid rgba(235, 226, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            🔐 SECURE ACCESS REQUIRED
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Get Your High Security NFC Card
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'rgba(235, 226, 255, 0.8)',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Access Summit Exchange's full hybrid trading platform with our military-grade NFC authentication cards. 
            <br />
            <strong style={{ color: '#4CAF50' }}>Purchase your card to unlock the complete dashboard.</strong>
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <div style={{
              padding: '20px 30px',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50' }}>🏦</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>Decentralized Exchange</div>
            </div>
            <div style={{
              padding: '20px 30px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#00D4FF' }}>🤝</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>Peer-to-Peer Trading</div>
            </div>
            <div style={{
              padding: '20px 30px',
              background: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#FF9800' }}>🔐</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>Non-Custodial Wallet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Choose Your Access Tier
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'rgba(235, 226, 255, 0.7)',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          Each tier unlocks different fee structures and benefits
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {cardTiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                background: tier.highlight 
                  ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(233, 30, 99, 0.2) 50%, rgba(255, 152, 0, 0.2) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: tier.highlight 
                  ? '2px solid rgba(156, 39, 176, 0.5)'
                  : '1px solid rgba(235, 226, 255, 0.1)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative',
                transform: tier.highlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = tier.highlight ? 'scale(1.08)' : 'scale(1.03)';
                e.currentTarget.style.borderColor = tier.highlight 
                  ? 'rgba(156, 39, 176, 0.8)'
                  : 'rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = tier.highlight ? 'scale(1.05)' : 'scale(1)';
                e.currentTarget.style.borderColor = tier.highlight 
                  ? 'rgba(156, 39, 176, 0.5)'
                  : 'rgba(235, 226, 255, 0.1)';
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  ⭐ MOST POPULAR
                </div>
              )}

              <div style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${tier.color})`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                marginBottom: '24px'
              }}>
                💳
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {tier.name}
              </h3>

              <div style={{
                fontSize: '42px',
                fontWeight: '700',
                marginBottom: '24px',
                color: '#4CAF50'
              }}>
                ${tier.price}
                <span style={{
                  fontSize: '16px',
                  color: 'rgba(235, 226, 255, 0.6)',
                  fontWeight: '400'
                }}> one-time</span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 32px 0'
              }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#4CAF50', fontSize: '18px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier.id, tier.backendType)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading
                    ? 'rgba(150, 150, 150, 0.5)'
                    : tier.highlight
                    ? 'linear-gradient(45deg, #9C27B0, #E91E63, #FF9800)'
                    : 'linear-gradient(45deg, #4CAF50, #003BFC)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(76, 175, 80, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }
                }}
              >
                {loading ? 'Loading Products...' : `Purchase ${tier.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* What You Get Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(235, 226, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px',
          marginTop: '60px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            What You'll Get Access To
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              { icon: '📊', title: 'Market Summit (MS)', desc: 'Real-time crypto tracking with 0.01% buffer zone from Investing.com' },
              { icon: '📤', title: 'Send Function', desc: 'Transfer crypto to Summit wallets or external addresses with NFC authorization' },
              { icon: '📥', title: 'Receive Function', desc: 'Receive crypto from any source with automatic synchronization' },
              { icon: '🔄', title: 'Swap Function', desc: 'Instant crypto-to-crypto swaps within Summit Exchange' },
              { icon: '💰', title: 'Buy/Sell', desc: 'Access to multiple providers (Mercuryo, Coinbase) with competitive rates' },
              { icon: '🔐', title: 'NFC Security', desc: 'Military-grade encryption with challenge-response authentication' }
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(235, 226, 255, 0.1)'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{feature.icon}</div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h4>
                <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)', lineHeight: '1.5' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(76, 175, 80, 0.05)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: '16px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Frequently Asked Questions
          </h3>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                q: 'Why do I need an NFC card?',
                a: 'Our NFC cards provide military-grade security for your non-custodial wallet. Each transaction requires physical card authorization, protecting your assets from unauthorized access.'
              },
              {
                q: 'How many wallets can I create per card?',
                a: 'Each card can generate up to 3 wallet addresses per cryptocurrency, giving you flexibility in managing your portfolio.'
              },
              {
                q: 'Is this a one-time payment?',
                a: 'Yes! The card purchase is a one-time fee. You only pay transaction fees based on your tier when using the platform.'
              },
              {
                q: 'What\'s the difference between tiers?',
                a: 'Higher tiers offer lower transaction fees, better swap rates, priority support, and advanced features like API access and dedicated account managers.'
              }
            ].map((faq, idx) => (
              <div key={idx} style={{
                padding: '20px 0',
                borderBottom: idx < 3 ? '1px solid rgba(235, 226, 255, 0.1)' : 'none'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#4CAF50' }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '16px', color: 'rgba(235, 226, 255, 0.8)', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
