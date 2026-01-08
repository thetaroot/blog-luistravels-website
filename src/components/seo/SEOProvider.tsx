/**
 * Enterprise SEO Provider Component - 2025 Enhanced
 * SEO-PERFECTION-2025 - Comprehensive SEO management with AI-era optimizations
 * Meta Tags 2025 Standards with enhanced E-A-T signals and crawler support
 */

'use client'

import { createContext, useContext, useEffect, ReactNode, useState } from 'react'
import { MetaManager, MetaConfig, SEOPageData } from '@/lib/seo/meta-manager'
import { CanonicalManager } from '@/lib/seo/canonical-manager'
import { RobotsGenerator, MetaRobotsConfig } from '@/lib/seo/robots-generator'
import { HreflangManager, HreflangEntry } from '@/lib/seo/hreflang-manager'
import { MetaProvider, MetaTags } from './MetaProvider'

interface SEOContextType {
  // Meta management
  generatePageMeta: (pageData: SEOPageData) => MetaConfig
  generateBlogMeta: (post: BlogPostData) => MetaConfig
  generateGalleryMeta: (gallery: GalleryData) => MetaConfig
  
  // Canonical URLs
  generateCanonicalUrl: (path: string, params?: Record<string, string>) => string
  checkCanonicalization: (url: string) => { needsRedirect: boolean; canonical?: string }
  
  // Robots and crawling
  generateMetaRobots: (pageType: string, isPublished?: boolean) => string
  generateRobotsTxt: (environment: 'production' | 'staging' | 'development') => string
  
  // International SEO
  generateHreflangEntries: (path: string) => HreflangEntry[]
  getLanguageSwitcher: (path: string, language: string) => LanguageSwitcherItem[]
  detectUserLanguage: () => string
  
  // Analytics and monitoring
  trackSEOEvent: (event: SEOEvent) => void
  getSEOHealth: () => SEOHealthReport
}

interface BlogPostData {
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

interface GalleryData {
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

interface LanguageSwitcherItem {
  code: string
  name: string
  nativeName: string
  href: string
  isActive: boolean
  direction: 'ltr' | 'rtl'
}

interface SEOEvent {
  type: 'page_view' | 'meta_generated' | 'canonical_redirect' | 'language_switch' | 'robots_check'
  data: Record<string, any>
  timestamp?: Date
}

interface SEOHealthReport {
  metaTags: {
    coverage: number
    issues: string[]
  }
  canonicalUrls: {
    conflicts: number
    redirects: number
  }
  internationalSEO: {
    languageCoverage: number
    hreflangIssues: number
  }
  robotsOptimization: {
    crawlerAccess: 'good' | 'restricted' | 'blocked'
    indexingIssues: number
  }
  overallScore: number
}

const SEOContext = createContext<SEOContextType | null>(null)

interface SEOProviderProps {
  children: ReactNode
  environment?: 'production' | 'staging' | 'development'
  baseUrl?: string
  defaultLanguage?: string
}

export function SEOProvider({ 
  children, 
  environment = 'production',
  baseUrl,
  defaultLanguage = 'en'
}: SEOProviderProps) {
  const [seoHealth, setSeoHealth] = useState<SEOHealthReport | null>(null)
  
  // Initialize managers
  const metaManager = MetaManager.getInstance()
  const canonicalManager = CanonicalManager.getInstance()
  const robotsGenerator = RobotsGenerator.getInstance()
  const hreflangManager = HreflangManager.getInstance()

  useEffect(() => {
    // Initialize SEO systems
    if (baseUrl) {
      canonicalManager.updateConfig({ baseUrl })
    }

    // Set up periodic health checks
    const healthCheckInterval = setInterval(() => {
      setSeoHealth(generateSEOHealthReport())
    }, 300000) // Every 5 minutes

    // Initial health check
    setSeoHealth(generateSEOHealthReport())

    return () => clearInterval(healthCheckInterval)
  }, [baseUrl])

  const generatePageMeta = (pageData: SEOPageData): MetaConfig => {
    try {
      const config = metaManager.generateMetaTags(pageData)
      trackSEOEvent({
        type: 'meta_generated',
        data: { path: pageData.slug, title: pageData.title }
      })
      return config
    } catch (error) {
      console.error('Error generating page meta:', error)
      return getFallbackMeta(pageData.title)
    }
  }

  const generateBlogMeta = (post: BlogPostData): MetaConfig => {
    try {
      const config = metaManager.generateBlogPostMeta(post)
      trackSEOEvent({
        type: 'meta_generated',
        data: { type: 'blog', slug: post.slug, title: post.title }
      })
      return config
    } catch (error) {
      console.error('Error generating blog meta:', error)
      return getFallbackMeta(post.title)
    }
  }

  const generateGalleryMeta = (gallery: GalleryData): MetaConfig => {
    try {
      const config = metaManager.generateGalleryMeta(gallery)
      trackSEOEvent({
        type: 'meta_generated',
        data: { type: 'gallery', slug: gallery.slug, title: gallery.title }
      })
      return config
    } catch (error) {
      console.error('Error generating gallery meta:', error)
      return getFallbackMeta(gallery.title)
    }
  }

  const generateCanonicalUrl = (path: string, params?: Record<string, string>): string => {
    try {
      return canonicalManager.generateCanonicalUrl(path, params)
    } catch (error) {
      console.error('Error generating canonical URL:', error)
      return `${baseUrl || ''}${path}`
    }
  }

  const checkCanonicalization = (url: string): { needsRedirect: boolean; canonical?: string } => {
    try {
      const variation = canonicalManager.needsCanonicalization(url)
      if (variation) {
        trackSEOEvent({
          type: 'canonical_redirect',
          data: { original: url, canonical: variation.canonical, reason: variation.reason }
        })
        return { needsRedirect: true, canonical: variation.canonical }
      }
      return { needsRedirect: false }
    } catch (error) {
      console.error('Error checking canonicalization:', error)
      return { needsRedirect: false }
    }
  }

  const generateMetaRobots = (pageType: string, isPublished: boolean = true): string => {
    try {
      return robotsGenerator.generatePageMetaRobots(pageType, isPublished)
    } catch (error) {
      console.error('Error generating meta robots:', error)
      return 'index, follow'
    }
  }

  const generateRobotsTxt = (env: 'production' | 'staging' | 'development'): string => {
    try {
      return robotsGenerator.generateEnvironmentRobots(env)
    } catch (error) {
      console.error('Error generating robots.txt:', error)
      return 'User-agent: *\nDisallow: /'
    }
  }

  const generateHreflangEntries = (path: string): HreflangEntry[] => {
    try {
      return hreflangManager.generateHreflangEntries(path)
    } catch (error) {
      console.error('Error generating hreflang entries:', error)
      return []
    }
  }

  const getLanguageSwitcher = (path: string, language: string): LanguageSwitcherItem[] => {
    try {
      return hreflangManager.generateLanguageSwitcher(path, language)
    } catch (error) {
      console.error('Error generating language switcher:', error)
      return []
    }
  }

  const detectUserLanguage = (): string => {
    try {
      // In browser environment, detect from navigator
      if (typeof window !== 'undefined') {
        return hreflangManager.detectUserLanguage({
          headers: {
            'accept-language': navigator.language || navigator.languages?.[0] || defaultLanguage
          }
        })
      }
      return defaultLanguage
    } catch (error) {
      console.error('Error detecting user language:', error)
      return defaultLanguage
    }
  }

  const trackSEOEvent = (event: SEOEvent): void => {
    try {
      const eventWithTimestamp = {
        ...event,
        timestamp: event.timestamp || new Date()
      }

      // Log to console in development
      if (environment === 'development') {
        console.log('SEO Event:', eventWithTimestamp)
      }

      // Send to analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'seo_action', {
          event_category: 'SEO',
          event_label: event.type,
          custom_parameters: event.data
        })
      }

