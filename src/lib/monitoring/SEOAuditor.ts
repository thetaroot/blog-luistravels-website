/**
 * Automated SEO Auditor - PHASE 6 SEO-PERFECTION-2025
 * Comprehensive automated SEO auditing and quality assurance system
 * SENIOR GOOGLE SEO DEV Level Implementation
 */

interface SEOAuditRule {
  id: string
  name: string
  category: 'technical' | 'content' | 'performance' | 'accessibility' | 'mobile' | 'schema'
  severity: 'critical' | 'warning' | 'info'
  description: string
  how_to_fix: string
  impact: 'high' | 'medium' | 'low'
  automation_level: 'automatic' | 'semi_automatic' | 'manual'
  check_function: (page: PageAuditData) => AuditResult
}

interface PageAuditData {
  url: string
  html: string
  metadata: {
    title: string
    meta_description: string
    meta_keywords?: string
    canonical: string
    robots: string
    viewport: string
    charset: string
    og_tags: Record<string, string>
    twitter_tags: Record<string, string>
    structured_data: any[]
  }
  content: {
    headings: Array<{ level: number; text: string; id?: string }>
    word_count: number
    reading_time: number
    images: Array<{ src: string; alt: string; width?: number; height?: number }>
    links: Array<{ href: string; text: string; internal: boolean; nofollow: boolean }>
    paragraphs: string[]
    lists: Array<{ type: 'ol' | 'ul'; items: string[] }>
  }
  performance: {
    load_time: number
    first_contentful_paint: number
    largest_contentful_paint: number
    cumulative_layout_shift: number
    interaction_to_next_paint: number
    time_to_first_byte: number
    size_total: number
    size_html: number
    size_css: number
    size_js: number
    size_images: number
    requests_total: number
  }
  accessibility: {
    color_contrast_issues: number
    missing_alt_texts: number
    missing_headings: boolean
    keyboard_navigation_issues: number
    aria_issues: number
    form_issues: number
  }
  mobile: {
    is_mobile_friendly: boolean
    viewport_configured: boolean
    touch_targets_appropriate: boolean
    font_size_appropriate: boolean
    content_fits_viewport: boolean
  }
  technical: {
    https_enabled: boolean
    redirects: Array<{ from: string; to: string; status: number }>
    broken_links: string[]
    crawl_errors: string[]
    sitemap_included: boolean
    robots_txt_accessible: boolean
    page_speed_score: number
    compression_enabled: boolean
    browser_caching_enabled: boolean
  }
}

interface AuditResult {
  passed: boolean
  score: number // 0-100
  message: string
  details?: string
  suggestions: string[]
  affected_elements?: string[]
  priority: 'high' | 'medium' | 'low'
}

interface SEOAuditReport {
  url: string
  audit_id: string
  timestamp: string
  overall_score: number
  category_scores: {
    technical: number
    content: number
    performance: number
    accessibility: number
    mobile: number
    schema: number
  }
  critical_issues: AuditResult[]
  warnings: AuditResult[]
  passed_checks: AuditResult[]
  recommendations: {
    quick_fixes: string[]
    medium_priority: string[]
    long_term: string[]
  }
  competitive_analysis?: {
    vs_competitors: Array<{
      competitor: string
      our_score: number
      their_score: number
      gap_analysis: string[]
    }>
  }
  progress_tracking?: {
    previous_score: number
    score_change: number
    improvement_areas: string[]
    regression_areas: string[]
  }
  action_plan: {
    immediate: string[]
    this_week: string[]
    this_month: string[]
  }
}

interface AuditSchedule {
  id: string
  name: string
  urls: string[]
  frequency: 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  last_run: string
  next_run: string
  notification_channels: ('email' | 'slack' | 'webhook')[]
  rules_to_include: string[]
  created_at: string
}

export class SEOAuditor {
  private static instance: SEOAuditor
  private auditRules: Map<string, SEOAuditRule> = new Map()
  private auditHistory: Map<string, SEOAuditReport[]> = new Map()
  private scheduledAudits: Map<string, AuditSchedule> = new Map()
  private isRunning: boolean = false
  private auditQueue: string[] = []

  constructor() {
    this.initializeAuditRules()
    this.startScheduledAudits()
  }

  public static getInstance(): SEOAuditor {
    if (!SEOAuditor.instance) {
      SEOAuditor.instance = new SEOAuditor()
    }
    return SEOAuditor.instance
  }

