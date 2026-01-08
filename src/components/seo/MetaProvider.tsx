/**
 * Enterprise Meta Provider Component
 * SEO-Dominance-2025 - React integration for advanced meta tag management
 * Google Senior Dev Level implementation for seamless Next.js integration
 */

'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import Head from 'next/head'
import { MetaManager, MetaConfig, SEOPageData, OpenGraphImage } from '@/lib/seo/meta-manager'

interface MetaContextType {
  updateMeta: (config: MetaConfig) => void
  generatePageMeta: (pageData: SEOPageData) => MetaConfig
  generateBlogMeta: (post: BlogPostMeta) => MetaConfig
  generateGalleryMeta: (gallery: GalleryMeta) => MetaConfig
}

interface BlogPostMeta {
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
}

interface GalleryMeta {
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
}

const MetaContext = createContext<MetaContextType | null>(null)

interface MetaProviderProps {
  children: ReactNode
  defaultMeta?: Partial<MetaConfig>
}

export function MetaProvider({ children, defaultMeta }: MetaProviderProps) {
  const metaManager = MetaManager.getInstance()

  useEffect(() => {
    // Initialize default meta tags if provided
    if (defaultMeta) {
      updateMeta(defaultMeta as MetaConfig)
    }

    // Set up global error boundary for meta generation
    const handleError = (event: ErrorEvent) => {
      console.error('Meta generation error:', event.error)
      // Fallback to basic meta tags
      updateMeta({
        title: 'Luis Personal Portfolio',
        description: 'Professional portfolio showcasing photography, development, and creative work.',
        robots: 'index, follow'
      })
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [defaultMeta])

  const updateMeta = (config: MetaConfig) => {
    try {
      // The actual meta tag updates will be handled by the MetaTags component
      // This is more for triggering re-renders or analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'page_view', {
          page_title: config.title,
          page_location: config.canonical || window.location.href
        })
      }
    } catch (error) {
      console.error('Failed to update meta tags:', error)
    }
  }

  const generatePageMeta = (pageData: SEOPageData): MetaConfig => {
    return metaManager.generateMetaTags(pageData)
  }

  const generateBlogMeta = (post: BlogPostMeta): MetaConfig => {
    return metaManager.generateBlogPostMeta(post)
  }

  const generateGalleryMeta = (gallery: GalleryMeta): MetaConfig => {
    return metaManager.generateGalleryMeta(gallery)
  }

  const contextValue: MetaContextType = {
    updateMeta,
    generatePageMeta,
    generateBlogMeta,
    generateGalleryMeta
  }

  return (
    <MetaContext.Provider value={contextValue}>
      {children}
    </MetaContext.Provider>
  )
}

export function useMeta() {
  const context = useContext(MetaContext)
  if (!context) {
    throw new Error('useMeta must be used within a MetaProvider')
  }
  return context
}

interface MetaTagsProps {
  config: MetaConfig
  structuredData?: Record<string, any>
}

