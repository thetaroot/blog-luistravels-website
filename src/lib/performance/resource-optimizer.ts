/**
 * 🎯 ADVANCED RESOURCE OPTIMIZATION SYSTEM
 * 10/10 Performance through Intelligent Resource Management
 */

export interface ResourceHint {
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch' | 'modulepreload'
  href: string
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'video' | 'audio' | 'document'
  type?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  media?: string
  importance?: 'high' | 'low'
}

export interface OptimizationStrategy {
  criticalCSS: string[]
  criticalJS: string[]
  deferredCSS: string[]
  deferredJS: string[]
  preloadImages: string[]
  prefetchPages: string[]
  resourceHints: ResourceHint[]
}

export interface PerformanceMetrics {
  lcp: number
  fcp: number
  cls: number
  inp: number
  ttfb: number
  resourceCount: number
  totalSize: number
}

/**
 * Advanced Resource Optimizer for 10/10 Performance
 */
export class ResourceOptimizer {
  private static loadedResources = new Set<string>()
  private static criticalResourcesCache = new Map<string, any>()
  private static performanceObserver: PerformanceObserver | null = null

  /**
   * Generate optimal resource hints for the application
   */
  static generateOptimalResourceHints(): ResourceHint[] {
    return [
      // Critical font preloading
      {
        rel: 'preload',
        href: '/fonts/inter-var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
        importance: 'high'
      },
      
      // Essential external connections
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      
      // Analytics and tracking (low priority)
      {
        rel: 'dns-prefetch',
        href: 'https://www.google-analytics.com'
      },
      {
        rel: 'dns-prefetch',
        href: 'https://www.googletagmanager.com'
      },
      
      // Social media domains
      {
        rel: 'dns-prefetch',
        href: 'https://instagram.com'
      },
      {
        rel: 'dns-prefetch',
        href: 'https://pinterest.com'
      },
      
      // Image optimization services
      {
        rel: 'preconnect',
        href: 'https://images.unsplash.com'
      },
      
      // Critical CSS preloading
      {
        rel: 'preload',
        href: '/css/critical.css',
        as: 'style'
      },
      
      // Essential JavaScript modules
      {
        rel: 'modulepreload',
        href: '/js/critical-performance.js'
      }
    ]
  }

  /**
   * Implement critical resource preloading
   */
  static implementCriticalResourcePreloading(): {
    images: Array<{src: string, priority: boolean, sizes: string}>
    scripts: Array<{src: string, strategy: string}>
    stylesheets: Array<{href: string, media: string}>
  } {
    return {
      images: [
        {
          src: '/images/hero-image.webp',
          priority: true,
          sizes: '(max-width: 768px) 100vw, 50vw'
        },
        {
          src: '/images/luis-portrait.webp',
          priority: true,
          sizes: '(max-width: 768px) 200px, 300px'
        },
        {
          src: '/images/travel-collage.webp',
          priority: false,
          sizes: '(max-width: 768px) 100vw, 80vw'
        }
      ],
      scripts: [
        {
          src: '/js/critical-analytics.js',
          strategy: 'afterInteractive'
        },
        // {
        //   src: '/js/performance-monitor.js',
        //   strategy: 'beforeInteractive'
        // },
        {
          src: '/js/lazy-loading.js',
          strategy: 'lazyOnload'
        }
      ],
      stylesheets: [
        {
          href: '/css/critical.css',
          media: 'all'
        },
        {
          href: '/css/print.css',
          media: 'print'
        },
        {
          href: '/css/large-screens.css',
          media: '(min-width: 1200px)'
        }
      ]
    }
  }

  /**
   * Advanced bundle optimization and code splitting
   */
  static implementAdvancedBundleSplitting(): {
    entryPoints: string[]
    sharedChunks: string[]
    dynamicImports: string[]
  } {
    return {
      entryPoints: [
        'src/app/layout.tsx',      // Main layout bundle
        'src/app/page.tsx',        // Home page bundle
        'src/app/blog/page.tsx',   // Blog listing bundle
        'src/app/gallery/page.tsx' // Gallery bundle
      ],
      sharedChunks: [
        'react',
        'react-dom',
        'next',
        '@/lib/utils',
        '@/components/ui'
      ],
      dynamicImports: [
        'src/components/gallery/ImageViewer.tsx',
        'src/components/blog/CommentSystem.tsx',
        'src/components/contact/ContactForm.tsx',
        'src/lib/analytics/tracking.ts'
      ]
    }
  }

