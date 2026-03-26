'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const locale = useLocale();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqCopyByLocale = {
    en: {
      label: 'FAQ',
      title: "Got Questions? We've Got Answers.",
      subtitle: 'Everything you need to know about keeping your assets safe, simple, and secure with our cold wallet',
      items: [
        { question: 'What is a cold wallet and why should I use it?', answer: 'A cold wallet is a secure offline storage solution for your digital assets. Unlike hot wallets that are connected to the internet and vulnerable to hacks, a cold wallet keeps your funds completely offline, giving you maximum protection against cyber threats.' },
        { question: 'How do I set up my cold wallet?', answer: 'Setting up your cold wallet is simple and takes just a few minutes. Download the app, create your secure vault, and follow the guided setup process.' },
        { question: 'Can I recover my funds if I lose my device?', answer: 'Yes, with your recovery phrase you can restore access to your funds on any device. Keep your recovery phrase safe and secure.' },
        { question: 'What types of assets are supported?', answer: 'Our cold wallet supports a wide range of cryptocurrencies and digital assets. Check our supported assets list for the most current information.' },
        { question: 'How is a cold wallet different from an exchange wallet?', answer: 'Unlike exchange wallets, cold wallets give you complete control over your private keys and keep your assets offline for maximum security.' }
      ]
    },
    de: {
      label: 'FAQ', title: 'Fragen? Wir haben Antworten.', subtitle: 'Alles, was du wissen musst, um deine Assets mit unserer Cold Wallet sicher und einfach zu schützen.',
      items: [
        { question: 'Was ist eine Cold Wallet und warum sollte ich sie nutzen?', answer: 'Eine Cold Wallet speichert digitale Assets sicher offline. Im Gegensatz zu Hot Wallets ist sie nicht dauerhaft online und damit besser vor Angriffen geschützt.' },
        { question: 'Wie richte ich meine Cold Wallet ein?', answer: 'Die Einrichtung dauert nur wenige Minuten: App herunterladen, Tresor erstellen und dem geführten Setup folgen.' },
        { question: 'Kann ich meine Gelder wiederherstellen, wenn ich mein Gerät verliere?', answer: 'Ja. Mit deiner Recovery Phrase kannst du den Zugriff auf jedem Gerät wiederherstellen. Bewahre sie sicher auf.' },
        { question: 'Welche Assets werden unterstützt?', answer: 'Unsere Cold Wallet unterstützt viele Kryptowährungen und digitale Assets. Die aktuelle Liste findest du in den unterstützten Assets.' },
        { question: 'Wie unterscheidet sich eine Cold Wallet von einer Exchange Wallet?', answer: 'Bei einer Cold Wallet kontrollierst du deine Private Keys selbst und hältst Assets offline für maximale Sicherheit.' }
      ]
    },
    zh: {
      label: '常见问题', title: '有疑问？我们来解答。', subtitle: '了解如何通过我们的冷钱包安全、简单地保护你的资产。',
      items: [
        { question: '什么是冷钱包，为什么要使用它？', answer: '冷钱包是离线存储数字资产的安全方案。与联网的热钱包相比，冷钱包更能抵御网络攻击。' },
        { question: '如何设置冷钱包？', answer: '设置非常简单，只需几分钟：下载应用、创建安全金库并按引导完成流程。' },
        { question: '如果设备丢失，资产还能找回吗？', answer: '可以。使用助记词可在任意设备恢复访问，请妥善保管助记词。' },
        { question: '支持哪些资产？', answer: '我们支持多种加密货币与数字资产，请查看支持列表获取最新信息。' },
        { question: '冷钱包与交易所钱包有什么不同？', answer: '冷钱包让你完全掌控私钥，并将资产离线保存以获得更高安全性。' }
      ]
    },
    ar: {
      label: 'الأسئلة الشائعة', title: 'لديك أسئلة؟ لدينا الإجابات.', subtitle: 'كل ما تحتاج معرفته لحماية أصولك بأمان وبساطة باستخدام محفظتنا الباردة.',
      items: [
        { question: 'ما هي المحفظة الباردة ولماذا أستخدمها؟', answer: 'المحفظة الباردة حل آمن لتخزين الأصول الرقمية دون اتصال. بخلاف المحافظ الساخنة المتصلة بالإنترنت، توفر حماية أعلى من الاختراقات.' },
        { question: 'كيف أُعدّ المحفظة الباردة؟', answer: 'الإعداد بسيط ويستغرق دقائق: نزّل التطبيق، أنشئ خزنتك، واتبع خطوات الإعداد الموجّهة.' },
        { question: 'هل يمكنني استعادة أموالي إذا فقدت جهازي؟', answer: 'نعم، باستخدام عبارة الاسترداد يمكنك استعادة الوصول من أي جهاز. احتفظ بها في مكان آمن.' },
        { question: 'ما أنواع الأصول المدعومة؟', answer: 'محفظتنا تدعم مجموعة واسعة من العملات المشفرة والأصول الرقمية. راجع قائمة الأصول المدعومة لأحدث المعلومات.' },
        { question: 'ما الفرق بين المحفظة الباردة ومحفظة المنصّة؟', answer: 'المحفظة الباردة تمنحك تحكمًا كاملًا بالمفاتيح الخاصة وتحافظ على الأصول دون اتصال لأقصى أمان.' }
      ]
    },
    ru: {
      label: 'FAQ', title: 'Есть вопросы? У нас есть ответы.', subtitle: 'Всё, что нужно знать о безопасной и простой защите активов с нашей cold wallet.',
      items: [
        { question: 'Что такое cold wallet и зачем она нужна?', answer: 'Cold wallet — это безопасное офлайн-хранилище цифровых активов. В отличие от hot wallet, она лучше защищена от взломов.' },
        { question: 'Как настроить cold wallet?', answer: 'Очень просто: скачайте приложение, создайте хранилище и следуйте пошаговой инструкции.' },
        { question: 'Можно ли восстановить доступ при потере устройства?', answer: 'Да, с помощью seed-фразы вы восстановите доступ на любом устройстве. Храните фразу в безопасности.' },
        { question: 'Какие активы поддерживаются?', answer: 'Поддерживается широкий список криптовалют и цифровых активов. Актуальный список — в разделе поддерживаемых активов.' },
        { question: 'Чем cold wallet отличается от биржевого кошелька?', answer: 'Cold wallet даёт полный контроль над приватными ключами и хранит активы офлайн для максимальной безопасности.' }
      ]
    },
    th: {
      label: 'คำถามที่พบบ่อย', title: 'มีคำถามใช่ไหม? เรามีคำตอบ', subtitle: 'ทุกสิ่งที่คุณต้องรู้เพื่อปกป้องสินทรัพย์ของคุณอย่างปลอดภัยและใช้งานง่ายด้วยกระเป๋าแบบ Cold Wallet',
      items: [
        { question: 'Cold Wallet คืออะไร และทำไมควรใช้?', answer: 'Cold Wallet คือการเก็บสินทรัพย์ดิจิทัลแบบออฟไลน์ที่ปลอดภัยกว่า ลดความเสี่ยงจากการโจมตีออนไลน์.' },
        { question: 'ตั้งค่า Cold Wallet อย่างไร?', answer: 'ตั้งค่าได้ง่ายในไม่กี่นาที: ดาวน์โหลดแอป สร้าง vault และทำตามขั้นตอนที่แนะนำ.' },
        { question: 'หากทำอุปกรณ์หาย สามารถกู้คืนเงินได้ไหม?', answer: 'ได้ ด้วย recovery phrase คุณสามารถกู้คืนการเข้าถึงได้จากทุกอุปกรณ์ โปรดเก็บรักษาอย่างปลอดภัย.' },
        { question: 'รองรับสินทรัพย์ประเภทใดบ้าง?', answer: 'รองรับคริปโตและสินทรัพย์ดิจิทัลหลากหลายรายการ ตรวจสอบรายการล่าสุดได้ในหน้าสินทรัพย์ที่รองรับ.' },
        { question: 'Cold Wallet ต่างจากกระเป๋าใน Exchange อย่างไร?', answer: 'Cold Wallet ให้คุณควบคุม private key เอง และเก็บสินทรัพย์แบบออฟไลน์เพื่อความปลอดภัยสูงสุด.' }
      ]
    },
    es: {
      label: 'FAQ', title: '¿Tienes preguntas? Tenemos respuestas.', subtitle: 'Todo lo que necesitas saber para mantener tus activos seguros y simples con nuestra cold wallet.',
      items: [
        { question: '¿Qué es una cold wallet y por qué debería usarla?', answer: 'Una cold wallet almacena activos digitales fuera de línea con mayor seguridad frente a hackeos.' },
        { question: '¿Cómo configuro mi cold wallet?', answer: 'Es simple y rápido: descarga la app, crea tu bóveda y sigue la guía de configuración.' },
        { question: '¿Puedo recuperar mis fondos si pierdo mi dispositivo?', answer: 'Sí. Con tu frase de recuperación puedes restaurar acceso en cualquier dispositivo. Guárdala en un lugar seguro.' },
        { question: '¿Qué tipos de activos están soportados?', answer: 'Soportamos una amplia gama de criptomonedas y activos digitales. Consulta la lista actualizada de activos compatibles.' },
        { question: '¿En qué se diferencia de una wallet de exchange?', answer: 'Con una cold wallet controlas tus claves privadas y mantienes tus activos fuera de línea para máxima seguridad.' }
      ]
    },
    fr: {
      label: 'FAQ', title: 'Des questions ? Nous avons les réponses.', subtitle: 'Tout ce qu’il faut savoir pour garder vos actifs en sécurité avec notre cold wallet.',
      items: [
        { question: 'Qu’est-ce qu’un cold wallet et pourquoi l’utiliser ?', answer: 'Un cold wallet stocke vos actifs hors ligne pour une sécurité maximale face aux attaques en ligne.' },
        { question: 'Comment configurer mon cold wallet ?', answer: 'C’est simple: téléchargez l’application, créez votre coffre, puis suivez l’assistant de configuration.' },
        { question: 'Puis-je récupérer mes fonds si je perds mon appareil ?', answer: 'Oui, grâce à votre phrase de récupération, vous pouvez restaurer l’accès sur n’importe quel appareil.' },
        { question: 'Quels actifs sont pris en charge ?', answer: 'Nous prenons en charge de nombreux actifs numériques. Consultez la liste des actifs pris en charge.' },
        { question: 'Quelle différence avec un wallet d’exchange ?', answer: 'Le cold wallet vous donne le contrôle total de vos clés privées et garde vos actifs hors ligne.' }
      ]
    }
  } as const;

  const sectionCopy = faqCopyByLocale[locale as keyof typeof faqCopyByLocale] ?? faqCopyByLocale.en;
  const displayFaqs = faqs || sectionCopy.items;

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
          <div className="section-label">{sectionCopy.label}</div>
          <h2 className="main-title">{sectionCopy.title}</h2>
          <p className="subtitle">{sectionCopy.subtitle}</p>
          
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
