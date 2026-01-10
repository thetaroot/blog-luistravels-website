/**
 * SEO Integration Manager - PHASE 5 SEO-PERFECTION-2025
 * Master coordinator for all SEO systems and Google dominance
 * SENIOR GOOGLE SEO DEV Level Implementation
 */

import { BlogPost } from '@/lib/blog/types'
import { SchemaGenerator } from '@/lib/seo/SchemaGenerator'
import { LocalSEOOptimizer } from '@/lib/seo/LocalSEOOptimizer'
import { SEOMetaGenerator } from '@/lib/seo/SEOMetaGenerator'
import { EntityExtractor } from '@/lib/seo/EntityExtractor'
import { TopicClusterManager } from '@/lib/seo/TopicClusterManager'
import { AdvancedSearchEngine } from '@/lib/search/AdvancedSearchEngine'
import { PerformanceOptimizer } from '@/lib/performance/PerformanceOptimizer'
import { Phase7PerformanceOptimizer } from '@/lib/performance/phase7-optimizer'
import { Phase8SEODominance } from '@/lib/seo/Phase8SEODominance'
import { Phase9QualityAssurance } from '@/lib/seo/Phase9QualityAssurance'

interface SEOIntegrationConfig {
  siteName: string
  siteUrl: string
  defaultImage: string
  twitterHandle: string
  authorName?: string
  authorUrl?: string
  logo?: string
  socialProfiles?: string[]
  organization?: any
  enableEntityExtraction?: boolean
  enableTopicClustering?: boolean
  enableLocalSEO?: boolean
  enablePerformanceOptimization?: boolean
  enableAdvancedSearch?: boolean
}

interface ComprehensiveSEOResult {
  post: {
    slug: string
    title: string
    optimizedTitle: string
    description: string
    optimizedDescription: string
  }
  schemas: object[]
  metaTags: any
  entities: any[]
  topicCluster?: string
  relatedPosts: any[]
  localOptimization: any
  performanceMetrics: any
  searchOptimization: any
  phase9QualityAssurance?: any
  recommendations: string[]
  processingTime: number
  score: number
}

export class SEOIntegrationManager {
  private schemaGenerator: SchemaGenerator
  private localSEOOptimizer: LocalSEOOptimizer  
  private metaGenerator: SEOMetaGenerator
  private entityExtractor: EntityExtractor
  private topicClusterManager: TopicClusterManager
  private searchEngine: AdvancedSearchEngine
  private performanceOptimizer: PerformanceOptimizer
  private phase7Optimizer: Phase7PerformanceOptimizer
  private phase8SEODominance: Phase8SEODominance
  private phase9QualityAssurance: Phase9QualityAssurance
  
  private isInitialized: boolean = false
  private processingQueue: Map<string, Promise<ComprehensiveSEOResult>> = new Map()
  private resultCache: Map<string, ComprehensiveSEOResult> = new Map()

