/**
 * Entity Search Integration - PHASE 5 SEO-PERFECTION-2025
 * Integrates entity extraction with the advanced search engine
 * Enhances search results with entity-based matching and knowledge graph signals
 */

import { EntityExtractor } from './EntityExtractor'
import { AdvancedSearchEngine } from '@/lib/search/AdvancedSearchEngine'
import { BlogPost, EntityMention, SearchResult, KnowledgeGraphEntity } from '@/lib/blog/types'

export class EntitySearchIntegration {
  private entityExtractor: EntityExtractor
  private searchEngine: AdvancedSearchEngine
  private entityEnhancedResults: Map<string, SearchResult> = new Map()

  constructor(entityExtractor: EntityExtractor, searchEngine: AdvancedSearchEngine) {
    this.entityExtractor = entityExtractor
    this.searchEngine = searchEngine
  }

  /**
   * Enhance search results with entity information
   */
  async enhanceSearchWithEntities(
    searchResults: SearchResult[], 
    query: string
  ): Promise<SearchResult[]> {
    console.log(`🔍 Enhancing ${searchResults.length} search results with entity data...`)
    
    const enhancedResults: SearchResult[] = []

    for (const result of searchResults) {
      try {
        // Extract entities from the post if not already done
        if (!result.post.entities || result.post.entities.length === 0) {
          result.post.entities = await this.entityExtractor.extractEntities(result.post)
        }

        // Find entity matches with search query
        const entityMatches = this.findEntityMatches(result.post.entities, query)
        
        // Calculate entity relevance boost
        const entityBoost = this.calculateEntityRelevanceBoost(entityMatches, query)
        
        // Create enhanced result
        const enhancedResult: SearchResult = {
          ...result,
          relevanceScore: result.relevanceScore + entityBoost,
          entityMatches: entityMatches.length > 0 ? entityMatches : undefined,
          highlights: [
            ...(result.highlights || []),
            ...entityMatches.map(entity => entity.name)
          ]
        }

        enhancedResults.push(enhancedResult)
      } catch (error) {
        console.warn(`Failed to enhance result for ${result.post.slug}:`, error)
        enhancedResults.push(result) // Use original result if enhancement fails
      }
    }

    // Re-sort by enhanced relevance scores
    return enhancedResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Perform entity-aware search
   */
  async performEntityAwareSearch(
    query: string, 
    limit: number = 10
  ): Promise<SearchResult[]> {
    console.log(`🤖 Performing entity-aware search for: "${query}"`)

    // Step 1: Regular search
    const regularResults = await this.searchEngine.search({
      query,
      limit: limit * 2, // Get more results to allow for entity filtering
      includeEntities: true
    })

    // Step 2: Entity-based search
    const entityResults = await this.performEntityBasedSearch(query, limit)

    // Step 3: Combine and deduplicate results
    const combinedResults = this.combineSearchResults(regularResults, entityResults)

    // Step 4: Enhance with entity information
    const enhancedResults = await this.enhanceSearchWithEntities(combinedResults, query)

    return enhancedResults.slice(0, limit)
  }

  /**
   * Search for posts based on entity queries
   */
  async performEntityBasedSearch(query: string, limit: number): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    const queryLower = query.toLowerCase()

    // Search through knowledge graph entities
    const knowledgeGraph = this.entityExtractor.exportKnowledgeGraph() as any
    const matchingEntities: KnowledgeGraphEntity[] = []

    // Find entities that match the query
    if (knowledgeGraph.nodes) {
      for (const entity of knowledgeGraph.nodes) {
        if (entity.name.toLowerCase().includes(queryLower) || 
            queryLower.includes(entity.name.toLowerCase())) {
          matchingEntities.push(entity)
        }
      }
    }

    // Get posts containing matching entities
    for (const entity of matchingEntities.slice(0, limit)) {
      const entityRecommendations = await this.entityExtractor.getEntityRecommendations(
        entity.name, 
        entity.type, 
        5
      )

      for (const rec of entityRecommendations) {
        if (rec.relatedPosts && rec.relatedPosts.length > 0) {
          for (const postSlug of rec.relatedPosts.slice(0, 3)) {
            // This would need to be adapted based on how you get blog posts
            // For now, creating a placeholder result
            const entityBasedResult: SearchResult = {
              post: {
                slug: postSlug,
                title: `Post containing ${entity.name}`,
                content: '',
                excerpt: '',
                date: new Date().toISOString(),
                tags: [],
                language: 'en',
                entities: [{
                  type: entity.type,
                  name: entity.name,
                  confidence: rec.confidence,
                  context: `Related to ${entity.name}`
                }]
              },
              relevanceScore: rec.confidence * 0.8, // Entity-based relevance
              matchingPhrases: [entity.name],
              entityMatches: [{
                type: entity.type,
                name: entity.name,
                confidence: rec.confidence,
                context: `Entity match for "${query}"`
              }]
            }

            results.push(entityBasedResult)
          }
        }
      }
    }

    return results
  }