  /**
   * Intelligent image optimization strategy
   */
  static generateImageOptimizationStrategy(): {
    formats: string[]
    breakpoints: number[]
    quality: number
    placeholder: string
  } {
    return {
      formats: ['avif', 'webp', 'jpeg'], // Preferred order
      breakpoints: [640, 768, 1024, 1280, 1536],
      quality: 90,
      placeholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGxwf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyGDzfaU'
    }
  }

  /**
   * Service Worker implementation for advanced caching
   */
  static generateServiceWorkerStrategy(): {
    cacheStrategies: Array<{
      pattern: string
      strategy: string
      cacheName: string
      maxAge?: number
    }>
  } {
    return {
      cacheStrategies: [
        {
          pattern: '/_next/static/',
          strategy: 'CacheFirst',
          cacheName: 'static-assets',
          maxAge: 31536000 // 1 year
        },
        {
          pattern: '/images/',
          strategy: 'CacheFirst', 
          cacheName: 'images',
          maxAge: 2592000 // 30 days
        },
        {
          pattern: '/api/',
          strategy: 'NetworkFirst',
          cacheName: 'api-cache',
          maxAge: 300 // 5 minutes
        },
        {
          pattern: '/blog/',
          strategy: 'StaleWhileRevalidate',
          cacheName: 'blog-pages',
          maxAge: 86400 // 1 day
        },
        {
          pattern: '/gallery/',
          strategy: 'StaleWhileRevalidate',
          cacheName: 'gallery-pages',
          maxAge: 86400 // 1 day
        }
      ]
    }
  }

