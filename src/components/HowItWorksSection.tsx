'use client';

import React from 'react';

interface Step {
  icon: string;
  number: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  steps?: Step[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ steps }) => {
  const defaultSteps = [
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

  const displaySteps = steps || defaultSteps;

  return (
    <>
      <style jsx>{`
        .how-it-works-section {
          padding: 80px 0;
          text-align: center;
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
          gap: 30px;
          max-width: 1200px;
          margin: 60px auto 0;
          position: relative;
        }

        .step-card {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 50px 40px;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: 20px;
          right: 30px;
          font-size: 72px;
          font-weight: 700;
          opacity: 0.1;
          color: #EBE2FF;
          line-height: 1;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: rgba(235, 226, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #EBE2FF;
          line-height: 1.3;
        }

        .step-description {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
          color: #EBE2FF;
        }

        @media (max-width: 768px) {
          .how-it-works-section {
            padding: 40px 0;
          }

          .container {
            padding: 0 4px;
            max-width: 100vw;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 8px;
            margin-top: 20px;
          }

          .main-title {
            font-size: 20px;
            margin-bottom: 8px;
          }

          .subtitle {
            font-size: 12px;
            margin-bottom: 20px;
            padding: 0 4px;
          }

          .section-label {
            font-size: 10px;
            margin-bottom: 8px;
          }

          .step-card {
            padding: 16px 12px;
            border-radius: 8px;
          }

          .step-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 12px;
            border-radius: 6px;
          }

          .step-title {
            font-size: 12px;
            margin-bottom: 8px;
          }

          .step-description {
            font-size: 10px;
            line-height: 1.3;
          }

          .step-number {
            font-size: 24px;
            top: 8px;
            right: 12px;
          }
        }

        @media (max-width: 480px) {
          .how-it-works-section {
            padding: 24px 0;
          }

          .container {
            padding: 0 2px;
          }

          .main-title {
            font-size: 18px;
            margin-bottom: 6px;
          }

          .subtitle {
            font-size: 10px;
            margin-bottom: 16px;
            padding: 0 2px;
          }

          .step-card {
            padding: 12px 8px;
          }

          .step-icon {
            width: 28px;
            height: 28px;
            margin-bottom: 8px;
          }

          .step-title {
            font-size: 11px;
            margin-bottom: 6px;
          }

          .step-description {
            font-size: 9px;
          }

          .step-number {
            font-size: 20px;
            top: 6px;
            right: 8px;
          }
        }
      `}</style>

      <section className="how-it-works-section">
        <div className="container">
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="main-title">How Our Summit Cold Wallet Works</h2>
          <p className="subtitle">From setup to secure storage, every step is designed to make protecting and accessing your crypto effortless and worry-free.</p>
          
          <div className="steps-grid">
            {displaySteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">
                  {step.number}
                </div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                    {index === 0 && (
                      <path d="M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM20 19H4V8H20V19ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
                    )}
                    {index === 1 && (
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 9C18 13.52 15.84 17.65 12 18.74C8.16 17.65 6 13.52 6 9L12 6L18 9Z"/>
                    )}
                    {index === 2 && (
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L4.83 5.17L7.5 2.5L6 1L0 7V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM19 19H5V9H19V19Z"/>
                    )}
                  </svg>
                </div>
                <h3 className="step-title">
                  {step.title}
                </h3>
                <p className="step-description">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