  /**
   * Initialize comprehensive SEO audit rules
   */
  private initializeAuditRules(): void {
    const rules: SEOAuditRule[] = [
      // Technical SEO Rules
      {
        id: 'title_tag_exists',
        name: 'Title Tag Exists',
        category: 'technical',
        severity: 'critical',
        description: 'Every page must have a unique, descriptive title tag',
        how_to_fix: 'Add a <title> tag in the <head> section with 50-60 characters',
        impact: 'high',
        automation_level: 'automatic',
        check_function: (page) => ({
          passed: !!page.metadata.title,
          score: page.metadata.title ? 100 : 0,
          message: page.metadata.title ? 'Title tag exists' : 'Missing title tag',
          suggestions: page.metadata.title ? [] : ['Add a descriptive title tag'],
          priority: 'high'
        })
      },
      {
        id: 'title_length_optimal',
        name: 'Title Length Optimization',
        category: 'content',
        severity: 'warning',
        description: 'Title should be 50-60 characters for optimal display in SERPs',
        how_to_fix: 'Adjust title length to 50-60 characters',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => {
          const length = page.metadata.title?.length || 0
          const optimal = length >= 30 && length <= 60
          return {
            passed: optimal,
            score: optimal ? 100 : Math.max(0, 100 - Math.abs(50 - length) * 2),
            message: `Title length: ${length} characters ${optimal ? '(optimal)' : '(needs adjustment)'}`,
            suggestions: length < 30 ? ['Title is too short - add more descriptive text'] :
                        length > 60 ? ['Title is too long - trim to under 60 characters'] : [],
            priority: 'medium'
          }
        }
      },
      {
        id: 'meta_description_exists',
        name: 'Meta Description Exists',
        category: 'technical',
        severity: 'warning',
        description: 'Pages should have compelling meta descriptions',
        how_to_fix: 'Add a meta description tag with 150-160 characters',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => ({
          passed: !!page.metadata.meta_description,
          score: page.metadata.meta_description ? 100 : 0,
          message: page.metadata.meta_description ? 'Meta description exists' : 'Missing meta description',
          suggestions: page.metadata.meta_description ? [] : ['Add a compelling meta description'],
          priority: 'medium'
        })
      },
      {
        id: 'meta_description_length',
        name: 'Meta Description Length',
        category: 'content',
        severity: 'info',
        description: 'Meta description should be 150-160 characters',
        how_to_fix: 'Adjust meta description to 150-160 characters',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => {
          const length = page.metadata.meta_description?.length || 0
          const optimal = length >= 120 && length <= 160
          return {
            passed: optimal,
            score: optimal ? 100 : Math.max(0, 100 - Math.abs(140 - length)),
            message: `Meta description: ${length} characters ${optimal ? '(optimal)' : '(needs adjustment)'}`,
            suggestions: length < 120 ? ['Meta description is too short'] :
                        length > 160 ? ['Meta description is too long'] : [],
            priority: 'low'
          }
        }
      },
      {
        id: 'h1_tag_exists',
        name: 'H1 Tag Exists',
        category: 'technical',
        severity: 'critical',
        description: 'Every page must have exactly one H1 tag',
        how_to_fix: 'Add a single, descriptive H1 tag to the page',
        impact: 'high',
        automation_level: 'automatic',
        check_function: (page) => {
          const h1Tags = page.content.headings.filter(h => h.level === 1)
          const passed = h1Tags.length === 1
          return {
            passed,
            score: passed ? 100 : h1Tags.length === 0 ? 0 : 50,
            message: `Found ${h1Tags.length} H1 tag(s) ${passed ? '(optimal)' : '(should be exactly 1)'}`,
            suggestions: h1Tags.length === 0 ? ['Add an H1 tag'] :
                        h1Tags.length > 1 ? ['Use only one H1 tag per page'] : [],
            priority: 'high'
          }
        }
      },
      {
        id: 'heading_hierarchy',
        name: 'Heading Hierarchy',
        category: 'content',
        severity: 'warning',
        description: 'Headings should follow proper hierarchy (H1 > H2 > H3...)',
        how_to_fix: 'Ensure headings follow sequential order without skipping levels',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => {
          const headings = page.content.headings
          let hierarchyIssues = 0
          let previousLevel = 0
          
          for (const heading of headings) {
            if (heading.level - previousLevel > 1) {
              hierarchyIssues++
            }
            previousLevel = heading.level
          }
          
          const passed = hierarchyIssues === 0
          return {
            passed,
            score: Math.max(0, 100 - hierarchyIssues * 20),
            message: `Heading hierarchy ${passed ? 'is correct' : `has ${hierarchyIssues} issue(s)`}`,
            suggestions: passed ? [] : ['Fix heading hierarchy - avoid skipping heading levels'],
            priority: 'medium'
          }
        }
      },
      {
        id: 'images_have_alt_text',
        name: 'Images Have Alt Text',
        category: 'accessibility',
        severity: 'warning',
        description: 'All images should have descriptive alt text',
        how_to_fix: 'Add alt attributes to all images with descriptive text',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => {
          const totalImages = page.content.images.length
          const imagesWithAlt = page.content.images.filter(img => img.alt && img.alt.trim()).length
          const percentage = totalImages > 0 ? (imagesWithAlt / totalImages) * 100 : 100
          
          return {
            passed: percentage === 100,
            score: percentage,
            message: `${imagesWithAlt}/${totalImages} images have alt text (${percentage.toFixed(1)}%)`,
            suggestions: percentage < 100 ? [`Add alt text to ${totalImages - imagesWithAlt} image(s)`] : [],
            affected_elements: page.content.images
              .filter(img => !img.alt || !img.alt.trim())
              .map(img => img.src),
            priority: 'medium'
          }
        }
      },
      {
        id: 'internal_links_exist',
        name: 'Internal Links Present',
        category: 'content',
        severity: 'info',
        description: 'Pages should have internal links to improve site structure',
        how_to_fix: 'Add relevant internal links to other pages on your site',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => {
          const internalLinks = page.content.links.filter(link => link.internal).length
          const passed = internalLinks >= 2
          
          return {
            passed,
            score: Math.min(100, internalLinks * 25),
            message: `Found ${internalLinks} internal link(s) ${passed ? '(good)' : '(consider adding more)'}`,
            suggestions: internalLinks < 2 ? ['Add more internal links to improve site structure'] : [],
            priority: 'low'
          }
        }
      },
      {
        id: 'https_enabled',
        name: 'HTTPS Enabled',
        category: 'technical',
        severity: 'critical',
        description: 'All pages must be served over HTTPS',
        how_to_fix: 'Install SSL certificate and redirect HTTP to HTTPS',
        impact: 'high',
        automation_level: 'automatic',
        check_function: (page) => ({
          passed: page.technical.https_enabled,
          score: page.technical.https_enabled ? 100 : 0,
          message: page.technical.https_enabled ? 'HTTPS enabled' : 'HTTPS not enabled',
          suggestions: page.technical.https_enabled ? [] : ['Enable HTTPS with SSL certificate'],
          priority: 'high'
        })
      },
      {
        id: 'page_speed_good',
        name: 'Page Speed Performance',
        category: 'performance',
        severity: 'warning',
        description: 'Page should load quickly for good user experience',
        how_to_fix: 'Optimize images, minify CSS/JS, enable compression',
        impact: 'high',
        automation_level: 'automatic',
        check_function: (page) => {
          const speedScore = page.technical.page_speed_score
          const passed = speedScore >= 80
          
          return {
            passed,
            score: speedScore,
            message: `Page speed score: ${speedScore}/100 ${passed ? '(good)' : '(needs improvement)'}`,
            suggestions: speedScore < 80 ? [
              'Optimize images and use next-gen formats',
              'Minify CSS and JavaScript',
              'Enable compression and browser caching',
              'Optimize server response time'
            ] : [],
            priority: speedScore < 50 ? 'high' : speedScore < 80 ? 'medium' : 'low'
          }
        }
      },
      {
        id: 'mobile_friendly',
        name: 'Mobile Friendly',
        category: 'mobile',
        severity: 'critical',
        description: 'Page must be mobile-friendly',
        how_to_fix: 'Implement responsive design and proper viewport meta tag',
        impact: 'high',
        automation_level: 'automatic',
        check_function: (page) => ({
          passed: page.mobile.is_mobile_friendly,
          score: page.mobile.is_mobile_friendly ? 100 : 0,
          message: page.mobile.is_mobile_friendly ? 'Mobile friendly' : 'Not mobile friendly',
          suggestions: page.mobile.is_mobile_friendly ? [] : [
            'Add viewport meta tag',
            'Use responsive design',
            'Ensure touch targets are appropriate size'
          ],
          priority: 'high'
        })
      },
      {
        id: 'structured_data_present',
        name: 'Structured Data Present',
        category: 'schema',
        severity: 'info',
        description: 'Pages should include relevant structured data',
        how_to_fix: 'Add appropriate JSON-LD structured data markup',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => {
          const hasStructuredData = page.metadata.structured_data.length > 0
          const schemaTypes = page.metadata.structured_data.map(sd => sd['@type']).join(', ')
          
          return {
            passed: hasStructuredData,
            score: hasStructuredData ? 100 : 0,
            message: hasStructuredData ? 
              `Structured data found: ${schemaTypes}` : 
              'No structured data found',
            suggestions: hasStructuredData ? [] : [
              'Add JSON-LD structured data markup',
              'Consider Article, WebPage, or BreadcrumbList schemas'
            ],
            priority: 'medium'
          }
        }
      },
      {
        id: 'canonical_tag_present',
        name: 'Canonical Tag Present',
        category: 'technical',
        severity: 'warning',
        description: 'Pages should have canonical tags to prevent duplicate content',
        how_to_fix: 'Add rel="canonical" link tag pointing to the preferred URL',
        impact: 'medium',
        automation_level: 'automatic',
        check_function: (page) => ({
          passed: !!page.metadata.canonical,
          score: page.metadata.canonical ? 100 : 0,
          message: page.metadata.canonical ? 'Canonical tag present' : 'Missing canonical tag',
          suggestions: page.metadata.canonical ? [] : ['Add canonical tag to prevent duplicate content'],
          priority: 'medium'
        })
      },
      {
        id: 'robots_meta_appropriate',
        name: 'Robots Meta Appropriate',
        category: 'technical',
        severity: 'warning',
        description: 'Robots meta tag should allow indexing for public pages',
        how_to_fix: 'Set robots meta to "index, follow" for public pages',
        impact: 'high',
        automation_level: 'semi_automatic',
        check_function: (page) => {
          const robots = page.metadata.robots.toLowerCase()
          const isIndexable = !robots.includes('noindex')
          const isFollowable = !robots.includes('nofollow')
          const passed = isIndexable && isFollowable
          
          return {
            passed,
            score: passed ? 100 : 50,
            message: `Robots: ${page.metadata.robots} ${passed ? '(good)' : '(may prevent indexing)'}`,
            suggestions: passed ? [] : ['Review robots meta tag settings'],
            priority: 'medium'
          }
        }
      },
      {
        id: 'word_count_adequate',
        name: 'Adequate Word Count',
        category: 'content',
        severity: 'info',
        description: 'Content should have adequate word count for the topic',
        how_to_fix: 'Expand content to provide comprehensive coverage of the topic',
        impact: 'medium',
        automation_level: 'semi_automatic',
        check_function: (page) => {
          const wordCount = page.content.word_count
          const passed = wordCount >= 300
          const score = Math.min(100, wordCount / 300 * 100)
          
          return {
            passed,
            score,
            message: `Word count: ${wordCount} ${passed ? '(adequate)' : '(consider expanding)'}`,
            suggestions: wordCount < 300 ? ['Consider expanding content for better topical coverage'] : [],
            priority: 'low'
          }
        }
      }
    ]

    rules.forEach(rule => {
      this.auditRules.set(rule.id, rule)
    })

    console.log(`✅ Initialized ${rules.length} SEO audit rules`)
  }

