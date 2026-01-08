/**
 * Advanced INP Monitoring System - SEO-PERFECTION-2025
 * Interaction to Next Paint monitoring with ≤200ms target
 * Real-time performance tracking and optimization suggestions
 */

interface INPEntry extends PerformanceEventTiming {
  processingStart: number
  processingEnd: number
  presentationTime: number
  interactionId?: number
}

interface INPMetrics {
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: INPEntry[]
  id: string
  navigationType: string
}

interface PerformanceAlert {
  type: 'inp-threshold' | 'inp-degradation' | 'inp-spike'
  value: number
  threshold: number
  timestamp: number
  context: {
    userAgent: string
    viewport: string
    connection: string
    page: string
    interaction: string
  }
}

class INPMonitor {
  private static instance: INPMonitor
  private currentINP: number = 0
  private entries: INPEntry[] = []
  private observer: PerformanceObserver | null = null
  private isInitialized: boolean = false
  private alertCallbacks: ((alert: PerformanceAlert) => void)[] = []
  
  // 2025 INP Thresholds (stricter than Core Web Vitals)
  private readonly THRESHOLDS = {
    good: 200,           // ≤200ms (our target)
    needsImprovement: 300, // 200-300ms
    poor: 500           // >300ms
  }

  private constructor() {}

  static getInstance(): INPMonitor {
    if (!INPMonitor.instance) {
      INPMonitor.instance = new INPMonitor()
    }
    return INPMonitor.instance
  }

  /**
   * Initialize advanced INP monitoring
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return

    try {
      // Modern INP measurement using PerformanceObserver
      if ('PerformanceObserver' in window) {
        this.setupPerformanceObserver()
      } else {
        // Fallback for older browsers
        this.setupFallbackMonitoring()
      }

      // Set up real-time monitoring
      this.setupRealTimeMonitoring()
      
      // Set up page visibility change handling
      this.setupVisibilityChangeHandler()
      
      this.isInitialized = true
      console.log('🚀 Advanced INP monitoring initialized with ≤200ms target')
      
    } catch (error) {
      console.error('Failed to initialize INP monitoring:', error)
    }
  }

  /**
   * Set up PerformanceObserver for modern browsers
   */
  private setupPerformanceObserver(): void {
    try {
      this.observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as INPEntry[]
        
        entries.forEach(entry => {
          if (entry.interactionId) {
            this.processINPEntry(entry)
          }
        })
      })

