'use client'

/**
 * Image Optimization Provider - SEO-Dominance-2025
 * Global image optimization context with format detection and caching
 * Enterprise-level performance monitoring for Core Web Vitals
 */

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'
import { 
  ImageFormatDetector, 
  ImagePerformanceOptimizer,
  type ImageOptimizationConfig,
  DEFAULT_IMAGE_CONFIG 
} from '@/lib/image/optimization'

interface ImageOptimizationContextType {
  config: ImageOptimizationConfig
  formats: {
    avifSupport: boolean
    webpSupport: boolean
    optimalFormat: string
  }
  performance: {
    preloadImage: (src: string) => Promise<void>
    isImageCached: (src: string) => boolean
    reportImageMetrics: (src: string, loadTime: number, format: string) => void
  }
  updateConfig: (newConfig: Partial<ImageOptimizationConfig>) => void
  isInitialized: boolean
}

const ImageOptimizationContext = createContext<ImageOptimizationContextType | undefined>(undefined)

interface ImageOptimizationProviderProps {
  children: ReactNode
  initialConfig?: Partial<ImageOptimizationConfig>
  enablePerformanceTracking?: boolean
}

/**
 * Image Optimization Provider Component
 */
export function ImageOptimizationProvider({ 
  children, 
  initialConfig = {},
  enablePerformanceTracking = true 
}: ImageOptimizationProviderProps) {
  // Configuration state
  const [config, setConfig] = useState<ImageOptimizationConfig>({
    ...DEFAULT_IMAGE_CONFIG,
    ...initialConfig
  })

  // Format support detection state
  const [formats, setFormats] = useState({
    avifSupport: false,
    webpSupport: false,
    optimalFormat: 'jpeg'
  })

  // Initialization state
  const [isInitialized, setIsInitialized] = useState(false)

  // Performance tracking
  const performanceCache = useRef(new Map<string, boolean>())
  const metricsBuffer = useRef<Array<{
    src: string
    loadTime: number
    format: string
    timestamp: number
  }>>([])

  // Initialize format detection and performance monitoring
  useEffect(() => {
    const initializeOptimization = async () => {
      try {
        console.log('🖼️ Initializing Advanced Image Optimization System...')
        
        // Initialize performance monitoring
        if (enablePerformanceTracking) {
          ImagePerformanceOptimizer.initializeLazyLoading()
        }

        // Detect format support
        const [avifSupport, webpSupport] = await Promise.all([
          config.enableAVIF ? ImageFormatDetector.detectAVIFSupport() : Promise.resolve(false),
          config.enableWebP ? ImageFormatDetector.detectWebPSupport() : Promise.resolve(false)
        ])

        // Determine optimal format
        const optimalFormat = await ImageFormatDetector.getOptimalFormat()

        setFormats({
          avifSupport,
          webpSupport,
          optimalFormat
        })

        console.log(`✅ Image Optimization Initialized:`, {
          avifSupport,
          webpSupport,
          optimalFormat,
          cacheStrategy: config.cacheStrategy
        })

        setIsInitialized(true)

        // Setup performance reporting if enabled
        if (enablePerformanceTracking) {
          setupPerformanceReporting()
        }

      } catch (error) {
        console.error('❌ Image optimization initialization failed:', error)
        // Fallback to basic configuration
        setFormats({
          avifSupport: false,
          webpSupport: false,
          optimalFormat: 'jpeg'
        })
        setIsInitialized(true)
      }
    }

    initializeOptimization()
  }, [config.enableAVIF, config.enableWebP, config.cacheStrategy, enablePerformanceTracking])

  // Performance reporting setup
  const setupPerformanceReporting = () => {
    // Report metrics every 30 seconds
    const reportInterval = setInterval(() => {
      if (metricsBuffer.current.length > 0) {
        reportBatchedMetrics()
      }
    }, 30000)

    // Report on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && metricsBuffer.current.length > 0) {
        reportBatchedMetrics()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(reportInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }

  // Batch metrics reporting for performance
  const reportBatchedMetrics = () => {
    const metrics = metricsBuffer.current.splice(0)
    
    if (metrics.length === 0) return

    const summary = {
      totalImages: metrics.length,
      averageLoadTime: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      formatDistribution: metrics.reduce((acc, m) => {
        acc[m.format] = (acc[m.format] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      timestamp: Date.now()
    }

    console.log('📊 Image Performance Report:', summary)

    // Send to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'image_performance', {
        event_category: 'Performance',
        average_load_time: Math.round(summary.averageLoadTime),
        total_images: summary.totalImages,
        optimal_format_usage: summary.formatDistribution[formats.optimalFormat] || 0
      })
    }
  }

  // Store reference to global performance API before creating local performance object
  const globalPerformance = typeof window !== 'undefined' ? window.performance : undefined

  // Performance utilities
  const performance = {
    preloadImage: async (src: string): Promise<void> => {
      if (performanceCache.current.has(src)) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        const startTime = globalPerformance?.now() || Date.now()
        const img = new Image()

        img.onload = () => {
          const loadTime = (globalPerformance?.now() || Date.now()) - startTime
          performanceCache.current.set(src, true)
          
          if (enablePerformanceTracking) {
            metricsBuffer.current.push({
              src,
              loadTime,
              format: formats.optimalFormat,
              timestamp: Date.now()
            })
          }
          
          resolve()
        }
        
        img.onerror = () => {
          reject(new Error(`Failed to preload image: ${src}`))
        }
        
        img.src = src
      })
    },

    isImageCached: (src: string): boolean => {
      return performanceCache.current.has(src)
    },

    reportImageMetrics: (src: string, loadTime: number, format: string): void => {
      if (enablePerformanceTracking) {
        metricsBuffer.current.push({
          src,
          loadTime,
          format,
          timestamp: Date.now()
        })

        // Report slow images immediately
        if (loadTime > 2000) { // 2 seconds threshold
          console.warn(`🐌 Slow image loading detected: ${src} (${loadTime.toFixed(2)}ms)`)
          
          if (typeof window !== 'undefined' && 'gtag' in window) {
            (window as any).gtag('event', 'slow_image_load', {
              event_category: 'Performance',
              event_label: src,
              value: Math.round(loadTime),
              format: format
            })
          }
        }
      }
    }
  }

  // Update configuration
  const updateConfig = (newConfig: Partial<ImageOptimizationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  // Context value
  const contextValue: ImageOptimizationContextType = {
    config,
    formats,
    performance,
    updateConfig,
    isInitialized
  }

  return (
    <ImageOptimizationContext.Provider value={contextValue}>
      {children}
    </ImageOptimizationContext.Provider>
  )
}

