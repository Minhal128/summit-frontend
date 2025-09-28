'use client';

import React, { useState } from 'react';

const DashboardMockup: React.FC = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', active: true },
    { id: 'activity', icon: '📈', label: 'Activity' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'market', icon: '📈', label: 'Live Market' },
    { id: 'search', icon: '🔍', label: 'Search Tokens' },
  ];

  return (
    <>
      <style jsx>{`
        .dashboard-mockup {
          max-width: 1000px;
          margin: 0 auto 40px;
          padding: 0 20px;
        }

        .dashboard-inner {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(235, 226, 255, 0.1);
        }

        .dashboard-logo {
          font-size: 18px;
          font-weight: 600;
          color: #EBE2FF;
        }

        .dashboard-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          background: rgba(235, 226, 255, 0.1);
          color: #EBE2FF;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .dashboard-content {
          display: flex;
          min-height: 320px;
        }

        .sidebar {
          width: 200px;
          background: rgba(235, 226, 255, 0.02);
          border-right: 1px solid rgba(235, 226, 255, 0.1);
          padding: 12px 0;
        }

        .sidebar-item {
          padding: 12px 20px;
          color: rgba(235, 226, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
        }

        .sidebar-item:hover,
        .sidebar-item.active {
          background: rgba(30, 95, 255, 0.1);
          color: #EBE2FF;
        }

        .main-dashboard {
          flex: 1;
          padding: 20px;
        }

        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .portfolio-title {
          font-size: 20px;
          font-weight: 600;
          color: #EBE2FF;
        }

        .bitcoin-label {
          font-size: 14px;
          color: rgba(235, 226, 255, 0.7);
        }

        .portfolio-value {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .value-amount {
          font-size: 32px;
          font-weight: 700;
          color: #EBE2FF;
        }

        .value-change {
          color: #4CAF50;
          font-size: 16px;
          font-weight: 600;
        }

        .chart-area {
          margin-bottom: 30px;
        }

        .chart-svg {
          width: 100%;
          height: 120px;
        }

        .asset-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(235, 226, 255, 0.05);
          border-radius: 12px;
        }

        .asset-icon {
          width: 40px;
          height: 40px;
          background: #F7931A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .asset-info {
          flex: 1;
        }

        .asset-name {
          font-weight: 600;
          color: #EBE2FF;
        }

        .asset-symbol {
          font-size: 12px;
          color: rgba(235, 226, 255, 0.6);
        }

        .asset-value {
          font-weight: 600;
          color: #EBE2FF;
        }

        @media (max-width: 768px) {
          .dashboard-mockup {
            margin: 0 auto 20px;
            padding: 0 16px;
            max-width: 100vw;
          }

          .dashboard-content {
            flex-direction: column;
            min-height: 280px;
          }

          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(235, 226, 255, 0.1);
            padding: 8px 0;
          }

          .sidebar-item {
            padding: 8px 16px;
            font-size: 12px;
          }

          .main-dashboard {
            padding: 16px;
          }

          .portfolio-title {
            font-size: 16px;
          }

          .bitcoin-label {
            font-size: 11px;
          }

          .value-amount {
            font-size: 24px;
          }

          .value-change {
            font-size: 13px;
          }

          .chart-svg {
            height: 80px;
          }

          .asset-item {
            padding: 12px;
          }

          .asset-name {
            font-size: 13px;
          }

          .asset-symbol {
            font-size: 10px;
          }

          .asset-value {
            font-size: 13px;
          }

          .dashboard-header {
            padding: 12px 16px;
          }

          .dashboard-logo {
            font-size: 14px;
          }

          .action-btn {
            padding: 6px 10px;
            font-size: 11px;
          }

          .asset-icon {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-mockup {
            padding: 0 12px;
            margin: 0 auto 16px;
          }

          .dashboard-content {
            min-height: 240px;
          }

          .main-dashboard {
            padding: 12px;
          }

          .portfolio-title {
            font-size: 14px;
          }

          .value-amount {
            font-size: 20px;
          }

          .chart-svg {
            height: 60px;
          }

          .dashboard-actions {
            gap: 6px;
          }

          .action-btn {
            padding: 5px 8px;
            font-size: 10px;
          }

          .asset-icon {
            width: 28px;
            height: 28px;
          }

          .dashboard-header {
            padding: 10px 12px;
          }

          .dashboard-logo {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="dashboard-mockup">
        <div className="dashboard-inner">
          <div className="dashboard-header">
            <div className="dashboard-logo">
              SUMMIT Flex 3
            </div>
            <div className="dashboard-actions">
              <button className="action-btn">📤 Send & Receive</button>
              <button className="action-btn">🛒 Buy & Sell</button>
              <button className="action-btn">📊 Stake</button>
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="sidebar">
              {sidebarItems.map((item) => (
                <div
                  key={item.id}
                  className={`sidebar-item ${activeSidebarItem === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSidebarItem(item.id)}
                >
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
            
            <div className="main-dashboard">
              <div className="portfolio-header">
                <div className="portfolio-title">Portfolio</div>
                <div className="bitcoin-label">Bitcoin USD 💰</div>
              </div>
              
              <div className="portfolio-value">
                <div className="value-amount">$40,974.35</div>
                <div className="value-change">▲ 2.51%</div>
              </div>
              
              <div className="chart-area">
                <svg className="chart-svg" viewBox="0 0 400 120">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2196F3" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2196F3" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path 
                    d="M 0 80 Q 50 60 100 55 T 200 45 T 300 40 T 400 35" 
                    stroke="#4CAF50" 
                    strokeWidth="2" 
                    fill="none"
                  />
                  
                  <path 
                    d="M 0 80 Q 50 60 100 55 T 200 45 T 300 40 T 400 35 L 400 120 L 0 120 Z" 
                    fill="url(#chartGradient)"
                  />
                  
                  <circle cx="200" cy="45" r="3" fill="#4CAF50"/>
                  <circle cx="300" cy="40" r="3" fill="#4CAF50"/>
                </svg>
              </div>
              
              <div className="asset-item">
                <div className="asset-icon">₿</div>
                <div className="asset-info">
                  <div className="asset-name">BTC</div>
                  <div className="asset-symbol">BITCOIN</div>
                </div>
                <div className="asset-value">$940.67</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMockup;
