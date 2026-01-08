'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/gallery/types';

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
}

// Store scroll position globally for restoration
if (typeof window !== 'undefined') {
  (window as any).galleryScrollPositions = {};
}

export default function GalleryCard({ item, index }: GalleryCardProps) {
  const router = useRouter();
  const [isRecentlyViewed, setIsRecentlyViewed] = useState(false);
  
  // Check if this card was recently viewed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recentCard = (window as any).recentlyViewedGalleryCard;
      if (recentCard === item.slug) {
        setIsRecentlyViewed(true);
        // Clear highlight after animation
        setTimeout(() => {
          setIsRecentlyViewed(false);
          delete (window as any).recentlyViewedGalleryCard;
        }, 3000);
      }
    }
  }, [item.slug]);
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Store current scroll position and card position
    if (typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Store both scroll position and card position
      (window as any).galleryScrollPositions = {
        '/gallery': scrollY,
        [`/gallery/${item.slug}`]: {
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
      (window as any).recentlyViewedGalleryCard = item.slug;
    }
    
    // Navigate to individual gallery page
    router.push(`/gallery/${item.slug}`);
  };

  return (
    <motion.div
      layoutId={`gallery-card-${item.slug}`}
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
        {/* Main card with image background - clean without blur */}
        <motion.div
          className="relative bg-black !rounded-[28px] overflow-hidden h-full"
          style={{
            background: `rgba(0, 0, 0, 1)`,
            boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 20px 60px -12px rgba(0, 0, 0, 0.2)`,
            transform: 'translateZ(20px)',
            borderRadius: '28px !important',
            minHeight: '100%'
          }}
          animate={{
            boxShadow: isRecentlyViewed 
              ? '0 0 0 2px rgba(59, 130, 246, 0.4), 0 0 25px rgba(59, 130, 246, 0.2), 0 8px 32px -8px rgba(0, 0, 0, 0.4)'
              : '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 20px 60px -12px rgba(0, 0, 0, 0.2)',
            scale: isRecentlyViewed ? [1, 1.02, 1] : 1
          }}
          whileHover={{
            background: `rgba(0, 0, 0, 1)`,
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 12px 40px -8px rgba(0, 0, 0, 0.5), 0 25px 70px -12px rgba(0, 0, 0, 0.3)'
          }}
          transition={{
            duration: isRecentlyViewed ? 1.5 : 0.3,
            repeat: isRecentlyViewed ? 3 : 0,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Main image - fill the entire card */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 6}
            />
            
            
          </div>
          
          {/* Subtle hover overlay */}
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