/**
 * Phase 8 CLI Command - SEO DOMINANCE ENGINE
 * SEO-PERFECTION-2025 Command Line Interface
 * Execute Phase 8 SEO dominance from terminal
 */

import { Phase8SEODominance } from '../seo/Phase8SEODominance'
import { SEOIntegrationManager } from '../integration/SEOIntegrationManager'
import { getBlogPost, listBlogPosts } from '../blog/api'

interface Phase8CLIOptions {
  post?: string
  batch?: boolean
  aggressive?: boolean
  targetQueries?: string[]
  competitive?: boolean
  local?: boolean
  eat?: boolean
  verbose?: boolean
}

export class Phase8CLI {
  private phase8Engine: Phase8SEODominance
  private seoManager: SEOIntegrationManager

  constructor() {
    // Initialize Phase 8 SEO Dominance Engine with aggressive settings for CLI
    this.phase8Engine = new Phase8SEODominance({
      enableAdvancedRankingSignals: true,
      enableCompetitiveAnalysis: true,
      enableSearchIntentOptimization: true,
      enableKnowledgeGraphSignals: true,
      enableLocalDominance: true,
      enableEATOptimization: true,
      aggressiveSEOMode: true,
      targetSearchQueries: []
    })

    // Initialize SEO Integration Manager
    this.seoManager = new SEOIntegrationManager({
      siteName: 'Here There & Gone',
      siteUrl: 'https://heretheregone.com',
      defaultImage: '/images/og-default.jpg',
      twitterHandle: '@heretheregone',
      enablePerformanceOptimization: true,
      enableAdvancedSEO: true,
      enableMLRecommendations: true
    })
  }

  /**
   * Execute Phase 8 SEO dominance command
   */
  async executePhase8(options: Phase8CLIOptions = {}): Promise<void> {
    console.log('🔥 PHASE 8 CLI: SEO Dominance Engine')
    console.log('═'.repeat(60))
    
    const startTime = Date.now()

    try {
      if (options.batch) {
        await this.executeBatchDominance(options)
      } else if (options.post) {
        await this.executeSinglePostDominance(options.post, options)
      } else {
        await this.showPhase8Status()
      }
    } catch (error) {
      console.error('❌ Phase 8 CLI execution failed:', error)
      process.exit(1)
    }

    const totalTime = Date.now() - startTime
    console.log(`\n✅ Phase 8 CLI completed in ${totalTime}ms`)
    console.log('═'.repeat(60))
  }

  /**
   * Execute single post SEO dominance
   */
  private async executeSinglePostDominance(postSlug: string, options: Phase8CLIOptions): Promise<void> {
    console.log(`🔥 Achieving SEO dominance for: ${postSlug}`)
    console.log(`⚔️ Competitive Analysis: ${options.competitive !== false ? 'Enabled' : 'Disabled'}`)
    console.log(`🌍 Local Dominance: ${options.local !== false ? 'Enabled' : 'Disabled'}`)
    console.log(`🎓 E-A-T Optimization: ${options.eat !== false ? 'Enabled' : 'Disabled'}`)
    console.log(`🎯 Aggressive Mode: ${options.aggressive !== false ? 'Enabled' : 'Disabled'}`)
    if (options.targetQueries && options.targetQueries.length > 0) {
      console.log(`🎯 Target Queries: ${options.targetQueries.join(', ')}`)
    }
    console.log('')

    // Get blog post
    const post = await getBlogPost(postSlug)
    if (!post) {
      console.error(`❌ Post not found: ${postSlug}`)
      return
    }

    // Execute Phase 8 SEO dominance
    const dominanceResult = await this.phase8Engine.achieveSEODominance(post)

    // Display results
    this.displaySEODominanceResults(postSlug, dominanceResult)

    // Execute full SEO integration if requested
    if (options.verbose) {
      console.log('\n🔄 Running full SEO integration with Phase 8...')
      const seoResult = await this.seoManager.optimizePost(post, {
        includePerformance: true,
        includeAdvancedSearch: true
      })
      
      console.log(`📊 Overall SEO Score: ${seoResult.score}/100`)
      console.log(`⏱️  Processing Time: ${seoResult.processingTime}ms`)
      console.log(`💡 Total Recommendations: ${seoResult.recommendations.length}`)
    }
  }

