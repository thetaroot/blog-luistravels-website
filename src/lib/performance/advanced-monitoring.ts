/**
 * Advanced Performance Monitoring System
 * SEO-Dominance-2025 - Comprehensive Core Web Vitals tracking and optimization
 * Enterprise-level performance analysis with predictive insights
 */

export interface PerformanceMetric {
  name: string
  value: number
  delta: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  id: string
  navigationType: string
  url: string
}

export interface ResourceTiming {
  name: string
  duration: number
  transferSize: number
  decodedBodySize: number
  startTime: number
  responseEnd: number
  initiatorType: string
  cacheHit: boolean
}

export interface NavigationMetrics {
  ttfb: number // Time to First Byte
  fcp: number  // First Contentful Paint
  lcp: number  // Largest Contentful Paint
  fid: number  // First Input Delay (legacy)
  inp: number  // Interaction to Next Paint
  cls: number  // Cumulative Layout Shift
  tbt: number  // Total Blocking Time
  si: number   // Speed Index
}

export interface UserExperienceMetrics {
  bounceRate: number
  timeOnPage: number
  scrollDepth: number
  interactionCount: number
  errorCount: number
  performanceScore: number
}

export interface PerformanceInsights {
  criticalIssues: string[]
  optimizationOpportunities: string[]
  predictedImprovements: Record<string, number>
  competitorComparison: Record<string, number>
  seoImpact: {
    rankingFactor: number
    expectedTrafficIncrease: number
    coreWebVitalsScore: number
  }
}

/**
 * Enterprise Advanced Performance Monitor
 */
export class AdvancedPerformanceMonitor {
  private static instance: AdvancedPerformanceMonitor
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private navigationMetrics: NavigationMetrics | null = null
  private resourceTimings: ResourceTiming[] = []
  private userExperienceMetrics: UserExperienceMetrics = {
    bounceRate: 0,
    timeOnPage: 0,
    scrollDepth: 0,
    interactionCount: 0,
    errorCount: 0,
    performanceScore: 0
  }
  private observers: Map<string, PerformanceObserver> = new Map()
  private isMonitoring: boolean = false
  private sessionStartTime: number = 0

  private constructor() {
    this.sessionStartTime = Date.now()
  }

  static getInstance(): AdvancedPerformanceMonitor {
    if (!AdvancedPerformanceMonitor.instance) {
      AdvancedPerformanceMonitor.instance = new AdvancedPerformanceMonitor()
    }
    return AdvancedPerformanceMonitor.instance
  }

  /**
   * Initialize comprehensive performance monitoring
   */
  initialize(): void {
    if (typeof window === 'undefined' || this.isMonitoring) return

    console.log('📊 Initializing Advanced Performance Monitor...')

    this.isMonitoring = true
    this.setupCoreWebVitalsMonitoring()
    this.setupResourceTimingMonitoring()
    this.setupUserExperienceTracking()
    this.setupNavigationMetrics()
    this.schedulePerformanceAnalysis()

    console.log('✅ Advanced Performance Monitor initialized')
  }

