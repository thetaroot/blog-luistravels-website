/**
 * Entity Extractor - PHASE 5 SEO-PERFECTION-2025
 * Advanced Named Entity Recognition with Knowledge Graph Integration
 * SENIOR GOOGLE SEO DEV Level Implementation for Entity-based SEO
 */

import { EntityMention, BlogPost, KnowledgeGraphEntity } from '@/lib/blog/types'

interface EntityPattern {
  pattern: RegExp
  type: 'Place' | 'Organization' | 'Person' | 'Activity' | 'Cultural' | 'Food' | 'Transport'
  confidence: number
  category?: string
}

interface EntityContext {
  entity: string
  context: string
  sentiment: 'positive' | 'neutral' | 'negative'
  relevance: number
}

interface WikidataEntity {
  id: string
  label: string
  description: string
  aliases: string[]
  claims: { [property: string]: any }
  sitelinks: { [site: string]: string }
}

export class EntityExtractor {
  private entityPatterns: Map<string, EntityPattern[]> = new Map()
  private knowledgeGraph: Map<string, KnowledgeGraphEntity> = new Map()
  private entityCache: Map<string, EntityMention[]> = new Map()
  private wikidataCache: Map<string, WikidataEntity> = new Map()
  private initialized: boolean = false

  constructor() {
    this.initializeEntityPatterns()
  }