  constructor(config: SEOIntegrationConfig) {
    console.log('🚀 Initializing SEO Integration Manager...')

    // Provide default values for required fields
    const fullConfig = {
      ...config,
      authorName: config.authorName || 'Luis Gunther',
      authorUrl: config.authorUrl || 'https://heretheregone.com',
      logo: config.logo || '/images/logo.png',
      socialProfiles: config.socialProfiles || [],
      organization: config.organization || {
        name: 'Here There & Gone',
        type: 'Organization'
      }
    }

    // Initialize all SEO components
    this.schemaGenerator = new SchemaGenerator(fullConfig as any)
    this.localSEOOptimizer = new LocalSEOOptimizer()
    this.metaGenerator = new SEOMetaGenerator(fullConfig as any)
    this.entityExtractor = new EntityExtractor()
    this.topicClusterManager = new TopicClusterManager()
    this.searchEngine = new AdvancedSearchEngine()
    
    this.performanceOptimizer = new PerformanceOptimizer({
      enableImageOptimization: config.enablePerformanceOptimization || false,
      enableLazyLoading: config.enablePerformanceOptimization || false,
      enableCriticalCSS: config.enablePerformanceOptimization || false,
      enableServiceWorker: config.enablePerformanceOptimization || false,
      enablePreloading: config.enablePerformanceOptimization || false,
      enableCompression: config.enablePerformanceOptimization || false,
      cacheStrategies: [
        { type: 'browser', ttl: 31536000, key: 'static', tags: ['static'] },
        { type: 'cdn', ttl: 3600, key: 'content', tags: ['content'] },
        { type: 'memory', ttl: 900, key: 'hot', tags: ['hot'] },
        { type: 'redis', ttl: 1800, key: 'api', tags: ['api'] }
      ]
    })

    // Initialize Phase 7 Performance Optimizer
    this.phase7Optimizer = new Phase7PerformanceOptimizer({
      enableAIOptimization: config.enablePerformanceOptimization || false,
      enableAdvancedCaching: true,
      enablePredictivePreloading: true,
      enableQuantumOptimization: config.enablePerformanceOptimization || false,
      aggressiveOptimizationMode: true,
      targetCoreWebVitalsScore: 95,
      maxOptimizationCycles: 10
    })

    // Initialize Phase 8 SEO Dominance Engine
    this.phase8SEODominance = new Phase8SEODominance({
      enableAdvancedRankingSignals: true,
      enableCompetitiveAnalysis: config.enableAdvancedSearch || false,
      enableSearchIntentOptimization: true,
      enableKnowledgeGraphSignals: true,
      enableLocalDominance: true,
      enableEATOptimization: config.enableAdvancedSearch || false,
      aggressiveSEOMode: true,
      targetSearchQueries: []
    })

    // Initialize Phase 9 Quality Assurance Engine
    this.phase9QualityAssurance = new Phase9QualityAssurance({
      enableAdvancedQualityChecks: true,
      enableAutomaticOptimization: config.enablePerformanceOptimization || false,
      enableCompetitiveValidation: true,
      enableRealTimeMonitoring: true,
      targetQualityThreshold: 95,
      strictModeEnabled: true,
      googleStandardsCompliance: true
    })
  }

  /**
   * Initialize all SEO systems with blog posts data
   */
  async initializeWithPosts(posts: BlogPost[]): Promise<void> {
    if (this.isInitialized) return

    console.log(`🔧 Initializing SEO systems with ${posts.length} posts...`)
    const startTime = Date.now()

    try {
      // Initialize search engine
      await this.searchEngine.initialize(posts)
      
      // Generate topic clusters
      const clusters = await this.topicClusterManager.generateClusters(posts)
      
      // Initialize search engine with clusters
      await this.searchEngine.initialize(posts, clusters)

      // Batch extract entities for all posts
      const entitiesMap = await this.entityExtractor.batchExtractEntities(posts)
      
      // Build knowledge graph
      await this.entityExtractor.buildKnowledgeGraph(entitiesMap)

      this.isInitialized = true
      const initTime = Date.now() - startTime
      
      console.log(`✅ SEO Integration Manager initialized in ${initTime}ms`)
      console.log(`📊 Systems ready: Search Engine, Topic Clusters, Entity Recognition, Knowledge Graph`)
      
    } catch (error) {
      console.error('❌ Failed to initialize SEO systems:', error)
      throw error
    }
  }

  /**
   * Comprehensive SEO optimization for a single blog post
   */
  async optimizePost(post: BlogPost, options?: {
    forceRefresh?: boolean
    includePerformance?: boolean
    includeAdvancedSearch?: boolean
  }): Promise<ComprehensiveSEOResult> {
    const opts = {
      forceRefresh: false,
      includePerformance: true,
      includeAdvancedSearch: true,
      ...options
    }

    // Check cache first
    const cacheKey = `${post.slug}-${JSON.stringify(opts)}`
    if (!opts.forceRefresh && this.resultCache.has(cacheKey)) {
      console.log(`📦 Using cached SEO result for: ${post.title}`)
      return this.resultCache.get(cacheKey)!
    }

    // Check if already processing
    if (this.processingQueue.has(cacheKey)) {
      console.log(`⏳ SEO optimization already in progress for: ${post.title}`)
      return await this.processingQueue.get(cacheKey)!
    }

    // Start new optimization process
    const optimizationPromise = this.performComprehensiveOptimization(post, opts)
    this.processingQueue.set(cacheKey, optimizationPromise)

    try {
      const result = await optimizationPromise
      
      // Cache the result
      this.resultCache.set(cacheKey, result)
      
      return result
    } finally {
      // Remove from processing queue
      this.processingQueue.delete(cacheKey)
    }
  }

