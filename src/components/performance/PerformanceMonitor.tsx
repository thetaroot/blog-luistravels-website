/**
 * Performance Monitor Component - SEO-PERFECTION-2025
 * Real-time Core Web Vitals monitoring with ≤200ms INP target
 * Includes LCP, FID, CLS, and advanced INP tracking
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { inpMonitor, type INPMetrics, type PerformanceAlert } from '@/lib/performance/inp-monitoring'

interface CoreWebVitals {
  lcp: number | null
  fid: number | null
  cls: number | null
  inp: number | null
  ttfb: number | null
}

interface PerformanceStatus {
  metrics: CoreWebVitals
  alerts: PerformanceAlert[]
  isMonitoring: boolean
  lastUpdate: number
}

const PerformanceMonitor: React.FC = () => {
  const [status, setStatus] = useState<PerformanceStatus>({
    metrics: {
      lcp: null,
      fid: null,
      cls: null,
      inp: null,
      ttfb: null
    },
    alerts: [],
    isMonitoring: false,
    lastUpdate: Date.now()
  })

  /**
   * Initialize performance monitoring
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    let isActive = true

    const initializeMonitoring = async () => {
      try {
        // Initialize INP monitoring
        inpMonitor.initialize()
        
        // Set up alert handler
        inpMonitor.onAlert((alert) => {
          if (!isActive) return
          
          setStatus(prev => ({
            ...prev,
            alerts: [...prev.alerts.slice(-9), alert], // Keep last 10 alerts
            lastUpdate: Date.now()
          }))
        })

        // Initialize Web Vitals
        await initializeWebVitals()
        
        setStatus(prev => ({ ...prev, isMonitoring: true }))
        
      } catch (error) {
        console.error('Failed to initialize performance monitoring:', error)
      }
    }

    initializeMonitoring()

    // Set up periodic updates
    const updateInterval = setInterval(() => {
      if (!isActive) return
      updateMetrics()
    }, 2000)

    return () => {
      isActive = false
      clearInterval(updateInterval)
      inpMonitor.disconnect()
    }
  }, [])

  /**
   * Initialize Web Vitals monitoring
   */
  const initializeWebVitals = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals')
      
      // Largest Contentful Paint
      getLCP((metric) => {
        setStatus(prev => ({
          ...prev,
          metrics: { ...prev.metrics, lcp: metric.value },
          lastUpdate: Date.now()
        }))
      })

      // First Input Delay
      getFID((metric) => {
        setStatus(prev => ({
          ...prev,
          metrics: { ...prev.metrics, fid: metric.value },
          lastUpdate: Date.now()
        }))
      })

      // Cumulative Layout Shift
      getCLS((metric) => {
        setStatus(prev => ({
          ...prev,
          metrics: { ...prev.metrics, cls: metric.value },
          lastUpdate: Date.now()
        }))
      })

      // Time to First Byte
      getTTFB((metric) => {
        setStatus(prev => ({
          ...prev,
          metrics: { ...prev.metrics, ttfb: metric.value },
          lastUpdate: Date.now()
        }))
      })

    } catch (error) {
      console.warn('Web Vitals not available:', error)
    }
  }

  /**
   * Update metrics from INP monitor
   */
  const updateMetrics = useCallback(() => {
    const inpMetrics = inpMonitor.getCurrentMetrics()
    
    setStatus(prev => ({
      ...prev,
      metrics: { ...prev.metrics, inp: inpMetrics.value },
      lastUpdate: Date.now()
    }))
  }, [])

  /**
   * Get metric rating color
   */
  const getMetricColor = (metric: string, value: number | null): string => {
    if (value === null) return '#6b7280' // gray-500
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? '#22c55e' : value <= 4000 ? '#f59e0b' : '#ef4444'
      case 'fid':
        return value <= 100 ? '#22c55e' : value <= 300 ? '#f59e0b' : '#ef4444'
      case 'cls':
        return value <= 0.1 ? '#22c55e' : value <= 0.25 ? '#f59e0b' : '#ef4444'
      case 'inp':
        return value <= 200 ? '#22c55e' : value <= 300 ? '#f59e0b' : '#ef4444' // Our stricter target
      case 'ttfb':
        return value <= 600 ? '#22c55e' : value <= 1500 ? '#f59e0b' : '#ef4444'
      default:
        return '#6b7280'
    }
  }

  /**
   * Format metric value
   */
  const formatMetricValue = (metric: string, value: number | null): string => {
    if (value === null) return '--'
    
    switch (metric) {
      case 'lcp':
      case 'fid':
      case 'inp':
      case 'ttfb':
        return `${value.toFixed(0)}ms`
      case 'cls':
        return value.toFixed(3)
      default:
        return value.toString()
    }
  }

  /**
   * Get metric description
   */
  const getMetricDescription = (metric: string): string => {
    switch (metric) {
      case 'lcp':
        return 'Largest Contentful Paint - Main content loading time'
      case 'fid':
        return 'First Input Delay - Initial interactivity response time'
      case 'cls':
        return 'Cumulative Layout Shift - Visual stability score'
      case 'inp':
        return 'Interaction to Next Paint - Overall responsiveness (Target: ≤200ms)'
      case 'ttfb':
        return 'Time to First Byte - Server response time'
      default:
        return ''
    }
  }

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg min-w-[320px] max-w-[400px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status.isMonitoring ? 'bg-green-500' : 'bg-red-500'}`} />
            Performance Monitor
          </h3>
          <span className="text-xs text-gray-400">
            {new Date(status.lastUpdate).toLocaleTimeString()}
          </span>
        </div>

        {/* Core Web Vitals */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {Object.entries(status.metrics).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 bg-white/5 rounded border-l-2"
              style={{ borderLeftColor: getMetricColor(key, value) }}
              title={getMetricDescription(key)}
            >
              <span className="text-xs font-medium uppercase">{key}</span>
              <span 
                className="text-sm font-mono font-bold"
                style={{ color: getMetricColor(key, value) }}
              >
                {formatMetricValue(key, value)}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        {status.alerts.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              Recent Alerts ({status.alerts.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {status.alerts.slice(-3).map((alert, index) => (
                <div key={index} className="text-xs bg-red-500/10 p-2 rounded">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-red-400">
                      {alert.type.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-red-300">
                      {alert.value.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    {alert.context.page} • {alert.context.interaction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Suggestions */}
        {status.metrics.inp !== null && status.metrics.inp > 200 && (
          <div className="border-t border-white/10 pt-3 mt-3">
            <h4 className="text-xs font-semibold mb-2 text-yellow-400">
              Optimization Suggestions
            </h4>
            <div className="text-xs text-gray-300 space-y-1">
              {inpMonitor.generateOptimizationSuggestions().slice(0, 2).map((suggestion, index) => (
                <div key={index} className="flex items-start gap-1">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Footer */}
        <div className="border-t border-white/10 pt-2 mt-3">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>SEO-PERFECTION-2025</span>
            <span>Target: INP ≤200ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor