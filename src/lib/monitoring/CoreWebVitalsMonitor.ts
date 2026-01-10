/**
 * Core Web Vitals Real-time Monitor - PHASE 6 SEO-PERFECTION-2025
 * Advanced real-time monitoring of Core Web Vitals with performance optimization alerts
 * SENIOR GOOGLE SEO DEV Level Implementation
 */

interface WebVitalMetric {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  timestamp: number
  url: string
  device_type: 'mobile' | 'desktop' | 'tablet'
  connection_type: string
  navigation_type: 'navigate' | 'reload' | 'back-forward'
  attribution?: WebVitalAttribution
}

interface WebVitalAttribution {
  // LCP specific
  element?: string
  elementSelector?: string
  loadState?: 'loading' | 'dom-interactive' | 'dom-complete'
  renderTime?: number
  loadTime?: number
  
  // INP specific
  eventType?: string
  eventTarget?: string
  processingDuration?: number
  presentationDelay?: number
  inputDelay?: number
  
  // CLS specific
  sources?: Array<{
    element: string
    previousRect: DOMRect
    currentRect: DOMRect
  }>
  value?: number
}

interface PerformanceBudget {
  metric: string
  budget: number
  warning_threshold: number
  unit: 'ms' | 'score'
  enabled: boolean
}

interface PerformanceAlert {
  id: string
  metric: string
  current_value: number
  budget: number
  severity: 'warning' | 'critical'
  timestamp: number
  url: string
  device_type: string
  recommendations: string[]
  affected_elements?: string[]
}

interface WebVitalTrend {
  metric: string
  period: '1h' | '24h' | '7d' | '30d'
  data_points: Array<{
    timestamp: number
    value: number
    rating: string
    sample_size: number
  }>
  trend_direction: 'improving' | 'declining' | 'stable'
  trend_percentage: number
}

interface RealUserMetrics {
  total_sessions: number
  unique_users: number
  page_views: number
  bounce_rate: number
  average_session_duration: number
  core_web_vitals: {
    lcp: { p75: number; good: number; needs_improvement: number; poor: number }
    inp: { p75: number; good: number; needs_improvement: number; poor: number }
    cls: { p75: number; good: number; needs_improvement: number; poor: number }
  }
  device_breakdown: Record<string, any>
  connection_breakdown: Record<string, any>
}

