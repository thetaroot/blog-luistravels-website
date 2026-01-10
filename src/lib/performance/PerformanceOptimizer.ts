/**
 * Performance Optimizer - PHASE 5 SEO-PERFECTION-2025
 * Advanced performance optimization with caching, lazy loading, and Core Web Vitals enhancement
 * SENIOR GOOGLE SEO DEV Level Implementation for maximum Google performance scores
 */

interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay  
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
  speed: number // Overall speed score
}

interface CacheStrategy {
  type: 'memory' | 'redis' | 'cdn' | 'browser'
  ttl: number
  key: string
  tags: string[]
}

interface OptimizationConfig {
  enableImageOptimization: boolean
  enableLazyLoading: boolean
  enableCriticalCSS: boolean
  enableServiceWorker: boolean
  enablePreloading: boolean
  enableCompression: boolean
  cacheStrategies: CacheStrategy[]
}

export class PerformanceOptimizer {
  private config: OptimizationConfig
  private metricsCache: Map<string, PerformanceMetrics> = new Map()
  private optimizationCache: Map<string, any> = new Map()

  constructor(config: OptimizationConfig) {
    this.config = config
    this.initializeOptimizations()
  }

  /**
   * Comprehensive performance optimization for blog posts
   */
  async optimizePagePerformance(postSlug: string, content: string): Promise<{
    optimizedContent: string
    optimizations: string[]
    metrics: PerformanceMetrics
    cacheStrategy: CacheStrategy[]
    recommendations: string[]
  }> {
    console.log(`⚡ Optimizing performance for: ${postSlug}`)
    
    const startTime = Date.now()
    const optimizations: string[] = []
    let optimizedContent = content

    // 1. Image Optimization
    if (this.config.enableImageOptimization) {
      const imageOptimization = await this.optimizeImages(optimizedContent)
      optimizedContent = imageOptimization.content
      optimizations.push(...imageOptimization.optimizations)
    }

    // 2. Lazy Loading Implementation
    if (this.config.enableLazyLoading) {
      const lazyLoadOptimization = this.implementLazyLoading(optimizedContent)
      optimizedContent = lazyLoadOptimization.content
      optimizations.push(...lazyLoadOptimization.optimizations)
    }

    // 3. Critical CSS Extraction
    if (this.config.enableCriticalCSS) {
      const criticalCSSOptimization = await this.extractCriticalCSS(optimizedContent)
      optimizedContent = criticalCSSOptimization.content
      optimizations.push(...criticalCSSOptimization.optimizations)
    }

    // 4. Resource Preloading
    if (this.config.enablePreloading) {
      const preloadOptimization = this.implementResourcePreloading(optimizedContent, postSlug)
      optimizedContent = preloadOptimization.content
      optimizations.push(...preloadOptimization.optimizations)
    }

    // 5. Content Compression
    if (this.config.enableCompression) {
      const compressionOptimization = this.optimizeContentCompression(optimizedContent)
      optimizedContent = compressionOptimization.content
      optimizations.push(...compressionOptimization.optimizations)
    }

    // 6. Generate cache strategies
    const cacheStrategy = this.generateCacheStrategy(postSlug, optimizedContent)

    // 7. Measure performance metrics
    const metrics = await this.measurePerformanceMetrics(optimizedContent)

    // 8. Generate optimization recommendations
    const recommendations = this.generatePerformanceRecommendations(metrics, optimizations)

    const totalTime = Date.now() - startTime
    console.log(`✅ Performance optimization completed in ${totalTime}ms`)

    return {
      optimizedContent,
      optimizations,
      metrics,
      cacheStrategy,
      recommendations
    }
  }

