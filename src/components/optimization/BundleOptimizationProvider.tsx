'use client'

/**
 * Bundle Optimization Provider
 * SEO-Dominance-2025 - Enterprise JavaScript optimization and monitoring
 * Advanced bundle analysis and performance tracking system
 */

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'
import { BundleAnalyzer, CodeSplittingStrategy, type BundleMetrics } from '@/lib/optimization/bundle-analyzer'
import { CodeSplittingManager } from '@/lib/optimization/code-splitting'

interface BundleOptimizationContextType {
  metrics: BundleMetrics | null
  isAnalyzing: boolean
  optimizationScore: number
  recommendations: {
    criticalChunks: string[]
    lazyChunks: string[]
    prefetchChunks: string[]
    estimatedSavings: {
      size: string
      loadTime: string
      coreWebVitals: string[]
    }
  }
  loadingStats: {
    preloadedCount: number
    prefetchedCount: number
    pendingLoads: number
  }
  actions: {
    runAnalysis: () => Promise<void>
    prefetchComponent: (name: string) => Promise<void>
    preloadComponent: (name: string) => Promise<void>
    reportBundleMetrics: () => void
  }
  isInitialized: boolean
}

const BundleOptimizationContext = createContext<BundleOptimizationContextType | undefined>(undefined)

interface BundleOptimizationProviderProps {
  children: ReactNode
  enableAnalytics?: boolean
  enableDevelopmentTools?: boolean
}

/**
 * Bundle Optimization Provider Component
 */
export function BundleOptimizationProvider({
  children,
  enableAnalytics = true,
  enableDevelopmentTools = process.env.NODE_ENV === 'development'
}: BundleOptimizationProviderProps) {
  // State management
  const [metrics, setMetrics] = useState<BundleMetrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [optimizationScore, setOptimizationScore] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loadingStats, setLoadingStats] = useState({
    preloadedCount: 0,
    prefetchedCount: 0,
    pendingLoads: 0
  })

  // Instances
  const bundleAnalyzer = useRef<BundleAnalyzer>(new BundleAnalyzer())
  const codeSplittingStrategy = useRef<CodeSplittingStrategy>(new CodeSplittingStrategy())
  const codeSplittingManager = useRef<CodeSplittingManager>(CodeSplittingManager.getInstance())

  // Recommendations state
  const [recommendations, setRecommendations] = useState({
    criticalChunks: [] as string[],
    lazyChunks: [] as string[],
    prefetchChunks: [] as string[],
    estimatedSavings: {
      size: '0%',
      loadTime: '0ms',
      coreWebVitals: [] as string[]
    }
  })

  // Initialize bundle optimization system
  useEffect(() => {
    const initializeOptimization = async () => {
      try {
        console.log('🚀 Initializing Bundle Optimization System...')
        
        // Run initial bundle analysis
        await runAnalysis()
        
        // Setup performance monitoring
        if (enableAnalytics) {
          setupPerformanceMonitoring()
        }
        
        // Setup development tools
        if (enableDevelopmentTools) {
          setupDevelopmentTools()
        }
        
        setIsInitialized(true)
        console.log('✅ Bundle Optimization System initialized')
        
      } catch (error) {
        console.error('❌ Bundle optimization initialization failed:', error)
        setIsInitialized(true) // Set to true anyway to avoid blocking
      }
    }

    initializeOptimization()
  }, [enableAnalytics, enableDevelopmentTools])

  // Update loading stats periodically
  useEffect(() => {
    const updateStats = () => {
      const stats = codeSplittingManager.current.getLoadingStats()
      setLoadingStats({
        preloadedCount: stats.preloadedCount,
        prefetchedCount: stats.prefetchedCount,
        pendingLoads: stats.pendingLoads
      })
    }

    const interval = setInterval(updateStats, 2000)
    return () => clearInterval(interval)
  }, [])

  /**
   * Run comprehensive bundle analysis
   */
  const runAnalysis = async (): Promise<void> => {
    setIsAnalyzing(true)
    
    try {
      // Analyze current bundle
      const bundleMetrics = await bundleAnalyzer.current.analyzeBundlePerformance()
      setMetrics(bundleMetrics)
      
      // Generate optimization recommendations
      const optimizations = bundleAnalyzer.current.generateOptimizationRecommendations()
      const splittingStrategy = codeSplittingStrategy.current.generateSplittingStrategy()
      
      // Calculate optimization score (0-100)
      const score = calculateOptimizationScore(bundleMetrics, optimizations)
      setOptimizationScore(score)
      
      // Get performance impact
      const impact = bundleAnalyzer.current.getPerformanceImpact()
      
      setRecommendations({
        criticalChunks: splittingStrategy.criticalChunks,
        lazyChunks: splittingStrategy.lazyChunks,
        prefetchChunks: splittingStrategy.prefetchChunks,
        estimatedSavings: {
          size: impact.improvements.sizeReduction,
          loadTime: impact.improvements.loadTimeImprovement,
          coreWebVitals: impact.improvements.coreWebVitalsGain
        }
      })
      
      console.log('📊 Bundle Analysis Complete:', {
        score,
        totalSize: `${(bundleMetrics.totalSize / 1024).toFixed(2)}KB`,
        gzippedSize: `${(bundleMetrics.gzippedSize / 1024).toFixed(2)}KB`,
        loadingTime: `${bundleMetrics.loadingTime}ms`
      })
      
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  /**
   * Setup performance monitoring
   */
  const setupPerformanceMonitoring = (): void => {
    // Monitor bundle loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          reportNavigationMetrics(navEntry)
        }
      })
    })
    
    observer.observe({ entryTypes: ['navigation'] })
    
    // Report metrics on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportBundleMetrics()
      }
    })
  }

  /**
   * Setup development tools
   */
  const setupDevelopmentTools = (): void => {
    // Add global debugging helpers
    if (typeof window !== 'undefined') {
      (window as any).__bundleOptimization = {
        getMetrics: () => metrics,
        getRecommendations: () => recommendations,
        getLoadingStats: () => loadingStats,
        runAnalysis,
        prefetchComponent: (name: string) => codeSplittingManager.current.prefetchComponent(name),
        preloadComponent: (name: string) => codeSplittingManager.current.preloadComponent(name)
      }
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'B') {
        console.log('🔍 Bundle Optimization Debug Info:', {
          metrics,
          recommendations,
          loadingStats,
          optimizationScore
        })
      }
    })
  }

  /**
   * Calculate optimization score based on metrics and recommendations
   */
  const calculateOptimizationScore = (
    bundleMetrics: BundleMetrics,
    optimizations: any[]
  ): number => {
    let score = 100

    // Penalize large bundle sizes
    const sizePenalty = Math.min(50, (bundleMetrics.totalSize - 200000) / 10000) // Penalty after 200KB
    score -= Math.max(0, sizePenalty)

    // Penalize slow loading times
    const loadTimePenalty = Math.min(30, (bundleMetrics.loadingTime - 1000) / 100) // Penalty after 1s
    score -= Math.max(0, loadTimePenalty)

    // Penalize unused code
    const unusedCodePenalty = (bundleMetrics.unusedBytes / bundleMetrics.totalSize) * 20
    score -= unusedCodePenalty

    // Bonus for having optimizations
    const optimizationBonus = Math.min(15, optimizations.length * 3)
    score += optimizationBonus

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Report navigation metrics
   */
  const reportNavigationMetrics = (entry: PerformanceNavigationTiming): void => {
    const metrics = {
      loadTime: entry.loadEventEnd - entry.navigationStart,
      domContentLoaded: entry.domContentLoadedEventEnd - entry.navigationStart,
      firstPaint: entry.responseEnd - entry.navigationStart,
      ttfb: entry.responseStart - entry.requestStart
    }

    if (enableAnalytics && typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'bundle_performance', {
        event_category: 'Performance',
        load_time: Math.round(metrics.loadTime),
        dom_content_loaded: Math.round(metrics.domContentLoaded),
        ttfb: Math.round(metrics.ttfb)
      })
    }
  }

  /**
   * Report bundle metrics to analytics
   */
  const reportBundleMetrics = (): void => {
    if (!metrics || !enableAnalytics) return

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'bundle_metrics', {
        event_category: 'Performance',
        event_label: 'bundle_optimization',
        total_size: Math.round(metrics.totalSize / 1024),
        gzipped_size: Math.round(metrics.gzippedSize / 1024),
        loading_time: metrics.loadingTime,
        optimization_score: optimizationScore
      })
    }
  }

  // Context actions
  const actions = {
    runAnalysis,
    prefetchComponent: (name: string) => codeSplittingManager.current.prefetchComponent(name),
    preloadComponent: (name: string) => codeSplittingManager.current.preloadComponent(name),
    reportBundleMetrics
  }

  // Context value
  const contextValue: BundleOptimizationContextType = {
    metrics,
    isAnalyzing,
    optimizationScore,
    recommendations,
    loadingStats,
    actions,
    isInitialized
  }

  return (
    <BundleOptimizationContext.Provider value={contextValue}>
      {children}
      {enableDevelopmentTools && <BundleOptimizationDevTools />}
    </BundleOptimizationContext.Provider>
  )
}