  /**
   * Perform comprehensive SEO optimization
   */
  private async performComprehensiveOptimization(
    post: BlogPost, 
    options: any
  ): Promise<ComprehensiveSEOResult> {
    console.log(`🎯 Starting comprehensive SEO optimization for: ${post.title}`)
    const startTime = Date.now()
    
    const recommendations: string[] = []
    let score = 0

    // PHASE 1: Entity Extraction and Knowledge Graph
    console.log('🏷️ Phase 1: Entity extraction...')
    const entities = await this.entityExtractor.extractEntities(post)
    if (entities.length > 0) {
      score += 10
      recommendations.push(`Extracted ${entities.length} entities for enhanced SEO`)
    } else {
      recommendations.push('Consider adding more specific location and activity mentions')
    }

    // Update post with extracted entities
    post.entities = entities

    // PHASE 2: Topic Clustering  
    console.log('🎯 Phase 2: Topic clustering...')
    let topicCluster: string | undefined
    try {
      const clusters = await this.topicClusterManager.generateClusters([post])
      if (clusters.length > 0) {
        topicCluster = clusters[0].name
        post.topicCluster = topicCluster
        score += 10
        recommendations.push(`Assigned to topic cluster: ${topicCluster}`)
      }
    } catch (error) {
      console.warn('Topic clustering failed:', error)
      recommendations.push('Topic clustering could not be performed')
    }

    // PHASE 3: Schema Generation
    console.log('📋 Phase 3: Schema markup generation...')
    const schemas = this.schemaGenerator.generateBlogPostSchema(post)

    if (schemas.length > 0) {
      score += 15
      recommendations.push(`Generated ${schemas.length} schema markup types`)
    }

    // PHASE 4: Local SEO Optimization
    console.log('🌍 Phase 4: Local SEO optimization...')
    const localOptimization = await this.localSEOOptimizer.optimizeForLocalSEO(post)
    if (localOptimization.localKeywords.length > 0) {
      score += 15
      recommendations.push(`Optimized for ${localOptimization.localKeywords.length} local keywords`)
    }
    
    recommendations.push(...localOptimization.recommendations)

    // PHASE 5: Meta Tags Generation
    console.log('🏷️ Phase 5: Meta tags optimization...')
    const metaTags = this.metaGenerator.generateMetaTags(post, {
      includeEntityKeywords: true,
      optimizeForLocal: !!post.location,
      customKeywords: localOptimization.localKeywords
    })
    
    if (metaTags.title.length <= 60 && metaTags.description.length <= 160) {
      score += 15
      recommendations.push('Meta tags optimized for search engines')
    } else {
      recommendations.push('Consider shortening title or description for better SEO')
    }

    // PHASE 6: Related Posts & Recommendations
    console.log('🤖 Phase 6: Related content generation...')
    let relatedPosts: any[] = []
    if (options.includeAdvancedSearch) {
      try {
        const mlRecommendations = await this.searchEngine.getRecommendations(post.slug, 5)
        relatedPosts = mlRecommendations

        if (relatedPosts.length > 0) {
          score += 10
          recommendations.push(`Generated ${relatedPosts.length} ML-powered recommendations`)
        }
      } catch (error) {
        console.warn('Related posts generation failed:', error)
        recommendations.push('ML recommendations could not be generated')
      }
    }

    // PHASE 7: ADVANCED PERFORMANCE OPTIMIZATION (Google 10/10 Target)
    console.log('🌟 Phase 7: Google 10/10 Performance Optimization...')
    let performanceMetrics: any = {}
    if (options.includePerformance) {
      try {
        // First run standard performance optimization
        const standardPerformanceResult = await this.performanceOptimizer.optimizePagePerformance(
          post.slug, 
          post.content || ''
        )
        
        // Then run Phase 7 advanced optimization for Google 10/10
        console.log('🚀 Executing Phase 7 Advanced Optimization...')
        const phase7Metrics = await this.phase7Optimizer.optimizeToGoogle10Of10(
          post.slug,
          post.content || ''
        )
        
        performanceMetrics = {
          standard: standardPerformanceResult,
          phase7: phase7Metrics,
          finalScore: phase7Metrics.performanceScore,
          coreWebVitalsScore: phase7Metrics.coreWebVitalsScore,
          seoImpactScore: phase7Metrics.seoImpactScore,
          userExperienceScore: phase7Metrics.userExperienceScore,
          google10of10Achieved: phase7Metrics.performanceScore >= 95
        }
        
        // Score based on Phase 7 results
        if (phase7Metrics.performanceScore >= 95) {
          score += 25 // Maximum bonus for Google 10/10 achievement
          recommendations.push(`🏆 GOOGLE 10/10 ACHIEVED! Performance: ${phase7Metrics.performanceScore}/100`)
          recommendations.push(`⚡ Core Web Vitals Score: ${phase7Metrics.coreWebVitalsScore}/100`)
          recommendations.push(`🎯 SEO Impact Score: ${phase7Metrics.seoImpactScore}/100`)
        } else if (phase7Metrics.performanceScore >= 90) {
          score += 20
          recommendations.push(`🌟 Excellent Phase 7 performance: ${phase7Metrics.performanceScore}/100`)
        } else if (phase7Metrics.performanceScore >= 80) {
          score += 15
          recommendations.push(`⚡ Good Phase 7 performance: ${phase7Metrics.performanceScore}/100`)
        } else {
          score += 10
          recommendations.push('Phase 7 optimization needs further improvement for Google 10/10')
        }
        
        recommendations.push(`🔄 Optimized in ${phase7Metrics.optimizationCycles} cycles (${phase7Metrics.timeToOptimize}ms)`)
        
        // Add specific Core Web Vitals recommendations
        const vitals = phase7Metrics.improvements.after
        if (vitals.lcp > 2500) recommendations.push('LCP needs optimization: target ≤2.5s')
        if (vitals.inp > 200) recommendations.push('INP needs optimization: target ≤200ms for 2025 supremacy')
        if (vitals.cls > 0.1) recommendations.push('CLS needs optimization: target ≤0.1 for stability')
        
        recommendations.push(...standardPerformanceResult.recommendations)
        
      } catch (error) {
        console.warn('Phase 7 advanced optimization failed:', error)
        recommendations.push('Phase 7 advanced optimization could not be completed')
        
        // Fallback to standard optimization
        try {
          const fallbackResult = await this.performanceOptimizer.optimizePagePerformance(
            post.slug, 
            post.content || ''
          )
          performanceMetrics = { fallback: fallbackResult }
          score += 10
          recommendations.push('Fallback performance optimization completed')
        } catch (fallbackError) {
          console.warn('Fallback performance optimization also failed:', fallbackError)
          recommendations.push('All performance optimizations failed')
        }
      }
    }

    // PHASE 8: ADVANCED SEO DOMINANCE (Ultimate Search Engine Optimization)
    console.log('🔥 Phase 8: SEO Dominance - Ultimate Search Engine Optimization...')
    let searchOptimization: any = {}
    if (options.includeAdvancedSearch) {
      try {
        // Execute Phase 8 SEO Dominance
        console.log('🚀 Executing Phase 8 SEO Dominance Engine...')
        const dominanceResult = await this.phase8SEODominance.achieveSEODominance(post)
        
        searchOptimization = {
          // Legacy search optimization
          indexed: true,
          entityKeywords: entities.map(e => e.name),
          topicCluster,
          localKeywords: localOptimization.localKeywords,
          relatedPostsCount: relatedPosts.length,
          
          // Phase 8 SEO Dominance results
          dominanceMetrics: dominanceResult.dominanceMetrics,
          rankingSignals: dominanceResult.searchOptimization.rankingSignals,
          competitiveAdvantage: dominanceResult.searchOptimization.competitiveAdvantage,
          targetQueries: dominanceResult.searchOptimization.targetQueries,
          keywordOpportunities: dominanceResult.keywordOpportunities,
          knowledgeGraphSignals: dominanceResult.searchOptimization.knowledgeGraphSignals,
          eatOptimization: dominanceResult.searchOptimization.eatOptimization,
          localDominanceFactors: dominanceResult.searchOptimization.localDominanceFactors,
          seoDominanceAchieved: dominanceResult.dominanceMetrics.seoScore >= 90
        }
        
        // Score based on Phase 8 SEO Dominance results
        if (dominanceResult.dominanceMetrics.seoScore >= 90) {
          score += 30 // Maximum bonus for SEO dominance achievement
          recommendations.push(`🔥 SEO DOMINANCE ACHIEVED! Score: ${dominanceResult.dominanceMetrics.seoScore}/100`)
          recommendations.push(`⚔️ Competitive Score: ${dominanceResult.dominanceMetrics.competitiveScore}/100`)
          recommendations.push(`📈 Search Visibility: ${dominanceResult.dominanceMetrics.searchVisibilityScore}/100`)
          recommendations.push(`🎯 Authority Score: ${dominanceResult.dominanceMetrics.authorityScore}/100`)
        } else if (dominanceResult.dominanceMetrics.seoScore >= 80) {
          score += 25
          recommendations.push(`🌟 Strong SEO position achieved: ${dominanceResult.dominanceMetrics.seoScore}/100`)
        } else if (dominanceResult.dominanceMetrics.seoScore >= 70) {
          score += 20
          recommendations.push(`⚡ Good SEO foundation: ${dominanceResult.dominanceMetrics.seoScore}/100`)
        } else {
          score += 15
          recommendations.push('Phase 8 SEO optimization needs further improvement for market dominance')
        }
        
        // Add top actionable recommendations
        const topRecommendations = dominanceResult.actionableRecommendations.slice(0, 5)
        recommendations.push(...topRecommendations)
        
        // Add keyword opportunity insights
        const topOpportunities = dominanceResult.keywordOpportunities.slice(0, 3)
        topOpportunities.forEach(opp => {
          recommendations.push(`💎 High-opportunity keyword: "${opp.keyword}" (${opp.searchVolume} searches, ${opp.opportunity}% potential)`)
        })
        
        // Add competitive advantages
        if (dominanceResult.searchOptimization.competitiveAdvantage?.advantages?.length > 0) {
          recommendations.push(`⚔️ Competitive advantages: ${dominanceResult.searchOptimization.competitiveAdvantage.advantages.slice(0, 2).join(', ')}`)
        }
        
        console.log(`🏆 Phase 8 SEO Dominance completed: ${dominanceResult.dominanceMetrics.seoScore}/100`)
        
      } catch (error) {
        console.warn('Phase 8 SEO dominance failed:', error)
        recommendations.push('Phase 8 SEO dominance could not be completed')
        
        // Fallback to basic search optimization
        searchOptimization = {
          indexed: true,
          entityKeywords: entities.map(e => e.name),
          topicCluster,
          localKeywords: localOptimization.localKeywords,
          relatedPostsCount: relatedPosts.length,
          fallback: true
        }
        
        score += 10
        recommendations.push('Basic search engine optimization completed (Phase 8 fallback)')
      }
    }

    // PHASE 9: ADVANCED QUALITY ASSURANCE & FINAL OPTIMIZATION (Google 10/10 Target)
    console.log('🎯 Phase 9: Advanced Quality Assurance & Final Optimization...')
    let phase9Result: any = {}
    
    try {
      // Execute comprehensive Phase 9 quality assurance
      console.log('🔥 Executing Phase 9 Quality Assurance Engine...')
      phase9Result = await this.phase9QualityAssurance.executePhase9QualityAssurance(
        post,
        searchOptimization.dominanceMetrics ? { dominanceMetrics: searchOptimization.dominanceMetrics } : {},
        performanceMetrics.phase7 || performanceMetrics.standard || {}
      )
      
      // Override score with Phase 9 final score (most accurate)
      score = phase9Result.finalScore
      
      // Add Phase 9 specific recommendations
      if (phase9Result.google10of10Achieved) {
        recommendations.push('🏆 GOOGLE 10/10 ACHIEVED! This post has reached SEO perfection!')
        recommendations.push(`🌟 Quality Grade: ${phase9Result.qualityMetrics.overallQualityGrade}`)
        recommendations.push(`⚔️ Competitive Position: ${phase9Result.competitivePosition}`)
      } else {
        recommendations.push(`📊 Phase 9 Score: ${phase9Result.finalScore}/100 (Google 10/10 target)`)
        recommendations.push(`🔧 ${100 - phase9Result.finalScore} points needed for Google 10/10`)
        
        // Add critical recommendations from Phase 9
        const criticalRecs = phase9Result.optimizationPlan
          .filter((rec: any) => rec.priority === 'critical')
          .slice(0, 3)
        criticalRecs.forEach((rec: any) => {
          recommendations.push(`🚨 Critical: ${rec.action}`)
        })
      }
      
      // Add quality metrics breakdown
      recommendations.push(`📈 SEO: ${phase9Result.qualityMetrics.seoScore}/100, Performance: ${phase9Result.qualityMetrics.performanceScore}/100`)
      recommendations.push(`♿ Accessibility: ${phase9Result.qualityMetrics.accessibilityScore}/100, UX: ${phase9Result.qualityMetrics.userExperienceScore}/100`)
      
      // Future-proof rating
      recommendations.push(`🚀 Future-proof rating: ${phase9Result.futureProofRating}/100`)
      
      console.log(`🏆 Phase 9 completed: ${phase9Result.google10of10Achieved ? 'GOOGLE 10/10 ACHIEVED!' : `${phase9Result.finalScore}/100`}`)
      
    } catch (error) {
      console.warn('Phase 9 quality assurance failed:', error)
      recommendations.push('Phase 9 quality assurance could not be completed')
      
      // Fallback to basic scoring
      if (post.location) score += 5
      if (post.coordinates) score += 5
      if (post.gallery && post.gallery.length > 0) score += 5
      if (post.tags.length >= 3) score += 5
      if (post.readingTime) score += 5
      
      // Cap score at 100
      score = Math.min(score, 100)
    }

    const processingTime = Date.now() - startTime

    // Generate optimized title and description
    const optimizedTitle = this.optimizeTitle(post.title, entities, localOptimization.localKeywords)
    const optimizedDescription = this.optimizeDescription(post.excerpt, entities, localOptimization.localKeywords)

    const result: ComprehensiveSEOResult = {
      post: {
        slug: post.slug,
        title: post.title,
        optimizedTitle,
        description: post.excerpt,
        optimizedDescription
      },
      schemas,
      metaTags,
      entities,
      topicCluster,
      relatedPosts,
      localOptimization,
      performanceMetrics,
      searchOptimization,
      phase9QualityAssurance: phase9Result,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      processingTime,
      score
    }

    console.log(`✅ Comprehensive SEO optimization completed in ${processingTime}ms`)
    console.log(`📊 Final SEO Score: ${score}/100`)

    return result
  }

