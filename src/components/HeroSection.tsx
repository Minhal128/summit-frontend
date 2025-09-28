'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  onSecureWallet?: () => void;
  onDownloadApp?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSecureWallet, onDownloadApp }) => {
  const router = useRouter();

  const handleSecureWallet = () => {
    if (onSecureWallet) {
      onSecureWallet();
    } else {
      router.push('/signup');
    }
  };

  return (
    <>
      <style jsx>{`
        .main {
          text-align: center;
          padding: 80px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
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
          color: #1E5FFF;
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

        @media (max-width: 768px) {
          .main {
            padding: 30px 16px 25px;
            max-width: 100vw;
          }

          .main::before {
            left: -50px;
            width: 300px;
            height: 150px;
          }

          .tagline {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-title {
            font-size: 28px;
            line-height: 1.2;
            margin-bottom: 12px;
            padding: 0 8px;
          }

          .hero-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
            padding: 0 8px;
            line-height: 1.4;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 0 8px;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 250px;
            padding: 12px 20px;
            font-size: 14px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .main {
            padding: 20px 12px 16px;
          }

          .tagline {
            font-size: 11px;
          }

          .hero-title {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .hero-subtitle {
            font-size: 13px;
            margin-bottom: 16px;
            padding: 0 6px;
          }

          .btn-primary, .btn-secondary {
            padding: 10px 16px;
            font-size: 13px;
            max-width: 220px;
          }
        }
      `}</style>

      <main className="main">
        <div className="tagline">A modern digital fortress protecting crypto assets</div>
        
        <h1 className="hero-title">
          Protect, Manage, and Invest<br />
          Your Crypto with <span className="confidence">Confidence</span>
        </h1>
        
        <p className="hero-subtitle">
          Keep your digital assets offline, safe, and always under your control—secure 
          storage with the freedom to invest anytime.
        </p>
        
        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleSecureWallet}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
            Secure my wallet
          </button>
          <button className="btn-secondary" onClick={onDownloadApp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download app
          </button>
        </div>
      </main>
    </>
  );
};

export default HeroSection;
