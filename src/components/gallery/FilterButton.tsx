'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AdjustmentsHorizontalIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterButtonProps {
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export default function FilterButton({ filters, selectedFilters, onFilterChange }: FilterButtonProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      onFilterChange(selectedFilters.filter(id => id !== filterId));
    } else {
      onFilterChange([...selectedFilters, filterId]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
    setIsOpen(false);
  };

  return (
    <motion.div 
      className="relative flex-shrink-0" 
      ref={dropdownRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Filter button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4 
                   bg-white/8 backdrop-blur-2xl rounded-2xl border transition-all duration-200
                   ${isOpen || selectedFilters.length > 0 
                     ? 'border-white/25 bg-white/15' 
                     : 'border-white/12 hover:bg-white/12'
                   }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AdjustmentsHorizontalIcon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
          selectedFilters.length > 0 ? 'text-white' : 'text-white/60'
        }`} />
        
        {/* Badge for mobile */}
        {selectedFilters.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full 
                       flex items-center justify-center text-xs font-bold text-white"
          >
            {selectedFilters.length}
          </motion.div>
        )}

        {/* Apple-style inner shadow */}
        <div className="absolute inset-0 rounded-2xl 
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]
                        pointer-events-none" />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-full right-0 sm:left-0 mt-2 w-56 sm:w-64 bg-white/10 backdrop-blur-2xl rounded-2xl
                       border border-white/20 shadow-2xl shadow-black/20 overflow-hidden z-30"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{language === 'de' ? 'Filter' : 'Filters'}</span>
                {selectedFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {language === 'de' ? 'Alle löschen' : 'Clear all'}
                  </button>
                )}
              </div>
            </div>

            {/* Filter options */}
            <div className="py-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 
                             transition-colors duration-150 text-left"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedFilters.includes(filter.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-white/30 hover:border-white/50'
                    }`}>
                      {selectedFilters.includes(filter.id) && (
                        <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-white">{filter.label}</span>
                  </div>
                  {filter.count !== undefined && (
                    <span className="text-xs text-white/50 font-medium">{filter.count}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}