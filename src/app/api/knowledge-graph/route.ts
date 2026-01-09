/**
 * Knowledge Graph API - PHASE 5 SEO-PERFECTION-2025
 * Comprehensive knowledge graph visualization and analytics endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { EntityExtractor } from '@/lib/seo/EntityExtractor'
import { getBlogPosts } from '@/lib/blog'

// Singleton instance
let entityExtractor: EntityExtractor | null = null
let knowledgeGraphData: any = null
let lastBuilt: string | null = null

async function initializeKnowledgeGraph(): Promise<any> {
  if (knowledgeGraphData && lastBuilt) {
    const hoursSinceLastBuild = (Date.now() - new Date(lastBuilt).getTime()) / (1000 * 60 * 60)
    if (hoursSinceLastBuild < 24) { // Rebuild every 24 hours
      return knowledgeGraphData
    }
  }

  console.log('🕸️ Building comprehensive knowledge graph...')
  
  try {
    if (!entityExtractor) {
      entityExtractor = new EntityExtractor()
    }

    // Get all blog posts
    const posts = await getBlogPosts()
    console.log(`📚 Processing ${posts.length} posts for knowledge graph...`)

    // Extract entities from all posts
    const entitiesMap = await entityExtractor.batchExtractEntities(posts)
    
    // Build knowledge graph
    const knowledgeGraph = await entityExtractor.buildKnowledgeGraph(entitiesMap)
    
    // Export graph data
    const exportData = entityExtractor.exportKnowledgeGraph()
    
    // Prepare comprehensive data structure
    knowledgeGraphData = {
      graph: exportData,
      entities: entitiesMap,
      posts: posts.map(post => ({
        slug: post.slug,
        title: post.title,
        category: post.category,
        tags: post.tags,
        location: post.location,
        date: post.date,
        entityCount: entitiesMap.get(post.slug)?.length || 0
      })),
      stats: entityExtractor.getKnowledgeGraphStats(),
      analytics: generateKnowledgeGraphAnalytics(exportData, entitiesMap, posts)
    }

    lastBuilt = new Date().toISOString()
    console.log('✅ Knowledge graph built successfully')
    
    return knowledgeGraphData
  } catch (error) {
    console.error('❌ Failed to build knowledge graph:', error)
    throw error
  }
}

/**
 * GET /api/knowledge-graph - Get knowledge graph data and analytics
 * 
 * Query Parameters:
 * - format: full|summary|export|analytics|entities
 * - entityType: Filter by entity type
 * - minConnections: Minimum number of connections
 * - rebuild: Force rebuild (true|false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'summary'
    const entityType = searchParams.get('entityType')
    const minConnections = parseInt(searchParams.get('minConnections') || '0')
    const rebuild = searchParams.get('rebuild') === 'true'

    if (rebuild) {
      knowledgeGraphData = null
      lastBuilt = null
    }

    // Initialize/load knowledge graph
    const kgData = await initializeKnowledgeGraph()

    switch (format) {
      case 'full':
        return NextResponse.json({
          knowledgeGraph: kgData,
          metadata: {
            format,
            lastBuilt,
            timestamp: new Date().toISOString()
          }
        })

      case 'export':
        const headers = new Headers({
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="knowledge-graph-export.json"',
          'Cache-Control': 'public, max-age=3600'
        })
        return new NextResponse(JSON.stringify(kgData.graph, null, 2), { headers })

      case 'analytics':
        return NextResponse.json({
          analytics: kgData.analytics,
          stats: kgData.stats,
          metadata: {
            format,
            lastBuilt,
            timestamp: new Date().toISOString()
          }
        })

      case 'entities':
        let filteredEntities = kgData.graph.nodes
        
        if (entityType) {
          filteredEntities = filteredEntities.filter((node: any) => 
            node.type.toLowerCase() === entityType.toLowerCase()
          )
        }
        
        if (minConnections > 0) {
          filteredEntities = filteredEntities.filter((node: any) => {
            const entityData = kgData.graph.edges.filter((edge: any) => 
              edge.source === node.id || edge.target === node.id
            )
            return entityData.length >= minConnections
          })
        }

        return NextResponse.json({
          entities: filteredEntities.slice(0, 100), // Limit to 100 for performance
          totalEntities: filteredEntities.length,
          filters: {
            entityType,
            minConnections
          },
          metadata: {
            format,
            lastBuilt,
            timestamp: new Date().toISOString()
          }
        })

      case 'summary':
      default:
        return NextResponse.json({
          summary: {
            totalEntities: kgData.graph.nodes.length,
            totalConnections: kgData.graph.edges.length,
            totalPosts: kgData.posts.length,
            topEntityTypes: getTopEntityTypes(kgData.graph.nodes),
            mostConnectedEntities: getMostConnectedEntities(kgData.graph, 5),
            clusterAnalysis: kgData.analytics.clusters,
            lastBuilt
          },
          quickStats: kgData.stats,
          metadata: {
            format,
            timestamp: new Date().toISOString()
          }
        })
    }

  } catch (error) {
    console.error('❌ Knowledge graph API error:', error)
    
    return NextResponse.json(
      {
        error: 'Knowledge graph processing failed',
        message: 'An error occurred while processing the knowledge graph',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/knowledge-graph - Perform knowledge graph operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Initialize knowledge graph
    const kgData = await initializeKnowledgeGraph()

    switch (body.action) {
      case 'find-entity-path':
        return await findEntityPath(body, kgData)
      
      case 'get-entity-neighborhood':
        return await getEntityNeighborhood(body, kgData)
      
      case 'analyze-entity-clusters':
        return await analyzeEntityClusters(body, kgData)
      
      case 'get-content-recommendations':
        return await getContentRecommendations(body, kgData)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ Knowledge graph POST error:', error)
    
    return NextResponse.json(
      { error: 'Knowledge graph operation failed' },
      { status: 500 }
    )
  }
}

// Helper functions

function generateKnowledgeGraphAnalytics(exportData: any, entitiesMap: Map<string, any>, posts: any[]): any {
  const nodes = exportData.nodes || []
  const edges = exportData.edges || []

  return {
    overview: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      averageConnections: edges.length > 0 ? (edges.length * 2) / nodes.length : 0,
      density: nodes.length > 1 ? edges.length / (nodes.length * (nodes.length - 1) / 2) : 0
    },
    entityTypes: {
      distribution: getEntityTypeDistribution(nodes),
      topTypes: getTopEntityTypes(nodes)
    },
    connectivity: {
      mostConnected: getMostConnectedEntities(exportData, 10),
      isolatedEntities: getIsolatedEntities(exportData),
      connectionStrengths: getConnectionStrengths(edges)
    },
    content: {
      postsWithMostEntities: getPostsWithMostEntities(entitiesMap, posts, 10),
      entitiesPerPost: calculateAverageEntitiesPerPost(entitiesMap),
      contentCoverage: calculateContentCoverage(entitiesMap, posts)
    },
    clusters: identifyEntityClusters(exportData),
    temporal: {
      entityGrowthByDate: analyzeEntityGrowthByDate(posts, entitiesMap),
      recentlyMentioned: getRecentlyMentionedEntities(posts, entitiesMap, 30)
    }
  }
}

function getTopEntityTypes(nodes: any[]): { type: string; count: number }[] {
  const typeCounts = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1
    return acc
  }, {})

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function getMostConnectedEntities(exportData: any, limit: number): any[] {
  const nodes = exportData.nodes || []
  const edges = exportData.edges || []

  const connectionCounts = nodes.map((node: any) => {
    const connections = edges.filter((edge: any) => 
      edge.source === node.id || edge.target === node.id
    ).length

    return {
      ...node,
      connections
    }
  })

  return connectionCounts
    .sort((a: any, b: any) => b.connections - a.connections)
    .slice(0, limit)
}

function getEntityTypeDistribution(nodes: any[]): { [type: string]: number } {
  return nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1
    return acc
  }, {})
}

function getIsolatedEntities(exportData: any): any[] {
  const nodes = exportData.nodes || []
  const edges = exportData.edges || []

  return nodes.filter((node: any) => {
    return !edges.some((edge: any) => 
      edge.source === node.id || edge.target === node.id
    )
  })
}

function getConnectionStrengths(edges: any[]): { min: number; max: number; average: number } {
  if (edges.length === 0) return { min: 0, max: 0, average: 0 }

  const weights = edges.map(edge => edge.weight || 1)
  return {
    min: Math.min(...weights),
    max: Math.max(...weights),
    average: weights.reduce((sum, weight) => sum + weight, 0) / weights.length
  }
}

function getPostsWithMostEntities(entitiesMap: Map<string, any>, posts: any[], limit: number): any[] {
  const postsWithCounts = posts.map(post => ({
    ...post,
    entityCount: entitiesMap.get(post.slug)?.length || 0
  }))

  return postsWithCounts
    .sort((a, b) => b.entityCount - a.entityCount)
    .slice(0, limit)
}

function calculateAverageEntitiesPerPost(entitiesMap: Map<string, any>): number {
  const totalEntities = Array.from(entitiesMap.values()).reduce((sum, entities) => sum + entities.length, 0)
  return entitiesMap.size > 0 ? totalEntities / entitiesMap.size : 0
}

function calculateContentCoverage(entitiesMap: Map<string, any>, posts: any[]): number {
  const postsWithEntities = Array.from(entitiesMap.values()).filter(entities => entities.length > 0).length
  return posts.length > 0 ? postsWithEntities / posts.length : 0
}

function identifyEntityClusters(exportData: any): any {
  // Simplified cluster identification
  const nodes = exportData.nodes || []
  const edges = exportData.edges || []

  // Group by entity type as basic clustering
  const clusters = nodes.reduce((acc: any, node: any) => {
    if (!acc[node.type]) {
      acc[node.type] = []
    }
    acc[node.type].push(node)
    return acc
  }, {})

  return Object.entries(clusters).map(([type, entities]) => ({
    type,
    size: (entities as any[]).length,
    entities: (entities as any[]).slice(0, 5) // Top 5 entities per cluster
  }))
}

function analyzeEntityGrowthByDate(posts: any[], entitiesMap: Map<string, any>): any {
  // Group posts by month and count entities
  const monthlyData = posts.reduce((acc: any, post) => {
    const date = new Date(post.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = { posts: 0, entities: 0 }
    }
    
    acc[monthKey].posts += 1
    acc[monthKey].entities += entitiesMap.get(post.slug)?.length || 0
    
    return acc
  }, {})

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...(data as any)
  })).sort((a, b) => a.month.localeCompare(b.month))
}

function getRecentlyMentionedEntities(posts: any[], entitiesMap: Map<string, any>, days: number): any[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const recentEntities = new Map<string, number>()

  posts.forEach(post => {
    if (new Date(post.date) >= cutoffDate) {
      const entities = entitiesMap.get(post.slug) || []
      entities.forEach((entity: any) => {
        const key = `${entity.type}:${entity.name}`
        recentEntities.set(key, (recentEntities.get(key) || 0) + 1)
      })
    }
  })

  return Array.from(recentEntities.entries())
    .map(([entityKey, count]) => {
      const [type, name] = entityKey.split(':')
      return { type, name, mentions: count }
    })
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10)
}

// POST action handlers

async function findEntityPath(body: any, kgData: any) {
  return NextResponse.json({
    message: 'Entity path finding not yet implemented',
    fromEntity: body.fromEntity,
    toEntity: body.toEntity
  })
}

async function getEntityNeighborhood(body: any, kgData: any) {
  const entityId = body.entityId
  const depth = Math.min(body.depth || 1, 3) // Max depth of 3

  // Find direct neighbors
  const edges = kgData.graph.edges || []
  const neighbors = edges
    .filter((edge: any) => edge.source === entityId || edge.target === entityId)
    .map((edge: any) => edge.source === entityId ? edge.target : edge.source)

  return NextResponse.json({
    entityId,
    neighbors: neighbors.slice(0, 20), // Limit to 20 neighbors
    depth,
    totalNeighbors: neighbors.length
  })
}

async function analyzeEntityClusters(body: any, kgData: any) {
  return NextResponse.json({
    clusters: kgData.analytics.clusters,
    message: 'Entity cluster analysis complete'
  })
}

async function getContentRecommendations(body: any, kgData: any) {
  const entityType = body.entityType
  const entityName = body.entityName

  // Find related content based on entity
  const relatedPosts = kgData.posts.filter((post: any) => {
    // This would need proper integration with entity data
    return post.entityCount > 0
  }).slice(0, 10)

  return NextResponse.json({
    entity: { type: entityType, name: entityName },
    recommendations: relatedPosts,
    totalRecommendations: relatedPosts.length
  })
}