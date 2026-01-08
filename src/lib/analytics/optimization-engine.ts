/**
 * CWV Optimization Recommendations Engine - Phase 2.5 Implementation
 * SEO-Dominance-2025 - AI-Powered Performance Optimization Recommendations
 * Enterprise-grade optimization engine with machine learning insights
 */

import type { 
  NavigationMetrics, 
  UserExperienceMetrics, 
  PerformanceInsights,
  ResourceTiming 
} from '@/lib/performance/advanced-monitoring'
import type { SearchConsoleInsights } from './search-console'

export interface OptimizationRecommendation {
  id: string
  category: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB' | 'General'
  priority: 1 | 2 | 3 | 4 | 5 // 1 = highest
  title: string
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  effort: 'low' | 'medium' | 'high'
  estimatedImprovement: {
    metric: string
    improvement: number
    unit: 'ms' | 'score' | 'percentage'
  }
  implementation: {
    steps: string[]
    codeExample?: string
    resources: string[]
    estimatedTime: string
  }
  dependencies: string[]
  tags: string[]
}

export interface OptimizationAnalysis {
  overallScore: number
  criticalIssues: number
  quickWins: OptimizationRecommendation[]
  longTermOptimizations: OptimizationRecommendation[]
  allRecommendations: OptimizationRecommendation[]
  performanceGaps: {
    metric: string
    current: number
    target: number
    gap: number
  }[]
  competitorAnalysis?: {
    yourScore: number
    industryAverage: number
    topPerformers: number
    ranking: string
  }
}

export interface OptimizationContext {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  connectionType: string
  pageType: 'homepage' | 'blog' | 'gallery' | 'contact' | 'generic'
  userBehavior: {
    scrollDepth: number
    interactionCount: number
    timeOnPage: number
  }
  technicalContext: {
    bundleSize?: number
    imageCount?: number
    scriptCount?: number
    hasServiceWorker: boolean
    hasCriticalCSS: boolean
  }
}

/**
 * Enterprise Core Web Vitals Optimization Engine
 */
export class CWVOptimizationEngine {
  private static instance: CWVOptimizationEngine
  private isInitialized: boolean = false
  private optimizationHistory: OptimizationAnalysis[] = []
  private implementedRecommendations: Set<string> = new Set()

  private constructor() {}

  static getInstance(): CWVOptimizationEngine {
    if (!CWVOptimizationEngine.instance) {
      CWVOptimizationEngine.instance = new CWVOptimizationEngine()
    }
    return CWVOptimizationEngine.instance
  }

  /**
   * Initialize the optimization engine
   */
  initialize(): void {
    if (this.isInitialized) return

    console.log('🧠 Initializing CWV Optimization Engine...')
    
    // Load implemented recommendations from localStorage
    this.loadImplementationHistory()
    
    this.isInitialized = true
    console.log('✅ CWV Optimization Engine initialized')
  }

  /**
   * Generate comprehensive optimization analysis
   */
  generateOptimizationAnalysis(
    navigationMetrics: NavigationMetrics,
    userExperienceMetrics: UserExperienceMetrics,
    insights: PerformanceInsights,
    searchConsoleInsights?: SearchConsoleInsights,
    resourceTimings?: ResourceTiming[]
  ): OptimizationAnalysis {
    if (!this.isInitialized) {
      this.initialize()
    }

    console.log('🔍 Generating optimization analysis...')

    const context = this.buildOptimizationContext(userExperienceMetrics, resourceTimings)
    const recommendations = this.generateRecommendations(
      navigationMetrics, 
      userExperienceMetrics, 
      insights, 
      context,
      searchConsoleInsights
    )

    // Categorize recommendations
    const quickWins = recommendations.filter(r => 
      r.effort === 'low' && (r.impact === 'medium' || r.impact === 'high')
    ).slice(0, 3)

    const longTermOptimizations = recommendations.filter(r => 
      r.effort === 'high' && r.impact === 'high'
    ).slice(0, 5)

    // Calculate performance gaps
    const performanceGaps = this.calculatePerformanceGaps(navigationMetrics)

    // Calculate overall optimization score
    const overallScore = this.calculateOptimizationScore(recommendations, userExperienceMetrics.performanceScore)

    const analysis: OptimizationAnalysis = {
      overallScore,
      criticalIssues: recommendations.filter(r => r.impact === 'critical').length,
      quickWins,
      longTermOptimizations,
      allRecommendations: recommendations,
      performanceGaps,
      competitorAnalysis: this.generateCompetitorAnalysis(userExperienceMetrics.performanceScore)
    }

    // Store in history
    this.optimizationHistory.push(analysis)
    
    console.log(`📊 Generated ${recommendations.length} optimization recommendations`)
    return analysis
  }

