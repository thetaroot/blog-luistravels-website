'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ActionButtonsProps {
  onStoryClick: () => void;
  onDownloadClick: () => void;
  hasStory?: boolean;
  blogPostSlug?: string;
}

export default function ActionButtons({ onStoryClick, onDownloadClick, hasStory = true, blogPostSlug }: ActionButtonsProps) {
  const [hoveredButton, setHoveredButton] = useState<'story' | 'download' | null>(null);

  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-3 z-30">
      {/* Story Button - only show if blogPostSlug exists */}
      {blogPostSlug && (
        <motion.button
          onClick={onStoryClick}
          onMouseEnter={() => setHoveredButton('story')}
          onMouseLeave={() => setHoveredButton(null)}
          className="relative flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 
                     rounded-full transition-all duration-300 group overflow-hidden"
          style={{ pointerEvents: 'auto' }}
          animate={{
            width: hoveredButton === 'story' ? 120 : hoveredButton === 'download' ? 36 : 48,
            height: hoveredButton === 'story' ? 48 : hoveredButton === 'download' ? 36 : 48,
            x: hoveredButton === 'download' ? -8 : 0,
            scale: hoveredButton === 'download' ? 0.8 : 1
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            duration: 0.3
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{
              x: hoveredButton === 'story' ? -35 : 0,
              scale: hoveredButton === 'story' ? 1.1 : 1
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <DocumentTextIcon className="w-5 h-5 text-white group-hover:text-white/90" />
          </motion.div>
          
          {/* Text that slides in */}
          <AnimatePresence>
            {hoveredButton === 'story' && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="absolute right-4 text-white text-sm font-medium tracking-wide"
              >
                Story
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0"
            animate={{
              opacity: hoveredButton === 'story' ? 1 : 0,
              scale: hoveredButton === 'story' ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}

      {/* Download Button */}
      <motion.button
        onClick={onDownloadClick}
        onMouseEnter={() => setHoveredButton('download')}
        onMouseLeave={() => setHoveredButton(null)}
        className="relative flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 
                   rounded-full transition-all duration-300 group overflow-hidden"
        style={{ pointerEvents: 'auto' }}
        animate={{
          width: hoveredButton === 'download' ? 140 : hoveredButton === 'story' ? 36 : 48,
          height: hoveredButton === 'download' ? 48 : hoveredButton === 'story' ? 36 : 48,
          x: hoveredButton === 'story' ? 8 : 0,
          scale: hoveredButton === 'story' ? 0.8 : 1
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          duration: 0.3
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{
            x: hoveredButton === 'download' ? -45 : 0,
            scale: hoveredButton === 'download' ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <ArrowDownTrayIcon className="w-5 h-5 text-white group-hover:text-white/90" />
        </motion.div>
        
        {/* Text that slides in */}
        <AnimatePresence>
          {hoveredButton === 'download' && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute right-4 text-white text-sm font-medium tracking-wide"
            >
              Download
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full opacity-0"
          animate={{
            opacity: hoveredButton === 'download' ? 1 : 0,
            scale: hoveredButton === 'download' ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
}