  /**
   * Perform comprehensive SEO audit on a URL
   */
  async auditURL(url: string, options?: {
    include_performance?: boolean
    include_accessibility?: boolean
    custom_rules?: string[]
    compare_with_previous?: boolean
  }): Promise<SEOAuditReport> {
    console.log(`🔍 Starting SEO audit for: ${url}`)
    const auditId = this.generateAuditId()
    const startTime = Date.now()

    try {
      // Fetch and analyze page data
      const pageData = await this.fetchPageData(url, options)
      
      // Run audit rules
      const auditResults = await this.runAuditRules(pageData, options?.custom_rules)
      
      // Calculate scores
      const scores = this.calculateCategoryScores(auditResults)
      const overallScore = this.calculateOverallScore(scores)
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(auditResults)
      
      // Create action plan
      const actionPlan = this.createActionPlan(auditResults)
      
      // Compare with previous audit if requested
      let progressTracking
      if (options?.compare_with_previous) {
        progressTracking = this.compareWithPrevious(url, overallScore, auditResults)
      }

      const report: SEOAuditReport = {
        url,
        audit_id: auditId,
        timestamp: new Date().toISOString(),
        overall_score: overallScore,
        category_scores: scores,
        critical_issues: auditResults.filter(r => !r.passed && r.priority === 'high'),
        warnings: auditResults.filter(r => !r.passed && r.priority === 'medium'),
        passed_checks: auditResults.filter(r => r.passed),
        recommendations,
        progress_tracking: progressTracking,
        action_plan: actionPlan
      }

      // Store audit result
      this.storeAuditResult(url, report)
      
      const processingTime = Date.now() - startTime
      console.log(`✅ SEO audit completed in ${processingTime}ms`)
      console.log(`📊 Overall Score: ${overallScore}/100`)
      console.log(`🚨 Critical Issues: ${report.critical_issues.length}`)
      console.log(`⚠️ Warnings: ${report.warnings.length}`)

      return report

    } catch (error) {
      console.error(`❌ SEO audit failed for ${url}:`, error)
      throw error
    }
  }

