/**
 * Enterprise Image Optimization System
 * SEO-Dominance-2025 - Google Senior Dev Level
 * Advanced WebP/AVIF support with intelligent format selection
 */

export interface ImageFormat {
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  quality: number
  extension: string
  mimeType: string
  supportDetection: () => boolean
}

export interface ResponsiveBreakpoint {
  width: number
  density: number
  mediaQuery: string
}

export interface ImageOptimizationConfig {
  enableWebP: boolean
  enableAVIF: boolean
  enableResponsive: boolean
  enableLazyLoading: boolean
  enableBlurPlaceholder: boolean
  qualityWebP: number
  qualityAVIF: number
  qualityFallback: number
  cacheStrategy: 'aggressive' | 'standard' | 'minimal'
}

/**
 * Advanced Format Detection & Selection
 */
export class ImageFormatDetector {
  private static supportCache = new Map<string, boolean>()

  /**
   * Detect AVIF support with comprehensive testing
   */
  static async detectAVIFSupport(): Promise<boolean> {
    if (typeof window === 'undefined') return false
    
    const cacheKey = 'avif-support'
    if (this.supportCache.has(cacheKey)) {
      return this.supportCache.get(cacheKey)!
    }

    const avifSupported = await new Promise<boolean>((resolve) => {
      const avifImage = new Image()
      avifImage.onload = () => {
        resolve(avifImage.width === 1 && avifImage.height === 1)
      }
      avifImage.onerror = () => resolve(false)
      // Minimal AVIF test image
      avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })

    this.supportCache.set(cacheKey, avifSupported)
    return avifSupported
  }

  /**
   * Detect WebP support with fallback testing
   */
  static async detectWebPSupport(): Promise<boolean> {
    if (typeof window === 'undefined') return false
    
    const cacheKey = 'webp-support'
    if (this.supportCache.has(cacheKey)) {
      return this.supportCache.get(cacheKey)!
    }

    const webpSupported = await new Promise<boolean>((resolve) => {
      const webpImage = new Image()
      webpImage.onload = () => {
        resolve(webpImage.width === 1 && webpImage.height === 1)
      }
      webpImage.onerror = () => resolve(false)
      // Minimal WebP test image
      webpImage.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })

    this.supportCache.set(cacheKey, webpSupported)
    return webpSupported
  }

  /**
   * Get optimal image format based on browser support
   */
  static async getOptimalFormat(): Promise<string> {
    if (await this.detectAVIFSupport()) {
      return 'avif'
    }
    if (await this.detectWebPSupport()) {
      return 'webp'
    }
    return 'jpeg'
  }
}

/**
 * Responsive Image System
 */
export class ResponsiveImageGenerator {
  private static defaultBreakpoints: ResponsiveBreakpoint[] = [
    { width: 320, density: 1, mediaQuery: '(max-width: 480px)' },
    { width: 480, density: 1, mediaQuery: '(max-width: 768px)' },
    { width: 768, density: 1, mediaQuery: '(max-width: 1024px)' },
    { width: 1024, density: 1, mediaQuery: '(max-width: 1200px)' },
    { width: 1200, density: 1, mediaQuery: '(max-width: 1600px)' },
    { width: 1600, density: 1, mediaQuery: '(min-width: 1601px)' },
    // High-density variants
    { width: 640, density: 2, mediaQuery: '(max-width: 480px) and (-webkit-min-device-pixel-ratio: 2)' },
    { width: 960, density: 2, mediaQuery: '(max-width: 768px) and (-webkit-min-device-pixel-ratio: 2)' },
    { width: 1536, density: 2, mediaQuery: '(max-width: 1024px) and (-webkit-min-device-pixel-ratio: 2)' },
  ]

  /**
   * Generate responsive image sizes string for Next.js Image
   */
  static generateSizes(customBreakpoints?: ResponsiveBreakpoint[]): string {
    const breakpoints = customBreakpoints || this.defaultBreakpoints
    
    return breakpoints
      .map(bp => `${bp.mediaQuery} ${bp.width}px`)
      .join(', ')
  }

