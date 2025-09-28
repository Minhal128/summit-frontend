'use client';

import React from 'react';

interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
  visual?: string;
}

interface SecuritySectionProps {
  features?: SecurityFeature[];
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ features }) => {
  const defaultFeatures = [
    {
      icon: '🔐',
      title: 'End-to-End Encryption',
      description: 'Every transaction and key is fully encrypted, ensuring only you have access.',
      visual: '🔒'
    },
    {
      icon: '🌐',
      title: 'Never Connected to the Internet',
      description: 'Offline by design—immune to online hacks, phishing, and malware attacks.',
      visual: 'internet'
    },
    {
      icon: '📂',
      title: 'Open-Source',
      description: 'Transparent and independently verified for trust, reliability, and accountability.'
    },
    {
      icon: '🏆',
      title: 'Unmatched protection',
      description: 'Unlike hot wallets, cold storage eliminates online exposure, giving you unmatched protection.'
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <>
      <style jsx>{`
        .security-section {
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

        .security-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          margin-top: 60px;
          max-width: 1000px;
          margin: 60px auto 0;
        }

        .security-card {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          text-align: left;
          position: relative;
        }

        .security-card.with-image {
          min-height: 300px;
        }

        .security-image {
          width: 100%;
          height: 200px;
          border-radius: 12px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .security-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .security-icon {
          width: 60px;
          height: 60px;
          background: rgba(235, 226, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .security-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #EBE2FF;
        }

        .security-description {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
          color: #EBE2FF;
        }

        .security-visual {
          position: absolute;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          width: 120px;
          height: 80px;
          background: rgba(30, 95, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #1E5FFF;
        }

        .internet-visual {
          background: rgba(235, 226, 255, 0.1);
          color: #EBE2FF;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .security-section {
            padding: 60px 0;
          }

          .container {
            padding: 0 16px;
            max-width: 100vw;
          }

          .security-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 40px;
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

          .security-card {
            padding: 24px 20px;
            border-radius: 12px;
            min-height: auto;
            background: rgba(235, 226, 255, 0.08);
            border: 1px solid rgba(235, 226, 255, 0.15);
          }

          .security-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            border-radius: 8px;
            background: rgba(30, 95, 255, 0.1);
          }

          .security-title {
            font-size: 18px;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .security-description {
            font-size: 14px;
            line-height: 1.5;
            opacity: 0.8;
          }

          .security-image {
            height: 120px;
            margin-bottom: 20px;
            border-radius: 8px;
          }

          .security-visual {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .security-section {
            padding: 40px 0;
          }

          .container {
            padding: 0 12px;
          }

          .security-grid {
            gap: 16px;
            margin-top: 32px;
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

          .security-card {
            padding: 20px 16px;
          }

          .security-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 12px;
          }

          .security-title {
            font-size: 16px;
            margin-bottom: 8px;
          }

          .security-description {
            font-size: 13px;
          }

          .security-image {
            height: 100px;
            margin-bottom: 16px;
          }
        }
      `}</style>

      <section className="security-section">
        <div className="container">
          <div className="section-label">SECURITY ASSURANCE</div>
          <h2 className="main-title">Built for Your Peace of Mind</h2>
          <p className="subtitle">Your assets deserve the highest level of security. Our cold wallet combines offline storage, military-grade encryption.</p>
          
          <div className="security-grid">
            {displayFeatures.map((feature, index) => (
              <div key={index} className={`security-card ${index < 2 ? 'with-image' : ''}`}>
                {index < 2 ? (
                  <div className="security-image">
                    <img 
                      src={index === 0 ? "/encryption.png" : "/connect.png"}
                      alt={feature.title}
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't exist
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.background = 'rgba(235, 226, 255, 0.1)';
                          e.currentTarget.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 48px;">${feature.icon}</div>`;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="security-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                      {index === 2 && (
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                      )}
                      {index === 3 && (
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 9C18 13.52 15.84 17.65 12 18.74C8.16 17.65 6 13.52 6 9L12 6L18 9Z"/>
                      )}
                    </svg>
                  </div>
                )}
                <h3 className="security-title">
                  {feature.title}
                </h3>
                <p className="security-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SecuritySection;