      // Store in session storage for debugging
      if (typeof window !== 'undefined') {
        const events = JSON.parse(sessionStorage.getItem('seo_events') || '[]')
        events.push(eventWithTimestamp)
        // Keep only last 100 events
        if (events.length > 100) {
          events.splice(0, events.length - 100)
        }
        sessionStorage.setItem('seo_events', JSON.stringify(events))
      }
    } catch (error) {
      console.error('Error tracking SEO event:', error)
    }
  }

  const generateSEOHealthReport = (): SEOHealthReport => {
    try {
      // This would typically analyze actual page data
      // For now, we'll return a mock health report
      return {
        metaTags: {
          coverage: 95,
          issues: []
        },
        canonicalUrls: {
          conflicts: 0,
          redirects: 2
        },
        internationalSEO: {
          languageCoverage: 75,
          hreflangIssues: 0
        },
        robotsOptimization: {
          crawlerAccess: 'good',
          indexingIssues: 0
        },
        overallScore: 92
      }
    } catch (error) {
      console.error('Error generating SEO health report:', error)
      return {
        metaTags: { coverage: 0, issues: ['Health check failed'] },
        canonicalUrls: { conflicts: 0, redirects: 0 },
        internationalSEO: { languageCoverage: 0, hreflangIssues: 1 },
        robotsOptimization: { crawlerAccess: 'blocked', indexingIssues: 1 },
        overallScore: 0
      }
    }
  }

  const getSEOHealth = (): SEOHealthReport => {
    return seoHealth || generateSEOHealthReport()
  }

  const getFallbackMeta = (title: string): MetaConfig => {
    return {
      title: title || 'Luis Personal Portfolio',
      description: 'Professional portfolio showcasing photography, development, and creative work.',
      robots: 'index, follow',
      canonical: typeof window !== 'undefined' ? window.location.href : baseUrl
    }
  }

  const contextValue: SEOContextType = {
    generatePageMeta,
    generateBlogMeta,
    generateGalleryMeta,
    generateCanonicalUrl,
    checkCanonicalization,
    generateMetaRobots,
    generateRobotsTxt,
    generateHreflangEntries,
    getLanguageSwitcher,
    detectUserLanguage,
    trackSEOEvent,
    getSEOHealth
  }

  return (
    <SEOContext.Provider value={contextValue}>
      <MetaProvider>
        {children}
      </MetaProvider>
    </SEOContext.Provider>
  )
}

