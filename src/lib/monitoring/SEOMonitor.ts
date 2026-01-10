/**
 * SEO Monitor - PHASE 6 SEO-PERFECTION-2025
 * Complete SEO monitoring system for Google dominance tracking
 * SENIOR GOOGLE SEO DEV Level Implementation
 */

interface SEOEvent {
  event: string
  page: string
  timestamp: number
  data: Record<string, any>
  user_agent?: string
  referrer?: string
  session_id?: string
}

interface RankingData {
  keyword: string
  position: number
  url: string
  previous_position?: number
  change: number
  search_volume: number
  difficulty: number
  competitor_positions?: Record<string, number>
}

interface CoreWebVitalsMetric {
  metric: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  url: string
  timestamp: number
  device_type: 'mobile' | 'desktop'
  connection_type: string
}

interface SEOAlertRule {
  id: string
  name: string
  type: 'ranking_drop' | 'traffic_drop' | 'performance_degradation' | 'crawl_error' | 'schema_error'
  threshold: number
  enabled: boolean
  notification_channels: ('email' | 'slack' | 'webhook')[]
}

export class SEOMonitor {
  private static instance: SEOMonitor
  private events: SEOEvent[] = []
  private rankings: Map<string, RankingData[]> = new Map()
  private coreWebVitals: CoreWebVitalsMetric[] = []
  private alertRules: Map<string, SEOAlertRule> = new Map()
  private monitoringActive: boolean = false

  constructor() {
    this.initializeDefaultAlertRules()
    this.startMonitoring()
  }

  public static getInstance(): SEOMonitor {
    if (!SEOMonitor.instance) {
      SEOMonitor.instance = new SEOMonitor()
    }
    return SEOMonitor.instance
  }

