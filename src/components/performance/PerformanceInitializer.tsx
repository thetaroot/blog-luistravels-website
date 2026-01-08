'use client'

/**
 * 🎯 PERFORMANCE INITIALIZER
 * 10/10 Core Web Vitals Optimization System
 */

import { useEffect } from 'react'
import { INPOptimizer } from '@/lib/performance/inp-optimizer'
import { ResourceOptimizer } from '@/lib/performance/resource-optimizer'

export function PerformanceInitializer() {
  useEffect(() => {
    // Initialize performance optimizations
    const initializePerformance = async () => {
      try {
        console.log('🚀 Initializing 10/10 Performance System...')
        
        // Initialize INP optimizer for 2025 Core Web Vitals
        INPOptimizer.initialize()
        
        // Initialize resource optimization monitoring
        ResourceOptimizer.initializePerformanceMonitoring()
        
        // Start predictive preloading
        ResourceOptimizer.implementPredictivePreloading()
        
        console.log('✅ Performance optimization system active')
        
        // Report initial performance metrics
        setTimeout(async () => {
          const report = await INPOptimizer.generatePerformanceReport()
          console.log('📊 Initial Performance Report:', {
            inp: report.inp,
            grade: report.grade,
            recommendations: report.recommendations
          })
        }, 5000)
        
      } catch (error) {
        console.error('Failed to initialize performance system:', error)
      }
    }

    // Initialize on mount
    initializePerformance()

    // Cleanup on unmount
    return () => {
      INPOptimizer.cleanup()
      ResourceOptimizer.cleanup()
    }
  }, [])

  // Monitor Core Web Vitals and report to analytics
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reportWebVitals = (metric: any) => {
      // Report to Google Analytics if available
      if ('gtag' in window) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          custom_map: {
            metric_id: metric.id,
            metric_value: metric.value,
            metric_delta: metric.delta
          }
        })
      }

      // Report to console for development
      console.log(`📈 Core Web Vital: ${metric.name}`, {
        value: metric.value,
        delta: metric.delta,
        id: metric.id
      })
    }

    // Use Web Vitals library if available
    if ('web-vitals' in window) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = (window as any)['web-vitals']
      
      getCLS(reportWebVitals)
      getFID(reportWebVitals)
      getFCP(reportWebVitals)
      getLCP(reportWebVitals)
      getTTFB(reportWebVitals)
    }
  }, [])

  return null // This component doesn't render anything
}

export default PerformanceInitializer