  /**
   * Initialize entity recognition patterns for travel content
   */
  private initializeEntityPatterns(): void {
    console.log('🏷️ Initializing entity recognition patterns...')

    // Geographic entities
    this.entityPatterns.set('Place', [
      { pattern: /\b(thailand|thai)\b/gi, type: 'Place', confidence: 0.95, category: 'Country' },
      { pattern: /\b(colombia|colombian)\b/gi, type: 'Place', confidence: 0.95, category: 'Country' },
      { pattern: /\b(vietnam|vietnamese)\b/gi, type: 'Place', confidence: 0.95, category: 'Country' },
      { pattern: /\b(indonesia|indonesian)\b/gi, type: 'Place', confidence: 0.95, category: 'Country' },
      { pattern: /\b(india|indian)\b/gi, type: 'Place', confidence: 0.95, category: 'Country' },
      { pattern: /\b(nepal|nepalese)\b/gi, type: 'Place', confidence: 0.95, category: 'Country' },
      { pattern: /\bbangkok\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bchiang mai\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bphuket\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bkrabi\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bbogota\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bmedellin\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bcartagena\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bho chi minh\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bhanoi\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bda nang\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bbali\b/gi, type: 'Place', confidence: 0.95, category: 'Island' },
      { pattern: /\bjakarta\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\byogyakarta\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bdelhi\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bmumbai\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bgoa\b/gi, type: 'Place', confidence: 0.95, category: 'State' },
      { pattern: /\bkerala\b/gi, type: 'Place', confidence: 0.95, category: 'State' },
      { pattern: /\bkathmandu\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\bpokhara\b/gi, type: 'Place', confidence: 0.95, category: 'City' },
      { pattern: /\beverest\b/gi, type: 'Place', confidence: 0.95, category: 'Mountain' }
    ])

    // Activity entities  
    this.entityPatterns.set('Activity', [
      { pattern: /\btrekking\b/gi, type: 'Activity', confidence: 0.9, category: 'Adventure' },
      { pattern: /\bhiking\b/gi, type: 'Activity', confidence: 0.9, category: 'Adventure' },
      { pattern: /\bsnorkeling\b/gi, type: 'Activity', confidence: 0.9, category: 'Water Sports' },
      { pattern: /\bdiving\b/gi, type: 'Activity', confidence: 0.9, category: 'Water Sports' },
      { pattern: /\bsurfing\b/gi, type: 'Activity', confidence: 0.9, category: 'Water Sports' },
      { pattern: /\brock climbing\b/gi, type: 'Activity', confidence: 0.9, category: 'Adventure' },
      { pattern: /\bmountain climbing\b/gi, type: 'Activity', confidence: 0.9, category: 'Adventure' },
      { pattern: /\btemple hopping\b/gi, type: 'Activity', confidence: 0.85, category: 'Cultural' },
      { pattern: /\bstreet food\b/gi, type: 'Activity', confidence: 0.9, category: 'Food' },
      { pattern: /\bcooking class\b/gi, type: 'Activity', confidence: 0.85, category: 'Food' },
      { pattern: /\bmassage\b/gi, type: 'Activity', confidence: 0.8, category: 'Wellness' },
      { pattern: /\byoga\b/gi, type: 'Activity', confidence: 0.8, category: 'Wellness' },
      { pattern: /\bmeditation\b/gi, type: 'Activity', confidence: 0.8, category: 'Wellness' }
    ])

    // Cultural entities
    this.entityPatterns.set('Cultural', [
      { pattern: /\bbuddhist temple\b/gi, type: 'Cultural', confidence: 0.9, category: 'Religion' },
      { pattern: /\bhindu temple\b/gi, type: 'Cultural', confidence: 0.9, category: 'Religion' },
      { pattern: /\bwat\s+\w+/gi, type: 'Cultural', confidence: 0.85, category: 'Temple' },
      { pattern: /\bfestival\b/gi, type: 'Cultural', confidence: 0.8, category: 'Event' },
      { pattern: /\bceremony\b/gi, type: 'Cultural', confidence: 0.8, category: 'Event' },
      { pattern: /\btraditional\s+\w+/gi, type: 'Cultural', confidence: 0.75, category: 'Tradition' },
      { pattern: /\bheritage\s+site\b/gi, type: 'Cultural', confidence: 0.9, category: 'Heritage' },
      { pattern: /\bworld heritage\b/gi, type: 'Cultural', confidence: 0.95, category: 'UNESCO' }
    ])

    // Food entities
    this.entityPatterns.set('Food', [
      { pattern: /\bpad thai\b/gi, type: 'Food', confidence: 0.95, category: 'Thai Cuisine' },
      { pattern: /\btom yum\b/gi, type: 'Food', confidence: 0.95, category: 'Thai Cuisine' },
      { pattern: /\bgreen curry\b/gi, type: 'Food', confidence: 0.9, category: 'Thai Cuisine' },
      { pattern: /\bmassaman\b/gi, type: 'Food', confidence: 0.9, category: 'Thai Cuisine' },
      { pattern: /\bsom tam\b/gi, type: 'Food', confidence: 0.9, category: 'Thai Cuisine' },
      { pattern: /\barepas\b/gi, type: 'Food', confidence: 0.95, category: 'Colombian Cuisine' },
      { pattern: /\bempanadas\b/gi, type: 'Food', confidence: 0.9, category: 'Latin Cuisine' },
      { pattern: /\bbandeja paisa\b/gi, type: 'Food', confidence: 0.95, category: 'Colombian Cuisine' },
      { pattern: /\bpho\b/gi, type: 'Food', confidence: 0.95, category: 'Vietnamese Cuisine' },
      { pattern: /\bbanh mi\b/gi, type: 'Food', confidence: 0.95, category: 'Vietnamese Cuisine' },
      { pattern: /\bnasi goreng\b/gi, type: 'Food', confidence: 0.95, category: 'Indonesian Cuisine' },
      { pattern: /\brendang\b/gi, type: 'Food', confidence: 0.95, category: 'Indonesian Cuisine' },
      { pattern: /\bgado gado\b/gi, type: 'Food', confidence: 0.9, category: 'Indonesian Cuisine' },
      { pattern: /\bcurry\b/gi, type: 'Food', confidence: 0.8, category: 'Asian Cuisine' },
      { pattern: /\bdal\b/gi, type: 'Food', confidence: 0.85, category: 'Indian Cuisine' },
      { pattern: /\bbiryani\b/gi, type: 'Food', confidence: 0.9, category: 'Indian Cuisine' },
      { pattern: /\bmomo\b/gi, type: 'Food', confidence: 0.9, category: 'Nepali Cuisine' }
    ])

    // Transportation entities
    this.entityPatterns.set('Transport', [
      { pattern: /\btuk tuk\b/gi, type: 'Transport', confidence: 0.95, category: 'Local Transport' },
      { pattern: /\bsongthaew\b/gi, type: 'Transport', confidence: 0.9, category: 'Local Transport' },
      { pattern: /\bmotorbike taxi\b/gi, type: 'Transport', confidence: 0.85, category: 'Local Transport' },
      { pattern: /\bscooter\b/gi, type: 'Transport', confidence: 0.8, category: 'Vehicle' },
      { pattern: /\blongtail boat\b/gi, type: 'Transport', confidence: 0.9, category: 'Water Transport' },
      { pattern: /\bferry\b/gi, type: 'Transport', confidence: 0.8, category: 'Water Transport' },
      { pattern: /\bovernight bus\b/gi, type: 'Transport', confidence: 0.85, category: 'Long Distance' },
      { pattern: /\bsleeper train\b/gi, type: 'Transport', confidence: 0.85, category: 'Long Distance' },
      { pattern: /\bbudget airline\b/gi, type: 'Transport', confidence: 0.8, category: 'Air Travel' }
    ])

    // Organization entities (hotels, agencies, etc.)
    this.entityPatterns.set('Organization', [
      { pattern: /\bhostel\b/gi, type: 'Organization', confidence: 0.8, category: 'Accommodation' },
      { pattern: /\bguesthouse\b/gi, type: 'Organization', confidence: 0.8, category: 'Accommodation' },
      { pattern: /\bresort\b/gi, type: 'Organization', confidence: 0.8, category: 'Accommodation' },
      { pattern: /\btravel agency\b/gi, type: 'Organization', confidence: 0.85, category: 'Service' },
      { pattern: /\btour operator\b/gi, type: 'Organization', confidence: 0.85, category: 'Service' },
      { pattern: /\bnational park\b/gi, type: 'Organization', confidence: 0.9, category: 'Protected Area' },
      { pattern: /\bwildlife sanctuary\b/gi, type: 'Organization', confidence: 0.9, category: 'Protected Area' }
    ])

    console.log(`✅ Initialized ${Array.from(this.entityPatterns.values()).reduce((sum, patterns) => sum + patterns.length, 0)} entity patterns`)
  }

