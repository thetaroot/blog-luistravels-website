/**
 * Real-time Performance Alerts System - Phase 2.5 Implementation
 * SEO-Dominance-2025 - Advanced Performance Monitoring & Alert Management
 * Enterprise-grade alerting system for Core Web Vitals degradation
 */

import type { 
  NavigationMetrics, 
  UserExperienceMetrics, 
  PerformanceInsights 
} from '@/lib/performance/advanced-monitoring'
import GoogleAnalyticsManager from './google-analytics'

export interface AlertRule {
  id: string
  name: string
  metric: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB' | 'TBT' | 'performance_score'
  threshold: number
  comparison: 'greater_than' | 'less_than' | 'equals'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  cooldownPeriod: number // milliseconds
  consecutiveFailures: number
  actions: AlertAction[]
}

export interface AlertAction {
  type: 'console' | 'notification' | 'email' | 'webhook' | 'analytics_event'
  config: Record<string, any>
}

export interface Alert {
  id: string
  ruleId: string
  ruleName: string
  metric: string
  currentValue: number
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
  message: string
  url: string
  userAgent: string
  resolved: boolean
  resolvedAt?: number
  metadata: Record<string, any>
}

export interface AlertingConfig {
  enableRealTimeAlerting: boolean
  enableBrowserNotifications: boolean
  enableConsoleLogging: boolean
  enableAnalyticsEvents: boolean
  globalCooldownPeriod: number
  maxAlertsPerSession: number
  enableAlertDeduplication: boolean
}

/**
 * Enterprise Performance Alerting System
 */
export class PerformanceAlertingSystem {
  private static instance: PerformanceAlertingSystem
  private config: AlertingConfig
  private alertRules: Map<string, AlertRule> = new Map()
  private activeAlerts: Map<string, Alert> = new Map()
  private alertHistory: Alert[] = []
  private cooldownTimers: Map<string, number> = new Map()
  private failureCounters: Map<string, number> = new Map()
  private sessionAlertCount: number = 0
  private isInitialized: boolean = false
  private analyticsManager?: GoogleAnalyticsManager

  private constructor(config: AlertingConfig) {
    this.config = config
  }

  static getInstance(config?: AlertingConfig): PerformanceAlertingSystem {
    if (!PerformanceAlertingSystem.instance && config) {
      PerformanceAlertingSystem.instance = new PerformanceAlertingSystem(config)
    }
    return PerformanceAlertingSystem.instance
  }

  /**
   * Initialize the alerting system with default rules
   */
  initialize(analyticsManager?: GoogleAnalyticsManager): void {
    if (this.isInitialized) return

    console.log('🚨 Initializing Performance Alerting System...')

    this.analyticsManager = analyticsManager
    this.setupDefaultAlertRules()
    this.setupBrowserNotifications()
    
    this.isInitialized = true
    console.log('✅ Performance Alerting System initialized')
  }