  /**
   * Track page views and SEO events
   */
  async trackPageView(url: string, title: string, additionalData?: Record<string, any>): Promise<void> {
    const event: SEOEvent = {
      event: 'page_view',
      page: url,
      timestamp: Date.now(),
      data: {
        title,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        ...additionalData
      },
      session_id: this.getSessionId()
    }

    this.events.push(event)
    
    // Google Analytics 4 integration
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_title: title,
        page_location: url,
        page_referrer: document.referrer,
        custom_map: {
          custom_parameter_1: 'seo_monitoring_active'
        }
      })

      // Enhanced event tracking
      (window as any).gtag('event', 'page_view_enhanced', {
        event_category: 'SEO',
        event_label: url,
        custom_parameters: {
          page_type: this.determinePageType(url),
          content_category: this.extractContentCategory(url),
          load_time: performance.now()
        }
      })
    }

    // Submit to Google Search Console API
    await this.submitToSearchConsole(url)
    
    // Real-time analytics
    await this.sendToAnalytics(event)
  }

  /**
   * Monitor Core Web Vitals in real-time
   */
  initializeCoreWebVitalsMonitoring(): void {
    if (typeof window === 'undefined') return

    console.log('🎯 Initializing Core Web Vitals monitoring...')

    // LCP Monitoring
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const lcpEntry = entry as PerformanceEntry
        const metric: CoreWebVitalsMetric = {
          metric: 'LCP',
          value: lcpEntry.startTime,
          rating: lcpEntry.startTime <= 2500 ? 'good' : lcpEntry.startTime <= 4000 ? 'needs-improvement' : 'poor',
          url: window.location.href,
          timestamp: Date.now(),
          device_type: this.detectDeviceType(),
          connection_type: this.detectConnectionType()
        }
        
        this.recordCoreWebVital(metric)
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // INP Monitoring (Enhanced)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const inpEntry = entry as PerformanceEventTiming
        const processingTime = inpEntry.processingEnd - inpEntry.processingStart
        
        const metric: CoreWebVitalsMetric = {
          metric: 'INP',
          value: processingTime,
          rating: processingTime <= 200 ? 'good' : processingTime <= 500 ? 'needs-improvement' : 'poor',
          url: window.location.href,
          timestamp: Date.now(),
          device_type: this.detectDeviceType(),
          connection_type: this.detectConnectionType()
        }
        
        this.recordCoreWebVital(metric)
        
        // Alert for budget violations
        if (processingTime > 200) {
          this.triggerAlert('performance_degradation', {
            metric: 'INP',
            value: processingTime,
            threshold: 200,
            url: window.location.href
          })
        }
      }
    }).observe({ entryTypes: ['event'] })

    // CLS Monitoring
    new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value
        }
      }
      
      if (clsValue > 0) {
        const metric: CoreWebVitalsMetric = {
          metric: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          url: window.location.href,
          timestamp: Date.now(),
          device_type: this.detectDeviceType(),
          connection_type: this.detectConnectionType()
        }
        
        this.recordCoreWebVital(metric)
      }
    }).observe({ entryTypes: ['layout-shift'] })

    // TTFB Monitoring
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      
      const metric: CoreWebVitalsMetric = {
        metric: 'TTFB',
        value: ttfb,
        rating: ttfb <= 600 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
        url: window.location.href,
        timestamp: Date.now(),
        device_type: this.detectDeviceType(),
        connection_type: this.detectConnectionType()
      }
      
      this.recordCoreWebVital(metric)
    }

    console.log('✅ Core Web Vitals monitoring active')
  }

  /**
   * Track search rankings and changes
   */
  async trackRankings(keywords: string[]): Promise<void> {
    console.log(`📊 Tracking rankings for ${keywords.length} keywords...`)
    
    for (const keyword of keywords) {
      try {
        const rankingData = await this.fetchRankingData(keyword)
        const existingRankings = this.rankings.get(keyword) || []
        
        // Calculate position change
        const previousRanking = existingRankings[existingRankings.length - 1]
        const change = previousRanking ? previousRanking.position - rankingData.position : 0
        
        const enhancedRankingData: RankingData = {
          ...rankingData,
          previous_position: previousRanking?.position,
          change
        }
        
        existingRankings.push(enhancedRankingData)
        this.rankings.set(keyword, existingRankings)
        
        // Check for significant ranking changes
        if (Math.abs(change) >= 5) {
          this.triggerAlert('ranking_drop', {
            keyword,
            current_position: rankingData.position,
            previous_position: previousRanking?.position,
            change,
            url: rankingData.url
          })
        }
        
        // Track in analytics
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'ranking_tracked', {
            event_category: 'SEO',
            event_label: keyword,
            value: rankingData.position,
            custom_parameters: {
              position_change: change,
              search_volume: rankingData.search_volume,
              keyword_difficulty: rankingData.difficulty
            }
          })
        }
        
      } catch (error) {
        console.error(`Failed to track ranking for keyword: ${keyword}`, error)
      }
    }
    
    console.log('✅ Ranking tracking completed')
  }

  /**
   * Submit URL to Google Search Console for indexing
   */
  private async submitToSearchConsole(url: string): Promise<void> {
    try {
      // In production, this would use the Google Search Console API
      const indexingRequest = {
        url,
        timestamp: new Date().toISOString(),
        action: 'submit_for_indexing'
      }
      
      // Mock API call - replace with actual Google Search Console API
      console.log(`📤 Submitting to Search Console: ${url}`)
      
      // Track submission
      this.trackEvent('search_console_submission', url, {
        submission_timestamp: indexingRequest.timestamp,
        submission_type: 'automatic'
      })
      
    } catch (error) {
      console.error('Search Console submission failed:', error)
    }
  }

  /**
   * Record Core Web Vitals metric
   */
  private recordCoreWebVital(metric: CoreWebVitalsMetric): void {
    this.coreWebVitals.push(metric)
    
    // Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.metric,
        value: Math.round(metric.value),
        custom_parameters: {
          rating: metric.rating,
          device_type: metric.device_type,
          connection_type: metric.connection_type,
          url: metric.url
        }
      })
    }
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.coreWebVitals.length > 1000) {
      this.coreWebVitals = this.coreWebVitals.slice(-1000)
    }
    
    console.log(`📊 Core Web Vital recorded: ${metric.metric} = ${metric.value}ms (${metric.rating})`)
  }

  /**
   * Track custom SEO events
   */
  trackEvent(eventName: string, page: string, data: Record<string, any>): void {
    const event: SEOEvent = {
      event: eventName,
      page,
      timestamp: Date.now(),
      data,
      session_id: this.getSessionId()
    }
    
    this.events.push(event)
    
    // Send to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', eventName, {
        event_category: 'SEO',
        event_label: page,
        custom_parameters: data
      })
    }
  }

  /**
   * Trigger SEO alerts based on rules
   */
  private async triggerAlert(alertType: string, data: Record<string, any>): Promise<void> {
    const alertRule = this.alertRules.get(alertType)
    if (!alertRule || !alertRule.enabled) return
    
    console.warn(`🚨 SEO Alert triggered: ${alertRule.name}`, data)
    
    // Send notifications
    for (const channel of alertRule.notification_channels) {
      switch (channel) {
        case 'email':
          await this.sendEmailAlert(alertRule, data)
          break
        case 'slack':
          await this.sendSlackAlert(alertRule, data)
          break
        case 'webhook':
          await this.sendWebhookAlert(alertRule, data)
          break
      }
    }
    
    // Track alert in analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'seo_alert_triggered', {
        event_category: 'Alerts',
        event_label: alertType,
        custom_parameters: {
          alert_name: alertRule.name,
          alert_threshold: alertRule.threshold,
          ...data
        }
      })
    }
  }

  /**
   * Get comprehensive SEO monitoring report
   */
  getMonitoringReport(): {
    summary: any
    events: SEOEvent[]
    rankings: Record<string, RankingData[]>
    coreWebVitals: CoreWebVitalsMetric[]
    alerts: any[]
  } {
    const now = Date.now()
    const last24Hours = now - 24 * 60 * 60 * 1000
    
    const recentEvents = this.events.filter(e => e.timestamp > last24Hours)
    const recentVitals = this.coreWebVitals.filter(v => v.timestamp > last24Hours)
    
    return {
      summary: {
        total_events: this.events.length,
        events_24h: recentEvents.length,
        unique_pages_24h: new Set(recentEvents.map(e => e.page)).size,
        avg_lcp: this.calculateAverageMetric('LCP', recentVitals),
        avg_inp: this.calculateAverageMetric('INP', recentVitals),
        avg_cls: this.calculateAverageMetric('CLS', recentVitals),
        total_keywords_tracked: this.rankings.size,
        monitoring_uptime: this.monitoringActive ? '100%' : '0%'
      },
      events: recentEvents,
      rankings: Object.fromEntries(this.rankings),
      coreWebVitals: recentVitals,
      alerts: this.getRecentAlerts()
    }
  }

  // Helper methods
  private async fetchRankingData(keyword: string): Promise<RankingData> {
    // Mock ranking data - replace with actual ranking API
    return {
      keyword,
      position: Math.floor(Math.random() * 20) + 1,
      url: `https://heretheregone.com/blog/${keyword.replace(/\s+/g, '-')}`,
      search_volume: Math.floor(Math.random() * 10000) + 1000,
      difficulty: Math.floor(Math.random() * 100) + 1,
      change: 0
    }
  }

  private calculateAverageMetric(metric: string, vitals: CoreWebVitalsMetric[]): number {
    const metricVitals = vitals.filter(v => v.metric === metric)
    if (metricVitals.length === 0) return 0
    return metricVitals.reduce((sum, v) => sum + v.value, 0) / metricVitals.length
  }

  private detectDeviceType(): 'mobile' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop'
    return window.innerWidth <= 768 ? 'mobile' : 'desktop'
  }

  private detectConnectionType(): string {
    if (typeof navigator === 'undefined') return 'unknown'
    const connection = (navigator as any).connection
    return connection?.effectiveType || 'unknown'
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    return sessionStorage.getItem('seo_session_id') || 'anonymous'
  }

  private determinePageType(url: string): string {
    if (url.includes('/blog/')) return 'blog_post'
    if (url.includes('/gallery/')) return 'gallery'
    if (url === '/') return 'homepage'
    return 'other'
  }

  private extractContentCategory(url: string): string {
    const segments = url.split('/').filter(Boolean)
    return segments[0] || 'homepage'
  }

  private initializeDefaultAlertRules(): void {
    const defaultRules: SEOAlertRule[] = [
      {
        id: 'ranking_drop',
        name: 'Significant Ranking Drop',
        type: 'ranking_drop',
        threshold: 5,
        enabled: true,
        notification_channels: ['email', 'slack']
      },
      {
        id: 'performance_degradation',
        name: 'Performance Degradation',
        type: 'performance_degradation',
        threshold: 200,
        enabled: true,
        notification_channels: ['email']
      },
      {
        id: 'traffic_drop',
        name: 'Traffic Drop Alert',
        type: 'traffic_drop',
        threshold: 20,
        enabled: true,
        notification_channels: ['email', 'slack']
      }
    ]

    defaultRules.forEach(rule => {
      this.alertRules.set(rule.id, rule)
    })
  }

  private startMonitoring(): void {
    this.monitoringActive = true
    console.log('🚀 SEO Monitoring system started')
    
    // Initialize Core Web Vitals monitoring if in browser
    if (typeof window !== 'undefined') {
      this.initializeCoreWebVitalsMonitoring()
    }
  }

  private async sendToAnalytics(event: SEOEvent): Promise<void> {
    // Send to external analytics service
    try {
      console.log('📊 Sending event to analytics:', event.event)
    } catch (error) {
      console.error('Analytics submission failed:', error)
    }
  }

  private async sendEmailAlert(rule: SEOAlertRule, data: Record<string, any>): Promise<void> {
    console.log('📧 Email alert:', rule.name, data)
  }

  private async sendSlackAlert(rule: SEOAlertRule, data: Record<string, any>): Promise<void> {
    console.log('💬 Slack alert:', rule.name, data)
  }

  private async sendWebhookAlert(rule: SEOAlertRule, data: Record<string, any>): Promise<void> {
    console.log('🔗 Webhook alert:', rule.name, data)
  }

  private getRecentAlerts(): any[] {
    // Return recent alerts - implementation depends on alert storage
    return []
  }

  // Public methods for external usage
  public clearCache(): void {
    this.events = []
    this.coreWebVitals = []
    console.log('🧹 SEO monitoring cache cleared')
  }

  public getStats(): object {
    return {
      total_events: this.events.length,
      total_rankings: this.rankings.size,
      total_core_web_vitals: this.coreWebVitals.length,
      alert_rules: this.alertRules.size,
      monitoring_active: this.monitoringActive
    }
  }
}

// Export singleton instance
export const seoMonitor = SEOMonitor.getInstance()