'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  onScrollToFeatures?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onScrollToFeatures }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({ code: 'Eng', name: 'English' });
  const desktopLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'Eng', name: 'English' },
    { code: '中文', name: 'Mandarin' },
    { code: 'عرب', name: 'Arabic' },
    { code: 'Рус', name: 'Russian' },
    { code: 'ไทย', name: 'Thai' },
    { code: 'Esp', name: 'Spanish' },
    { code: 'Fra', name: 'French' },
    { code: 'Deu', name: 'German' }
  ];

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutsideDesktop = desktopLanguageDropdownRef.current && 
        !desktopLanguageDropdownRef.current.contains(event.target as Node);
      const isClickOutsideMobile = mobileLanguageDropdownRef.current && 
        !mobileLanguageDropdownRef.current.contains(event.target as Node);
      
      if (isClickOutsideDesktop && isClickOutsideMobile) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 40px;
          background: rgba(10, 26, 47, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(235, 226, 255, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          box-sizing: border-box;
          overflow: visible;
          z-index: 1000;
          height: 70px;
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
          align-items: center;
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
          cursor: pointer;
          position: relative;
          transition: opacity 0.3s;
        }

        .language:hover {
          opacity: 1;
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: -50px;
          min-width: 180px;
          background: rgba(10, 26, 47, 0.98);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(235, 226, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 8px 0;
          z-index: 9999;
          animation: fadeInDown 0.3s ease-out;
        }

        .language-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #EBE2FF;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .language-dropdown-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .language-dropdown-item.selected {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .mobile-language {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
        }

        .mobile-language-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 160px;
          background: rgba(10, 26, 47, 0.98);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(235, 226, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          padding: 8px 0;
          z-index: 9999;
          animation: fadeInDown 0.3s ease-out;
        }

        .mobile-language-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          color: #EBE2FF;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 500;
        }

        .mobile-language-dropdown-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .mobile-language-dropdown-item.selected {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .flag {
          width: 20px;
          height: 15px;
          background: linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%);
          border-radius: 2px;
          border: 1px solid rgba(235, 226, 255, 0.2);
          align-items: center;
          justify-content: center;
          display: flex;
          gap: 8px;
          left: 450px;
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
          background: rgba(59, 130, 246, 0.2);
          border-radius: 4px;
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
        }

        .mobile-nav {
          display: none;
          position: fixed;
          top: 10px;
          right: 16px;
          width: 200px;
          background: rgba(10, 26, 47, 1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(235, 226, 255, 0.3);
          border-radius: 8px;
          padding: 8px 0;
          z-index: 9999;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .mobile-nav.open {
          display: flex !important;
          animation: fadeInDown 0.3s ease-out;
          flex-direction: column;
          left: -3px;
          width: 100%;
          bottom: 60px;
        }

        .mobile-nav-item {
          display: block !important;
          padding: 16px 20px !important;
          color: #EBE2FF !important;
          text-decoration: none !important;
          border-bottom: 1px solid rgba(235, 226, 255, 0.1) !important;
          transition: all 0.3s !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          width: 100% !important;
          text-align: left !important;
          line-height: 1.4 !important;
        }

        .mobile-nav-item:hover {
          color: #3B82F6 !important;
          background: rgba(59, 130, 246, 0.1) !important;
        }
        .mobile-nav-item:last-child {
          border-bottom: none !important;
        }

        /* Force consistent styling for all mobile nav items */
        .mobile-nav div.mobile-nav-item,
        .mobile-nav a.mobile-nav-item {
          display: block !important;
          padding: 16px 20px !important;
          color: #EBE2FF !important;
          text-decoration: none !important;
          border-bottom: 1px solid rgba(235, 226, 255, 0.1) !important;
          transition: all 0.3s !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          width: 100% !important;
          background: transparent !important;
          text-align: left !important;
          line-height: 1.4 !important;
        }

        .mobile-nav div.mobile-nav-item:hover,
        .mobile-nav a.mobile-nav-item:hover {
          color: #3B82F6 !important;
          background: rgba(59, 130, 246, 0.1) !important;
        }

        /* New uniform styling class */
        .mobile-nav-uniform {
          display: block !important;
          padding: 18px 24px !important;
          margin: 0 !important;
          color: #EBE2FF !important;
          text-decoration: none !important;
          border-bottom: 1px solid rgba(235, 226, 255, 0.1) !important;
          transition: all 0.3s ease !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
          width: 100% !important;
          text-align: left !important;
          line-height: 1.5 !important;
          background: transparent !important;
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
        }

        .mobile-nav-uniform:hover {
          color: #3B82F6 !important;
          background: rgba(59, 130, 246, 0.1) !important;
        }

        .mobile-nav-uniform:last-child {
          border-bottom: none !important;
        }

        .mobile-header {
          display: none !important;
        }

        /* Desktop-only styles */
        @media (min-width: 769px) {
          .mobile-header {
            display: none !important;
          }
          
          .real-logo {
            display: flex !important;
          }
          
          .nav {
            display: flex !important;
          }
          
          .header-right {
            display: flex !important;
          }
        }

        .mobile-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-left .logo-text {
          color: #EBE2FF;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .mobile-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .header {
            padding: 12px 16px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            box-sizing: border-box;
            justify-content: flex-start;
            display: flex;
            background: rgba(10, 26, 47, 1);
            z-index: 1000;
            height: 60px;
          }

          .mobile-header {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .nav {
            display: none !important;
          }

          .real-logo {
            display: none !important;
          }

          .header-right {
            display: none !important;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-nav {
            bottom: 58px;
            right: 26px;
          }

          .logo-text {
            font-size: 16px;
          }

          /* Hide all desktop elements on mobile */
          .nav-item {
            display: none !important;
          }
          
          .language {
            display: none !important;
          }
          
          .cart {
            display: none !important;
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
            right: 28px;
            padding: 12px;
            bottom: 60px;
          }

          .logo-text {
            font-size: 14px;
          }
        }

        .real-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .real-logo img {
          height: 40px;
          width: auto;
          object-fit: contain;
        }
        
        /* Body padding for fixed header */
        body {
          padding-top: 70px;
        }
        
        @media (max-width: 768px) {
          body {
            padding-top: 60px;
          }
        }
      `}</style>

      <header className="header">
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="mobile-left">
            <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
            
          </div>
          <div className="mobile-right">
            <div 
              ref={mobileLanguageDropdownRef}
              className="mobile-language"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <div className="flag"></div>
              <span style={{color: '#EBE2FF', fontSize: '14px'}}>{selectedLanguage.code}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="#EBE2FF"
                style={{ 
                  transition: 'transform 0.3s',
                  transform: isLanguageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  marginLeft: '4px'
                }}
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
              {isLanguageDropdownOpen && (
                <div className="mobile-language-dropdown">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`mobile-language-dropdown-item ${selectedLanguage.code === language.code ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLanguageSelect(language);
                      }}
                    >
                      <span style={{ minWidth: '28px', fontSize: '11px' }}>{language.code}</span>
                      <span>{language.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#EBE2FF" style={{marginLeft: '10px'}}>
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <div 
              className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{marginLeft: '10px'}}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Desktop Elements */}
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
          <div 
            ref={desktopLanguageDropdownRef}
            className="language"
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          >
            <div className="flag"></div>
            <span>{selectedLanguage.code}</span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{ 
                transition: 'transform 0.3s',
                transform: isLanguageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                marginLeft: '4px'
              }}
            >
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            {isLanguageDropdownOpen && (
              <div className="language-dropdown">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className={`language-dropdown-item ${selectedLanguage.code === language.code ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(language);
                    }}
                  >
                    <span style={{ minWidth: '30px', fontSize: '12px' }}>{language.code}</span>
                    <span>{language.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/nfc-access">
            <button style={{
              padding: '10px 20px',
              background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(76, 175, 80, 0.3)';
            }}
            >
              🔐 Get NFC Card
            </button>
          </Link>
          <Link href="/cart">
            <div className="cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div 
            className="mobile-nav-item mobile-nav-uniform" 
            onClick={onScrollToFeatures}
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#EBE2FF',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'transparent'
            }}
          >
            Features
          </div>
          <div 
            className="mobile-nav-item mobile-nav-uniform"
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#EBE2FF',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'transparent'
            }}
          >
            Products
          </div>
          <Link 
            href="/about" 
            className="mobile-nav-item mobile-nav-uniform"
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#EBE2FF',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'transparent'
            }}
          >
            About Us
          </Link>
          <Link 
            href="/blog" 
            className="mobile-nav-item mobile-nav-uniform"
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#EBE2FF',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'transparent'
            }}
          >
            Blog
          </Link>
          <Link 
            href="/contact" 
            className="mobile-nav-item mobile-nav-uniform"
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#EBE2FF',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'transparent'
            }}
          >
            Contact
          </Link>
          <Link 
            href="/nfc-access"
            className="mobile-nav-item mobile-nav-uniform"
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#4CAF50',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.15), rgba(0, 59, 252, 0.15))'
            }}
          >
            🔐 Get NFC Card
          </Link>
          <Link 
            href="/academy" 
            className="mobile-nav-item mobile-nav-uniform"
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '0',
              color: '#EBE2FF',
              textDecoration: 'none',
              borderBottom: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              background: 'transparent'
            }}
          >
            Academy
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
