'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import StatsTicker from '@/components/StatsTicker';

// --- SVG ICONS ---
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

interface BlogPost {
    title: string;
    category: string;
    date: string;
    image: string;
    content: string;
}

// Blog data - in a real app, this would come from a CMS or API
const blogData: { [key: string]: BlogPost } = {
    'hot-wallet-vs-cold-wallet': {
        title: 'Hot wallet Vs Cold wallet: Which is Preferable',
        category: 'BLOG',
        date: '11/08/2025',
        image: 'https://img.freepik.com/free-photo/glowing-blue-sphere-held-by-human-hand-in-digital-art-style_23-2151184139.jpg',
        content: "When it comes to storing your digital assets, one of the biggest decisions you&apos;ll face is whether to use a cold wallet or a hot wallet. Both options have their strengths and weaknesses, and understanding them is crucial to keeping your funds safe while still being able to access them when you need to. Hot wallets are always connected to the internet, making them incredibly convenient for traders who need quick access to buy, sell, or transfer crypto on the go. However, this same accessibility makes them vulnerable to hacks, phishing, and malware attacks. For small amounts of daily use, hot wallets are practical, but they shouldn&apos;t be relied on for securing large holdings."
    },
    'cryptocurrency-storage-guide': {
        title: 'The Ultimate Guide to Cryptocurrency Storage Solutions',
        category: 'BLOG',
        date: '10/08/2025',
        image: 'https://img.freepik.com/free-photo/glowing-lines-abyss_1048-12503.jpg',
        content: "Cryptocurrency storage is one of the most critical aspects of digital asset management. With the rise of digital currencies, understanding how to properly store your crypto assets has become essential for both beginners and experienced traders. This comprehensive guide will walk you through various storage solutions, from hardware wallets to paper wallets, helping you make informed decisions about securing your digital wealth."
    },
    'crypto-security-mistakes': {
        title: '5 Common Crypto Security Mistakes to Avoid at All Costs',
        category: 'BLOG',
        date: '09/08/2025',
        image: 'https://img.freepik.com/free-photo/3d-background-with-tech-elements_23-2150701602.jpg',
        content: "Security in the cryptocurrency world is paramount, yet many users make critical mistakes that put their assets at risk. From using weak passwords to falling for phishing scams, these common errors can lead to devastating losses. In this article, we&apos;ll explore the five most dangerous security mistakes crypto users make and provide actionable solutions to protect your digital assets."
    },
    'blockchain-technology-basics': {
        title: 'Understanding Blockchain Technology and Its Core Basics',
        category: 'BLOG',
        date: '08/08/2025',
        image: 'https://img.freepik.com/free-photo/glowing-abstract-connect-background_53876-110022.jpg',
        content: "Blockchain technology is the foundation of all cryptocurrencies and many modern digital innovations. Despite its importance, many people still struggle to understand how blockchain works and why it&apos;s revolutionary. This guide breaks down blockchain technology into digestible concepts, explaining everything from distributed ledgers to consensus mechanisms in simple terms."
    }
};

// --- UI COMPONENTS ---

const BlogArticle = ({ slug }: { slug: string }) => {
    const router = useRouter();
    const blog = blogData[slug];

    if (!blog) {
        return (
            <div className="w-full max-w-4xl mx-auto text-white text-center py-20">
                <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
                <p className="text-gray-400 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
                <button 
                    onClick={() => router.push('/blog')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Blogs
                </button>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-4xl mx-auto text-white">
            <button 
                onClick={() => router.push('/blog')}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>

            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <img 
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-64 object-cover"
                />

                <div className="p-8 md:p-12">
                    <p className="text-sm font-semibold tracking-widest text-gray-400 mb-4">{blog.category}</p>
                    <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                    <p className="text-gray-500 mb-8">{blog.date}</p>

                    <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
                        <h2 className="text-xl font-semibold text-white">A partnership built on shared values</h2>
                        <p>{blog.content}</p>
                        <h2 className="text-xl font-semibold text-white">Key Takeaways</h2>
                        <p>{blog.content}</p>
                        <p>{blog.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MoreArticles = ({ currentSlug }: { currentSlug: string }) => {
    const router = useRouter();
    
    // Get other articles (excluding current one)
    const otherArticles = Object.entries(blogData)
        .filter(([slug]) => slug !== currentSlug)
        .slice(0, 2)
        .map(([slug, data]) => ({ slug, ...data }));

    return (
        <div className="w-full max-w-4xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-center text-white mb-12">More Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {otherArticles.map((article) => (
                    <div 
                        key={article.slug} 
                        className="bg-[#1E293B] border border-slate-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:border-slate-600 transition-colors"
                        onClick={() => router.push(`/blog/${article.slug}`)}
                    >
                        <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <p className="text-xs font-semibold tracking-wider text-blue-400 mb-2">{article.category}</p>
                            <h3 className="font-bold text-lg text-white">{article.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

interface BlogDetailPageProps {
    params: {
        slug: string;
    };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = params;

    return (
        <div className="min-h-screen w-full bg-[#0F172A] text-gray-200 flex flex-col font-sans">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                .font-sans { font-family: 'Inter', sans-serif; }
                body {
                    background-color: #0F172A;
                }
            `}</style>
            
            <Header />
            
            <main className="flex-grow w-full py-12 px-4">
                <BlogArticle slug={slug} />
                <MoreArticles currentSlug={slug} />
            </main>
            <StatsTicker/>
            <CTASection/>
            <Footer />
        </div>
    );
}
