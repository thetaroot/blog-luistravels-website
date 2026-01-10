/**
 * Optimized Lazy Components Collection
 * SEO-Dominance-2025 - Enterprise lazy loading with performance monitoring
 * Advanced code splitting for maximum Core Web Vitals optimization
 */

import React, { Suspense, ComponentType, ReactNode, useEffect, useRef } from 'react'
import { CodeSplittingManager } from '@/lib/optimization/code-splitting'

// Initialize code splitting manager
const codeSplittingManager = CodeSplittingManager.getInstance()

/**
 * Enhanced loading fallback components
 */
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-dark/20 border-t-dark/60 rounded-full animate-spin" />
      <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-r-dark/40 rounded-full animate-spin animate-reverse" />
    </div>
  </div>
)

export const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg h-full w-full" 
         style={{
           backgroundSize: '200% 100%',
           animation: 'shimmer 1.5s ease-in-out infinite'
         }} />
  </div>
)

export const LoadingCard = () => (
  <div className="bg-white p-6 rounded-lg border border-dark/5 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-32 bg-gray-200 rounded" />
      <div className="flex space-x-2">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  </div>
)

/**
 * Enhanced Suspense wrapper with error boundary and performance tracking
 */
interface OptimizedSuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  chunkName?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}

export function OptimizedSuspense({ 
  children, 
  fallback = <LoadingSpinner />, 
  chunkName,
  onLoad,
  onError 
}: OptimizedSuspenseProps) {
  const handleComponentLoad = () => {
    if (chunkName) {
      console.log(`✅ Component loaded: ${chunkName}`)
    }
    onLoad?.()
  }

  const handleComponentError = (error: Error) => {
    console.error(`❌ Component load error${chunkName ? ` (${chunkName})` : ''}:`, error)
    onError?.(error)
  }

  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary onError={handleComponentError} onLoad={handleComponentLoad}>
        {children}
      </ErrorBoundary>
    </Suspense>
  )
}

/**
 * Error boundary for lazy components
 */
interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error) => void
  onLoad?: () => void
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo)
    this.props.onError?.(error)
  }

  componentDidMount() {
    if (!this.state.hasError) {
      this.props.onLoad?.()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800 mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Component Loading Error</span>
          </div>
          <p className="text-red-700 text-sm">
            This component failed to load. Please refresh the page or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Lazy Gallery Lightbox - Heavy component with image processing
 * Note: Component will be created when GalleryLightbox exists
 */
// export const LazyGalleryLightbox = codeSplittingManager.createLazyComponent(
//   () => import('@/components/gallery/GalleryLightbox'),
//   {
//     chunkName: 'gallery-lightbox',
//     prefetch: true,
//     timeout: 15000
//   }
// )

/**
 * Lazy Contact Form - Form validation and submission
 * Note: Component will be created when ContactForm exists
 */
// export const LazyContactForm = codeSplittingManager.createLazyComponent(
//   () => import('@/components/contact/ContactForm'),
//   {
//     chunkName: 'contact-form',
//     prefetch: false,
//     timeout: 10000
//   }
// )

/**
 * Lazy Performance Monitor - Development tool
 */
export const LazyPerformanceMonitor = codeSplittingManager.createLazyComponent(
  () => import('@/components/performance/PerformanceProvider').then(mod => ({ 
    default: mod.PerformanceProvider 
  })),
  {
    chunkName: 'performance-monitor',
    prefetch: false,
    timeout: 8000
  }
)

/**
 * Lazy Image Optimization Demo - Demo component
 */
export const LazyImageOptimizationDemo = codeSplittingManager.createLazyComponent(
  () => import('@/components/demo/ImageOptimizationDemo'),
  {
    chunkName: 'image-optimization-demo',
    prefetch: false,
    timeout: 12000
  }
)

/**
 * Lazy Mobile Navigation - Mobile-specific component
 * Note: Component will be created when MobileNavigation exists
 */
// export const LazyMobileNavigation = codeSplittingManager.createLazyComponent(
//   () => import('@/components/layout/MobileNavigation'),
//   {
//     chunkName: 'mobile-navigation',
//     prefetch: true,
//     timeout: 5000
//   }
// )

/**
 * Higher-order component for lazy loading with advanced configuration
 */
export function withLazyLoading<P extends object>(
  componentLoader: () => Promise<{ default: ComponentType<P> }>,
  config: {
    chunkName: string
    fallback?: ReactNode
    prefetch?: boolean
    preload?: boolean
    errorFallback?: ComponentType<{ error: Error; retry: () => void }>
  }
) {
  const LazyComponent = codeSplittingManager.createLazyComponent(componentLoader, config as any)
  
  return function LazyWrapper(props: P) {
    return (
      <OptimizedSuspense
        fallback={config.fallback || <LoadingSpinner />}
        chunkName={config.chunkName}
      >
        <LazyComponent {...props as any} />
      </OptimizedSuspense>
    )
  }
}

/**
 * Intersection Observer HOC for automatic prefetching
 */
export function withIntersectionPrefetch<P extends object>(
  Component: ComponentType<P>,
  prefetchConfig: {
    chunkNames: string[]
    rootMargin?: string
    threshold?: number
  }
) {
  return function IntersectionPrefetchWrapper(props: P) {
    const elementRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
      if (!elementRef.current) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              prefetchConfig.chunkNames.forEach(chunkName => {
                codeSplittingManager.prefetchComponent(chunkName)
              })
              observer.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: prefetchConfig.rootMargin || '100px',
          threshold: prefetchConfig.threshold || 0.1
        }
      )

      observer.observe(elementRef.current)
      
      return () => observer.disconnect()
    }, [])

    return (
      <div ref={elementRef}>
        <Component {...props} />
      </div>
    )
  }
}

/**
 * Route-based lazy loading wrapper
 */
export function LazyRoute({ 
  path, 
  component: Component,
  fallback = <LoadingCard />
}: {
  path: string
  component: ComponentType<any>
  fallback?: ReactNode
}) {
  useEffect(() => {
    // Prefetch related routes based on current path
    codeSplittingManager.prefetchRoute(path)
  }, [path])

  return (
    <OptimizedSuspense fallback={fallback} chunkName={`route-${path}`}>
      <Component />
    </OptimizedSuspense>
  )
}

// CSS for shimmer animation
if (typeof document !== 'undefined' && !document.querySelector('#lazy-loading-styles')) {
  const style = document.createElement('style')
  style.id = 'lazy-loading-styles'
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes animate-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    
    .animate-reverse {
      animation-direction: reverse;
    }
  `
  document.head.appendChild(style)
}

export default {
  // LazyGalleryLightbox,
  // LazyContactForm,
  LazyPerformanceMonitor,
  LazyImageOptimizationDemo,
  // LazyMobileNavigation,
  OptimizedSuspense,
  withLazyLoading,
  withIntersectionPrefetch,
  LazyRoute
}