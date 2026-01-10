/**
 * Enterprise Critical Resource Preloader
 * SEO-Dominance-2025 - Advanced resource preloading for maximum Core Web Vitals performance
 * Google Senior Dev Level implementation for optimal LCP, FCP, and TTI optimization
 */

export interface PreloadResource {
  url: string
  type: 'script' | 'style' | 'font' | 'image' | 'fetch' | 'document'
  priority: 'critical' | 'high' | 'medium' | 'low'
  crossOrigin?: 'anonymous' | 'use-credentials'
  media?: string
  as?: string
  integrity?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}

export interface PreloadStrategy {
  immediate: PreloadResource[]
  afterDOMContentLoaded: PreloadResource[]
  onIdle: PreloadResource[]
  onInteraction: PreloadResource[]
  onVisible: PreloadResource[]
}

export interface ResourceMetrics {
  url: string
  loadTime: number
  size: number
  cacheHit: boolean
  priority: string
  type: string
  timestamp: number
}

/**
 * Advanced Critical Resource Preloader
 */
export class CriticalResourcePreloader {
  private static instance: CriticalResourcePreloader
  private preloadedResources: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<void>> = new Map()
  private resourceMetrics: ResourceMetrics[] = []
  private intersectionObserver: IntersectionObserver | null = null
  private isInitialized: boolean = false

  private constructor() {}

  static getInstance(): CriticalResourcePreloader {
    if (!CriticalResourcePreloader.instance) {
      CriticalResourcePreloader.instance = new CriticalResourcePreloader()
    }
    return CriticalResourcePreloader.instance
  }

  /**
   * Initialize the resource preloader with enterprise-grade strategies
   */
  initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return

    console.log('🚀 Initializing Critical Resource Preloader...')

    this.isInitialized = true
    this.setupIntersectionObserver()
    this.preloadCriticalResources()
    this.setupPerformanceMonitoring()

