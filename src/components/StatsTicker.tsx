'use client';

import React from 'react';

interface StatsTickerProps {
  stats?: string[];
}

const StatsTicker: React.FC<StatsTickerProps> = ({ stats }) => {
  const defaultStats = [
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

  const displayStats = stats || defaultStats;

  return (
    <>
      <style jsx>{`
        .footer-stats {
          padding: 24px 0;
          border-top: 1px solid rgba(235, 226, 255, 0.1);
          margin-top: 24px;
          overflow: hidden;
          overflow-x: hidden;
          white-space: nowrap;
          position: relative;
          width: 100%;
          box-sizing: border-box;
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

        @media (max-width: 768px) {
          .footer-stats {
            padding: 16px 0;
            margin-top: 16px;
          }
        }
      `}</style>

      <footer className="footer-stats">
        <div className="stats-ticker">
          {displayStats.map((stat, index) => (
            <div key={index} className="stat-item">
              {stat}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {displayStats.map((stat, index) => (
            <div key={`duplicate-${index}`} className="stat-item">
              {stat}
            </div>
          ))}
        </div>
      </footer>
    </>
  );
};

export default StatsTicker;
