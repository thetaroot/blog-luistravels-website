/**
 * Enterprise Core Web Vitals Monitoring System
 * Google Senior Dev Level Implementation
 * Focus: INP ≤200ms for 2025 ranking supremacy
 */

// Performance thresholds based on Google's 2025 requirements
export const PERFORMANCE_THRESHOLDS = {
  // Interaction to Next Paint (replaced FID in March 2024)
  INP: {
    GOOD: 200,      // ≤200ms = Good
    NEEDS_IMPROVEMENT: 500, // 200-500ms = Needs Improvement  
    POOR: 500       // >500ms = Poor
  },
  // Largest Contentful Paint
  LCP: {
    GOOD: 2500,     // ≤2.5s = Good
    NEEDS_IMPROVEMENT: 4000, // 2.5-4s = Needs Improvement
    POOR: 4000      // >4s = Poor
  },
  // Cumulative Layout Shift
  CLS: {
    GOOD: 0.1,      // ≤0.1 = Good
    NEEDS_IMPROVEMENT: 0.25, // 0.1-0.25 = Needs Improvement
    POOR: 0.25      // >0.25 = Poor
  },
  // First Contentful Paint
  FCP: {
    GOOD: 1800,     // ≤1.8s = Good
    NEEDS_IMPROVEMENT: 3000, // 1.8-3s = Needs Improvement
    POOR: 3000      // >3s = Poor
  }
} as const

export interface WebVitalMetric {
  name: string
  value: number
  delta: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
  navigationType: string
  timestamp: number
}

export interface INPEntry {
  duration: number
  startTime: number
  processingStart: number
  processingEnd: number
  eventType: string
  target: string
  interactionId?: number
}

/**
 * Enterprise Web Vitals Monitor
 */
export class WebVitalsMonitor {
  private static instance: WebVitalsMonitor
  private metrics: Map<string, WebVitalMetric> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()
  private inpEntries: INPEntry[] = []
  private isMonitoring = false

  private constructor() {}

  static getInstance(): WebVitalsMonitor {
    if (!WebVitalsMonitor.instance) {
      WebVitalsMonitor.instance = new WebVitalsMonitor()
    }
    return WebVitalsMonitor.instance
  }

  /**
   * Initialize comprehensive monitoring
   */
  initialize(): void {
    if (typeof window === 'undefined' || this.isMonitoring) return
    
    console.log('🚀 Initializing Enterprise Web Vitals Monitor')
    
    this.isMonitoring = true
    
    // Monitor all Core Web Vitals
    this.monitorLCP()
    this.monitorCLS()
    this.monitorFCP()
    this.monitorINP() // Priority focus for 2025
    this.monitorTTFB()
    this.monitorLongTasks()
    
    // Setup analytics reporting
    this.setupAnalyticsReporting()
    
    // Log initialization
    this.logPerformanceBaseline()
  }

