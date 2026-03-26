'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DashboardMockup from '@/components/DashboardMockup';
import StatsTicker from '@/components/StatsTicker';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import SecuritySection from '@/components/SecuritySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ComparisonSection from '@/components/ComparisonSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  
  const handleSecureWallet = () => {
    const signupPath = locale === 'en' ? '/signup' : `/${locale}/signup`;
    router.push(signupPath);
  };

  const handleDownloadApp = () => {
    console.log('Download app clicked');
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statsByLocale = {
    en: ['Trusted by thousands of crypto investors worldwide', '99.9% uptime and zero hack record', 'Backed by military-grade encryption and offline security', '99.9% uptime guaranteed', 'Over 50,000 wallets secured globally', 'Zero security breaches since launch', 'Military-grade AES-256 encryption', 'Cold storage technology leader', 'Trusted by Fortune 500 companies', 'ISO 27001 certified security', 'Multi-signature protection enabled', '24/7 customer support available'],
    de: ['Von tausenden Krypto-Investoren weltweit vertraut', '99,9% Verfügbarkeit und keine Hacks', 'Militärische Verschlüsselung und Offline-Sicherheit', '99,9% Uptime garantiert', 'Über 50.000 gesicherte Wallets weltweit', 'Keine Sicherheitsvorfälle seit dem Start', 'AES-256 Verschlüsselung auf Militärniveau', 'Führend in Cold-Storage-Technologie', 'Vertrauen von Fortune-500-Unternehmen', 'ISO 27001-zertifizierte Sicherheit', 'Multi-Signatur-Schutz aktiviert', '24/7 Kundensupport verfügbar'],
    zh: ['受到全球数千名加密投资者信赖', '99.9% 可用性，零被黑记录', '采用军工级加密与离线安全', '99.9% 在线率保障', '全球已保护超过 50,000 个钱包', '上线以来零安全漏洞', '军工级 AES-256 加密', '冷存储技术领先', '受财富 500 强企业信任', '通过 ISO 27001 安全认证', '启用多重签名保护', '24/7 客户支持'],
    ar: ['موثوق به من قبل آلاف مستثمري العملات الرقمية حول العالم', 'جاهزية 99.9% وسجل خالٍ من الاختراقات', 'مدعوم بتشفير بمعايير عسكرية وأمان دون اتصال', 'ضمان جاهزية بنسبة 99.9%', 'أكثر من 50,000 محفظة مؤمّنة عالميًا', 'صفر خروقات أمنية منذ الإطلاق', 'تشفير AES-256 بمعايير عسكرية', 'رائد في تقنيات التخزين البارد', 'موثوق به من شركات Fortune 500', 'معتمد أمنيًا وفق ISO 27001', 'حماية متعددة التواقيع مفعلة', 'دعم العملاء متاح 24/7'],
    ru: ['Нам доверяют тысячи крипто-инвесторов по всему миру', '99,9% аптайм и ноль взломов', 'Военное шифрование и офлайн-защита', 'Гарантированный аптайм 99,9%', 'Более 50 000 защищённых кошельков', 'Ноль инцидентов с момента запуска', 'Шифрование AES-256 военного уровня', 'Лидер в технологиях cold storage', 'Доверяют компании из Fortune 500', 'Сертифицировано по ISO 27001', 'Включена мультиподпись', 'Поддержка 24/7'],
    th: ['ได้รับความไว้วางใจจากนักลงทุนคริปโตทั่วโลกหลายพันราย', 'Uptime 99.9% และไม่เคยถูกแฮก', 'เข้ารหัสระดับทหารพร้อมความปลอดภัยแบบออฟไลน์', 'รับประกัน Uptime 99.9%', 'ปกป้องวอลเล็ตมากกว่า 50,000 ใบทั่วโลก', 'ไม่มีเหตุการณ์ความปลอดภัยตั้งแต่เปิดตัว', 'การเข้ารหัส AES-256 ระดับทหาร', 'ผู้นำเทคโนโลยี Cold Storage', 'ได้รับความไว้วางใจจากบริษัท Fortune 500', 'ความปลอดภัยได้รับการรับรอง ISO 27001', 'เปิดใช้การป้องกันแบบ Multi-signature', 'บริการลูกค้า 24/7'],
    es: ['Con la confianza de miles de inversores cripto en todo el mundo', '99.9% de uptime y cero hackeos', 'Respaldado por cifrado de grado militar y seguridad offline', 'Uptime garantizado del 99.9%', 'Más de 50,000 wallets protegidas globalmente', 'Cero brechas de seguridad desde el lanzamiento', 'Cifrado AES-256 de grado militar', 'Líder en tecnología de almacenamiento en frío', 'Confiado por empresas Fortune 500', 'Seguridad certificada ISO 27001', 'Protección multi-firma habilitada', 'Soporte al cliente 24/7'],
    fr: ['Approuvé par des milliers d’investisseurs crypto dans le monde', '99,9% de disponibilité et zéro hack', 'Chiffrement de niveau militaire et sécurité hors ligne', 'Disponibilité garantie à 99,9%', 'Plus de 50 000 wallets sécurisés dans le monde', 'Aucune faille depuis le lancement', 'Chiffrement AES-256 de niveau militaire', 'Leader de la technologie cold storage', 'Approuvé par des entreprises Fortune 500', 'Sécurité certifiée ISO 27001', 'Protection multi-signature activée', 'Support client 24/7']
  } as const;

  const stats = statsByLocale[locale as keyof typeof statsByLocale] ?? statsByLocale.en;

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          max-width: 100%;
        }
        
        html {
          overflow-x: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        body {
          overflow-x: hidden !important;
          width: 100vw;
          margin: 0;
          padding: 0;
          position: relative;
        }
        
        @media (max-width: 768px) {
          * {
            max-width: 100vw !important;
          }
          
          html, body {
            overflow-x: hidden !important;
            position: relative;
          }
          
          body {
            width: 100vw !important;
            max-width: 100vw !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
      
      <div style={{ 
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0A1A2F',
        color: '#EBE2FF',
        lineHeight: '1.6',
        margin: 0,
        padding: 0,
        paddingTop: '60px',
        overflowX: 'hidden',
        width: '100%',
        minHeight: '100vh'
      }}>
        {/* Use Components */}
      <Header onScrollToFeatures={scrollToFeatures} />
      <HeroSection onSecureWallet={handleSecureWallet} onDownloadApp={handleDownloadApp} />
      <DashboardMockup />
      <StatsTicker stats={stats} />
      <FeaturesSection onSecureWallet={handleSecureWallet} />
      <HowItWorksSection />
      <SecuritySection />
      <TestimonialsSection />
      <FAQSection />
      <ComparisonSection />
      <CTASection onDownloadApp={handleDownloadApp} />
      <Footer />
    </div>
    </>
  );
}

// All sections now use modular components for better maintainability
