'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import StatsTicker from '@/components/StatsTicker';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

// NOTE: The following components are assumed to be in separate files as per the original code.
// To make this a single runnable file, these would need to be defined here.



// TypeScript interface for blog post
interface BlogPost {
  id: number;
  title: string;
  image: string;
  category: string;
  slug: string;
}

// Data for the blog posts
const blogImageAndSlug = [
  {
    id: 1,
    image: 'https://img.freepik.com/free-photo/glowing-blue-sphere-held-by-human-hand-in-digital-art-style_23-2151184139.jpg',
    slug: 'hot-wallet-vs-cold-wallet',
  },
  {
    id: 2,
    image: 'https://img.freepik.com/free-photo/glowing-lines-abyss_1048-12503.jpg',
    slug: 'cryptocurrency-storage-guide',
  },
  {
    id: 3,
    image: 'https://img.freepik.com/free-photo/3d-background-with-tech-elements_23-2150701602.jpg',
    slug: 'crypto-security-mistakes',
  },
  {
    id: 4,
    image: 'https://img.freepik.com/free-photo/glowing-abstract-connect-background_53876-110022.jpg',
    slug: 'blockchain-technology-basics',
  },
];

// UPDATED Blog Card Component using the new UI
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const router = useRouter();
    
    const handleClick = () => {
        router.push(`/blog/${post.slug}`);
    };
    
    return (
        <div 
            className="max-w-sm w-full bg-[#101828] border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:border-gray-600"
            onClick={handleClick}
        >
            <div className="p-4">
                {/* Card Image */}
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                />
                <div className="py-4">
                    {/* Category Badge */}
                    <span className="inline-block border border-gray-600 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                    </span>
                    {/* Card Title */}
                    <h3 className="text-white text-lg font-semibold mt-3 leading-snug h-14 line-clamp-2">
                        {post.title}
                    </h3>
                </div>
            </div>
        </div>
    );
};


