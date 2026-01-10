/**
 * Google Analytics 4 Integration - Phase 2.5 Implementation
 * SEO-Dominance-2025 - Enterprise Core Web Vitals Analytics
 * Advanced GA4 tracking with real-time CWV monitoring and optimization insights
 */

import type { 
  NavigationMetrics, 
  UserExperienceMetrics, 
  PerformanceInsights 
} from '@/lib/performance/advanced-monitoring'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId?: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

export interface CoreWebVitalEvent {
  event_category: 'Core Web Vitals'
  event_label: string
  value: number
  metric_name: string
  rating: 'good' | 'needs-improvement' | 'poor'
  page_url: string
  user_agent: string
  connection_type?: string
  device_type: 'mobile' | 'tablet' | 'desktop'
  timestamp: number
}

export interface PerformanceAnalyticsConfig {
  measurementId: string
  enableDebugMode: boolean
  enableEnhancedMeasurement: boolean
  enableCrossDomainTracking: boolean
  sampleRate: number
  sessionTimeout: number
  customDimensions?: Record<string, string>
}

/**
 * Enterprise Google Analytics 4 Manager
 */
export class GoogleAnalyticsManager {
  private static instance: GoogleAnalyticsManager
  private config: PerformanceAnalyticsConfig
  private isInitialized: boolean = false
  private sessionId: string = ''
  private userId: string = ''
  private performanceBuffer: CoreWebVitalEvent[] = []
  private flushInterval: number = 0

  private constructor(config: PerformanceAnalyticsConfig) {
    this.config = config
    this.sessionId = this.generateSessionId()
    this.userId = this.getUserId()
  }

  static getInstance(config?: PerformanceAnalyticsConfig): GoogleAnalyticsManager {
    if (!GoogleAnalyticsManager.instance && config) {
      GoogleAnalyticsManager.instance = new GoogleAnalyticsManager(config)
    }
    return GoogleAnalyticsManager.instance
  }