export function useSEO() {
  const context = useContext(SEOContext)
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider')
  }
  return context
}

// Enhanced meta tags component with all SEO features
interface EnhancedMetaTagsProps {
  pageData: SEOPageData
  pageType?: string
  language?: string
}

export function EnhancedMetaTags({ pageData, pageType = 'website', language = 'en' }: EnhancedMetaTagsProps) {
  const { 
    generatePageMeta, 
    generateCanonicalUrl, 
    generateMetaRobots, 
    generateHreflangEntries 
  } = useSEO()

  const metaConfig = generatePageMeta(pageData)
  const canonicalUrl = generateCanonicalUrl(pageData.slug)
  const robotsContent = generateMetaRobots(pageType, true)
  const hreflangEntries = generateHreflangEntries(pageData.slug)

  // Enhanced meta config with all features
  const enhancedMetaConfig: MetaConfig = {
    ...metaConfig,
    canonical: canonicalUrl,
    robots: robotsContent
  }

  return (
    <>
      <MetaTags config={enhancedMetaConfig} />
      
      {/* Hreflang tags */}
      {hreflangEntries.map(entry => (
        <link
          key={entry.hreflang}
          rel="alternate"
          hrefLang={entry.hreflang}
          href={entry.href}
        />
      ))}
      
      {/* 2025 Enhanced Meta Tags */}
      <meta name="language" content={language} />
      <meta name="content-language" content={language} />
      
      {/* Geographic and Location Meta */}
      <meta name="geo.region" content="WORLDWIDE" />
      <meta name="geo.placename" content="Digital Nomad Travel Blog" />
      <meta name="coverage" content="Worldwide" />
      
      {/* Brand and Publisher Information */}
      <meta name="application-name" content="Luis Travels" />
      <meta name="apple-mobile-web-app-title" content="Luis Travels" />
      <meta name="author" content="Luis Gunther" />
      <meta name="publisher" content="Luis Travels" />
      <meta name="copyright" content="© 2024 Luis Travels. All rights reserved." />
      
      {/* Content Classification */}
      <meta name="subject" content="Digital nomad travel blog, photography, cultural experiences" />
      <meta name="topic" content="Travel, Digital Nomad Lifestyle, Photography" />
      <meta name="category" content="Travel Blog" />
      <meta name="coverage" content="Worldwide travel experiences" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="target" content="travel enthusiasts, digital nomads, photographers" />
      
      {/* 2025 AI Crawler Meta Tags */}
      <meta name="AI-content-declaration" content="No AI-generated content. All content created by human author." />
      <meta name="content-authenticity" content="Original human-created travel experiences and photography" />
      <meta name="expertise-authority" content="First-hand travel experiences, 5+ years digital nomad lifestyle" />
      <meta name="content-freshness" content="Regular updates, authentic real-time travel documentation" />
      
      {/* Enhanced Social and Sharing */}
      <meta name="pinterest-media" content="Rich travel photography and inspiration" />
      <meta name="instagram-media" content="@lu.is.gone" />
      <meta name="telegram:channel" content="@heretheregone" />
      
      {/* Performance and Technical */}
      <meta name="renderer" content="webkit" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-touch-fullscreen" content="yes" />
      
      {/* Enhanced Security Headers */}
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;" />
      
      {/* 2025 Web Standards */}
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
      <meta name="color-scheme" content="light dark" />
      
      {/* Accessibility and Inclusion */}
      <meta name="accessibility-features" content="high-contrast-display,large-print-display" />
      <meta name="accessible-colors" content="WCAG-AA-compliant" />
      
      {/* Monetization and Verification */}
      <meta name="monetization" content="$ilp.uphold.com/WMbkRBiZFgbx" />
      <link rel="me" href="https://instagram.com/lu.is.gone" />
      <link rel="me" href="https://pinterest.com/heretheregone" />
      
      {/* Enhanced PWA Support */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
    </>
  )
}

// SEO debugging component for development
export function SEODebugger() {
  const { getSEOHealth } = useSEO()
  const [health, setHealth] = useState<SEOHealthReport | null>(null)
  const [events, setEvents] = useState<SEOEvent[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setHealth(getSEOHealth())
      
      // Load events from session storage
      const storedEvents = JSON.parse(sessionStorage.getItem('seo_events') || '[]')
      setEvents(storedEvents)
    }
  }, [getSEOHealth])

  if (process.env.NODE_ENV !== 'development' || !health) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      fontSize: 12,
      maxWidth: 300,
      zIndex: 9999
    }}>
      <h4>SEO Health Score: {health.overallScore}/100</h4>
      <p>Meta Coverage: {health.metaTags.coverage}%</p>
      <p>Canonical Redirects: {health.canonicalUrls.redirects}</p>
      <p>Language Coverage: {health.internationalSEO.languageCoverage}%</p>
      <p>Recent Events: {events.length}</p>
    </div>
  )
}

export type { SEOPageData, BlogPostData, GalleryData, SEOEvent, SEOHealthReport }