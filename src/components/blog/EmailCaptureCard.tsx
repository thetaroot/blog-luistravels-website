'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmailCaptureCardProps {
  index: number;
  variant?: 'behind-scenes';
}

export default function EmailCaptureCard({ index, variant = 'behind-scenes' }: EmailCaptureCardProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const content = {
    'behind-scenes': {
      title: {
        de: 'Stories von unterwegs',
        en: 'More stories from abroad'
      },
      subtitle: {
        de: '',
        en: ''
      },
      description: {
        de: 'Was noch so passiert, Updates und Stories, die es nicht in den Blog schaffen. Nur eine schnelle Option mehr zu teilen, kein Spam, kein Quatsch.',
        en: 'What else happens, updates and stuff that doesn\'t make it to the blog. Just short stories I can put out even faster. No spam, no nonsense.'
      },
      placeholder: {
        de: 'deine@email.com',
        en: 'your@email.com'
      },
      cta: {
        de: 'Dabei sein →',
        en: 'Count me in →'
      },
      success: {
        de: 'Nice! Check gleich deine Mails ✉️',
        en: 'Nice! Check your email ✉️'
      }
    }
  };

  const currentContent = content[variant];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // TODO: Integrate with your email service (ConvertKit, Mailchimp, etc.)
    console.log('Email captured:', email);
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative group cursor-pointer"
        style={{ height: '400px' }} // Same height as BlogCard
      >
        <div className="relative h-full rounded-2xl overflow-hidden">
          {/* Success state with gradient background */}
          <div
            className="absolute inset-0 rounded-2xl transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.6) 50%, rgba(5, 150, 105, 0.4) 100%)`,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white text-lg font-medium"
              style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
            >
              {currentContent.success[language]}
            </motion.p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.6,
        delay: index * 0.15
      }}
      className="group cursor-pointer perspective-1000"
      whileHover={{ 
        scale: 1.03,
        rotateX: -8,
        rotateY: 5,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      whileTap={{ scale: 0.97 }}
      style={{ 
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        borderRadius: '28px',
        overflow: 'hidden'
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          borderRadius: '28px !important'
        }}
      >
        {/* Main card with 3D blurgy background - EXACT BlogCard styling */}
        <motion.div
          className="relative bg-warm-white/50 backdrop-blur-2xl p-8 h-96 !rounded-[28px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(241, 237, 228, 0.70) 0%, rgba(241, 237, 228, 0.60) 50%, rgba(241, 237, 228, 0.55) 100%)`,
            boxShadow: `0 0 0 1px rgba(241, 237, 228, 0.3), 0 8px 32px -8px rgba(20, 20, 19, 0.25), 0 20px 60px -12px rgba(20, 20, 19, 0.12)`,
            backdropFilter: 'blur(24px) saturate(180%)',
            transform: 'translateZ(20px)',
            borderRadius: '28px !important',
            minHeight: '384px'
          }}
          whileHover={{
            background: `linear-gradient(135deg, rgba(241, 237, 228, 0.85) 0%, rgba(241, 237, 228, 0.75) 50%, rgba(241, 237, 228, 0.70) 100%)`,
            boxShadow: '0 0 0 1px rgba(241, 237, 228, 0.4), 0 12px 40px -8px rgba(20, 20, 19, 0.35), 0 25px 70px -12px rgba(20, 20, 19, 0.18)'
          }}
          transition={{
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Glossy surface layer - EXACT BlogCard styling */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 100%)',
              transform: 'translateZ(5px)',
              borderRadius: '28px !important'
            }}
          />
          
          {/* Content layer */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              {/* Badge like BlogCard date */}
              <div className="inline-flex items-center px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/95 text-sm text-dark font-semibold mb-3 shadow-sm">
                <svg className="w-4 h-4 text-dark mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
{language === 'de' ? 'Direkte Updates' : 'Direct Updates'}
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-dark mb-4" 
                  style={{ fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                {currentContent.title[language]}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-dark/70 leading-relaxed mb-6" 
                 style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                {currentContent.description[language]}
              </p>
            </div>
            
            {/* Email input form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentContent.placeholder[language]}
                  className="w-full px-4 py-3 bg-white/90 border border-white/95 rounded-full text-dark placeholder-dark/50 focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-white transition-all backdrop-blur-sm shadow-sm"
                  style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-white/90 text-dark font-semibold rounded-full transition-all hover:bg-white border border-white/95 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-dark/20"
                style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
              >
                {currentContent.cta[language]}
              </motion.button>
            </form>
            
            {/* Trust indicator */}
            <p className="text-xs text-dark/40 text-center mt-3" 
               style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
              {language === 'de' ? 'Kein Spam. Nur die guten Sachen.' : 'No spam. Just the good stuff.'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}