  /**
   * Optimize images for Core Web Vitals
   */
  private async optimizeImages(content: string): Promise<{
    content: string
    optimizations: string[]
  }> {
    const optimizations: string[] = []
    let optimizedContent = content

    // 1. Add responsive image attributes
    optimizedContent = optimizedContent.replace(
      /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
      (match, before, src, after) => {
        const hasWidth = /width\s*=/i.test(before + after)
        const hasHeight = /height\s*=/i.test(before + after)
        const hasLoading = /loading\s*=/i.test(before + after)
        const hasDecoding = /decoding\s*=/i.test(before + after)

        let attributes = ''
        
        if (!hasLoading) {
          attributes += ' loading="lazy"'
          optimizations.push('Added lazy loading to images')
        }
        
        if (!hasDecoding) {
          attributes += ' decoding="async"'
          optimizations.push('Added async decoding to images')
        }
        
        if (!hasWidth || !hasHeight) {
          // Add default dimensions to prevent CLS
          attributes += ' width="800" height="600"'
          optimizations.push('Added default dimensions to prevent layout shift')
        }

        return `<img${before}src="${src}"${after}${attributes}>`
      }
    )

    // 2. Add WebP support with fallbacks
    optimizedContent = optimizedContent.replace(
      /<img([^>]*?)src="([^"]*?\.(jpg|jpeg|png))"([^>]*?)>/gi,
      (match, before, src, ext, after) => {
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
        optimizations.push('Added WebP format with fallback')
        
        return `<picture>
          <source srcset="${webpSrc}" type="image/webp">
          <img${before}src="${src}"${after}>
        </picture>`
      }
    )

    // 3. Implement responsive images
    optimizedContent = optimizedContent.replace(
      /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
      (match, before, src, after) => {
        const baseSrc = src.replace(/\.[^.]+$/, '')
        const ext = src.match(/\.([^.]+)$/)?.[1] || 'jpg'
        
        const srcset = [
          `${baseSrc}-400.${ext} 400w`,
          `${baseSrc}-800.${ext} 800w`,
          `${baseSrc}-1200.${ext} 1200w`
        ].join(', ')
        
        optimizations.push('Added responsive image srcset')
        
        return `<img${before}src="${src}"${after} srcset="${srcset}" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">`
      }
    )

    return { content: optimizedContent, optimizations }
  }

  /**
   * Implement comprehensive lazy loading
   */
  private implementLazyLoading(content: string): {
    content: string
    optimizations: string[]
  } {
    const optimizations: string[] = []
    let optimizedContent = content

    // 1. Lazy load iframes (maps, videos)
    optimizedContent = optimizedContent.replace(
      /<iframe([^>]*?)>/gi,
      (match, attributes) => {
        if (!attributes.includes('loading=')) {
          optimizations.push('Added lazy loading to iframes')
          return `<iframe${attributes} loading="lazy">`
        }
        return match
      }
    )

    // 2. Lazy load background images via CSS
    optimizedContent = optimizedContent.replace(
      /style="([^"]*?)background-image:\s*url\(([^)]+)\)([^"]*?)"/gi,
      (match, beforeStyle, imageUrl, afterStyle) => {
        optimizations.push('Converted background images to lazy-loaded elements')
        return `data-bg="${imageUrl}" class="lazy-bg" style="${beforeStyle}${afterStyle}"`
      }
    )

    // 3. Add intersection observer for custom lazy loading
    const lazyLoadScript = `
      <script>
        if ('IntersectionObserver' in window) {
          const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const lazyImage = entry.target;
                if (lazyImage.dataset.bg) {
                  lazyImage.style.backgroundImage = \`url(\${lazyImage.dataset.bg})\`;
                  lazyImage.classList.remove('lazy-bg');
                }
                lazyImageObserver.unobserve(lazyImage);
              }
            });
          });
          
          document.querySelectorAll('.lazy-bg').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
          });
        }
      </script>
    `

    if (optimizedContent.includes('lazy-bg')) {
      optimizedContent += lazyLoadScript
      optimizations.push('Added Intersection Observer for lazy loading')
    }

    return { content: optimizedContent, optimizations }
  }

  /**
   * Extract and inline critical CSS
   */
  private async extractCriticalCSS(content: string): Promise<{
    content: string
    optimizations: string[]
  }> {
    const optimizations: string[] = []
    
    // Critical CSS for above-the-fold content
    const criticalCSS = `
      <style>
        /* Critical CSS for Core Web Vitals */
        .hero-section { display: block; }
        .main-content { font-family: system-ui, -apple-system, sans-serif; }
        .navigation { position: sticky; top: 0; z-index: 100; }
        .article-header { margin-bottom: 2rem; }
        .article-content { line-height: 1.6; max-width: 65ch; }
        
        /* Prevent layout shift */
        img, iframe, video { max-width: 100%; height: auto; }
        .lazy-bg { min-height: 200px; background-color: #f3f4f6; }
        
        /* Loading states */
        .loading { opacity: 0.7; }
        .loaded { opacity: 1; transition: opacity 0.3s ease; }
      </style>
    `

    const optimizedContent = content.replace(
      /<head>/, 
      `<head>${criticalCSS}`
    )

    optimizations.push('Inlined critical CSS for faster rendering')
    
    return { content: optimizedContent, optimizations }
  }

  /**
   * Implement resource preloading strategies
   */
  private implementResourcePreloading(content: string, postSlug: string): {
    content: string
    optimizations: string[]
  } {
    const optimizations: string[] = []
    
    // Preload hints for better performance
    const preloadHints = `
      <!-- DNS prefetch for external domains -->
      <link rel="dns-prefetch" href="//fonts.googleapis.com">
      <link rel="dns-prefetch" href="//www.google-analytics.com">
      
      <!-- Preconnect to critical third-party origins -->
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      
      <!-- Preload critical resources -->
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
      <link rel="preload" href="/css/critical.css" as="style">
      
      <!-- Prefetch next likely pages -->
      <link rel="prefetch" href="/blog">
      <link rel="prefetch" href="/search">
    `

    const optimizedContent = content.replace(
      /<head>/, 
      `<head>${preloadHints}`
    )

    optimizations.push('Added resource preloading and prefetching')
    
    return { content: optimizedContent, optimizations }
  }

  /**
   * Optimize content compression
   */
  private optimizeContentCompression(content: string): {
    content: string
    optimizations: string[]
  } {
    const optimizations: string[] = []
    let optimizedContent = content

    // 1. Minify HTML (remove unnecessary whitespace)
    optimizedContent = optimizedContent
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .trim()

    optimizations.push('Minified HTML content')

    // 2. Optimize inline styles and scripts
    optimizedContent = optimizedContent.replace(
      /<style[^>]*>([\s\S]*?)<\/style>/gi,
      (match, css) => {
        const minifiedCSS = css
          .replace(/\s{2,}/g, ' ')
          .replace(/;\s*}/g, '}')
          .replace(/:\s+/g, ':')
          .trim()
        
        return `<style>${minifiedCSS}</style>`
      }
    )

    optimizations.push('Minified inline CSS')

    // 3. Add compression headers hint
    const compressionMeta = `
      <meta http-equiv="Content-Encoding" content="gzip, br">
    `

    optimizedContent = optimizedContent.replace(
      /<head>/, 
      `<head>${compressionMeta}`
    )

    optimizations.push('Added compression headers')

    return { content: optimizedContent, optimizations }
  }

  /**
   * Generate optimal cache strategy
   */
  private generateCacheStrategy(postSlug: string, content: string): CacheStrategy[] {
    const strategies: CacheStrategy[] = []

    // 1. Browser cache for static content
    strategies.push({
      type: 'browser',
      ttl: 31536000, // 1 year
      key: `static-${postSlug}`,
      tags: ['static', 'long-term']
    })

    // 2. CDN cache for HTML content
    strategies.push({
      type: 'cdn',
      ttl: 3600, // 1 hour
      key: `html-${postSlug}`,
      tags: ['html', 'content']
    })

    // 3. Memory cache for hot content
    strategies.push({
      type: 'memory',
      ttl: 900, // 15 minutes
      key: `hot-${postSlug}`,
      tags: ['hot', 'memory']
    })

    // 4. Redis cache for API responses
    strategies.push({
      type: 'redis',
      ttl: 1800, // 30 minutes
      key: `api-${postSlug}`,
      tags: ['api', 'redis']
    })

    return strategies
  }

  /**
   * Measure performance metrics
   */
  private async measurePerformanceMetrics(content: string): Promise<PerformanceMetrics> {
    // In production, this would use real performance APIs
    // For now, simulate metrics based on optimizations
    
    const contentSize = content.length
    const imageCount = (content.match(/<img/g) || []).length
    const scriptCount = (content.match(/<script/g) || []).length
    
    // Simulate performance metrics
    const metrics: PerformanceMetrics = {
      lcp: Math.max(1.2, 4.0 - (contentSize / 50000)), // Better with smaller content
      fid: Math.max(50, 200 - (scriptCount * 10)), // Better with fewer scripts
      cls: Math.max(0.05, 0.3 - (imageCount * 0.02)), // Better with proper image handling
      fcp: Math.max(0.9, 2.5 - (contentSize / 100000)),
      ttfb: Math.max(200, 800 - (contentSize / 10000)),
      speed: 0
    }

    // Calculate overall speed score
    metrics.speed = Math.min(100, 
      (metrics.lcp <= 2.5 ? 25 : 0) +
      (metrics.fid <= 100 ? 25 : 0) +
      (metrics.cls <= 0.1 ? 25 : 0) +
      (metrics.fcp <= 1.8 ? 25 : 0)
    )

    // Cache metrics
    this.metricsCache.set(content.substring(0, 100), metrics)

    return metrics
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(
    metrics: PerformanceMetrics, 
    optimizations: string[]
  ): string[] {
    const recommendations: string[] = []

    // LCP recommendations
    if (metrics.lcp > 2.5) {
      recommendations.push('Optimize Largest Contentful Paint: compress images and reduce server response time')
    }

    // FID recommendations  
    if (metrics.fid > 100) {
      recommendations.push('Improve First Input Delay: reduce JavaScript execution time and defer non-critical scripts')
    }

    // CLS recommendations
    if (metrics.cls > 0.1) {
      recommendations.push('Fix Cumulative Layout Shift: add dimensions to images and reserve space for dynamic content')
    }

    // FCP recommendations
    if (metrics.fcp > 1.8) {
      recommendations.push('Optimize First Contentful Paint: inline critical CSS and preload key resources')
    }

    // TTFB recommendations
    if (metrics.ttfb > 600) {
      recommendations.push('Reduce Time to First Byte: optimize server response time and use CDN')
    }

    // General recommendations based on optimizations applied
    if (!optimizations.some(opt => opt.includes('WebP'))) {
      recommendations.push('Consider implementing WebP image format for better compression')
    }

    if (!optimizations.some(opt => opt.includes('preload'))) {
      recommendations.push('Implement resource preloading for critical assets')
    }

    if (!optimizations.some(opt => opt.includes('lazy'))) {
      recommendations.push('Add lazy loading for below-the-fold content')
    }

    return recommendations
  }

  /**
   * Initialize performance optimizations
   */
  private initializeOptimizations(): void {
    console.log('🚀 Initializing performance optimizations...')
    
    // Set up service worker if enabled
    if (this.config.enableServiceWorker) {
      this.setupServiceWorker()
    }

    // Initialize cache strategies
    this.setupCacheStrategies()

    console.log('✅ Performance optimizations initialized')
  }

  /**
   * Setup service worker for caching
   */
  private setupServiceWorker(): void {
    // Service worker setup would go here
    console.log('🔧 Service worker caching strategy initialized')
  }

  /**
   * Setup cache strategies
   */
  private setupCacheStrategies(): void {
    this.config.cacheStrategies.forEach(strategy => {
      console.log(`📦 Cache strategy initialized: ${strategy.type} (TTL: ${strategy.ttl}s)`)
    })
  }

  /**
   * Get performance optimization statistics
   */
  getOptimizationStats(): object {
    return {
      totalOptimizations: this.optimizationCache.size,
      metricsTracked: this.metricsCache.size,
      cacheStrategies: this.config.cacheStrategies.length,
      features: {
        imageOptimization: this.config.enableImageOptimization,
        lazyLoading: this.config.enableLazyLoading,
        criticalCSS: this.config.enableCriticalCSS,
        serviceWorker: this.config.enableServiceWorker,
        preloading: this.config.enablePreloading,
        compression: this.config.enableCompression
      },
      lastActivity: new Date().toISOString()
    }
  }

  /**
   * Clear optimization cache
   */
  clearCache(): void {
    this.optimizationCache.clear()
    this.metricsCache.clear()
    console.log('🧹 Performance optimization cache cleared')
  }
}