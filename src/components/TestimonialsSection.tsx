'use client';

import React from 'react';

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
  <div className="group relative flex-shrink-0 w-[320px] h-[180px] bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 overflow-hidden mobile-card">
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
  // Default testimonials data if none are provided via props
  const defaultTestimonials: Testimonial[] = [
    {
      name: 'David K.',
      role: 'Crypto Investor',
      text: 'Finally, peace of mind. I know my assets are safe no matter what happens online.',
      avatar: 'https://img.freepik.com/free-photo/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded_171337-1875.jpg',
    },
    {
      name: 'Sarah J.',
      role: 'Professional Trader',
      text: 'The security is unmatched. Summit gives me the confidence to hold for the long term without worrying about online threats.',
      avatar: 'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg',
    },
    {
      name: 'Michael B.',
      role: 'Early Adopter',
      text: 'As someone who has been in crypto since the beginning, I can say this is the most secure and user-friendly cold wallet I have used.',
      avatar: 'https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg',
    },
    {
      name: 'Emily R.',
      role: 'DeFi Enthusiast',
      text: 'I moved all my major holdings to Summit. The peace of mind is invaluable. It is a must-have for any serious investor.',
      avatar: 'https://img.freepik.com/free-photo/lifestyle-beauty-fashion-people-emotions-concept-young-gorgeous-sassy-korean-girl-showing-peace-signs-winking-cheeky-smiling-standing-blue-background_1258-76504.jpg',
    },
    {
      name: 'Chris L.',
      role: 'NFT Collector',
      text: 'Protecting my high-value NFTs was my top priority. The offline storage solution is perfect for my needs.',
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
          animation: marquee-left 80s linear infinite;
        }

        .marquee-right {
          animation: marquee-right 80s linear infinite;
        }
        
        .marquee-container {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          overflow: hidden;
        }

        .marquee-row {
          overflow: hidden;
        }

        .section-badge {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
        }

        .mobile-card {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .testimonials-background {
            padding: 0;
            margin: 0;
            min-height: 80vh;
          }

          .section-badge span {
            font-size: 12px;
          }

          h1 {
            font-size: 32px !important;
            margin-bottom: 16px !important;
          }

          p {
            font-size: 16px !important;
            margin-bottom: 40px !important;
            padding: 0 16px !important;
          }

          section {
            padding: 32px 16px 32px 16px;
          }

          .mobile-card {
            width: 280px !important;
            height: 160px !important;
            padding: 16px !important;
            border-radius: 16px !important;
          }

          .mobile-card h4 {
            font-size: 14px !important;
            margin-bottom: 4px !important;
          }

          .mobile-card p {
            font-size: 12px !important;
          }

          .mobile-card img {
            width: 36px !important;
            height: 36px !important;
          }

          .mobile-card .text-sm {
            font-size: 11px !important;
          }

          .mobile-card .text-4xl {
            font-size: 24px !important;
          }

          .marquee-container {
            margin-top: 32px;
          }
        }

        @media (max-width: 480px) {
          .testimonials-background {
            padding: 0;
            margin: 0;
            min-height: 70vh;
          }

          h1 {
            font-size: 28px !important;
            margin-bottom: 12px !important;
          }

          p {
            font-size: 14px !important;
            margin-bottom: 32px !important;
            padding: 0 12px !important;
          }

          .section-badge {
            padding: 6px 12px;
          }

          .section-badge span {
            font-size: 10px;
          }

          section {
            padding: 24px 12px 24px 12px;
          }

          .mobile-card {
            width: 240px !important;
            height: 140px !important;
            padding: 12px !important;
          }

          .mobile-card h4 {
            font-size: 12px !important;
          }

          .mobile-card p {
            font-size: 10px !important;
          }

          .mobile-card img {
            width: 32px !important;
            height: 32px !important;
          }

          .mobile-card .text-sm {
            font-size: 9px !important;
          }
        }
      `}</style>

      <div className="testimonials-background">
        <section className="w-full py-16 pb-24 relative z-10 flex flex-col items-center justify-center overflow-x-hidden">
          {/* Header Content */}
          <div className="text-center mb-20 max-w-6xl mx-auto px-8">
            {/* Section Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full section-badge mb-6" style={{ marginTop: '50px' }}>
              <span className="text-sm font-semibold tracking-wide uppercase text-blue-300">Client Testimonials</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              Trusted By Investors Who Value Security
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-center font-light" style={{ marginBottom: '70px' }}>
              Discover why thousands of professionals and everyday investors trust Summit 
              to safeguard their digital assets with uncompromising security.
            </p>
            
          </div>

          {/* Marquee Container */}
          <div className="relative w-full flex flex-col gap-8 marquee-container">
            {/* First Row - Scrolls Left */}
            <div className="marquee-row">
              <div className="flex w-max items-stretch gap-8 marquee-left">
                {[...row1Testimonials, ...row1Testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`r1-${index}`} {...testimonial} />
                ))}
              </div>
            </div>
            
            {/* Second Row - Scrolls Right */}
            <div className="marquee-row">
              <div className="flex w-max items-stretch gap-8 marquee-right">
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