  /**
   * Setup default alert rules for Core Web Vitals
   */
  private setupDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'lcp_critical',
        name: 'Critical LCP Performance',
        metric: 'LCP',
        threshold: 4000,
        comparison: 'greater_than',
        severity: 'critical',
        enabled: true,
        cooldownPeriod: 30000, // 30 seconds
        consecutiveFailures: 1,
        actions: [
          { type: 'console', config: { level: 'error' } },
          { type: 'notification', config: { title: 'Critical LCP Issue' } },
          { type: 'analytics_event', config: { category: 'Performance Alerts' } }
        ]
      },
      {
        id: 'inp_high',
        name: 'High INP Response Time',
        metric: 'INP',
        threshold: 500,
        comparison: 'greater_than',
        severity: 'high',
        enabled: true,
        cooldownPeriod: 60000, // 1 minute
        consecutiveFailures: 2,
        actions: [
          { type: 'console', config: { level: 'warn' } },
          { type: 'analytics_event', config: { category: 'Performance Alerts' } }
        ]
      },
      {
        id: 'cls_moderate',
        name: 'Moderate CLS Issues',
        metric: 'CLS',
        threshold: 0.25,
        comparison: 'greater_than',
        severity: 'medium',
        enabled: true,
        cooldownPeriod: 45000, // 45 seconds
        consecutiveFailures: 2,
        actions: [
          { type: 'console', config: { level: 'warn' } },
          { type: 'analytics_event', config: { category: 'Performance Alerts' } }
        ]
      },
      {
        id: 'performance_score_low',
        name: 'Low Performance Score',
        metric: 'performance_score',
        threshold: 60,
        comparison: 'less_than',
        severity: 'medium',
        enabled: true,
        cooldownPeriod: 120000, // 2 minutes
        consecutiveFailures: 3,
        actions: [
          { type: 'console', config: { level: 'info' } },
          { type: 'analytics_event', config: { category: 'Performance Alerts' } }
        ]
      },
      {
        id: 'ttfb_slow',
        name: 'Slow Time to First Byte',
        metric: 'TTFB',
        threshold: 1800,
        comparison: 'greater_than',
        severity: 'medium',
        enabled: true,
        cooldownPeriod: 90000, // 1.5 minutes
        consecutiveFailures: 2,
        actions: [
          { type: 'console', config: { level: 'warn' } },
          { type: 'analytics_event', config: { category: 'Performance Alerts' } }
        ]
      }
    ]

    defaultRules.forEach(rule => {
      this.alertRules.set(rule.id, rule)
    })

    console.log(`📋 Loaded ${defaultRules.length} default alert rules`)
  }

  /**
   * Setup browser notifications if enabled
   */
  private setupBrowserNotifications(): void {
    if (!this.config.enableBrowserNotifications || typeof window === 'undefined') return

    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('🔔 Browser notifications enabled for performance alerts')
          }
        })
      }
    }
  }

  /**
   * Evaluate performance metrics against alert rules
   */
  evaluateMetrics(
    navigationMetrics: NavigationMetrics,
    userExperienceMetrics: UserExperienceMetrics,
    insights: PerformanceInsights
  ): void {
    if (!this.isInitialized || !this.config.enableRealTimeAlerting) return

    // Check if we've hit the session alert limit
    if (this.sessionAlertCount >= this.config.maxAlertsPerSession) {
      return
    }

    const metricsToCheck = {
      'LCP': navigationMetrics.lcp,
      'INP': navigationMetrics.inp,
      'CLS': navigationMetrics.cls,
      'FCP': navigationMetrics.fcp,
      'TTFB': navigationMetrics.ttfb,
      'TBT': navigationMetrics.tbt,
      'performance_score': userExperienceMetrics.performanceScore
    }

    // Evaluate each alert rule
    this.alertRules.forEach((rule, ruleId) => {
      if (!rule.enabled) return

      const metricValue = metricsToCheck[rule.metric]
      if (metricValue === undefined) return

      const shouldAlert = this.shouldTriggerAlert(rule, metricValue)
      
      if (shouldAlert) {
        this.triggerAlert(rule, metricValue, insights)
      } else {
        // Reset failure counter if metric is now passing
        this.failureCounters.delete(ruleId)
        
        // Resolve any active alert for this rule
        this.resolveAlert(ruleId)
      }
    })
  }

  /**
   * Determine if an alert should be triggered
   */
  private shouldTriggerAlert(rule: AlertRule, currentValue: number): boolean {
    // Check cooldown period
    const lastAlertTime = this.cooldownTimers.get(rule.id) || 0
    if (Date.now() - lastAlertTime < rule.cooldownPeriod) {
      return false
    }

    // Check if threshold is exceeded
    let thresholdExceeded = false
    switch (rule.comparison) {
      case 'greater_than':
        thresholdExceeded = currentValue > rule.threshold
        break
      case 'less_than':
        thresholdExceeded = currentValue < rule.threshold
        break
      case 'equals':
        thresholdExceeded = currentValue === rule.threshold
        break
    }

    if (!thresholdExceeded) {
      return false
    }

    // Check consecutive failures requirement
    const failureCount = (this.failureCounters.get(rule.id) || 0) + 1
    this.failureCounters.set(rule.id, failureCount)

    return failureCount >= rule.consecutiveFailures
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(
    rule: AlertRule, 
    currentValue: number, 
    insights: PerformanceInsights
  ): void {
    // Check for alert deduplication
    if (this.config.enableAlertDeduplication) {
      const existingAlert = this.activeAlerts.get(rule.id)
      if (existingAlert && !existingAlert.resolved) {
        return // Alert already active
      }
    }

    const alert: Alert = {
      id: `${rule.id}_${Date.now()}`,
      ruleId: rule.id,
      ruleName: rule.name,
      metric: rule.metric,
      currentValue,
      threshold: rule.threshold,
      severity: rule.severity,
      timestamp: Date.now(),
      message: this.generateAlertMessage(rule, currentValue),
      url: window.location.href,
      userAgent: navigator.userAgent,
      resolved: false,
      metadata: {
        insights: insights,
        rule: rule,
        sessionAlertCount: this.sessionAlertCount + 1
      }
    }

    // Add to active alerts
    this.activeAlerts.set(rule.id, alert)
    this.alertHistory.push(alert)
    this.sessionAlertCount++

    // Set cooldown timer
    this.cooldownTimers.set(rule.id, Date.now())

    // Execute alert actions
    this.executeAlertActions(rule, alert)

    console.log(`🚨 Performance Alert Triggered: ${alert.message}`)
  }

  /**
   * Execute alert actions
   */
  private executeAlertActions(rule: AlertRule, alert: Alert): void {
    rule.actions.forEach(action => {
      try {
        switch (action.type) {
          case 'console':
            this.executeConsoleAction(action, alert)
            break
          case 'notification':
            this.executeNotificationAction(action, alert)
            break
          case 'analytics_event':
            this.executeAnalyticsAction(action, alert)
            break
          case 'webhook':
            this.executeWebhookAction(action, alert)
            break
          default:
            console.warn(`Unknown alert action type: ${action.type}`)
        }
      } catch (error) {
        console.error(`Failed to execute alert action ${action.type}:`, error)
      }
    })
  }

  /**
   * Execute console logging action
   */
  private executeConsoleAction(action: AlertAction, alert: Alert): void {
    const level = action.config.level || 'log'
    const message = `🚨 PERFORMANCE ALERT: ${alert.message} (${alert.currentValue} vs ${alert.threshold})`
    
    switch (level) {
      case 'error':
        console.error(message, alert)
        break
      case 'warn':
        console.warn(message, alert)
        break
      case 'info':
        console.info(message, alert)
        break
      default:
        console.log(message, alert)
    }
  }

  /**
   * Execute browser notification action
   */
  private executeNotificationAction(action: AlertAction, alert: Alert): void {
    if (!this.config.enableBrowserNotifications || typeof window === 'undefined') return
    
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = action.config.title || 'Performance Alert'
      const body = alert.message
      const icon = action.config.icon || '/images/logo.png'
      
      new Notification(title, {
        body,
        icon,
        tag: alert.ruleId, // Prevent duplicate notifications
        requireInteraction: alert.severity === 'critical'
      })
    }
  }

  /**
   * Execute Google Analytics event action
   */
  private executeAnalyticsAction(action: AlertAction, alert: Alert): void {
    if (!this.config.enableAnalyticsEvents || !this.analyticsManager) return

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_alert', {
        event_category: action.config.category || 'Performance Alerts',
        event_label: `${alert.metric}_${alert.severity}`,
        value: Math.round(alert.currentValue),
        alert_rule: alert.ruleName,
        alert_metric: alert.metric,
        alert_severity: alert.severity,
        current_value: alert.currentValue,
        threshold_value: alert.threshold,
        page_url: alert.url,
        custom_parameter_1: alert.severity,
        custom_parameter_2: alert.metric,
        custom_parameter_3: Math.round(alert.currentValue)
      })
    }
  }

  /**
   * Execute webhook action
   */
  private executeWebhookAction(action: AlertAction, alert: Alert): void {
    const webhookUrl = action.config.url
    if (!webhookUrl) return

    const payload = {
      alert,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(error => {
      console.error('Failed to send webhook alert:', error)
    })
  }

  /**
   * Resolve an active alert
   */
  private resolveAlert(ruleId: string): void {
    const activeAlert = this.activeAlerts.get(ruleId)
    if (activeAlert && !activeAlert.resolved) {
      activeAlert.resolved = true
      activeAlert.resolvedAt = Date.now()
      
      console.log(`✅ Performance Alert Resolved: ${activeAlert.message}`)
      
      // Send resolution event to analytics
      if (this.config.enableAnalyticsEvents && typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'performance_alert_resolved', {
          event_category: 'Performance Alerts',
          event_label: `${activeAlert.metric}_resolved`,
          alert_rule: activeAlert.ruleName,
          alert_duration: activeAlert.resolvedAt - activeAlert.timestamp
        })
      }
    }
  }

  /**
   * Generate alert message
   */
  private generateAlertMessage(rule: AlertRule, currentValue: number): string {
    const formattedValue = rule.metric === 'CLS' 
      ? currentValue.toFixed(3)
      : `${Math.round(currentValue)}${rule.metric.includes('score') ? '' : 'ms'}`
    
    const formattedThreshold = rule.metric === 'CLS'
      ? rule.threshold.toFixed(3)
      : `${rule.threshold}${rule.metric.includes('score') ? '' : 'ms'}`

    const comparison = rule.comparison === 'greater_than' ? 'exceeded' : 
                      rule.comparison === 'less_than' ? 'below' : 'equals'
    
    return `${rule.metric} ${comparison} threshold: ${formattedValue} (limit: ${formattedThreshold})`
  }

  /**
   * Add custom alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule)
    console.log(`📝 Added custom alert rule: ${rule.name}`)
  }

  /**
   * Remove alert rule
   */
  removeAlertRule(ruleId: string): void {
    this.alertRules.delete(ruleId)
    this.activeAlerts.delete(ruleId)
    this.cooldownTimers.delete(ruleId)
    this.failureCounters.delete(ruleId)
    console.log(`🗑️ Removed alert rule: ${ruleId}`)
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values()).filter(alert => !alert.resolved)
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit: number = 50): Alert[] {
    return this.alertHistory.slice(-limit)
  }

  /**
   * Get alert statistics
   */
  getAlertStatistics(): {
    totalAlerts: number
    activeAlerts: number
    alertsByseverity: Record<string, number>
    alertsByMetric: Record<string, number>
    sessionAlertCount: number
  } {
    const alertsByseverity: Record<string, number> = {}
    const alertsByMetric: Record<string, number> = {}

    this.alertHistory.forEach(alert => {
      alertsByseverity[alert.severity] = (alertsByseverity[alert.severity] || 0) + 1
      alertsByMetric[alert.metric] = (alertsByMetric[alert.metric] || 0) + 1
    })

    return {
      totalAlerts: this.alertHistory.length,
      activeAlerts: this.getActiveAlerts().length,
      alertsByseverity,
      alertsByMetric,
      sessionAlertCount: this.sessionAlertCount
    }
  }

  /**
   * Clear all alerts and reset counters
   */
  clearAllAlerts(): void {
    this.activeAlerts.clear()
    this.alertHistory = []
    this.cooldownTimers.clear()
    this.failureCounters.clear()
    this.sessionAlertCount = 0
    console.log('🧹 All performance alerts cleared')
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.clearAllAlerts()
  }
}

export default PerformanceAlertingSystem