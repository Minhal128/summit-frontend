'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface HeroSectionProps {
  onSecureWallet?: () => void;
  onDownloadApp?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSecureWallet, onDownloadApp }) => {
  const router = useRouter();
  const locale = useLocale();

  const copyByLocale = {
    en: {
      tagline: 'A modern digital fortress protecting crypto assets',
      titleLine1: 'Protect, Manage, and Invest',
      titleLine2: 'Your Crypto with',
      confidence: 'Confidence',
      subtitle: 'Keep your digital assets offline, safe, and always under your control—secure storage with the freedom to invest anytime.',
      secureWallet: 'Secure my wallet',
      downloadApp: 'Download app'
    },
    zh: {
      tagline: '守护加密资产的现代数字堡垒',
      titleLine1: '保护、管理并投资',
      titleLine2: '您的加密资产，尽享',
      confidence: '信心',
      subtitle: '让您的数字资产离线、安全并始终由您掌控——安全存储，随时自由投资。',
      secureWallet: '保护我的钱包',
      downloadApp: '下载应用'
    },
    ar: {
      tagline: 'حصن رقمي حديث يحمي الأصول المشفرة',
      titleLine1: 'احمِ، أدر، واستثمر',
      titleLine2: 'أصولك المشفرة بكل',
      confidence: 'ثقة',
      subtitle: 'حافظ على أصولك الرقمية غير متصلة بالإنترنت، آمنة وتحت سيطرتك دائمًا — تخزين آمن مع حرية الاستثمار في أي وقت.',
      secureWallet: 'أمّن محفظتي',
      downloadApp: 'حمّل التطبيق'
    },
    ru: {
      tagline: 'Современная цифровая крепость для защиты криптоактивов',
      titleLine1: 'Защищайте, управляйте и инвестируйте',
      titleLine2: 'в криптоактивы с',
      confidence: 'уверенностью',
      subtitle: 'Храните цифровые активы офлайн, безопасно и полностью под своим контролем.',
      secureWallet: 'Защитить мой кошелек',
      downloadApp: 'Скачать приложение'
    },
    th: {
      tagline: 'ป้อมปราการดิจิทัลสมัยใหม่เพื่อปกป้องสินทรัพย์คริปโต',
      titleLine1: 'ปกป้อง จัดการ และลงทุน',
      titleLine2: 'คริปโตของคุณด้วย',
      confidence: 'ความมั่นใจ',
      subtitle: 'เก็บสินทรัพย์ดิจิทัลของคุณแบบออฟไลน์ ปลอดภัย และอยู่ในการควบคุมของคุณเสมอ',
      secureWallet: 'ปกป้องวอลเล็ตของฉัน',
      downloadApp: 'ดาวน์โหลดแอป'
    },
    es: {
      tagline: 'Una fortaleza digital moderna que protege tus criptoactivos',
      titleLine1: 'Protege, gestiona e invierte',
      titleLine2: 'tu cripto con',
      confidence: 'confianza',
      subtitle: 'Mantén tus activos digitales offline, seguros y siempre bajo tu control.',
      secureWallet: 'Asegurar mi wallet',
      downloadApp: 'Descargar app'
    },
    fr: {
      tagline: 'Une forteresse numérique moderne pour protéger vos actifs crypto',
      titleLine1: 'Protégez, gérez et investissez',
      titleLine2: 'dans votre crypto avec',
      confidence: 'confiance',
      subtitle: 'Gardez vos actifs numériques hors ligne, en sécurité et toujours sous votre contrôle.',
      secureWallet: 'Sécuriser mon wallet',
      downloadApp: 'Télécharger l’app'
    },
    de: {
      tagline: 'Eine moderne digitale Festung zum Schutz deiner Krypto-Assets',
      titleLine1: 'Schützen, verwalten und investieren',
      titleLine2: 'Sie Ihre Krypto mit',
      confidence: 'Vertrauen',
      subtitle: 'Halte deine digitalen Assets offline, sicher und jederzeit unter deiner Kontrolle.',
      secureWallet: 'Mein Wallet sichern',
      downloadApp: 'App herunterladen'
    }
  } as const;

  const copy = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  const handleSecureWallet = () => {
    if (onSecureWallet) {
      onSecureWallet();
    } else {
      router.push(locale === 'en' ? '/signup' : `/${locale}/signup`);
    }
  };

  return (
    <>
      <style jsx>{`
        .main {
          text-align: center;
          padding: 80px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .main::before {
          content: '';
          position: absolute;
          top: 0px;
          left: -150px;
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse 600px 300px at 0% 50%, rgba(231, 231, 231, 0.25) 0%, rgba(200, 200, 200, 0.15) 30%, rgba(128, 128, 128, 0.08) 50%, rgba(128, 128, 128, 0.03) 70%, transparent 90%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }

        .tagline {
          font-size: 16.8px;
          font-weight: 500;
          color: #EBE2FF;
          margin: 0 auto 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          display: block;
          width: 100%;
          max-width: 600px;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.1;
          margin: 0 auto 24px;
          color: #EBE2FF;
          text-align: center;
          width: 100%;
          max-width: 800px;
          display: block;
          position: relative;
          z-index: 1;
        }

        .confidence {
          color: #1E5FFF;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(235, 226, 255, 0.7);
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .btn-primary {
          background: #0088FF;
          color: #EBE2FF;
          padding: 16px 32px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #0077e6;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(235, 226, 255, 0.1);
          color: #EBE2FF;
          padding: 16px 32px;
          border: 1px solid rgba(235, 226, 255, 0.2);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: rgba(235, 226, 255, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .main {
            padding: 30px 16px 25px;
            max-width: 100vw;
          }

          .main::before {
            left: -50px;
            width: 300px;
            height: 150px;
          }

          .tagline {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-title {
            font-size: 28px;
            line-height: 1.2;
            margin-bottom: 12px;
            padding: 0 8px;
          }

          .hero-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
            padding: 0 8px;
            line-height: 1.4;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 0 8px;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 250px;
            padding: 12px 20px;
            font-size: 14px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .main {
            padding: 20px 12px 16px;
          }

          .tagline {
            font-size: 11px;
          }

          .hero-title {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .hero-subtitle {
            font-size: 13px;
            margin-bottom: 16px;
            padding: 0 6px;
          }

          .btn-primary, .btn-secondary {
            padding: 10px 16px;
            font-size: 13px;
            max-width: 220px;
          }
        }
      `}</style>

      <main className="main">
        <div className="tagline">{copy.tagline}</div>
        
        <h1 className="hero-title">
          {copy.titleLine1}<br />
          {copy.titleLine2} <span className="confidence">{copy.confidence}</span>
        </h1>
        
        <p className="hero-subtitle">
          {copy.subtitle}
        </p>
        
        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleSecureWallet}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
            {copy.secureWallet}
          </button>
          <button className="btn-secondary" onClick={onDownloadApp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            {copy.downloadApp}
          </button>
        </div>
      </main>
    </>
  );
};

export default HeroSection;
