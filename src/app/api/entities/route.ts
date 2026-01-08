/**
 * Entity Extraction & Knowledge Graph API - PHASE 5 SEO-PERFECTION-2025
 * Advanced NER and knowledge graph endpoints for SEO enhancement
 */

import { NextRequest, NextResponse } from 'next/server'
import { EntityExtractor } from '@/lib/seo/EntityExtractor'
import { getBlogPosts, getBlogPost } from '@/lib/blog'
import { EntityMention, KnowledgeGraphEntity } from '@/lib/blog/types'

// Singleton instances for performance
let entityExtractor: EntityExtractor | null = null
let isInitialized = false

async function initializeEntityExtractor(): Promise<EntityExtractor> {
  if (entityExtractor && isInitialized) {
    return entityExtractor
  }

  console.log('🏷️ Initializing entity extractor...')
  
  try {
    entityExtractor = new EntityExtractor()
    isInitialized = true
    
    console.log('✅ Entity extractor initialized successfully')
    return entityExtractor
  } catch (error) {
    console.error('❌ Failed to initialize entity extractor:', error)
    throw new Error('Entity extractor initialization failed')
  }
}

/**
 * GET /api/entities - Extract entities from posts or get knowledge graph
 * 
 * Query Parameters:
 * - action: extract|knowledge-graph|recommendations|stats
 * - post: Post slug (for extraction)
 * - entity: Entity name (for recommendations)
 * - type: Entity type (for recommendations)
 * - limit: Number of results (default: 10)
 * - rebuild: Force rebuild knowledge graph (true|false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'extract'
    
    // Initialize extractor
    const extractor = await initializeEntityExtractor()

    switch (action) {
      case 'extract':
        return await handleEntityExtraction(request, extractor)
      
      case 'knowledge-graph':
        return await handleKnowledgeGraph(request, extractor)
      
      case 'recommendations':
        return await handleEntityRecommendations(request, extractor)
      
      case 'stats':
        return await handleStats(request, extractor)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: extract, knowledge-graph, recommendations, or stats' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ Entity API error:', error)
    
    return NextResponse.json(
      {
        error: 'Entity processing failed',
        message: 'An error occurred while processing entity request',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Handle entity extraction from posts
 */
async function handleEntityExtraction(request: NextRequest, extractor: EntityExtractor) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('post')
  
  if (postSlug) {
    // Extract entities from specific post
    const post = await getBlogPost(postSlug)
    if (!post) {
      return NextResponse.json(
        { error: `Post not found: ${postSlug}` },
        { status: 404 }
      )
    }

    console.log(`🔍 Extracting entities from: ${post.title}`)
    const startTime = Date.now()
    
    const entities = await extractor.extractEntities(post)
    
    const processingTime = Date.now() - startTime
    console.log(`⚡ Entity extraction completed in ${processingTime}ms`)

    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title
      },
      entities: entities.map(entity => ({
        type: entity.type,
        name: entity.name,
        confidence: Math.round(entity.confidence * 100) / 100,
        context: entity.context?.substring(0, 100) + '...',
        category: entity.category,
        sentiment: entity.sentiment,
        relevance: Math.round((entity.relevance || 0) * 100) / 100,
        knowledgeGraphId: entity.knowledgeGraphId
      })),
      metadata: {
        totalEntities: entities.length,
        processingTime: `${processingTime}ms`,
        entityTypes: [...new Set(entities.map(e => e.type))],
        timestamp: new Date().toISOString()
      }
    })
  } else {
    // Batch extract entities from all posts
    const posts = await getBlogPosts()
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const postsToProcess = posts.slice(0, limit)
    
    console.log(`🔍 Batch extracting entities from ${postsToProcess.length} posts...`)
    const startTime = Date.now()
    
    const entitiesMap = await extractor.batchExtractEntities(postsToProcess)
    
    const processingTime = Date.now() - startTime
    console.log(`⚡ Batch entity extraction completed in ${processingTime}ms`)

    // Build knowledge graph
    const knowledgeGraph = await extractor.buildKnowledgeGraph(entitiesMap)

    const results = Array.from(entitiesMap.entries()).map(([postSlug, entities]) => {
      const post = posts.find(p => p.slug === postSlug)
      return {
        post: {
          slug: postSlug,
          title: post?.title || 'Unknown'
        },
        entities: entities.map(entity => ({
          type: entity.type,
          name: entity.name,
          confidence: Math.round(entity.confidence * 100) / 100,
          category: entity.category,
          sentiment: entity.sentiment,
          knowledgeGraphId: entity.knowledgeGraphId
        })),
        entityCount: entities.length
      }
    })

    return NextResponse.json({
      results,
      metadata: {
        totalPosts: postsToProcess.length,
        totalEntities: Array.from(entitiesMap.values()).reduce((sum, entities) => sum + entities.length, 0),
        knowledgeGraphEntities: knowledgeGraph.size,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    })
  }
}

/**
 * Handle knowledge graph operations
 */