/**
 * Hook to use image optimization context
 */
export function useImageOptimization(): ImageOptimizationContextType {
  const context = useContext(ImageOptimizationContext)
  
  if (context === undefined) {
    throw new Error('useImageOptimization must be used within an ImageOptimizationProvider')
  }
  
  return context
}

/**
 * Hook for image preloading with optimization
 */
export function useImagePreloading() {
  const { performance, formats } = useImageOptimization()
  
  const preloadImages = async (imageUrls: string[]) => {
    const preloadPromises = imageUrls.map(url => performance.preloadImage(url))
    
    try {
      await Promise.all(preloadPromises)
      console.log(`✅ Preloaded ${imageUrls.length} images with ${formats.optimalFormat} format`)
    } catch (error) {
      console.warn('Some images failed to preload:', error)
    }
  }

  return { preloadImages, isImageCached: performance.isImageCached }
}

/**
 * Hook for image format selection
 */
export function useOptimalImageFormat() {
  const { formats, config } = useImageOptimization()
  
  const getImageUrl = (baseSrc: string, options?: {
    width?: number
    quality?: number
    format?: string
  }) => {
    const {
      width = 800,
      quality = 90,
      format = formats.optimalFormat
    } = options || {}

    // For Next.js Image API integration
    if (baseSrc.startsWith('/') || baseSrc.startsWith('http')) {
      const params = new URLSearchParams({
        url: encodeURIComponent(baseSrc),
        w: width.toString(),
        q: quality.toString(),
        f: format
      })
      
      return `/_next/image?${params.toString()}`
    }

    return baseSrc
  }

  return {
    optimalFormat: formats.optimalFormat,
    supportsAVIF: formats.avifSupport,
    supportsWebP: formats.webpSupport,
    getImageUrl
  }
}

export default ImageOptimizationProvider