      // Observe interaction events
      this.observer.observe({ 
        type: 'event',
        buffered: true,
        durationThreshold: 16 // Only capture interactions >16ms
      })

    } catch (error) {
      console.warn('PerformanceObserver not fully supported, using fallback:', error)
      this.setupFallbackMonitoring()
    }
  }

  /**
   * Process individual INP entries
   */
  private processINPEntry(entry: INPEntry): void {
    const duration = entry.duration
    
    // Update current INP (worst interaction)
    if (duration > this.currentINP) {
      this.currentINP = duration
      this.entries.push(entry)
      
      // Check thresholds and fire alerts
      this.checkThresholds(duration, entry)
      
      // Log detailed interaction data
      this.logInteractionDetails(entry)
    }

    // Keep only recent entries (last 50)
    if (this.entries.length > 50) {
      this.entries = this.entries.slice(-50)
    }
  }

  /**
   * Check INP thresholds and trigger alerts
   */
  private checkThresholds(duration: number, entry: INPEntry): void {
    if (duration > this.THRESHOLDS.good) {
      const alert: PerformanceAlert = {
        type: duration > this.THRESHOLDS.poor ? 'inp-spike' : 'inp-threshold',
        value: duration,
        threshold: this.THRESHOLDS.good,
        timestamp: Date.now(),
        context: {
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          connection: this.getConnectionInfo(),
          page: window.location.pathname,
          interaction: this.getInteractionType(entry)
        }
      }
      
      this.fireAlert(alert)
    }
  }

  /**
   * Get interaction type from entry
   */
  private getInteractionType(entry: INPEntry): string {
    const target = entry.target as Element
    const tagName = target?.tagName?.toLowerCase() || 'unknown'
    const eventType = entry.name || 'unknown'
    
    return `${eventType} on ${tagName}${target?.className ? `.${target.className}` : ''}`
  }

  /**
   * Get network connection information
   */
  private getConnectionInfo(): string {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      return `${conn.effectiveType || 'unknown'} (${conn.downlink || '?'}Mbps)`
    }
    return 'unknown'
  }

  /**
   * Log detailed interaction information
   */
  private logInteractionDetails(entry: INPEntry): void {
    if (entry.duration > this.THRESHOLDS.good) {
      console.warn(`🐌 Slow interaction detected (${entry.duration.toFixed(1)}ms):`, {
        type: entry.name,
        target: entry.target,
        duration: entry.duration,
        processingTime: entry.processingEnd - entry.processingStart,
        inputDelay: entry.processingStart - entry.startTime,
        presentationDelay: entry.duration - (entry.processingEnd - entry.startTime),
        breakdown: {
          inputDelay: `${(entry.processingStart - entry.startTime).toFixed(1)}ms`,
          processingTime: `${(entry.processingEnd - entry.processingStart).toFixed(1)}ms`,
          presentationDelay: `${(entry.duration - (entry.processingEnd - entry.startTime)).toFixed(1)}ms`
        }
      })
    }
  }

  /**
   * Set up real-time monitoring dashboard
   */
  private setupRealTimeMonitoring(): void {
    // Create performance monitoring overlay (development only)
    if (process.env.NODE_ENV === 'development') {
      this.createPerformanceOverlay()
    }

    // Set up periodic reporting
    setInterval(() => {
      this.reportCurrentMetrics()
    }, 30000) // Report every 30 seconds
  }

  /**
   * Create visual performance overlay for development
   */
  private createPerformanceOverlay(): void {
    const overlay = document.createElement('div')
    overlay.id = 'inp-monitor-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      min-width: 200px;
      backdrop-filter: blur(5px);
    `
    
    document.body.appendChild(overlay)
    
    // Update overlay periodically
    setInterval(() => {
      this.updateOverlay(overlay)
    }, 1000)
  }

  /**
   * Update performance overlay
   */
  private updateOverlay(overlay: HTMLElement): void {
    const rating = this.getCurrentRating()
    const color = rating === 'good' ? '#22c55e' : rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'
    
    overlay.innerHTML = `
      <div style="border-bottom: 1px solid #333; margin-bottom: 5px; padding-bottom: 5px;">
        <strong>INP Monitor</strong>
      </div>
      <div>Current INP: <span style="color: ${color}; font-weight: bold;">${this.currentINP.toFixed(1)}ms</span></div>
      <div>Rating: <span style="color: ${color};">${rating}</span></div>
      <div>Target: ≤${this.THRESHOLDS.good}ms</div>
      <div>Interactions: ${this.entries.length}</div>
      <div style="margin-top: 5px; font-size: 10px; opacity: 0.7;">
        Last updated: ${new Date().toLocaleTimeString()}
      </div>
    `
  }

  /**
   * Set up page visibility change handler
   */
  private setupVisibilityChangeHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Send final metrics when page becomes hidden
        this.sendFinalMetrics()
      }
    })

    // Also send on page unload
    window.addEventListener('beforeunload', () => {
      this.sendFinalMetrics()
    })
  }

  /**
   * Fallback monitoring for older browsers
   */
  private setupFallbackMonitoring(): void {
    // Monitor click interactions
    document.addEventListener('click', (event) => {
      this.measureInteraction(event, 'click')
    }, true)

    // Monitor keyboard interactions
    document.addEventListener('keydown', (event) => {
      this.measureInteraction(event, 'keydown')
    }, true)

    // Monitor input interactions
    document.addEventListener('input', (event) => {
      this.measureInteraction(event, 'input')
    }, true)
  }

  /**
   * Measure interaction in fallback mode
   */
  private measureInteraction(event: Event, type: string): void {
    const startTime = performance.now()
    
    // Use requestAnimationFrame to measure to next paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const duration = performance.now() - startTime
        
        const fakeEntry: INPEntry = {
          name: type,
          entryType: 'event',
          startTime,
          duration,
          processingStart: startTime,
          processingEnd: startTime + duration * 0.7, // Estimate
          presentationTime: startTime + duration,
          target: event.target,
          cancelable: event.cancelable,
          toJSON: () => ({})
        } as INPEntry
        
        this.processINPEntry(fakeEntry)
      })
    })
  }

  /**
   * Get current INP rating
   */
  getCurrentRating(): 'good' | 'needs-improvement' | 'poor' {
    if (this.currentINP <= this.THRESHOLDS.good) return 'good'
    if (this.currentINP <= this.THRESHOLDS.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): INPMetrics {
    return {
      value: this.currentINP,
      rating: this.getCurrentRating(),
      delta: this.currentINP,
      entries: [...this.entries],
      id: 'INP',
      navigationType: this.getNavigationType()
    }
  }

  /**
   * Get navigation type
   */
  private getNavigationType(): string {
    if ('navigation' in performance) {
      return (performance as any).navigation.type === 0 ? 'navigate' : 'reload'
    }
    return 'unknown'
  }

  /**
   * Add alert callback
   */
  onAlert(callback: (alert: PerformanceAlert) => void): void {
    this.alertCallbacks.push(callback)
  }

  /**
   * Fire alert to all callbacks
   */
  private fireAlert(alert: PerformanceAlert): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert)
      } catch (error) {
        console.error('Error in INP alert callback:', error)
      }
    })
  }

  /**
   * Report current metrics
   */
  private reportCurrentMetrics(): void {
    const metrics = this.getCurrentMetrics()
    
    // Send to analytics (replace with your analytics service)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'inp_measurement', {
        custom_parameter: metrics.value,
        value: Math.round(metrics.value)
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 INP Metrics:', metrics)
    }
  }

  /**
   * Send final metrics when page is hidden
   */
  private sendFinalMetrics(): void {
    const metrics = this.getCurrentMetrics()
    
    // Use sendBeacon for reliable delivery
    if (navigator.sendBeacon && metrics.value > 0) {
      const data = JSON.stringify({
        metric: 'inp',
        value: metrics.value,
        rating: metrics.rating,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
      
      // Replace with your analytics endpoint
      navigator.sendBeacon('/api/analytics/inp', data)
    }
  }

  /**
   * Generate optimization suggestions
   */
  generateOptimizationSuggestions(): string[] {
    const suggestions: string[] = []
    const rating = this.getCurrentRating()
    
    if (rating !== 'good') {
      suggestions.push('Consider implementing code splitting to reduce JavaScript bundle size')
      suggestions.push('Use React.lazy() for component lazy loading')
      suggestions.push('Implement debouncing for frequent user interactions')
      suggestions.push('Consider using requestIdleCallback for non-critical tasks')
      suggestions.push('Optimize heavy computations with Web Workers')
      
      if (this.currentINP > 500) {
        suggestions.push('CRITICAL: Consider implementing virtual scrolling for large lists')
        suggestions.push('CRITICAL: Review and optimize event handlers')
        suggestions.push('CRITICAL: Consider using CSS transforms instead of layout-triggering properties')
      }
    }
    
    return suggestions
  }

  /**
   * Clean up monitoring
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    
    // Remove overlay if exists
    const overlay = document.getElementById('inp-monitor-overlay')
    if (overlay) {
      overlay.remove()
    }
    
    this.isInitialized = false
  }
}

// Export singleton instance
export const inpMonitor = INPMonitor.getInstance()

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      inpMonitor.initialize()
    })
  } else {
    // DOM is already ready
    setTimeout(() => inpMonitor.initialize(), 0)
  }
}

// Export types
export type { INPMetrics, PerformanceAlert, INPEntry }