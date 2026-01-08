'use client';

import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function BlogSearch({ searchQuery, setSearchQuery }: BlogSearchProps) {
  const { language } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex-1"
    >
      <div className="relative group">
        {/* Apple-style background */}
        <motion.div 
          className="absolute inset-0 bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12
                          transition-all duration-200 group-hover:bg-white/12 group-focus-within:bg-white/15
                          group-focus-within:border-white/25 group-focus-within:shadow-2xl
                          group-focus-within:shadow-white/10 pointer-events-none"
          whileHover={{ scale: 1.02 }}
        />
        
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-4 sm:left-5 w-4 h-4 sm:w-5 sm:h-5 text-white/60 z-10 
                                         group-focus-within:text-white/80 transition-colors duration-200" />
          <input
            type="text"
            placeholder={language === 'de' ? 'Durchsuche Erinnerungen...' : 'Search my memories...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-transparent text-white placeholder-white/50 
                       focus:outline-none text-sm sm:text-base font-medium tracking-wide
                       group-focus-within:placeholder-white/70 relative z-20"
            autoComplete="off"
          />
        </div>
        
        {/* Apple-style inner shadow */}
        <div className="absolute inset-0 rounded-2xl 
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]
                        pointer-events-none" />
        
        {/* Glow effect on focus */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 
                        rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 
                        -z-10 blur-xl" />
      </div>
    </motion.div>
  );
}