  /**
   * Initialize Google Analytics 4 with Core Web Vitals tracking
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined' || this.isInitialized) return

    console.log('📊 Initializing Google Analytics 4 with Core Web Vitals...')

    try {
      // Load gtag script
      await this.loadGtagScript()
      
      // Initialize GA4
      this.initializeGA4()
      
      // Setup Core Web Vitals tracking
      this.setupCoreWebVitalsTracking()
      
      // Setup enhanced measurement
      if (this.config.enableEnhancedMeasurement) {
        this.setupEnhancedMeasurement()
      }
      
      // Setup performance buffer flushing
      this.setupPerformanceBufferFlushing()
      
      this.isInitialized = true
      console.log('✅ Google Analytics 4 initialized with Core Web Vitals tracking')
      
    } catch (error) {
      console.error('❌ Google Analytics initialization failed:', error)
    }
  }

  /**
   * Load Google Analytics gtag script
   */
  private async loadGtagScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Skip if already loaded
      if (typeof window.gtag !== 'undefined') {
        resolve()
        return
      }

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer?.push(arguments)
      }

      // Load gtag script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Analytics script'))
      
      document.head.appendChild(script)
    })
  }

  /**
   * Initialize GA4 configuration
   */
  private initializeGA4(): void {
    if (!window.gtag) return

    window.gtag('js', new Date())

    const config: Record<string, any> = {
      page_title: document.title,
      page_location: window.location.href,
      session_id: this.sessionId,
      user_id: this.userId,
      send_page_view: true,
      enhanced_measurement: this.config.enableEnhancedMeasurement,
      sample_rate: this.config.sampleRate,
      session_timeout: this.config.sessionTimeout,
      // Core Web Vitals custom parameters
      custom_map: {
        custom_parameter_1: 'core_web_vitals_score',
        custom_parameter_2: 'performance_rating',
        custom_parameter_3: 'optimization_opportunity',
        custom_parameter_4: 'device_performance_tier',
        custom_parameter_5: 'connection_effective_type'
      }
    }

    // Add custom dimensions
    if (this.config.customDimensions) {
      Object.assign(config, this.config.customDimensions)
    }

    // Enable debug mode if configured
    if (this.config.enableDebugMode) {
      config.debug_mode = true
    }

    window.gtag('config', this.config.measurementId, config)
  }

  /**
   * Setup Core Web Vitals tracking integration
   */
  private setupCoreWebVitalsTracking(): void {
    // Track Core Web Vitals from web-vitals library
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      // Largest Contentful Paint
      onLCP((metric) => {
        this.trackCoreWebVital('LCP', metric.value, this.getCWVRating('LCP', metric.value), {
          element: metric.entries[metric.entries.length - 1]?.element?.tagName || 'unknown',
          url: metric.entries[metric.entries.length - 1]?.url || 'unknown'
        })
      })

      // Interaction to Next Paint (replacing FID)
      onINP((metric) => {
        this.trackCoreWebVital('INP', metric.value, this.getCWVRating('INP', metric.value), {
          interaction_type: metric.entries[0]?.name || 'unknown',
          target_element: this.getElementSelector(metric.entries[0]?.target as Element)
        })
      })

      // Cumulative Layout Shift
      onCLS((metric) => {
        this.trackCoreWebVital('CLS', metric.value, this.getCWVRating('CLS', metric.value), {
          source_count: metric.entries.length,
          largest_shift: Math.max(...metric.entries.map(e => (e as any).value))
        })
      })

      // First Contentful Paint
      onFCP((metric) => {
        this.trackCoreWebVital('FCP', metric.value, this.getCWVRating('FCP', metric.value))
      })

      // Time to First Byte
      onTTFB((metric) => {
        this.trackCoreWebVital('TTFB', metric.value, this.getCWVRating('TTFB', metric.value))
      })
    }).catch(error => {
      console.warn('Web Vitals library not available:', error)
    })
  }

  /**
   * Track individual Core Web Vital metric
   */
  trackCoreWebVital(
    metricName: string, 
    value: number, 
    rating: 'good' | 'needs-improvement' | 'poor',
    additionalData: Record<string, any> = {}
  ): void {
    const event: CoreWebVitalEvent = {
      event_category: 'Core Web Vitals',
      event_label: `${metricName}_${rating}`,
      value: Math.round(value),
      metric_name: metricName,
      rating,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      connection_type: this.getConnectionType(),
      device_type: this.getDeviceType(),
      timestamp: Date.now(),
      ...additionalData
    }

    // Add to performance buffer
    this.performanceBuffer.push(event)

    // Send immediately for critical metrics
    if (rating === 'poor' || metricName === 'LCP' || metricName === 'INP') {
      this.flushPerformanceBuffer()
    }

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'core_web_vital', {
        event_category: 'Core Web Vitals',
        event_label: event.event_label,
        value: event.value,
        metric_name: metricName,
        metric_rating: rating,
        metric_value: value,
        custom_parameter_1: this.calculateCWVScore(),
        custom_parameter_2: rating,
        custom_parameter_3: this.getOptimizationOpportunity(metricName, rating),
        custom_parameter_4: this.getPerformanceTier(),
        custom_parameter_5: this.getConnectionType(),
        session_id: this.sessionId,
        page_path: window.location.pathname,
        ...additionalData
      })
    }

    console.log(`📊 Core Web Vital tracked: ${metricName} = ${value}ms (${rating})`)
  }

  /**
   * Track comprehensive performance metrics
   */
  trackPerformanceMetrics(
    navigationMetrics: NavigationMetrics,
    userExperienceMetrics: UserExperienceMetrics,
    insights: PerformanceInsights
  ): void {
    if (!this.isInitialized || !window.gtag) return

    // Track overall performance score
    window.gtag('event', 'performance_score', {
      event_category: 'Performance',
      event_label: 'overall_score',
      value: userExperienceMetrics.performanceScore,
      lcp_value: Math.round(navigationMetrics.lcp),
      inp_value: Math.round(navigationMetrics.inp),
      cls_value: Math.round(navigationMetrics.cls * 1000),
      fcp_value: Math.round(navigationMetrics.fcp),
      ttfb_value: Math.round(navigationMetrics.ttfb),
      interaction_count: userExperienceMetrics.interactionCount,
      scroll_depth: Math.round(userExperienceMetrics.scrollDepth),
      time_on_page: Math.round(userExperienceMetrics.timeOnPage / 1000),
      error_count: userExperienceMetrics.errorCount,
      session_id: this.sessionId
    })

    // Track SEO impact metrics
    window.gtag('event', 'seo_impact', {
      event_category: 'SEO',
      event_label: 'performance_impact',
      value: Math.round(insights.seoImpact.expectedTrafficIncrease),
      ranking_factor: insights.seoImpact.rankingFactor,
      cwv_score: insights.seoImpact.coreWebVitalsScore,
      critical_issues: insights.criticalIssues.length,
      optimization_opportunities: insights.optimizationOpportunities.length,
      session_id: this.sessionId
    })

    // Track critical performance issues
    insights.criticalIssues.forEach((issue, index) => {
      window.gtag?.('event', 'performance_issue', {
        event_category: 'Performance Issues',
        event_label: 'critical_issue',
        value: index + 1,
        issue_description: issue,
        page_path: window.location.pathname,
        session_id: this.sessionId
      })
    })
  }

  /**
   * Track resource loading performance
   */
  trackResourcePerformance(resourceUrl: string, loadTime: number, cacheHit: boolean, resourceType: string): void {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'resource_performance', {
      event_category: 'Resource Loading',
      event_label: resourceType,
      value: Math.round(loadTime),
      resource_url: resourceUrl,
      cache_hit: cacheHit,
      resource_type: resourceType,
      performance_rating: loadTime < 200 ? 'fast' : loadTime < 1000 ? 'moderate' : 'slow',
      session_id: this.sessionId
    })
  }

  /**
   * Track user engagement and interaction patterns
   */
  trackUserEngagement(engagementData: {
    scrollDepth: number
    timeOnPage: number
    interactionCount: number
    bounceRate: number
  }): void {
    if (!this.isInitialized || !window.gtag) return

    window.gtag('event', 'user_engagement', {
      event_category: 'User Experience',
      event_label: 'engagement_metrics',
      value: Math.round(engagementData.scrollDepth),
      scroll_depth: engagementData.scrollDepth,
      time_on_page: Math.round(engagementData.timeOnPage / 1000),
      interaction_count: engagementData.interactionCount,
      bounce_rate: engagementData.bounceRate,
      engagement_score: this.calculateEngagementScore(engagementData),
      session_id: this.sessionId
    })
  }

  /**
   * Setup enhanced measurement for advanced tracking
   */
  private setupEnhancedMeasurement(): void {
    // Track page scroll depth milestones
    let maxScrollDepth = 0
    const trackScrollMilestones = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100)
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        
        // Track milestone events
        if ([25, 50, 75, 90].includes(scrollDepth)) {
          window.gtag?.('event', 'scroll_milestone', {
            event_category: 'User Engagement',
            event_label: `scroll_${scrollDepth}`,
            value: scrollDepth,
            session_id: this.sessionId
          })
        }
      }
    }

    window.addEventListener('scroll', trackScrollMilestones, { passive: true })

    // Track time milestones
    const timeSpent = [10, 30, 60, 120, 300] // seconds
    timeSpent.forEach(seconds => {
      setTimeout(() => {
        window.gtag?.('event', 'time_milestone', {
          event_category: 'User Engagement',
          event_label: `time_${seconds}s`,
          value: seconds,
          session_id: this.sessionId
        })
      }, seconds * 1000)
    })

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      window.gtag?.('event', 'visibility_change', {
        event_category: 'User Engagement',
        event_label: document.visibilityState,
        session_id: this.sessionId
      })
    })
  }

  /**
   * Setup performance buffer flushing
   */
  private setupPerformanceBufferFlushing(): void {
    // Flush buffer every 30 seconds
    this.flushInterval = window.setInterval(() => {
      this.flushPerformanceBuffer()
    }, 30000)

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushPerformanceBuffer()
    })

    // Flush on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushPerformanceBuffer()
      }
    })
  }

  /**
   * Flush performance buffer to analytics
   */
  private flushPerformanceBuffer(): void {
    if (this.performanceBuffer.length === 0 || !window.gtag) return

    // Send batch event
    window.gtag('event', 'performance_batch', {
      event_category: 'Performance Monitoring',
      event_label: 'batch_metrics',
      value: this.performanceBuffer.length,
      metrics_count: this.performanceBuffer.length,
      session_id: this.sessionId,
      metrics_data: JSON.stringify(this.performanceBuffer.slice(0, 10)) // Limit payload size
    })

    console.log(`📊 Flushed ${this.performanceBuffer.length} performance metrics to Analytics`)
    this.performanceBuffer = []
  }

  /**
   * Utility methods
   */
  private getCWVRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'INP': { good: 200, poor: 500 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    return connection?.effectiveType || 'unknown'
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  private getPerformanceTier(): string {
    const memory = (navigator as any).deviceMemory || 4
    const cores = navigator.hardwareConcurrency || 4
    
    if (memory >= 8 && cores >= 8) return 'high'
    if (memory >= 4 && cores >= 4) return 'medium'
    return 'low'
  }

  private calculateCWVScore(): number {
    // Simplified score calculation
    return 85 // Would integrate with actual performance monitor
  }

  private getOptimizationOpportunity(metricName: string, rating: string): string {
    if (rating === 'good') return 'none'
    
    const opportunities: Record<string, string> = {
      'LCP': 'image_optimization',
      'INP': 'javascript_optimization',
      'CLS': 'layout_stability',
      'FCP': 'resource_prioritization',
      'TTFB': 'server_optimization'
    }
    
    return opportunities[metricName] || 'general_optimization'
  }

  private calculateEngagementScore(data: any): number {
    let score = 0
    if (data.scrollDepth > 50) score += 25
    if (data.timeOnPage > 30000) score += 25
    if (data.interactionCount > 5) score += 25
    if (data.bounceRate < 0.5) score += 25
    return score
  }

  private generateSessionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserId(): string {
    let userId = localStorage.getItem('analytics_user_id')
    if (!userId) {
      userId = `user_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
      localStorage.setItem('analytics_user_id', userId)
    }
    return userId
  }

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
   * Cleanup resources
   */
  cleanup(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushPerformanceBuffer()
  }
}

export default GoogleAnalyticsManager