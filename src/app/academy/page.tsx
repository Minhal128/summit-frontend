'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import StatsTicker from '@/components/StatsTicker';
import { HelpCircle, CloudCog } from 'lucide-react';
import './academy.css';

// Support data
const logisticsFaqs = [
  {
    question: "Can I add an item to an existing order?",
    answer: "Step-by-step guidance on how to safely recover your account if you lose your keys or device."
  },
  {
    question: "Can I change my invoice?",
    answer: "Explore expert tips to keep your funds safe from phishing, scams, and unauthorized access."
  },
  {
    question: "Can I get a discount?",
    answer: "Find quick fixes for common issues like delayed transfers, failed payments, or syncing problems."
  },
  {
    question: "Device Compatibility",
    answer: "Learn the best way to reach our support team and get fast, reliable help when you need it most."
  }
];

const troubleshootingFaqs = [
  {
    question: "Common hardware issues",
    answer: "Learn how to create, back up, and secure your cold wallet in just a few steps."
  },
  {
    question: "Can I reverse a transaction?",
    answer: "A simple walkthrough on transferring funds safely and efficiently."
  },
  {
    question: "How to avoid poisoning attacks?",
    answer: "Discover how to organize, track, and diversify your crypto portfolio."
  },
  {
    question: "Best Security Practices",
    answer: "Learn the best way to reach our support team and get fast, reliable help when you need it most."
  }
];

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<"Guides" | "Support" | "Learn">("Guides")

  return (
    <div className="academy-page">
      <Header />

      

      {/* Academy Header - Centered */}
      <section className="academy-header">
        <div className="academy-header-content">
          <p className="academy-badge">Academy</p>
          <h1 className="academy-title">
            Master the Art of Secure Finance
          </h1>
          <p className="academy-subtitle">
            Learn everything you need to know about protecting, managing, and growing your assets with our
            comprehensive, easy-to-follow guides and tutorials.
          </p>
        </div>
      </section>

      {/* Video Player - Centered */}
      <section className="academy-video-section">
        <div className="academy-video-container">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-1">
            <div className="relative bg-[#0A1A2F] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Cryptocurrency and blockchain technology"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/80 via-transparent to-[#0A1A2F]/40" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-10 h-10 md:w-12 md:h-12 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.535 0 3.284L7.279 20.99c-1.25.722-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* BitBox02 branding overlay */}
              <div className="absolute bottom-6 left-6">
                <div className="text-white/60 text-4xl md:text-6xl font-bold tracking-wider">BitBox02</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section - Centered */}
      <section className="academy-guides-section">
        <div className="academy-guides-container">
          {/* Section Header */}
          <div className="academy-section-header">
            <h2 className="academy-section-title">Your Step-by-Step Guide</h2>
            <p className="academy-section-description">
              Navigate and master through clear instructions, practical tips, and expert advice, perfect for both
              beginners and advanced users.
            </p>
          </div>

          {/* Tabs */}
          <div className="academy-tabs-container">
            <div className="academy-tabs">
              {["Guides", "Support", "Learn"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "Guides" | "Support" | "Learn")}
                  className={`academy-tab ${activeTab === tab ? "active" : "inactive"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Support Content - Two Equal Boxes */}
          {activeTab === "Support" && (
            <div className="academy-content-section">
              <div className="academy-support-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Logistics Box */}
                  <div className="bg-[#102037] border border-slate-700 rounded-2xl p-8 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                        <CloudCog className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Logistics</h2>
                        <p className="text-slate-400 text-lg">Order status, shipping, and returns</p>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      {logisticsFaqs.map((faq, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-start gap-6 p-6 rounded-xl hover:bg-slate-700/30 transition-colors group"
                        >
                          <HelpCircle className="w-7 h-7 mt-1 text-slate-400 flex-shrink-0 group-hover:text-blue-400" />
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                              {faq.question}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Troubleshooting Box */}
                  <div className="bg-[#102037] border border-slate-700 rounded-2xl p-8 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                        <CloudCog className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Troubleshooting</h2>
                        <p className="text-slate-400 text-lg">Learn everything you need to store, manage</p>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      {troubleshootingFaqs.map((faq, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-start gap-6 p-6 rounded-xl hover:bg-slate-700/30 transition-colors group"
                        >
                          <HelpCircle className="w-7 h-7 mt-1 text-slate-400 flex-shrink-0 group-hover:text-blue-400" />
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                              {faq.question}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guide Cards Grid */}
          {activeTab === "Guides" && (
            <div className="academy-guides-grid">
              {[
                {
                  title: "Supported Assets",
                  items: [
                    "Receiving Assets",
                    "Security Best Practices",
                    "Troubleshooting Transactions",
                    "Device Compatibility",
                  ],
                },
                {
                  title: "Master Cold Wallet Security",
                  items: [
                    "Setting Up Your Wallet",
                    "Sending and Receiving Crypto",
                    "Managing Multiple Accounts",
                    "Best Security Practices",
                  ],
                },
                {
                  title: "Master Cold Wallet Security",
                  items: [
                    "Setting Up Your Wallet",
                    "Sending and Receiving Crypto",
                    "Managing Multiple Accounts",
                    "Best Security Practices",
                  ],
                },
                {
                  title: "Supported Assets",
                  items: [
                    "Receiving Assets",
                    "Security Best Practices",
                    "Troubleshooting Transactions",
                    "Device Compatibility",
                  ],
                },
              ].map((guide, i) => (
                <div
                  key={i}
                  className="bg-[#1A202C]/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6 p-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">{guide.title}</h3>
                  </div>

                  {/* Card Items */}
                  <ul className="space-y-3">
                    {guide.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 group">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ml-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3 h-3 text-green-400"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Learn Content */}
          {activeTab === "Learn" && (
            <div className="academy-content-section">
              <div className="academy-learn-container">
                <h2 className="text-3xl font-bold text-white mb-6">Learning Resources</h2>
                <p className="text-gray-400 mb-8">Comprehensive tutorials and educational content coming soon.</p>
                <div className="bg-[#102037] border border-slate-700 rounded-2xl p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Educational Content</h3>
                  <p className="text-gray-400">Interactive courses, video tutorials, and in-depth guides to help you master cryptocurrency security.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Ticker */}
      <StatsTicker />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
