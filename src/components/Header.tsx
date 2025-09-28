'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  onScrollToFeatures?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onScrollToFeatures }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 40px;
          background: rgba(10, 26, 47, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(235, 226, 255, 0.1);
          position: relative;
          overflow: visible;
          z-index: 1000;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -30px;
          left: -50px;
          width: 400px;
          height: 150px;
          background: radial-gradient(ellipse 400px 150px at 0% 50%, rgba(231, 231, 231, 0.2) 0%, rgba(128, 128, 128, 0.1) 40%, rgba(128, 128, 128, 0.05) 60%, transparent 80%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }

        .header > * {
          position: relative;
          z-index: 1;
        }

        

        .logo img {
          height: 40px;
          width: auto;
          object-fit: contain;
          display:flex;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #EBE2FF;
          letter-spacing: -0.5px;
        }

        .nav {
          display: flex;
          gap: 40px;
        }

        .nav-item {
          color: #EBE2FF;
          opacity: 0.8;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .nav-item:hover {
          opacity: 1;
        }

        .header-right {
          position: absolute;
          left: 450px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .language {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #EBE2FF;
          opacity: 0.8;
        }

        .flag {
          width: 20px;
          height: 15px;
          background: linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%);
          border-radius: 2px;
          border: 1px solid rgba(235, 226, 255, 0.2);
        }

        .cart {
          width: 24px;
          height: 24px;
          background: rgba(235, 226, 255, 0.1);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EBE2FF;
          font-size: 14px;
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

        .mobile-menu-button {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 8px;
          gap: 4px;
        }

        .mobile-menu-button span {
          width: 24px;
          height: 2px;
          background: #EBE2FF;
          transition: all 0.3s ease;
        }

        .mobile-menu-button.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-button.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-button.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(10, 26, 47, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(235, 226, 255, 0.1);
          padding: 20px;
          z-index: 999;
        }

        .mobile-nav.open {
          display: block;
          animation: fadeInDown 0.3s ease-out;
        }

        .mobile-nav-item {
          display: block;
          padding: 15px 0;
          color: #EBE2FF;
          text-decoration: none;
          border-bottom: 1px solid rgba(235, 226, 255, 0.1);
          transition: color 0.3s;
        }

        .mobile-nav-item:hover {
          color: #3B82F6;
        }

        .mobile-nav-item:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .header {
            padding: 15px 12px;
            position: relative;
            width: 100%;
            box-sizing: border-box;
          }

          .nav {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .header-right {
            gap: 15px;
          }

          .language {
            display: none;
          }

          .mobile-nav {
            left: 12px;
            right: 12px;
            padding: 16px;
          }

          .logo-text {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 12px 8px;
          }

          .cart {
            width: 20px;
            height: 20px;
            font-size: 12px;
          }

          .mobile-nav {
            left: 8px;
            right: 8px;
            padding: 12px;
          }

          .logo-text {
            font-size: 14px;
          }
        }

        .real-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: absolute;
          right: 480px;
        }

        .real-logo img {
          height: 40px;
          width: auto;
          object-fit: contain;
        }
      `}</style>

      <header className="header">
       <div className="real-logo">
         <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
       </div>
        
        <nav className="nav">
          <span className="nav-item" onClick={onScrollToFeatures} style={{ cursor: 'pointer' }}>Features</span>
          <span className="nav-item">
            Products
          </span>
          <span 
            className="nav-item"
            onMouseEnter={() => setActiveDropdown('learn')}
            onMouseLeave={() => setActiveDropdown(null)}
            style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}
          >
            Learn & Support
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              style={{ 
                transition: 'transform 0.3s',
                transform: activeDropdown === 'learn' ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0
              }}
            >
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            {activeDropdown === 'learn' && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '0',
                minWidth: '280px',
                background: 'rgba(10, 26, 47, 0.98)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(235, 226, 255, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                padding: '16px 0',
                zIndex: 9999,
                animation: 'fadeInDown 0.3s ease-out'
              }}>
                <a 
                  href="/about" 
                  style={{
                    display: 'block',
                    padding: '16px 24px',
                    color: '#EBE2FF',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    borderBottom: '1px solid rgba(235, 226, 255, 0.05)'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(235, 226, 255, 0.1)';
                    (e.target as HTMLElement).style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.background = 'transparent';
                    (e.target as HTMLElement).style.color = '#EBE2FF';
                  }}
                >
                  About Us
                </a>
                <Link 
                  href="/blog" 
                  style={{
                    display: 'block',
                    padding: '16px 24px',
                    color: '#EBE2FF',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.1)';
                    (e.target as HTMLElement).style.color = '#3B82F6';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'transparent';
                    (e.target as HTMLElement).style.color = '#EBE2FF';
                  }}
                >
                  Blog
                </Link>
                <a 
                  href="/contact" 
                  style={{
                    display: 'block',
                    padding: '16px 24px',
                    color: '#EBE2FF',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    borderBottom: '1px solid rgba(235, 226, 255, 0.05)'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(235, 226, 255, 0.1)';
                    (e.target as HTMLElement).style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.background = 'transparent';
                    (e.target as HTMLElement).style.color = '#EBE2FF';
                  }}
                >
                  Contact
                </a>
                <a 
                  href="/academy" 
                  style={{
                    display: 'block',
                    padding: '16px 24px',
                    color: '#EBE2FF',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    borderBottom: '1px solid rgba(235, 226, 255, 0.05)'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(235, 226, 255, 0.1)';
                    (e.target as HTMLElement).style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.background = 'transparent';
                    (e.target as HTMLElement).style.color = '#EBE2FF';
                  }}
                >
                  Academy
                </a>
              </div>
            )}
          </span>
        </nav>
        <div className="header-right">
          <div className="language">
            <div className="flag"></div>
            <span>Eng</span>
          </div>
          <Link href="/cart">
            <div className="cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
          </Link>
          <div 
            className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <span className="mobile-nav-item" onClick={() => {
            onScrollToFeatures?.();
            setIsMobileMenuOpen(false);
          }}>Features</span>
          <span className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Products</span>
          <Link href="/about" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link href="/blog" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <Link href="/contact" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <Link href="/academy" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Academy</Link>
        </nav>
      </header>
    </>
  );
};

export default Header;
