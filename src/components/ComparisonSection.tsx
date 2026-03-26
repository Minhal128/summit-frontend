'use client';

import React from 'react';
import { useLocale } from 'next-intl';

interface ComparisonSectionProps {
  hotWalletFeatures?: string[];
  summitWalletFeatures?: string[];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ 
  hotWalletFeatures, 
  summitWalletFeatures 
}) => {
  const locale = useLocale();

  const copyByLocale = {
    en: {
      label: 'COMPARISON',
      title: 'What Sets Summit Apart',
      subtitle: 'Understand the key differences between hot and cold wallets to make the smartest choice for protecting your digital assets',
      hotTitle: 'Other Hot wallet',
      summitTitle: 'Summit Wallet',
      hotFeatures: ['Instant access anytime, anywhere.', 'Best for daily transactions.', 'Always connected to the internet.', 'Easier setup and use.', 'Convenient for small balances.', 'Quick transfers on the go.'],
      summitFeatures: ['Maximum protection from hacks.', 'Ideal for long-term storage.', 'Fully offline security.', 'You control your private keys.', 'Safer for large investments.', 'Trusted by professionals.']
    },
    de: { label: 'VERGLEICH', title: 'Was Summit besonders macht', subtitle: 'Verstehe die wichtigsten Unterschiede zwischen Hot- und Cold-Wallets für die sicherste Entscheidung.', hotTitle: 'Andere Hot Wallets', summitTitle: 'Summit Wallet', hotFeatures: ['Sofortiger Zugriff jederzeit.', 'Ideal für tägliche Transaktionen.', 'Ständig mit dem Internet verbunden.', 'Einfach einzurichten.', 'Praktisch für kleine Beträge.', 'Schnelle Überweisungen unterwegs.'], summitFeatures: ['Maximaler Schutz vor Hacks.', 'Ideal für langfristige Aufbewahrung.', 'Komplett offline geschützt.', 'Du kontrollierst deine Private Keys.', 'Sicherer für große Investments.', 'Von Profis genutzt.'] },
    zh: { label: '对比', title: 'Summit 的不同之处', subtitle: '了解热钱包与冷钱包的关键差异，为你的数字资产做出更明智的保护选择。', hotTitle: '其他热钱包', summitTitle: 'Summit 钱包', hotFeatures: ['随时随地快速访问。', '适合日常交易。', '始终连接互联网。', '设置更简单。', '适合小额资金。', '转账速度快。'], summitFeatures: ['更强的防黑客保护。', '适合长期存储。', '完全离线安全。', '私钥由你掌控。', '更适合大额资产。', '专业用户信赖。'] },
    ar: { label: 'مقارنة', title: 'ما الذي يميز Summit', subtitle: 'تعرّف على الفروق بين المحافظ الساخنة والباردة لاختيار الأذكى لحماية أصولك الرقمية.', hotTitle: 'محافظ ساخنة أخرى', summitTitle: 'محفظة Summit', hotFeatures: ['وصول فوري في أي وقت.', 'مناسبة للمعاملات اليومية.', 'متصلة دائمًا بالإنترنت.', 'إعداد واستخدام أسهل.', 'مريحة للأرصدة الصغيرة.', 'تحويلات سريعة أثناء التنقل.'], summitFeatures: ['حماية قصوى من الاختراقات.', 'مثالية للتخزين طويل الأمد.', 'أمان كامل دون اتصال.', 'أنت تتحكم بمفاتيحك الخاصة.', 'أكثر أمانًا للاستثمارات الكبيرة.', 'موثوقة لدى المحترفين.'] },
    ru: { label: 'СРАВНЕНИЕ', title: 'Что отличает Summit', subtitle: 'Поймите разницу между hot и cold wallet, чтобы лучше защитить цифровые активы.', hotTitle: 'Другие hot wallet', summitTitle: 'Summit Wallet', hotFeatures: ['Мгновенный доступ в любое время.', 'Подходит для ежедневных операций.', 'Постоянно в интернете.', 'Проще настроить и использовать.', 'Удобно для небольших сумм.', 'Быстрые переводы.'], summitFeatures: ['Максимальная защита от взломов.', 'Идеально для долгого хранения.', 'Полная офлайн-безопасность.', 'Вы контролируете приватные ключи.', 'Безопаснее для крупных инвестиций.', 'Выбор профессионалов.'] },
    th: { label: 'เปรียบเทียบ', title: 'สิ่งที่ทำให้ Summit แตกต่าง', subtitle: 'เข้าใจความต่างระหว่าง Hot Wallet และ Cold Wallet เพื่อปกป้องสินทรัพย์ของคุณอย่างชาญฉลาด', hotTitle: 'Hot Wallet อื่นๆ', summitTitle: 'Summit Wallet', hotFeatures: ['เข้าถึงได้ทันทีทุกที่ทุกเวลา', 'เหมาะกับธุรกรรมรายวัน', 'เชื่อมต่ออินเทอร์เน็ตตลอดเวลา', 'ตั้งค่าและใช้งานง่าย', 'สะดวกสำหรับยอดเงินขนาดเล็ก', 'โอนเงินได้รวดเร็ว'], summitFeatures: ['ป้องกันการแฮกสูงสุด', 'เหมาะสำหรับการถือระยะยาว', 'ความปลอดภัยแบบออฟไลน์เต็มรูปแบบ', 'คุณควบคุม private key เอง', 'ปลอดภัยกว่าสำหรับเงินลงทุนสูง', 'มืออาชีพไว้วางใจ'] },
    es: { label: 'COMPARACIÓN', title: 'Qué hace diferente a Summit', subtitle: 'Conoce las diferencias clave entre hot y cold wallets para proteger mejor tus activos digitales.', hotTitle: 'Otras hot wallets', summitTitle: 'Summit Wallet', hotFeatures: ['Acceso instantáneo en cualquier momento.', 'Ideal para transacciones diarias.', 'Siempre conectadas a internet.', 'Configuración sencilla.', 'Convenientes para saldos pequeños.', 'Transferencias rápidas.'], summitFeatures: ['Máxima protección contra hackeos.', 'Ideal para almacenamiento a largo plazo.', 'Seguridad totalmente offline.', 'Tú controlas tus claves privadas.', 'Más segura para grandes inversiones.', 'Confiada por profesionales.'] },
    fr: { label: 'COMPARAISON', title: 'Ce qui distingue Summit', subtitle: 'Comprenez les différences entre hot et cold wallets pour protéger vos actifs numériques intelligemment.', hotTitle: 'Autres hot wallets', summitTitle: 'Summit Wallet', hotFeatures: ['Accès instantané à tout moment.', 'Idéal pour les transactions quotidiennes.', 'Toujours connectées à internet.', 'Configuration plus simple.', 'Pratique pour petits montants.', 'Transferts rapides.'], summitFeatures: ['Protection maximale contre les hacks.', 'Idéal pour le stockage long terme.', 'Sécurité 100% hors ligne.', 'Vous contrôlez vos clés privées.', 'Plus sûr pour les gros investissements.', 'Adopté par les professionnels.'] }
  } as const;

  const copy = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;
  const displayHotWalletFeatures = hotWalletFeatures || copy.hotFeatures;
  const displaySummitWalletFeatures = summitWalletFeatures || copy.summitFeatures;

  return (
    <>
      <style jsx>{`
        .comparison-section {
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

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 30px;
          margin-top: 60px;
          align-items: center;
        }

        .comparison-item {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
        }

        .comparison-item.highlight {
          background: rgba(30, 95, 255, 0.1);
          border: 2px solid #1E5FFF;
        }

        .comparison-title {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
        }

        .comparison-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .comparison-features li {
          font-size: 14px;
          padding: 12px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .comparison-features li::before {
          content: "●";
          color: #1E5FFF;
          font-size: 16px;
        }

        .vs-text {
          font-size: 16px;
          font-weight: 600;
          color: rgba(235, 226, 255, 0.5);
          text-align: center;
        }

        @media (max-width: 768px) {
          .comparison-section {
            padding: 40px 0;
          }

          .container {
            padding: 0 16px;
          }

          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 32px;
          }

          .main-title {
            font-size: 32px;
            margin-bottom: 12px;
          }

          .subtitle {
            font-size: 16px;
            margin-bottom: 32px;
          }

          .section-label {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .comparison-item {
            padding: 20px 16px;
          }

          .comparison-title {
            font-size: 18px;
            margin-bottom: 16px;
          }

          .comparison-features li {
            font-size: 13px;
            padding: 8px 0;
          }

          .vs-text {
            font-size: 14px;
            margin: 12px 0;
          }
        }

        @media (max-width: 480px) {
          .comparison-section {
            padding: 24px 0;
          }

          .container {
            padding: 0 12px;
          }

          .comparison-grid {
            gap: 12px;
            margin-top: 24px;
          }

          .main-title {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .subtitle {
            font-size: 14px;
            margin-bottom: 24px;
          }

          .comparison-item {
            padding: 16px 12px;
          }

          .comparison-title {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .comparison-features li {
            font-size: 12px;
            padding: 6px 0;
          }

          .vs-text {
            font-size: 12px;
            margin: 8px 0;
          }
        }
      `}</style>

      <section className="comparison-section">
        <div className="container">
          <div className="section-label">{copy.label}</div>
          <h2 className="main-title">{copy.title}</h2>
          <p className="subtitle">{copy.subtitle}</p>
          
          <div className="comparison-grid">
            <div className="comparison-item">
              <h3 className="comparison-title">{copy.hotTitle}</h3>
              <ul className="comparison-features">
                {displayHotWalletFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="vs-text">V/S</div>
            
            <div className="comparison-item highlight">
              <h3 className="comparison-title">{copy.summitTitle}</h3>
              <ul className="comparison-features">
                {displaySummitWalletFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ComparisonSection;
