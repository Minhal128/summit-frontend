'use client';

import React from 'react';

interface CTASectionProps {
  onDownloadApp?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onDownloadApp }) => {
  return (
    <>
      <style jsx>{`
        .cta-section {
          width: 100%;
          min-height: 100vh;
          background-color: #0A1A2F;
          font-family: Inter, sans-serif;
          color: rgb(203, 213, 225);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cta-main {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
        }

        .cta-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }

        .cta-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background-color: rgba(15, 23, 42, 0.2);
          backdrop-filter: blur(40px) saturate(180%);
          padding: 48px 80px;
          text-align: center;
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05);
          background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 100%, 2rem 2rem, 2rem 2rem;
        }

        .cta-content {
          position: relative;
          z-index: 10;
        }

        .cta-label {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgb(148, 163, 184);
          text-transform: uppercase;
        }

        .cta-title {
          margin-top: 16px;
          font-size: 48px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        .cta-description {
          margin-top: 24px;
          max-width: 512px;
          margin-left: auto;
          margin-right: auto;
          font-size: 18px;
          line-height: 1.75;
          color: rgb(148, 163, 184);
        }

        .cta-button {
          margin-top: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          background: linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235));
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
          transition: all 0.2s;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .cta-button:hover {
          background: linear-gradient(to bottom, rgb(37, 99, 235), rgb(29, 78, 216));
        }

        @media (max-width: 768px) {
          .cta-section {
            min-height: auto;
            padding: 40px 0;
          }

          .cta-main {
            padding: 0 12px;
          }

          .cta-title {
            font-size: 32px;
          }

          .cta-description {
            font-size: 16px;
          }

          .cta-card {
            padding: 32px 24px;
          }

          .cta-button {
            font-size: 15px;
            padding: 12px 28px;
          }
        }

        @media (max-width: 480px) {
          .cta-section {
            min-height: auto;
            padding: 24px 0;
          }

          .cta-main {
            padding: 0 8px;
          }

          .cta-title {
            font-size: 28px;
          }

          .cta-description {
            font-size: 14px;
          }

          .cta-card {
            padding: 24px 16px;
          }

          .cta-button {
            font-size: 14px;
            padding: 10px 24px;
          }

          .cta-label {
            font-size: 12px;
          }
        }
      `}</style>

      <section className="cta-section">
        <main className="cta-main">
          <div className="cta-container">
            <div className="cta-card">
              <div className="cta-content">
                <h3 className="cta-label">
                  DOWNLOAD APP
                </h3>
                <h2 className="cta-title">
                  Take Control of Your Crypto Security Today
                </h2>
                <p className="cta-description">
                  Start protecting your assets with the safest and simplest cold wallet solution — secure, private, and built for peace of mind.
                </p>
                <button className="cta-button" onClick={onDownloadApp}>
                  Download App
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 17V3" />
                    <path d="m6 11 6 6 6-6" />
                    <path d="M19 21H5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default CTASection;
