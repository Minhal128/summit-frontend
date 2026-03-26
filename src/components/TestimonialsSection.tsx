'use client';

import React from 'react';
import { useLocale } from 'next-intl';

// Interface for a single testimonial
interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

// Props for the main section component
interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

/**
 * A modern, professional testimonial card component
 */
const TestimonialCard = ({ name, role, text, avatar }: Testimonial) => (
  <div className="group relative flex-shrink-0 bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 overflow-hidden mobile-card">
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
    
    {/* Quote icon */}
    <div className="absolute top-4 right-5 text-4xl text-blue-400/15 font-serif leading-none">&quot;</div>
    
    {/* Content - Centered */}
    <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
      {/* Header */}
      <div className="flex flex-col items-center mb-4 flex-shrink-0">
        <div className="relative flex-shrink-0 mb-3">
          <img
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-400/30 shadow-lg"
            src={avatar}
            alt={name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              const initials = name.split(' ').map(n => n[0]).join('');
              target.src = `https://placehold.co/48x48/2A3C5A/EBE2FF?text=${initials || '?'}`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-white text-base mb-0.5">{name}</h4>
          <p className="text-sm text-blue-400/80 font-medium">{role}</p>
        </div>
      </div>
      
      {/* Testimonial text - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/90 text-sm leading-relaxed italic line-clamp-4 text-center">
          &quot;{text}&quot;
        </p>
      </div>
    </div>
  </div>
);


/**
 * The main testimonials section component.
 * It displays a header and two rows of scrolling testimonials.
 * @param {TestimonialsSectionProps} props - The properties for the section.
 * @returns {JSX.Element} The rendered testimonials section.
 */
const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const locale = useLocale();

  const copyByLocale = {
    en: {
      badge: 'Client Testimonials',
      title: 'Trusted By Investors Who Value Security',
      subtitle: 'Discover why thousands of professionals and everyday investors trust Summit to safeguard their digital assets with uncompromising security.',
      roles: ['Crypto Investor', 'Professional Trader', 'Early Adopter', 'DeFi Enthusiast', 'NFT Collector'],
      texts: [
        'Finally, peace of mind. I know my assets are safe no matter what happens online.',
        'The security is unmatched. Summit gives me the confidence to hold for the long term without worrying about online threats.',
        'As someone who has been in crypto since the beginning, I can say this is the most secure and user-friendly cold wallet I have used.',
        'I moved all my major holdings to Summit. The peace of mind is invaluable. It is a must-have for any serious investor.',
        'Protecting my high-value NFTs was my top priority. The offline storage solution is perfect for my needs.'
      ]
    },
    zh: {
      badge: '客户评价', title: '被重视安全的投资者信赖', subtitle: '了解为什么成千上万的专业与普通投资者选择 Summit 守护其数字资产。',
      roles: ['加密投资者', '专业交易员', '早期用户', 'DeFi 爱好者', 'NFT 收藏者'],
      texts: ['终于可以安心了。无论线上发生什么，我的资产都很安全。', '安全性无可比拟。Summit 让我能放心长期持有。', '作为早期进入加密领域的人，我认为这是最安全且易用的冷钱包。', '我已将主要资产转到 Summit，带来的安心感无可替代。', '保护高价值 NFT 是我的首要任务，离线方案正好满足需求。']
    },
    ar: {
      badge: 'آراء العملاء', title: 'موثوق به من المستثمرين الذين يقدّرون الأمان', subtitle: 'اكتشف لماذا يثق آلاف المستثمرين في Summit لحماية أصولهم الرقمية بأمان صارم.',
      roles: ['مستثمر عملات رقمية', 'متداول محترف', 'مستخدم مبكر', 'مهتم بـ DeFi', 'جامع NFT'],
      texts: ['أخيرًا راحة بال حقيقية. أعلم أن أصولي آمنة مهما حدث على الإنترنت.', 'الأمان لا يُضاهى. Summit يمنحني الثقة للاحتفاظ طويلًا دون قلق.', 'كمستخدم قديم في الكريبتو، هذه أكثر محفظة باردة أمانًا وسهولة استخدمتها.', 'نقلت معظم أصولي إلى Summit، والطمأنينة لا تقدّر بثمن.', 'حماية مقتنياتي عالية القيمة من NFT كانت أولوية، والحل دون اتصال مثالي.']
    },
    ru: {
      badge: 'ОТЗЫВЫ КЛИЕНТОВ', title: 'Нам доверяют инвесторы, ценящие безопасность', subtitle: 'Узнайте, почему тысячи инвесторов выбирают Summit для защиты цифровых активов.',
      roles: ['Крипто-инвестор', 'Профессиональный трейдер', 'Ранний пользователь', 'Энтузиаст DeFi', 'Коллекционер NFT'],
      texts: ['Наконец-то спокойствие: мои активы в безопасности независимо от онлайн-рисков.', 'Безопасность на высоте. Summit дает уверенность в долгосрочном хранении.', 'Как участник крипторынка с самого начала, это лучший cold wallet, которым я пользовался.', 'Я перевела основные активы в Summit — это бесценное ощущение надежности.', 'Защита дорогих NFT была приоритетом, и офлайн-хранение идеально подошло.']
    },
    th: {
      badge: 'เสียงจากลูกค้า', title: 'นักลงทุนที่ให้ความสำคัญกับความปลอดภัยไว้วางใจเรา', subtitle: 'ดูว่าทำไมทั้งมืออาชีพและนักลงทุนทั่วไปจึงเลือก Summit เพื่อปกป้องสินทรัพย์ดิจิทัล',
      roles: ['นักลงทุนคริปโต', 'เทรดเดอร์มืออาชีพ', 'ผู้ใช้งานยุคแรก', 'สาย DeFi', 'นักสะสม NFT'],
      texts: ['ในที่สุดก็สบายใจ รู้ว่าสินทรัพย์ของฉันปลอดภัยไม่ว่าออนไลน์จะเกิดอะไรขึ้น', 'ความปลอดภัยยอดเยี่ยม Summit ทำให้ถือระยะยาวได้อย่างมั่นใจ', 'ฉันอยู่ในวงการคริปโตมานาน และนี่คือ cold wallet ที่ปลอดภัยและใช้ง่ายที่สุด', 'ฉันย้ายสินทรัพย์หลักมาที่ Summit แล้ว ความสบายใจมีค่ามาก', 'การปกป้อง NFT มูลค่าสูงคือสิ่งสำคัญที่สุด และโซลูชันออฟไลน์ตอบโจทย์มาก']
    },
    es: {
      badge: 'TESTIMONIOS', title: 'Con la confianza de inversores que valoran la seguridad', subtitle: 'Descubre por qué miles de profesionales e inversores confían en Summit.',
      roles: ['Inversor cripto', 'Trader profesional', 'Usuario temprano', 'Entusiasta DeFi', 'Coleccionista NFT'],
      texts: ['Por fin tranquilidad: sé que mis activos están seguros pase lo que pase online.', 'La seguridad es inigualable. Summit me da confianza para mantener a largo plazo.', 'Llevo años en cripto y este es el cold wallet más seguro y fácil de usar que he probado.', 'Moví mis principales holdings a Summit; la tranquilidad no tiene precio.', 'Proteger mis NFT de alto valor era prioridad, y el almacenamiento offline es perfecto.']
    },
    fr: {
      badge: 'TÉMOIGNAGES CLIENTS', title: 'La confiance des investisseurs qui valorisent la sécurité', subtitle: 'Découvrez pourquoi des milliers d’investisseurs font confiance à Summit.',
      roles: ['Investisseur crypto', 'Trader professionnel', 'Early adopter', 'Passionné DeFi', 'Collectionneur NFT'],
      texts: ['Enfin la sérénité: mes actifs restent en sécurité quoi qu’il arrive en ligne.', 'La sécurité est incomparable. Summit me permet d’investir long terme en confiance.', 'Présent dans la crypto depuis le début, c’est le cold wallet le plus sûr que j’ai utilisé.', 'J’ai déplacé mes principaux actifs vers Summit, la tranquillité d’esprit est énorme.', 'Protéger mes NFT de valeur était prioritaire, et la solution hors ligne est parfaite.']
    },
    de: {
      badge: 'KUNDENSTIMMEN', title: 'Vertrauen von Investoren, die Sicherheit schätzen', subtitle: 'Erfahre, warum Tausende Investoren Summit zum Schutz ihrer Assets nutzen.',
      roles: ['Krypto-Investor', 'Profi-Trader', 'Early Adopter', 'DeFi-Enthusiast', 'NFT-Sammler'],
      texts: ['Endlich echte Ruhe: Meine Assets sind sicher, egal was online passiert.', 'Die Sicherheit ist herausragend. Summit gibt mir Vertrauen für langfristiges Halten.', 'Ich bin seit den Anfängen in Krypto und das ist die sicherste Cold Wallet, die ich genutzt habe.', 'Ich habe meine wichtigsten Bestände zu Summit verschoben — die Sicherheit ist unbezahlbar.', 'Der Schutz meiner hochwertigen NFTs war entscheidend, und die Offline-Lösung passt perfekt.']
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  // Default testimonials data if none are provided via props
  const defaultTestimonials: Testimonial[] = [
    {
      name: 'David K.',
      role: t.roles[0],
      text: t.texts[0],
      avatar: 'https://img.freepik.com/free-photo/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded_171337-1875.jpg',
    },
    {
      name: 'Sarah J.',
      role: t.roles[1],
      text: t.texts[1],
      avatar: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg',
    },
    {
      name: 'Michael B.',
      role: t.roles[2],
      text: t.texts[2],
      avatar: 'https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg',
    },
    {
      name: 'Emily R.',
      role: t.roles[3],
      text: t.texts[3],
      avatar: 'https://img.freepik.com/free-photo/lifestyle-beauty-fashion-people-emotions-concept-young-gorgeous-sassy-korean-girl-showing-peace-signs-winking-cheeky-smiling-standing-blue-background_1258-76504.jpg',
    },
    {
      name: 'Chris L.',
      role: t.roles[4],
      text: t.texts[4],
      avatar: 'https://img.freepik.com/free-photo/pleased-young-businessman-wearing-glasses-holding-notebooks-showing-thumb-up-isolated-white-background_141793-65239.jpg',
    }
  ];

  const displayTestimonials = testimonials || defaultTestimonials;
  const row1Testimonials = displayTestimonials;
  const row2Testimonials = [...displayTestimonials].reverse(); // Use a reversed copy for the second row

  return (
    <>
      <style jsx>{`
        .testimonials-background {
          width: 100%;
          min-height: 100vh;
          background-color: #0A1A2F;
          font-family: Inter, sans-serif;
          color: white;
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .marquee-left {
          animation: marquee-left 25s linear infinite;
        }

        .marquee-right {
          animation: marquee-right 25s linear infinite;
        }
        
        .marquee-container {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          overflow: hidden;
        }

        .marquee-row {
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          align-items: stretch;
          gap: 32px;
          padding-right: 32px; /* Perfect loop offset */
        }

        .section-badge {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
        }

        .mobile-card {
          box-sizing: border-box;
          width: 320px;
          height: 180px;
        }

        @media (max-width: 768px) {
          .testimonials-background {
            padding: 0;
            margin: 0;
          }

          .section-badge span {
            font-size: 12px;
          }

          h1 {
            font-size: 28px;
            margin-bottom: 12px;
          }

          p {
            font-size: 15px;
            margin-bottom: 32px;
            padding: 0 16px;
          }

          section {
            padding: 24px 0;
          }

          .mobile-card {
            width: 280px;
            height: auto;
            min-height: 160px;
            padding: 16px;
          }

          .marquee-container {
            margin-top: 24px;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          }
          
          .marquee-track {
            gap: 16px;
            padding-right: 16px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 24px;
            margin-bottom: 12px;
          }

          p {
            font-size: 14px;
            margin-bottom: 24px;
          }

          .section-badge {
            padding: 4px 10px;
          }

          .mobile-card {
            width: 260px;
            min-height: 150px;
            padding: 12px;
          }
          
          .marquee-track {
            gap: 12px;
            padding-right: 12px;
          }
        }
      `}</style>

      <div className="testimonials-background">
        <section className="w-full py-16 pb-24 relative z-10 flex flex-col items-center justify-center overflow-x-hidden">
          {/* Header Content */}
          <div className="text-center mb-20 max-w-6xl mx-auto px-8">
            {/* Section Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full section-badge mb-6" style={{ marginTop: '50px' }}>
              <span className="text-sm font-semibold tracking-wide uppercase text-blue-300">{t.badge}</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              {t.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-center font-light" style={{ marginBottom: '70px' }}>
              {t.subtitle}
            </p>
            
          </div>

          {/* Marquee Container */}
          <div className="relative w-full flex flex-col gap-8 marquee-container">
            {/* First Row - Scrolls Left */}
            <div className="marquee-row">
              <div className="marquee-track marquee-left">
                {[...row1Testimonials, ...row1Testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`r1-${index}`} {...testimonial} />
                ))}
              </div>
            </div>
            
            {/* Second Row - Scrolls Right */}
            <div className="marquee-row">
              <div className="marquee-track marquee-right">
                {[...row2Testimonials, ...row2Testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`r2-${index}`} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
          
        </section>
      </div>
    </>
  );
};

export default TestimonialsSection;

