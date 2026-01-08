'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GalleryItem } from '@/lib/gallery/types';
import { listGalleryItems } from '@/lib/gallery/index';
import NewGalleryGrid from '@/components/gallery/NewGalleryGrid';
import GallerySearch from '@/components/gallery/GallerySearch';
import FilterButton from '@/components/gallery/FilterButton';
import ImageProtection from '@/components/gallery/ImageProtection';
import LaunchSoon from '@/components/LaunchSoon';
import { useLanguage } from '@/contexts/LanguageContext';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

interface GalleryClientPageProps {
  initialItems: GalleryItem[];
}

export default function GalleryClientPage({ initialItems }: GalleryClientPageProps) {
  const { language } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Enhanced scroll position restoration with delay for better UX
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScrollY = (window as any).galleryScrollPositions?.['/gallery'];
      if (savedScrollY) {
        // Immediate restoration for instant feedback
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
        
        // Additional restoration after content loads
        const restoreScroll = () => {
          window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
        };
        
        // Multiple restore attempts for reliability
        setTimeout(restoreScroll, 50);
        setTimeout(restoreScroll, 200);
        setTimeout(restoreScroll, 500);
        
        // Clean up after successful restoration
        setTimeout(() => {
          delete (window as any).galleryScrollPositions['/gallery'];
        }, 1000);
      }
    }
  }, []);

  // Save scroll position when component unmounts (user navigates away)
  useEffect(() => {
    const saveScrollPosition = () => {
      if (typeof window !== 'undefined') {
        if (!(window as any).galleryScrollPositions) {
          (window as any).galleryScrollPositions = {};
        }
        (window as any).galleryScrollPositions['/gallery'] = window.scrollY;
      }
    };

    // Save on scroll with throttling for performance
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      saveScrollPosition(); // Final save on unmount
    };
  }, []);

  // Create filter options from items
  const filterOptions = useMemo(() => {
    // Countries for location-based filtering
    const countries = [...new Set(items.map(item => item.country))];
    
    // Country translations
    const getCountryLabel = (country: string) => {
      if (language === 'de') {
        const translations: { [key: string]: string } = {
          'Germany': 'Deutschland',
          'Thailand': 'Thailand',
          'Colombia': 'Kolumbien'
        };
        return translations[country] || country;
      }
      return country;
    };
    
    return countries.map(country => ({
      id: country.toLowerCase(),
      label: getCountryLabel(country),
      count: items.filter(item => item.country === country).length
    }));
  }, [items, language]);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(item => 
        selectedFilters.includes(item.country.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, items, selectedFilters]);

  // Override global CSS for dark theme
  useEffect(() => {
    document.body.style.setProperty('background-color', '#1a1a1a', 'important');
    document.body.style.setProperty('color', '#ffffff', 'important');
    
    return () => {
      document.body.style.setProperty('background-color', '#F1EDE4', 'important');
      document.body.style.setProperty('color', '#141413', 'important');
    };
  }, []);

  // Show launch message if no items
  if (items.length === 0) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
        <LaunchSoon type="gallery" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Breadcrumb Navigation */}
      <div className="relative z-10 pt-8 px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <Breadcrumbs 
            items={[
              { name: 'Home', href: '/', position: 1 },
              { name: 'Gallery', position: 2, isCurrentPage: true }
            ]}
            variant="rich"
            className="mb-6"
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-0 flex flex-col items-center justify-start min-h-screen px-4 sm:px-8 pb-16">
        
        {/* Search and filter controls - positioned like cards */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <GallerySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <FilterButton 
                filters={filterOptions}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
              />
            </div>
          </div>
        </div>

        {/* Gallery grid with stagger animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-7xl mx-auto"
        >
          <NewGalleryGrid items={filteredItems} />
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">📸</div>
            <h3 className="text-2xl font-medium text-white mb-3">
              No memories found
            </h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No images match "${searchQuery}". Try a different search term.`
                : 'Memories are being captured around the world. Check back soon.'
              }
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl 
                           backdrop-blur-xl border border-white/20 transition-all duration-200
                           font-medium tracking-wide"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Image Protection */}
      <ImageProtection />
    </div>
  );
}