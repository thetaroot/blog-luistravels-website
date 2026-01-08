/**
 * ML-Powered Content Recommendations API - PHASE 5 SEO-PERFECTION-2025
 * Advanced recommendation engine with multiple algorithms and analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { AdvancedSearchEngine } from '@/lib/search/AdvancedSearchEngine'
import { getBlogPosts, getBlogPost } from '@/lib/blog'
import { ContentRecommendation } from '@/lib/blog/types'

// Singleton instances for performance
let searchEngine: AdvancedSearchEngine | null = null
let isInitialized = false

async function initializeRecommendationEngine(): Promise<AdvancedSearchEngine> {
  if (searchEngine && isInitialized) {
    return searchEngine
  }

  console.log('🤖 Initializing recommendation engine...')
  
  try {
    const posts = await getBlogPosts()
    
    searchEngine = new AdvancedSearchEngine()
    await searchEngine.initialize(posts)
    
    isInitialized = true
    console.log(`✅ Recommendation engine initialized with ${posts.length} posts`)
    
    return searchEngine
  } catch (error) {
    console.error('❌ Failed to initialize recommendation engine:', error)
    throw new Error('Recommendation engine initialization failed')
  }
}

/**
 * GET /api/recommendations?post=slug&count=5&type=all
 * 
 * Get ML-powered content recommendations for a specific post
 * 
 * Query Parameters:
 * - post: Post slug (required)
 * - count: Number of recommendations (default: 5, max: 20)
 * - type: Recommendation type (related|popular|recent|cluster|entity|geographic|all)
 * - includeReasoning: Include recommendation reasoning (true|false)
 * - excludePosts: Comma-separated list of post slugs to exclude
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate required parameters
    const postSlug = searchParams.get('post')
    if (!postSlug) {
      return NextResponse.json(
        { 
          error: 'Post slug is required',
          message: 'Please provide a post slug using the "post" parameter'
        },
        { status: 400 }
      )
    }

    // Validate post exists
    const currentPost = await getBlogPost(postSlug)
    if (!currentPost) {
      return NextResponse.json(
        { 
          error: 'Post not found',
          message: `Post with slug "${postSlug}" does not exist`
        },
        { status: 404 }
      )
    }

    // Parse parameters
    const count = Math.min(parseInt(searchParams.get('count') || '5'), 20)
    const type = searchParams.get('type') || 'all'
    const includeReasoning = searchParams.get('includeReasoning') === 'true'
    const excludePostsParam = searchParams.get('excludePosts')
    const excludePosts = excludePostsParam ? excludePostsParam.split(',').map(s => s.trim()) : []

    // Initialize recommendation engine
    const engine = await initializeRecommendationEngine()

    console.log(`🤖 Generating recommendations for: ${currentPost.title}`)
    const startTime = Date.now()

    // Get recommendations
    const recommendations = await engine.getRecommendations(postSlug, count * 2) // Get more to allow filtering
    
    // Filter out excluded posts
    const filteredRecommendations = recommendations.filter(rec => 
      !excludePosts.includes(rec.postSlug)
    )

    // Apply type filter if specified
    let finalRecommendations = filteredRecommendations
    if (type !== 'all') {
      finalRecommendations = filteredRecommendations.filter(rec => 
        rec.recommendationType === type
      )
    }

    // Limit to requested count
    finalRecommendations = finalRecommendations.slice(0, count)

    const processingTime = Date.now() - startTime
    console.log(`⚡ Generated ${finalRecommendations.length} recommendations in ${processingTime}ms`)

    // Prepare response
    const response = {
      forPost: {
        slug: currentPost.slug,
        title: currentPost.title,
        category: currentPost.category,
        topicCluster: currentPost.topicCluster,
        tags: currentPost.tags,
        location: currentPost.location
      },
      recommendations: finalRecommendations.map(rec => ({
        postSlug: rec.postSlug,
        title: rec.title,
        relevanceScore: Math.round(rec.relevanceScore * 100) / 100,
        recommendationType: rec.recommendationType,
        matchingFactors: rec.matchingFactors,
        ...(includeReasoning && rec.reasoning && {
          reasoning: rec.reasoning
        })
      })),
      metadata: {
        totalRecommendations: finalRecommendations.length,
        processingTime: `${processingTime}ms`,
        requestedCount: count,
        actualCount: finalRecommendations.length,
        recommendationType: type,
        excludedPosts: excludePosts.length,
        timestamp: new Date().toISOString()
      }
    }

    // Set response headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600, s-maxage=1800', // 10min browser, 30min CDN
      'X-Processing-Time': `${processingTime}ms`,
      'X-Total-Recommendations': finalRecommendations.length.toString()
    })

    return new NextResponse(JSON.stringify(response, null, 2), { headers })

  } catch (error) {
    console.error('❌ Recommendations API error:', error)
    
    return NextResponse.json(
      {
        error: 'Recommendations generation failed',
        message: 'An error occurred while generating recommendations',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/recommendations - Batch recommendations
 * 
 * Get recommendations for multiple posts at once
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.posts || !Array.isArray(body.posts)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected array of post slugs.' },
        { status: 400 }
      )
    }

    if (body.posts.length > 10) {
      return NextResponse.json(
        { error: 'Too many posts. Maximum 10 posts per batch request.' },
        { status: 400 }
      )
    }

    // Initialize recommendation engine
    const engine = await initializeRecommendationEngine()

    const count = Math.min(body.count || 5, 20)
    const batchResults: { [key: string]: ContentRecommendation[] } = {}
    
    console.log(`🤖 Processing batch recommendations for ${body.posts.length} posts`)
    const startTime = Date.now()

    // Process each post
    for (const postSlug of body.posts) {
      try {
        const recommendations = await engine.getRecommendations(postSlug, count)
        batchResults[postSlug] = recommendations
      } catch (error) {
        console.warn(`Failed to get recommendations for ${postSlug}:`, error)
        batchResults[postSlug] = []
      }
    }

    const processingTime = Date.now() - startTime
    console.log(`⚡ Batch recommendations completed in ${processingTime}ms`)

    // Prepare response
    const response = {
      results: Object.entries(batchResults).map(([postSlug, recommendations]) => ({
        postSlug,
        recommendations: recommendations.map(rec => ({
          postSlug: rec.postSlug,
          title: rec.title,
          relevanceScore: Math.round(rec.relevanceScore * 100) / 100,
          recommendationType: rec.recommendationType,
          matchingFactors: rec.matchingFactors
        })),
        count: recommendations.length
      })),
      metadata: {
        totalPosts: body.posts.length,
        processingTime: `${processingTime}ms`,
        requestedCount: count,
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Batch recommendations error:', error)
    
    return NextResponse.json(
      { error: 'Batch recommendations failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/recommendations/stats - Get recommendation engine statistics
 */
export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    if (searchParams.get('action') === 'stats') {
      // Initialize engine if needed
      const engine = await initializeRecommendationEngine()
      
      // Get engine statistics
      const stats = engine.getStats()
      
      return NextResponse.json({
        engineStats: stats,
        status: 'operational',
        initialized: isInitialized,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({ message: 'Recommendations API is operational' })

  } catch (error) {
    console.error('❌ Stats error:', error)
    
    return NextResponse.json(
      { 
        error: 'Stats unavailable',
        status: 'error' 
      },
      { status: 500 }
    )
  }
}