    console.log('✅ Critical Resource Preloader initialized')
  }

  /**
   * Preload critical resources immediately
   */
  private async preloadCriticalResources(): Promise<void> {
    const criticalResources: PreloadResource[] = [
      // Critical fonts for preventing FOUT/FOIT - disabled until font exists
      // {
      //   url: '/fonts/inter-var.woff2',
      //   type: 'font',
      //   priority: 'critical',
      //   crossOrigin: 'anonymous',
      //   as: 'font'
      // },
      
      // Hero images for LCP optimization
      {
        url: '/images/portrait.jpg',
        type: 'image',
        priority: 'critical',
        as: 'image'
      },
      
      // Critical CSS for preventing FOUC
      {
        url: '/_next/static/css/app.css',
        type: 'style',
        priority: 'critical',
        media: 'all'
      },
      
      // Next.js runtime for faster hydration
      {
        url: '/_next/static/chunks/webpack-runtime.js',
        type: 'script',
        priority: 'high',
        as: 'script'
      }
    ]

    // Preload critical resources immediately
    const criticalPromises = criticalResources.map(resource => 
      this.preloadResource(resource)
    )

    try {
      await Promise.allSettled(criticalPromises)
      console.log(`✅ Preloaded ${criticalResources.length} critical resources`)
    } catch (error) {
      console.error('❌ Critical resource preloading failed:', error)
    }

    // Schedule non-critical resources
    this.scheduleNonCriticalPreloads()
  }

  /**
   * Schedule non-critical resource preloading
   */
  private scheduleNonCriticalPreloads(): void {
    // After DOM content loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.preloadAfterDOMContentLoaded()
      })
    } else {
      this.preloadAfterDOMContentLoaded()
    }

    // On idle
    this.scheduleIdlePreloads()

    // On user interaction
    this.scheduleInteractionPreloads()
  }

  /**
   * Preload resources after DOM content loaded
   */
  private async preloadAfterDOMContentLoaded(): Promise<void> {
    const deferredResources: PreloadResource[] = [
      // Gallery images for faster interaction
      {
        url: '/images/gallery-preview.jpg',
        type: 'image',
        priority: 'medium',
        as: 'image'
      },
      
      // Performance monitoring components - disabled until chunk exists
      // {
      //   url: '/_next/static/chunks/performance-monitor.js',
      //   type: 'script',
      //   priority: 'medium',
      //   as: 'script'
      // }
    ]

    const promises = deferredResources.map(resource => this.preloadResource(resource))
    await Promise.allSettled(promises)
    
    console.log(`✅ Preloaded ${deferredResources.length} deferred resources`)
  }

  /**
   * Schedule idle preloads using requestIdleCallback
   */
  private scheduleIdlePreloads(): void {
    const idleResources: PreloadResource[] = [
      // Analytics scripts
      {
        url: 'https://www.googletagmanager.com/gtag/js',
        type: 'script',
        priority: 'low',
        as: 'script'
      },
      
      // Image optimization components - disabled until chunk exists
      // {
      //   url: '/_next/static/chunks/image-optimization.js',
      //   type: 'script',
      //   priority: 'low',
      //   as: 'script'
      // }
    ]

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        idleResources.forEach(resource => this.preloadResource(resource))
      }, { timeout: 5000 })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        idleResources.forEach(resource => this.preloadResource(resource))
      }, 3000)
    }
  }

  /**
   * Schedule preloads on user interaction
   */
  private scheduleInteractionPreloads(): void {
    const interactionEvents = ['mousedown', 'touchstart', 'keydown']
    let hasPreloadedOnInteraction = false

    const handleFirstInteraction = () => {
      if (hasPreloadedOnInteraction) return
      hasPreloadedOnInteraction = true

      const interactionResources: PreloadResource[] = [
        // Heavy components for immediate availability - disabled until chunks exist
        // {
        //   url: '/_next/static/chunks/gallery-lightbox.js',
        //   type: 'script',
        //   priority: 'high',
        //   as: 'script'
        // },
        
        // Animation libraries - disabled until chunk exists
        // {
        //   url: '/_next/static/chunks/animations.js',
        //   type: 'script',
        //   priority: 'medium',
        //   as: 'script'
        // }
      ]

      interactionResources.forEach(resource => this.preloadResource(resource))
      
      // Remove event listeners after first interaction
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction, { passive: true } as any)
      })
    }

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { passive: true })
    })
  }

  /**
   * Preload a single resource with advanced error handling and metrics
   */
  async preloadResource(resource: PreloadResource): Promise<void> {
    const { url, type, priority, crossOrigin, media, as, integrity, onLoad, onError } = resource

    // Skip if already preloaded
    if (this.preloadedResources.has(url)) {
      return Promise.resolve()
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!
    }

    const startTime = performance.now()
    let linkElement: HTMLLinkElement | null = null

    const preloadPromise = new Promise<void>((resolve, reject) => {
      try {
        // Create preload link element
        linkElement = document.createElement('link')
        linkElement.rel = 'preload'
        linkElement.href = url
        
        if (crossOrigin) linkElement.crossOrigin = crossOrigin
        if (media) linkElement.media = media
        if (as) linkElement.as = as
        if (integrity) linkElement.integrity = integrity

        // Set fetchpriority based on priority
        if ('fetchPriority' in linkElement) {
          (linkElement as any).fetchPriority = priority === 'critical' ? 'high' : 
                                                 priority === 'high' ? 'high' :
                                                 priority === 'medium' ? 'auto' : 'low'
        }

        // Handle load/error events
        linkElement.onload = () => {
          const loadTime = performance.now() - startTime
          this.recordResourceMetrics(url, loadTime, type, priority, true)
          this.preloadedResources.add(url)
          onLoad?.()
          resolve()
        }

        linkElement.onerror = () => {
          const loadTime = performance.now() - startTime
          const error = new Error(`Failed to preload resource: ${url}`)
          this.recordResourceMetrics(url, loadTime, type, priority, false)
          onError?.(error)
          reject(error)
        }

        // Add to document head
        document.head.appendChild(linkElement)

        // Timeout protection
        setTimeout(() => {
          if (!this.preloadedResources.has(url)) {
            const error = new Error(`Preload timeout for resource: ${url}`)
            onError?.(error)
            reject(error)
          }
        }, 10000) // 10 second timeout

      } catch (error) {
        const loadTime = performance.now() - startTime
        this.recordResourceMetrics(url, loadTime, type, priority, false)
        onError?.(error as Error)
        reject(error)
      }
    })

    this.loadingPromises.set(url, preloadPromise)

    try {
      await preloadPromise
    } finally {
      this.loadingPromises.delete(url)
    }
  }

  /**
   * Preload resources when they become visible
   */
  preloadOnVisible(resources: PreloadResource[], target: Element): void {
    if (!this.intersectionObserver) return

    const observer = this.intersectionObserver as IntersectionObserver

    // Store resources in element dataset for retrieval
    (target as any).__preloadResources = resources

    observer.observe(target)
  }

  /**
   * Setup intersection observer for visibility-based preloading
   */
  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const resources = (entry.target as any).__preloadResources as PreloadResource[]
            if (resources) {
              resources.forEach(resource => this.preloadResource(resource))
              this.intersectionObserver!.unobserve(entry.target)
            }
          }
        })
      },
      {
        rootMargin: '100px', // Start preloading 100px before entering viewport
        threshold: 0.1
      }
    )
  }

  /**
   * Record resource loading metrics
   */
  private recordResourceMetrics(
    url: string,
    loadTime: number,
    type: string,
    priority: string,
    success: boolean
  ): void {
    const metrics: ResourceMetrics = {
      url,
      loadTime,
      size: 0, // Would need to measure actual size
      cacheHit: loadTime < 50, // Heuristic for cache hit
      priority,
      type,
      timestamp: Date.now()
    }

    this.resourceMetrics.push(metrics)

    // Log slow preloads
    if (loadTime > 2000) {
      console.warn(`🐌 Slow resource preload: ${url} (${loadTime.toFixed(2)}ms)`)
    }

    // Report to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'resource_preload', {
        event_category: 'Performance',
        event_label: url,
        value: Math.round(loadTime),
        resource_type: type,
        priority: priority,
        success: success
      })
    }
  }

  /**
   * Setup performance monitoring for preloaded resources
   */
  private setupPerformanceMonitoring(): void {
    // Monitor resource timing
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          if (this.preloadedResources.has(resourceEntry.name)) {
            this.analyzeResourcePerformance(resourceEntry)
          }
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Resource timing monitoring not supported:', error)
    }

    // Report metrics periodically
    setInterval(() => {
      this.reportPreloadMetrics()
    }, 30000) // Every 30 seconds

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportPreloadMetrics()
    })
  }

  /**
   * Analyze resource performance
   */
  private analyzeResourcePerformance(entry: PerformanceResourceTiming): void {
    const cacheHit = entry.transferSize === 0 && entry.decodedBodySize > 0
    const networkTime = entry.responseEnd - entry.requestStart
    const totalTime = entry.responseEnd - entry.startTime

    console.log(`📊 Resource Performance: ${entry.name}`, {
      totalTime: `${totalTime.toFixed(2)}ms`,
      networkTime: `${networkTime.toFixed(2)}ms`,
      cacheHit,
      transferSize: `${(entry.transferSize / 1024).toFixed(2)}KB`,
      decodedSize: `${(entry.decodedBodySize / 1024).toFixed(2)}KB`
    })
  }

  /**
   * Report preload metrics
   */
  private reportPreloadMetrics(): void {
    if (this.resourceMetrics.length === 0) return

    const summary = {
      totalPreloads: this.resourceMetrics.length,
      averageLoadTime: this.resourceMetrics.reduce((sum, m) => sum + m.loadTime, 0) / this.resourceMetrics.length,
      cacheHitRate: this.resourceMetrics.filter(m => m.cacheHit).length / this.resourceMetrics.length,
      typeDistribution: this.resourceMetrics.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      priorityDistribution: this.resourceMetrics.reduce((acc, m) => {
        acc[m.priority] = (acc[m.priority] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    console.log('📈 Preload Performance Summary:', summary)

    // Clear metrics after reporting
    this.resourceMetrics = []
  }

  /**
   * Get preload statistics
   */
  getPreloadStats(): {
    preloadedCount: number
    pendingCount: number
    metrics: ResourceMetrics[]
    averageLoadTime: number
    cacheHitRate: number
  } {
    return {
      preloadedCount: this.preloadedResources.size,
      pendingCount: this.loadingPromises.size,
      metrics: [...this.resourceMetrics],
      averageLoadTime: this.resourceMetrics.length > 0 
        ? this.resourceMetrics.reduce((sum, m) => sum + m.loadTime, 0) / this.resourceMetrics.length 
        : 0,
      cacheHitRate: this.resourceMetrics.length > 0
        ? this.resourceMetrics.filter(m => m.cacheHit).length / this.resourceMetrics.length
        : 0
    }
  }

  /**
   * Preload route-specific resources
   */
  preloadRouteResources(route: string): void {
    const routeResources: Record<string, PreloadResource[]> = {
      '/blog': [
        { url: '/_next/static/chunks/blog-page.js', type: 'script', priority: 'high', as: 'script' },
        { url: '/images/blog-hero.jpg', type: 'image', priority: 'medium', as: 'image' }
      ],
      '/gallery': [
        { url: '/_next/static/chunks/gallery-page.js', type: 'script', priority: 'high', as: 'script' }
        // { url: '/_next/static/chunks/gallery-lightbox.js', type: 'script', priority: 'medium', as: 'script' } // disabled until chunk exists
      ],
      '/contact': [
        { url: '/_next/static/chunks/contact-page.js', type: 'script', priority: 'high', as: 'script' },
        { url: '/_next/static/chunks/contact-form.js', type: 'script', priority: 'medium', as: 'script' }
      ]
    }

    const resources = routeResources[route]
    if (resources) {
      resources.forEach(resource => this.preloadResource(resource))
    }
  }

  /**
   * Cleanup and disconnect observers
   */
  cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }
    
    this.preloadedResources.clear()
    this.loadingPromises.clear()
    this.resourceMetrics = []
    this.isInitialized = false
  }
}

export default CriticalResourcePreloader