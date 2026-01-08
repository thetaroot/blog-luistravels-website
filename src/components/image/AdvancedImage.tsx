'use client'

/**
 * Advanced Image Component - SEO-Dominance-2025
 * Enterprise-level image optimization with WebP/AVIF support
 * Google Senior Dev implementation for maximum Core Web Vitals performance
 */

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { 
  ImageFormatDetector, 
  ResponsiveImageGenerator, 
  ImagePerformanceOptimizer,
  DEFAULT_IMAGE_CONFIG,
  type ImageOptimizationConfig 
} from '@/lib/image/optimization'
import { useOptimizedEventHandler, useIntersectionObserver } from '@/lib/performance/react-optimizations'

export interface AdvancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty' | 'shimmer'
  blurDataURL?: string
  fill?: boolean
  context?: 'hero' | 'above-fold' | 'content' | 'gallery'
  optimization?: Partial<ImageOptimizationConfig>
  onLoad?: () => void
  onError?: () => void
  enableAVIF?: boolean
  enableWebP?: boolean
  enableResponsive?: boolean
  aspectRatio?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
}

/**
 * Enterprise Advanced Image Component
 */
export function AdvancedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  style,
  sizes,
  quality,
  placeholder = 'blur',
  blurDataURL,
  fill = false,
  context = 'content',
  optimization = {},
  onLoad,
  onError,
  enableAVIF = true,
  enableWebP = true,
  enableResponsive = true,
  aspectRatio,
  objectFit = 'cover',
  loading
}: AdvancedImageProps) {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [optimalFormat, setOptimalFormat] = useState<string>('jpeg')
  const [isIntersecting, setIsIntersecting] = useState(priority)
  
  // Refs
  const imageRef = useRef<HTMLDivElement>(null)
  const configRef = useRef({ ...DEFAULT_IMAGE_CONFIG, ...optimization })

  // Format detection on mount
  useEffect(() => {
    const detectOptimalFormat = async () => {
      if (!enableAVIF && !enableWebP) {
        setOptimalFormat('jpeg')
        return
      }

      try {
        let format = 'jpeg'
        
        if (enableAVIF && await ImageFormatDetector.detectAVIFSupport()) {
          format = 'avif'
        } else if (enableWebP && await ImageFormatDetector.detectWebPSupport()) {
          format = 'webp'
        }
        
        setOptimalFormat(format)
      } catch (error) {
        console.warn('Format detection failed, using JPEG fallback:', error)
        setOptimalFormat('jpeg')
      }
    }

    detectOptimalFormat()
  }, [enableAVIF, enableWebP])

  // Intersection Observer for lazy loading optimization
  const { observe } = useIntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isIntersecting) {
          setIsIntersecting(true)
        }
      })
    },
    {
      rootMargin: '100px', // Load 100px before entering viewport
      threshold: 0.1
    }
  )

  // Observe element for lazy loading
  useEffect(() => {
    if (!priority && imageRef.current) {
      const cleanup = observe(imageRef.current)
      return cleanup
    }
  }, [priority, observe])

  // Optimized event handlers
  const handleLoad = useOptimizedEventHandler(() => {
    setIsLoading(false)
    onLoad?.()
  }, { passive: true })

  const handleError = useOptimizedEventHandler(() => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }, { passive: true })

  // Generate responsive sizes
  const responsiveSizes = enableResponsive 
    ? sizes || ResponsiveImageGenerator.generateSizes()
    : sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

  // Generate optimized blur placeholder
  const optimizedBlurDataURL = useMemo(() => {
    if (blurDataURL) return blurDataURL
    if (placeholder === 'blur') {
      return ImagePerformanceOptimizer.generateBlurPlaceholder(src)
    }
    return undefined
  }, [blurDataURL, placeholder, src])

  // Calculate quality based on format
  const getOptimalQuality = useCallback(() => {
    if (quality) return quality
    
    switch (optimalFormat) {
      case 'avif':
        return configRef.current.qualityAVIF
      case 'webp':
        return configRef.current.qualityWebP
      default:
        return configRef.current.qualityFallback
    }
  }, [optimalFormat, quality])

  // Error fallback component
  if (hasError) {
    return (
      <div 
        ref={imageRef}
        className={`${className} bg-gradient-to-br from-warm-white to-gray-100 border border-dark/5 flex items-center justify-center text-dark/40 relative overflow-hidden`}
        style={{
          ...style,
          aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined)
        }}
      >
        <div className="text-center p-4">
          <svg 
            className="w-8 h-8 mx-auto mb-2 opacity-50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-xs font-medium">Image unavailable</p>
        </div>
      </div>
    )
  }

  // Shimmer placeholder component
  const ShimmerPlaceholder = () => (
    <div 
      className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse ${isLoading ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={{
        background: `
          linear-gradient(
            90deg,
            rgba(243, 244, 246, 0.8) 0%,
            rgba(229, 231, 235, 0.9) 50%,
            rgba(243, 244, 246, 0.8) 100%
          )
        `,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite'
      }}
    />
  )

  // Container styles for aspect ratio and object fit
  const containerStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio && !fill ? { aspectRatio } : {})
  }

  // Image props for Next.js Image component
  const imageProps = {
    src,
    alt,
    priority: priority || context === 'hero',
    quality: getOptimalQuality(),
    placeholder: placeholder as 'blur' | 'empty',
    blurDataURL: optimizedBlurDataURL,
    sizes: responsiveSizes,
    loading: loading || (priority ? 'eager' as const : 'lazy' as const),
    onLoad: handleLoad,
    onError: handleError,
    className: `${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ease-out`,
    style: {
      objectFit,
      ...(fill ? {} : { width: '100%', height: 'auto' })
    },
    // Performance optimizations
    decoding: 'async' as const,
    fetchPriority: (priority || context === 'hero') ? 'high' as const : 'auto' as const,
  }

  return (
    <div ref={imageRef} className={`${className} relative`} style={containerStyle}>
      {/* Shimmer placeholder for enhanced loading experience */}
      {placeholder === 'shimmer' && <ShimmerPlaceholder />}
      
      {/* Main image - only render when intersecting or priority */}
      {(isIntersecting || priority) && (
        <>
          {fill ? (
            <Image
              {...imageProps}
              fill
              sizes={responsiveSizes}
            />
          ) : (
            <Image
              {...imageProps}
              width={width || 800}
              height={height || 600}
            />
          )}
        </>
      )}

      {/* Loading indicator for critical images */}
      {isLoading && priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-warm-white/80 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-dark/20 border-t-dark/60 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

/**
 * Gallery-optimized image component
 */
export function GalleryImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<AdvancedImageProps, 'context'>) {
  return (
    <AdvancedImage
      src={src}
      alt={alt}
      className={`gallery-image ${className}`}
      context="gallery"
      aspectRatio="4/3"
      placeholder="shimmer"
      enableResponsive={true}
      {...props}
    />
  )
}

/**
 * Hero-optimized image component
 */
export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<AdvancedImageProps, 'context' | 'priority'>) {
  return (
    <AdvancedImage
      src={src}
      alt={alt}
      className={`hero-image ${className}`}
      context="hero"
      priority={true}
      placeholder="blur"
      quality={95}
      enableAVIF={true}
      enableWebP={true}
      {...props}
    />
  )
}

/**
 * Content-optimized image component
 */
export function ContentImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<AdvancedImageProps, 'context'>) {
  return (
    <AdvancedImage
      src={src}
      alt={alt}
      className={`content-image ${className}`}
      context="content"
      aspectRatio="16/9"
      placeholder="blur"
      {...props}
    />
  )
}

// Add CSS for shimmer animation
const shimmerCSS = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.querySelector('#shimmer-styles')) {
  const style = document.createElement('style')
  style.id = 'shimmer-styles'
  style.textContent = shimmerCSS
  document.head.appendChild(style)
}

export default AdvancedImage