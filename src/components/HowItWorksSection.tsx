'use client';

import React from 'react';
import { useLocale } from 'next-intl';

interface Step {
  icon: string;
  number: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  steps?: Step[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ steps }) => {
  const locale = useLocale();

  const copyByLocale = {
    en: {
      label: 'HOW IT WORKS',
      title: 'How Our Summit Cold Wallet Works',
      subtitle: 'From setup to secure storage, every step is designed to make protecting and accessing your crypto effortless and worry-free.',
      steps: [
        { icon: '💼', number: '01', title: 'Set Up Your Wallet', description: 'Download, create your vault, and secure it with a recovery phrase—ready in minutes.' },
        { icon: '🔒', number: '02', title: 'Store Safely', description: 'Move your crypto into ultra-secure cold storage, protected from online threats.' },
        { icon: '💳', number: '03', title: 'Access and Manage Anytime', description: 'Easily check balances, track assets, and make transactions when needed.' }
      ]
    },
    zh: {
      label: '工作原理', title: 'Summit 冷钱包如何工作', subtitle: '从设置到安全存储，每一步都让保护和访问加密资产更轻松。',
      steps: [
        { icon: '💼', number: '01', title: '设置您的钱包', description: '下载应用、创建保险库并设置助记词，几分钟即可完成。' },
        { icon: '🔒', number: '02', title: '安全存储', description: '将加密资产转入超安全冷存储，远离在线威胁。' },
        { icon: '💳', number: '03', title: '随时访问与管理', description: '轻松查看余额、跟踪资产并在需要时完成交易。' }
      ]
    },
    ar: {
      label: 'آلية العمل', title: 'كيف تعمل محفظة Summit الباردة', subtitle: 'من الإعداد إلى التخزين الآمن، كل خطوة مصممة لحماية أصولك والوصول إليها بسهولة.',
      steps: [
        { icon: '💼', number: '01', title: 'إعداد المحفظة', description: 'حمّل التطبيق وأنشئ الخزنة وأمّنها بعبارة الاسترداد خلال دقائق.' },
        { icon: '🔒', number: '02', title: 'تخزين آمن', description: 'انقل عملاتك إلى تخزين بارد فائق الأمان ومحمي من تهديدات الإنترنت.' },
        { icon: '💳', number: '03', title: 'الوصول والإدارة في أي وقت', description: 'تحقق من الأرصدة وتابع الأصول ونفذ المعاملات بسهولة عند الحاجة.' }
      ]
    },
    ru: {
      label: 'КАК ЭТО РАБОТАЕТ', title: 'Как работает холодный кошелек Summit', subtitle: 'От настройки до безопасного хранения — каждый шаг делает защиту и доступ к крипте простыми.',
      steps: [
        { icon: '💼', number: '01', title: 'Настройте кошелек', description: 'Скачайте приложение, создайте хранилище и защитите его фразой восстановления.' },
        { icon: '🔒', number: '02', title: 'Храните безопасно', description: 'Переведите криптоактивы в холодное хранение, защищенное от онлайн-угроз.' },
        { icon: '💳', number: '03', title: 'Доступ и управление в любое время', description: 'Легко проверяйте баланс, отслеживайте активы и совершайте операции.' }
      ]
    },
    th: {
      label: 'วิธีการทำงาน', title: 'Cold Wallet ของ Summit ทำงานอย่างไร', subtitle: 'ตั้งแต่การตั้งค่าไปจนถึงการเก็บอย่างปลอดภัย ทุกขั้นตอนออกแบบมาให้ใช้งานง่ายและไร้กังวล',
      steps: [
        { icon: '💼', number: '01', title: 'ตั้งค่าวอลเล็ตของคุณ', description: 'ดาวน์โหลด สร้าง vault และป้องกันด้วย recovery phrase ได้ในไม่กี่นาที' },
        { icon: '🔒', number: '02', title: 'เก็บอย่างปลอดภัย', description: 'ย้ายคริปโตไปยัง cold storage ที่ปลอดภัยสูง ป้องกันภัยออนไลน์' },
        { icon: '💳', number: '03', title: 'เข้าถึงและจัดการได้ทุกเวลา', description: 'ตรวจสอบยอด ติดตามสินทรัพย์ และทำธุรกรรมได้ง่ายเมื่อจำเป็น' }
      ]
    },
    es: {
      label: 'CÓMO FUNCIONA', title: 'Cómo funciona la cold wallet de Summit', subtitle: 'Desde la configuración hasta el almacenamiento seguro, cada paso está diseñado para facilitar tu experiencia.',
      steps: [
        { icon: '💼', number: '01', title: 'Configura tu wallet', description: 'Descarga, crea tu bóveda y protégela con frase de recuperación en minutos.' },
        { icon: '🔒', number: '02', title: 'Almacena con seguridad', description: 'Mueve tu cripto a almacenamiento en frío protegido contra amenazas online.' },
        { icon: '💳', number: '03', title: 'Accede y gestiona en cualquier momento', description: 'Consulta balances, sigue tus activos y realiza transacciones cuando lo necesites.' }
      ]
    },
    fr: {
      label: 'COMMENT ÇA MARCHE', title: 'Comment fonctionne le cold wallet Summit', subtitle: 'De la configuration au stockage sécurisé, chaque étape est pensée pour une protection simple.',
      steps: [
        { icon: '💼', number: '01', title: 'Configurez votre wallet', description: 'Téléchargez, créez votre coffre et sécurisez-le avec une phrase de récupération.' },
        { icon: '🔒', number: '02', title: 'Stockez en sécurité', description: 'Déplacez vos cryptos vers un stockage à froid ultra-sécurisé.' },
        { icon: '💳', number: '03', title: 'Accédez et gérez à tout moment', description: 'Consultez vos soldes, suivez vos actifs et effectuez des transactions facilement.' }
      ]
    },
    de: {
      label: 'SO FUNKTIONIERT ES', title: 'So funktioniert die Summit Cold Wallet', subtitle: 'Von der Einrichtung bis zur sicheren Verwahrung ist jeder Schritt auf einfache Nutzung ausgelegt.',
      steps: [
        { icon: '💼', number: '01', title: 'Wallet einrichten', description: 'App herunterladen, Tresor erstellen und mit Recovery Phrase absichern.' },
        { icon: '🔒', number: '02', title: 'Sicher speichern', description: 'Übertrage deine Krypto in hochsicheres Cold Storage.' },
        { icon: '💳', number: '03', title: 'Jederzeit zugreifen & verwalten', description: 'Prüfe Guthaben, verfolge Assets und führe Transaktionen aus.' }
      ]
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  const defaultSteps = [
    {
      icon: t.steps[0].icon,
      number: t.steps[0].number,
      title: t.steps[0].title,
      description: t.steps[0].description
    },
    {
      icon: t.steps[1].icon,
      number: t.steps[1].number,
      title: t.steps[1].title,
      description: t.steps[1].description
    },
    {
      icon: t.steps[2].icon,
      number: t.steps[2].number,
      title: t.steps[2].title,
      description: t.steps[2].description
    }
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <>
      <style jsx>{`
        .how-it-works-section {
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

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 60px auto 0;
          position: relative;
        }

        .step-card {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 50px 40px;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: 20px;
          right: 30px;
          font-size: 72px;
          font-weight: 700;
          opacity: 0.1;
          color: #EBE2FF;
          line-height: 1;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: rgba(235, 226, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #EBE2FF;
          line-height: 1.3;
        }

        .step-description {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
          color: #EBE2FF;
        }

        @media (max-width: 768px) {
          .how-it-works-section {
            padding: 40px 0;
          }

          .container {
            padding: 0 4px;
            max-width: 100vw;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 8px;
            margin-top: 20px;
          }

          .main-title {
            font-size: 20px;
            margin-bottom: 8px;
          }

          .subtitle {
            font-size: 12px;
            margin-bottom: 20px;
            padding: 0 4px;
          }

          .section-label {
            font-size: 10px;
            margin-bottom: 8px;
          }

          .step-card {
            padding: 16px 12px;
            border-radius: 8px;
          }

          .step-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 12px;
            border-radius: 6px;
          }

          .step-title {
            font-size: 12px;
            margin-bottom: 8px;
          }

          .step-description {
            font-size: 10px;
            line-height: 1.3;
          }

          .step-number {
            font-size: 24px;
            top: 8px;
            right: 12px;
          }
        }

        @media (max-width: 480px) {
          .how-it-works-section {
            padding: 24px 0;
          }

          .container {
            padding: 0 2px;
          }

          .main-title {
            font-size: 18px;
            margin-bottom: 6px;
          }

          .subtitle {
            font-size: 10px;
            margin-bottom: 16px;
            padding: 0 2px;
          }

          .step-card {
            padding: 12px 8px;
          }

          .step-icon {
            width: 28px;
            height: 28px;
            margin-bottom: 8px;
          }

          .step-title {
            font-size: 11px;
            margin-bottom: 6px;
          }

          .step-description {
            font-size: 9px;
          }

          .step-number {
            font-size: 20px;
            top: 6px;
            right: 8px;
          }
        }
      `}</style>

      <section className="how-it-works-section">
        <div className="container">
          <div className="section-label">{t.label}</div>
          <h2 className="main-title">{t.title}</h2>
          <p className="subtitle">{t.subtitle}</p>
          
          <div className="steps-grid">
            {displaySteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">
                  {step.number}
                </div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                    {index === 0 && (
                      <path d="M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM20 19H4V8H20V19ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
                    )}
                    {index === 1 && (
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 9C18 13.52 15.84 17.65 12 18.74C8.16 17.65 6 13.52 6 9L12 6L18 9Z"/>
                    )}
                    {index === 2 && (
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L4.83 5.17L7.5 2.5L6 1L0 7V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM19 19H5V9H19V19Z"/>
                    )}
                  </svg>
                </div>
                <h3 className="step-title">
                  {step.title}
                </h3>
                <p className="step-description">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
