'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { GalleryItem } from '@/lib/gallery/types';

interface GalleryGridProps {
  images: GalleryItem[];
  onImageClick: (image: GalleryItem) => void;
}

export default function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Replace with placeholder if image doesn't exist
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzgwODA4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbWluZyBTb29uPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTglIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2MDYwNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5OXPC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <motion.div
          key={image.slug}
          layoutId={`gallery-image-${image.slug}`}
          onClick={() => onImageClick(image)}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: 0.6,
            delay: Math.min(index * 0.1, 1.5) // Cap delay at 1.5s
          }}
          className="group cursor-pointer perspective-1000"
          whileHover={{ 
            scale: 1.02,
            y: -8,
            transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
          }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            perspective: '1200px',
            transformStyle: 'preserve-3d' 
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Main image card */}
            <div
              className="relative aspect-square overflow-hidden rounded-[20px] 
                         bg-white/5 backdrop-blur-sm border border-white/10
                         group-hover:border-white/20 transition-all duration-500"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  0 8px 32px -8px rgba(0, 0, 0, 0.4),
                  0 20px 60px -12px rgba(0, 0, 0, 0.25)
                `,
                backdropFilter: 'saturate(120%)',
                transform: 'translateZ(15px)',
              }}
            >
              {/* Image */}
              <Image
                src={image.imageSrc}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={handleImageError}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                priority={index < 8} // Prioritize first 8 images
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Location info - appears on hover */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 text-white
                           transform translate-y-full group-hover:translate-y-0 
                           transition-transform duration-300 ease-out"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                }}
              >
                <div className="font-semibold text-sm tracking-wide">
                  {image.country}
                </div>
                <div className="text-white/80 text-xs font-medium capitalize mt-1">
                  {image.location}
                </div>
              </motion.div>

              {/* Floating glow effect */}
              <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 
                             transition-opacity duration-700 pointer-events-none"
                   style={{
                     background: `
                       radial-gradient(600px circle at 50% 50%, 
                         rgba(255, 255, 255, 0.1) 0%, 
                         rgba(255, 255, 255, 0.05) 40%, 
                         transparent 80%
                       )
                     `,
                   }} />
            </div>

            {/* 3D depth layer */}
            <div
              className="absolute inset-0 bg-white/3 rounded-[20px] border border-white/5"
              style={{
                transform: 'translateZ(-8px) scale(0.98)',
                filter: 'blur(0.5px)',
                opacity: 0.6,
              }}
            />

            {/* Deepest shadow layer */}
            <div
              className="absolute inset-0 bg-black/20 rounded-[20px]"
              style={{
                transform: 'translateZ(-16px) scale(0.95)',
                filter: 'blur(4px)',
                opacity: 0.4,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}