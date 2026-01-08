'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BlogPost } from '@/lib/blog/types';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

// Store scroll position globally for restoration
if (typeof window !== 'undefined') {
  (window as any).blogScrollPositions = {};
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const router = useRouter();
  const [isRecentlyViewed, setIsRecentlyViewed] = useState(false);
  
  // Check if this card was recently viewed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recentCard = (window as any).recentlyViewedCard;
      if (recentCard === post.slug) {
        setIsRecentlyViewed(true);
        // Clear highlight after animation
        setTimeout(() => {
          setIsRecentlyViewed(false);
          delete (window as any).recentlyViewedCard;
        }, 3000);
      }
    }
  }, [post.slug]);
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Store current scroll position and card position
    if (typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Store both scroll position and card position
      (window as any).blogScrollPositions = {
        '/blog': scrollY,
        [`/blog/${post.slug}`]: {
          scrollY,
          cardPosition: {
            top: rect.top + scrollY,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + scrollY + rect.height / 2
          }
        }
      };
      
      // Mark this card as recently viewed for highlighting
      (window as any).recentlyViewedCard = post.slug;
    }
    
    // Navigate to individual post page
    router.push(`/blog/${post.slug}`);
  };

  return (
    <motion.div
      layoutId={`card-${post.slug}`}
      onClick={handleClick}
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
        overflow: 'hidden' // Prevent border radius overflow
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          borderRadius: '28px !important'
        }}
      >
        {/* Main card with 3D blurgy background - brighter and more blurry */}
        <motion.div
          className="relative bg-warm-white/50 backdrop-blur-2xl p-8 h-96 !rounded-[28px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(241, 237, 228, 0.70) 0%, rgba(241, 237, 228, 0.60) 50%, rgba(241, 237, 228, 0.55) 100%)`,
            boxShadow: `0 0 0 1px rgba(241, 237, 228, 0.3), 0 8px 32px -8px rgba(20, 20, 19, 0.25), 0 20px 60px -12px rgba(20, 20, 19, 0.12)`,
            backdropFilter: 'blur(24px) saturate(180%)',
            transform: 'translateZ(20px)',
            borderRadius: '28px !important', // Force border radius always
            minHeight: '384px'
          }}
          animate={{
            boxShadow: isRecentlyViewed 
              ? '0 0 0 2px rgba(59, 130, 246, 0.4), 0 0 25px rgba(59, 130, 246, 0.2), 0 8px 32px -8px rgba(20, 20, 19, 0.25)'
              : '0 0 0 1px rgba(241, 237, 228, 0.3), 0 8px 32px -8px rgba(20, 20, 19, 0.25), 0 20px 60px -12px rgba(20, 20, 19, 0.12)',
            scale: isRecentlyViewed ? [1, 1.02, 1] : 1
          }}
          whileHover={{
            background: `linear-gradient(135deg, rgba(241, 237, 228, 0.85) 0%, rgba(241, 237, 228, 0.75) 50%, rgba(241, 237, 228, 0.70) 100%)`,
            boxShadow: '0 0 0 1px rgba(241, 237, 228, 0.4), 0 12px 40px -8px rgba(20, 20, 19, 0.35), 0 25px 70px -12px rgba(20, 20, 19, 0.18)'
          }}
          transition={{
            duration: isRecentlyViewed ? 1.5 : 0.3,
            repeat: isRecentlyViewed ? 3 : 0,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Glossy surface layer with forced border radius */}
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
              {/* Date with white button styling */}
              <div className="inline-flex items-center px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/95 text-sm text-dark font-semibold mb-3 shadow-sm">
                {new Date(post.date).toLocaleDateString('de-DE')}
              </div>
              
              {/* Tags - moved under date, above title */}
              <div className="flex gap-2 mb-4">
                {post.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/85 backdrop-blur-sm text-dark/80 rounded-full text-xs font-semibold border border-white/90 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-dark mb-3 leading-tight">
                {post.title}
              </h2>
              
              {/* Excerpt */}
              <p className="text-dark/70 text-base leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>
            
            {/* Footer - no arrow */}
            <div className="pt-4">
              <div className="text-sm text-dark/50 font-medium">
                Read more
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}