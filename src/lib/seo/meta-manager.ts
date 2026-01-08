/**
 * Enterprise Meta Tags Management System
 * SEO-Dominance-2025 - Advanced meta tag optimization for maximum search visibility
 * Google Senior Dev Level implementation for comprehensive SEO control
 */

export interface MetaConfig {
  title?: string
  description?: string
  keywords?: string[]
  author?: string
  robots?: string
  canonical?: string
  alternates?: Record<string, string>
  openGraph?: OpenGraphConfig
  twitter?: TwitterConfig
  custom?: Record<string, string>
}

export interface OpenGraphConfig {
  type?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video'
  title?: string
  description?: string
  url?: string
  siteName?: string
  images?: OpenGraphImage[]
  locale?: string
  alternateLocales?: string[]
  article?: ArticleConfig
  profile?: ProfileConfig
}

export interface OpenGraphImage {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string
  secureUrl?: string
}

export interface ArticleConfig {
  publishedTime?: string
  modifiedTime?: string
  expirationTime?: string
  author?: string[]
  section?: string
  tags?: string[]
}

export interface ProfileConfig {
  firstName?: string
  lastName?: string
  username?: string
  gender?: string
}

export interface TwitterConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  app?: TwitterAppConfig
  player?: TwitterPlayerConfig
}

export interface TwitterAppConfig {
  name?: {
    iphone?: string
    ipad?: string
    googleplay?: string
  }
  id?: {
    iphone?: string
    ipad?: string
    googleplay?: string
  }
  url?: {
    iphone?: string
    ipad?: string
    googleplay?: string
  }
}

export interface TwitterPlayerConfig {
  url: string
  width: number
  height: number
  stream?: string
}

export interface SEOPageData {
  slug: string
  title: string
  description: string
  keywords: string[]
  publishedAt?: string
  modifiedAt?: string
  author?: string
  category?: string
  tags?: string[]
  images?: Array<{
    url: string
    alt: string
    width?: number
    height?: number
  }>
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
}

/**
 * Enterprise Meta Tags Manager
 */
export class MetaManager {
  private static instance: MetaManager
  private baseUrl: string = ''
  private siteName: string = ''
  private defaultAuthor: string = ''
  private defaultImage: string = ''
  private twitterHandle: string = ''

  private constructor() {
    this.initializeDefaults()
  }

  static getInstance(): MetaManager {
    if (!MetaManager.instance) {
      MetaManager.instance = new MetaManager()
    }
    return MetaManager.instance
  }

  /**
   * Initialize default values from environment or config
   */
  private initializeDefaults(): void {
    if (typeof window !== 'undefined') {
      this.baseUrl = window.location.origin
    }
    
    // These would typically come from environment variables
    this.siteName = 'Luis Personal Portfolio'
    this.defaultAuthor = 'Luis'
    this.defaultImage = '/images/og-default.jpg'
    this.twitterHandle = '@luis'
  }

  /**
   * Generate comprehensive meta tags for a page
   */
  generateMetaTags(pageData: SEOPageData): MetaConfig {
    const {
      slug,
      title,
      description,
      keywords,
      publishedAt,
      modifiedAt,
      author,
      category,
      tags,
      images,
      canonicalUrl,
      noIndex,
      noFollow
    } = pageData

    const fullTitle = title === this.siteName ? title : `${title} | ${this.siteName}`
    const pageUrl = canonicalUrl || `${this.baseUrl}${slug}`
    const primaryImage = images?.[0] || { url: this.defaultImage, alt: title }
    const fullImageUrl = primaryImage.url.startsWith('http') 
      ? primaryImage.url 
      : `${this.baseUrl}${primaryImage.url}`

    // Build robots directive
    const robotsDirectives = []
    if (noIndex) robotsDirectives.push('noindex')
    if (noFollow) robotsDirectives.push('nofollow')
    if (!noIndex && !noFollow) robotsDirectives.push('index', 'follow')
    robotsDirectives.push('max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1')

    return {
      title: fullTitle,
      description,
      keywords,
      author: author || this.defaultAuthor,
      robots: robotsDirectives.join(', '),
      canonical: pageUrl,
      openGraph: this.generateOpenGraph({
        title: fullTitle,
        description,
        url: pageUrl,
        image: primaryImage,
        publishedAt,
        modifiedAt,
        author,
        category,
        tags,
        images
      }),
      twitter: this.generateTwitterCard({
        title: fullTitle,
        description,
        image: primaryImage
      }),
      custom: this.generateCustomMeta({
        publishedAt,
        modifiedAt,
        category,
        tags,
        keywords
      })
    }
  }

