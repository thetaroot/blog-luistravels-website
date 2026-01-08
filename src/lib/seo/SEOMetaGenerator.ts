/**
 * SEO Meta Generator - PHASE 5 SEO-PERFECTION-2025
 * Advanced meta tag generation with AI-powered optimization and multi-language support
 */

import { BlogPost, EntityMention } from '@/lib/blog/types'

interface SEOMetaTags {
  title: string
  description: string
  keywords: string
  canonical: string
  openGraph: {
    title: string
    description: string
    image: string
    url: string
    type: string
    siteName: string
    locale: string
    alternateLocales?: string[]
  }
  twitter: {
    card: string
    title: string
    description: string
    image: string
    creator: string
    site: string
  }
  additional: { [key: string]: string }
}

interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultImage: string
  twitterHandle: string
  authorName: string
  defaultLocale: string
  supportedLocales: string[]
  brandKeywords: string[]
}

export class SEOMetaGenerator {
  private config: SEOConfig
  private locationKeywords: Map<string, string[]> = new Map()
  private categoryKeywords: Map<string, string[]> = new Map()

  constructor(config: SEOConfig) {
    this.config = config
    this.initializeKeywordMaps()
  }

  /**
   * Generate comprehensive SEO meta tags for a blog post
   */
  generateMetaTags(post: BlogPost, options?: {
    includeEntityKeywords?: boolean
    optimizeForLocal?: boolean
    customKeywords?: string[]
  }): SEOMetaTags {
    console.log(`🔍 Generating SEO meta tags for: ${post.title}`)

    const opts = {
      includeEntityKeywords: true,
      optimizeForLocal: true,
      ...options
    }

    // Generate optimized title
    const title = this.generateOptimizedTitle(post)
    
    // Generate compelling description
    const description = this.generateOptimizedDescription(post)
    
    // Generate strategic keywords
    const keywords = this.generateStrategicKeywords(post, opts)
    
    // Generate Open Graph data
    const openGraph = this.generateOpenGraphTags(post, title, description)
    
    // Generate Twitter Card data
    const twitter = this.generateTwitterCardTags(post, title, description)
    
    // Generate additional meta tags
    const additional = this.generateAdditionalMetaTags(post, opts)

    return {
      title,
      description,
      keywords,
      canonical: `${this.config.siteUrl}/blog/${post.slug}`,
      openGraph,
      twitter,
      additional
    }
  }

  /**
   * Generate optimized title with target keyword placement
   */
  private generateOptimizedTitle(post: BlogPost): string {
    let title = post.title
    
    // Check if title needs optimization
    if (title.length > 60) {
      // Truncate but keep important keywords
      const importantWords = this.extractImportantWords(title)
      title = this.reconstructOptimalTitle(title, importantWords, 55)
    }

    // Add location if available and not already present
    if (post.location && !title.toLowerCase().includes(post.location.toLowerCase())) {
      if (title.length + post.location.length + 3 <= 60) {
        title = `${title} - ${post.location}`
      }
    }

    // Add brand if space allows
    const brandSuffix = ` | ${this.config.siteName}`
    if (title.length + brandSuffix.length <= 60) {
      title += brandSuffix
    }

    return title
  }

  /**
   * Generate compelling meta description
   */
  private generateOptimizedDescription(post: BlogPost): string {
    let description = post.excerpt

    // If excerpt is too short or long, optimize it
    if (description.length < 120 || description.length > 160) {
      description = this.optimizeDescription(post)
    }

    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(description)) {
      description += '.'
    }

    // Add location context if available
    if (post.location && !description.toLowerCase().includes(post.location.toLowerCase())) {
      const locationPhrase = ` Experience ${post.location} like a local.`
      if (description.length + locationPhrase.length <= 160) {
        description += locationPhrase
      }
    }

