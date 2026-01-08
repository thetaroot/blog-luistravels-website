'use client';

import { AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/lib/gallery/types';
import GalleryCard from './GalleryCard';
import EmailCaptureCard from './EmailCaptureCard';

interface NewGalleryGridProps {
  items: GalleryItem[];
}

export default function NewGalleryGrid({ items }: NewGalleryGridProps) {
  // Create array with email capture card strategically placed
  const createGridItems = () => {
    const gridItems: Array<{ type: 'photo' | 'email'; data: GalleryItem | null; index: number }> = [];
    
    items.forEach((item, index) => {
      gridItems.push({ type: 'photo', data: item, index });
      
      // Insert email capture after 1st photo (index 0) if we have at least 2 photos
      if (index === 0 && items.length >= 2) {
        gridItems.push({ type: 'email', data: null, index: index + 1 });
      }
    });
    
    return gridItems;
  };

  const gridItems = createGridItems();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {gridItems.map((item, displayIndex) => {
          if (item.type === 'email') {
            return (
              <EmailCaptureCard 
                key="gallery-email-capture" 
                index={displayIndex}
                variant="photo-drops"
              />
            );
          }
          
          return (
            <GalleryCard 
              key={item.data!.slug} 
              item={item.data!} 
              index={displayIndex} 
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}