export function MetaTags({ config, structuredData }: MetaTagsProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      {config.title && <title>{config.title}</title>}
      {config.description && (
        <meta name="description" content={config.description} />
      )}
      {config.keywords && config.keywords.length > 0 && (
        <meta name="keywords" content={config.keywords.join(', ')} />
      )}
      {config.author && <meta name="author" content={config.author} />}
      {config.robots && <meta name="robots" content={config.robots} />}
      
      {/* Canonical URL */}
      {config.canonical && <link rel="canonical" href={config.canonical} />}
      
      {/* Alternate URLs */}
      {config.alternates && Object.entries(config.alternates).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph Tags */}
      {config.openGraph && (
        <>
          <meta property="og:type" content={config.openGraph.type || 'website'} />
          {config.openGraph.title && (
            <meta property="og:title" content={config.openGraph.title} />
          )}
          {config.openGraph.description && (
            <meta property="og:description" content={config.openGraph.description} />
          )}
          {config.openGraph.url && (
            <meta property="og:url" content={config.openGraph.url} />
          )}
          {config.openGraph.siteName && (
            <meta property="og:site_name" content={config.openGraph.siteName} />
          )}
          {config.openGraph.locale && (
            <meta property="og:locale" content={config.openGraph.locale} />
          )}
          
          {/* Open Graph Images */}
          {config.openGraph.images?.map((image, index) => (
            <div key={index}>
              <meta property="og:image" content={image.url} />
              {image.width && (
                <meta property="og:image:width" content={image.width.toString()} />
              )}
              {image.height && (
                <meta property="og:image:height" content={image.height.toString()} />
              )}
              {image.alt && (
                <meta property="og:image:alt" content={image.alt} />
              )}
              {image.type && (
                <meta property="og:image:type" content={image.type} />
              )}
              {image.secureUrl && (
                <meta property="og:image:secure_url" content={image.secureUrl} />
              )}
            </div>
          ))}
          
          {/* Open Graph Article */}
          {config.openGraph.article && (
            <>
              {config.openGraph.article.publishedTime && (
                <meta property="article:published_time" content={config.openGraph.article.publishedTime} />
              )}
              {config.openGraph.article.modifiedTime && (
                <meta property="article:modified_time" content={config.openGraph.article.modifiedTime} />
              )}
              {config.openGraph.article.expirationTime && (
                <meta property="article:expiration_time" content={config.openGraph.article.expirationTime} />
              )}
              {config.openGraph.article.author?.map((author, index) => (
                <meta key={index} property="article:author" content={author} />
              ))}
              {config.openGraph.article.section && (
                <meta property="article:section" content={config.openGraph.article.section} />
              )}
              {config.openGraph.article.tags?.map((tag, index) => (
                <meta key={index} property="article:tag" content={tag} />
              ))}
            </>
          )}
          
          {/* Open Graph Profile */}
          {config.openGraph.profile && (
            <>
              {config.openGraph.profile.firstName && (
                <meta property="profile:first_name" content={config.openGraph.profile.firstName} />
              )}
              {config.openGraph.profile.lastName && (
                <meta property="profile:last_name" content={config.openGraph.profile.lastName} />
              )}
              {config.openGraph.profile.username && (
                <meta property="profile:username" content={config.openGraph.profile.username} />
              )}
              {config.openGraph.profile.gender && (
                <meta property="profile:gender" content={config.openGraph.profile.gender} />
              )}
            </>
          )}
        </>
      )}
      
      {/* Twitter Card Tags */}
      {config.twitter && (
        <>
          <meta name="twitter:card" content={config.twitter.card || 'summary'} />
          {config.twitter.site && (
            <meta name="twitter:site" content={config.twitter.site} />
          )}
          {config.twitter.creator && (
            <meta name="twitter:creator" content={config.twitter.creator} />
          )}
          {config.twitter.title && (
            <meta name="twitter:title" content={config.twitter.title} />
          )}
          {config.twitter.description && (
            <meta name="twitter:description" content={config.twitter.description} />
          )}
          {config.twitter.image && (
            <meta name="twitter:image" content={config.twitter.image} />
          )}
          {config.twitter.imageAlt && (
            <meta name="twitter:image:alt" content={config.twitter.imageAlt} />
          )}
          
          {/* Twitter App Cards */}
          {config.twitter.app && (
            <>
              {config.twitter.app.name?.iphone && (
                <meta name="twitter:app:name:iphone" content={config.twitter.app.name.iphone} />
              )}
              {config.twitter.app.name?.ipad && (
                <meta name="twitter:app:name:ipad" content={config.twitter.app.name.ipad} />
              )}
              {config.twitter.app.name?.googleplay && (
                <meta name="twitter:app:name:googleplay" content={config.twitter.app.name.googleplay} />
              )}
              {config.twitter.app.id?.iphone && (
                <meta name="twitter:app:id:iphone" content={config.twitter.app.id.iphone} />
              )}
              {config.twitter.app.id?.ipad && (
                <meta name="twitter:app:id:ipad" content={config.twitter.app.id.ipad} />
              )}
              {config.twitter.app.id?.googleplay && (
                <meta name="twitter:app:id:googleplay" content={config.twitter.app.id.googleplay} />
              )}
            </>
          )}
          
          {/* Twitter Player Cards */}
          {config.twitter.player && (
            <>
              <meta name="twitter:player" content={config.twitter.player.url} />
              <meta name="twitter:player:width" content={config.twitter.player.width.toString()} />
              <meta name="twitter:player:height" content={config.twitter.player.height.toString()} />
              {config.twitter.player.stream && (
                <meta name="twitter:player:stream" content={config.twitter.player.stream} />
              )}
            </>
          )}
        </>
      )}
      
      {/* Custom Meta Tags */}
      {config.custom && Object.entries(config.custom).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Head>
  )
}

interface PageSEOProps {
  pageData: SEOPageData
  children?: ReactNode
}

export function PageSEO({ pageData, children }: PageSEOProps) {
  const { generatePageMeta } = useMeta()
  const metaManager = MetaManager.getInstance()
  
  const metaConfig = generatePageMeta(pageData)
  const structuredData = metaManager.generateStructuredData(pageData)

  return (
    <>
      <MetaTags config={metaConfig} structuredData={structuredData} />
      {children}
    </>
  )
}

interface BlogSEOProps {
  post: BlogPostMeta
  children?: ReactNode
}

export function BlogSEO({ post, children }: BlogSEOProps) {
  const { generateBlogMeta } = useMeta()
  const metaManager = MetaManager.getInstance()
  
  const metaConfig = generateBlogMeta(post)
  const structuredData = metaManager.generateStructuredData({
    slug: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt,
    author: post.author,
    category: post.category,
    tags: post.tags,
    images: post.featuredImage ? [post.featuredImage] : undefined
  })

  return (
    <>
      <MetaTags config={metaConfig} structuredData={structuredData} />
      {children}
    </>
  )
}

interface GallerySEOProps {
  gallery: GalleryMeta
  children?: ReactNode
}

export function GallerySEO({ gallery, children }: GallerySEOProps) {
  const { generateGalleryMeta } = useMeta()
  const metaManager = MetaManager.getInstance()
  
  const metaConfig = generateGalleryMeta(gallery)
  const structuredData = metaManager.generateStructuredData({
    slug: `/gallery/${gallery.slug}`,
    title: gallery.title,
    description: gallery.description,
    keywords: gallery.tags || ['photography', 'gallery'],
    category: gallery.category,
    tags: gallery.tags,
    images: gallery.images
  })

  return (
    <>
      <MetaTags config={metaConfig} structuredData={structuredData} />
      {children}
    </>
  )
}

export type { MetaConfig, SEOPageData, BlogPostMeta, GalleryMeta }