  /**
   * Get entity-based content recommendations
   */
  async getEntityBasedRecommendations(
    postSlug: string, 
    count: number = 5
  ): Promise<SearchResult[]> {
    console.log(`🤖 Getting entity-based recommendations for: ${postSlug}`)

    // This would integrate with your blog post retrieval system
    // For now, return empty array
    return []
  }

  /**
   * Find semantic relationships between entities
   */
  async findSemanticEntityRelationships(
    entities: EntityMention[]
  ): Promise<{ [entityId: string]: string[] }> {
    const relationships: { [entityId: string]: string[] } = {}

    for (const entity of entities) {
      if (entity.knowledgeGraphId) {
        const recommendations = await this.entityExtractor.getEntityRecommendations(
          entity.name,
          entity.type,
          10
        )

        relationships[entity.knowledgeGraphId] = recommendations.map(rec => rec.name)
      }
    }

    return relationships
  }

  /**
   * Generate entity-enriched snippets
   */
  generateEntitySnippet(post: BlogPost, query: string, entities: EntityMention[]): string {
    let snippet = post.excerpt || post.content.substring(0, 200)
    
    // Highlight entities in snippet
    entities.forEach(entity => {
      const regex = new RegExp(`\\b${entity.name}\\b`, 'gi')
      snippet = snippet.replace(regex, `**${entity.name}**`)
    })

    // Highlight query terms
    const queryTerms = query.split(/\s+/)
    queryTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi')
      snippet = snippet.replace(regex, `*${term}*`)
    })

    return snippet + '...'
  }

  /**
   * Calculate relevance boost based on entity matches
   */
  private calculateEntityRelevanceBoost(entities: EntityMention[], query: string): number {
    if (entities.length === 0) return 0

    let boost = 0
    const queryLower = query.toLowerCase()

    entities.forEach(entity => {
      // Higher boost for exact matches
      if (entity.name.toLowerCase() === queryLower) {
        boost += 0.5 * entity.confidence
      }
      // Medium boost for partial matches
      else if (entity.name.toLowerCase().includes(queryLower) || 
               queryLower.includes(entity.name.toLowerCase())) {
        boost += 0.3 * entity.confidence
      }
      // Small boost for related entities
      else {
        boost += 0.1 * entity.confidence
      }

      // Additional boost for high-confidence entities
      if (entity.confidence > 0.8) {
        boost += 0.1
      }

      // Sentiment-based boost
      if (entity.sentiment === 'positive') {
        boost += 0.05
      }
    })

    return Math.min(boost, 1.0) // Cap boost at 1.0
  }

  /**
   * Find entity matches in search query
   */
  private findEntityMatches(entities: EntityMention[], query: string): EntityMention[] {
    if (!entities) return []
    
    const queryLower = query.toLowerCase()
    
    return entities.filter(entity => {
      return entity.name.toLowerCase().includes(queryLower) ||
             queryLower.includes(entity.name.toLowerCase()) ||
             (entity.context && entity.context.toLowerCase().includes(queryLower))
    })
  }

  /**
   * Combine regular and entity-based search results
   */
  private combineSearchResults(
    regularResults: SearchResult[], 
    entityResults: SearchResult[]
  ): SearchResult[] {
    const combined = new Map<string, SearchResult>()

    // Add regular results
    regularResults.forEach(result => {
      combined.set(result.post.slug, result)
    })

    // Add or merge entity results
    entityResults.forEach(result => {
      const existing = combined.get(result.post.slug)
      if (existing) {
        // Merge entity information
        existing.relevanceScore = Math.max(existing.relevanceScore, result.relevanceScore)
        existing.entityMatches = [
          ...(existing.entityMatches || []),
          ...(result.entityMatches || [])
        ]
        existing.highlights = [
          ...(existing.highlights || []),
          ...(result.highlights || [])
        ]
      } else {
        combined.set(result.post.slug, result)
      }
    })

    return Array.from(combined.values())
  }

  /**
   * Get integration statistics
   */
  getIntegrationStats(): object {
    return {
      enhancedResults: this.entityEnhancedResults.size,
      entityExtractorStats: this.entityExtractor.getExtractionStats(),
      searchEngineStats: this.searchEngine.getStats(),
      lastActivity: new Date().toISOString()
    }
  }
}