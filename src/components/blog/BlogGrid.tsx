'use client';

import { AnimatePresence } from 'framer-motion';
import { BlogPost } from '@/lib/blog/types';
import BlogCard from './BlogCard';
import EmailCaptureCard from './EmailCaptureCard';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  // Create array with email capture card strategically placed
  const createGridItems = () => {
    const items: Array<{ type: 'post' | 'email'; data: BlogPost | null; index: number }> = [];
    
    posts.forEach((post, index) => {
      items.push({ type: 'post', data: post, index });
      
      // Insert email capture after 2nd post (index 1) if we have at least 3 posts
      if (index === 1 && posts.length >= 3) {
        items.push({ type: 'email', data: null, index: index + 1 });
      }
    });
    
    return items;
  };

  const gridItems = createGridItems();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {gridItems.map((item, displayIndex) => {
          if (item.type === 'email') {
            return (
              <EmailCaptureCard 
                key="email-capture" 
                index={displayIndex}
                variant="behind-scenes"
              />
            );
          }
          
          return (
            <BlogCard 
              key={item.data!.slug} 
              post={item.data!} 
              index={displayIndex} 
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}