  /**
   * Batch optimize multiple posts
   */
  async batchOptimizePosts(
    posts: BlogPost[], 
    options?: {
      batchSize?: number
      includePerformance?: boolean
      includeAdvancedSearch?: boolean
    }
  ): Promise<ComprehensiveSEOResult[]> {
    const opts = {
      batchSize: 10,
      includePerformance: true,
      includeAdvancedSearch: true,
      ...options
    }

    console.log(`🔄 Starting batch SEO optimization for ${posts.length} posts...`)
    const startTime = Date.now()
    
    const results: ComprehensiveSEOResult[] = []
    
    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < posts.length; i += opts.batchSize) {
      const batch = posts.slice(i, i + opts.batchSize)
      console.log(`📦 Processing batch ${Math.floor(i / opts.batchSize) + 1}/${Math.ceil(posts.length / opts.batchSize)}`)
      
      const batchPromises = batch.map(post => 
        this.optimizePost(post, {
          includePerformance: opts.includePerformance,
          includeAdvancedSearch: opts.includeAdvancedSearch
        })
      )
      
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      
      // Small delay between batches to prevent resource exhaustion
      if (i + opts.batchSize < posts.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    const totalTime = Date.now() - startTime
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length

    console.log(`✅ Batch optimization completed in ${totalTime}ms`)
    console.log(`📊 Average SEO Score: ${averageScore.toFixed(1)}/100`)
    console.log(`🎯 Best performing post: ${results.sort((a, b) => b.score - a.score)[0]?.post.title}`)

    return results
  }

  /**
   * Generate comprehensive SEO report
   */
  async generateSEOReport(posts: BlogPost[]): Promise<{
    overview: any
    topPerforming: ComprehensiveSEOResult[]
    needsImprovement: ComprehensiveSEOResult[]
    recommendations: string[]
    systemStatus: any
  }> {
    console.log('📋 Generating comprehensive SEO report...')
    
    // Optimize all posts
    const results = await this.batchOptimizePosts(posts, { batchSize: 5 })
    
    // Calculate overview metrics
    const totalPosts = results.length
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalPosts
    const postsWithEntities = results.filter(r => r.entities.length > 0).length
    const postsWithClusters = results.filter(r => r.topicCluster).length
    const postsWithLocalSEO = results.filter(r => r.localOptimization.localKeywords.length > 0).length

    // Get top and bottom performers
    const sortedByScore = results.sort((a, b) => b.score - a.score)
    const topPerforming = sortedByScore.slice(0, 10)
    const needsImprovement = sortedByScore.slice(-10).reverse()

    // Generate recommendations
    const recommendations = this.generateSystemRecommendations(results)

    // System status
    const systemStatus = {
      initialized: this.isInitialized,
      componentsActive: {
        schemaGenerator: !!this.schemaGenerator,
        localSEOOptimizer: !!this.localSEOOptimizer,
        metaGenerator: !!this.metaGenerator,
        entityExtractor: !!this.entityExtractor,
        topicClusterManager: !!this.topicClusterManager,
        searchEngine: !!this.searchEngine,
        performanceOptimizer: !!this.performanceOptimizer
      },
      cacheStats: {
        resultsInCache: this.resultCache.size,
        activeProcessing: this.processingQueue.size
      }
    }

    return {
      overview: {
        totalPosts,
        averageScore: Math.round(averageScore * 10) / 10,
        postsWithEntities,
        postsWithClusters,
        postsWithLocalSEO,
        entityCoverage: Math.round((postsWithEntities / totalPosts) * 100),
        clusterCoverage: Math.round((postsWithClusters / totalPosts) * 100),
        localSEOCoverage: Math.round((postsWithLocalSEO / totalPosts) * 100)
      },
      topPerforming,
      needsImprovement,
      recommendations,
      systemStatus
    }
  }

  // Helper methods

  private optimizeTitle(originalTitle: string, entities: any[], localKeywords: string[]): string {
    let optimizedTitle = originalTitle
    
    // Add location if not present and available
    const locationEntity = entities.find(e => e.type === 'Place')
    if (locationEntity && !optimizedTitle.toLowerCase().includes(locationEntity.name.toLowerCase())) {
      if (optimizedTitle.length + locationEntity.name.length + 3 <= 60) {
        optimizedTitle = `${optimizedTitle} - ${locationEntity.name}`
      }
    }

    return optimizedTitle
  }

  private optimizeDescription(originalDescription: string, entities: any[], localKeywords: string[]): string {
    let optimizedDescription = originalDescription
    
    // Add location context if not present
    const locationEntity = entities.find(e => e.type === 'Place')
    if (locationEntity && !optimizedDescription.toLowerCase().includes(locationEntity.name.toLowerCase())) {
      const locationPhrase = ` Discover ${locationEntity.name} like a local.`
      if (optimizedDescription.length + locationPhrase.length <= 160) {
        optimizedDescription += locationPhrase
      }
    }

    return optimizedDescription.substring(0, 160)
  }

  private generateSystemRecommendations(results: ComprehensiveSEOResult[]): string[] {
    const recommendations: string[] = []
    
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length
    const lowScorePosts = results.filter(r => r.score < 70).length
    const noEntitiesPosts = results.filter(r => r.entities.length === 0).length
    const noClusterPosts = results.filter(r => !r.topicCluster).length

    if (averageScore < 80) {
      recommendations.push('Overall SEO score needs improvement - focus on meta optimization and content enhancement')
    }

    if (lowScorePosts > results.length * 0.2) {
      recommendations.push(`${lowScorePosts} posts have low SEO scores - prioritize optimization for these posts`)
    }

    if (noEntitiesPosts > results.length * 0.3) {
      recommendations.push('Many posts lack entity recognition - add more specific location and activity mentions')
    }

    if (noClusterPosts > results.length * 0.4) {
      recommendations.push('Improve topic clustering by creating more focused content themes')
    }

    return recommendations
  }

  /**
   * Clear all caches and reset system
   */
  clearCaches(): void {
    this.resultCache.clear()
    this.processingQueue.clear()
    this.entityExtractor.clearCache()
    this.performanceOptimizer.clearCache()
    console.log('🧹 All SEO integration caches cleared')
  }

  /**
   * Get system statistics
   */
  getSystemStats(): object {
    return {
      initialized: this.isInitialized,
      cachedResults: this.resultCache.size,
      activeProcessing: this.processingQueue.size,
      components: {
        entityExtractor: this.entityExtractor.getExtractionStats(),
        topicClusters: this.topicClusterManager.getClusterStats(),
        searchEngine: this.searchEngine.getStats(),
        performance: this.performanceOptimizer.getOptimizationStats()
      },
      lastActivity: new Date().toISOString()
    }
  }
}