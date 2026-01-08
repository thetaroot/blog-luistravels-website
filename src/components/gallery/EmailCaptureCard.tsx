'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmailCaptureCardProps {
  index: number;
  variant?: 'photo-drops';
}

export default function EmailCaptureCard({ index, variant = 'photo-drops' }: EmailCaptureCardProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = {
    'photo-drops': {
      title: {
        de: 'Neue Fotos',
        en: 'Fresh Photo Drops'
      },
      description: {
        de: 'Neue Bilder bevor sie hier landen.',
        en: 'New photos before they land here.'
      },
      placeholder: {
        de: 'deine@email.com',
        en: 'your@email.com'
      },
      cta: {
        de: 'Früher Zugang →',
        en: 'First Access →'
      },
      success: {
        de: 'Nice! Check deine Mails 📸',
        en: 'Nice! Check your email 📸'
      }
    }
  };

  const currentContent = content[variant];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // TODO: Integrate with your email service
    console.log('Gallery email captured:', email);
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group cursor-pointer perspective-1000"
        style={{ aspectRatio: '1/1' }} // Same as GalleryCard - square aspect ratio
      >
        <div className="relative w-full h-full overflow-hidden aspect-square" style={{
          transformStyle: 'preserve-3d',
          borderRadius: '28px !important'
        }}>
          <motion.div
            className="relative bg-black !rounded-[28px] overflow-hidden h-full"
            style={{
              background: `linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.7) 50%, rgba(5, 150, 105, 0.5) 100%)`,
              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 20px 60px -12px rgba(0, 0, 0, 0.2)`,
              transform: 'translateZ(20px)',
              borderRadius: '28px !important',
              minHeight: '100%'
            }}
          >
            <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white text-lg font-medium"
              style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
            >
              {currentContent.success[language]}
            </motion.p>
            </div>
          </motion.div>
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
        className="relative overflow-hidden aspect-square"
        style={{
          transformStyle: 'preserve-3d',
          borderRadius: '28px !important'
        }}
      >
        {/* Main card with cinematic background - same structure as GalleryCard */}
        <motion.div
          className="relative bg-black !rounded-[28px] overflow-hidden h-full"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(25, 25, 112, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
            `,
            boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 20px 60px -12px rgba(0, 0, 0, 0.2)`,
            transform: 'translateZ(20px)',
            borderRadius: '28px !important',
            minHeight: '100%'
          }}
          whileHover={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(25, 25, 112, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 1) 100%)
            `,
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 12px 40px -8px rgba(0, 0, 0, 0.5), 0 25px 70px -12px rgba(0, 0, 0, 0.3)'
          }}
          transition={{
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Film grain texture */}
          <div 
            className="absolute inset-0 z-5 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-6">
          {/* Camera badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              {language === 'de' ? 'Foto Updates' : 'Photo Updates'}
            </span>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-3" 
                style={{ fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
              {currentContent.title[language]}
            </h3>
            
            <p className="text-sm text-white/80 leading-relaxed mb-6" 
               style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
              {currentContent.description[language]}
            </p>
          </div>
          
          {/* Email form - bottom area */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentContent.placeholder[language]}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
                required
              />
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white/20 text-white font-semibold rounded-2xl transition-all hover:bg-white/25 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
            >
              {currentContent.cta[language]}
            </motion.button>
          </form>
          </div>

          {/* Subtle hover overlay - same as GalleryCard */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.01) 100%)',
              borderRadius: '28px !important'
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}