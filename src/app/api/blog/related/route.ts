/**
 * Enhanced Related Posts API - PHASE 5 SEO-PERFECTION-2025
 * Advanced multi-factor recommendation algorithm replacing simple tag matching
 * Includes: topic clusters, entities, geography, content similarity, and popularity
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, getBlogPost } from '@/lib/blog'
import { AdvancedSearchEngine } from '@/lib/search/AdvancedSearchEngine'
import { TopicClusterManager } from '@/lib/seo/TopicClusterManager'
import { ContentRecommendation } from '@/lib/blog/types'

// Singleton instances for performance
let searchEngine: AdvancedSearchEngine | null = null
let clusterManager: TopicClusterManager | null = null
let isInitialized = false

async function initializeRecommendationSystems() {
  if (isInitialized && searchEngine && clusterManager) {
    return { searchEngine, clusterManager }
  }

  console.log('🤖 Initializing advanced recommendation systems...')
  
  try {
    const posts = await getBlogPosts()
    
    // Initialize search engine for content similarity
    searchEngine = new AdvancedSearchEngine()
    await searchEngine.initialize(posts)
    
    // Initialize cluster manager for topic-based recommendations
    clusterManager = new TopicClusterManager()
    await clusterManager.generateClusters(posts)
    
    isInitialized = true
    console.log(`✅ Advanced recommendation systems initialized`)
    
    return { searchEngine, clusterManager }
  } catch (error) {
    console.error('❌ Failed to initialize recommendation systems:', error)
    throw error
  }
}

/**
 * GET /api/blog/related - Advanced multi-factor related posts
 * 
 * PHASE 5 ENHANCEMENT: Replaces simple tag matching with ML-powered recommendations
 * 
 * Algorithms:
 * 1. Topic cluster similarity (40% weight)
 * 2. Entity overlap analysis (25% weight) 
 * 3. Geographic proximity (15% weight)
 * 4. Content similarity TF-IDF (10% weight)
 * 5. Popularity-based (10% weight)
 * 
 * Query Parameters:
 * - slug: Current post slug (required)
 * - limit: Number of recommendations (default: 5, max: 20)
 * - algorithm: Recommendation algorithm (cluster|entity|geo|content|popularity|hybrid)
 * - includeScoring: Include relevance scores in response
 * - minScore: Minimum relevance score threshold (0.0-1.0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentSlug = searchParams.get('slug')
    
    if (!currentSlug) {
      return NextResponse.json({
        success: false,
        posts: [],
        error: 'Missing required parameter: slug'
      }, { status: 400 })
    }

    // Validate post exists
    const currentPost = await getBlogPost(currentSlug)
    if (!currentPost) {
      return NextResponse.json({
        success: false,
        posts: [],
        error: `Post not found: ${currentSlug}`
      }, { status: 404 })
    }

    // Parse parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 20)
    const algorithm = searchParams.get('algorithm') || 'hybrid'
    const includeScoring = searchParams.get('includeScoring') === 'true'
    const minScore = parseFloat(searchParams.get('minScore') || '0.1')

    console.log(`🔍 Generating related posts for: ${currentPost.title} (algorithm: ${algorithm})`)
    const startTime = Date.now()

    // Initialize recommendation systems
    const { searchEngine } = await initializeRecommendationSystems()

    // Get ML-powered recommendations
    const recommendations = await searchEngine.getRecommendations(currentSlug, limit * 2)

    // Filter by algorithm type if specified
    let filteredRecommendations = recommendations
    if (algorithm !== 'hybrid') {
      filteredRecommendations = recommendations.filter(rec => 
        rec.recommendationType === algorithm
      )
    }

    // Apply minimum score threshold
    filteredRecommendations = filteredRecommendations.filter(rec => 
      rec.relevanceScore >= minScore
    )

    // Limit results
    const finalRecommendations = filteredRecommendations.slice(0, limit)

    // Get full post data for recommendations
    const relatedPosts = await Promise.all(
      finalRecommendations.map(async (rec) => {
        const post = await getBlogPost(rec.postSlug)
        return {
          ...post,
          ...(includeScoring && {
            relevanceScore: Math.round(rec.relevanceScore * 100) / 100,
            recommendationType: rec.recommendationType,
            matchingFactors: rec.matchingFactors,
            reasoning: rec.reasoning
          })
        }
      })
    )

    const processingTime = Date.now() - startTime
    console.log(`⚡ Generated ${relatedPosts.length} related posts in ${processingTime}ms`)

    // Enhanced response with metadata
    const response = {
      success: true,
      posts: relatedPosts.filter(Boolean), // Remove any null posts
      count: relatedPosts.length,
      metadata: {
        currentPost: {
          slug: currentPost.slug,
          title: currentPost.title,
          category: currentPost.category,
          topicCluster: currentPost.topicCluster,
          tags: currentPost.tags,
          location: currentPost.location
        },
        algorithm: algorithm,
        processingTime: `${processingTime}ms`,
        totalCandidates: recommendations.length,
        filteredCount: filteredRecommendations.length,
        minScoreThreshold: minScore,
        requestedLimit: limit,
        timestamp: new Date().toISOString()
      }
    }

    // Set optimized caching headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600', // 30min browser, 1h CDN
      'X-Processing-Time': `${processingTime}ms`,
      'X-Algorithm': algorithm,
      'X-Total-Recommendations': relatedPosts.length.toString()
    })

    return new NextResponse(JSON.stringify(response, null, 2), { headers })

  } catch (error) {
    console.error('❌ Enhanced related posts error:', error)
    
    // Fallback to simple tag-based recommendations
    try {
      console.log('⚠️ Falling back to simple tag-based recommendations...')
      return await getSimpleRelatedPosts(request)
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
      
      return NextResponse.json({
        success: false,
        posts: [],
        count: 0,
        error: 'Advanced recommendations unavailable, fallback failed',
        metadata: {
          timestamp: new Date().toISOString(),
          errorType: 'system_failure'
        }
      }, { status: 500 })
    }
  }
}

/**
 * Fallback: Simple tag-based related posts (original algorithm)
 */
