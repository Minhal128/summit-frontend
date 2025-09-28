'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <>
      <style jsx>{`
        .footer {
          width: 100%;
          font-size: 14px;
          color: rgb(148, 163, 184);
          background-color: #0A1A2F;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .footer-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
        }

        .footer-brand {
          max-width: 384px;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
        }

        .brand-name {
          color: white;
          font-weight: 600;
          font-size: 20px;
        }

        .brand-description {
          margin-top: 16px;
          line-height: 1.6;
        }

        .footer-nav {
          display: flex;
          gap: 32px;
          font-weight: 500;
        }

        .footer-nav a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-nav a:hover {
          color: white;
        }

        .footer-bottom {
          margin-top: 32px;
          border-top: 1px solid rgb(30, 41, 59);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .copyright {
          color: rgb(100, 116, 139);
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-links a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: white;
        }

        .social-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .social-link {
          color: rgb(148, 163, 184);
          text-decoration: none;
          transition: color 0.3s;
        }

        .social-link:hover {
          color: white;
        }

        .social-icon {
          width: 24px;
          height: 24px;
        }

        .footer-watermark {
          text-align: center;
          margin-top: 24px;
          width: 100%;
        }

        .watermark-text {
          font-size: 80px;
          font-weight: 900;
          color: rgb(100, 116, 139);
          opacity: 0.08;
          letter-spacing: 0.1em;
          line-height: 1;
          white-space: nowrap;
          text-align: center;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 32px 16px;
          }

          .footer-main {
            flex-direction: column;
            gap: 20px;
          }

          .footer-nav {
            flex-direction: row;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            margin-top: 24px;
            padding-top: 16px;
            text-align: center;
          }

          .footer-links {
            gap: 16px;
          }

          .social-links {
            gap: 12px;
          }

          .watermark-text {
            font-size: 32px;
            margin-top: 16px;
          }

          .footer-watermark {
            margin-top: 16px;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            padding: 24px 12px;
          }

          .footer-nav {
            gap: 16px;
          }

          .footer-bottom {
            gap: 8px;
            margin-top: 16px;
            padding-top: 12px;
          }

          .watermark-text {
            font-size: 24px;
            letter-spacing: 0.05em;
          }

          .brand-name {
            font-size: 18px;
          }

          .brand-description {
            font-size: 13px;
            margin-top: 12px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="brand-header">
                <svg className="brand-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.2541 1.83331C17.923 1.83331 17.6534 2.10289 17.6534 2.43397V15.566L4.56601 8.43397C4.30393 8.29331 3.98768 8.34181 3.78443 8.54506L2.43397 9.89552C2.13843 10.1911 2.13843 10.6761 2.43397 10.9716L15.566 24.1037H2.43397C2.10289 24.1037 1.83331 24.3733 1.83331 24.7043V26.6261C1.83331 26.9571 2.10289 27.2267 2.43397 27.2267H17.6534V32.9654C17.6534 33.2964 17.923 33.566 18.2541 33.566H20.1758C20.5069 33.566 20.7765 33.2964 20.7765 32.9654V20.8955L33.8639 27.9654C34.126 28.106 34.4422 28.0575 34.6455 27.8543L36 26.5038C36.2955 26.2083 36.2955 25.7233 36 25.4278L22.8679 12.2957H36C36.331 12.2957 36.6006 12.0261 36.6006 11.695V9.77329C36.6006 9.44221 36.331 9.17263 36 9.17263H20.7765V3.43397C20.7765 3.10289 20.5069 2.83331 20.1758 2.83331H18.2541V1.83331Z" fill="#EBE2FF"/>
                </svg>
                <span className="brand-name">SUMMIT</span>
              </div>
              <p className="brand-description">
                Securely Protecting Your Digital Wealth, Today And Tomorrow.
              </p>
            </div>
            <nav className="footer-nav">
              <a href="#">BUSINESS</a>
              <a href="#">ABOUT</a>
              <a href="#">FEATURE</a>
              <Link href="/blog">BLOGS</Link>
            </nav>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">COPYRIGHT 2025, ALL RIGHT RESERVED</p>
            <div className="footer-links">
              <a href="#">PRIVACY</a>
              <a href="#">TERMS</a>
            </div>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.119.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001.017 0z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-watermark">
            <p className="watermark-text">
              SUMMIT EXCHANGE
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
