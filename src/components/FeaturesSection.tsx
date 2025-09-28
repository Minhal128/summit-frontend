'use client';

import React from 'react';

interface FeaturesSectionProps {
  onSecureWallet?: () => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSecureWallet }) => {
  return (
    <>
      <style jsx>{`
        .features-section {
          padding: 80px 0;
          text-align: center;
          position: relative;
        }

        .features-section::before {
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

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
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

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }

        .feature-card {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: rgba(235, 226, 255, 0.1);
          border-radius: 12px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #EBE2FF;
          line-height: 1.4;
        }

        .cta-card {
          background: #0088FF;
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .cta-text {
          font-size: 18px;
          font-weight: 500;
          color: #EBE2FF;
          margin-bottom: 20px;
        }

        .cta-button {
          background: #EBE2FF;
          color: #0088FF;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 60px 0;
          }

          .container {
            padding: 0 16px;
            max-width: 100vw;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            max-width: 100%;
          }

          .main-title {
            font-size: 32px;
            margin-bottom: 16px;
          }

          .subtitle {
            font-size: 16px;
            margin-bottom: 40px;
            padding: 0 8px;
          }

          .section-label {
            font-size: 12px;
            margin-bottom: 16px;
          }

          .feature-card {
            padding: 24px 16px;
            border-radius: 12px;
          }

          .feature-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            border-radius: 8px;
          }

          .feature-title {
            font-size: 14px;
            line-height: 1.3;
          }

          .cta-card {
            padding: 24px 16px;
            border-radius: 12px;
          }

          .cta-text {
            font-size: 16px;
            margin-bottom: 16px;
          }

          .cta-button {
            font-size: 14px;
            padding: 10px 20px;
            border-radius: 6px;
          }
        }

        @media (max-width: 480px) {
          .features-section {
            padding: 40px 0;
          }

          .container {
            padding: 0 12px;
          }

          .main-title {
            font-size: 28px;
            margin-bottom: 12px;
          }

          .subtitle {
            font-size: 14px;
            margin-bottom: 32px;
            padding: 0 6px;
          }

          .feature-card {
            padding: 20px 12px;
          }

          .feature-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 12px;
          }

          .feature-title {
            font-size: 13px;
          }

          .cta-text {
            font-size: 14px;
            margin-bottom: 12px;
          }

          .cta-button {
            font-size: 13px;
            padding: 8px 16px;
          }
        }
      `}</style>

      <section id="features-section" className="features-section">
        <div className="container">
          <div className="section-label">KEY FEATURES</div>
          <h1 className="main-title">Why Choose Summit</h1>
          <p className="subtitle">Keep your digital assets offline, safe, and always under your control—secure storage with the freedom to invest anytime.</p>
          
          <div className="features-grid">
            {/* Top Row */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 9C18 13.52 15.84 17.65 12 18.74C8.16 17.65 6 13.52 6 9L12 6L18 9Z"/>
                </svg>
              </div>
              <div className="feature-title">
                Offline security that hackers can&apos;t touch.
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L4.83 5.17L7.5 2.5L6 1L0 7V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM19 19H5V9H19V19Z"/>
                </svg>
              </div>
              <div className="feature-title">
                Instant access, zero compromise.
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/>
                </svg>
              </div>
              <div className="feature-title">
                Store and grow your assets with confidence.
              </div>
            </div>

            {/* Middle Row */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M16 4C18.21 4 20 5.79 20 8S18.21 12 16 12C13.79 12 12 10.21 12 8S13.79 4 16 4ZM16 6C14.9 6 14 6.9 14 8S14.9 10 16 10 18 9.1 18 8 17.1 6 16 6ZM8 12C10.21 12 12 13.79 12 16S10.21 20 8 20 4 18.21 4 16 5.79 12 8 12ZM8 14C6.9 14 6 14.9 6 16S6.9 18 8 18 10 17.1 10 16 9.1 14 8 14Z"/>
                </svg>
              </div>
              <div className="feature-title">
                Designed for both beginners and pros.
              </div>
            </div>

            {/* Center Blue Section */}
            <div className="cta-card">
              <div className="cta-text">
                And of course more...
              </div>
              <button className="cta-button" onClick={onSecureWallet}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                </svg>
                Secure my wallet
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 20C10.9 20 10 19.1 10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20ZM6 8C7.1 8 8 8.9 8 10C8 11.1 7.1 12 6 12C4.9 12 4 11.1 4 10C4 8.9 4.9 8 6 8ZM18 8C19.1 8 20 8.9 20 10C20 11.1 19.1 12 18 12C16.9 12 16 11.1 16 10C16 8.9 16.9 8 18 8Z"/>
                </svg>
              </div>
              <div className="feature-title">
                Your crypto, always in your control.
              </div>
            </div>

            {/* Bottom Row */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM20 19H4V8H20V19ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
                </svg>
              </div>
              <div className="feature-title">
                One wallet for all your digital assets.
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M7 2V13H10V22L17 10H13L17 2H7Z"/>
                </svg>
              </div>
              <div className="feature-title">
                Simple setup, powerful protection.
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1V8z"/>
                </svg>
              </div>
              <div className="feature-title">
                Future-ready security for your wealth.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