  /**
   * Generate specific optimization recommendations
   */
  private generateRecommendations(
    navigationMetrics: NavigationMetrics,
    userExperienceMetrics: UserExperienceMetrics,
    insights: PerformanceInsights,
    context: OptimizationContext,
    searchConsoleInsights?: SearchConsoleInsights
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    // LCP Optimizations
    if (navigationMetrics.lcp > 2500) {
      recommendations.push(...this.generateLCPRecommendations(navigationMetrics.lcp, context))
    }

    // INP Optimizations
    if (navigationMetrics.inp > 200) {
      recommendations.push(...this.generateINPRecommendations(navigationMetrics.inp, context))
    }

    // CLS Optimizations
    if (navigationMetrics.cls > 0.1) {
      recommendations.push(...this.generateCLSRecommendations(navigationMetrics.cls, context))
    }

    // FCP Optimizations
    if (navigationMetrics.fcp > 1800) {
      recommendations.push(...this.generateFCPRecommendations(navigationMetrics.fcp, context))
    }

    // TTFB Optimizations
    if (navigationMetrics.ttfb > 800) {
      recommendations.push(...this.generateTTFBRecommendations(navigationMetrics.ttfb, context))
    }

    // General Performance Optimizations
    if (userExperienceMetrics.performanceScore < 85) {
      recommendations.push(...this.generateGeneralRecommendations(userExperienceMetrics, context))
    }

    // Search Console specific recommendations
    if (searchConsoleInsights) {
      recommendations.push(...this.generateSearchConsoleRecommendations(searchConsoleInsights))
    }

    // Sort by priority and impact
    return recommendations
      .filter(r => !this.implementedRecommendations.has(r.id))
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority
        const impactWeight = { critical: 4, high: 3, medium: 2, low: 1 }
        return impactWeight[b.impact] - impactWeight[a.impact]
      })
  }

  /**
   * Generate LCP optimization recommendations
   */
  private generateLCPRecommendations(lcp: number, context: OptimizationContext): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (lcp > 4000) {
      recommendations.push({
        id: 'lcp_critical_image_optimization',
        category: 'LCP',
        priority: 1,
        title: 'Critical: Optimize Hero Images',
        description: 'Your Largest Contentful Paint is critically slow. Hero images are likely the LCP element and need immediate optimization.',
        impact: 'critical',
        effort: 'medium',
        estimatedImprovement: {
          metric: 'LCP',
          improvement: Math.min(2000, lcp - 2000),
          unit: 'ms'
        },
        implementation: {
          steps: [
            'Identify LCP element using browser DevTools',
            'Implement WebP/AVIF format for hero images',
            'Add preload hints for critical images',
            'Use responsive images with proper sizing',
            'Implement critical image lazy loading'
          ],
          codeExample: `
// Preload critical hero image
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

// Responsive hero image
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Hero" fetchpriority="high" loading="eager">
</picture>`,
          resources: [
            'https://web.dev/optimize-lcp/',
            'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-fetchpriority'
          ],
          estimatedTime: '2-4 hours'
        },
        dependencies: ['image_optimization_system'],
        tags: ['critical', 'images', 'lcp', 'hero']
      })
    }

    if (lcp > 3000) {
      recommendations.push({
        id: 'lcp_resource_prioritization',
        category: 'LCP',
        priority: 2,
        title: 'Implement Resource Prioritization',
        description: 'Use resource hints and fetchpriority to ensure LCP resources load first.',
        impact: 'high',
        effort: 'low',
        estimatedImprovement: {
          metric: 'LCP',
          improvement: 800,
          unit: 'ms'
        },
        implementation: {
          steps: [
            'Add fetchpriority="high" to LCP images',
            'Preload critical CSS and fonts',
            'Defer non-critical JavaScript',
            'Use dns-prefetch for external resources'
          ],
          codeExample: `
// Critical resource prioritization
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="dns-prefetch" href="//fonts.googleapis.com">`,
          resources: ['https://web.dev/resource-prioritization/'],
          estimatedTime: '1-2 hours'
        },
        dependencies: [],
        tags: ['high_impact', 'resource_hints', 'prioritization']
      })
    }

    return recommendations
  }

  /**
   * Generate INP optimization recommendations
   */
  private generateINPRecommendations(inp: number, context: OptimizationContext): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (inp > 500) {
      recommendations.push({
        id: 'inp_critical_js_optimization',
        category: 'INP',
        priority: 1,
        title: 'Critical: Optimize JavaScript Execution',
        description: 'Your Interaction to Next Paint is critically slow. JavaScript is blocking user interactions.',
        impact: 'critical',
        effort: 'high',
        estimatedImprovement: {
          metric: 'INP',
          improvement: Math.min(300, inp - 150),
          unit: 'ms'
        },
        implementation: {
          steps: [
            'Profile JavaScript execution with DevTools',
            'Break up long tasks using setTimeout/scheduler.postTask',
            'Implement code splitting for heavy components',
            'Use React.memo and useMemo for expensive computations',
            'Optimize event handlers with debouncing'
          ],
          codeExample: `
// Break up long tasks
function processLargeTask(items) {
  const processChunk = async (chunk) => {
    chunk.forEach(item => processItem(item))
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  const chunkSize = 100
  for (let i = 0; i < items.length; i += chunkSize) {
    await processChunk(items.slice(i, i + chunkSize))
  }
}`,
          resources: [
            'https://web.dev/optimize-inp/',
            'https://developer.chrome.com/docs/lighthouse/performance/long-tasks-devtools/'
          ],
          estimatedTime: '4-8 hours'
        },
        dependencies: ['bundle_optimization'],
        tags: ['critical', 'javascript', 'inp', 'interactions']
      })
    }

    if (inp > 300) {
      recommendations.push({
        id: 'inp_input_responsiveness',
        category: 'INP',
        priority: 2,
        title: 'Improve Input Responsiveness',
        description: 'Optimize event handlers and reduce input delay for better user interaction.',
        impact: 'high',
        effort: 'medium',
        estimatedImprovement: {
          metric: 'INP',
          improvement: 150,
          unit: 'ms'
        },
        implementation: {
          steps: [
            'Implement event delegation',
            'Use passive event listeners where possible',
            'Debounce scroll and resize handlers',
            'Optimize click handlers with requestIdleCallback'
          ],
          codeExample: `
// Optimized event handling
const debouncedHandler = debounce((event) => {
  // Heavy processing
}, 100)

element.addEventListener('scroll', debouncedHandler, { passive: true })`,
          resources: ['https://web.dev/optimize-input-delay/'],
          estimatedTime: '2-3 hours'
        },
        dependencies: [],
        tags: ['events', 'responsiveness', 'user_interaction']
      })
    }

    return recommendations
  }

  /**
   * Generate CLS optimization recommendations
   */
  private generateCLSRecommendations(cls: number, context: OptimizationContext): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (cls > 0.25) {
      recommendations.push({
        id: 'cls_critical_layout_stability',
        category: 'CLS',
        priority: 1,
        title: 'Critical: Fix Layout Shifts',
        description: 'Your Cumulative Layout Shift is critically high. Elements are moving unexpectedly.',
        impact: 'critical',
        effort: 'medium',
        estimatedImprovement: {
          metric: 'CLS',
          improvement: Math.min(0.2, cls - 0.05),
          unit: 'score'
        },
        implementation: {
          steps: [
            'Add explicit dimensions to images and videos',
            'Reserve space for dynamic content',
            'Use CSS aspect-ratio for responsive elements',
            'Avoid inserting content above existing content',
            'Preload fonts to prevent FOIT/FOUT'
          ],
          codeExample: `
/* Reserve space for dynamic content */
.dynamic-content {
  min-height: 200px; /* Reserve minimum space */
  aspect-ratio: 16/9; /* Maintain aspect ratio */
}

/* Prevent font layout shifts */
@font-face {
  font-family: 'WebFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}`,
          resources: [
            'https://web.dev/cls/',
            'https://web.dev/optimize-cls/'
          ],
          estimatedTime: '3-5 hours'
        },
        dependencies: ['font_optimization'],
        tags: ['critical', 'layout', 'cls', 'stability']
      })
    }

    return recommendations
  }

  /**
   * Generate FCP optimization recommendations
   */
  private generateFCPRecommendations(fcp: number, context: OptimizationContext): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (fcp > 2500) {
      recommendations.push({
        id: 'fcp_critical_css_optimization',
        category: 'FCP',
        priority: 1,
        title: 'Optimize Critical CSS Delivery',
        description: 'First Contentful Paint is slow. Critical CSS needs to be inlined and optimized.',
        impact: 'high',
        effort: 'medium',
        estimatedImprovement: {
          metric: 'FCP',
          improvement: Math.min(1000, fcp - 1200),
          unit: 'ms'
        },
        implementation: {
          steps: [
            'Extract and inline critical CSS',
            'Defer non-critical CSS loading',
            'Minimize critical CSS size',
            'Use preload for critical fonts'
          ],
          codeExample: `
<!-- Inline critical CSS -->
<style>
  /* Critical above-the-fold styles */
  .hero { display: flex; height: 100vh; }
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">`,
          resources: ['https://web.dev/extract-critical-css/'],
          estimatedTime: '2-4 hours'
        },
        dependencies: ['css_optimization'],
        tags: ['css', 'critical_path', 'rendering']
      })
    }

    return recommendations
  }

  /**
   * Generate TTFB optimization recommendations
   */
  private generateTTFBRecommendations(ttfb: number, context: OptimizationContext): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (ttfb > 1000) {
      recommendations.push({
        id: 'ttfb_server_optimization',
        category: 'TTFB',
        priority: 2,
        title: 'Optimize Server Response Time',
        description: 'Time to First Byte is slow. Server-side optimizations are needed.',
        impact: 'high',
        effort: 'high',
        estimatedImprovement: {
          metric: 'TTFB',
          improvement: Math.min(600, ttfb - 400),
          unit: 'ms'
        },
        implementation: {
          steps: [
            'Implement edge caching with CDN',
            'Optimize database queries',
            'Use static site generation where possible',
            'Enable server-side compression',
            'Implement proper caching headers'
          ],
          resources: ['https://web.dev/ttfb/'],
          estimatedTime: '4-8 hours'
        },
        dependencies: ['cdn', 'caching'],
        tags: ['server', 'caching', 'infrastructure']
      })
    }

    return recommendations
  }

  /**
   * Generate general performance recommendations
   */
  private generateGeneralRecommendations(
    userExperienceMetrics: UserExperienceMetrics,
    context: OptimizationContext
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (userExperienceMetrics.performanceScore < 70) {
      recommendations.push({
        id: 'general_performance_audit',
        category: 'General',
        priority: 3,
        title: 'Comprehensive Performance Audit',
        description: 'Overall performance score is low. A comprehensive audit is recommended.',
        impact: 'medium',
        effort: 'low',
        estimatedImprovement: {
          metric: 'Performance Score',
          improvement: 15,
          unit: 'score'
        },
        implementation: {
          steps: [
            'Run Lighthouse performance audit',
            'Analyze bundle size and dependencies',
            'Review network requests and waterfall',
            'Check for unused code and assets'
          ],
          resources: [
            'https://developers.google.com/web/tools/lighthouse',
            'https://bundlephobia.com/'
          ],
          estimatedTime: '1-2 hours'
        },
        dependencies: [],
        tags: ['audit', 'analysis', 'general']
      })
    }

    return recommendations
  }

  /**
   * Generate Search Console specific recommendations
   */
  private generateSearchConsoleRecommendations(insights: SearchConsoleInsights): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    if (insights.mobile_vs_desktop.mobile_passing < 75) {
      recommendations.push({
        id: 'mobile_optimization_priority',
        category: 'General',
        priority: 1,
        title: 'Priority: Mobile Performance Optimization',
        description: 'Search Console shows poor mobile Core Web Vitals. Mobile optimization should be prioritized.',
        impact: 'critical',
        effort: 'high',
        estimatedImprovement: {
          metric: 'Mobile CWV Score',
          improvement: 25,
          unit: 'percentage'
        },
        implementation: {
          steps: [
            'Test on real mobile devices',
            'Optimize for slow connections (3G)',
            'Reduce JavaScript payload for mobile',
            'Implement mobile-first resource loading'
          ],
          resources: ['https://web.dev/mobile/'],
          estimatedTime: '6-12 hours'
        },
        dependencies: ['mobile_testing'],
        tags: ['mobile', 'search_console', 'critical']
      })
    }

    return recommendations
  }

  /**
   * Build optimization context from available data
   */
  private buildOptimizationContext(
    userExperienceMetrics: UserExperienceMetrics,
    resourceTimings?: ResourceTiming[]
  ): OptimizationContext {
    const deviceType = this.detectDeviceType()
    const connectionType = this.getConnectionType()
    const pageType = this.detectPageType()

    return {
      deviceType,
      connectionType,
      pageType,
      userBehavior: {
        scrollDepth: userExperienceMetrics.scrollDepth,
        interactionCount: userExperienceMetrics.interactionCount,
        timeOnPage: userExperienceMetrics.timeOnPage
      },
      technicalContext: {
        bundleSize: this.estimateBundleSize(resourceTimings),
        imageCount: this.countImages(resourceTimings),
        scriptCount: this.countScripts(resourceTimings),
        hasServiceWorker: 'serviceWorker' in navigator,
        hasCriticalCSS: this.hasCriticalCSS()
      }
    }
  }

  /**
   * Calculate performance gaps
   */
  private calculatePerformanceGaps(navigationMetrics: NavigationMetrics): Array<{
    metric: string
    current: number
    target: number
    gap: number
  }> {
    const targets = {
      'LCP': 2500,
      'INP': 200,
      'CLS': 0.1,
      'FCP': 1800,
      'TTFB': 800
    }

    return Object.entries(targets).map(([metric, target]) => {
      const current = (navigationMetrics as any)[metric.toLowerCase()]
      return {
        metric,
        current,
        target,
        gap: Math.max(0, current - target)
      }
    }).filter(gap => gap.gap > 0)
  }

  /**
   * Calculate optimization score
   */
  private calculateOptimizationScore(
    recommendations: OptimizationRecommendation[],
    currentScore: number
  ): number {
    const criticalIssues = recommendations.filter(r => r.impact === 'critical').length
    const highImpactIssues = recommendations.filter(r => r.impact === 'high').length
    
    // Score decreases based on critical and high impact issues
    let optimizationScore = 100
    optimizationScore -= criticalIssues * 20
    optimizationScore -= highImpactIssues * 10
    optimizationScore = Math.max(0, optimizationScore)
    
    return Math.round(optimizationScore)
  }

  /**
   * Generate competitor analysis
   */
  private generateCompetitorAnalysis(currentScore: number): OptimizationAnalysis['competitorAnalysis'] {
    // Simulated competitor data - would come from real industry benchmarks
    const industryAverage = 76
    const topPerformers = 92
    
    let ranking = 'Below Average'
    if (currentScore >= topPerformers - 5) ranking = 'Top Performer'
    else if (currentScore >= industryAverage + 5) ranking = 'Above Average'
    else if (currentScore >= industryAverage - 5) ranking = 'Average'
    
    return {
      yourScore: currentScore,
      industryAverage,
      topPerformers,
      ranking
    }
  }

  /**
   * Utility methods
   */
  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop'
    
    const userAgent = navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    return connection?.effectiveType || 'unknown'
  }

  private detectPageType(): 'homepage' | 'blog' | 'gallery' | 'contact' | 'generic' {
    if (typeof window === 'undefined') return 'generic'
    
    const path = window.location.pathname.toLowerCase()
    if (path === '/' || path === '/home') return 'homepage'
    if (path.includes('/blog')) return 'blog'
    if (path.includes('/gallery')) return 'gallery'
    if (path.includes('/contact')) return 'contact'
    return 'generic'
  }

  private estimateBundleSize(resourceTimings?: ResourceTiming[]): number {
    if (!resourceTimings) return 0
    return resourceTimings
      .filter(r => r.initiatorType === 'script')
      .reduce((sum, r) => sum + r.decodedBodySize, 0)
  }

  private countImages(resourceTimings?: ResourceTiming[]): number {
    if (!resourceTimings) return 0
    return resourceTimings.filter(r => r.initiatorType === 'img').length
  }

  private countScripts(resourceTimings?: ResourceTiming[]): number {
    if (!resourceTimings) return 0
    return resourceTimings.filter(r => r.initiatorType === 'script').length
  }

  private hasCriticalCSS(): boolean {
    if (typeof window === 'undefined') return false
    const styles = document.querySelectorAll('style')
    return styles.length > 0
  }

  private loadImplementationHistory(): void {
    if (typeof window === 'undefined') return
    
    try {
      const history = localStorage.getItem('cwv_optimization_implemented')
      if (history) {
        const implemented = JSON.parse(history)
        this.implementedRecommendations = new Set(implemented)
      }
    } catch (error) {
      console.warn('Failed to load optimization implementation history:', error)
    }
  }

  /**
   * Mark recommendation as implemented
   */
  markAsImplemented(recommendationId: string): void {
    this.implementedRecommendations.add(recommendationId)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cwv_optimization_implemented', 
          JSON.stringify(Array.from(this.implementedRecommendations))
        )
      } catch (error) {
        console.warn('Failed to save implementation status:', error)
      }
    }
    
    console.log(`✅ Marked optimization as implemented: ${recommendationId}`)
  }

  /**
   * Get optimization history
   */
  getOptimizationHistory(): OptimizationAnalysis[] {
    return this.optimizationHistory
  }

  /**
   * Clear implementation history
   */
  clearImplementationHistory(): void {
    this.implementedRecommendations.clear()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cwv_optimization_implemented')
    }
    console.log('🧹 Cleared optimization implementation history')
  }
}

export default CWVOptimizationEngine