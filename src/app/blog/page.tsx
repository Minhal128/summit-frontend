'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Hot vs Cold Wallets: Which One Truly Protects Your Assets?',
    image: 'https://img.freepik.com/free-photo/glowing-blue-sphere-held-by-human-hand-in-digital-art-style_23-2151184139.jpg',
    category: 'Security',
    slug: 'hot-wallet-vs-cold-wallet',
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Cryptocurrency Storage Solutions',
    image: 'https://img.freepik.com/free-photo/glowing-lines-abyss_1048-12503.jpg',
    category: 'Education',
    slug: 'cryptocurrency-storage-guide',
  },
  {
    id: 3,
    title: '5 Common Crypto Security Mistakes to Avoid at All Costs',
    image: 'https://img.freepik.com/free-photo/3d-background-with-tech-elements_23-2150701602.jpg',
    category: 'Tips',
    slug: 'crypto-security-mistakes',
  },
  {
    id: 4,
    title: 'Understanding Blockchain Technology and Its Core Basics',
    image: 'https://img.freepik.com/free-photo/glowing-abstract-connect-background_53876-110022.jpg',
    category: 'Technology',
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
const BlogHeroSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white font-sans">
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
          margin-top: 20px !important;
          margin-bottom: 50px !important;
        }
        .blog-badge {
          margin-top: -50px !important;
          margin-bottom: 2rem !important;
        }
        .blog-paragraph {
          margin-bottom: 5rem !important;
        }
      `}</style>
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-24">
        {/* Header Section */}
        <div className="w-full flex flex-col items-center justify-center text-center blog-header px-4">
          <div className="blog-badge">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30">
              <span className="text-sm font-semibold tracking-wider uppercase text-blue-300">BLOGS</span>
            </div>
          </div>
          <div className="w-full flex justify-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight center-title max-w-4xl">
              Insights That Empower Your Journey
            </h1>
          </div>
          <div className="w-full flex justify-center blog-paragraph">
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed center-title">
              Explore expert articles, tips, and the latest trends to stay ahead in the world of digital assets and innovation.
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl w-full">
            {blogPosts.map((post) => (
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
  return (
    <div className="font-inter bg-[#0A1A2F]">
        <script src="https://cdn.tailwindcss.com" async></script>
        <Header />
        <BlogHeroSection />
        <StatsTicker />
        <CTASection />
        <Footer />
    </div>
  );
};

export default BlogPage;