async function getSimpleRelatedPosts(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const currentSlug = searchParams.get('slug')
  const limit = parseInt(searchParams.get('limit') || '5')
  
  const currentPost = await getBlogPost(currentSlug!)
  if (!currentPost) {
    throw new Error('Post not found')
  }

  const allPosts = await getBlogPosts()
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug)
  
  // Simple tag-based scoring
  const postsWithScore = otherPosts.map(post => {
    const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag))
    const relevanceScore = sharedTags.length / Math.max(currentPost.tags.length, post.tags.length)
    
    return {
      ...post,
      relevanceScore,
      sharedTags: sharedTags.length
    }
  })
  
  const sortedPosts = postsWithScore
    .filter(post => post.sharedTags > 0) // At least one shared tag
    .sort((a, b) => {
      if (b.sharedTags !== a.sharedTags) {
        return b.sharedTags - a.sharedTags
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
  
  const relatedPosts = sortedPosts.map(({ relevanceScore, sharedTags, ...post }) => post)
  
  return NextResponse.json({
    success: true,
    posts: relatedPosts,
    count: relatedPosts.length,
    metadata: {
      algorithm: 'fallback_tags',
      timestamp: new Date().toISOString(),
      note: 'Using fallback tag-based algorithm'
    }
  })
}

/**
 * POST /api/blog/related - Batch related posts processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.posts || !Array.isArray(body.posts)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body. Expected array of post slugs.'
      }, { status: 400 })
    }

    if (body.posts.length > 10) {
      return NextResponse.json({
        success: false,
        error: 'Too many posts. Maximum 10 posts per batch request.'
      }, { status: 400 })
    }

    // Initialize systems
    const { searchEngine } = await initializeRecommendationSystems()
    
    const limit = Math.min(body.limit || 5, 20)
    const batchResults: { [key: string]: any[] } = {}
    
    console.log(`🤖 Processing batch related posts for ${body.posts.length} posts`)
    const startTime = Date.now()

    // Process each post
    for (const postSlug of body.posts) {
      try {
        const recommendations = await searchEngine.getRecommendations(postSlug, limit)
        const relatedPosts = await Promise.all(
          recommendations.map(async (rec) => {
            const post = await getBlogPost(rec.postSlug)
            return post ? {
              ...post,
              relevanceScore: Math.round(rec.relevanceScore * 100) / 100,
              recommendationType: rec.recommendationType
            } : null
          })
        )
        
        batchResults[postSlug] = relatedPosts.filter(Boolean)
      } catch (error) {
        console.warn(`Failed to get related posts for ${postSlug}:`, error)
        batchResults[postSlug] = []
      }
    }

    const processingTime = Date.now() - startTime
    console.log(`⚡ Batch related posts completed in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      results: Object.entries(batchResults).map(([postSlug, posts]) => ({
        postSlug,
        relatedPosts: posts,
        count: posts.length
      })),
      metadata: {
        totalPosts: body.posts.length,
        processingTime: `${processingTime}ms`,
        requestedLimit: limit,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Batch related posts error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Batch processing failed'
    }, { status: 500 })
  }
}