  /**
   * Setup Core Web Vitals monitoring with enhanced tracking
   */
  private setupCoreWebVitalsMonitoring(): void {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1] as PerformancePaintTiming
      this.recordMetric('LCP', lastEntry.startTime, 'paint')
    })

    // First Input Delay (FID) - Legacy
    this.observeMetric('first-input', (entries) => {
      entries.forEach(entry => {
        const fidEntry = entry as PerformanceEventTiming
        const fid = fidEntry.processingStart - fidEntry.startTime
        this.recordMetric('FID', fid, 'input')
      })
    })

    // Interaction to Next Paint (INP) - New Core Web Vital
    this.observeMetric('event', (entries) => {
      entries.forEach(entry => {
        const eventEntry = entry as PerformanceEventTiming
        if (eventEntry.interactionId && eventEntry.processingStart && eventEntry.processingEnd) {
          const inp = eventEntry.processingEnd - eventEntry.processingStart
          this.recordMetric('INP', inp, 'interaction')
          
          // Advanced INP analysis
          this.analyzeINPPerformance(eventEntry, inp)
        }
      })
    })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    this.observeMetric('layout-shift', (entries) => {
      entries.forEach(entry => {
        const layoutShiftEntry = entry as any
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value
          this.recordMetric('CLS', clsValue, 'layout')
        }
      })
    })

    // First Contentful Paint (FCP)
    this.observeMetric('paint', (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime, 'paint')
        }
      })
    })

    // Total Blocking Time (TBT) estimation
    this.observeMetric('longtask', (entries) => {
      let tbt = 0
      entries.forEach(entry => {
        const blockingTime = Math.max(0, entry.duration - 50)
        tbt += blockingTime
      })
      this.recordMetric('TBT', tbt, 'blocking')
    })
  }

  /**
   * Setup resource timing monitoring
   */
  private setupResourceTimingMonitoring(): void {
    this.observeMetric('resource', (entries) => {
      entries.forEach(entry => {
        const resourceEntry = entry as PerformanceResourceTiming
        const cacheHit = resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize > 0
        
        const timing: ResourceTiming = {
          name: resourceEntry.name,
          duration: resourceEntry.duration,
          transferSize: resourceEntry.transferSize,
          decodedBodySize: resourceEntry.decodedBodySize,
          startTime: resourceEntry.startTime,
          responseEnd: resourceEntry.responseEnd,
          initiatorType: resourceEntry.initiatorType,
          cacheHit
        }
        
        this.resourceTimings.push(timing)
        this.analyzeResourcePerformance(timing)
      })
    })
  }

  /**
   * Setup user experience tracking
   */
  private setupUserExperienceTracking(): void {
    // Scroll depth tracking
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = (scrollTop / documentHeight) * 100
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = Math.min(100, scrollDepth)
        this.userExperienceMetrics.scrollDepth = maxScrollDepth
      }
    }

    window.addEventListener('scroll', trackScrollDepth, { passive: true })

    // Interaction counting
    const interactionEvents = ['click', 'keydown', 'touchstart']
    interactionEvents.forEach(event => {
      document.addEventListener(event, () => {
        this.userExperienceMetrics.interactionCount++
      }, { passive: true })
    })

    // Error tracking
    window.addEventListener('error', (event) => {
      this.userExperienceMetrics.errorCount++
      console.error('Performance Monitor - JavaScript Error:', event.error)
    })

    // Time on page
    window.addEventListener('beforeunload', () => {
      this.userExperienceMetrics.timeOnPage = Date.now() - this.sessionStartTime
    })

    // Visibility change tracking
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.calculateBounceRate()
      }
    })
  }

  /**
   * Setup navigation metrics
   */
  private setupNavigationMetrics(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navEntry) {
          this.navigationMetrics = {
            ttfb: navEntry.responseStart - navEntry.requestStart,
            fcp: this.getMetricValue('FCP') || 0,
            lcp: this.getMetricValue('LCP') || 0,
            fid: this.getMetricValue('FID') || 0,
            inp: this.getMetricValue('INP') || 0,
            cls: this.getMetricValue('CLS') || 0,
            tbt: this.getMetricValue('TBT') || 0,
            si: this.calculateSpeedIndex()
          }
          
          this.calculatePerformanceScore()
        }
      }, 1000)
    })
  }

  /**
   * Advanced INP performance analysis
   */
  private analyzeINPPerformance(entry: PerformanceEventTiming, inp: number): void {
    const slowINPThreshold = 200 // Google's recommendation
    
    if (inp > slowINPThreshold) {
      const targetElement = this.getElementSelector(entry.target as Element)
      const eventType = entry.name
      
      console.warn(`🐌 Slow INP detected:`, {
        inp: `${inp.toFixed(2)}ms`,
        eventType,
        target: targetElement,
        processingTime: `${(entry.processingEnd - entry.processingStart).toFixed(2)}ms`,
        inputDelay: `${(entry.processingStart - entry.startTime).toFixed(2)}ms`,
        recommendation: inp > 500 ? 'Critical optimization needed' : 'Consider optimization'
      })

      // Report to analytics with detailed context
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'slow_inp', {
          event_category: 'Performance',
          event_label: `${eventType}_${targetElement}`,
          value: Math.round(inp),
          event_type: eventType,
          target_element: targetElement,
          processing_time: Math.round(entry.processingEnd - entry.processingStart),
          input_delay: Math.round(entry.processingStart - entry.startTime)
        })
      }
    }
  }

  /**
   * Analyze resource performance and identify bottlenecks
   */
  private analyzeResourcePerformance(timing: ResourceTiming): void {
    const slowResourceThreshold = 1000 // 1 second
    
    if (timing.duration > slowResourceThreshold) {
      console.warn(`🐌 Slow resource loading:`, {
        resource: timing.name,
        duration: `${timing.duration.toFixed(2)}ms`,
        size: `${(timing.decodedBodySize / 1024).toFixed(2)}KB`,
        cacheHit: timing.cacheHit,
        initiator: timing.initiatorType
      })
    }

    // Identify render-blocking resources
    if (timing.initiatorType === 'css' && timing.duration > 500) {
      console.warn(`🚨 Render-blocking CSS detected: ${timing.name}`)
    }

    // Identify large JavaScript bundles
    if (timing.initiatorType === 'script' && timing.decodedBodySize > 250000) { // 250KB
      console.warn(`📦 Large JavaScript bundle: ${timing.name} (${(timing.decodedBodySize / 1024).toFixed(2)}KB)`)
    }
  }

  /**
   * Calculate performance score (0-100) based on Core Web Vitals
   */
  private calculatePerformanceScore(): void {
    if (!this.navigationMetrics) return

    let score = 100
    const metrics = this.navigationMetrics

    // LCP scoring (25% weight)
    if (metrics.lcp > 4000) score -= 25
    else if (metrics.lcp > 2500) score -= 15
    else if (metrics.lcp > 1500) score -= 5

    // FID/INP scoring (25% weight)
    const inputDelay = Math.max(metrics.fid, metrics.inp)
    if (inputDelay > 300) score -= 25
    else if (inputDelay > 100) score -= 15
    else if (inputDelay > 50) score -= 5

    // CLS scoring (25% weight)
    if (metrics.cls > 0.25) score -= 25
    else if (metrics.cls > 0.1) score -= 15
    else if (metrics.cls > 0.05) score -= 5

    // FCP scoring (15% weight)
    if (metrics.fcp > 3000) score -= 15
    else if (metrics.fcp > 1800) score -= 10
    else if (metrics.fcp > 1000) score -= 3

    // TBT scoring (10% weight)
    if (metrics.tbt > 600) score -= 10
    else if (metrics.tbt > 300) score -= 6
    else if (metrics.tbt > 150) score -= 2

    this.userExperienceMetrics.performanceScore = Math.max(0, score)
  }

  /**
   * Calculate Speed Index approximation
   */
  private calculateSpeedIndex(): number {
    // Simplified Speed Index calculation
    const fcp = this.getMetricValue('FCP') || 0
    const lcp = this.getMetricValue('LCP') || 0
    
    // Approximation: Speed Index ≈ (FCP + LCP) / 2
    return (fcp + lcp) / 2
  }

  /**
   * Calculate bounce rate based on user engagement
   */
  private calculateBounceRate(): void {
    const timeOnPage = Date.now() - this.sessionStartTime
    const hasInteracted = this.userExperienceMetrics.interactionCount > 2
    const hasScrolled = this.userExperienceMetrics.scrollDepth > 25
    const stayedLongEnough = timeOnPage > 30000 // 30 seconds

    // Consider it a bounce if user didn't engage meaningfully
    const isBounce = !hasInteracted && !hasScrolled && !stayedLongEnough
    this.userExperienceMetrics.bounceRate = isBounce ? 1 : 0
  }

  /**
   * Generate performance insights and recommendations
   */
  generateInsights(): PerformanceInsights {
    const criticalIssues: string[] = []
    const optimizationOpportunities: string[] = []
    const predictedImprovements: Record<string, number> = {}

    if (!this.navigationMetrics) {
      criticalIssues.push('Navigation metrics not available')
      return {
        criticalIssues,
        optimizationOpportunities,
        predictedImprovements,
        competitorComparison: {},
        seoImpact: { rankingFactor: 0, expectedTrafficIncrease: 0, coreWebVitalsScore: 0 }
      }
    }

    const metrics = this.navigationMetrics

    // Analyze LCP
    if (metrics.lcp > 2500) {
      criticalIssues.push(`LCP is ${(metrics.lcp / 1000).toFixed(2)}s (target: <2.5s)`)
      optimizationOpportunities.push('Optimize largest contentful paint with image preloading')
      predictedImprovements['LCP'] = Math.min(40, (metrics.lcp - 2000) / 100)
    }

    // Analyze INP
    if (metrics.inp > 200) {
      criticalIssues.push(`INP is ${metrics.inp.toFixed(0)}ms (target: <200ms)`)
      optimizationOpportunities.push('Reduce JavaScript execution time and optimize event handlers')
      predictedImprovements['INP'] = Math.min(50, (metrics.inp - 100) / 10)
    }

    // Analyze CLS
    if (metrics.cls > 0.1) {
      criticalIssues.push(`CLS is ${metrics.cls.toFixed(3)} (target: <0.1)`)
      optimizationOpportunities.push('Add size attributes to images and reserve space for dynamic content')
      predictedImprovements['CLS'] = Math.min(90, metrics.cls * 1000)
    }

    // Analyze resource loading
    const slowResources = this.resourceTimings.filter(r => r.duration > 1000)
    if (slowResources.length > 0) {
      optimizationOpportunities.push(`Optimize ${slowResources.length} slow-loading resources`)
    }

    // Calculate SEO impact
    const coreWebVitalsScore = this.calculateCoreWebVitalsScore()
    const seoImpact = {
      rankingFactor: coreWebVitalsScore / 10, // 0-10 scale
      expectedTrafficIncrease: Math.max(0, (90 - this.userExperienceMetrics.performanceScore) * 0.5),
      coreWebVitalsScore
    }

    return {
      criticalIssues,
      optimizationOpportunities,
      predictedImprovements,
      competitorComparison: this.generateCompetitorComparison(),
      seoImpact
    }
  }

  /**
   * Calculate Core Web Vitals score (0-100)
   */
  private calculateCoreWebVitalsScore(): number {
    if (!this.navigationMetrics) return 0

    const metrics = this.navigationMetrics
    let score = 0

    // LCP score (40% weight)
    if (metrics.lcp <= 2500) score += 40
    else if (metrics.lcp <= 4000) score += 20

    // INP score (40% weight)
    if (metrics.inp <= 200) score += 40
    else if (metrics.inp <= 500) score += 20

    // CLS score (20% weight)
    if (metrics.cls <= 0.1) score += 20
    else if (metrics.cls <= 0.25) score += 10

    return score
  }

  /**
   * Generate competitor comparison (simulated)
   */
  private generateCompetitorComparison(): Record<string, number> {
    return {
      'Travel Blog Average': 75,
      'Top Travel Sites': 85,
      'Industry Leaders': 92,
      'Your Site': this.userExperienceMetrics.performanceScore
    }
  }

  /**
   * Schedule periodic performance analysis
   */
  private schedulePerformanceAnalysis(): void {
    // Analyze performance every 30 seconds
    setInterval(() => {
      this.analyzeCurrentPerformance()
    }, 30000)

    // Generate insights every 5 minutes
    setInterval(() => {
      const insights = this.generateInsights()
      console.log('🔍 Performance Insights:', insights)
    }, 300000)
  }

  /**
   * Analyze current performance state
   */
  private analyzeCurrentPerformance(): void {
    const currentPerformance = {
      metrics: this.getAllMetrics(),
      userExperience: this.userExperienceMetrics,
      resourceCount: this.resourceTimings.length,
      timestamp: Date.now()
    }

    console.log('📊 Current Performance State:', currentPerformance)
  }

  /**
   * Utility methods
   */
  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ type, buffered: true })
      this.observers.set(type, observer)
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error)
    }
  }

  private recordMetric(name: string, value: number, entryType: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      delta: value,
      rating: this.getMetricRating(name, value),
      timestamp: Date.now(),
      id: `${name}_${Date.now()}`,
      navigationType: this.getNavigationType(),
      url: window.location.href
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(metric)
  }

  private getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'INP': { good: 200, poor: 500 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TBT': { good: 200, poor: 600 }
    }

    const threshold = thresholds[name]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private getMetricValue(name: string): number | null {
    const metricHistory = this.metrics.get(name)
    return metricHistory && metricHistory.length > 0 
      ? metricHistory[metricHistory.length - 1].value 
      : null
  }

  private getNavigationType(): string {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return navEntry ? navEntry.type : 'unknown'
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
   * Public API methods
   */
  getAllMetrics(): Record<string, PerformanceMetric[]> {
    const result: Record<string, PerformanceMetric[]> = {}
    this.metrics.forEach((value, key) => {
      result[key] = [...value]
    })
    return result
  }

  getNavigationMetrics(): NavigationMetrics | null {
    return this.navigationMetrics
  }

  getUserExperienceMetrics(): UserExperienceMetrics {
    return { ...this.userExperienceMetrics }
  }

  getResourceTimings(): ResourceTiming[] {
    return [...this.resourceTimings]
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
    this.resourceTimings = []
    this.isMonitoring = false
  }
}

export default AdvancedPerformanceMonitor