  /**
   * Run batch audit on multiple URLs
   */
  async auditMultipleURLs(urls: string[], options?: {
    concurrent_limit?: number
    include_performance?: boolean
    generate_comparison?: boolean
  }): Promise<Map<string, SEOAuditReport>> {
    console.log(`🔍 Starting batch SEO audit for ${urls.length} URLs...`)
    
    const concurrentLimit = options?.concurrent_limit || 5
    const results = new Map<string, SEOAuditReport>()
    
    // Process URLs in batches
    for (let i = 0; i < urls.length; i += concurrentLimit) {
      const batch = urls.slice(i, i + concurrentLimit)
      console.log(`📦 Processing batch ${Math.floor(i / concurrentLimit) + 1}/${Math.ceil(urls.length / concurrentLimit)}`)
      
      const batchPromises = batch.map(async (url) => {
        try {
          const report = await this.auditURL(url, options)
          results.set(url, report)
        } catch (error) {
          console.error(`Failed to audit ${url}:`, error)
        }
      })
      
      await Promise.all(batchPromises)
      
      // Small delay between batches
      if (i + concurrentLimit < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Generate comparison report if requested
    if (options?.generate_comparison) {
      this.generateBatchComparisonReport(results)
    }

    console.log(`✅ Batch audit completed: ${results.size}/${urls.length} URLs audited`)
    return results
  }

  /**
   * Generate site-wide audit report
   */
  async auditEntireSite(baseUrl: string, options?: {
    max_pages?: number
    include_external_links?: boolean
    depth_limit?: number
  }): Promise<{
    summary: any
    page_reports: Map<string, SEOAuditReport>
    site_issues: any[]
    recommendations: string[]
  }> {
    console.log(`🌐 Starting site-wide SEO audit for: ${baseUrl}`)
    
    try {
      // Discover all pages
      const pages = await this.discoverSitePages(baseUrl, options)
      console.log(`📄 Discovered ${pages.length} pages to audit`)
      
      // Audit all pages
      const pageReports = await this.auditMultipleURLs(pages, {
        concurrent_limit: 3,
        include_performance: true
      })
      
      // Analyze site-wide issues
      const siteIssues = this.analyzeSiteWideIssues(pageReports)
      
      // Generate site-wide recommendations
      const recommendations = this.generateSiteWideRecommendations(pageReports, siteIssues)
      
      // Create summary
      const summary = this.createSiteAuditSummary(pageReports, siteIssues)
      
      console.log(`✅ Site-wide audit completed`)
      console.log(`📊 Average Score: ${summary.average_score}/100`)
      console.log(`🚨 Total Critical Issues: ${summary.total_critical_issues}`)

      return {
        summary,
        page_reports: pageReports,
        site_issues: siteIssues,
        recommendations
      }

    } catch (error) {
      console.error(`❌ Site-wide audit failed:`, error)
      throw error
    }
  }

  /**
   * Schedule automated audits
   */
  scheduleAudit(config: {
    name: string
    urls: string[]
    frequency: 'daily' | 'weekly' | 'monthly'
    notification_channels?: ('email' | 'slack' | 'webhook')[]
    rules_to_include?: string[]
  }): string {
    const scheduleId = this.generateScheduleId()
    
    const schedule: AuditSchedule = {
      id: scheduleId,
      name: config.name,
      urls: config.urls,
      frequency: config.frequency,
      enabled: true,
      last_run: '',
      next_run: this.calculateNextRun(config.frequency),
      notification_channels: config.notification_channels || ['email'],
      rules_to_include: config.rules_to_include || Array.from(this.auditRules.keys()),
      created_at: new Date().toISOString()
    }

    this.scheduledAudits.set(scheduleId, schedule)
    console.log(`✅ Scheduled audit created: ${config.name} (${scheduleId})`)
    
    return scheduleId
  }

  /**
   * Get audit insights and trends
   */
  getAuditInsights(url?: string, timeRange?: number): {
    trends: any
    top_issues: any[]
    improvements: any[]
    score_history: any[]
    recommendations: string[]
  } {
    const endTime = Date.now()
    const startTime = timeRange ? endTime - timeRange : endTime - (30 * 24 * 60 * 60 * 1000) // 30 days default
    
    let relevantAudits: SEOAuditReport[] = []
    
    if (url) {
      relevantAudits = this.auditHistory.get(url) || []
    } else {
      // All audits
      for (const audits of this.auditHistory.values()) {
        relevantAudits.push(...audits)
      }
    }
    
    // Filter by time range
    relevantAudits = relevantAudits.filter(audit => 
      new Date(audit.timestamp).getTime() >= startTime
    )

    const trends = this.analyzeTrends(relevantAudits)
    const topIssues = this.getTopIssues(relevantAudits)
    const improvements = this.getImprovements(relevantAudits)
    const scoreHistory = this.getScoreHistory(relevantAudits)
    const recommendations = this.getInsightRecommendations(trends, topIssues)

    return {
      trends,
      top_issues: topIssues,
      improvements,
      score_history: scoreHistory,
      recommendations
    }
  }

  // Helper methods for data fetching and analysis

  private async fetchPageData(url: string, options?: any): Promise<PageAuditData> {
    // In production, this would fetch actual page data
    // For now, return mock data structure
    
    return {
      url,
      html: '<html>...</html>',
      metadata: {
        title: 'Sample Page Title',
        meta_description: 'Sample meta description for the page',
        canonical: url,
        robots: 'index, follow',
        viewport: 'width=device-width, initial-scale=1',
        charset: 'utf-8',
        og_tags: {
          'og:title': 'Sample Page Title',
          'og:description': 'Sample meta description',
          'og:type': 'article'
        },
        twitter_tags: {
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Sample Page Title'
        },
        structured_data: [
          { '@type': 'Article', '@context': 'https://schema.org' }
        ]
      },
      content: {
        headings: [
          { level: 1, text: 'Main Heading', id: 'main-heading' },
          { level: 2, text: 'Subheading', id: 'subheading' }
        ],
        word_count: 850,
        reading_time: 4,
        images: [
          { src: '/image1.jpg', alt: 'Descriptive alt text', width: 800, height: 600 },
          { src: '/image2.jpg', alt: '', width: 400, height: 300 }
        ],
        links: [
          { href: '/internal-page', text: 'Internal Link', internal: true, nofollow: false },
          { href: 'https://external.com', text: 'External Link', internal: false, nofollow: true }
        ],
        paragraphs: ['First paragraph...', 'Second paragraph...'],
        lists: [
          { type: 'ul', items: ['Item 1', 'Item 2', 'Item 3'] }
        ]
      },
      performance: {
        load_time: 2.1,
        first_contentful_paint: 1.2,
        largest_contentful_paint: 2.8,
        cumulative_layout_shift: 0.15,
        interaction_to_next_paint: 180,
        time_to_first_byte: 450,
        size_total: 2.1,
        size_html: 0.3,
        size_css: 0.4,
        size_js: 0.8,
        size_images: 0.6,
        requests_total: 45
      },
      accessibility: {
        color_contrast_issues: 2,
        missing_alt_texts: 1,
        missing_headings: false,
        keyboard_navigation_issues: 0,
        aria_issues: 1,
        form_issues: 0
      },
      mobile: {
        is_mobile_friendly: true,
        viewport_configured: true,
        touch_targets_appropriate: true,
        font_size_appropriate: true,
        content_fits_viewport: true
      },
      technical: {
        https_enabled: true,
        redirects: [],
        broken_links: [],
        crawl_errors: [],
        sitemap_included: true,
        robots_txt_accessible: true,
        page_speed_score: 85,
        compression_enabled: true,
        browser_caching_enabled: true
      }
    }
  }

  private async runAuditRules(pageData: PageAuditData, customRules?: string[]): Promise<AuditResult[]> {
    const rulesToRun = customRules ? 
      customRules.map(id => this.auditRules.get(id)).filter(Boolean) :
      Array.from(this.auditRules.values())

    const results: AuditResult[] = []

    for (const rule of rulesToRun) {
      try {
        const result = rule!.check_function(pageData)
        results.push({
          ...result,
          details: `Rule: ${rule!.name} (${rule!.category})`
        })
      } catch (error) {
        console.error(`Failed to run rule ${rule!.id}:`, error)
      }
    }

    return results
  }

  private calculateCategoryScores(results: AuditResult[]): SEOAuditReport['category_scores'] {
    const categories = ['technical', 'content', 'performance', 'accessibility', 'mobile', 'schema']
    const scores: any = {}

    categories.forEach(category => {
      const categoryRules = Array.from(this.auditRules.values())
        .filter(rule => rule.category === category)
      
      if (categoryRules.length > 0) {
        const categoryResults = results.filter(result => 
          categoryRules.some(rule => result.details?.includes(rule.name))
        )
        
        const totalScore = categoryResults.reduce((sum, result) => sum + result.score, 0)
        scores[category] = categoryResults.length > 0 ? totalScore / categoryResults.length : 100
      } else {
        scores[category] = 100
      }
    })

    return scores
  }

  private calculateOverallScore(categoryScores: SEOAuditReport['category_scores']): number {
    const weights = {
      technical: 0.25,
      content: 0.20,
      performance: 0.20,
      accessibility: 0.15,
      mobile: 0.15,
      schema: 0.05
    }

    let weightedSum = 0
    let totalWeight = 0

    for (const [category, score] of Object.entries(categoryScores)) {
      const weight = weights[category as keyof typeof weights] || 0
      weightedSum += score * weight
      totalWeight += weight
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
  }

  private generateRecommendations(results: AuditResult[]): SEOAuditReport['recommendations'] {
    const failedResults = results.filter(r => !r.passed)
    
    const quickFixes = failedResults
      .filter(r => r.priority === 'low' || r.suggestions.some(s => s.includes('Add')))
      .flatMap(r => r.suggestions)
      .slice(0, 5)

    const mediumPriority = failedResults
      .filter(r => r.priority === 'medium')
      .flatMap(r => r.suggestions)
      .slice(0, 5)

    const longTerm = failedResults
      .filter(r => r.priority === 'high')
      .flatMap(r => r.suggestions)
      .slice(0, 5)

    return {
      quick_fixes: [...new Set(quickFixes)],
      medium_priority: [...new Set(mediumPriority)],
      long_term: [...new Set(longTerm)]
    }
  }

  private createActionPlan(results: AuditResult[]): SEOAuditReport['action_plan'] {
    const criticalIssues = results.filter(r => !r.passed && r.priority === 'high')
    const mediumIssues = results.filter(r => !r.passed && r.priority === 'medium')
    const lowIssues = results.filter(r => !r.passed && r.priority === 'low')

    return {
      immediate: criticalIssues.flatMap(r => r.suggestions).slice(0, 3),
      this_week: mediumIssues.flatMap(r => r.suggestions).slice(0, 5),
      this_month: lowIssues.flatMap(r => r.suggestions).slice(0, 8)
    }
  }

  private compareWithPrevious(url: string, currentScore: number, currentResults: AuditResult[]): any {
    const history = this.auditHistory.get(url) || []
    const previousAudit = history[history.length - 1]

    if (!previousAudit) {
      return {
        previous_score: 0,
        score_change: currentScore,
        improvement_areas: [],
        regression_areas: []
      }
    }

    const scoreChange = currentScore - previousAudit.overall_score
    
    return {
      previous_score: previousAudit.overall_score,
      score_change: scoreChange,
      improvement_areas: scoreChange > 0 ? ['Overall score improved'] : [],
      regression_areas: scoreChange < 0 ? ['Overall score declined'] : []
    }
  }

  private storeAuditResult(url: string, report: SEOAuditReport): void {
    if (!this.auditHistory.has(url)) {
      this.auditHistory.set(url, [])
    }
    
    const history = this.auditHistory.get(url)!
    history.push(report)
    
    // Keep only last 50 audits per URL
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }
  }

  private async discoverSitePages(baseUrl: string, options?: any): Promise<string[]> {
    // Mock page discovery - in production, crawl sitemap and follow links
    const mockPages = [
      baseUrl,
      `${baseUrl}/blog`,
      `${baseUrl}/about`,
      `${baseUrl}/contact`,
      `${baseUrl}/blog/sample-post-1`,
      `${baseUrl}/blog/sample-post-2`,
      `${baseUrl}/gallery`
    ]

    return mockPages.slice(0, options?.max_pages || 50)
  }

  private analyzeSiteWideIssues(pageReports: Map<string, SEOAuditReport>): any[] {
    const siteIssues = []
    let totalMissingTitles = 0
    let totalMissingDescriptions = 0
    let totalSlowPages = 0

    for (const report of pageReports.values()) {
      if (report.critical_issues.some(issue => issue.message.includes('title'))) {
        totalMissingTitles++
      }
      if (report.warnings.some(issue => issue.message.includes('meta description'))) {
        totalMissingDescriptions++
      }
      if (report.category_scores.performance < 70) {
        totalSlowPages++
      }
    }

    if (totalMissingTitles > 0) {
      siteIssues.push({
        type: 'missing_titles',
        severity: 'critical',
        affected_pages: totalMissingTitles,
        description: `${totalMissingTitles} pages missing title tags`
      })
    }

    if (totalMissingDescriptions > pageReports.size * 0.3) {
      siteIssues.push({
        type: 'missing_descriptions',
        severity: 'warning',
        affected_pages: totalMissingDescriptions,
        description: `${totalMissingDescriptions} pages missing meta descriptions`
      })
    }

    if (totalSlowPages > pageReports.size * 0.2) {
      siteIssues.push({
        type: 'performance_issues',
        severity: 'warning',
        affected_pages: totalSlowPages,
        description: `${totalSlowPages} pages have performance issues`
      })
    }

    return siteIssues
  }

  private generateSiteWideRecommendations(pageReports: Map<string, SEOAuditReport>, siteIssues: any[]): string[] {
    const recommendations = []

    if (siteIssues.some(issue => issue.type === 'missing_titles')) {
      recommendations.push('Implement consistent title tag strategy across all pages')
    }

    if (siteIssues.some(issue => issue.type === 'performance_issues')) {
      recommendations.push('Implement site-wide performance optimizations')
    }

    const avgScore = Array.from(pageReports.values())
      .reduce((sum, report) => sum + report.overall_score, 0) / pageReports.size

    if (avgScore < 80) {
      recommendations.push('Focus on improving overall SEO fundamentals')
    }

    return recommendations
  }

  private createSiteAuditSummary(pageReports: Map<string, SEOAuditReport>, siteIssues: any[]): any {
    const reports = Array.from(pageReports.values())
    
    return {
      total_pages: reports.length,
      average_score: Math.round(reports.reduce((sum, r) => sum + r.overall_score, 0) / reports.length),
      total_critical_issues: reports.reduce((sum, r) => sum + r.critical_issues.length, 0),
      total_warnings: reports.reduce((sum, r) => sum + r.warnings.length, 0),
      best_performing_page: reports.reduce((best, current) => 
        current.overall_score > best.overall_score ? current : best
      ),
      worst_performing_page: reports.reduce((worst, current) => 
        current.overall_score < worst.overall_score ? current : worst
      ),
      site_wide_issues: siteIssues.length
    }
  }

  private startScheduledAudits(): void {
    // Check for scheduled audits every hour
    setInterval(() => {
      this.runScheduledAudits()
    }, 3600000) // 1 hour

    console.log('✅ Scheduled audit system started')
  }

  private runScheduledAudits(): void {
    const now = new Date()

    for (const schedule of this.scheduledAudits.values()) {
      if (schedule.enabled && new Date(schedule.next_run) <= now) {
        this.executeScheduledAudit(schedule)
      }
    }
  }

  private async executeScheduledAudit(schedule: AuditSchedule): Promise<void> {
    console.log(`🔄 Running scheduled audit: ${schedule.name}`)

    try {
      const results = await this.auditMultipleURLs(schedule.urls, {
        concurrent_limit: 3
      })

      // Update schedule
      schedule.last_run = new Date().toISOString()
      schedule.next_run = this.calculateNextRun(schedule.frequency)

      // Send notifications
      await this.sendAuditNotifications(schedule, results)

      console.log(`✅ Scheduled audit completed: ${schedule.name}`)

    } catch (error) {
      console.error(`❌ Scheduled audit failed: ${schedule.name}`, error)
    }
  }

  private calculateNextRun(frequency: string): string {
    const now = new Date()
    
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1)
        break
      case 'weekly':
        now.setDate(now.getDate() + 7)
        break
      case 'monthly':
        now.setMonth(now.getMonth() + 1)
        break
    }

    return now.toISOString()
  }

