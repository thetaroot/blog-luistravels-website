/**
 * Advanced Code Splitting Manager
 * SEO-Dominance-2025 - Enterprise-level dynamic imports and lazy loading
 * Optimized for Core Web Vitals and Time to Interactive (TTI)
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react'

export interface LazyLoadConfig {
  chunkName?: string
  prefetch?: boolean
  preload?: boolean
  fallback?: ComponentType
  errorBoundary?: ComponentType
  retryCount?: number
  timeout?: number
  critical?: boolean
}

export interface RouteChunk {
  path: string
  component: LazyExoticComponent<ComponentType<any>>
  priority: 'critical' | 'high' | 'medium' | 'low'
  prefetchCondition?: () => boolean
  preloadCondition?: () => boolean
}

export interface ComponentChunk {
  name: string
  loader: () => Promise<{ default: ComponentType<any> }>
  config: LazyLoadConfig
  size?: number
  dependencies?: string[]
}

/**
 * Enterprise Code Splitting Manager
 */
export class CodeSplittingManager {
  private static instance: CodeSplittingManager
  private routeChunks: Map<string, RouteChunk> = new Map()
  private componentChunks: Map<string, ComponentChunk> = new Map()
  private preloadedChunks: Set<string> = new Set()
  private prefetchedChunks: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<any>> = new Map()

  private constructor() {
    this.initializeChunks()
    this.setupIntersectionObserver()
  }

  static getInstance(): CodeSplittingManager {
    if (!CodeSplittingManager.instance) {
      CodeSplittingManager.instance = new CodeSplittingManager()
    }
    return CodeSplittingManager.instance
  }

  /**
   * Create optimized lazy component with advanced configuration
   */
  createLazyComponent<T extends ComponentType<any>>(
    loader: () => Promise<{ default: T }>,
    config: LazyLoadConfig = {}
  ): LazyExoticComponent<T> {
    const {
      chunkName,
      prefetch = false,
      preload = false,
      retryCount = 3,
      timeout = 30000,
      critical = false
    } = config

    // Enhanced loader with retry mechanism and performance tracking
    const enhancedLoader = async (): Promise<{ default: T }> => {
      const startTime = performance.now()
      let lastError: Error | null = null

      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const loadPromise = loader()
          
          // Add timeout protection
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Component load timeout')), timeout)
          })

          const component = await Promise.race([loadPromise, timeoutPromise])
          
          // Track loading performance
          const loadTime = performance.now() - startTime
          this.reportLoadingMetrics(chunkName || 'unknown', loadTime, attempt)
          
          // Prefetch/preload related chunks
          if (prefetch) this.handlePrefetch(chunkName)
          if (preload) this.handlePreload(chunkName)
          