  /**
   * Generate Open Graph meta tags
   */
  private generateOpenGraph(data: {
    title: string
    description: string
    url: string
    image: { url: string; alt: string; width?: number; height?: number }
    publishedAt?: string
    modifiedAt?: string
    author?: string
    category?: string
    tags?: string[]
    images?: Array<{ url: string; alt: string; width?: number; height?: number }>
  }): OpenGraphConfig {
    const { title, description, url, image, publishedAt, modifiedAt, author, category, tags, images } = data
    
    const ogImages: OpenGraphImage[] = (images || [image]).map(img => ({
      url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
      width: img.width || 1200,
      height: img.height || 630,
      alt: img.alt,
      type: 'image/jpeg',
      secureUrl: img.url.startsWith('https') ? img.url : `${this.baseUrl}${img.url}`.replace('http:', 'https:')
    }))

    const config: OpenGraphConfig = {
      type: publishedAt ? 'article' : 'website',
      title,
      description,
      url,
      siteName: this.siteName,
      images: ogImages,
      locale: 'en_US',
      alternateLocales: ['de_DE', 'es_ES', 'fr_FR']
    }

    // Add article-specific data
    if (publishedAt) {
      config.article = {
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        author: author ? [author] : [this.defaultAuthor],
        section: category,
        tags: tags || []
      }
    }

    return config
  }

  /**
   * Generate Twitter Card meta tags
   */
  private generateTwitterCard(data: {
    title: string
    description: string
    image: { url: string; alt: string }
  }): TwitterConfig {
    const { title, description, image } = data
    const imageUrl = image.url.startsWith('http') ? image.url : `${this.baseUrl}${image.url}`

    return {
      card: 'summary_large_image',
      site: this.twitterHandle,
      creator: this.twitterHandle,
      title,
      description,
      image: imageUrl,
      imageAlt: image.alt
    }
  }

  /**
   * Generate custom meta tags
   */
  private generateCustomMeta(data: {
    publishedAt?: string
    modifiedAt?: string
    category?: string
    tags?: string[]
    keywords?: string[]
  }): Record<string, string> {
    const { publishedAt, modifiedAt, category, tags, keywords } = data
    const custom: Record<string, string> = {}

    // Article-specific meta
    if (publishedAt) {
      custom['article:published_time'] = publishedAt
    }
    if (modifiedAt) {
      custom['article:modified_time'] = modifiedAt
    }
    if (category) {
      custom['article:section'] = category
    }

    // Additional SEO meta
    if (keywords?.length) {
      custom['news_keywords'] = keywords.slice(0, 10).join(',')
    }
    if (tags?.length) {
      tags.forEach((tag, index) => {
        custom[`article:tag:${index}`] = tag
      })
    }

    // Technical meta
    custom['theme-color'] = '#000000'
    custom['msapplication-TileColor'] = '#000000'
    custom['apple-mobile-web-app-capable'] = 'yes'
    custom['apple-mobile-web-app-status-bar-style'] = 'black-translucent'
    custom['format-detection'] = 'telephone=no'

    return custom
  }

  /**
   * Generate meta tags for blog posts
   */
  generateBlogPostMeta(post: {
    slug: string
    title: string
    excerpt: string
    content: string
    publishedAt: string
    updatedAt?: string
    author: string
    category: string
    tags: string[]
    featuredImage?: {
      url: string
      alt: string
      width?: number
      height?: number
    }
  }): MetaConfig {
    // Extract keywords from content
    const keywords = this.extractKeywords(post.content, post.tags)
    
    return this.generateMetaTags({
      slug: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      keywords,
      publishedAt: post.publishedAt,
      modifiedAt: post.updatedAt,
      author: post.author,
      category: post.category,
      tags: post.tags,
      images: post.featuredImage ? [post.featuredImage] : undefined
    })
  }

  /**
   * Generate meta tags for gallery pages
   */
  generateGalleryMeta(gallery: {
    slug: string
    title: string
    description: string
    images: Array<{
      url: string
      alt: string
      width?: number
      height?: number
    }>
    category?: string
    tags?: string[]
  }): MetaConfig {
    return this.generateMetaTags({
      slug: `/gallery/${gallery.slug}`,
      title: gallery.title,
      description: gallery.description,
      keywords: gallery.tags || ['photography', 'gallery', 'images'],
      category: gallery.category,
      tags: gallery.tags,
      images: gallery.images.slice(0, 5) // Limit to first 5 images
    })
  }

