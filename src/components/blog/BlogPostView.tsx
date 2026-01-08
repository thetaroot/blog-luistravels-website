'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';
import { BlogPost } from '@/lib/blog/types';

interface BlogPostViewProps {
  post: BlogPost;
  onClose: () => void;
}

export default function BlogPostView({ post, onClose }: BlogPostViewProps) {
  // Sanitize HTML content for security (only in browser)
  const sanitizedContent = typeof window !== 'undefined' ? DOMPurify.sanitize(post.content) : post.content;

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      {/* Blurred background showing underlying page */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
      
      {/* Expanding card animation */}
      <motion.div
        layoutId={`card-${post.slug}`}
        className="absolute inset-4 md:inset-8 lg:inset-16"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
          className="relative w-full h-full bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 
                     overflow-hidden flex flex-col"
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm 
                       border border-white/20 text-white/80 hover:text-white hover:bg-white/20 
                       transition-all duration-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </motion.button>

          {/* Header with floating orbs */}
          <div className="relative px-8 py-12 border-b border-white/10">
            {/* Background orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/10 
                                rounded-full border border-white/20">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <div className="flex gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs text-gray-400 bg-white/5 rounded-full border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <motion.h1
                layoutId={`blog-post-title-${post.slug}`}
                className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight"
              >
                {post.title}
              </motion.h1>
            </motion.div>
          </div>

          {/* Content area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex-1 overflow-y-auto p-8"
          >
            <div 
              className="prose prose-lg prose-invert max-w-none
                         prose-headings:text-white prose-headings:font-light prose-headings:tracking-tight
                         prose-p:text-gray-300 prose-p:leading-relaxed prose-p:font-light
                         prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
                         prose-strong:text-white prose-strong:font-medium
                         prose-ul:text-gray-300 prose-ol:text-gray-300
                         prose-li:marker:text-gray-500"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </motion.div>

          {/* Footer with action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="px-8 py-6 border-t border-white/10 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm 
                           rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Share Story
              </motion.button>
              <span className="text-sm text-gray-400">
                {post.excerpt}
              </span>
            </div>
          </motion.div>

          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent 
                          rounded-3xl pointer-events-none" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}