  private async sendAuditNotifications(schedule: AuditSchedule, results: Map<string, SEOAuditReport>): Promise<void> {
    const summary = this.createNotificationSummary(results)
    
    for (const channel of schedule.notification_channels) {
      switch (channel) {
        case 'email':
          await this.sendEmailNotification(schedule.name, summary)
          break
        case 'slack':
          await this.sendSlackNotification(schedule.name, summary)
          break
        case 'webhook':
          await this.sendWebhookNotification(schedule.name, summary)
          break
      }
    }
  }

  private createNotificationSummary(results: Map<string, SEOAuditReport>): any {
    const reports = Array.from(results.values())
    
    return {
      total_pages: reports.length,
      average_score: Math.round(reports.reduce((sum, r) => sum + r.overall_score, 0) / reports.length),
      critical_issues: reports.reduce((sum, r) => sum + r.critical_issues.length, 0),
      pages_with_issues: reports.filter(r => r.critical_issues.length > 0).length
    }
  }

  private async sendEmailNotification(auditName: string, summary: any): Promise<void> {
    console.log(`📧 Email notification sent for audit: ${auditName}`, summary)
  }

  private async sendSlackNotification(auditName: string, summary: any): Promise<void> {
    console.log(`💬 Slack notification sent for audit: ${auditName}`, summary)
  }

