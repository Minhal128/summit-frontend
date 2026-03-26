'use client';

import React from 'react';
import { useLocale } from 'next-intl';

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
  const locale = useLocale();

  const copyByLocale = {
    en: {
      label: 'SECURITY ASSURANCE',
      title: 'Built for Your Peace of Mind',
      subtitle: 'Your assets deserve the highest level of security. Our cold wallet combines offline storage, military-grade encryption.',
      features: [
        { icon: '🔐', title: 'End-to-End Encryption', description: 'Every transaction and key is fully encrypted, ensuring only you have access.', visual: '🔒' },
        { icon: '🌐', title: 'Never Connected to the Internet', description: 'Offline by design—immune to online hacks, phishing, and malware attacks.', visual: 'internet' },
        { icon: '📂', title: 'Open-Source', description: 'Transparent and independently verified for trust, reliability, and accountability.' },
        { icon: '🏆', title: 'Unmatched protection', description: 'Unlike hot wallets, cold storage eliminates online exposure, giving you unmatched protection.' }
      ]
    },
    zh: {
      label: '安全保障', title: '为您的安心而打造', subtitle: '您的资产值得最高级别的安全。我们的冷钱包结合离线存储与军工级加密。',
      features: [
        { icon: '🔐', title: '端到端加密', description: '每一笔交易与密钥都被完整加密，确保仅您可访问。', visual: '🔒' },
        { icon: '🌐', title: '永不联网', description: '离线设计，天然免疫网络黑客、钓鱼和恶意软件攻击。', visual: 'internet' },
        { icon: '📂', title: '开源透明', description: '透明可审计，经过独立验证，值得信赖。' },
        { icon: '🏆', title: '无可比拟的防护', description: '不同于热钱包，冷存储可消除在线暴露风险。' }
      ]
    },
    ar: {
      label: 'ضمان الأمان', title: 'مصمم لطمأنينتك', subtitle: 'أصولك تستحق أعلى مستويات الأمان. تجمع محفظتنا بين التخزين دون اتصال وتشفير بمعايير عسكرية.',
      features: [
        { icon: '🔐', title: 'تشفير شامل من طرف إلى طرف', description: 'كل معاملة ومفتاح مشفر بالكامل لضمان وصولك أنت فقط.', visual: '🔒' },
        { icon: '🌐', title: 'غير متصل بالإنترنت أبدًا', description: 'مصمم للعمل دون اتصال ومحصّن ضد الاختراق والتصيد والبرمجيات الخبيثة.', visual: 'internet' },
        { icon: '📂', title: 'مفتوح المصدر', description: 'شفاف ومُراجع بشكل مستقل لضمان الثقة والاعتمادية.', },
        { icon: '🏆', title: 'حماية لا مثيل لها', description: 'بعكس المحافظ الساخنة، التخزين البارد يقلل التعرض للهجمات عبر الإنترنت.' }
      ]
    },
    ru: {
      label: 'ГАРАНТИЯ БЕЗОПАСНОСТИ', title: 'Создано для вашего спокойствия', subtitle: 'Ваши активы заслуживают максимальной защиты. Cold wallet сочетает офлайн-хранение и военное шифрование.',
      features: [
        { icon: '🔐', title: 'Сквозное шифрование', description: 'Каждая транзакция и ключ полностью зашифрованы.', visual: '🔒' },
        { icon: '🌐', title: 'Никогда не подключается к интернету', description: 'Офлайн по архитектуре — защита от хакеров, фишинга и вредоносного ПО.', visual: 'internet' },
        { icon: '📂', title: 'Открытый исходный код', description: 'Прозрачно и независимо проверено на надежность.' },
        { icon: '🏆', title: 'Максимальная защита', description: 'В отличие от горячих кошельков, cold storage исключает онлайн-экспозицию.' }
      ]
    },
    th: {
      label: 'ความมั่นใจด้านความปลอดภัย', title: 'สร้างมาเพื่อความสบายใจของคุณ', subtitle: 'สินทรัพย์ของคุณสมควรได้รับความปลอดภัยระดับสูงสุด ด้วยการเก็บแบบออฟไลน์และการเข้ารหัสระดับทหาร',
      features: [
        { icon: '🔐', title: 'การเข้ารหัสแบบ End-to-End', description: 'ทุกธุรกรรมและกุญแจถูกเข้ารหัสทั้งหมด มีเพียงคุณที่เข้าถึงได้', visual: '🔒' },
        { icon: '🌐', title: 'ไม่เชื่อมต่ออินเทอร์เน็ต', description: 'ออกแบบให้ออฟไลน์ ป้องกันแฮก ฟิชชิง และมัลแวร์', visual: 'internet' },
        { icon: '📂', title: 'โอเพนซอร์ส', description: 'โปร่งใสและผ่านการตรวจสอบอิสระ เพื่อความเชื่อมั่น', },
        { icon: '🏆', title: 'การปกป้องที่เหนือกว่า', description: 'Cold storage ลดความเสี่ยงออนไลน์ได้มากกว่ากระเป๋าแบบ hot wallet' }
      ]
    },
    es: {
      label: 'GARANTÍA DE SEGURIDAD', title: 'Diseñado para tu tranquilidad', subtitle: 'Tus activos merecen el máximo nivel de seguridad con almacenamiento offline y cifrado de grado militar.',
      features: [
        { icon: '🔐', title: 'Cifrado de extremo a extremo', description: 'Cada transacción y clave está completamente cifrada.', visual: '🔒' },
        { icon: '🌐', title: 'Nunca conectado a internet', description: 'Diseño offline inmune a hacks, phishing y malware.', visual: 'internet' },
        { icon: '📂', title: 'Código abierto', description: 'Transparente y verificado de forma independiente.' },
        { icon: '🏆', title: 'Protección incomparable', description: 'El cold storage elimina la exposición online de las hot wallets.' }
      ]
    },
    fr: {
      label: 'ASSURANCE SÉCURITÉ', title: 'Conçu pour votre tranquillité', subtitle: 'Vos actifs méritent le plus haut niveau de sécurité avec stockage hors ligne et chiffrement avancé.',
      features: [
        { icon: '🔐', title: 'Chiffrement de bout en bout', description: 'Chaque transaction et clé est entièrement chiffrée.', visual: '🔒' },
        { icon: '🌐', title: 'Jamais connecté à internet', description: 'Conception hors ligne, immunisée contre hacks, phishing et malwares.', visual: 'internet' },
        { icon: '📂', title: 'Open source', description: 'Transparent et vérifié indépendamment pour la fiabilité.' },
        { icon: '🏆', title: 'Protection inégalée', description: 'Le cold storage élimine l’exposition en ligne des hot wallets.' }
      ]
    },
    de: {
      label: 'SICHERHEITSGARANTIE', title: 'Für deine Sicherheit entwickelt', subtitle: 'Deine Assets verdienen höchste Sicherheit mit Offline-Speicher und starker Verschlüsselung.',
      features: [
        { icon: '🔐', title: 'Ende-zu-Ende-Verschlüsselung', description: 'Jede Transaktion und jeder Schlüssel ist vollständig verschlüsselt.', visual: '🔒' },
        { icon: '🌐', title: 'Niemals mit dem Internet verbunden', description: 'Offline-Design schützt vor Hacks, Phishing und Malware.', visual: 'internet' },
        { icon: '📂', title: 'Open Source', description: 'Transparent und unabhängig geprüft für maximale Vertrauenswürdigkeit.' },
        { icon: '🏆', title: 'Unübertroffener Schutz', description: 'Cold Storage eliminiert Online-Exposition im Gegensatz zu Hot Wallets.' }
      ]
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  const defaultFeatures = [
    {
      icon: t.features[0].icon,
      title: t.features[0].title,
      description: t.features[0].description,
      visual: t.features[0].visual
    },
    {
      icon: t.features[1].icon,
      title: t.features[1].title,
      description: t.features[1].description,
      visual: t.features[1].visual
    },
    {
      icon: t.features[2].icon,
      title: t.features[2].title,
      description: t.features[2].description
    },
    {
      icon: t.features[3].icon,
      title: t.features[3].title,
      description: t.features[3].description
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
          <div className="section-label">{t.label}</div>
          <h2 className="main-title">{t.title}</h2>
          <p className="subtitle">{t.subtitle}</p>
          
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