  /**
   * Extract entities from blog post content
   */
  async extractEntities(post: BlogPost): Promise<EntityMention[]> {
    console.log(`🔍 Extracting entities from: ${post.title}`)

    // Check cache first
    const cacheKey = post.slug
    if (this.entityCache.has(cacheKey)) {
      return this.entityCache.get(cacheKey)!
    }

    const entities: EntityMention[] = []
    const content = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()

    // Extract entities using patterns
    for (const [entityType, patterns] of this.entityPatterns) {
      for (const pattern of patterns) {
        const matches = content.match(pattern.pattern)
        if (matches) {
          for (const match of matches) {
            const entityName = this.normalizeEntityName(match)
            const context = this.extractEntityContext(content, match)
            
            // Avoid duplicates
            const existingEntity = entities.find(e => 
              e.name.toLowerCase() === entityName.toLowerCase() && e.type === pattern.type
            )

            if (!existingEntity) {
              const entity: EntityMention = {
                type: pattern.type,
                name: entityName,
                confidence: pattern.confidence,
                context: context.context,
                category: pattern.category,
                sentiment: context.sentiment,
                relevance: context.relevance,
                knowledgeGraphId: await this.getKnowledgeGraphId(entityName, pattern.type)
              }

              entities.push(entity)
            }
          }
        }
      }
    }

    // Enhance entities with knowledge graph data
    const enhancedEntities = await this.enhanceWithKnowledgeGraph(entities)

    // Cache results
    this.entityCache.set(cacheKey, enhancedEntities)

    console.log(`🏷️ Extracted ${enhancedEntities.length} entities from ${post.title}`)
    return enhancedEntities
  }

  /**
   * Extract entities from multiple posts in batch
   */
  async batchExtractEntities(posts: BlogPost[]): Promise<Map<string, EntityMention[]>> {
    console.log(`🔍 Batch extracting entities from ${posts.length} posts...`)
    
    const results = new Map<string, EntityMention[]>()
    const startTime = Date.now()

    // Process posts in parallel batches
    const batchSize = 10
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize)
      const batchPromises = batch.map(async (post) => {
        try {
          const entities = await this.extractEntities(post)
          results.set(post.slug, entities)
        } catch (error) {
          console.warn(`Failed to extract entities from ${post.slug}:`, error)
          results.set(post.slug, [])
        }
      })