  /**
   * Generate srcSet for manual implementation
   */
  static generateSrcSet(
    baseSrc: string, 
    format: string,
    breakpoints?: ResponsiveBreakpoint[]
  ): string {
    const points = breakpoints || this.defaultBreakpoints
    
    return points
      .map(bp => {
        const src = this.buildImageUrl(baseSrc, format, bp.width, 90)
        const descriptor = bp.density > 1 ? `${bp.width}w ${bp.density}x` : `${bp.width}w`
        return `${src} ${descriptor}`
      })
      .join(', ')
  }

  /**
   * Build optimized image URL with Next.js Image API
   */
  private static buildImageUrl(
    src: string, 
    format: string, 
    width: number, 
    quality: number
  ): string {
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: quality.toString(),
      f: format
    })
    
    return `/_next/image?${params.toString()}`
  }
}

/**
 * Image Performance Optimization
 */
export class ImagePerformanceOptimizer {
  private static intersectionObserver: IntersectionObserver | null = null
  private static preloadCache = new Set<string>()

  /**
   * Initialize performance observer for lazy loading optimization
   */
  static initializeLazyLoading(): void {
    if (typeof window === 'undefined' || this.intersectionObserver) return

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            this.intersectionObserver?.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px', // Load images 50px before they come into view
        threshold: 0.1
      }
    )
  }

  /**
   * Preload critical images above the fold
   */
  static preloadCriticalImages(imageUrls: string[]): void {
    imageUrls.forEach(url => {
      if (this.preloadCache.has(url)) return

      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      document.head.appendChild(link)
      
      this.preloadCache.add(url)
    })
  }

  /**
   * Load image with format optimization
   */
  private static async loadImage(img: HTMLImageElement): Promise<void> {
    const originalSrc = img.dataset.src
    if (!originalSrc) return

    try {
      const optimalFormat = await ImageFormatDetector.getOptimalFormat()
      const optimizedSrc = this.getOptimizedSrc(originalSrc, optimalFormat)
      
      img.src = optimizedSrc
      img.classList.add('loaded')
    } catch (error) {
      console.error('Image loading failed:', error)
      img.src = originalSrc // Fallback to original
    }
  }

  /**
   * Get optimized image source with format conversion
   */
  private static getOptimizedSrc(src: string, format: string): string {
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return src // Don't optimize data URLs or blob URLs
    }

    // For Next.js Image API integration
    const params = new URLSearchParams({
      url: src,
      f: format,
      q: '90'
    })

    return `/_next/image?${params.toString()}`
  }

  /**
   * Generate blur placeholder for improved perceived performance
   */
  static generateBlurPlaceholder(src: string): string {
    // Enhanced blur placeholder with better visual quality
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e5e7eb;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:0.6" />
          </linearGradient>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" filter="url(#blur)"/>
        <circle cx="200" cy="150" r="20" fill="#9ca3af" opacity="0.3"/>
      </svg>
    `)}`
  }

  /**
   * Calculate image priority based on position and context
   */
  static calculateImagePriority(
    element: HTMLElement,
    context: 'hero' | 'above-fold' | 'content' | 'gallery'
  ): boolean {
    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    
    // Priority rules based on Google's recommendations
    switch (context) {
      case 'hero':
        return true // Always prioritize hero images
      case 'above-fold':
        return rect.top < viewportHeight * 0.5 // Top 50% of viewport
      case 'content':
        return rect.top < viewportHeight * 0.75 // Top 75% of viewport
      case 'gallery':
        return rect.top < viewportHeight * 0.25 // Only immediate gallery items
      default:
        return false
    }
  }
}

/**
 * Default optimization configuration
 */
export const DEFAULT_IMAGE_CONFIG: ImageOptimizationConfig = {
  enableWebP: true,
  enableAVIF: true,
  enableResponsive: true,
  enableLazyLoading: true,
  enableBlurPlaceholder: true,
  qualityWebP: 85,
  qualityAVIF: 80,
  qualityFallback: 90,
  cacheStrategy: 'aggressive'
}

/**
 * Image optimization utilities
 */
export const ImageOptimization = {
  FormatDetector: ImageFormatDetector,
  ResponsiveGenerator: ResponsiveImageGenerator,
  PerformanceOptimizer: ImagePerformanceOptimizer,
  DEFAULT_CONFIG: DEFAULT_IMAGE_CONFIG
}