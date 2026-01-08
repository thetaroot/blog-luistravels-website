/**
 * Advanced Search API Endpoint - PHASE 5 SEO-PERFECTION-2025
 * Enterprise-grade search API with comprehensive functionality
 * Supports content search, entity search, recommendations, and analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { AdvancedSearchEngine } from '@/lib/search/AdvancedSearchEngine'
import { getBlogPosts } from '@/lib/blog'
import { SearchOptions, SearchResult } from '@/lib/blog/types'

// Singleton search engine instance for performance
let searchEngine: AdvancedSearchEngine | null = null
let isInitialized = false

/**
 * Initialize search engine (called on first request)
 */
async function initializeSearchEngine(): Promise<AdvancedSearchEngine> {
  if (searchEngine && isInitialized) {
    return searchEngine
  }

  console.log('🔍 Initializing search engine...')
  
  try {
    // Get all blog posts
    const posts = await getBlogPosts()
    
    // Initialize search engine
    searchEngine = new AdvancedSearchEngine()
    await searchEngine.initialize(posts)
    
    isInitialized = true
    console.log(`✅ Search engine initialized with ${posts.length} posts`)
    
    return searchEngine
  } catch (error) {
    console.error('❌ Failed to initialize search engine:', error)
    throw new Error('Search engine initialization failed')
  }
}

/**
 * GET /api/search - Perform advanced search
 * 
 * Query Parameters:
 * - q: Search query (required)
 * - type: Search type (content|title|tags|entities|all)
 * - limit: Maximum results (default: 10)
 * - offset: Results offset for pagination (default: 0)
 * - sortBy: Sort order (relevance|date|popularity|readingTime)
 * - category: Filter by categories (comma-separated)
 * - tags: Filter by tags (comma-separated)
 * - locations: Filter by locations (comma-separated)
 * - language: Filter by language (en|de)
 * - startDate: Filter by start date (YYYY-MM-DD)
 * - endDate: Filter by end date (YYYY-MM-DD)
 * - minReadingTime: Minimum reading time in minutes
 * - maxReadingTime: Maximum reading time in minutes
 * - includeEntities: Include entity matches (true|false)
 * - includeClusters: Include cluster information (true|false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate required parameters
    const query = searchParams.get('q')
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Search query is required',
          message: 'Please provide a search query using the "q" parameter'
        },
        { status: 400 }
      )
    }

    // Initialize search engine if needed
    const engine = await initializeSearchEngine()

    // Parse search options
    const options: SearchOptions = {
      query: query.trim(),
      type: (searchParams.get('type') as any) || 'all',
      limit: Math.min(parseInt(searchParams.get('limit') || '10'), 50), // Max 50 results
      offset: parseInt(searchParams.get('offset') || '0'),
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      includeEntities: searchParams.get('includeEntities') === 'true',
      includeClusters: searchParams.get('includeClusters') === 'true',
      filters: {}
    }

    // Parse filters
    const categories = searchParams.get('category')
    if (categories) {
      options.filters!.categories = categories.split(',').map(c => c.trim())
    }

    const tags = searchParams.get('tags')
    if (tags) {
      options.filters!.tags = tags.split(',').map(t => t.trim())
    }

    const locations = searchParams.get('locations')
    if (locations) {
      options.filters!.locations = locations.split(',').map(l => l.trim())
    }

    const language = searchParams.get('language')
    if (language && (language === 'en' || language === 'de')) {
      options.filters!.language = language
    }

    // Parse date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      options.filters!.dateRange = { start: startDate, end: endDate }
    }

    // Parse reading time range
    const minReadingTime = searchParams.get('minReadingTime')
    const maxReadingTime = searchParams.get('maxReadingTime')
    if (minReadingTime && maxReadingTime) {
      options.filters!.readingTime = {
        min: parseInt(minReadingTime),
        max: parseInt(maxReadingTime)
      }
    }

    // Perform search
    console.log(`🔍 Processing search request: "${query}"`)
    const startTime = Date.now()
    
    const results = await engine.search(options)
    
    const searchTime = Date.now() - startTime
    console.log(`⚡ Search completed in ${searchTime}ms, found ${results.length} results`)

    // Apply offset for pagination
    const paginatedResults = results.slice(options.offset || 0)

    // Prepare response
    const response = {
      query: options.query,
      results: paginatedResults.map(result => ({
        post: {
          slug: result.post.slug,
          title: result.post.title,
          excerpt: result.post.excerpt,
          date: result.post.date,
          tags: result.post.tags,
          category: result.post.category,
          location: result.post.location,
          readingTime: result.post.readingTime,
          language: result.post.language
        },
        relevanceScore: Math.round(result.relevanceScore * 100) / 100,
        matchingPhrases: result.matchingPhrases,
        snippet: result.snippet,
        highlights: result.highlights,
        ...(options.includeEntities && result.entityMatches && {
          entityMatches: result.entityMatches
        })
      })),
      metadata: {
        totalResults: results.length,
        searchTime: `${searchTime}ms`,
        query: options.query,
        filters: options.filters,
        sortBy: options.sortBy,
        limit: options.limit,
        offset: options.offset || 0,
        hasMore: (results.length - (options.offset || 0)) > options.limit
      }
    }

    // Set response headers for caching and performance
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN
      'X-Search-Time': `${searchTime}ms`,
      'X-Total-Results': results.length.toString()
    })

    return new NextResponse(JSON.stringify(response, null, 2), { headers })

  } catch (error) {
    console.error('❌ Search API error:', error)
    
    return NextResponse.json(
      {
        error: 'Internal search error',
        message: 'An error occurred while processing your search request',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/search - Advanced search with complex filters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid search query' },
        { status: 400 }
      )
    }

    // Initialize search engine if needed
    const engine = await initializeSearchEngine()

    // Perform search with POST body options
    const results = await engine.search(body as SearchOptions)

    return NextResponse.json({
      query: body.query,
      results: results.map(result => ({
        post: {
          slug: result.post.slug,
          title: result.post.title,
          excerpt: result.post.excerpt,
          date: result.post.date,
          tags: result.post.tags,
          category: result.post.category,
          location: result.post.location,
          readingTime: result.post.readingTime
        },
        relevanceScore: Math.round(result.relevanceScore * 100) / 100,
        matchingPhrases: result.matchingPhrases,
        snippet: result.snippet,
        highlights: result.highlights
      })),
      metadata: {
        totalResults: results.length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Advanced search error:', error)
    
    return NextResponse.json(
      { error: 'Advanced search failed' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/search - CORS preflight support
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}