  /**
   * Execute batch SEO dominance for all posts
   */
  private async executeBatchDominance(options: Phase8CLIOptions): Promise<void> {
    console.log('🔥 BATCH SEO DOMINANCE: Achieving dominance for all posts')
    console.log('')

    const posts = await listBlogPosts()
    const totalPosts = posts.length
    
    console.log(`📦 Processing ${totalPosts} posts for SEO dominance...`)
    console.log('')

    const results = []
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const progress = ((i + 1) / totalPosts * 100).toFixed(1)
      
      console.log(`[${i + 1}/${totalPosts}] (${progress}%) Achieving dominance: ${post.slug}`)
      
      try {
        const dominanceResult = await this.phase8Engine.achieveSEODominance(post)
        
        results.push({
          slug: post.slug,
          success: true,
          seoScore: dominanceResult.dominanceMetrics.seoScore,
          competitiveScore: dominanceResult.dominanceMetrics.competitiveScore,
          searchVisibility: dominanceResult.dominanceMetrics.searchVisibilityScore,
          authorityScore: dominanceResult.dominanceMetrics.authorityScore,
          keywordOpportunities: dominanceResult.keywordOpportunities.length,
          time: dominanceResult.processingTime
        })
        
        const status = dominanceResult.dominanceMetrics.seoScore >= 90 ? '🔥' : 
                      dominanceResult.dominanceMetrics.seoScore >= 80 ? '⚡' : 
                      dominanceResult.dominanceMetrics.seoScore >= 70 ? '🌟' : '📈'
        console.log(`  ${status} SEO Score: ${dominanceResult.dominanceMetrics.seoScore}/100 | Competitive: ${dominanceResult.dominanceMetrics.competitiveScore}/100`)
        
      } catch (error) {
        results.push({
          slug: post.slug,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        console.log(`  ❌ Failed: ${error}`)
      }
      
      console.log('')
    }

    // Display batch summary
    this.displayBatchDominanceSummary(results)
  }

  /**
   * Show Phase 8 status and capabilities
   */
  private async showPhase8Status(): Promise<void> {
    console.log('🔥 PHASE 8 STATUS & CAPABILITIES')
    console.log('')
    
    console.log('🎯 SEO Dominance Targets:')
    console.log('  • SEO Score: 90-100/100 (Market dominance)')
    console.log('  • Competitive Score: 85+ (Beat competitors)')
    console.log('  • Search Visibility: 95+ (Maximum visibility)')
    console.log('  • Authority Score: 85+ (Industry authority)')
    console.log('  • Ranking Potential: 95+ (Top rankings)')
    console.log('')
    
    console.log('🔥 Phase 8 SEO Dominance Features:')
    console.log('  🎯 Advanced Search Intent Analysis')
    console.log('  ⚔️ Competitive Intelligence Gathering')
    console.log('  🧠 Knowledge Graph Signal Optimization')
    console.log('  🌍 Local Dominance Optimization')
    console.log('  🎓 E-A-T (Expertise, Authoritativeness, Trustworthiness)')
    console.log('  🎯 Target Query Optimization')
    console.log('  📊 Advanced Ranking Signals Calculation')
    console.log('  💎 Keyword Opportunity Discovery')
    console.log('  📈 SEO Dominance Metrics')
    console.log('  💡 Actionable Recommendations')
    console.log('')
    
    console.log('🛠️  Available Commands:')
    console.log('  npm run phase8 --post=blog-post-slug       # Achieve dominance for single post')
    console.log('  npm run phase8 --batch                     # Batch dominance optimization')
    console.log('  npm run phase8 --post=slug --verbose       # Detailed optimization')
    console.log('  npm run phase8 --post=slug --queries=q1,q2 # Target specific queries')
    console.log('  npm run phase8 --aggressive=false          # Disable aggressive mode')
    console.log('')
    
    console.log('📈 Expected SEO Dominance Results:')
    console.log('  • 25-35 point SEO score improvement')
    console.log('  • Market leader positioning')
    console.log('  • Competitive advantage establishment')
    console.log('  • 10-20 high-value keyword opportunities')
    console.log('  • Authority signal enhancement')
    console.log('  • Search intent optimization')
    console.log('')
    
    console.log('🔥 Ready to achieve SEO dominance!')
  }

  /**
   * Display SEO dominance results
   */
  private displaySEODominanceResults(postSlug: string, result: any): void {
    console.log('🔥 PHASE 8 SEO DOMINANCE RESULTS')
    console.log('─'.repeat(50))
    console.log(`📄 Post: ${postSlug}`)
    console.log(`🔥 SEO Score: ${result.dominanceMetrics.seoScore}/100`)
    console.log(`⚔️ Competitive Score: ${result.dominanceMetrics.competitiveScore}/100`)
    console.log(`📈 Search Visibility: ${result.dominanceMetrics.searchVisibilityScore}/100`)
    console.log(`🎯 Authority Score: ${result.dominanceMetrics.authorityScore}/100`)
    console.log(`🚀 Ranking Potential: ${result.dominanceMetrics.rankingPotential}/100`)
    console.log(`⏱️  Processing Time: ${result.processingTime}ms`)
    console.log('')
    
    if (result.dominanceMetrics.seoScore >= 90) {
      console.log('🔥 SEO DOMINANCE ACHIEVED!')
    } else if (result.dominanceMetrics.seoScore >= 80) {
      console.log(`⚡ Strong SEO Position: ${result.dominanceMetrics.seoScore}/100`)
    } else {
      console.log(`📈 SEO Progress: ${result.dominanceMetrics.seoScore}/100 (Target: 90+)`)
    }
    
    console.log('')
    console.log('📊 Ranking Signals:')
    const signals = result.searchOptimization.rankingSignals
    console.log(`  Content Quality: ${signals.contentQuality}/100`)
    console.log(`  Topical Authority: ${signals.topicalAuthority}/100`)
    console.log(`  Entity Relevance: ${signals.entityRelevance}/100`)
    console.log(`  Search Intent Match: ${signals.searchIntentMatch}/100`)
    console.log(`  Technical SEO: ${signals.technicalSEO}/100`)
    console.log(`  E-A-T Signals: ${signals.eatSignals}/100`)
    
    if (result.keywordOpportunities.length > 0) {
      console.log('')
      console.log('💎 Top Keyword Opportunities:')
      result.keywordOpportunities.slice(0, 5).forEach((kw: any, index: number) => {
        console.log(`  ${index + 1}. "${kw.keyword}" (${kw.searchVolume} searches, ${kw.opportunity}% potential)`)
      })
    }
    
    if (result.actionableRecommendations.length > 0) {
      console.log('')
      console.log('💡 Top Recommendations:')
      result.actionableRecommendations.slice(0, 5).forEach((rec: string, index: number) => {
        console.log(`  ${index + 1}. ${rec}`)
      })
    }
  }

  /**
   * Display batch dominance summary
   */
  private displayBatchDominanceSummary(results: any[]): void {
    console.log('🔥 BATCH SEO DOMINANCE SUMMARY')
    console.log('─'.repeat(50))
    
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    const dominanceAchieved = successful.filter(r => r.seoScore >= 90)
    const strongPosition = successful.filter(r => r.seoScore >= 80 && r.seoScore < 90)
    
    console.log(`📦 Total Posts: ${results.length}`)
    console.log(`✅ Successful: ${successful.length}`)
    console.log(`❌ Failed: ${failed.length}`)
    console.log(`🔥 SEO Dominance Achieved: ${dominanceAchieved.length}`)
    console.log(`⚡ Strong SEO Position: ${strongPosition.length}`)
    console.log('')
    
    if (successful.length > 0) {
      const avgSEOScore = successful.reduce((sum, r) => sum + r.seoScore, 0) / successful.length
      const avgCompetitiveScore = successful.reduce((sum, r) => sum + r.competitiveScore, 0) / successful.length
      const avgSearchVisibility = successful.reduce((sum, r) => sum + r.searchVisibility, 0) / successful.length
      const avgAuthorityScore = successful.reduce((sum, r) => sum + r.authorityScore, 0) / successful.length
      const totalKeywordOpportunities = successful.reduce((sum, r) => sum + r.keywordOpportunities, 0)
      const avgTime = successful.reduce((sum, r) => sum + r.time, 0) / successful.length
      
      console.log('📈 Average Results:')
      console.log(`  SEO Score: ${avgSEOScore.toFixed(1)}/100`)
      console.log(`  Competitive Score: ${avgCompetitiveScore.toFixed(1)}/100`)
      console.log(`  Search Visibility: ${avgSearchVisibility.toFixed(1)}/100`)
      console.log(`  Authority Score: ${avgAuthorityScore.toFixed(1)}/100`)
      console.log(`  Keyword Opportunities: ${totalKeywordOpportunities}`)
      console.log(`  Processing Time: ${avgTime.toFixed(0)}ms`)
      console.log('')
    }
    
    if (dominanceAchieved.length > 0) {
      console.log('🔥 SEO Dominance Achievements:')
      dominanceAchieved.forEach(result => {
        console.log(`  • ${result.slug}: ${result.seoScore}/100 (${result.keywordOpportunities} opportunities)`)
      })
      console.log('')
    }
    
    if (failed.length > 0) {
      console.log('❌ Failed Optimizations:')
      failed.forEach(result => {
        console.log(`  • ${result.slug}: ${result.error}`)
      })
    }
  }
}

/**
 * CLI Entry Point
 */
export async function runPhase8CLI(args: string[]): Promise<void> {
  const options: Phase8CLIOptions = {}
  
  // Parse command line arguments
  args.forEach(arg => {
    if (arg.startsWith('--post=')) {
      options.post = arg.split('=')[1]
    } else if (arg === '--batch') {
      options.batch = true
    } else if (arg === '--verbose') {
      options.verbose = true
    } else if (arg.startsWith('--queries=')) {
      options.targetQueries = arg.split('=')[1].split(',')
    } else if (arg === '--aggressive=false') {
      options.aggressive = false
    } else if (arg === '--competitive=false') {
      options.competitive = false
    } else if (arg === '--local=false') {
      options.local = false
    } else if (arg === '--eat=false') {
      options.eat = false
    }
  })
  
  const cli = new Phase8CLI()
  await cli.executePhase8(options)
}

// Export for npm script usage
if (require.main === module) {
  runPhase8CLI(process.argv.slice(2)).catch(console.error)
}