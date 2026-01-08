'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { GalleryItem } from '@/lib/gallery/types';

interface GalleryLightboxProps {
  image: GalleryItem;
  onClose: () => void;
  allImages: GalleryItem[];
  onNavigate: (image: GalleryItem) => void;
}

export default function GalleryLightbox({ image, onClose, allImages, onNavigate }: GalleryLightboxProps) {
  const currentIndex = allImages.findIndex(img => img.slug === image.slug);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(allImages[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allImages.length - 1) {
      onNavigate(allImages[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages, onClose, onNavigate]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTUxNTE1Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzgwODA4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1OCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzYwNjA2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbWluZyBTb29uIDxzcGFuIHN0eWxlPSJmb250LXNpemU6MjBweDsiPvCfk5c8L3NwYW4+PC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl
                   text-white rounded-full flex items-center justify-center transition-all duration-200
                   border border-white/20 hover:border-white/30 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <XMarkIcon className="w-6 h-6" />
      </motion.button>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 
                     backdrop-blur-xl text-white rounded-full flex items-center justify-center 
                     transition-all duration-200 border border-white/20 hover:border-white/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </motion.button>
      )}

      {currentIndex < allImages.length - 1 && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 
                     backdrop-blur-xl text-white rounded-full flex items-center justify-center 
                     transition-all duration-200 border border-white/20 hover:border-white/30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </motion.button>
      )}

      {/* Image container */}
      <motion.div
        className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Main image */}
          <Image
            src={image.imageSrc}
            alt={image.title}
            width={1200}
            height={900}
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            onError={handleImageError}
            priority
          />

          {/* Image info overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                       rounded-b-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1">{image.title}</h3>
                <p className="text-white/80 capitalize font-medium">{image.location}</p>
              </div>
              <div className="text-white/60 text-sm font-medium">
                {currentIndex + 1} / {allImages.length}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Progress indicator */}
      {allImages.length > 1 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(allImages[index]);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}