          return component

        } catch (error) {
          lastError = error as Error
          console.warn(`Component load attempt ${attempt} failed:`, error)
          
          if (attempt < retryCount) {
            // Exponential backoff
            await this.delay(Math.pow(2, attempt) * 1000)
          }
        }
      }

      // All retries failed
      console.error(`Failed to load component after ${retryCount} attempts:`, lastError)
      throw lastError || new Error('Component loading failed')
    }

    // Create lazy component with enhanced loader
    const LazyComponent = lazy(enhancedLoader)
    
    // Register chunk for management
    if (chunkName) {
      this.componentChunks.set(chunkName, {
        name: chunkName,
        loader,
        config
      })
    }

    return LazyComponent
  }

  /**
   * Prefetch components based on user interaction patterns
   */
  async prefetchComponent(chunkName: string): Promise<void> {
    if (this.prefetchedChunks.has(chunkName)) return

    const chunk = this.componentChunks.get(chunkName)
    if (!chunk) {
      console.warn(`Component chunk '${chunkName}' not found`)
      return
    }

    try {
      console.log(`🔄 Prefetching component: ${chunkName}`)
      
      // Use requestIdleCallback for non-blocking prefetch
      const prefetchPromise = new Promise<void>((resolve) => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(async () => {
            try {
              await chunk.loader()
              this.prefetchedChunks.add(chunkName)
              console.log(`✅ Prefetched component: ${chunkName}`)
              resolve()
            } catch (error) {
              console.warn(`❌ Prefetch failed for ${chunkName}:`, error)
              resolve()
            }
          })
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(async () => {
            try {
              await chunk.loader()
              this.prefetchedChunks.add(chunkName)
              resolve()
            } catch (error) {
              console.warn(`❌ Prefetch failed for ${chunkName}:`, error)
              resolve()
            }
          }, 0)
        }
      })

      this.loadingPromises.set(`prefetch-${chunkName}`, prefetchPromise)
      await prefetchPromise

    } catch (error) {
      console.error(`Prefetch error for ${chunkName}:`, error)
    }
  }

  /**
   * Preload critical components for immediate availability
   */
  async preloadComponent(chunkName: string): Promise<void> {
    if (this.preloadedChunks.has(chunkName)) return

    const chunk = this.componentChunks.get(chunkName)
    if (!chunk) {
      console.warn(`Component chunk '${chunkName}' not found`)
      return
    }

    try {
      console.log(`⚡ Preloading component: ${chunkName}`)
      
      const preloadPromise = chunk.loader()
      this.loadingPromises.set(`preload-${chunkName}`, preloadPromise)
      
      await preloadPromise
      this.preloadedChunks.add(chunkName)
      
      console.log(`✅ Preloaded component: ${chunkName}`)

    } catch (error) {
      console.error(`Preload error for ${chunkName}:`, error)
    }
  }

  /**
   * Intelligent route-based prefetching
   */
  prefetchRoute(pathname: string): void {
    const routeChunk = this.routeChunks.get(pathname)
    if (!routeChunk) return

    // Check prefetch condition
    if (routeChunk.prefetchCondition && !routeChunk.prefetchCondition()) {
      return
    }

    // Prefetch based on priority
    switch (routeChunk.priority) {
      case 'critical':
        this.preloadComponent(pathname)
        break
      case 'high':
        setTimeout(() => this.prefetchComponent(pathname), 100)
        break
      case 'medium':
        setTimeout(() => this.prefetchComponent(pathname), 1000)
        break
      case 'low':
        setTimeout(() => this.prefetchComponent(pathname), 3000)
        break
    }
  }

  /**
   * Setup intersection observer for automatic prefetching
   */
  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const prefetchRoute = target.dataset.prefetch
            
            if (prefetchRoute && !this.prefetchedChunks.has(prefetchRoute)) {
              this.prefetchComponent(prefetchRoute)
            }
          }
        })
      },
      {
        rootMargin: '100px', // Start prefetching 100px before entering viewport
        threshold: 0.1
      }
    )

    // Store observer for cleanup
    ;(window as any).__codeSplittingObserver = observer
  }

  /**
   * Initialize chunk configurations
   */
  private initializeChunks(): void {
    // Route chunks - using generic component imports
    this.routeChunks.set('/', {
      path: '/',
      component: lazy(() => Promise.resolve({ default: () => null })), // Placeholder
      priority: 'critical'
    })

    this.routeChunks.set('/blog', {
      path: '/blog',
      component: lazy(() => Promise.resolve({ default: () => null })), // Placeholder
      priority: 'high',
      prefetchCondition: () => window.scrollY > 100
    })

    this.routeChunks.set('/gallery', {
      path: '/gallery',
      component: lazy(() => Promise.resolve({ default: () => null })), // Placeholder
      priority: 'medium',
      prefetchCondition: () => document.querySelector('[data-gallery-trigger]') !== null
    })

    this.routeChunks.set('/contact', {
      path: '/contact',
      component: lazy(() => Promise.resolve({ default: () => null })), // Placeholder
      priority: 'low'
    })

    // Component chunks for heavy/interactive components
    // GalleryLightbox will be added when the component exists
    // this.componentChunks.set('GalleryLightbox', {
    //   name: 'GalleryLightbox',
    //   loader: () => import('@/components/gallery/GalleryLightbox'),
    //   config: {
    //     chunkName: 'gallery-lightbox',
    //     prefetch: true,
    //     timeout: 15000
    //   }
    // })

    // ContactForm will be added when the component exists
    // this.componentChunks.set('ContactForm', {
    //   name: 'ContactForm',
    //   loader: () => import('@/components/contact/ContactForm'),
    //   config: {
    //     chunkName: 'contact-form',
    //     prefetch: false,
    //     timeout: 10000
    //   }
    // })
  }

  /**
   * Handle prefetch logic
   */
  private handlePrefetch(chunkName?: string): void {
    if (!chunkName) return
    
    // Prefetch related chunks based on chunk relationships
    const relatedChunks = this.getRelatedChunks(chunkName)
    relatedChunks.forEach(related => {
      setTimeout(() => this.prefetchComponent(related), 2000)
    })
  }

  /**
   * Handle preload logic
   */
  private handlePreload(chunkName?: string): void {
    if (!chunkName) return
    
    // Preload critical dependencies
    const criticalDeps = this.getCriticalDependencies(chunkName)
    criticalDeps.forEach(dep => {
      this.preloadComponent(dep)
    })
  }

  /**
   * Get related chunks for intelligent prefetching
   */
  private getRelatedChunks(chunkName: string): string[] {
    const relationships: Record<string, string[]> = {
      'BlogPost': ['SocialShare', 'RelatedPosts'],
      'ImageOptimizationDemo': ['AdvancedImage']
    }

    return relationships[chunkName] || []
  }

  /**
   * Get critical dependencies
   */
  private getCriticalDependencies(chunkName: string): string[] {
    const dependencies: Record<string, string[]> = {
      'ImageOptimizationDemo': ['AdvancedImage'],
      'PerformanceMonitor': ['Analytics']
    }

    return dependencies[chunkName] || []
  }

  /**
   * Report loading metrics for performance monitoring
   */
  private reportLoadingMetrics(chunkName: string, loadTime: number, attempts: number): void {
    console.log(`📊 Chunk loaded: ${chunkName} (${loadTime.toFixed(2)}ms, ${attempts} attempts)`)
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'chunk_load', {
        event_category: 'Performance',
        event_label: chunkName,
        value: Math.round(loadTime),
        attempts: attempts
      })
    }

    // Report slow chunks
    if (loadTime > 3000) {
      console.warn(`🐌 Slow chunk load detected: ${chunkName} (${loadTime.toFixed(2)}ms)`)
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get loading statistics
   */
  getLoadingStats(): {
    preloadedCount: number
    prefetchedCount: number
    pendingLoads: number
    chunks: {
      routes: string[]
      components: string[]
    }
  } {
    return {
      preloadedCount: this.preloadedChunks.size,
      prefetchedCount: this.prefetchedChunks.size,
      pendingLoads: this.loadingPromises.size,
      chunks: {
        routes: Array.from(this.routeChunks.keys()),
        components: Array.from(this.componentChunks.keys())
      }
    }
  }
}

export default CodeSplittingManager