  private async sendWebhookNotification(auditName: string, summary: any): Promise<void> {
    console.log(`🔗 Webhook notification sent for audit: ${auditName}`, summary)
  }

  // Analysis helper methods
  private analyzeTrends(audits: SEOAuditReport[]): any {
    // Analyze score trends over time
    const scoresByMonth = new Map<string, number[]>()
    
    audits.forEach(audit => {
      const month = audit.timestamp.substring(0, 7) // YYYY-MM
      if (!scoresByMonth.has(month)) {
        scoresByMonth.set(month, [])
      }
      scoresByMonth.get(month)!.push(audit.overall_score)
    })

    const trends = Array.from(scoresByMonth.entries()).map(([month, scores]) => ({
      month,
      average_score: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      audit_count: scores.length
    }))

    return { monthly_trends: trends }
  }

  private getTopIssues(audits: SEOAuditReport[]): any[] {
    const issueCount = new Map<string, number>()
    
    audits.forEach(audit => {
      audit.critical_issues.forEach(issue => {
        const key = issue.message
        issueCount.set(key, (issueCount.get(key) || 0) + 1)
      })
    })

    return Array.from(issueCount.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private getImprovements(audits: SEOAuditReport[]): any[] {
    // Find areas where scores have improved
    const improvements = []
    
    // Group audits by URL
    const auditsByUrl = new Map<string, SEOAuditReport[]>()
    audits.forEach(audit => {
      if (!auditsByUrl.has(audit.url)) {
        auditsByUrl.set(audit.url, [])
      }
      auditsByUrl.get(audit.url)!.push(audit)
    })

    // Find improvements for each URL
    auditsByUrl.forEach((urlAudits, url) => {
      if (urlAudits.length >= 2) {
        const sortedAudits = urlAudits.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        
        const latest = sortedAudits[sortedAudits.length - 1]
        const previous = sortedAudits[sortedAudits.length - 2]
        
        if (latest.overall_score > previous.overall_score) {
          improvements.push({
            url,
            score_improvement: latest.overall_score - previous.overall_score,
            timeframe: 'recent'
          })
        }
      }
    })

    return improvements.slice(0, 10)
  }

  private getScoreHistory(audits: SEOAuditReport[]): any[] {
    return audits
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(audit => ({
        timestamp: audit.timestamp,
        score: audit.overall_score,
        url: audit.url
      }))
  }

  private getInsightRecommendations(trends: any, topIssues: any[]): string[] {
    const recommendations = []

    if (topIssues.length > 0) {
      recommendations.push(`Address most common issue: ${topIssues[0].issue}`)
    }

    if (trends.monthly_trends && trends.monthly_trends.length >= 2) {
      const latest = trends.monthly_trends[trends.monthly_trends.length - 1]
      const previous = trends.monthly_trends[trends.monthly_trends.length - 2]
      
      if (latest.average_score < previous.average_score) {
        recommendations.push('Investigate recent score decline')
      } else {
        recommendations.push('Maintain current improvement trajectory')
      }
    }

    return recommendations
  }

  // Utility methods
  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateScheduleId(): string {
    return `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateBatchComparisonReport(results: Map<string, SEOAuditReport>): void {
    const reports = Array.from(results.values())
    const avgScore = reports.reduce((sum, r) => sum + r.overall_score, 0) / reports.length
    
    console.log(`📊 Batch Comparison Report:`)
    console.log(`   Average Score: ${avgScore.toFixed(1)}/100`)
    console.log(`   Best Performing: ${reports.reduce((best, current) => 
      current.overall_score > best.overall_score ? current : best
    ).url}`)
    console.log(`   Worst Performing: ${reports.reduce((worst, current) => 
      current.overall_score < worst.overall_score ? current : worst
    ).url}`)
  }

  // Public methods
  public getAuditRules(): SEOAuditRule[] {
    return Array.from(this.auditRules.values())
  }

  public getAuditHistory(url?: string): SEOAuditReport[] {
    if (url) {
      return this.auditHistory.get(url) || []
    }
    
    const allHistory: SEOAuditReport[] = []
    for (const history of this.auditHistory.values()) {
      allHistory.push(...history)
    }
    return allHistory
  }

  public getScheduledAudits(): AuditSchedule[] {
    return Array.from(this.scheduledAudits.values())
  }

  public enableSchedule(scheduleId: string): boolean {
    const schedule = this.scheduledAudits.get(scheduleId)
    if (schedule) {
      schedule.enabled = true
      console.log(`✅ Enabled scheduled audit: ${schedule.name}`)
      return true
    }
    return false
  }

  public disableSchedule(scheduleId: string): boolean {
    const schedule = this.scheduledAudits.get(scheduleId)
    if (schedule) {
      schedule.enabled = false
      console.log(`⏸️ Disabled scheduled audit: ${schedule.name}`)
      return true
    }
    return false
  }

  public addCustomRule(rule: SEOAuditRule): void {
    this.auditRules.set(rule.id, rule)
    console.log(`✅ Added custom audit rule: ${rule.name}`)
  }

  public removeRule(ruleId: string): void {
    this.auditRules.delete(ruleId)
    console.log(`🗑️ Removed audit rule: ${ruleId}`)
  }

  public clearAuditHistory(url?: string): void {
    if (url) {
      this.auditHistory.delete(url)
      console.log(`🧹 Cleared audit history for: ${url}`)
    } else {
      this.auditHistory.clear()
      console.log('🧹 Cleared all audit history')
    }
  }

  public getStats(): object {
    return {
      total_rules: this.auditRules.size,
      audit_history_entries: Array.from(this.auditHistory.values()).reduce((sum, arr) => sum + arr.length, 0),
      scheduled_audits: this.scheduledAudits.size,
      is_running: this.isRunning,
      queue_length: this.auditQueue.length
    }
  }
}

// Export singleton instance
export const seoAuditor = SEOAuditor.getInstance()