async function handleKnowledgeGraph(request: NextRequest, extractor: EntityExtractor) {
  const { searchParams } = new URL(request.url)
  const rebuild = searchParams.get('rebuild') === 'true'
  const format = searchParams.get('format') || 'summary'
  
  if (rebuild) {
    console.log('🕸️ Rebuilding knowledge graph...')
    const posts = await getBlogPosts()
    const entitiesMap = await extractor.batchExtractEntities(posts)
    await extractor.buildKnowledgeGraph(entitiesMap)
  }

  const stats = extractor.getKnowledgeGraphStats()

  if (format === 'export') {
    // Export full knowledge graph
    const exportData = extractor.exportKnowledgeGraph()
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="knowledge-graph.json"',
      'Cache-Control': 'public, max-age=3600'
    })

    return new NextResponse(JSON.stringify(exportData, null, 2), { headers })
  } else {
    // Return knowledge graph summary
    return NextResponse.json({
      knowledgeGraph: {
        stats,
        message: 'Knowledge graph is operational',
        rebuildRequired: !isInitialized
      },
      metadata: {
        format,
        timestamp: new Date().toISOString()
      }
    })
  }
}

/**
 * Handle entity recommendations
 */
async function handleEntityRecommendations(request: NextRequest, extractor: EntityExtractor) {
  const { searchParams } = new URL(request.url)
  const entityName = searchParams.get('entity')
  const entityType = searchParams.get('type')
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
  
  if (!entityName || !entityType) {
    return NextResponse.json(
      { error: 'Both entity name and type are required for recommendations' },
      { status: 400 }
    )
  }

  console.log(`🤖 Getting recommendations for entity: ${entityName} (${entityType})`)
  const startTime = Date.now()
  
  const recommendations = await extractor.getEntityRecommendations(entityName, entityType, limit)
  
  const processingTime = Date.now() - startTime

  return NextResponse.json({
    entity: {
      name: entityName,
      type: entityType
    },
    recommendations: recommendations.map(rec => ({
      name: rec.name,
      type: rec.type,
      frequency: rec.frequency,
      confidence: Math.round(rec.confidence * 100) / 100,
      connections: rec.connections.length,
      relatedPosts: rec.relatedPosts.length
    })),
    metadata: {
      totalRecommendations: recommendations.length,
      processingTime: `${processingTime}ms`,
      requestedLimit: limit,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Handle statistics requests
 */
async function handleStats(request: NextRequest, extractor: EntityExtractor) {
  const extractionStats = extractor.getExtractionStats()
  const knowledgeGraphStats = extractor.getKnowledgeGraphStats()

  return NextResponse.json({
    entityExtractor: extractionStats,
    knowledgeGraph: knowledgeGraphStats,
    system: {
      initialized: isInitialized,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * POST /api/entities - Batch entity operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.action) {
      return NextResponse.json(
        { error: 'Action is required in request body' },
        { status: 400 }
      )
    }

    const extractor = await initializeEntityExtractor()

    switch (body.action) {
      case 'extract-batch':
        return await handleBatchExtraction(body, extractor)
      
      case 'build-knowledge-graph':
        return await handleBuildKnowledgeGraph(body, extractor)
      
      case 'clear-cache':
        extractor.clearCache()
        return NextResponse.json({
          success: true,
          message: 'Entity caches cleared successfully',
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: extract-batch, build-knowledge-graph, or clear-cache' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ Entity POST error:', error)
    
    return NextResponse.json(
      { error: 'Entity operation failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle batch entity extraction
 */
async function handleBatchExtraction(body: any, extractor: EntityExtractor) {
  if (!body.postSlugs || !Array.isArray(body.postSlugs)) {
    return NextResponse.json(
      { error: 'postSlugs array is required' },
      { status: 400 }
    )
  }

  if (body.postSlugs.length > 100) {
    return NextResponse.json(
      { error: 'Maximum 100 posts per batch request' },
      { status: 400 }
    )
  }

  const posts = await Promise.all(
    body.postSlugs.map(async (slug: string) => await getBlogPost(slug))
  )
  
  const validPosts = posts.filter(Boolean)
  
  console.log(`🔍 Batch extracting entities from ${validPosts.length} posts...`)
  const startTime = Date.now()
  
  const entitiesMap = await extractor.batchExtractEntities(validPosts)
  
  const processingTime = Date.now() - startTime

  const results = Array.from(entitiesMap.entries()).map(([postSlug, entities]) => ({
    postSlug,
    entities: entities.length,
    entityTypes: [...new Set(entities.map(e => e.type))]
  }))

  return NextResponse.json({
    results,
    metadata: {
      requestedPosts: body.postSlugs.length,
      processedPosts: validPosts.length,
      totalEntities: Array.from(entitiesMap.values()).reduce((sum, entities) => sum + entities.length, 0),
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Handle knowledge graph building
 */
async function handleBuildKnowledgeGraph(body: any, extractor: EntityExtractor) {
  console.log('🕸️ Building knowledge graph from all posts...')
  const startTime = Date.now()
  
  const posts = await getBlogPosts()
  const entitiesMap = await extractor.batchExtractEntities(posts)
  const knowledgeGraph = await extractor.buildKnowledgeGraph(entitiesMap)
  
  const processingTime = Date.now() - startTime
  const stats = extractor.getKnowledgeGraphStats()

  return NextResponse.json({
    knowledgeGraph: {
      totalEntities: knowledgeGraph.size,
      stats,
      processingTime: `${processingTime}ms`
    },
    metadata: {
      totalPosts: posts.length,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * OPTIONS /api/entities - CORS support
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