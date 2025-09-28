'use client';

import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const defaultFaqs = [
    {
      question: 'What is a cold wallet and why should I use it?',
      answer: 'A cold wallet is a secure offline storage solution for your digital assets. Unlike hot wallets that are connected to the internet and vulnerable to hacks, a cold wallet keeps your funds completely offline, giving you maximum protection against cyber threats.'
    },
    {
      question: 'How do I set up my cold wallet?',
      answer: 'Setting up your cold wallet is simple and takes just a few minutes. Download the app, create your secure vault, and follow the guided setup process.'
    },
    {
      question: 'Can I recover my funds if I lose my device?',
      answer: 'Yes, with your recovery phrase you can restore access to your funds on any device. Keep your recovery phrase safe and secure.'
    },
    {
      question: 'What types of assets are supported?',
      answer: 'Our cold wallet supports a wide range of cryptocurrencies and digital assets. Check our supported assets list for the most current information.'
    },
    {
      question: 'How is a cold wallet different from an exchange wallet?',
      answer: 'Unlike exchange wallets, cold wallets give you complete control over your private keys and keep your assets offline for maximum security.'
    }
  ];

  const displayFaqs = faqs || defaultFaqs;

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <style jsx>{`
        .faq-section {
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

        .faq-list {
          max-width: 800px;
          margin: 60px auto 0;
        }

        .faq-item {
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
        }

        .faq-question {
          padding: 25px 30px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(235, 226, 255, 0.02);
          transition: background 0.3s;
        }

        .faq-question:hover {
          background: rgba(235, 226, 255, 0.05);
        }

        .faq-answer {
          padding: 0 30px 25px;
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
        }

        .faq-toggle {
          font-size: 20px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 12px;
          }

          .main-title {
            font-size: 32px;
          }

          .subtitle {
            font-size: 16px;
          }

          .faq-question {
            padding: 20px 20px;
            font-size: 15px;
          }

          .faq-answer {
            padding: 0 20px 20px;
            font-size: 13px;
          }

          .faq-toggle {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 8px;
          }

          .main-title {
            font-size: 28px;
          }

          .subtitle {
            font-size: 14px;
          }

          .faq-question {
            padding: 16px 16px;
            font-size: 14px;
          }

          .faq-answer {
            padding: 0 16px 16px;
            font-size: 12px;
          }
        }
      `}</style>

      <section className="faq-section">
        <div className="container">
          <div className="section-label">FAQ</div>
          <h2 className="main-title">Got Questions? We&apos;ve Got Answers.</h2>
          <p className="subtitle">Everything you need to know about keeping your assets safe, simple, and secure with our cold wallet</p>
          
          <div className="faq-list">
            {displayFaqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
