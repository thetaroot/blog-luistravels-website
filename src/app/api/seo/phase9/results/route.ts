/**
 * Phase 9 Results API Endpoint
 * SENIOR GOOGLE SEO DEV Level - Real-time Google 10/10 Results Monitoring
 * 
 * 🎯 ENDPOINT: GET /api/seo/phase9/results
 * 🔥 PURPOSE: Retrieve comprehensive Phase 9 quality assurance results
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog'
import { SEOIntegrationManager } from '@/lib/integration/SEOIntegrationManager'

const seoManager = new SEOIntegrationManager({
  siteName: 'Here There & Gone',
  siteUrl: 'https://heretheregone.com',
  defaultImage: '/images/default-blog.jpg',
  twitterHandle: '@heretheregone',
  authorName: 'Luis Gunther',
  authorUrl: 'https://heretheregone.com',
  logo: '/images/logo.png',
  socialProfiles: [
    'https://instagram.com/lu.is.gone',
    'https://pinterest.com/heretheregone',
    'https://ko-fi.com/heretheregone'
  ],
  organization: {
    name: 'Here There & Gone',
    type: 'Organization'
  },
  enableEntityExtraction: true,
  enableTopicClustering: true,
  enableLocalSEO: true,
  enablePerformanceOptimization: true,
  enableAdvancedSearch: true
})

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const sort = searchParams.get('sort') || 'score'
    const filter = searchParams.get('filter') || 'all'
    const includeDetails = searchParams.get('details') === 'true'

    console.log(`🔍 Phase 9 Results Request - Limit: ${limit}, Sort: ${sort}, Filter: ${filter}`)

    // Get all blog posts
    const posts = await getBlogPosts()
    
    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        stats: {
          total: 0,
          google10of10: 0,
          averageScore: 0,
          processingTime: Date.now() - startTime
        }
      })
    }

    // Initialize SEO manager
    await seoManager.initializeWithPosts(posts)

    // Process posts with Phase 9 optimization (use cached results when possible)
    const results = []
    const limitedPosts = posts.slice(0, Math.min(limit, posts.length))
    
    for (const post of limitedPosts) {
      try {
        // Execute optimization with caching
        const optimizationResult = await seoManager.optimizePost(post, {
          forceRefresh: false, // Use cache for better performance
          includePerformance: true,
          includeAdvancedSearch: true
        })

        const phase9Result = optimizationResult.phase9QualityAssurance

        if (phase9Result) {
          const result = {
            post: {
              slug: post.slug,
              title: post.title,
              url: `https://heretheregone.com/blog/${post.slug}`,
              excerpt: post.excerpt?.substring(0, 150) + '...',
              lastModified: post.modifiedDate || post.date
            },
            qualityMetrics: {
              seoScore: phase9Result.qualityMetrics.seoScore,
              performanceScore: phase9Result.qualityMetrics.performanceScore,
              accessibilityScore: phase9Result.qualityMetrics.accessibilityScore,
              userExperienceScore: phase9Result.qualityMetrics.userExperienceScore,
              technicalQualityScore: phase9Result.qualityMetrics.technicalQualityScore,
              contentQualityScore: phase9Result.qualityMetrics.contentQualityScore,
              competitiveAdvantageScore: phase9Result.qualityMetrics.competitiveAdvantageScore,
              futureProofScore: phase9Result.qualityMetrics.futureProofScore,
              overallQualityGrade: phase9Result.qualityMetrics.overallQualityGrade
            },
            finalScore: phase9Result.finalScore,
            google10of10Achieved: phase9Result.google10of10Achieved,
            competitivePosition: phase9Result.competitivePosition,
            futureProofRating: phase9Result.futureProofRating,
            processingTime: phase9Result.processingTime,
            lastOptimized: phase9Result.lastOptimized,
            nextOptimizationDue: phase9Result.nextOptimizationDue,
            
            // Validation summary
            validation: {
              passed: phase9Result.validation.passed,
              score: phase9Result.validation.score,
              criticalFailures: phase9Result.validation.criticalFailures,
              warnings: phase9Result.validation.warnings.slice(0, 3),
              improvements: phase9Result.validation.improvements.slice(0, 3)
            },
            
            // Top optimization opportunities
            optimizationPlan: phase9Result.optimizationPlan
              .filter((plan: any) => plan.priority === 'critical' || plan.priority === 'high')
              .slice(0, 5)
              .map((plan: any) => ({
                priority: plan.priority,
                category: plan.category,
                action: plan.action,
                expectedImprovement: plan.expectedImprovement,
                difficulty: plan.difficulty,
                roi: plan.roi
              }))
          }

          // Include detailed data if requested
          if (includeDetails) {
            result.details = {
              fullOptimizationPlan: phase9Result.optimizationPlan,
              fullValidation: phase9Result.validation,
              recommendations: optimizationResult.recommendations,
              entities: optimizationResult.entities,
              schemas: optimizationResult.schemas?.length || 0,
              performanceMetrics: optimizationResult.performanceMetrics
            }
          }

          results.push(result)
        }
      } catch (error) {
        console.warn(`Failed to process post ${post.slug}:`, error)
        // Continue with other posts
      }
    }

    // Apply filters
    let filteredResults = results
    if (filter === 'google10of10') {
      filteredResults = results.filter(r => r.google10of10Achieved)
    } else if (filter === 'needs-improvement') {
      filteredResults = results.filter(r => !r.google10of10Achieved && r.finalScore < 90)
    } else if (filter === 'high-performers') {
      filteredResults = results.filter(r => r.finalScore >= 90)
    }

    // Apply sorting
    filteredResults.sort((a, b) => {
      switch (sort) {
        case 'score':
          return b.finalScore - a.finalScore
        case 'title':
          return a.post.title.localeCompare(b.post.title)
        case 'date':
          return new Date(b.lastOptimized).getTime() - new Date(a.lastOptimized).getTime()
        case 'competitive':
          return b.qualityMetrics.competitiveAdvantageScore - a.qualityMetrics.competitiveAdvantageScore
        default:
          return b.finalScore - a.finalScore
      }
    })

    // Calculate comprehensive statistics
    const stats = {
      total: results.length,
      totalPosts: posts.length,
      google10of10: results.filter(r => r.google10of10Achieved).length,
      highPerformers: results.filter(r => r.finalScore >= 90).length,
      needsImprovement: results.filter(r => r.finalScore < 80).length,
      averageScore: results.length > 0 
        ? Math.round((results.reduce((sum, r) => sum + r.finalScore, 0) / results.length) * 10) / 10
        : 0,
      averageScoresByCategory: {
        seo: Math.round((results.reduce((sum, r) => sum + r.qualityMetrics.seoScore, 0) / results.length) * 10) / 10,
        performance: Math.round((results.reduce((sum, r) => sum + r.qualityMetrics.performanceScore, 0) / results.length) * 10) / 10,
        accessibility: Math.round((results.reduce((sum, r) => sum + r.qualityMetrics.accessibilityScore, 0) / results.length) * 10) / 10,
        userExperience: Math.round((results.reduce((sum, r) => sum + r.qualityMetrics.userExperienceScore, 0) / results.length) * 10) / 10
      },
      competitivePositions: {
        marketLeader: results.filter(r => r.competitivePosition === 'Market Leader').length,
        strongCompetitor: results.filter(r => r.competitivePosition === 'Strong Competitor').length,
        competitive: results.filter(r => r.competitivePosition === 'Competitive').length,
        catchingUp: results.filter(r => r.competitivePosition === 'Catching Up').length,
        needsImprovement: results.filter(r => r.competitivePosition === 'Needs Improvement').length
      },
      gradeDistribution: {
        'A+': results.filter(r => r.qualityMetrics.overallQualityGrade === 'A+').length,
        'A': results.filter(r => r.qualityMetrics.overallQualityGrade === 'A').length,
        'B+': results.filter(r => r.qualityMetrics.overallQualityGrade === 'B+').length,
        'B': results.filter(r => r.qualityMetrics.overallQualityGrade === 'B').length,
        'C+': results.filter(r => r.qualityMetrics.overallQualityGrade === 'C+').length,
        'C': results.filter(r => r.qualityMetrics.overallQualityGrade === 'C').length,
        'D': results.filter(r => r.qualityMetrics.overallQualityGrade === 'D').length,
        'F': results.filter(r => r.qualityMetrics.overallQualityGrade === 'F').length
      },
      processingTime: Date.now() - startTime,
      lastUpdated: new Date().toISOString()
    }

    // Top performers and improvement candidates
    const topPerformers = results
      .filter(r => r.google10of10Achieved)
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 5)
      .map(r => ({ title: r.post.title, score: r.finalScore }))

    const improvementCandidates = results
      .filter(r => !r.google10of10Achieved)
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 5)
      .map(r => ({ 
        title: r.post.title, 
        score: r.finalScore,
        topIssue: r.validation.criticalFailures[0] || r.validation.warnings[0] || 'General optimization needed'
      }))

    const response = {
      success: true,
      results: filteredResults,
      stats,
      insights: {
        topPerformers,
        improvementCandidates,
        google10of10Rate: stats.total > 0 ? Math.round((stats.google10of10 / stats.total) * 100) : 0,
        dominanceLevel: stats.google10of10 >= stats.total * 0.8 ? 'Dominant' :
                        stats.google10of10 >= stats.total * 0.6 ? 'Strong' :
                        stats.google10of10 >= stats.total * 0.4 ? 'Competitive' :
                        stats.google10of10 >= stats.total * 0.2 ? 'Developing' : 'Emerging'
      },
      meta: {
        requestTime: Date.now() - startTime,
        filter,
        sort,
        limit,
        includeDetails,
        cacheUsed: true // Indicate that caching was used for performance
      }
    }

    console.log(`✅ Phase 9 Results - Processed: ${results.length}, Google 10/10: ${stats.google10of10}, Average: ${stats.averageScore}/100`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5min cache, 10min stale
        'X-Total-Results': stats.total.toString(),
        'X-Google10of10-Count': stats.google10of10.toString(),
        'X-Average-Score': stats.averageScore.toString(),
        'X-Processing-Time': (Date.now() - startTime).toString()
      }
    })

  } catch (error) {
    console.error('❌ Phase 9 Results Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve Phase 9 results',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to retrieve Phase 9 results',
    availableEndpoints: {
      'GET /api/seo/phase9/results': 'Get Phase 9 quality assurance results',
      'POST /api/seo/phase9/optimize': 'Execute Phase 9 optimization for specific post'
    },
    parameters: {
      limit: 'number (default: 50) - Maximum number of results',
      sort: 'string (score|title|date|competitive) - Sort order',
      filter: 'string (all|google10of10|needs-improvement|high-performers) - Filter results',
      details: 'boolean (default: false) - Include detailed optimization data'
    }
  }, { status: 405 })
}