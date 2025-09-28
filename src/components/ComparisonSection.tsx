'use client';

import React from 'react';

interface ComparisonSectionProps {
  hotWalletFeatures?: string[];
  summitWalletFeatures?: string[];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ 
  hotWalletFeatures, 
  summitWalletFeatures 
}) => {
  const defaultHotWalletFeatures = [
    'Instant access anytime, anywhere.',
    'Best for daily transactions.',
    'Always connected to the internet.',
    'Easier setup and use.',
    'Convenient for small balances.',
    'Quick transfers on the go.'
  ];

  const defaultSummitWalletFeatures = [
    'Maximum protection from hacks.',
    'Ideal for long-term storage.',
    'Fully offline security.',
    'You control your private keys.',
    'Safer for large investments.',
    'Trusted by professionals.'
  ];

  const displayHotWalletFeatures = hotWalletFeatures || defaultHotWalletFeatures;
  const displaySummitWalletFeatures = summitWalletFeatures || defaultSummitWalletFeatures;

  return (
    <>
      <style jsx>{`
        .comparison-section {
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

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 30px;
          margin-top: 60px;
          align-items: center;
        }

        .comparison-item {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
        }

        .comparison-item.highlight {
          background: rgba(30, 95, 255, 0.1);
          border: 2px solid #1E5FFF;
        }

        .comparison-title {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
        }

        .comparison-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .comparison-features li {
          font-size: 14px;
          padding: 12px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .comparison-features li::before {
          content: "●";
          color: #1E5FFF;
          font-size: 16px;
        }

        .vs-text {
          font-size: 16px;
          font-weight: 600;
          color: rgba(235, 226, 255, 0.5);
          text-align: center;
        }

        @media (max-width: 768px) {
          .comparison-section {
            padding: 40px 0;
          }

          .container {
            padding: 0 16px;
          }

          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 32px;
          }

          .main-title {
            font-size: 32px;
            margin-bottom: 12px;
          }

          .subtitle {
            font-size: 16px;
            margin-bottom: 32px;
          }

          .section-label {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .comparison-item {
            padding: 20px 16px;
          }

          .comparison-title {
            font-size: 18px;
            margin-bottom: 16px;
          }

          .comparison-features li {
            font-size: 13px;
            padding: 8px 0;
          }

          .vs-text {
            font-size: 14px;
            margin: 12px 0;
          }
        }

        @media (max-width: 480px) {
          .comparison-section {
            padding: 24px 0;
          }

          .container {
            padding: 0 12px;
          }

          .comparison-grid {
            gap: 12px;
            margin-top: 24px;
          }

          .main-title {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .subtitle {
            font-size: 14px;
            margin-bottom: 24px;
          }

          .comparison-item {
            padding: 16px 12px;
          }

          .comparison-title {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .comparison-features li {
            font-size: 12px;
            padding: 6px 0;
          }

          .vs-text {
            font-size: 12px;
            margin: 8px 0;
          }
        }
      `}</style>

      <section className="comparison-section">
        <div className="container">
          <div className="section-label">COMPARISON</div>
          <h2 className="main-title">What Sets Summit Apart</h2>
          <p className="subtitle">Understand the key differences between hot and cold wallets to make the smartest choice for protecting your digital assets</p>
          
          <div className="comparison-grid">
            <div className="comparison-item">
              <h3 className="comparison-title">Other Hot wallet</h3>
              <ul className="comparison-features">
                {displayHotWalletFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="vs-text">V/S</div>
            
            <div className="comparison-item highlight">
              <h3 className="comparison-title">Summit Wallet</h3>
              <ul className="comparison-features">
                {displaySummitWalletFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ComparisonSection;
