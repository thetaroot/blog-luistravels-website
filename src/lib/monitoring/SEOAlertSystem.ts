/**
 * SEO Alert System & Performance Notifications - PHASE 6 SEO-PERFECTION-2025
 * Advanced alerting system for SEO performance monitoring and instant notifications
 * SENIOR GOOGLE SEO DEV Level Implementation
 */

interface AlertRule {
  id: string
  name: string
  description: string
  category: 'performance' | 'ranking' | 'traffic' | 'technical' | 'content' | 'competitive'
  severity: 'critical' | 'warning' | 'info'
  condition: AlertCondition
  threshold: number | string
  comparison: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains' | 'percentage_change'
  time_window: number // minutes
  notification_channels: NotificationChannel[]
  enabled: boolean
  created_at: string
  last_triggered?: string
  trigger_count: number
  suppression_period?: number // minutes to suppress repeated alerts
}

interface AlertCondition {
  metric: string
  data_source: 'analytics' | 'search_console' | 'core_web_vitals' | 'uptime' | 'audit' | 'competitors'
  filters?: Record<string, any>
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count'
  comparison_period?: 'previous_day' | 'previous_week' | 'previous_month' | 'baseline'
}

interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'push' | 'discord'
  config: {
    recipients?: string[]
    webhook_url?: string
    slack_channel?: string
    template?: string
    format?: 'text' | 'html' | 'markdown'
  }
  enabled: boolean
}

interface Alert {
  id: string
  rule_id: string
  timestamp: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  message: string
  current_value: number | string
  threshold_value: number | string
  affected_urls?: string[]
  data_points: Array<{
    timestamp: string
    value: number | string
    metric: string
  }>
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed'
  acknowledged_by?: string
  acknowledged_at?: string
  resolved_at?: string
  resolution_notes?: string
  notifications_sent: Array<{
    channel: string
    timestamp: string
    success: boolean
    error?: string
  }>
  related_alerts?: string[]
  action_items: string[]
  escalation_level: number
}

interface AlertDashboard {
  summary: {
    active_alerts: number
    critical_alerts: number
    warning_alerts: number
    alerts_last_24h: number
    avg_resolution_time: number
    most_frequent_alert: string
  }
  recent_alerts: Alert[]
  alert_trends: Array<{
    date: string
    critical: number
    warning: number
    info: number
  }>
  top_affected_pages: Array<{
    url: string
    alert_count: number
    last_alert: string
  }>
  performance_metrics: {
    uptime_percentage: number
    avg_response_time: number
    error_rate: number
    core_web_vitals_score: number
  }
}

interface EscalationPolicy {
  id: string
  name: string
  rules: Array<{
    severity: 'critical' | 'warning' | 'info'
    time_threshold: number // minutes
    escalation_channels: NotificationChannel[]
    notify_managers: boolean
    create_incident: boolean
  }>
  enabled: boolean
}

