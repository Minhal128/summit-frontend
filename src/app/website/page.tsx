'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import DashboardMockup from '../../components/DashboardMockup';
import StatsTicker from '../../components/StatsTicker';
import FeaturesSection from '../../components/FeaturesSection';
import HowItWorksSection from '../../components/HowItWorksSection';
import SecuritySection from '../../components/SecuritySection';
import TestimonialsSection from '../../components/TestimonialsSection';
import FAQSection from '../../components/FAQSection';
import ComparisonSection from '../../components/ComparisonSection';
import CTASection from '../../components/CTASection';
import Footer from '../../components/Footer';

export default function LandingPage() {
  const router = useRouter();
  
  const handleSecureWallet = () => {
    router.push('/signup');
  };

  const handleDownloadApp = () => {
    console.log('Download app clicked');
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


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
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          max-width: 100%;
        }
        
        html {
          overflow-x: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        body {
          overflow-x: hidden !important;
          width: 100vw;
          margin: 0;
          padding: 0;
          position: relative;
        }
        
        @media (max-width: 768px) {
          * {
            max-width: 100vw !important;
          }
          
          html, body {
            overflow-x: hidden !important;
            position: relative;
          }
          
          body {
            width: 100vw !important;
            max-width: 100vw !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
      
      <div style={{ 
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0A1A2F',
        color: '#EBE2FF',
        lineHeight: '1.6',
        margin: 0,
        padding: 0,
        paddingTop: '60px',
        overflowX: 'hidden',
        width: '100%',
        minHeight: '100vh'
      }}>
        {/* Use Components */}
      <Header onScrollToFeatures={scrollToFeatures} />
      <HeroSection onSecureWallet={handleSecureWallet} onDownloadApp={handleDownloadApp} />
      <DashboardMockup />
      <StatsTicker stats={stats} />
      <FeaturesSection onSecureWallet={handleSecureWallet} />
      <HowItWorksSection />
      <SecuritySection />
      <TestimonialsSection />
      <FAQSection />
      <ComparisonSection />
      <CTASection onDownloadApp={handleDownloadApp} />
      <Footer />
    </div>
    </>
  );
}

// All sections now use modular components for better maintainability