export class CoreWebVitalsMonitor {
  private static instance: CoreWebVitalsMonitor
  private metrics: WebVitalMetric[] = []
  private performanceBudgets: Map<string, PerformanceBudget> = new Map()
  private alerts: PerformanceAlert[] = []
  private isMonitoring: boolean = false
  private observers: Map<string, PerformanceObserver> = new Map()
  private sessionId: string = ''
  private maxMetricsStorage = 10000 // Prevent memory issues

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializePerformanceBudgets()
  }

  public static getInstance(): CoreWebVitalsMonitor {
    if (!CoreWebVitalsMonitor.instance) {
      CoreWebVitalsMonitor.instance = new CoreWebVitalsMonitor()
    }
    return CoreWebVitalsMonitor.instance
  }

  /**
   * Start comprehensive Core Web Vitals monitoring
   */
  startMonitoring(): void {
    if (typeof window === 'undefined' || this.isMonitoring) return

    console.log('🚀 Starting Core Web Vitals real-time monitoring...')
    this.isMonitoring = true

    // Monitor LCP with detailed attribution
    this.monitorLCP()
    
    // Monitor INP with interaction attribution
    this.monitorINP()
    
    // Monitor CLS with layout shift sources
    this.monitorCLS()
    
    // Monitor FCP for painting metrics
    this.monitorFCP()
    
    // Monitor TTFB for server performance
    this.monitorTTFB()
    
    // Set up real-time analytics reporting
    this.setupRealTimeReporting()
    
    console.log('✅ Core Web Vitals monitoring active')
  }

  /**
   * Stop monitoring and cleanup observers
   */
  stopMonitoring(): void {
    this.isMonitoring = false
    
    this.observers.forEach((observer, name) => {
      observer.disconnect()
      console.log(`📊 Stopped monitoring ${name}`)
    })
    
    this.observers.clear()
    console.log('🔴 Core Web Vitals monitoring stopped')
  }

  /**
   * Monitor Largest Contentful Paint with detailed attribution
   */
  private monitorLCP(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const lcpEntry = entry as any
        
        const metric: WebVitalMetric = {
          name: 'LCP',
          value: lcpEntry.startTime,
          rating: this.getLCPRating(lcpEntry.startTime),
          delta: lcpEntry.startTime,
          id: this.generateMetricId(),
          timestamp: Date.now(),
          url: window.location.href,
          device_type: this.detectDeviceType(),
          connection_type: this.detectConnectionType(),
          navigation_type: this.getNavigationType(),
          attribution: {
            element: lcpEntry.element?.tagName || 'unknown',
            elementSelector: this.getElementSelector(lcpEntry.element),
            loadState: document.readyState as 'loading' | 'dom-interactive' | 'dom-complete',
            renderTime: lcpEntry.renderTime || lcpEntry.startTime,
            loadTime: lcpEntry.loadTime || 0
          }
        }

        this.recordMetric(metric)
        this.checkPerformanceBudget(metric)
        this.sendToAnalytics(metric)
      }
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.set('LCP', observer)
  }

  /**
   * Monitor Interaction to Next Paint with detailed attribution
   */
  private monitorINP(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const inpEntry = entry as PerformanceEventTiming
        const processingTime = inpEntry.processingEnd - inpEntry.processingStart
        
        // Only track significant interactions
        if (processingTime < 16) continue
        
        const metric: WebVitalMetric = {
          name: 'INP',
          value: processingTime,
          rating: this.getINPRating(processingTime),
          delta: processingTime,
          id: this.generateMetricId(),
          timestamp: Date.now(),
          url: window.location.href,
          device_type: this.detectDeviceType(),
          connection_type: this.detectConnectionType(),
          navigation_type: this.getNavigationType(),
          attribution: {
            eventType: inpEntry.name,
            eventTarget: this.getElementSelector(inpEntry.target as Element),
            processingDuration: processingTime,
            presentationDelay: inpEntry.startTime - inpEntry.processingEnd,
            inputDelay: inpEntry.processingStart - inpEntry.startTime
          }
        }

        this.recordMetric(metric)
        this.checkPerformanceBudget(metric)
        this.sendToAnalytics(metric)

        // Generate specific INP recommendations
        if (processingTime > 200) {
          this.generateINPAlert(metric)
        }
      }
    })

    observer.observe({ entryTypes: ['event'] })
    this.observers.set('INP', observer)
  }

  /**
   * Monitor Cumulative Layout Shift with source attribution
   */
  private monitorCLS(): void {
    let clsValue = 0
    let sessionValue = 0
    let sessionEntries: any[] = []

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any
        
        // Only count unexpected layout shifts
        if (!layoutShiftEntry.hadRecentInput) {
          sessionValue += layoutShiftEntry.value
          sessionEntries.push(layoutShiftEntry)

          // Update CLS if this session is worse
          if (sessionValue > clsValue) {
            clsValue = sessionValue
            
            const metric: WebVitalMetric = {
              name: 'CLS',
              value: clsValue,
              rating: this.getCLSRating(clsValue),
              delta: layoutShiftEntry.value,
              id: this.generateMetricId(),
              timestamp: Date.now(),
              url: window.location.href,
              device_type: this.detectDeviceType(),
              connection_type: this.detectConnectionType(),
              navigation_type: this.getNavigationType(),
              attribution: {
                value: clsValue,
                sources: sessionEntries.map(entry => ({
                  element: this.getElementSelector(entry.sources?.[0]?.node),
                  previousRect: entry.sources?.[0]?.previousRect,
                  currentRect: entry.sources?.[0]?.currentRect
                }))
              }
            }

            this.recordMetric(metric)
            this.checkPerformanceBudget(metric)
            this.sendToAnalytics(metric)
          }
        }

        // Reset session if there's been a gap
        if (entry.startTime - sessionEntries[sessionEntries.length - 1]?.startTime > 5000) {
          sessionValue = 0
          sessionEntries = []
        }
      }
    })

    observer.observe({ entryTypes: ['layout-shift'] })
    this.observers.set('CLS', observer)
  }

  /**
   * Monitor First Contentful Paint
   */
  private monitorFCP(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const metric: WebVitalMetric = {
            name: 'FCP',
            value: entry.startTime,
            rating: this.getFCPRating(entry.startTime),
            delta: entry.startTime,
            id: this.generateMetricId(),
            timestamp: Date.now(),
            url: window.location.href,
            device_type: this.detectDeviceType(),
            connection_type: this.detectConnectionType(),
            navigation_type: this.getNavigationType()
          }

          this.recordMetric(metric)
          this.sendToAnalytics(metric)
        }
      }
    })

    observer.observe({ entryTypes: ['paint'] })
    this.observers.set('FCP', observer)
  }

  /**
   * Monitor Time to First Byte
   */
  private monitorTTFB(): void {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart

      const metric: WebVitalMetric = {
        name: 'TTFB',
        value: ttfb,
        rating: this.getTTFBRating(ttfb),
        delta: ttfb,
        id: this.generateMetricId(),
        timestamp: Date.now(),
        url: window.location.href,
        device_type: this.detectDeviceType(),
        connection_type: this.detectConnectionType(),
        navigation_type: this.getNavigationType()
      }

      this.recordMetric(metric)
      this.sendToAnalytics(metric)
    }
  }

  /**
   * Record metric and manage storage
   */
  private recordMetric(metric: WebVitalMetric): void {
    this.metrics.push(metric)
    
    // Prevent memory issues by limiting stored metrics
    if (this.metrics.length > this.maxMetricsStorage) {
      this.metrics = this.metrics.slice(-this.maxMetricsStorage)
    }

    console.log(`📊 ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`)
  }

  /**
   * Check performance budgets and generate alerts
   */
  private checkPerformanceBudget(metric: WebVitalMetric): void {
    const budget = this.performanceBudgets.get(metric.name)
    if (!budget || !budget.enabled) return

    const isOverBudget = metric.value > budget.budget
    const isOverWarning = metric.value > budget.warning_threshold

    if (isOverBudget || isOverWarning) {
      const alert: PerformanceAlert = {
        id: this.generateAlertId(),
        metric: metric.name,
        current_value: metric.value,
        budget: budget.budget,
        severity: isOverBudget ? 'critical' : 'warning',
        timestamp: Date.now(),
        url: metric.url,
        device_type: metric.device_type,
        recommendations: this.generateRecommendations(metric),
        affected_elements: metric.attribution?.elementSelector ? [metric.attribution.elementSelector] : undefined
      }

      this.alerts.push(alert)
      this.triggerAlert(alert)
    }
  }

  /**
   * Generate specific recommendations based on metric and attribution
   */
  private generateRecommendations(metric: WebVitalMetric): string[] {
    const recommendations: string[] = []

    switch (metric.name) {
      case 'LCP':
        recommendations.push(
          'Optimize server response times (TTFB)',
          'Implement resource preloading for critical assets',
          'Use next-gen image formats (WebP, AVIF)',
          'Eliminate render-blocking resources',
          'Use CDN for static assets'
        )
        break

      case 'INP':
        recommendations.push(
          'Use requestIdleCallback for heavy operations',
          'Implement code splitting and lazy loading',
          'Optimize event handlers with throttling/debouncing',
          'Reduce main thread blocking time',
          'Use web workers for intensive computations'
        )
        break

      case 'CLS':
        recommendations.push(
          'Add size attributes to images and videos',
          'Reserve space for dynamic content',
          'Use CSS aspect-ratio for responsive elements',
          'Avoid inserting content above existing content',
          'Use transform animations instead of layout changes'
        )
        break

      case 'FCP':
        recommendations.push(
          'Inline critical CSS',
          'Optimize font loading',
          'Minimize render-blocking JavaScript',
          'Use resource hints (preconnect, preload)',
          'Optimize server response times'
        )
        break

      case 'TTFB':
        recommendations.push(
          'Optimize server processing time',
          'Use CDN for global content delivery',
          'Implement server-side caching',
          'Optimize database queries',
          'Use HTTP/2 or HTTP/3'
        )
        break
    }

    return recommendations
  }

  /**
   * Generate INP-specific alert with detailed analysis
   */
  private generateINPAlert(metric: WebVitalMetric): void {
    const alert: PerformanceAlert = {
      id: this.generateAlertId(),
      metric: 'INP',
      current_value: metric.value,
      budget: 200,
      severity: metric.value > 500 ? 'critical' : 'warning',
      timestamp: Date.now(),
      url: metric.url,
      device_type: metric.device_type,
      recommendations: [
        `Optimize ${metric.attribution?.eventType} event handler`,
        'Consider breaking up long tasks',
        'Use yield() to allow main thread breathing room',
        'Profile JavaScript execution to identify bottlenecks'
      ],
      affected_elements: metric.attribution?.eventTarget ? [metric.attribution.eventTarget] : undefined
    }

    this.alerts.push(alert)
    this.triggerAlert(alert)
  }

  /**
   * Trigger alert notification
   */
  private triggerAlert(alert: PerformanceAlert): void {
    console.warn(`🚨 Performance Alert: ${alert.metric} ${alert.severity}`, alert)

    // Send to external monitoring systems
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_alert', {
        event_category: 'Performance',
        event_label: alert.metric,
        value: alert.current_value,
        custom_parameters: {
          severity: alert.severity,
          budget: alert.budget,
          device_type: alert.device_type,
          url: alert.url
        }
      })
    }
  }

  /**
   * Set up real-time reporting to analytics
   */
  private setupRealTimeReporting(): void {
    // Send metrics to analytics every 30 seconds
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.sendBatchAnalytics()
      }
    }, 30000)

    // Send session summary on page unload
    window.addEventListener('beforeunload', () => {
      this.sendSessionSummary()
    })
  }

  /**
   * Send individual metric to analytics
   */
  private sendToAnalytics(metric: WebVitalMetric): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals_real_time', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_parameters: {
          rating: metric.rating,
          device_type: metric.device_type,
          connection_type: metric.connection_type,
          navigation_type: metric.navigation_type,
          url: metric.url,
          session_id: this.sessionId
        }
      })
    }
  }

  /**
   * Send batch analytics data
   */
  private sendBatchAnalytics(): void {
    const recentMetrics = this.metrics.filter(m => Date.now() - m.timestamp < 300000) // Last 5 minutes
    
    if (recentMetrics.length === 0) return

    const summary = this.generateMetricsSummary(recentMetrics)
    
    console.log('📊 Sending batch analytics:', summary)
  }

  /**
   * Send session summary
   */
  private sendSessionSummary(): void {
    const summary = this.generateMetricsSummary(this.metrics)
    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals_session_summary', {
        event_category: 'Performance',
        custom_parameters: {
          ...summary,
          session_id: this.sessionId,
          total_metrics: this.metrics.length,
          total_alerts: this.alerts.length
        }
      })
    }
  }

  /**
   * Generate metrics summary
   */
  private generateMetricsSummary(metrics: WebVitalMetric[]): Record<string, any> {
    const summary = {} as Record<string, any>

    ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].forEach(metricName => {
      const metricData = metrics.filter(m => m.name === metricName)
      if (metricData.length > 0) {
        const values = metricData.map(m => m.value)
        summary[metricName.toLowerCase()] = {
          count: metricData.length,
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          p75: this.percentile(values, 0.75),
          good: metricData.filter(m => m.rating === 'good').length,
          needs_improvement: metricData.filter(m => m.rating === 'needs-improvement').length,
          poor: metricData.filter(m => m.rating === 'poor').length
        }
      }
    })

    return summary
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(period: '1h' | '24h' | '7d' | '30d' = '24h'): WebVitalTrend[] {
    const timeRanges = {
      '1h': 3600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000
    }

    const cutoff = Date.now() - timeRanges[period]
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff)

    const trends: WebVitalTrend[] = [];

    ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].forEach(metricName => {
      const metricData = recentMetrics.filter(m => m.name === metricName)
      if (metricData.length > 0) {
        const trend = this.calculateTrend(metricData, period)
        trends.push(trend)
      }
    })

    return trends
  }

  /**
   * Calculate performance trend
   */
  private calculateTrend(metrics: WebVitalMetric[], period: '1h' | '24h' | '7d' | '30d'): WebVitalTrend {
    const bucketSize = this.getBucketSize(period)
    const buckets = this.groupMetricsIntoBuckets(metrics, bucketSize)
    
    const dataPoints = buckets.map(bucket => ({
      timestamp: bucket.timestamp,
      value: bucket.values.reduce((a, b) => a + b, 0) / bucket.values.length,
      rating: this.getMostCommonRating(bucket.ratings),
      sample_size: bucket.values.length
    }))

    const trendDirection = this.calculateTrendDirection(dataPoints)
    const trendPercentage = this.calculateTrendPercentage(dataPoints)

    return {
      metric: metrics[0].name,
      period,
      data_points: dataPoints,
      trend_direction: trendDirection,
      trend_percentage: trendPercentage
    }
  }

  /**
   * Get real user metrics summary
   */
  getRealUserMetrics(): RealUserMetrics {
    const summary = this.generateMetricsSummary(this.metrics)
    
    return {
      total_sessions: 1, // Would be tracked separately
      unique_users: 1,
      page_views: this.metrics.length,
      bounce_rate: 0, // Would be calculated from navigation data
      average_session_duration: 0, // Would be tracked separately
      core_web_vitals: {
        lcp: summary.lcp || { p75: 0, good: 0, needs_improvement: 0, poor: 0 },
        inp: summary.inp || { p75: 0, good: 0, needs_improvement: 0, poor: 0 },
        cls: summary.cls || { p75: 0, good: 0, needs_improvement: 0, poor: 0 }
      },
      device_breakdown: this.getDeviceBreakdown(),
      connection_breakdown: this.getConnectionBreakdown()
    }
  }

  // Rating helper methods
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good'
    if (value <= 4000) return 'needs-improvement'
    return 'poor'
  }

  private getINPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 200) return 'good'
    if (value <= 500) return 'needs-improvement'
    return 'poor'
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good'
    if (value <= 0.25) return 'needs-improvement'
    return 'poor'
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good'
    if (value <= 3000) return 'needs-improvement'
    return 'poor'
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 600) return 'good'
    if (value <= 1800) return 'needs-improvement'
    return 'poor'
  }

  // Utility methods
  private initializePerformanceBudgets(): void {
    const budgets: PerformanceBudget[] = [
      { metric: 'LCP', budget: 2500, warning_threshold: 2000, unit: 'ms', enabled: true },
      { metric: 'INP', budget: 200, warning_threshold: 150, unit: 'ms', enabled: true },
      { metric: 'CLS', budget: 0.1, warning_threshold: 0.05, unit: 'score', enabled: true },
      { metric: 'FCP', budget: 1800, warning_threshold: 1500, unit: 'ms', enabled: true },
      { metric: 'TTFB', budget: 600, warning_threshold: 400, unit: 'ms', enabled: true }
    ]

    budgets.forEach(budget => {
      this.performanceBudgets.set(budget.metric, budget)
    })
  }

  private detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width <= 768) return 'mobile'
    if (width <= 1024) return 'tablet'
    return 'desktop'
  }

  private detectConnectionType(): string {
    if (typeof navigator === 'undefined') return 'unknown'
    const connection = (navigator as any).connection
    return connection?.effectiveType || 'unknown'
  }

  private getNavigationType(): 'navigate' | 'reload' | 'back-forward' {
    if (typeof performance === 'undefined') return 'navigate'
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    switch (navigationEntry?.type) {
      case 'reload': return 'reload'
      case 'back_forward': return 'back-forward'
      default: return 'navigate'
    }
  }

  private getElementSelector(element: Element | null): string {
    if (!element) return 'unknown'
    
    let selector = element.tagName.toLowerCase()
    if (element.id) selector += `#${element.id}`
    if (element.className) selector += `.${element.className.split(' ').join('.')}`
    
    return selector
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private percentile(arr: number[], p: number): number {
    const sorted = arr.slice().sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * p) - 1
    return sorted[index] || 0
  }

  private getBucketSize(period: string): number {
    const bucketSizes = {
      '1h': 300000, // 5 minutes
      '24h': 3600000, // 1 hour
      '7d': 86400000, // 1 day
      '30d': 86400000 // 1 day
    }
    return bucketSizes[period as keyof typeof bucketSizes] || 3600000
  }

  private groupMetricsIntoBuckets(metrics: WebVitalMetric[], bucketSize: number): Array<{
    timestamp: number
    values: number[]
    ratings: string[]
  }> {
    const buckets = new Map<number, { values: number[], ratings: string[] }>()
    
    metrics.forEach(metric => {
      const bucketTime = Math.floor(metric.timestamp / bucketSize) * bucketSize
      if (!buckets.has(bucketTime)) {
        buckets.set(bucketTime, { values: [], ratings: [] })
      }
      buckets.get(bucketTime)!.values.push(metric.value)
      buckets.get(bucketTime)!.ratings.push(metric.rating)
    })

    return Array.from(buckets.entries()).map(([timestamp, data]) => ({
      timestamp,
      ...data
    }))
  }

  private getMostCommonRating(ratings: string[]): string {
    const counts = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0]
  }

  private calculateTrendDirection(dataPoints: Array<{ value: number }>): 'improving' | 'declining' | 'stable' {
    if (dataPoints.length < 2) return 'stable'
    
    const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2))
    const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, dp) => sum + dp.value, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, dp) => sum + dp.value, 0) / secondHalf.length
    
    const change = (secondAvg - firstAvg) / firstAvg * 100
    
    if (Math.abs(change) < 5) return 'stable'
    return change < 0 ? 'improving' : 'declining'
  }

  private calculateTrendPercentage(dataPoints: Array<{ value: number }>): number {
    if (dataPoints.length < 2) return 0
    
    const firstValue = dataPoints[0].value
    const lastValue = dataPoints[dataPoints.length - 1].value
    
    return (lastValue - firstValue) / firstValue * 100
  }

  private getDeviceBreakdown(): Record<string, any> {
    const breakdown = {} as Record<string, any>
    
    ['mobile', 'desktop', 'tablet'].forEach(device => {
      const deviceMetrics = this.metrics.filter(m => m.device_type === device)
      if (deviceMetrics.length > 0) {
        breakdown[device] = {
          sessions: deviceMetrics.length,
          avg_lcp: this.averageMetricValue(deviceMetrics, 'LCP'),
          avg_inp: this.averageMetricValue(deviceMetrics, 'INP'),
          avg_cls: this.averageMetricValue(deviceMetrics, 'CLS')
        }
      }
    })

    return breakdown
  }

  private getConnectionBreakdown(): Record<string, any> {
    const breakdown: Record<string, any> = {}
    
    const connections = [...new Set(this.metrics.map(m => m.connection_type))]
    connections.forEach(connection => {
      const connectionMetrics = this.metrics.filter(m => m.connection_type === connection)
      if (connectionMetrics.length > 0) {
        breakdown[connection] = {
          sessions: connectionMetrics.length,
          avg_lcp: this.averageMetricValue(connectionMetrics, 'LCP'),
          avg_inp: this.averageMetricValue(connectionMetrics, 'INP'),
          avg_cls: this.averageMetricValue(connectionMetrics, 'CLS')
        }
      }
    })

    return breakdown
  }

  private averageMetricValue(metrics: WebVitalMetric[], metricName: string): number {
    const filteredMetrics = metrics.filter(m => m.name === metricName)
    if (filteredMetrics.length === 0) return 0
    return filteredMetrics.reduce((sum, m) => sum + m.value, 0) / filteredMetrics.length
  }

  // Public methods
  public getMetrics(): WebVitalMetric[] {
    return this.metrics
  }

  public getAlerts(): PerformanceAlert[] {
    return this.alerts
  }

  public clearData(): void {
    this.metrics = []
    this.alerts = []
    console.log('🧹 Core Web Vitals data cleared')
  }

  public getStats(): object {
    return {
      is_monitoring: this.isMonitoring,
      total_metrics: this.metrics.length,
      total_alerts: this.alerts.length,
      observers_count: this.observers.size,
      session_id: this.sessionId,
      performance_budgets: Object.fromEntries(this.performanceBudgets)
    }
  }
}

// Export singleton instance
export const coreWebVitalsMonitor = CoreWebVitalsMonitor.getInstance()