  /**
   * Predictive resource loading based on user behavior
   */
  static implementPredictivePreloading(): void {
    if (typeof window === 'undefined') return

    // Track user interactions for prediction
    const interactionHistory: string[] = []
    
    // Listen for navigation hints
    document.addEventListener('mouseover', (e) => {
      const link = (e.target as Element).closest('a')
      if (link && link.href) {
        this.considerPreloading(link.href, 'hover')
      }
    })

    // Listen for touch events on mobile
    document.addEventListener('touchstart', (e) => {
      const link = (e.target as Element).closest('a')
      if (link && link.href) {
        this.considerPreloading(link.href, 'touch')
      }
    })

    // Intersection observer for viewport-based preloading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target.closest('a')
          if (link && link.href) {
            this.considerPreloading(link.href, 'viewport')
          }
        }
      })
    }, { threshold: 0.1 })

    // Observe all links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      observer.observe(link)
    })
  }

  /**
   * Consider preloading a resource based on user signals
   */
  private static considerPreloading(href: string, signal: 'hover' | 'touch' | 'viewport'): void {
    if (this.loadedResources.has(href)) return

    // Scoring system for preload decisions
    let score = 0
    
    switch (signal) {
      case 'hover':
        score = 80 // High probability
        break
      case 'touch':
        score = 95 // Very high probability
        break
      case 'viewport':
        score = 30 // Lower probability
        break
    }

    // Additional scoring factors
    if (href.includes('/blog/')) score += 20
    if (href.includes('/gallery/')) score += 15
    if (href === '/contact') score += 10

    // Preload if score is high enough
    if (score >= 50) {
      this.preloadPage(href)
    }
  }

  /**
   * Preload a page and its critical resources
   */
  private static preloadPage(href: string): void {
    if (this.loadedResources.has(href)) return

    // Preload the page
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)

    this.loadedResources.add(href)

    // Preload critical resources for the page
    this.preloadPageResources(href)
  }

  /**
   * Preload critical resources for a specific page
   */
  private static preloadPageResources(href: string): void {
    const resourceMap: { [key: string]: string[] } = {
      '/blog': [
        '/api/blog/posts',
        '/images/blog-hero.webp'
      ],
      '/gallery': [
        '/api/gallery/images',
        '/images/gallery-preview.webp'
      ],
      '/contact': [
        '/js/contact-form.js',
        '/css/contact-styles.css'
      ]
    }

    const resources = resourceMap[href] || []
    
    resources.forEach(resource => {
      if (!this.loadedResources.has(resource)) {
        const link = document.createElement('link')
        
        if (resource.endsWith('.js')) {
          link.rel = 'prefetch'
          link.as = 'script'
        } else if (resource.endsWith('.css')) {
          link.rel = 'prefetch'
          link.as = 'style'
        } else if (resource.includes('/api/')) {
          link.rel = 'prefetch'
        } else {
          link.rel = 'prefetch'
          link.as = 'image'
        }
        
        link.href = resource
        document.head.appendChild(link)
        this.loadedResources.add(resource)
      }
    })
  }

  /**
   * Monitor resource loading performance
   */
  static initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Monitor resource loading times
    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          this.analyzeResourcePerformance(entry as PerformanceResourceTiming)
        }
      }
    })

    this.performanceObserver.observe({ entryTypes: ['resource'] })
  }

  /**
   * Analyze individual resource performance
   */
  private static analyzeResourcePerformance(entry: PerformanceResourceTiming): void {
    const { name, duration, transferSize, decodedBodySize } = entry
    
    // Identify slow resources
    if (duration > 1000) { // Resources taking > 1 second
      console.warn(`🐌 Slow resource detected: ${name} (${duration.toFixed(2)}ms)`)
    }

    // Identify large resources
    if (transferSize > 500000) { // Resources > 500KB
      console.warn(`📦 Large resource detected: ${name} (${(transferSize / 1024).toFixed(2)}KB)`)
    }

    // Calculate compression ratio
    if (transferSize && decodedBodySize) {
      const compressionRatio = 1 - (transferSize / decodedBodySize)
      if (compressionRatio < 0.3) { // Less than 30% compression
        console.warn(`🗜️ Poor compression: ${name} (${(compressionRatio * 100).toFixed(1)}%)`)
      }
    }
  }

  /**
   * Generate performance optimization recommendations
   */
  static generateOptimizationRecommendations(): string[] {
    const recommendations: string[] = []

    // Check current performance metrics
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation.loadEventEnd - navigation.startTime > 3000) {
        recommendations.push('Overall page load time exceeds 3 seconds')
        recommendations.push('Consider implementing code splitting and lazy loading')
      }

      if (navigation.domContentLoadedEventEnd - navigation.startTime > 1500) {
        recommendations.push('DOM Content Loaded time is high')
        recommendations.push('Optimize critical rendering path and defer non-critical CSS/JS')
      }
    }

    // Check resource count
    const resourceEntries = performance.getEntriesByType('resource')
    if (resourceEntries.length > 50) {
      recommendations.push(`High resource count (${resourceEntries.length} resources)`)
      recommendations.push('Consider bundling CSS/JS files and optimizing images')
    }

    return recommendations
  }

  /**
   * Clean up performance monitoring
   */
  static cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
      this.performanceObserver = null
    }
    this.loadedResources.clear()
    this.criticalResourcesCache.clear()
  }
}

/**
 * Critical CSS extraction utility
 */
export class CriticalCSSExtractor {
  /**
   * Extract critical CSS for above-the-fold content
   */
  static extractCriticalCSS(): string {
    const criticalSelectors = [
      // Layout
      'html', 'body', 'main', 'header', 'nav', 'footer',
      
      // Typography
      'h1', 'h2', 'h3', 'p', 'a',
      
      // Navigation
      '.navigation', '.breadcrumbs', '.menu',
      
      // Hero/Above-fold content
      '.hero', '.hero-image', '.intro', '.featured',
      
      // Critical components
      '.logo', '.search', '.cta-button'
    ]

    return `
      /* Critical CSS for above-the-fold content */
      html { font-family: Inter, sans-serif; }
      body { margin: 0; padding: 0; line-height: 1.6; }
      .hero { min-height: 50vh; display: flex; align-items: center; }
      .navigation { position: sticky; top: 0; z-index: 100; }
      h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
      .cta-button { 
        background: #3b82f6; 
        color: white; 
        padding: 0.75rem 1.5rem; 
        border-radius: 0.5rem; 
        text-decoration: none;
        display: inline-block;
        transition: background-color 0.2s;
      }
      .cta-button:hover { background: #2563eb; }
    `
  }
}

export default ResourceOptimizer