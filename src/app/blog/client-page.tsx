'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog/types';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogPostView from '@/components/blog/BlogPostView';
import FilterButton from '@/components/blog/FilterButton';
import LaunchSoon from '@/components/LaunchSoon';
import { useLanguage } from '@/contexts/LanguageContext';
import { SemanticLayout, SemanticSection } from '@/components/layout/SemanticLayout';
import { PageTitle } from '@/components/seo/HeadingHierarchy';
import { generateBlogSchema } from '@/lib/seo/structured-data';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

interface BlogClientPageProps {
  initialPosts: BlogPost[];
}

export default function BlogClientPage({ initialPosts }: BlogClientPageProps) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generate blog schema for SEO
  const blogSchema = generateBlogSchema();
  // Scroll position restoration on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).blogScrollPositions?.['/blog']) {
      const scrollY = (window as any).blogScrollPositions['/blog'];
      // Immediate scroll restoration for seamless experience
      window.scrollTo(0, scrollY);
      // Clean up after scroll is restored
      setTimeout(() => {
        delete (window as any).blogScrollPositions['/blog'];
      }, 100);
    }
  }, []);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Create filter options from posts
  const filterOptions = useMemo(() => {
    // Categories based on content type
    // Tag translations
    const getTagLabel = (tag: string) => {
      if (language === 'de') {
        const translations: { [key: string]: string } = {
          'Travel': 'Reisen',
          'Nomad': 'Nomade'
        };
        return translations[tag] || tag;
      }
      return tag;
    };

    const categories = [
      { 
        id: 'travel', 
        label: getTagLabel('Travel'), 
        count: posts.filter(post => 
          post.slug.includes('bangkok-street-food') || 
          post.slug.includes('medellin') || 
          post.title.toLowerCase().includes('adventure')
        ).length 
      },
      { 
        id: 'nomad', 
        label: getTagLabel('Nomad'), 
        count: posts.filter(post => 
          post.slug.includes('digital-nomad') || 
          post.tags.some(tag => tag.includes('nomad') || tag.includes('work'))
        ).length 
      }
    ];

    // Countries for location-based filtering
    const countries = [...new Set(posts.map(post => 
      post.slug.includes('thailand') ? 'Thailand' : 
      post.slug.includes('colombia') ? 'Colombia' : 'Germany'
    ))];
    
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

    const countryFilters = countries.map(country => ({
      id: country.toLowerCase(),
      label: getCountryLabel(country),
      count: posts.filter(post => {
        const postCountry = post.slug.includes('thailand') ? 'Thailand' : 
                           post.slug.includes('colombia') ? 'Colombia' : 'Germany';
        return postCountry === country;
      }).length
    }));

    return [...categories.filter(cat => cat.count > 0), ...countryFilters];
  }, [posts, language]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(post => {
        const postCountry = (post.slug.includes('thailand') ? 'thailand' : 
                            post.slug.includes('colombia') ? 'colombia' : 'germany');
        
        const isTravel = post.slug.includes('bangkok-street-food') || 
                        post.slug.includes('medellin') || 
                        post.title.toLowerCase().includes('adventure');
        
        const isNomad = post.slug.includes('digital-nomad') || 
                       post.tags.some(tag => tag.includes('nomad') || tag.includes('work'));
        
        return selectedFilters.some(filter => 
          filter === postCountry || 
          (filter === 'travel' && isTravel) ||
          (filter === 'nomad' && isNomad)
        );
      });
    }

    return filtered;
  }, [searchQuery, posts, selectedFilters]);

  // Override global CSS for dark theme
  useEffect(() => {
    document.body.style.setProperty('background-color', '#1a1a1a', 'important');
    document.body.style.setProperty('color', '#ffffff', 'important');
    
    return () => {
      document.body.style.setProperty('background-color', '#F1EDE4', 'important');
      document.body.style.setProperty('color', '#141413', 'important');
    };
  }, []);


  // Show launch message if no posts
  if (posts.length === 0) {
    return (
      <SemanticLayout pageType="blog" pageTitle="Blog - Travel Stories & Digital Nomad Adventures">
        <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <LaunchSoon type="blog" />
        </div>
      </SemanticLayout>
    );
  }

  return (
    <>
      {/* Blog Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema, null, 2)
        }}
      />
      
      <SemanticLayout pageType="blog" pageTitle="Blog - Travel Stories & Digital Nomad Adventures">
        <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          {/* Breadcrumb Navigation */}
          <div className="relative z-10 pt-8 px-4 sm:px-8">
            <div className="w-full max-w-7xl mx-auto">
              <Breadcrumbs 
                items={[
                  { name: 'Home', href: '/', position: 1 },
                  { name: 'Blog', position: 2, isCurrentPage: true }
                ]}
                variant="rich"
                className="mb-6"
              />
            </div>
          </div>
          
          {/* Page Title - Hidden but accessible */}
          <PageTitle className="sr-only">
            Travel Blog - Digital Nomad Stories & Adventures
          </PageTitle>
          
          {/* Blog Content Section */}
          <SemanticSection 
            sectionType="primary" 
            id="blog-content"
            ariaLabel="Blog posts and search"
            className="relative z-0 flex flex-col items-center justify-start min-h-screen pt-8 px-4 sm:px-8 pb-16"
          >
            {/* Search and Filter Controls */}
            <SemanticSection 
              sectionType="secondary"
              id="blog-controls"
              ariaLabel="Search and filter blog posts"
              className="w-full max-w-7xl mx-auto mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                  className="flex items-center gap-3"
                  role="search"
                  aria-label="Blog search and filters"
                >
                  <BlogSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                  <FilterButton 
                    filters={filterOptions}
                    selectedFilters={selectedFilters}
                    onFilterChange={setSelectedFilters}
                  />
                </div>
              </div>
            </SemanticSection>

            {/* Blog Posts Grid */}
            <SemanticSection 
              sectionType="primary"
              id="blog-posts"
              ariaLabel={`${filteredPosts.length} blog posts`}
              className="w-full max-w-7xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                role="feed"
                aria-label="Blog posts feed"
                aria-live="polite"
                aria-busy="false"
              >
                <BlogGrid posts={filteredPosts} />
              </motion.div>
            </SemanticSection>
          </SemanticSection>
        </div>
      </SemanticLayout>
    </>
  );
}