  /**
   * INP Monitoring - Critical for 2025 SEO
   */
  private monitorINP(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      // Monitor interaction events
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'event') {
            const eventEntry = entry as PerformanceEventTiming
            
            if (eventEntry.interactionId && eventEntry.processingStart && eventEntry.processingEnd) {
              const inpValue = eventEntry.processingEnd - eventEntry.processingStart
              
              const inpEntry: INPEntry = {
                duration: inpValue,
                startTime: eventEntry.startTime,
                processingStart: eventEntry.processingStart,
                processingEnd: eventEntry.processingEnd,
                eventType: eventEntry.name,
                target: this.getElementSelector(eventEntry.target as Element),
                interactionId: eventEntry.interactionId
              }
              
              this.inpEntries.push(inpEntry)
              
              // Report if above threshold
              if (inpValue > PERFORMANCE_THRESHOLDS.INP.GOOD) {
                this.reportSlowINP(inpEntry)
              }
              
              // Update metric
              const metric: WebVitalMetric = {
                name: 'INP',
                value: inpValue,
                delta: inpValue,
                id: `inp_${Date.now()}`,
                rating: this.getRating('INP', inpValue),
                navigationType: this.getNavigationType(),
                timestamp: Date.now()
              }
              
              this.metrics.set('INP', metric)
              this.reportToAnalytics(metric)
            }
          }
        }
      })

      inpObserver.observe({ 
        type: 'event',
        buffered: true,
        durationThreshold: 16 // Report interactions > 16ms
      })
      
      this.observers.set('INP', inpObserver)
      
    } catch (error) {
      console.error('INP monitoring setup failed:', error)
    }
  }

  /**
   * LCP Monitoring
   */
  private monitorLCP(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming
        
        const metric: WebVitalMetric = {
          name: 'LCP',
          value: lastEntry.startTime,
          delta: lastEntry.startTime,
          id: `lcp_${Date.now()}`,
          rating: this.getRating('LCP', lastEntry.startTime),
          navigationType: this.getNavigationType(),
          timestamp: Date.now()
        }
        
        this.metrics.set('LCP', metric)
        this.reportToAnalytics(metric)
      })

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      this.observers.set('LCP', lcpObserver)
      
    } catch (error) {
      console.error('LCP monitoring setup failed:', error)
    }
  }

  /**
   * CLS Monitoring
   */
  private monitorCLS(): void {
    if (!('PerformanceObserver' in window)) return

    let clsValue = 0
    let sessionEntries: LayoutShift[] = []

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) {
            sessionEntries.push(entry)
            clsValue += entry.value
          }
        }
        
        const metric: WebVitalMetric = {
          name: 'CLS',
          value: clsValue,
          delta: clsValue,
          id: `cls_${Date.now()}`,
          rating: this.getRating('CLS', clsValue),
          navigationType: this.getNavigationType(),
          timestamp: Date.now()
        }
        
        this.metrics.set('CLS', metric)
        this.reportToAnalytics(metric)
      })

      clsObserver.observe({ type: 'layout-shift', buffered: true })
      this.observers.set('CLS', clsObserver)
      
    } catch (error) {
      console.error('CLS monitoring setup failed:', error)
    }
  }

  /**
   * FCP Monitoring
   */
  private monitorFCP(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const metric: WebVitalMetric = {
              name: 'FCP',
              value: entry.startTime,
              delta: entry.startTime,
              id: `fcp_${Date.now()}`,
              rating: this.getRating('FCP', entry.startTime),
              navigationType: this.getNavigationType(),
              timestamp: Date.now()
            }
            
            this.metrics.set('FCP', metric)
            this.reportToAnalytics(metric)
          }
        }
      })

      fcpObserver.observe({ type: 'paint', buffered: true })
      this.observers.set('FCP', fcpObserver)
      
    } catch (error) {
      console.error('FCP monitoring setup failed:', error)
    }
  }

  /**
   * TTFB Monitoring
   */
  private monitorTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
        
        const metric: WebVitalMetric = {
          name: 'TTFB',
          value: ttfb,
          delta: ttfb,
          id: `ttfb_${Date.now()}`,
          rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
          navigationType: this.getNavigationType(),
          timestamp: Date.now()
        }
        
        this.metrics.set('TTFB', metric)
        this.reportToAnalytics(metric)
      }
    } catch (error) {
      console.error('TTFB monitoring setup failed:', error)
    }
  }

  /**
   * Long Tasks Monitoring (affects INP)
   */
  private monitorLongTasks(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks > 50ms are "long"
            console.warn(`🐌 Long Task detected: ${entry.duration.toFixed(2)}ms`, {
              startTime: entry.startTime,
              duration: entry.duration,
              name: entry.name
            })
            
            // Report to analytics
            this.reportLongTask({
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            })
          }
        }
      })

      longTaskObserver.observe({ type: 'longtask', buffered: true })
      this.observers.set('longtask', longTaskObserver)
      
    } catch (error) {
      console.error('Long task monitoring setup failed:', error)
    }
  }

  /**
   * Get performance rating based on thresholds
   */
  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS]
    if (!thresholds) return 'good'
    
    if (value <= thresholds.GOOD) return 'good'
    if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Get navigation type
   */
  private getNavigationType(): string {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return navEntry ? navEntry.type : 'unknown'
  }

  /**
   * Get element selector for INP tracking
   */
  private getElementSelector(element: Element | null): string {
    if (!element) return 'unknown'
    
    let selector = element.tagName.toLowerCase()
    if (element.id) selector += `#${element.id}`
    if (element.className) {
      const classes = element.className.split(' ').filter(cls => cls.trim())
      if (classes.length > 0) selector += `.${classes.join('.')}`
    }
    
    return selector
  }

  /**
   * Report slow INP interactions
   */
  private reportSlowINP(entry: INPEntry): void {
    console.warn(`🐌 Slow INP detected: ${entry.duration.toFixed(2)}ms`, {
      eventType: entry.eventType,
      target: entry.target,
      threshold: PERFORMANCE_THRESHOLDS.INP.GOOD,
      recommendation: entry.duration > 200 ? 'Critical optimization needed' : 'Consider optimization'
    })
  }

  /**
   * Report long tasks that affect INP
   */
  private reportLongTask(task: { duration: number; startTime: number; name: string }): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'long_task', {
        event_category: 'Performance',
        event_label: task.name,
        value: Math.round(task.duration),
        custom_parameter_duration: task.duration,
        custom_parameter_start_time: task.startTime
      })
    }
  }

  /**
   * Report metrics to analytics
   */
  private reportToAnalytics(metric: WebVitalMetric): void {
    // Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        navigation_type: metric.navigationType
      })
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`)
    }
  }

  /**
   * Setup analytics reporting
   */
  private setupAnalyticsReporting(): void {
    // Report page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportAllMetrics()
      }
    })

    // Report before page unload
    window.addEventListener('beforeunload', () => {
      this.reportAllMetrics()
    })
  }

  /**
   * Report all collected metrics
   */
  private reportAllMetrics(): void {
    this.metrics.forEach(metric => {
      this.reportToAnalytics(metric)
    })
  }

  /**
   * Log performance baseline
   */
  private logPerformanceBaseline(): void {
    setTimeout(() => {
      const baseline = {
        INP: this.metrics.get('INP')?.value || 0,
        LCP: this.metrics.get('LCP')?.value || 0,
        CLS: this.metrics.get('CLS')?.value || 0,
        FCP: this.metrics.get('FCP')?.value || 0,
        TTFB: this.metrics.get('TTFB')?.value || 0,
        longTasks: this.inpEntries.filter(entry => entry.duration > 50).length
      }
      
      console.log('📊 Performance Baseline:', baseline)
    }, 3000)
  }

  /**
   * Get current metrics
   */
  getMetrics(): Map<string, WebVitalMetric> {
    return new Map(this.metrics)
  }

  /**
   * Get INP entries for analysis
   */
  getINPEntries(): INPEntry[] {
    return [...this.inpEntries]
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.isMonitoring = false
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initializeWebVitals(): void {
  if (typeof window !== 'undefined') {
    const monitor = WebVitalsMonitor.getInstance()
    monitor.initialize()
  }
}

/**
 * Get current Web Vitals metrics
 */
export function getWebVitals(): Map<string, WebVitalMetric> {
  if (typeof window !== 'undefined') {
    const monitor = WebVitalsMonitor.getInstance()
    return monitor.getMetrics()
  }
  return new Map()
}

// Interface for layout shift entries
interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

// Interface for event timing entries
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number
  processingEnd: number
  interactionId?: number
  target?: EventTarget
}