    return description.substring(0, 160)
  }

  /**
   * Generate strategic keyword combination
   */
  private generateStrategicKeywords(post: BlogPost, options: {
    includeEntityKeywords?: boolean
    optimizeForLocal?: boolean
    customKeywords?: string[]
  }): string {
    const keywords: string[] = []

    // Core post tags
    keywords.push(...post.tags)

    // Category keywords
    if (post.category) {
      const categoryKeywords = this.categoryKeywords.get(post.category.toLowerCase()) || []
      keywords.push(...categoryKeywords)
    }

    // Location-based keywords
    if (options.optimizeForLocal && post.location) {
      const locationKeywords = this.locationKeywords.get(post.location.toLowerCase()) || []
      keywords.push(...locationKeywords)
      
      // Add "in [location]" variations
      post.tags.forEach(tag => {
        keywords.push(`${tag} in ${post.location}`)
      })
    }

    // Entity-based keywords
    if (options.includeEntityKeywords && post.entities) {
      const entityKeywords = this.extractEntityKeywords(post.entities)
      keywords.push(...entityKeywords)
    }

    // Long-tail keywords
    const longTailKeywords = this.generateLongTailKeywords(post)
    keywords.push(...longTailKeywords)

    // Custom keywords
    if (options.customKeywords) {
      keywords.push(...options.customKeywords)
    }

    // Brand keywords
    keywords.push(...this.config.brandKeywords)

    // Remove duplicates and return as comma-separated string
    const uniqueKeywords = [...new Set(keywords)]
      .filter(keyword => keyword.length > 2)
      .slice(0, 20) // Limit to top 20 keywords

    return uniqueKeywords.join(', ')
  }

  /**
   * Generate Open Graph meta tags
   */
  private generateOpenGraphTags(post: BlogPost, title: string, description: string): SEOMetaTags['openGraph'] {
    const image = this.selectBestImage(post)
    
    return {
      title: title.replace(` | ${this.config.siteName}`, ''), // Remove site name for OG
      description,
      image,
      url: `${this.config.siteUrl}/blog/${post.slug}`,
      type: 'article',
      siteName: this.config.siteName,
      locale: post.language === 'de' ? 'de_DE' : 'en_US',
      ...(this.config.supportedLocales.length > 1 && {
        alternateLocales: this.config.supportedLocales
          .filter(locale => locale !== (post.language === 'de' ? 'de_DE' : 'en_US'))
      })
    }
  }

  /**
   * Generate Twitter Card meta tags
   */
  private generateTwitterCardTags(post: BlogPost, title: string, description: string): SEOMetaTags['twitter'] {
    const image = this.selectBestImage(post)
    
    return {
      card: 'summary_large_image',
      title: title.replace(` | ${this.config.siteName}`, ''),
      description,
      image,
      creator: this.config.twitterHandle,
      site: this.config.twitterHandle
    }
  }

  /**
   * Generate additional meta tags for enhanced SEO
   */
  private generateAdditionalMetaTags(post: BlogPost, options: {
    optimizeForLocal?: boolean
  }): { [key: string]: string } {
    const metaTags: { [key: string]: string } = {}

    // Article-specific tags
    metaTags['article:published_time'] = post.date
    if (post.modifiedDate) {
      metaTags['article:modified_time'] = post.modifiedDate
    }
    metaTags['article:author'] = this.config.authorName
    metaTags['article:section'] = post.category || 'Travel'
    
    // Tags as article tags
    post.tags.forEach((tag, index) => {
      metaTags[`article:tag${index + 1}`] = tag
    })

    // Language and locale
    metaTags['language'] = post.language
    metaTags['content-language'] = post.language

    // Geographic meta tags
    if (options.optimizeForLocal && post.location) {
      metaTags['geo.region'] = this.getRegionCode(post.location)
      metaTags['geo.placename'] = post.location
      
      if (post.coordinates) {
        const [lat, lng] = post.coordinates.split(',')
        metaTags['geo.position'] = `${lat};${lng}`
        metaTags['ICBM'] = `${lat}, ${lng}`
      }
    }

    // Content classification
    metaTags['rating'] = 'general'
    metaTags['robots'] = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    
    // Mobile optimization
    metaTags['viewport'] = 'width=device-width, initial-scale=1'
    metaTags['mobile-web-app-capable'] = 'yes'
    metaTags['apple-mobile-web-app-capable'] = 'yes'

    // Performance hints
    metaTags['dns-prefetch'] = 'true'
    
    // Reading time
    if (post.readingTime) {
      metaTags['estimated-time'] = `${post.readingTime} minutes`
    }

    // Schema.org microdata
    metaTags['schema:name'] = post.title
    metaTags['schema:description'] = post.excerpt
    metaTags['schema:image'] = this.selectBestImage(post)

    return metaTags
  }

  /**
   * Generate meta tags for category/archive pages
   */
  generateCategoryMetaTags(category: string, posts: BlogPost[]): SEOMetaTags {
    const title = `${category} Travel Guides & Stories | ${this.config.siteName}`
    const description = `Discover ${category.toLowerCase()} travel experiences, cultural insights, and practical guides. ${posts.length} stories from local adventures.`
    
    // Extract common locations from posts
    const locations = [...new Set(posts.map(p => p.location).filter(Boolean))]
    const keywords = [
      category,
      `${category} travel`,
      `${category} guide`,
      ...locations.map(loc => `${category} ${loc}`),
      ...this.config.brandKeywords
    ].join(', ')

    return {
      title,
      description,
      keywords,
      canonical: `${this.config.siteUrl}/category/${category.toLowerCase()}`,
      openGraph: {
        title,
        description,
        image: this.config.defaultImage,
        url: `${this.config.siteUrl}/category/${category.toLowerCase()}`,
        type: 'website',
        siteName: this.config.siteName,
        locale: this.config.defaultLocale
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: this.config.defaultImage,
        creator: this.config.twitterHandle,
        site: this.config.twitterHandle
      },
      additional: {
        'robots': 'index, follow',
        'content-type': 'text/html; charset=utf-8'
      }
    }
  }

  /**
   * Generate meta tags for location/destination pages
   */
  generateLocationMetaTags(location: string, posts: BlogPost[]): SEOMetaTags {
    const title = `${location} Travel Guide - Local Insights & Experiences | ${this.config.siteName}`
    const description = `Complete ${location} travel guide with local insights, cultural experiences, and practical tips. ${posts.length} authentic stories from ${location}.`
    
    // Extract common themes from posts
    const themes = [...new Set(posts.flatMap(p => p.tags))]
    const keywords = [
      location,
      `${location} travel`,
      `${location} guide`,
      `visit ${location}`,
      `${location} culture`,
      ...themes.slice(0, 10),
      ...this.config.brandKeywords
    ].join(', ')

    return {
      title,
      description,
      keywords,
      canonical: `${this.config.siteUrl}/location/${location.toLowerCase().replace(/\s+/g, '-')}`,
      openGraph: {
        title,
        description,
        image: posts[0]?.gallery?.[0] || this.config.defaultImage,
        url: `${this.config.siteUrl}/location/${location.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'website',
        siteName: this.config.siteName,
        locale: this.config.defaultLocale
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: posts[0]?.gallery?.[0] || this.config.defaultImage,
        creator: this.config.twitterHandle,
        site: this.config.twitterHandle
      },
      additional: {
        'geo.region': this.getRegionCode(location),
        'geo.placename': location,
        'robots': 'index, follow'
      }
    }
  }

  // Helper methods

  private initializeKeywordMaps(): void {
    // Location-specific keywords
    this.locationKeywords.set('thailand', [
      'thai food', 'temple hopping', 'island hopping', 'street food', 'tuk tuk',
      'floating market', 'thai massage', 'elephant sanctuary', 'wat', 'songkran'
    ])

    this.locationKeywords.set('colombia', [
      'coffee culture', 'colonial architecture', 'salsa dancing', 'emerald',
      'paisa culture', 'bandeja paisa', 'valle del cocora', 'caribbean coast'
    ])

    this.locationKeywords.set('vietnam', [
      'pho', 'banh mi', 'motorbike tour', 'ha long bay', 'mekong delta',
      'ao dai', 'vietnamese coffee', 'spring rolls', 'cyclo tour'
    ])

    // Category keywords
    this.categoryKeywords.set('food & culture', [
      'local cuisine', 'street food', 'food tour', 'cooking class', 'traditional dish',
      'culinary experience', 'local market', 'food culture', 'authentic taste'
    ])

    this.categoryKeywords.set('adventure', [
      'outdoor adventure', 'hiking', 'trekking', 'rock climbing', 'water sports',
      'extreme sports', 'adventure tour', 'adrenaline', 'backpacking'
    ])

    this.categoryKeywords.set('travel guide', [
      'travel tips', 'destination guide', 'travel planning', 'itinerary',
      'budget travel', 'solo travel', 'backpacker guide', 'practical tips'
    ])
  }

  private extractImportantWords(title: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'])
    
    return title.toLowerCase()
      .split(/\s+/)
      .filter(word => !stopWords.has(word) && word.length > 2)
      .slice(0, 8) // Keep most important words
  }

  private reconstructOptimalTitle(original: string, importantWords: string[], maxLength: number): string {
    let optimized = importantWords.join(' ')
    
    if (optimized.length > maxLength) {
      optimized = importantWords.slice(0, 6).join(' ')
    }
    
    // Capitalize first letter
    return optimized.charAt(0).toUpperCase() + optimized.slice(1)
  }

  private optimizeDescription(post: BlogPost): string {
    const sentences = post.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20)

    let description = sentences[0] || post.excerpt
    
    // Add second sentence if space allows
    if (sentences[1] && description.length + sentences[1].length + 2 < 140) {
      description += '. ' + sentences[1]
    }

    return description
  }

  private extractEntityKeywords(entities: EntityMention[]): string[] {
    return entities
      .filter(entity => entity.confidence > 0.7)
      .map(entity => entity.name.toLowerCase())
      .slice(0, 10)
  }

  private generateLongTailKeywords(post: BlogPost): string[] {
    const longTailKeywords: string[] = []
    
    // Combine main tags with location
    if (post.location) {
      post.tags.forEach(tag => {
        longTailKeywords.push(`best ${tag} in ${post.location}`)
        longTailKeywords.push(`${post.location} ${tag} guide`)
        longTailKeywords.push(`how to ${tag} in ${post.location}`)
      })
    }

    // Question-based keywords
    if (post.category?.toLowerCase().includes('guide')) {
      longTailKeywords.push(`how to visit ${post.location}`)
      longTailKeywords.push(`what to do in ${post.location}`)
      longTailKeywords.push(`${post.location} travel tips`)
    }

    return longTailKeywords.slice(0, 8)
  }

  private selectBestImage(post: BlogPost): string {
    if (post.gallery && post.gallery.length > 0) {
      return post.gallery[0] // Use first image from gallery
    }
    
    return this.config.defaultImage
  }

  private getRegionCode(location: string): string {
    const regionMap: { [key: string]: string } = {
      thailand: 'TH',
      colombia: 'CO',
      vietnam: 'VN',
      indonesia: 'ID',
      india: 'IN',
      nepal: 'NP'
    }
    
    const locationKey = location.toLowerCase()
    
    // Find matching region
    for (const [key, code] of Object.entries(regionMap)) {
      if (locationKey.includes(key)) {
        return code
      }
    }
    
    return 'XX' // Unknown region
  }

  /**
   * Generate JSON-LD structured data for SEO
   */
  generateStructuredData(post: BlogPost): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: this.selectBestImage(post),
      author: {
        '@type': 'Person',
        name: this.config.authorName
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.siteName,
        logo: {
          '@type': 'ImageObject',
          url: this.config.defaultImage
        }
      },
      datePublished: post.date,
      dateModified: post.modifiedDate || post.date,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.config.siteUrl}/blog/${post.slug}`
      }
    }
  }
}