// Blog Hero Section Component
const BlogHeroSection: React.FC<{ posts: BlogPost[]; t: { badge: string; title: string; subtitle: string } }> = ({ posts, t }) => {
  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white font-sans" style={{paddingTop: '70px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        .center-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }
        .center-title {
          text-align: center !important;
          margin: 0 auto !important;
          display: block !important;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-header {
          margin-top: 50px !important;
          margin-bottom: 50px !important;
        }
        .blog-badge {
          margin-top: 20px !important;
          margin-bottom: 2rem !important;
        }
        .blog-paragraph {
          margin-bottom: 5rem !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .blog-header {
            margin-top: 10px !important;
            margin-bottom: 30px !important;
          }
          
          .blog-badge {
            margin-top: -30px !important;
            margin-bottom: 1rem !important;
          }
          
          .blog-paragraph {
            margin-bottom: 3rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
            line-height: 1.2 !important;
          }
          
          .text-lg {
            font-size: 1rem !important;
          }
        }
      `}</style>
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-24">
        {/* Header Section */}
        <div className="w-full flex flex-col items-center justify-center text-center blog-header px-4">
          <div className="blog-badge">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30">
              <span className="text-sm font-semibold tracking-wider uppercase text-blue-300">{t.badge}</span>
            </div>
          </div>
          <div className="w-full flex justify-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight center-title max-w-4xl">
              {t.title}
            </h1>
          </div>
          <div className="w-full flex justify-center blog-paragraph">
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed center-title">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl w-full">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Blog Page Component
const BlogPage: React.FC = () => {
  const locale = useLocale();

  const copyByLocale = {
    en: {
      badge: 'BLOGS',
      title: 'Insights That Empower Your Journey',
      subtitle: 'Explore expert articles, tips, and the latest trends to stay ahead in the world of digital assets and innovation.',
      posts: [
        { title: 'Hot vs Cold Wallets: Which One Truly Protects Your Assets?', category: 'Security' },
        { title: 'The Ultimate Guide to Cryptocurrency Storage Solutions', category: 'Education' },
        { title: '5 Common Crypto Security Mistakes to Avoid at All Costs', category: 'Tips' },
        { title: 'Understanding Blockchain Technology and Its Core Basics', category: 'Technology' }
      ]
    },
    zh: {
      badge: '博客',
      title: '助你前行的深度洞察',
      subtitle: '探索专家文章、技巧与最新趋势，在数字资产与创新世界中始终领先。',
      posts: [
        { title: '热钱包 vs 冷钱包：哪一个才能真正保护你的资产？', category: '安全' },
        { title: '加密货币存储方案终极指南', category: '教育' },
        { title: '必须避免的 5 个常见加密安全错误', category: '技巧' },
        { title: '理解区块链技术及其核心基础', category: '技术' }
      ]
    },
    ar: {
      badge: 'المدونة',
      title: 'رؤى تدعم رحلتك',
      subtitle: 'استكشف مقالات الخبراء والنصائح وأحدث الاتجاهات للبقاء في المقدمة في عالم الأصول الرقمية والابتكار.',
      posts: [
        { title: 'المحافظ الساخنة مقابل الباردة: أيهما يحمي أصولك فعلاً؟', category: 'الأمان' },
        { title: 'الدليل الشامل لحلول تخزين العملات الرقمية', category: 'التعليم' },
        { title: '5 أخطاء أمنية شائعة في الكريبتو يجب تجنبها', category: 'نصائح' },
        { title: 'فهم تقنية البلوكشين وأساسياتها الجوهرية', category: 'التقنية' }
      ]
    },
    ru: {
      badge: 'БЛОГ',
      title: 'Инсайты, которые усиливают ваш путь',
      subtitle: 'Изучайте экспертные статьи, советы и тренды, чтобы опережать в мире цифровых активов и инноваций.',
      posts: [
        { title: 'Горячие vs холодные кошельки: что действительно защищает активы?', category: 'Безопасность' },
        { title: 'Полное руководство по хранению криптовалюты', category: 'Обучение' },
        { title: '5 распространённых ошибок криптобезопасности, которых стоит избегать', category: 'Советы' },
        { title: 'Понимание технологии блокчейн и её базовых принципов', category: 'Технологии' }
      ]
    },
    th: {
      badge: 'บล็อก',
      title: 'อินไซต์ที่ช่วยขับเคลื่อนเส้นทางของคุณ',
      subtitle: 'สำรวจบทความจากผู้เชี่ยวชาญ เคล็ดลับ และเทรนด์ล่าสุด เพื่อก้าวนำในโลกสินทรัพย์ดิจิทัลและนวัตกรรม',
      posts: [
        { title: 'Hot Wallet vs Cold Wallet: แบบไหนปกป้องสินทรัพย์ได้ดีกว่า?', category: 'ความปลอดภัย' },
        { title: 'คู่มือฉบับสมบูรณ์เกี่ยวกับการจัดเก็บคริปโต', category: 'การเรียนรู้' },
        { title: '5 ความผิดพลาดด้านความปลอดภัยคริปโตที่ควรหลีกเลี่ยง', category: 'เคล็ดลับ' },
        { title: 'ทำความเข้าใจเทคโนโลยีบล็อกเชนและพื้นฐานสำคัญ', category: 'เทคโนโลยี' }
      ]
    },
    es: {
      badge: 'BLOGS',
      title: 'Ideas que impulsan tu camino',
      subtitle: 'Explora artículos de expertos, consejos y tendencias para mantenerte a la vanguardia en activos digitales e innovación.',
      posts: [
        { title: 'Hot Wallet vs Cold Wallet: ¿cuál protege realmente tus activos?', category: 'Seguridad' },
        { title: 'La guía definitiva de soluciones de almacenamiento cripto', category: 'Educación' },
        { title: '5 errores comunes de seguridad cripto que debes evitar', category: 'Consejos' },
        { title: 'Entendiendo la tecnología blockchain y sus bases', category: 'Tecnología' }
      ]
    },
    fr: {
      badge: 'BLOGS',
      title: 'Des insights qui renforcent votre parcours',
      subtitle: 'Explorez des articles d’experts, des conseils et les dernières tendances pour garder une longueur d’avance dans les actifs numériques.',
      posts: [
        { title: 'Hot Wallet vs Cold Wallet : lequel protège vraiment vos actifs ?', category: 'Sécurité' },
        { title: 'Le guide ultime des solutions de stockage crypto', category: 'Éducation' },
        { title: '5 erreurs courantes de sécurité crypto à éviter absolument', category: 'Conseils' },
        { title: 'Comprendre la technologie blockchain et ses bases', category: 'Technologie' }
      ]
    },
    de: {
      badge: 'BLOG',
      title: 'Einblicke, die deinen Weg stärken',
      subtitle: 'Entdecke Expertenartikel, Tipps und Trends, um in der Welt digitaler Assets und Innovation vorne zu bleiben.',
      posts: [
        { title: 'Hot vs Cold Wallets: Welche schützt deine Assets wirklich?', category: 'Sicherheit' },
        { title: 'Der ultimative Leitfaden für Krypto-Speicherlösungen', category: 'Bildung' },
        { title: '5 häufige Krypto-Sicherheitsfehler, die du vermeiden solltest', category: 'Tipps' },
        { title: 'Blockchain-Technologie und ihre Grundlagen verstehen', category: 'Technologie' }
      ]
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  const blogPosts: BlogPost[] = blogImageAndSlug.map((item, idx) => ({
    id: item.id,
    image: item.image,
    slug: item.slug,
    title: t.posts[idx]?.title ?? copyByLocale.en.posts[idx].title,
    category: t.posts[idx]?.category ?? copyByLocale.en.posts[idx].category,
  }));

  return (
    <div className="font-inter bg-[#0A1A2F]">
        <script src="https://cdn.tailwindcss.com" async></script>
        <Header />
        <BlogHeroSection posts={blogPosts} t={t} />
        <StatsTicker />
        <CTASection />
        <Footer />
    </div>
  );
};

export default BlogPage;

