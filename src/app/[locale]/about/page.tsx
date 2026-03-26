'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
// import StatsTicker from '@/components/StatsTicker';
import Header from '@/components/Header';
import StatsTicker from '@/components/StatsTicker';
export default function AboutPage() {
  const locale = useLocale();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const copyByLocale = {
    en: {
      aboutLabel: 'ABOUT US',
      heroTitleLine1: 'Your Trusted Partner in',
      heroTitleLine2: 'Secure Digital Finance',
      heroSubtitle:
        "We're dedicated to providing the most secure and user-friendly cold storage solution for your digital assets. Our mission is to make crypto security accessible to everyone.",
      getStarted: 'Get Started',
      backHome: 'Back to Home',
      visionLabel: 'Our Vision',
      visionTitle: 'Driven by Purpose, Built on Trust',
      visionSubtitle: 'We combine innovation, security, and customer-first values to redefine how you interact with your digital assets.',
      values: [
        { title: 'Innovation at Core', description: 'We leverage cutting-edge technology to deliver simple yet powerful solutions.' },
        { title: 'Security First', description: 'Protecting your assets is our top priority, with industry-grade safeguards.' },
        { title: 'Customer-Centered', description: 'Every feature is designed to make your journey seamless and stress-free.' }
      ],
      faqLabel: 'FAQ',
      faqTitle: "Got Questions? We've Got Answers.",
      faqSubtitle: 'Everything you need to know about keeping your assets safe, simple, and secure with our cold wallet',
      faqs: [
        {
          question: 'What is a cold wallet and why should I use it?',
          answer:
            'A cold wallet is a secure offline storage solution for your digital assets. Unlike hot wallets connected to the internet, a cold wallet keeps your funds offline for maximum protection.'
        },
        { question: 'How do I set up my cold wallet?', answer: 'Download the app, create your secure vault, and follow the setup flow. It only takes a few minutes.' },
        { question: 'Can I recover my funds if I lose my device?', answer: 'Yes. Your recovery phrase lets you restore access on any compatible device. Keep it safe and private.' },
        { question: 'What types of assets are supported?', answer: 'Our cold wallet supports a wide range of cryptocurrencies and digital assets.' },
        { question: 'How is a cold wallet different from an exchange wallet?', answer: 'Cold wallets keep assets offline and give you direct control of private keys, unlike exchange wallets.' }
      ],
      downloadLabel: 'DOWNLOAD APP',
      downloadTitle: 'Take Control of Your Crypto Security Today',
      downloadSubtitle: 'Start protecting your assets with the safest and simplest cold wallet solution — secure, private, and built for peace of mind.',
      downloadCta: 'Download App',
      footerTagline: 'Securely Protecting Your Digital Wealth, Today And Tomorrow.',
      footerBusiness: 'BUSINESS',
      footerAbout: 'ABOUT',
      footerFeature: 'FEATURE',
      footerBlogs: 'BLOGS',
      copyright: 'COPYRIGHT 2025, ALL RIGHT RESERVED'
    },
    zh: {
      aboutLabel: '关于我们', heroTitleLine1: '您值得信赖的伙伴', heroTitleLine2: '安全数字金融', heroSubtitle: '我们致力于提供最安全、最易用的冷存储方案，让每个人都能轻松实现加密安全。', getStarted: '立即开始', backHome: '返回首页',
      visionLabel: '我们的愿景', visionTitle: '以使命驱动，以信任为基石', visionSubtitle: '我们融合创新、安全与以用户为先的价值观，重塑您与数字资产的互动方式。',
      values: [
        { title: '创新为核', description: '我们采用前沿技术，打造简洁而强大的解决方案。' },
        { title: '安全优先', description: '以行业级防护能力守护您的资产安全。' },
        { title: '用户至上', description: '每个功能都旨在让您的体验更顺畅、无压力。' }
      ],
      faqLabel: '常见问题', faqTitle: '有疑问？我们为您解答。', faqSubtitle: '关于如何通过冷钱包安全、简单地管理资产，您需要了解的一切。',
      faqs: [
        { question: '什么是冷钱包，为什么要使用它？', answer: '冷钱包是一种离线存储方案，可最大化降低网络攻击风险。' },
        { question: '如何设置冷钱包？', answer: '下载应用，创建保险库，按引导完成设置，仅需几分钟。' },
        { question: '设备丢失后还能找回资金吗？', answer: '可以。通过助记词可在兼容设备上恢复访问。' },
        { question: '支持哪些资产？', answer: '支持多种主流加密货币和数字资产。' },
        { question: '冷钱包与交易所钱包有何不同？', answer: '冷钱包离线保存资产并由您掌握私钥，安全性更高。' }
      ],
      downloadLabel: '下载应用', downloadTitle: '立即掌控您的加密资产安全', downloadSubtitle: '采用安全、私密、易用的冷钱包方案，安心守护您的资产。', downloadCta: '下载应用',
      footerTagline: '今天与未来，持续守护您的数字财富。', footerBusiness: '业务', footerAbout: '关于', footerFeature: '功能', footerBlogs: '博客', copyright: '版权所有 2025，保留所有权利'
    },
    ar: {
      aboutLabel: 'من نحن', heroTitleLine1: 'شريكك الموثوق في', heroTitleLine2: 'التمويل الرقمي الآمن', heroSubtitle: 'نحن ملتزمون بتقديم أكثر حلول التخزين البارد أمانًا وسهولة لحماية أصولك الرقمية.', getStarted: 'ابدأ الآن', backHome: 'العودة للرئيسية',
      visionLabel: 'رؤيتنا', visionTitle: 'مدفوعون بالهدف ومبنيون على الثقة', visionSubtitle: 'نجمع بين الابتكار والأمان ونهج العميل أولاً لإعادة تعريف تجربة الأصول الرقمية.',
      values: [
        { title: 'الابتكار في الجوهر', description: 'نوظف أحدث التقنيات لتقديم حلول بسيطة وقوية.' },
        { title: 'الأمان أولاً', description: 'حماية أصولك هي أولويتنا القصوى بمعايير احترافية.' },
        { title: 'العميل في المركز', description: 'كل ميزة صُممت لتجعل رحلتك سلسة وخالية من التعقيد.' }
      ],
      faqLabel: 'الأسئلة الشائعة', faqTitle: 'لديك أسئلة؟ لدينا الإجابات.', faqSubtitle: 'كل ما تحتاج معرفته للحفاظ على أصولك آمنة وبسيطة عبر محفظتنا الباردة.',
      faqs: [
        { question: 'ما هي المحفظة الباردة ولماذا أستخدمها؟', answer: 'المحفظة الباردة حل تخزين غير متصل بالإنترنت يوفر أعلى درجات الحماية.' },
        { question: 'كيف أُعد محفظتي الباردة؟', answer: 'حمّل التطبيق، أنشئ خزنتك، واتبع خطوات الإعداد الإرشادية.' },
        { question: 'هل يمكنني استعادة أموالي إذا فقدت جهازي؟', answer: 'نعم، يمكنك الاستعادة باستخدام عبارة الاسترداد على جهاز متوافق.' },
        { question: 'ما أنواع الأصول المدعومة؟', answer: 'ندعم مجموعة واسعة من العملات الرقمية والأصول الرقمية.' },
        { question: 'ما الفرق بين المحفظة الباردة ومحفظة المنصة؟', answer: 'المحفظة الباردة تحفظ الأصول دون اتصال وتمنحك تحكمًا كاملاً بالمفاتيح.' }
      ],
      downloadLabel: 'تحميل التطبيق', downloadTitle: 'تحكم اليوم في أمان أصولك الرقمية', downloadSubtitle: 'ابدأ بحماية أصولك عبر حل تخزين بارد آمن وخاص وسهل الاستخدام.', downloadCta: 'تحميل التطبيق',
      footerTagline: 'نحمي ثروتك الرقمية بأمان اليوم وغدًا.', footerBusiness: 'الأعمال', footerAbout: 'حول', footerFeature: 'المزايا', footerBlogs: 'المدونة', copyright: 'حقوق النشر 2025، جميع الحقوق محفوظة'
    },
    ru: {
      aboutLabel: 'О НАС', heroTitleLine1: 'Ваш надежный партнер в', heroTitleLine2: 'безопасных цифровых финансах', heroSubtitle: 'Мы создаем максимально безопасное и удобное решение холодного хранения для ваших активов.', getStarted: 'Начать', backHome: 'На главную',
      visionLabel: 'Наша миссия', visionTitle: 'Цель, доверие и технология', visionSubtitle: 'Мы объединяем инновации, безопасность и клиентоориентированность.',
      values: [
        { title: 'Инновации в основе', description: 'Используем передовые технологии для простых и мощных решений.' },
        { title: 'Безопасность прежде всего', description: 'Защита активов — наш главный приоритет.' },
        { title: 'Ориентация на клиента', description: 'Каждая функция создана для удобного и спокойного опыта.' }
      ],
      faqLabel: 'FAQ', faqTitle: 'Есть вопросы? У нас есть ответы.', faqSubtitle: 'Всё о том, как хранить активы безопасно и просто с холодным кошельком.',
      faqs: [
        { question: 'Что такое холодный кошелек и зачем он нужен?', answer: 'Это офлайн-хранилище для активов с максимальной защитой от сетевых угроз.' },
        { question: 'Как настроить холодный кошелек?', answer: 'Скачайте приложение, создайте хранилище и пройдите пошаговую настройку.' },
        { question: 'Можно ли восстановить доступ при потере устройства?', answer: 'Да, восстановление доступно через seed-фразу.' },
        { question: 'Какие активы поддерживаются?', answer: 'Поддерживается широкий список криптовалют и цифровых активов.' },
        { question: 'Чем отличается от биржевого кошелька?', answer: 'Холодный кошелек хранит активы офлайн и дает полный контроль над ключами.' }
      ],
      downloadLabel: 'СКАЧАТЬ ПРИЛОЖЕНИЕ', downloadTitle: 'Возьмите безопасность криптоактивов под контроль', downloadSubtitle: 'Начните защищать активы с самым безопасным и простым cold wallet решением.', downloadCta: 'Скачать приложение',
      footerTagline: 'Надежная защита вашего цифрового капитала сегодня и завтра.', footerBusiness: 'БИЗНЕС', footerAbout: 'О НАС', footerFeature: 'ФУНКЦИИ', footerBlogs: 'БЛОГ', copyright: '© 2025, ВСЕ ПРАВА ЗАЩИЩЕНЫ'
    },
    th: {
      aboutLabel: 'เกี่ยวกับเรา', heroTitleLine1: 'พาร์ตเนอร์ที่คุณไว้วางใจใน', heroTitleLine2: 'การเงินดิจิทัลที่ปลอดภัย', heroSubtitle: 'เรามุ่งมั่นมอบโซลูชัน cold storage ที่ปลอดภัยและใช้งานง่ายที่สุดสำหรับสินทรัพย์ดิจิทัลของคุณ', getStarted: 'เริ่มต้น', backHome: 'กลับหน้าแรก',
      visionLabel: 'วิสัยทัศน์ของเรา', visionTitle: 'ขับเคลื่อนด้วยเป้าหมาย สร้างบนความไว้วางใจ', visionSubtitle: 'เราผสานนวัตกรรม ความปลอดภัย และแนวคิดลูกค้ามาก่อน เพื่อยกระดับประสบการณ์สินทรัพย์ดิจิทัล',
      values: [
        { title: 'นวัตกรรมเป็นหัวใจ', description: 'เราใช้เทคโนโลยีล้ำสมัยเพื่อโซลูชันที่เรียบง่ายแต่ทรงพลัง' },
        { title: 'ความปลอดภัยมาก่อน', description: 'การปกป้องสินทรัพย์ของคุณคือสิ่งสำคัญที่สุดของเรา' },
        { title: 'ยึดลูกค้าเป็นศูนย์กลาง', description: 'ทุกฟีเจอร์ถูกออกแบบให้ใช้งานได้ลื่นไหลและไร้ความกังวล' }
      ],
      faqLabel: 'คำถามที่พบบ่อย', faqTitle: 'มีคำถาม? เรามีคำตอบ', faqSubtitle: 'ทุกสิ่งที่คุณต้องรู้ในการดูแลสินทรัพย์ให้ปลอดภัยด้วย cold wallet',
      faqs: [
        { question: 'Cold wallet คืออะไร และทำไมต้องใช้?', answer: 'Cold wallet คือการเก็บสินทรัพย์แบบออฟไลน์ ช่วยลดความเสี่ยงจากการโจมตีออนไลน์' },
        { question: 'ตั้งค่า cold wallet อย่างไร?', answer: 'ดาวน์โหลดแอป สร้าง vault และทำตามขั้นตอนแนะนำ ใช้เวลาไม่นาน' },
        { question: 'หากทำอุปกรณ์หายจะกู้คืนได้ไหม?', answer: 'ได้ คุณสามารถกู้คืนด้วย recovery phrase บนอุปกรณ์ที่รองรับ' },
        { question: 'รองรับสินทรัพย์ประเภทใดบ้าง?', answer: 'รองรับคริปโตและสินทรัพย์ดิจิทัลหลายประเภท' },
        { question: 'ต่างจากกระเป๋าใน Exchange อย่างไร?', answer: 'Cold wallet เก็บแบบออฟไลน์และให้คุณควบคุม private key เอง' }
      ],
      downloadLabel: 'ดาวน์โหลดแอป', downloadTitle: 'ควบคุมความปลอดภัยคริปโตของคุณตั้งแต่วันนี้', downloadSubtitle: 'เริ่มปกป้องสินทรัพย์ของคุณด้วยโซลูชัน cold wallet ที่ปลอดภัย เรียบง่าย และเป็นส่วนตัว', downloadCta: 'ดาวน์โหลดแอป',
      footerTagline: 'ปกป้องความมั่งคั่งดิจิทัลของคุณอย่างมั่นคง วันนี้และวันหน้า', footerBusiness: 'ธุรกิจ', footerAbout: 'เกี่ยวกับ', footerFeature: 'ฟีเจอร์', footerBlogs: 'บล็อก', copyright: 'ลิขสิทธิ์ 2025 สงวนลิขสิทธิ์'
    },
    es: {
      aboutLabel: 'SOBRE NOSOTROS', heroTitleLine1: 'Tu socio de confianza en', heroTitleLine2: 'finanzas digitales seguras', heroSubtitle: 'Ofrecemos la solución de almacenamiento en frío más segura y fácil de usar para tus activos.', getStarted: 'Comenzar', backHome: 'Volver al inicio',
      visionLabel: 'Nuestra visión', visionTitle: 'Impulsados por propósito, construidos con confianza', visionSubtitle: 'Combinamos innovación, seguridad y enfoque en el cliente para redefinir tu experiencia digital.',
      values: [
        { title: 'Innovación en el núcleo', description: 'Aprovechamos tecnología de vanguardia para soluciones simples y potentes.' },
        { title: 'Seguridad primero', description: 'Proteger tus activos es nuestra máxima prioridad.' },
        { title: 'Enfoque en el cliente', description: 'Cada función está diseñada para una experiencia fluida y sin estrés.' }
      ],
      faqLabel: 'FAQ', faqTitle: '¿Preguntas? Tenemos respuestas.', faqSubtitle: 'Todo lo que necesitas saber para mantener tus activos seguros con nuestra cold wallet.',
      faqs: [
        { question: '¿Qué es una cold wallet y por qué usarla?', answer: 'Una cold wallet almacena activos offline y reduce riesgos de ataques en línea.' },
        { question: '¿Cómo configuro mi cold wallet?', answer: 'Descarga la app, crea tu bóveda y sigue la guía de configuración.' },
        { question: '¿Puedo recuperar fondos si pierdo el dispositivo?', answer: 'Sí, con tu frase de recuperación puedes restaurar el acceso.' },
        { question: '¿Qué activos son compatibles?', answer: 'Soportamos una amplia variedad de criptomonedas y activos digitales.' },
        { question: '¿En qué se diferencia de una wallet de exchange?', answer: 'La cold wallet mantiene tus activos offline y bajo tu control.' }
      ],
      downloadLabel: 'DESCARGAR APP', downloadTitle: 'Toma el control de tu seguridad cripto hoy', downloadSubtitle: 'Protege tus activos con una solución de cold wallet segura, privada y simple.', downloadCta: 'Descargar app',
      footerTagline: 'Protegiendo tu riqueza digital, hoy y mañana.', footerBusiness: 'NEGOCIOS', footerAbout: 'NOSOTROS', footerFeature: 'FUNCIONES', footerBlogs: 'BLOGS', copyright: 'COPYRIGHT 2025, TODOS LOS DERECHOS RESERVADOS'
    },
    fr: {
      aboutLabel: 'À PROPOS', heroTitleLine1: 'Votre partenaire de confiance en', heroTitleLine2: 'finance numérique sécurisée', heroSubtitle: 'Nous proposons une solution de stockage à froid sûre et simple pour vos actifs numériques.', getStarted: 'Commencer', backHome: 'Retour à l’accueil',
      visionLabel: 'Notre vision', visionTitle: 'Portés par une mission, fondés sur la confiance', visionSubtitle: 'Nous combinons innovation, sécurité et approche client pour transformer votre expérience.',
      values: [
        { title: 'Innovation au cœur', description: 'Nous exploitons des technologies de pointe pour des solutions simples et puissantes.' },
        { title: 'La sécurité avant tout', description: 'La protection de vos actifs est notre priorité absolue.' },
        { title: 'Centré client', description: 'Chaque fonctionnalité est conçue pour une expérience fluide.' }
      ],
      faqLabel: 'FAQ', faqTitle: 'Des questions ? Nous avons les réponses.', faqSubtitle: 'Tout ce qu’il faut savoir pour sécuriser vos actifs avec notre cold wallet.',
      faqs: [
        { question: 'Qu’est-ce qu’un cold wallet et pourquoi l’utiliser ?', answer: 'Un cold wallet stocke vos actifs hors ligne pour une sécurité maximale.' },
        { question: 'Comment configurer mon cold wallet ?', answer: 'Téléchargez l’app, créez votre coffre, puis suivez la configuration guidée.' },
        { question: 'Puis-je récupérer mes fonds si je perds mon appareil ?', answer: 'Oui, grâce à votre phrase de récupération.' },
        { question: 'Quels actifs sont pris en charge ?', answer: 'Nous prenons en charge un large éventail d’actifs numériques.' },
        { question: 'Différence avec un wallet d’exchange ?', answer: 'Le cold wallet conserve vos actifs hors ligne et vous donne le contrôle des clés.' }
      ],
      downloadLabel: 'TÉLÉCHARGER L’APP', downloadTitle: 'Prenez le contrôle de votre sécurité crypto dès aujourd’hui', downloadSubtitle: 'Protégez vos actifs avec une solution cold wallet sûre, privée et simple.', downloadCta: 'Télécharger l’app',
      footerTagline: 'Protéger votre richesse numérique, aujourd’hui et demain.', footerBusiness: 'BUSINESS', footerAbout: 'À PROPOS', footerFeature: 'FONCTIONNALITÉS', footerBlogs: 'BLOGS', copyright: 'COPYRIGHT 2025, TOUS DROITS RÉSERVÉS'
    },
    de: {
      aboutLabel: 'ÜBER UNS', heroTitleLine1: 'Dein vertrauenswürdiger Partner für', heroTitleLine2: 'sichere digitale Finanzen', heroSubtitle: 'Wir bieten die sicherste und benutzerfreundlichste Cold-Storage-Lösung für deine digitalen Assets.', getStarted: 'Loslegen', backHome: 'Zurück zur Startseite',
      visionLabel: 'Unsere Vision', visionTitle: 'Von Zweck getrieben, auf Vertrauen gebaut', visionSubtitle: 'Wir verbinden Innovation, Sicherheit und Kundenfokus für ein besseres Asset-Erlebnis.',
      values: [
        { title: 'Innovation im Kern', description: 'Wir nutzen modernste Technologie für einfache, starke Lösungen.' },
        { title: 'Sicherheit zuerst', description: 'Der Schutz deiner Assets hat höchste Priorität.' },
        { title: 'Kundenzentriert', description: 'Jede Funktion ist für eine nahtlose, stressfreie Nutzung entwickelt.' }
      ],
      faqLabel: 'FAQ', faqTitle: 'Fragen? Wir haben Antworten.', faqSubtitle: 'Alles, was du über sichere Asset-Verwahrung mit unserer Cold Wallet wissen musst.',
      faqs: [
        { question: 'Was ist eine Cold Wallet und warum nutzen?', answer: 'Eine Cold Wallet speichert Assets offline und schützt vor Online-Angriffen.' },
        { question: 'Wie richte ich meine Cold Wallet ein?', answer: 'App herunterladen, Tresor erstellen und den Einrichtungsschritten folgen.' },
        { question: 'Kann ich Funds bei Geräteverlust wiederherstellen?', answer: 'Ja, mit deiner Recovery Phrase kannst du den Zugriff wiederherstellen.' },
        { question: 'Welche Assets werden unterstützt?', answer: 'Unterstützt werden zahlreiche Kryptowährungen und digitale Assets.' },
        { question: 'Unterschied zur Exchange Wallet?', answer: 'Cold Wallets halten Assets offline und geben dir volle Schlüsselhoheit.' }
      ],
      downloadLabel: 'APP HERUNTERLADEN', downloadTitle: 'Übernimm heute die Kontrolle über deine Krypto-Sicherheit', downloadSubtitle: 'Schütze deine Assets mit einer sicheren, privaten und einfachen Cold-Wallet-Lösung.', downloadCta: 'App herunterladen',
      footerTagline: 'Sicherer Schutz deines digitalen Vermögens, heute und morgen.', footerBusiness: 'BUSINESS', footerAbout: 'ÜBER UNS', footerFeature: 'FEATURES', footerBlogs: 'BLOG', copyright: 'COPYRIGHT 2025, ALLE RECHTE VORBEHALTEN'
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  const handleSecureWallet = () => {
    // placeholder action
  };

  const faqs = t.faqs;

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#0A1A2F',
      color: '#EBE2FF',
      lineHeight: '1.6',
      margin: 0,
      padding: 0,
      paddingTop: '70px'
    }}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
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
          gap: 40px;
          margin-top: 60px;
        }

        .step-item {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 40px;
          background: #1E5FFF;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .step-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }

        .step-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          clear: both;
        }

        .step-desc {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.5;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 60px auto 0;
          position: relative;
        }

        .value-card {
          background: rgba(235, 226, 255, 0.05);
          border: 1px solid rgba(235, 226, 255, 0.1);
          border-radius: 16px;
          padding: 50px 40px;
          position: relative;
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

        /* Main section styles */
        .main {
          padding: 80px 40px 80px;
          text-align: center;
          position: relative;
          min-height: calc(100vh - 70px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .main-title {
            font-size: 32px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 15px;
            margin-top: 40px;
          }

          .value-card {
            padding: 30px 20px;
          }
          
          .step-item {
            padding: 30px 20px;
          }
          
          .container {
            padding: 0 15px;
          }
          
          .main {
            padding: 80px 20px 40px;
          }
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
          font-family: 'Manrope', sans-serif;
          font-size: 16.8px;
          font-weight: 500;
          color: #1E5FFF;
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
          color: #EBE2FF;
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

        .footer-stats {
          padding: 40px 0;
          border-top: 1px solid rgba(235, 226, 255, 0.1);
          margin-top: 40px;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .stats-ticker {
          display: inline-flex;
          animation: scroll-left 120s linear infinite;
          gap: 80px;
        }

        .stat-item {
          font-size: 14px;
          color: rgba(235, 226, 255, 0.7);
          white-space: nowrap;
          flex-shrink: 0;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
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

        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 15px;
            margin-top: 40px;
          }

          .value-card {
            padding: 30px 20px;
          }

          .main-title {
            font-size: 36px;
          }

          .header {
            padding: 15px 20px;
          }

          .nav {
            display: none;
          }

          .hero-title {
            font-size: 36px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <main className="main">
        <div className="section-label" style={{ color: 'white' }}>{t.aboutLabel}</div>

        <h1 className="hero-title">
          {t.heroTitleLine1}<br />
          <span className="confidence">{t.heroTitleLine2}</span>
        </h1>

        <p className="hero-subtitle">
          {t.heroSubtitle}
        </p>

        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleSecureWallet}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
            {t.getStarted}
          </button>
          <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            {t.backHome}
          </Link>
        </div>
      </main>

        <StatsTicker/>

      {/* How It Works Section */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label">{t.visionLabel}</div>
          <h2 className="main-title">{t.visionTitle}</h2>
          <p className="subtitle">{t.visionSubtitle}</p>

          <div className="values-grid">
            {/* Step 1 */}
            <div className="value-card">
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '72px',
                fontWeight: '700',
                opacity: '0.1',
                color: '#EBE2FF',
                lineHeight: '1'
              }}>
                01
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#EBE2FF',
                lineHeight: '1.3'
              }}>
                {t.values[0].title}
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: '0.7',
                lineHeight: '1.5',
                color: '#EBE2FF'
              }}>
                {t.values[0].description}
              </p>
            </div>

            {/* Step 2 */}
            <div className="value-card">
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '72px',
                fontWeight: '700',
                opacity: '0.1',
                color: '#EBE2FF',
                lineHeight: '1'
              }}>
                02
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 9C18 13.52 15.84 17.65 12 18.74C8.16 17.65 6 13.52 6 9L12 6L18 9Z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#EBE2FF',
                lineHeight: '1.3'
              }}>
                {t.values[1].title}
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: '0.7',
                lineHeight: '1.5',
                color: '#EBE2FF'
              }}>
                {t.values[1].description}
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'rgba(235, 226, 255, 0.05)',
              border: '1px solid rgba(235, 226, 255, 0.1)',
              borderRadius: '16px',
              padding: '50px 40px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '72px',
                fontWeight: '700',
                opacity: '0.1',
                color: '#EBE2FF',
                lineHeight: '1'
              }}>
                03
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(235, 226, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EBE2FF' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#EBE2FF',
                lineHeight: '1.3'
              }}>
                {t.values[2].title}
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: '0.7',
                lineHeight: '1.5',
                color: '#EBE2FF'
              }}>
                {t.values[2].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label">{t.faqLabel}</div>
          <h2 className="main-title">{t.faqTitle}</h2>
          <p className="subtitle">{t.faqSubtitle}</p>

          <div className="faq-list">
            {faqs.map((faq, index) => (
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

      {/* Download App Section */}
      <section style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0A1A2F',
        fontFamily: 'Inter, sans-serif',
        color: 'rgb(203, 213, 225)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>

        {/* Main Content Area */}
        <main style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px'
        }}>
          <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(15, 23, 42, 0.2)',
              backdropFilter: 'blur(40px) saturate(180%)',
              padding: '48px 80px',
              textAlign: 'center',
              boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '100%, 2rem 2rem, 2rem 2rem'
            }}>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  color: 'rgb(148, 163, 184)',
                  textTransform: 'uppercase'
                }}>
                  {t.downloadLabel}
                </h3>
                <h2 style={{
                  marginTop: '16px',
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'white',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.1'
                }}>
                  {t.downloadTitle}
                </h2>
                <p style={{
                  marginTop: '24px',
                  maxWidth: '512px',
                  margin: '24px auto 0',
                  fontSize: '18px',
                  lineHeight: '1.75',
                  color: 'rgb(148, 163, 184)'
                }}>
                  {t.downloadSubtitle}
                </p>
                <div style={{ marginTop: '40px' }}>
                  <a
                    href="#"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      background: 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))',
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLElement).style.background = 'linear-gradient(to bottom, rgb(37, 99, 235), rgb(29, 78, 216))';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLElement).style.background = 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))';
                    }}
                  >
                    {t.downloadCta}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 17V3" />
                      <path d="m6 11 6 6 6-6" />
                      <path d="M19 21H5" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ width: '100%', fontSize: '14px', color: 'rgb(148, 163, 184)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '32px'
            }}>
              <div style={{ maxWidth: '384px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.2541 1.83331C17.923 1.83331 17.6534 2.10289 17.6534 2.43397V15.566L4.56601 8.43397C4.30393 8.29331 3.98768 8.34181 3.78443 8.54506L2.43397 9.89552C2.13843 10.1911 2.13843 10.6761 2.43397 10.9716L15.566 24.1037H2.43397C2.10289 24.1037 1.83331 24.3733 1.83331 24.7043V26.6261C1.83331 26.9571 2.10289 27.2267 2.43397 27.2267H17.6534V32.9654C17.6534 33.2964 17.923 33.566 18.2541 33.566H20.1758C20.5069 33.566 20.7765 33.2964 20.7765 32.9654V20.8955L33.8639 27.9654C34.126 28.106 34.4422 28.0575 34.6455 27.8543L36 26.5038C36.2955 26.2083 36.2955 25.7233 36 25.4278L22.8679 12.2957H36C36.331 12.2957 36.6006 12.0261 36.6006 11.695V9.77329C36.6006 9.44221 36.331 9.17263 36 9.17263H20.7765V3.43397C20.7765 3.10289 20.5069 2.83331 20.1758 2.83331H18.2541V1.83331Z" fill="#EBE2FF" />
                  </svg>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '20px' }}>SUMMIT</span>
                </div>
                <p style={{ marginTop: '16px', lineHeight: '1.6' }}>
                  {t.footerTagline}
                </p>
              </div>
              <nav style={{ display: 'flex', gap: '32px', fontWeight: '500' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>{t.footerBusiness}</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>{t.footerAbout}</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>{t.footerFeature}</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>{t.footerBlogs}</a>
              </nav>
            </div>

            <div style={{
              marginTop: '48px',
              borderTop: '1px solid rgb(30, 41, 59)',
              paddingTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px'
            }}>
              <p style={{ color: 'rgb(100, 116, 139)' }}>{t.copyright}</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px', width: '100%' }}>
              <p style={{
                fontSize: '112px',
                fontWeight: '900',
                color: 'rgb(100, 116, 139)',
                opacity: '0.05',
                letterSpacing: '0.1em',
                lineHeight: '1',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%',
                margin: '0 auto'
              }}>
                SUMMIT EXCHANGE
              </p>
            </div>
          </div>
        </footer>
      </section>

      {/* Footer Stats */}

    </div>
  );
}