      await Promise.all(batchPromises)
      console.log(`📊 Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(posts.length / batchSize)}`)
    }

    const processingTime = Date.now() - startTime
    console.log(`✅ Batch entity extraction completed in ${processingTime}ms`)

    return results
  }

  /**
   * Build knowledge graph from extracted entities
   */
  async buildKnowledgeGraph(entities: Map<string, EntityMention[]>): Promise<Map<string, KnowledgeGraphEntity>> {
    console.log('🕸️ Building knowledge graph...')

    const knowledgeGraph = new Map<string, KnowledgeGraphEntity>()
    const entityFrequency = new Map<string, number>()
    const entityConnections = new Map<string, Set<string>>()

    // Calculate entity frequencies and co-occurrences
    entities.forEach((postEntities, postSlug) => {
      // Count entity frequencies
      postEntities.forEach(entity => {
        const key = `${entity.type}:${entity.name.toLowerCase()}`
        entityFrequency.set(key, (entityFrequency.get(key) || 0) + 1)
      })

      // Calculate entity co-occurrences
      for (let i = 0; i < postEntities.length; i++) {
        for (let j = i + 1; j < postEntities.length; j++) {
          const entity1 = `${postEntities[i].type}:${postEntities[i].name.toLowerCase()}`
          const entity2 = `${postEntities[j].type}:${postEntities[j].name.toLowerCase()}`
          
          if (!entityConnections.has(entity1)) {
            entityConnections.set(entity1, new Set())
          }
          if (!entityConnections.has(entity2)) {
            entityConnections.set(entity2, new Set())
          }
          
          entityConnections.get(entity1)!.add(entity2)
          entityConnections.get(entity2)!.add(entity1)
        }
      }
    })

    // Build knowledge graph entities
    entityFrequency.forEach((frequency, entityKey) => {
      const [type, name] = entityKey.split(':')
      const connections = Array.from(entityConnections.get(entityKey) || [])
      
      const kgEntity: KnowledgeGraphEntity = {
        id: entityKey,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        type: type as any,
        frequency,
        connections,
        confidence: this.calculateEntityConfidence(frequency, connections.length),
        properties: {},
        relatedPosts: this.getPostsContainingEntity(entities, entityKey),
        lastUpdated: new Date().toISOString()
      }

      knowledgeGraph.set(entityKey, kgEntity)
    })

    console.log(`🕸️ Built knowledge graph with ${knowledgeGraph.size} entities`)
    this.knowledgeGraph = knowledgeGraph
    
    return knowledgeGraph
  }

  /**
   * Get entity recommendations based on knowledge graph
   */
  async getEntityRecommendations(entityName: string, entityType: string, limit: number = 10): Promise<KnowledgeGraphEntity[]> {
    const entityKey = `${entityType}:${entityName.toLowerCase()}`
    const entity = this.knowledgeGraph.get(entityKey)
    
    if (!entity) {
      return []
    }

    // Get connected entities and rank by relevance
    const recommendations: KnowledgeGraphEntity[] = []
    
    entity.connections.forEach(connectionKey => {
      const connectedEntity = this.knowledgeGraph.get(connectionKey)
      if (connectedEntity) {
        recommendations.push(connectedEntity)
      }
    })

    // Sort by frequency and confidence
    return recommendations
      .sort((a, b) => (b.frequency * b.confidence) - (a.frequency * a.confidence))
      .slice(0, limit)
  }

  /**
   * Get knowledge graph statistics
   */
  getKnowledgeGraphStats(): object {
    const entities = Array.from(this.knowledgeGraph.values())
    const totalConnections = entities.reduce((sum, entity) => sum + entity.connections.length, 0)
    
    const typeDistribution = entities.reduce((dist, entity) => {
      dist[entity.type] = (dist[entity.type] || 0) + 1
      return dist
    }, {} as { [key: string]: number })

    return {
      totalEntities: entities.length,
      totalConnections: totalConnections / 2, // Divide by 2 as connections are bidirectional
      averageConnections: totalConnections / entities.length,
      typeDistribution,
      mostConnectedEntity: entities.sort((a, b) => b.connections.length - a.connections.length)[0]?.name || 'None',
      mostFrequentEntity: entities.sort((a, b) => b.frequency - a.frequency)[0]?.name || 'None',
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Export knowledge graph for external use
   */
  exportKnowledgeGraph(): object {
    const nodes = Array.from(this.knowledgeGraph.values()).map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      frequency: entity.frequency,
      confidence: entity.confidence
    }))

    const edges: { source: string; target: string; weight: number }[] = []
    this.knowledgeGraph.forEach((entity, entityKey) => {
      entity.connections.forEach(connection => {
        if (entityKey < connection) { // Avoid duplicate edges
          edges.push({
            source: entityKey,
            target: connection,
            weight: entity.frequency + (this.knowledgeGraph.get(connection)?.frequency || 0)
          })
        }
      })
    })

    return {
      nodes,
      edges,
      stats: this.getKnowledgeGraphStats()
    }
  }

  // Private helper methods

  private normalizeEntityName(entityName: string): string {
    return entityName.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  private extractEntityContext(content: string, entity: string): EntityContext {
    const entityIndex = content.toLowerCase().indexOf(entity.toLowerCase())
    const contextStart = Math.max(0, entityIndex - 50)
    const contextEnd = Math.min(content.length, entityIndex + entity.length + 50)
    const context = content.substring(contextStart, contextEnd)

    // Simple sentiment analysis (in production, use proper NLP library)
    const positiveWords = ['amazing', 'beautiful', 'incredible', 'fantastic', 'wonderful', 'great', 'excellent', 'perfect']
    const negativeWords = ['terrible', 'awful', 'horrible', 'disappointing', 'bad', 'worst', 'hate']
    
    const contextLower = context.toLowerCase()
    const positiveCount = positiveWords.filter(word => contextLower.includes(word)).length
    const negativeCount = negativeWords.filter(word => contextLower.includes(word)).length
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (positiveCount > negativeCount) sentiment = 'positive'
    else if (negativeCount > positiveCount) sentiment = 'negative'

    // Calculate relevance based on context richness
    const relevance = Math.min(1.0, (context.length / 100) * 0.8 + 0.2)

    return { entity, context, sentiment, relevance }
  }

  private async getKnowledgeGraphId(entityName: string, entityType: string): Promise<string | undefined> {
    // In production, this would query Wikidata or other knowledge bases
    // For now, return a generated ID
    return `kg:${entityType.toLowerCase()}:${entityName.toLowerCase().replace(/\s+/g, '-')}`
  }

  private async enhanceWithKnowledgeGraph(entities: EntityMention[]): Promise<EntityMention[]> {
    // In production, this would fetch additional data from Wikidata, DBpedia, etc.
    // For now, return entities as-is
    return entities
  }

  private calculateEntityConfidence(frequency: number, connectionCount: number): number {
    // Calculate confidence based on frequency and connections
    const frequencyScore = Math.min(1.0, frequency / 10) // Normalize to max frequency of 10
    const connectionScore = Math.min(1.0, connectionCount / 20) // Normalize to max connections of 20
    
    return (frequencyScore * 0.6) + (connectionScore * 0.4)
  }

  private getPostsContainingEntity(entities: Map<string, EntityMention[]>, entityKey: string): string[] {
    const posts: string[] = []
    const [type, name] = entityKey.split(':')
    
    entities.forEach((postEntities, postSlug) => {
      const hasEntity = postEntities.some(entity => 
        entity.type.toLowerCase() === type && 
        entity.name.toLowerCase() === name
      )
      
      if (hasEntity) {
        posts.push(postSlug)
      }
    })
    
    return posts
  }

  /**
   * Clear caches to free memory
   */
  clearCache(): void {
    this.entityCache.clear()
    this.wikidataCache.clear()
    console.log('🧹 Entity caches cleared')
  }

  /**
   * Get extraction statistics
   */
  getExtractionStats(): object {
    return {
      totalPatterns: Array.from(this.entityPatterns.values()).reduce((sum, patterns) => sum + patterns.length, 0),
      cachedExtractions: this.entityCache.size,
      knowledgeGraphSize: this.knowledgeGraph.size,
      initialized: this.initialized,
      lastActivity: new Date().toISOString()
    }
  }
}