  /**
   * Extract keywords from content using simple NLP
   */
  private extractKeywords(content: string, existingTags: string[] = []): string[] {
    // Remove HTML tags and normalize
    const text = content.replace(/<[^>]*>/g, ' ').toLowerCase()
    
    // Common stop words to exclude
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ])

    // Extract words and count frequency
    const words = text.match(/\b\w{3,}\b/g) || []
    const wordCount = new Map<string, number>()
    
    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1)
      }
    })

    // Get top keywords
    const topKeywords = Array.from(wordCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)

    // Combine with existing tags
    const allKeywords = [...new Set([...existingTags, ...topKeywords])]
    
    return allKeywords.slice(0, 15) // Limit to 15 keywords
  }

  /**
   * Generate structured data for search engines
   */
  generateStructuredData(pageData: SEOPageData): Record<string, any> {
    const { title, description, publishedAt, modifiedAt, author, images } = pageData
    
    const baseStructure = {
      '@context': 'https://schema.org',
      '@type': publishedAt ? 'Article' : 'WebPage',
      name: title,
      description,
      url: `${this.baseUrl}${pageData.slug}`,
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo.png`
        }
      }
    }

    if (publishedAt) {
      return {
        ...baseStructure,
        '@type': 'Article',
        headline: title,
        datePublished: publishedAt,
        dateModified: modifiedAt || publishedAt,
        author: {
          '@type': 'Person',
          name: author || this.defaultAuthor
        },
        image: images?.map(img => ({
          '@type': 'ImageObject',
          url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
          width: img.width,
          height: img.height
        })) || []
      }
    }

    return baseStructure
  }

  /**
   * Convert MetaConfig to HTML meta tags
   */
  generateMetaHTML(config: MetaConfig): string {
    const tags: string[] = []

    // Basic meta tags
    if (config.title) {
      tags.push(`<title>${this.escapeHtml(config.title)}</title>`)
    }
    if (config.description) {
      tags.push(`<meta name="description" content="${this.escapeHtml(config.description)}" />`)
    }
    if (config.keywords?.length) {
      tags.push(`<meta name="keywords" content="${this.escapeHtml(config.keywords.join(', '))}" />`)
    }
    if (config.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(config.author)}" />`)
    }
    if (config.robots) {
      tags.push(`<meta name="robots" content="${config.robots}" />`)
    }
    if (config.canonical) {
      tags.push(`<link rel="canonical" href="${config.canonical}" />`)
    }

    // Open Graph tags
    if (config.openGraph) {
      const og = config.openGraph
      if (og.type) tags.push(`<meta property="og:type" content="${og.type}" />`)
      if (og.title) tags.push(`<meta property="og:title" content="${this.escapeHtml(og.title)}" />`)
      if (og.description) tags.push(`<meta property="og:description" content="${this.escapeHtml(og.description)}" />`)
      if (og.url) tags.push(`<meta property="og:url" content="${og.url}" />`)
      if (og.siteName) tags.push(`<meta property="og:site_name" content="${this.escapeHtml(og.siteName)}" />`)
      if (og.locale) tags.push(`<meta property="og:locale" content="${og.locale}" />`)
      
      og.images?.forEach(image => {
        tags.push(`<meta property="og:image" content="${image.url}" />`)
        if (image.width) tags.push(`<meta property="og:image:width" content="${image.width}" />`)
        if (image.height) tags.push(`<meta property="og:image:height" content="${image.height}" />`)
        if (image.alt) tags.push(`<meta property="og:image:alt" content="${this.escapeHtml(image.alt)}" />`)
      })
    }

    // Twitter Card tags
    if (config.twitter) {
      const twitter = config.twitter
      if (twitter.card) tags.push(`<meta name="twitter:card" content="${twitter.card}" />`)
      if (twitter.site) tags.push(`<meta name="twitter:site" content="${twitter.site}" />`)
      if (twitter.creator) tags.push(`<meta name="twitter:creator" content="${twitter.creator}" />`)
      if (twitter.title) tags.push(`<meta name="twitter:title" content="${this.escapeHtml(twitter.title)}" />`)
      if (twitter.description) tags.push(`<meta name="twitter:description" content="${this.escapeHtml(twitter.description)}" />`)
      if (twitter.image) tags.push(`<meta name="twitter:image" content="${twitter.image}" />`)
      if (twitter.imageAlt) tags.push(`<meta name="twitter:image:alt" content="${this.escapeHtml(twitter.imageAlt)}" />`)
    }

    // Custom meta tags
    if (config.custom) {
      Object.entries(config.custom).forEach(([name, content]) => {
        tags.push(`<meta name="${name}" content="${this.escapeHtml(content)}" />`)
      })
    }

    return tags.join('\n')
  }

  /**
   * Escape HTML entities
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

export default MetaManager