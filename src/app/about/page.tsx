'use client';

import { useState } from 'react';
import Link from 'next/link';
// import StatsTicker from '@/components/StatsTicker';
import Header from '@/components/Header';
import StatsTicker from '@/components/StatsTicker';
export default function AboutPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSecureWallet = () => {
    console.log('Secure wallet clicked');
  };

  const handleDownloadApp = () => {
    console.log('Download app clicked');
  };

  const steps = [
    {
      icon: '💼',
      number: '01',
      title: 'Set Up Your Wallet',
      description: 'Download, create your vault, and secure it with a recovery phrase—ready in minutes.'
    },
    {
      icon: '🔒',
      number: '02',
      title: 'Store Safely',
      description: 'Move your crypto into ultra-secure cold storage, protected from online threats.'
    },
    {
      icon: '💳',
      number: '03',
      title: 'Access and Manage Anytime',
      description: 'Easily check balances, track assets, and make transactions when needed.'
    }
  ];

  const faqs = [
    {
      question: 'What is a cold wallet and why should I use it?',
      answer: 'A cold wallet is a secure offline storage solution for your digital assets. Unlike hot wallets that are connected to the internet and vulnerable to hacks, a cold wallet keeps your funds completely offline, giving you maximum protection against cyber threats.'
    },
    {
      question: 'How do I set up my cold wallet?',
      answer: 'Setting up your cold wallet is simple and takes just a few minutes. Download the app, create your secure vault, and follow the guided setup process.'
    },
    {
      question: 'Can I recover my funds if I lose my device?',
      answer: 'Yes, with your recovery phrase you can restore access to your funds on any device. Keep your recovery phrase safe and secure.'
    },
    {
      question: 'What types of assets are supported?',
      answer: 'Our cold wallet supports a wide range of cryptocurrencies and digital assets. Check our supported assets list for the most current information.'
    },
    {
      question: 'How is a cold wallet different from an exchange wallet?',
      answer: 'Unlike exchange wallets, cold wallets give you complete control over your private keys and keep your assets offline for maximum security.'
    }
  ];

  const stats = [
    'Trusted by thousands of crypto investors worldwide',
    '99.9% uptime and zero hack record',
    'Backed by military-grade encryption and offline security',
    '99.9% uptime guaranteed',
    'Over 50,000 wallets secured globally',
    'Zero security breaches since launch',
    'Military-grade AES-256 encryption',
    'Cold storage technology leader',
    'Trusted by Fortune 500 companies',
    'ISO 27001 certified security',
    'Multi-signature protection enabled',
    '24/7 customer support available'
  ];

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#0A1A2F',
      color: '#EBE2FF',
      lineHeight: '1.6',
      margin: 0,
      padding: 0,
      paddingTop: '70px'
    }}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-label {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .main-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 18px;
          font-weight: 400;
          opacity: 0.7;
          max-width: 600px;
          margin: 0 auto 60px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 60px;
        }

        .step-item {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 40px;
          background: #1E5FFF;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .step-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }

        .step-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          clear: both;
        }

        .step-desc {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 60px auto 0;
          position: relative;
        }

        .value-card {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 50px 40px;
          position: relative;
        }

        .faq-list {
          max-width: 800px;
          margin: 60px auto 0;
        }

        .faq-item {
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
        }

        .faq-question {
          padding: 25px 30px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(235, 226, 255, 0.02);
        }

        .faq-question:hover {
          background: rgba(235, 226, 255, 0.05);
        }

        .faq-answer {
          padding: 0 30px 25px;
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
        }

        .faq-toggle {
          font-size: 20px;
          font-weight: bold;
        }

        /* Main section styles */
        .main {
          padding: 80px 40px 80px;
          text-align: center;
          position: relative;
          min-height: calc(100vh - 70px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .main-title {
            font-size: 32px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 15px;
            margin-top: 40px;
          }

          .value-card {
            padding: 30px 20px;
          }
          
          .step-item {
            padding: 30px 20px;
          }
          
          .container {
            padding: 0 15px;
          }
          
          .main {
            padding: 80px 20px 40px;
          }
        }

        .main::before {
          content: '';
          position: absolute;
          top: 0px;
          left: -150px;
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse 600px 300px at 0% 50%, rgba(231, 231, 231, 0.25) 0%, rgba(200, 200, 200, 0.15) 30%, rgba(128, 128, 128, 0.08) 50%, rgba(128, 128, 128, 0.03) 70%, transparent 90%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }
        .tagline {
          font-family: 'Manrope', sans-serif;
          font-size: 16.8px;
          font-weight: 500;
          color: #1E5FFF;
          margin: 0 auto 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          display: block;
          width: 100%;
          max-width: 600px;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.1;
          margin: 0 auto 24px;
          color: #EBE2FF;
          text-align: center;
          width: 100%;
          max-width: 800px;
          display: block;
          position: relative;
          z-index: 1;
        }

        .confidence {
          color: #EBE2FF;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(235, 226, 255, 0.7);
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .btn-primary {
          background: #0088FF;
          color: #EBE2FF;
          padding: 16px 32px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #0077e6;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(235, 226, 255, 0.1);
          color: #EBE2FF;
          padding: 16px 32px;
          border: 1px solid rgba(235, 226, 255, 0.2);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: rgba(235, 226, 255, 0.2);
          transform: translateY(-2px);
        }

        .footer-stats {
          padding: 40px 0;
          border-top: 1px solid rgba(235, 226, 255, 0.1);
          margin-top: 40px;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .stats-ticker {
          display: inline-flex;
          animation: scroll-left 120s linear infinite;
          gap: 80px;
        }

        .stat-item {
          font-size: 14px;
          color: rgba(235, 226, 255, 0.7);
          white-space: nowrap;
          flex-shrink: 0;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 15px;
            margin-top: 40px;
          }

          .value-card {
            padding: 30px 20px;
          }

          .main-title {
            font-size: 36px;
          }

          .header {
            padding: 15px 20px;
          }

          .nav {
            display: none;
          }

          .hero-title {
            font-size: 36px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <main className="main">
        <div className="section-label" style={{ color: 'white' }}>ABOUT US</div>

        <h1 className="hero-title">
          Your Trusted Partner in<br />
          <span className="confidence">Secure Digital Finance</span>
        </h1>

        <p className="hero-subtitle">
          We&apos;re dedicated to providing the most secure and user-friendly cold storage solution
          for your digital assets. Our mission is to make crypto security accessible to everyone.
        </p>

        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleSecureWallet}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
            Get Started
          </button>
          <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>

        <StatsTicker/>

      {/* How It Works Section */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label">Our Vision</div>
          <h2 className="main-title">Driven by Purpose, Built on Trust</h2>
          <p className="subtitle">We combine innovation, security, and customer-first values to redefine how you interact with your digital assets.</p>

          <div className="values-grid">
            {/* Step 1 */}
            <div className="value-card">
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '72px',
                fontWeight: '700',
                opacity: '0.1',
                color: '#EBE2FF',
                lineHeight: '1'
              }}>
                01
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#EBE2FF',
                lineHeight: '1.3'
              }}>
                Innovation at Core
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: '0.7',
                lineHeight: '1.5',
                color: '#EBE2FF'
              }}>
                We leverage cutting-edge technology to deliver simple yet powerful solutions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="value-card">
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '72px',
                fontWeight: '700',
                opacity: '0.1',
                color: '#EBE2FF',
                lineHeight: '1'
              }}>
                02
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 9C18 13.52 15.84 17.65 12 18.74C8.16 17.65 6 13.52 6 9L12 6L18 9Z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#EBE2FF',
                lineHeight: '1.3'
              }}>
                Security First
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: '0.7',
                lineHeight: '1.5',
                color: '#EBE2FF'
              }}>
                Protecting your assets is our top priority, with industry-grade safeguards.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'rgba(235, 226, 255, 0.05)',
              border: '1px solid rgba(235, 226, 255, 0.1)',
              borderRadius: '16px',
              padding: '50px 40px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '72px',
                fontWeight: '700',
                opacity: '0.1',
                color: '#EBE2FF',
                lineHeight: '1'
              }}>
                03
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#EBE2FF',
                lineHeight: '1.3'
              }}>
                Customer-Centered
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: '0.7',
                lineHeight: '1.5',
                color: '#EBE2FF'
              }}>
                Every feature is designed to make your journey seamless and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label">FAQ</div>
          <h2 className="main-title">Got Questions? We&apos;ve Got Answers.</h2>
          <p className="subtitle">Everything you need to know about keeping your assets safe, simple, and secure with our cold wallet</p>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0A1A2F',
        fontFamily: 'Inter, sans-serif',
        color: 'rgb(203, 213, 225)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>

        {/* Main Content Area */}
        <main style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px'
        }}>
          <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(15, 23, 42, 0.2)',
              backdropFilter: 'blur(40px) saturate(180%)',
              padding: '48px 80px',
              textAlign: 'center',
              boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '100%, 2rem 2rem, 2rem 2rem'
            }}>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  color: 'rgb(148, 163, 184)',
                  textTransform: 'uppercase'
                }}>
                  DOWNLOAD APP
                </h3>
                <h2 style={{
                  marginTop: '16px',
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'white',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.1'
                }}>
                  Take Control of Your Crypto Security Today
                </h2>
                <p style={{
                  marginTop: '24px',
                  maxWidth: '512px',
                  margin: '24px auto 0',
                  fontSize: '18px',
                  lineHeight: '1.75',
                  color: 'rgb(148, 163, 184)'
                }}>
                  Start protecting your assets with the safest and simplest cold wallet solution — secure, private, and built for peace of mind.
                </p>
                <div style={{ marginTop: '40px' }}>
                  <a
                    href="#"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      background: 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))',
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLElement).style.background = 'linear-gradient(to bottom, rgb(37, 99, 235), rgb(29, 78, 216))';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLElement).style.background = 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))';
                    }}
                  >
                    Download App
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 17V3" />
                      <path d="m6 11 6 6 6-6" />
                      <path d="M19 21H5" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ width: '100%', fontSize: '14px', color: 'rgb(148, 163, 184)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '32px'
            }}>
              <div style={{ maxWidth: '384px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.2541 1.83331C17.923 1.83331 17.6534 2.10289 17.6534 2.43397V15.566L4.56601 8.43397C4.30393 8.29331 3.98768 8.34181 3.78443 8.54506L2.43397 9.89552C2.13843 10.1911 2.13843 10.6761 2.43397 10.9716L15.566 24.1037H2.43397C2.10289 24.1037 1.83331 24.3733 1.83331 24.7043V26.6261C1.83331 26.9571 2.10289 27.2267 2.43397 27.2267H17.6534V32.9654C17.6534 33.2964 17.923 33.566 18.2541 33.566H20.1758C20.5069 33.566 20.7765 33.2964 20.7765 32.9654V20.8955L33.8639 27.9654C34.126 28.106 34.4422 28.0575 34.6455 27.8543L36 26.5038C36.2955 26.2083 36.2955 25.7233 36 25.4278L22.8679 12.2957H36C36.331 12.2957 36.6006 12.0261 36.6006 11.695V9.77329C36.6006 9.44221 36.331 9.17263 36 9.17263H20.7765V3.43397C20.7765 3.10289 20.5069 2.83331 20.1758 2.83331H18.2541V1.83331Z" fill="#EBE2FF" />
                  </svg>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '20px' }}>SUMMIT</span>
                </div>
                <p style={{ marginTop: '16px', lineHeight: '1.6' }}>
                  Securely Protecting Your Digital Wealth, Today And Tomorrow.
                </p>
              </div>
              <nav style={{ display: 'flex', gap: '32px', fontWeight: '500' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>BUSINESS</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>ABOUT</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>FEATURE</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>BLOGS</a>
              </nav>
            </div>

            <div style={{
              marginTop: '48px',
              borderTop: '1px solid rgb(30, 41, 59)',
              paddingTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px'
            }}>
              <p style={{ color: 'rgb(100, 116, 139)' }}>COPYRIGHT 2025, ALL RIGHT RESERVED</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px', width: '100%' }}>
              <p style={{
                fontSize: '112px',
                fontWeight: '900',
                color: 'rgb(100, 116, 139)',
                opacity: '0.05',
                letterSpacing: '0.1em',
                lineHeight: '1',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%',
                margin: '0 auto'
              }}>
                SUMMIT EXCHANGE
              </p>
            </div>
          </div>
        </footer>
      </section>

      {/* Footer Stats */}

    </div>
  );
}