/**
 * Development tools component
 */
function BundleOptimizationDevTools() {
  const context = useBundleOptimization()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'B') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible || !context.isInitialized) return null

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black text-white p-4 rounded-lg shadow-2xl max-w-md font-mono text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-blue-400">⚡ Bundle Optimization</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Optimization Score:</span>
          <span className={`font-bold ${
            context.optimizationScore >= 90 ? 'text-green-400' :
            context.optimizationScore >= 70 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {context.optimizationScore}/100
          </span>
        </div>

        {context.metrics && (
          <div className="space-y-1 text-gray-300">
            <div className="flex justify-between">
              <span>Bundle Size:</span>
              <span>{(context.metrics.totalSize / 1024).toFixed(2)}KB</span>
            </div>
            <div className="flex justify-between">
              <span>Gzipped:</span>
              <span>{(context.metrics.gzippedSize / 1024).toFixed(2)}KB</span>
            </div>
            <div className="flex justify-between">
              <span>Load Time:</span>
              <span>{context.metrics.loadingTime}ms</span>
            </div>
          </div>
        )}

        <div className="space-y-1 text-gray-300">
          <div className="flex justify-between">
            <span>Preloaded:</span>
            <span>{context.loadingStats.preloadedCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Prefetched:</span>
            <span>{context.loadingStats.prefetchedCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending:</span>
            <span>{context.loadingStats.pendingLoads}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <button
            onClick={context.actions.runAnalysis}
            disabled={context.isAnalyzing}
            className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            {context.isAnalyzing ? '🔄 Analyzing...' : '🔍 Re-analyze'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook to use bundle optimization context
 */
export function useBundleOptimization(): BundleOptimizationContextType {
  const context = useContext(BundleOptimizationContext)
  
  if (context === undefined) {
    throw new Error('useBundleOptimization must be used within a BundleOptimizationProvider')
  }
  
  return context
}

/**
 * Hook for component-level bundle optimization
 */
export function useComponentOptimization(componentName: string) {
  const { actions, loadingStats } = useBundleOptimization()
  
  const prefetch = () => actions.prefetchComponent(componentName)
  const preload = () => actions.preloadComponent(componentName)
  
  return { prefetch, preload, loadingStats }
}

export default BundleOptimizationProvider