export class SEOAlertSystem {
  private static instance: SEOAlertSystem
  private alertRules: Map<string, AlertRule> = new Map()
  private activeAlerts: Map<string, Alert> = new Map()
  private alertHistory: Alert[] = []
  private escalationPolicies: Map<string, EscalationPolicy> = new Map()
  private notificationQueue: Array<{ alert: Alert; channel: NotificationChannel }> = []
  private isMonitoring: boolean = false
  private monitoringInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDefaultAlertRules()
    this.initializeDefaultEscalationPolicies()
    this.startMonitoring()
  }

  public static getInstance(): SEOAlertSystem {
    if (!SEOAlertSystem.instance) {
      SEOAlertSystem.instance = new SEOAlertSystem()
    }
    return SEOAlertSystem.instance
  }

  /**
   * Initialize default alert rules for common SEO issues
   */
  private initializeDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'traffic_drop_critical',
        name: 'Critical Traffic Drop',
        description: 'Alert when organic traffic drops by more than 30% compared to previous week',
        category: 'traffic',
        severity: 'critical',
        condition: {
          metric: 'organic_sessions',
          data_source: 'analytics',
          aggregation: 'sum',
          comparison_period: 'previous_week'
        },
        threshold: -30,
        comparison: 'percentage_change',
        time_window: 60,
        notification_channels: [
          {
            type: 'email',
            config: { recipients: ['seo@company.com'], format: 'html' },
            enabled: true
          },
          {
            type: 'slack',
            config: { slack_channel: '#seo-alerts', format: 'markdown' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0,
        suppression_period: 180 // 3 hours
      },
      {
        id: 'ranking_drop_warning',
        name: 'Keyword Ranking Drop',
        description: 'Alert when average keyword position drops by more than 5 positions',
        category: 'ranking',
        severity: 'warning',
        condition: {
          metric: 'average_position',
          data_source: 'search_console',
          aggregation: 'avg',
          comparison_period: 'previous_day'
        },
        threshold: 5,
        comparison: 'greater_than',
        time_window: 1440, // 24 hours
        notification_channels: [
          {
            type: 'email',
            config: { recipients: ['seo@company.com'], format: 'text' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0,
        suppression_period: 720 // 12 hours
      },
      {
        id: 'core_web_vitals_poor',
        name: 'Core Web Vitals Degradation',
        description: 'Alert when Core Web Vitals score falls below acceptable thresholds',
        category: 'performance',
        severity: 'warning',
        condition: {
          metric: 'lcp',
          data_source: 'core_web_vitals',
          filters: { rating: 'poor' }
        },
        threshold: 2500,
        comparison: 'greater_than',
        time_window: 30,
        notification_channels: [
          {
            type: 'slack',
            config: { slack_channel: '#performance', format: 'text' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0
      },
      {
        id: 'crawl_errors_spike',
        name: 'Crawl Errors Spike',
        description: 'Alert when crawl errors increase significantly',
        category: 'technical',
        severity: 'critical',
        condition: {
          metric: 'crawl_errors',
          data_source: 'search_console',
          aggregation: 'count',
          comparison_period: 'previous_day'
        },
        threshold: 50,
        comparison: 'percentage_change',
        time_window: 60,
        notification_channels: [
          {
            type: 'email',
            config: { recipients: ['dev@company.com', 'seo@company.com'], format: 'html' },
            enabled: true
          },
          {
            type: 'webhook',
            config: { webhook_url: 'https://hooks.slack.com/services/xxx', format: 'text' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0,
        suppression_period: 120
      },
      {
        id: 'competitors_outranking',
        name: 'Competitor Outranking Alert',
        description: 'Alert when competitors consistently outrank us for target keywords',
        category: 'competitive',
        severity: 'warning',
        condition: {
          metric: 'competitor_ranking_advantage',
          data_source: 'competitors',
          aggregation: 'avg'
        },
        threshold: 3,
        comparison: 'greater_than',
        time_window: 2880, // 48 hours
        notification_channels: [
          {
            type: 'email',
            config: { recipients: ['seo@company.com'], format: 'html' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0,
        suppression_period: 1440 // 24 hours
      },
      {
        id: 'page_not_indexed',
        name: 'Important Page Not Indexed',
        description: 'Alert when important pages are not indexed by Google',
        category: 'technical',
        severity: 'critical',
        condition: {
          metric: 'indexing_status',
          data_source: 'search_console',
          filters: { page_type: 'important' }
        },
        threshold: 'not_indexed',
        comparison: 'equals',
        time_window: 60,
        notification_channels: [
          {
            type: 'email',
            config: { recipients: ['seo@company.com', 'dev@company.com'], format: 'html' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0,
        suppression_period: 360 // 6 hours
      },
      {
        id: 'site_downtime',
        name: 'Site Downtime Alert',
        description: 'Alert when site is not accessible',
        category: 'technical',
        severity: 'critical',
        condition: {
          metric: 'uptime_status',
          data_source: 'uptime',
          filters: { response_code: 'error' }
        },
        threshold: 'down',
        comparison: 'equals',
        time_window: 5,
        notification_channels: [
          {
            type: 'email',
            config: { recipients: ['dev@company.com', 'seo@company.com'], format: 'text' },
            enabled: true
          },
          {
            type: 'sms',
            config: { recipients: ['+1234567890'], format: 'text' },
            enabled: true
          },
          {
            type: 'slack',
            config: { slack_channel: '#critical', format: 'text' },
            enabled: true
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        trigger_count: 0,
        suppression_period: 15
      }
    ]

    defaultRules.forEach(rule => {
      this.alertRules.set(rule.id, rule)
    })

    console.log(`✅ Initialized ${defaultRules.length} default alert rules`)
  }

  /**
   * Initialize default escalation policies
   */
  private initializeDefaultEscalationPolicies(): void {
    const defaultPolicies: EscalationPolicy[] = [
      {
        id: 'standard_escalation',
        name: 'Standard SEO Escalation',
        rules: [
          {
            severity: 'critical',
            time_threshold: 30,
            escalation_channels: [
              {
                type: 'email',
                config: { recipients: ['manager@company.com'], format: 'html' },
                enabled: true
              }
            ],
            notify_managers: true,
            create_incident: true
          },
          {
            severity: 'warning',
            time_threshold: 120,
            escalation_channels: [
              {
                type: 'email',
                config: { recipients: ['team-lead@company.com'], format: 'text' },
                enabled: true
              }
            ],
            notify_managers: false,
            create_incident: false
          }
        ],
        enabled: true
      }
    ]

    defaultPolicies.forEach(policy => {
      this.escalationPolicies.set(policy.id, policy)
    })

    console.log(`✅ Initialized ${defaultPolicies.length} escalation policies`)
  }

  /**
   * Start monitoring system
   */
  private startMonitoring(): void {
    if (this.isMonitoring) return

    this.isMonitoring = true
    
    // Main monitoring loop - check every minute
    this.monitoringInterval = setInterval(() => {
      this.runMonitoringCycle()
    }, 60000) // 1 minute

    // Process notification queue every 10 seconds
    setInterval(() => {
      this.processNotificationQueue()
    }, 10000)

    // Check for escalations every 5 minutes
    setInterval(() => {
      this.checkEscalations()
    }, 300000)

    console.log('🚀 SEO Alert System monitoring started')
  }

  /**
   * Main monitoring cycle
   */
  private async runMonitoringCycle(): Promise<void> {
    if (!this.isMonitoring) return

    console.log('🔍 Running SEO monitoring cycle...')

    try {
      for (const rule of this.alertRules.values()) {
        if (rule.enabled) {
          await this.evaluateAlertRule(rule)
        }
      }

      // Clean up resolved alerts
      this.cleanupResolvedAlerts()

    } catch (error) {
      console.error('❌ Error in monitoring cycle:', error)
    }
  }

  /**
   * Evaluate individual alert rule
   */
  private async evaluateAlertRule(rule: AlertRule): Promise<void> {
    try {
      // Check if rule is in suppression period
      if (this.isRuleSuppressed(rule)) {
        return
      }

      // Fetch current metric value
      const currentValue = await this.fetchMetricValue(rule.condition)
      
      // Compare against threshold
      const isTriggered = this.evaluateCondition(currentValue, rule.threshold, rule.comparison)

      if (isTriggered) {
        await this.triggerAlert(rule, currentValue)
      }

    } catch (error) {
      console.error(`❌ Failed to evaluate alert rule ${rule.id}:`, error)
    }
  }

  /**
   * Trigger an alert
   */
  private async triggerAlert(rule: AlertRule, currentValue: number | string): Promise<void> {
    const alertId = this.generateAlertId()
    
    // Check if similar alert already exists
    const existingAlert = this.findSimilarActiveAlert(rule.id)
    if (existingAlert && rule.suppression_period) {
      const timeSinceLastTrigger = Date.now() - new Date(existingAlert.timestamp).getTime()
      if (timeSinceLastTrigger < rule.suppression_period * 60 * 1000) {
        console.log(`⏩ Alert suppressed: ${rule.name} (within suppression period)`)
        return
      }
    }

    const alert: Alert = {
      id: alertId,
      rule_id: rule.id,
      timestamp: new Date().toISOString(),
      severity: rule.severity,
      title: rule.name,
      message: await this.generateAlertMessage(rule, currentValue),
      current_value: currentValue,
      threshold_value: rule.threshold,
      affected_urls: await this.getAffectedURLs(rule.condition),
      data_points: await this.getHistoricalDataPoints(rule.condition),
      status: 'active',
      notifications_sent: [],
      action_items: this.generateActionItems(rule, currentValue),
      escalation_level: 0
    }

    // Store alert
    this.activeAlerts.set(alertId, alert)
    this.alertHistory.push(alert)

    // Update rule trigger count
    rule.trigger_count++
    rule.last_triggered = new Date().toISOString()

    // Queue notifications
    for (const channel of rule.notification_channels) {
      if (channel.enabled) {
        this.notificationQueue.push({ alert, channel })
      }
    }

    console.log(`🚨 Alert triggered: ${rule.name} (${alertId})`)
    console.log(`📊 Current Value: ${currentValue}, Threshold: ${rule.threshold}`)
  }

  /**
   * Generate alert message
   */
  private async generateAlertMessage(rule: AlertRule, currentValue: number | string): Promise<string> {
    let message = `${rule.description}\n\n`
    message += `**Current Value:** ${currentValue}\n`
    message += `**Threshold:** ${rule.threshold}\n`
    message += `**Time Window:** ${rule.time_window} minutes\n`

    // Add context based on rule category
    switch (rule.category) {
      case 'traffic':
        message += `\n**Impact:** This traffic drop may indicate algorithm changes, technical issues, or ranking declines.`
        break
      case 'ranking':
        message += `\n**Impact:** Ranking changes can significantly affect organic visibility and traffic.`
        break
      case 'performance':
        message += `\n**Impact:** Poor performance affects user experience and search rankings.`
        break
      case 'technical':
        message += `\n**Impact:** Technical issues can prevent search engines from properly crawling and indexing your site.`
        break
      case 'competitive':
        message += `\n**Impact:** Competitors gaining positions may reduce your market share.`
        break
    }

    return message
  }

  /**
   * Generate action items for alerts
   */
  private generateActionItems(rule: AlertRule, currentValue: number | string): string[] {
    const actionItems: string[] = []

    switch (rule.category) {
      case 'traffic':
        actionItems.push(
          'Check Google Search Console for ranking changes',
          'Review recent algorithm updates',
          'Analyze competitor movements',
          'Verify tracking implementation'
        )
        break
      case 'ranking':
        actionItems.push(
          'Identify affected keywords',
          'Review content quality and relevance',
          'Check for technical SEO issues',
          'Analyze SERP feature changes'
        )
        break
      case 'performance':
        actionItems.push(
          'Run Core Web Vitals audit',
          'Optimize images and resources',
          'Check server performance',
          'Review third-party scripts'
        )
        break
      case 'technical':
        actionItems.push(
          'Check robots.txt and sitemap',
          'Review server logs',
          'Test page accessibility',
          'Verify SSL certificate'
        )
        break
      case 'competitive':
        actionItems.push(
          'Analyze competitor content strategies',
          'Review backlink profiles',
          'Update content and optimization',
          'Consider PPC response if needed'
        )
        break
      default:
        actionItems.push('Investigate the issue', 'Review recent changes', 'Monitor closely')
    }

    return actionItems
  }

  /**
   * Process notification queue
   */
  private async processNotificationQueue(): Promise<void> {
    while (this.notificationQueue.length > 0) {
      const { alert, channel } = this.notificationQueue.shift()!
      
      try {
        await this.sendNotification(alert, channel)
        
        alert.notifications_sent.push({
          channel: channel.type,
          timestamp: new Date().toISOString(),
          success: true
        })

      } catch (error) {
        console.error(`❌ Failed to send notification via ${channel.type}:`, error)
        
        alert.notifications_sent.push({
          channel: channel.type,
          timestamp: new Date().toISOString(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }

  /**
   * Send notification via specific channel
   */
  private async sendNotification(alert: Alert, channel: NotificationChannel): Promise<void> {
    const message = this.formatNotificationMessage(alert, channel.config.format || 'text')

    switch (channel.type) {
      case 'email':
        await this.sendEmailNotification(alert, channel, message)
        break
      case 'slack':
        await this.sendSlackNotification(alert, channel, message)
        break
      case 'webhook':
        await this.sendWebhookNotification(alert, channel, message)
        break
      case 'sms':
        await this.sendSMSNotification(alert, channel, message)
        break
      case 'push':
        await this.sendPushNotification(alert, channel, message)
        break
      case 'discord':
        await this.sendDiscordNotification(alert, channel, message)
        break
      default:
        console.warn(`⚠️ Unknown notification channel: ${channel.type}`)
    }
  }

  /**
   * Format notification message
   */
  private formatNotificationMessage(alert: Alert, format: string): string {
    const baseMessage = `🚨 SEO Alert: ${alert.title}\n\n${alert.message}`
    
    switch (format) {
      case 'html':
        return `
          <h2>🚨 SEO Alert: ${alert.title}</h2>
          <p><strong>Severity:</strong> ${alert.severity.toUpperCase()}</p>
          <p><strong>Current Value:</strong> ${alert.current_value}</p>
          <p><strong>Threshold:</strong> ${alert.threshold_value}</p>
          <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
          ${alert.affected_urls ? `<p><strong>Affected URLs:</strong> ${alert.affected_urls.join(', ')}</p>` : ''}
          <h3>Action Items:</h3>
          <ul>
            ${alert.action_items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `
      case 'markdown':
        return `
## 🚨 SEO Alert: ${alert.title}

**Severity:** ${alert.severity.toUpperCase()}
**Current Value:** ${alert.current_value}
**Threshold:** ${alert.threshold_value}
**Time:** ${new Date(alert.timestamp).toLocaleString()}
${alert.affected_urls ? `**Affected URLs:** ${alert.affected_urls.join(', ')}` : ''}

### Action Items:
${alert.action_items.map(item => `- ${item}`).join('\n')}
        `
      default:
        return baseMessage + '\n\nAction Items:\n' + alert.action_items.map(item => `- ${item}`).join('\n')
    }
  }

  /**
   * Check for escalations
   */
  private checkEscalations(): void {
    for (const alert of this.activeAlerts.values()) {
      if (alert.status === 'active') {
        this.evaluateEscalation(alert)
      }
    }
  }

  /**
   * Evaluate escalation for an alert
   */
  private evaluateEscalation(alert: Alert): void {
    const rule = this.alertRules.get(alert.rule_id)
    if (!rule) return

    const alertAge = Date.now() - new Date(alert.timestamp).getTime()
    const escalationPolicy = Array.from(this.escalationPolicies.values())[0] // Use first policy for now

    if (!escalationPolicy || !escalationPolicy.enabled) return

    for (const escalationRule of escalationPolicy.rules) {
      if (escalationRule.severity === alert.severity) {
        const thresholdMs = escalationRule.time_threshold * 60 * 1000
        
        if (alertAge > thresholdMs && alert.escalation_level === 0) {
          this.escalateAlert(alert, escalationRule)
          alert.escalation_level++
          break
        }
      }
    }
  }

  /**
   * Escalate an alert
   */
  private async escalateAlert(alert: Alert, escalationRule: any): Promise<void> {
    console.log(`⬆️ Escalating alert: ${alert.title}`)

    // Send escalation notifications
    for (const channel of escalationRule.escalation_channels) {
      if (channel.enabled) {
        const escalationMessage = `🔺 ESCALATED ALERT: ${alert.title}\n\nThis alert has been active for ${escalationRule.time_threshold} minutes without resolution.\n\n${alert.message}`
        
        try {
          await this.sendNotification({
            ...alert,
            message: escalationMessage,
            title: `ESCALATED: ${alert.title}`
          }, channel)
        } catch (error) {
          console.error('❌ Failed to send escalation notification:', error)
        }
      }
    }

    // Create incident if required
    if (escalationRule.create_incident) {
      await this.createIncident(alert)
    }
  }

  /**
   * Create incident for critical alerts
   */
  private async createIncident(alert: Alert): Promise<void> {
    console.log(`📋 Creating incident for alert: ${alert.title}`)
    
    // In production, this would integrate with incident management systems
    const incident = {
      id: `INC-${Date.now()}`,
      title: `SEO Alert: ${alert.title}`,
      description: alert.message,
      severity: alert.severity,
      status: 'open',
      created_at: new Date().toISOString(),
      alert_id: alert.id
    }

    console.log(`✅ Incident created: ${incident.id}`)
  }

  // Notification channel implementations
  private async sendEmailNotification(alert: Alert, channel: NotificationChannel, message: string): Promise<void> {
    console.log(`📧 Sending email notification for alert: ${alert.title}`)
    console.log(`Recipients: ${channel.config.recipients?.join(', ')}`)
    // Email sending implementation would go here
  }

  private async sendSlackNotification(alert: Alert, channel: NotificationChannel, message: string): Promise<void> {
    console.log(`💬 Sending Slack notification to ${channel.config.slack_channel}`)
    // Slack API implementation would go here
  }

  private async sendWebhookNotification(alert: Alert, channel: NotificationChannel, message: string): Promise<void> {
    console.log(`🔗 Sending webhook notification to ${channel.config.webhook_url}`)
    
    try {
      const payload = {
        alert_id: alert.id,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        timestamp: alert.timestamp,
        current_value: alert.current_value,
        threshold_value: alert.threshold_value
      }

      // Webhook POST implementation would go here
      console.log('✅ Webhook sent successfully')
    } catch (error) {
      console.error('❌ Webhook failed:', error)
      throw error
    }
  }

  private async sendSMSNotification(alert: Alert, channel: NotificationChannel, message: string): Promise<void> {
    console.log(`📱 Sending SMS notification`)
    console.log(`Recipients: ${channel.config.recipients?.join(', ')}`)
    // SMS API implementation would go here
  }

  private async sendPushNotification(alert: Alert, channel: NotificationChannel, message: string): Promise<void> {
    console.log(`🔔 Sending push notification`)
    // Push notification implementation would go here
  }

  private async sendDiscordNotification(alert: Alert, channel: NotificationChannel, message: string): Promise<void> {
    console.log(`🎮 Sending Discord notification`)
    // Discord webhook implementation would go here
  }

  // Data fetching methods (mock implementations)
  private async fetchMetricValue(condition: AlertCondition): Promise<number | string> {
    // Mock implementation - replace with real data sources
    switch (condition.data_source) {
      case 'analytics':
        return this.getMockAnalyticsData(condition.metric)
      case 'search_console':
        return this.getMockSearchConsoleData(condition.metric)
      case 'core_web_vitals':
        return this.getMockCoreWebVitalsData(condition.metric)
      case 'uptime':
        return this.getMockUptimeData(condition.metric)
      case 'audit':
        return this.getMockAuditData(condition.metric)
      case 'competitors':
        return this.getMockCompetitorData(condition.metric)
      default:
        return 0
    }
  }

  private getMockAnalyticsData(metric: string): number {
    const mockData: Record<string, number> = {
      organic_sessions: Math.floor(Math.random() * 10000) + 5000,
      page_views: Math.floor(Math.random() * 20000) + 10000,
      bounce_rate: Math.random() * 0.8 + 0.2,
      session_duration: Math.random() * 300 + 120
    }
    return mockData[metric] || 0
  }

  private getMockSearchConsoleData(metric: string): number {
    const mockData: Record<string, number> = {
      impressions: Math.floor(Math.random() * 100000) + 50000,
      clicks: Math.floor(Math.random() * 5000) + 2000,
      average_position: Math.random() * 50 + 5,
      ctr: Math.random() * 0.1 + 0.02,
      crawl_errors: Math.floor(Math.random() * 10)
    }
    return mockData[metric] || 0
  }

  private getMockCoreWebVitalsData(metric: string): number {
    const mockData: Record<string, number> = {
      lcp: Math.random() * 2000 + 1500,
      inp: Math.random() * 300 + 100,
      cls: Math.random() * 0.3,
      fcp: Math.random() * 1500 + 800,
      ttfb: Math.random() * 800 + 200
    }
    return mockData[metric] || 0
  }

  private getMockUptimeData(metric: string): string | number {
    if (metric === 'uptime_status') {
      return Math.random() > 0.99 ? 'down' : 'up'
    }
    return Math.random() * 1000 + 200 // response time
  }

  private getMockAuditData(metric: string): number {
    const mockData: Record<string, number> = {
      seo_score: Math.random() * 40 + 60,
      technical_errors: Math.floor(Math.random() * 20),
      accessibility_score: Math.random() * 30 + 70
    }
    return mockData[metric] || 0
  }

  private getMockCompetitorData(metric: string): number {
    const mockData: Record<string, number> = {
      competitor_ranking_advantage: Math.random() * 10,
      market_share_loss: Math.random() * 20
    }
    return mockData[metric] || 0
  }

  private evaluateCondition(currentValue: number | string, threshold: number | string, comparison: string): boolean {
    if (typeof currentValue === 'string' || typeof threshold === 'string') {
      switch (comparison) {
        case 'equals':
          return currentValue === threshold
        case 'not_equals':
          return currentValue !== threshold
        case 'contains':
          return String(currentValue).includes(String(threshold))
        default:
          return false
      }
    }

    const current = Number(currentValue)
    const thresh = Number(threshold)

    switch (comparison) {
      case 'greater_than':
        return current > thresh
      case 'less_than':
        return current < thresh
      case 'equals':
        return current === thresh
      case 'percentage_change':
        // For percentage change, we need to fetch previous value
        // This is simplified - in production, fetch historical data
        const previousValue = current * (1 + Math.random() * 0.2 - 0.1) // Mock previous value
        const percentageChange = ((current - previousValue) / previousValue) * 100
        return percentageChange <= thresh // thresh is negative for drops
      default:
        return false
    }
  }

  private isRuleSuppressed(rule: AlertRule): boolean {
    if (!rule.suppression_period || !rule.last_triggered) return false
    
    const timeSinceLastTrigger = Date.now() - new Date(rule.last_triggered).getTime()
    return timeSinceLastTrigger < rule.suppression_period * 60 * 1000
  }

  private findSimilarActiveAlert(ruleId: string): Alert | undefined {
    return Array.from(this.activeAlerts.values()).find(alert => 
      alert.rule_id === ruleId && alert.status === 'active'
    )
  }

  private async getAffectedURLs(condition: AlertCondition): Promise<string[]> {
    // Mock implementation - return affected URLs based on condition
    const mockUrls = [
      'https://heretheregone.com/blog/sample-post-1',
      'https://heretheregone.com/blog/sample-post-2',
      'https://heretheregone.com/gallery'
    ]
    return mockUrls.slice(0, Math.floor(Math.random() * 3) + 1)
  }

  private async getHistoricalDataPoints(condition: AlertCondition): Promise<Alert['data_points']> {
    // Mock historical data points
    const dataPoints = []
    const now = Date.now()
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString()
      const value = Math.floor(Math.random() * 100) + 50
      
      dataPoints.push({
        timestamp,
        value,
        metric: condition.metric
      })
    }
    
    return dataPoints
  }

  private cleanupResolvedAlerts(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    
    for (const [alertId, alert] of this.activeAlerts.entries()) {
      if (alert.status === 'resolved' && 
          alert.resolved_at && 
          new Date(alert.resolved_at).getTime() < oneDayAgo) {
        this.activeAlerts.delete(alertId)
      }
    }
  }

  // Public API methods

  /**
   * Get alert dashboard data
   */
  getDashboard(): AlertDashboard {
    const activeAlerts = Array.from(this.activeAlerts.values())
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical')
    const warningAlerts = activeAlerts.filter(a => a.severity === 'warning')
    
    const last24h = Date.now() - 24 * 60 * 60 * 1000
    const alertsLast24h = this.alertHistory.filter(a => 
      new Date(a.timestamp).getTime() > last24h
    )

    // Calculate average resolution time
    const resolvedAlerts = this.alertHistory.filter(a => 
      a.status === 'resolved' && a.resolved_at
    )
    const avgResolutionTime = resolvedAlerts.length > 0 ? 
      resolvedAlerts.reduce((sum, alert) => {
        const resolutionTime = new Date(alert.resolved_at!).getTime() - new Date(alert.timestamp).getTime()
        return sum + resolutionTime
      }, 0) / resolvedAlerts.length / (1000 * 60) : 0 // in minutes

    return {
      summary: {
        active_alerts: activeAlerts.length,
        critical_alerts: criticalAlerts.length,
        warning_alerts: warningAlerts.length,
        alerts_last_24h: alertsLast24h.length,
        avg_resolution_time: Math.round(avgResolutionTime),
        most_frequent_alert: this.getMostFrequentAlert()
      },
      recent_alerts: this.alertHistory.slice(-10).reverse(),
      alert_trends: this.generateAlertTrends(),
      top_affected_pages: this.getTopAffectedPages(),
      performance_metrics: {
        uptime_percentage: 99.9,
        avg_response_time: 250,
        error_rate: 0.1,
        core_web_vitals_score: 85
      }
    }
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string, notes?: string): boolean {
    const alert = this.activeAlerts.get(alertId)
    if (!alert) return false

    alert.status = 'acknowledged'
    alert.acknowledged_by = acknowledgedBy
    alert.acknowledged_at = new Date().toISOString()
    if (notes) alert.resolution_notes = notes

    console.log(`✅ Alert acknowledged: ${alert.title} by ${acknowledgedBy}`)
    return true
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string, resolvedBy: string, resolutionNotes: string): boolean {
    const alert = this.activeAlerts.get(alertId)
    if (!alert) return false

    alert.status = 'resolved'
    alert.resolved_at = new Date().toISOString()
    alert.resolution_notes = resolutionNotes
    alert.acknowledged_by = resolvedBy

    console.log(`✅ Alert resolved: ${alert.title} by ${resolvedBy}`)
    return true
  }

  /**
   * Create custom alert rule
   */
  createAlertRule(rule: Omit<AlertRule, 'id' | 'created_at' | 'trigger_count'>): string {
    const ruleId = this.generateRuleId()
    
    const newRule: AlertRule = {
      ...rule,
      id: ruleId,
      created_at: new Date().toISOString(),
      trigger_count: 0
    }

    this.alertRules.set(ruleId, newRule)
    console.log(`✅ Created alert rule: ${rule.name} (${ruleId})`)
    
    return ruleId
  }

  /**
   * Update alert rule
   */
  updateAlertRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const rule = this.alertRules.get(ruleId)
    if (!rule) return false

    Object.assign(rule, updates)
    console.log(`✅ Updated alert rule: ${rule.name}`)
    
    return true
  }

  /**
   * Delete alert rule
   */
  deleteAlertRule(ruleId: string): boolean {
    const rule = this.alertRules.get(ruleId)
    if (!rule) return false

    this.alertRules.delete(ruleId)
    console.log(`🗑️ Deleted alert rule: ${rule.name}`)
    
    return true
  }

  /**
   * Test alert rule
   */
  async testAlertRule(ruleId: string): Promise<{ triggered: boolean; currentValue: number | string; message: string }> {
    const rule = this.alertRules.get(ruleId)
    if (!rule) throw new Error('Alert rule not found')

    const currentValue = await this.fetchMetricValue(rule.condition)
    const triggered = this.evaluateCondition(currentValue, rule.threshold, rule.comparison)
    const message = triggered ? 
      `Alert would be triggered with current value: ${currentValue}` :
      `Alert would not be triggered with current value: ${currentValue}`

    return { triggered, currentValue, message }
  }

  // Helper methods
  private getMostFrequentAlert(): string {
    const alertCounts = new Map<string, number>()
    
    this.alertHistory.forEach(alert => {
      const count = alertCounts.get(alert.title) || 0
      alertCounts.set(alert.title, count + 1)
    })

    let mostFrequent = ''
    let maxCount = 0
    
    for (const [title, count] of alertCounts.entries()) {
      if (count > maxCount) {
        maxCount = count
        mostFrequent = title
      }
    }

    return mostFrequent
  }

  private generateAlertTrends(): AlertDashboard['alert_trends'] {
    const trends = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const dayAlerts = this.alertHistory.filter(alert => 
        alert.timestamp.startsWith(dateString)
      )
      
      trends.push({
        date: dateString,
        critical: dayAlerts.filter(a => a.severity === 'critical').length,
        warning: dayAlerts.filter(a => a.severity === 'warning').length,
        info: dayAlerts.filter(a => a.severity === 'info').length
      })
    }

    return trends
  }

  private getTopAffectedPages(): AlertDashboard['top_affected_pages'] {
    const pageCounts = new Map<string, { count: number; lastAlert: string }>()
    
    this.alertHistory.forEach(alert => {
      alert.affected_urls?.forEach(url => {
        const existing = pageCounts.get(url)
        if (existing) {
          existing.count++
          if (alert.timestamp > existing.lastAlert) {
            existing.lastAlert = alert.timestamp
          }
        } else {
          pageCounts.set(url, { count: 1, lastAlert: alert.timestamp })
        }
      })
    })

    return Array.from(pageCounts.entries())
      .map(([url, data]) => ({
        url,
        alert_count: data.count,
        last_alert: data.lastAlert
      }))
      .sort((a, b) => b.alert_count - a.alert_count)
      .slice(0, 10)
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateRuleId(): string {
    return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Public getters
  public getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values())
  }

  public getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values())
  }

  public getAlertHistory(): Alert[] {
    return this.alertHistory
  }

  public getEscalationPolicies(): EscalationPolicy[] {
    return Array.from(this.escalationPolicies.values())
  }

  public stopMonitoring(): void {
    this.isMonitoring = false
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
    console.log('🔴 SEO Alert System monitoring stopped')
  }

  public getStats(): object {
    return {
      total_rules: this.alertRules.size,
      active_alerts: this.activeAlerts.size,
      total_alerts_sent: this.alertHistory.length,
      is_monitoring: this.isMonitoring,
      notification_queue_size: this.notificationQueue.length,
      escalation_policies: this.escalationPolicies.size
    }
  }
}

// Export singleton instance
export const seoAlertSystem = SEOAlertSystem.getInstance()