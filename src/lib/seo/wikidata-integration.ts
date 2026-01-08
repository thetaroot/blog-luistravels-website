/**
 * 🎯 WIKIDATA INTEGRATION FOR ENTITY AUTHORITY
 * 10/10 Knowledge Graph Connectivity & Entity Validation
 */

export interface WikidataEntity {
  id: string
  label: string
  description: string
  aliases: string[]
  claims: WikidataClaim[]
  sitelinks: WikidataSitelink[]
}

export interface WikidataClaim {
  property: string
  value: any
  datatype: string
  references?: WikidataReference[]
}

export interface WikidataSitelink {
  site: string
  title: string
  url: string
}

export interface WikidataReference {
  property: string
  value: string
}

export interface EntityEnhancement {
  originalEntity: string
  wikidataId: string
  enhancedData: WikidataEntity
  confidence: number
  authorityScore: number
}

/**
 * Wikidata SPARQL Query Service
 */
export class WikidataService {
  private static readonly SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'
  private static readonly ENTITY_ENDPOINT = 'https://www.wikidata.org/wiki/Special:EntityData'
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Search for entities by name
   */
  static async searchEntities(entityName: string, language = 'en'): Promise<WikidataEntity[]> {
    const query = `
      SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {
        ?item rdfs:label "${entityName}"@${language} .
        OPTIONAL { ?item schema:description ?itemDescription . }
        FILTER(LANG(?itemDescription) = "${language}")
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "${language}". 
        }
      }
      LIMIT 10
    `
    
    try {
      const response = await this.executeSparqlQuery(query)
      return this.parseSearchResults(response)
    } catch (error) {
      console.error('Wikidata entity search failed:', error)
      return []
    }
  }

  /**
   * Get detailed entity information
   */
  static async getEntityDetails(wikidataId: string): Promise<WikidataEntity | null> {
    try {
      // Check cache first
      const cached = this.getCachedEntity(wikidataId)
      if (cached) return cached

      const response = await fetch(`${this.ENTITY_ENDPOINT}/${wikidataId}.json`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch entity ${wikidataId}`)
      }
      
      const data = await response.json()
      const entity = this.parseEntityData(data.entities[wikidataId])
      
      // Cache the result
      this.cacheEntity(wikidataId, entity)
      
      return entity
    } catch (error) {
      console.error(`Failed to get entity details for ${wikidataId}:`, error)
      return null
    }
  }

  /**
   * Find related entities for topic clustering
   */
  static async findRelatedEntities(wikidataId: string): Promise<WikidataEntity[]> {
    const query = `
      SELECT DISTINCT ?related ?relatedLabel ?relatedDescription ?property WHERE {
        {
          wd:${wikidataId} ?property ?related .
          ?related rdfs:label ?relatedLabel .
          FILTER(LANG(?relatedLabel) = "en")
          OPTIONAL { ?related schema:description ?relatedDescription . }
          FILTER(LANG(?relatedDescription) = "en")
        }
        UNION
        {
          ?related ?property wd:${wikidataId} .
          ?related rdfs:label ?relatedLabel .
          FILTER(LANG(?relatedLabel) = "en")
          OPTIONAL { ?related schema:description ?relatedDescription . }
          FILTER(LANG(?relatedDescription) = "en")
        }
        FILTER(?related != wd:${wikidataId})
        FILTER(STRSTARTS(STR(?related), "http://www.wikidata.org/entity/Q"))
      }
      LIMIT 20
    `
    
    try {
      const response = await this.executeSparqlQuery(query)
      return this.parseSearchResults(response)
    } catch (error) {
      console.error('Failed to find related entities:', error)
      return []
    }
  }

  /**
   * Get entity authority score based on Wikidata metrics
   */
  static async calculateEntityAuthority(wikidataId: string): Promise<number> {
    const query = `
      SELECT (COUNT(DISTINCT ?sitelink) AS ?sitelinks) 
             (COUNT(DISTINCT ?statement) AS ?statements)
             (COUNT(DISTINCT ?reference) AS ?references) WHERE {
        wd:${wikidataId} ?property ?statement .
        OPTIONAL { wd:${wikidataId} schema:about ?sitelink . }
        OPTIONAL { ?statementNode prov:wasDerivedFrom ?reference . }
      }
    `
    
    try {
      const response = await this.executeSparqlQuery(query)
      const result = response.results.bindings[0]
      
      const sitelinks = parseInt(result.sitelinks?.value || '0')
      const statements = parseInt(result.statements?.value || '0')
      const references = parseInt(result.references?.value || '0')
      
      // Calculate authority score (0-100)
      const authorityScore = Math.min(100, 
        (sitelinks * 2) + (statements * 0.5) + (references * 1)
      )
      
      return authorityScore / 100 // Normalize to 0-1
    } catch (error) {
      console.error('Failed to calculate entity authority:', error)
      return 0
    }
  }

  /**
   * Execute SPARQL query against Wikidata
   */
  private static async executeSparqlQuery(query: string): Promise<any> {
    const response = await fetch(this.SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'HereThereGone-SEO-Bot/1.0 (https://heretheregone.com/contact)'
      },
      body: `query=${encodeURIComponent(query)}`
    })

    if (!response.ok) {
      throw new Error(`SPARQL query failed: ${response.status}`)
    }

    return await response.json()
  }

  /**
   * Parse search results from SPARQL response
   */
  private static parseSearchResults(response: any): WikidataEntity[] {
    return response.results.bindings.map((binding: any) => ({
      id: this.extractEntityId(binding.item.value),
      label: binding.itemLabel?.value || '',
      description: binding.itemDescription?.value || '',
      aliases: [],
      claims: [],
      sitelinks: []
    }))
  }

  /**
   * Parse detailed entity data
   */
  private static parseEntityData(entityData: any): WikidataEntity {
    const entity: WikidataEntity = {
      id: entityData.id,
      label: entityData.labels?.en?.value || '',
      description: entityData.descriptions?.en?.value || '',
      aliases: entityData.aliases?.en?.map((alias: any) => alias.value) || [],
      claims: [],
      sitelinks: []
    }

    // Parse claims
    if (entityData.claims) {
      Object.entries(entityData.claims).forEach(([property, claims]: [string, any]) => {
        claims.forEach((claim: any) => {
          entity.claims.push({
            property,
            value: this.extractClaimValue(claim),
            datatype: claim.mainsnak?.datatype || 'unknown'
          })
        })
      })
    }

    // Parse sitelinks
    if (entityData.sitelinks) {
      Object.entries(entityData.sitelinks).forEach(([site, sitelink]: [string, any]) => {
        entity.sitelinks.push({
          site,
          title: sitelink.title,
          url: sitelink.url || `https://${site}.wikipedia.org/wiki/${sitelink.title}`
        })
      })
    }

    return entity
  }

  /**
   * Extract claim value from Wikidata claim structure
   */
  private static extractClaimValue(claim: any): any {
    const snak = claim.mainsnak
    
    if (!snak || snak.snaktype !== 'value') {
      return null
    }

    switch (snak.datatype) {
      case 'wikibase-item':
        return snak.datavalue?.value?.id
      case 'string':
      case 'url':
        return snak.datavalue?.value
      case 'time':
        return snak.datavalue?.value?.time
      case 'quantity':
        return snak.datavalue?.value?.amount
      default:
        return snak.datavalue?.value
    }
  }

  /**
   * Extract entity ID from Wikidata URI
   */
  private static extractEntityId(uri: string): string {
    return uri.split('/').pop() || ''
  }

  /**
   * Cache management
   */
  private static getCachedEntity(wikidataId: string): WikidataEntity | null {
    if (typeof window === 'undefined') return null
    
    const cached = localStorage.getItem(`wikidata_${wikidataId}`)
    if (!cached) return null
    
    try {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < this.CACHE_TTL) {
        return data
      }
    } catch (error) {
      console.error('Failed to parse cached entity:', error)
    }
    
    return null
  }

  private static cacheEntity(wikidataId: string, entity: WikidataEntity): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(`wikidata_${wikidataId}`, JSON.stringify({
        data: entity,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Failed to cache entity:', error)
    }
  }
}

/**
 * Enhanced entity resolution with Wikidata
 */
export async function enhanceEntityWithWikidata(
  entityName: string,
  entityType?: string
): Promise<EntityEnhancement | null> {
  try {
    // Search for the entity
    const searchResults = await WikidataService.searchEntities(entityName)
    
    if (searchResults.length === 0) {
      return null
    }

    // Get the best match (first result for now, could be improved with ML)
    const bestMatch = searchResults[0]
    
    // Get detailed information
    const detailedEntity = await WikidataService.getEntityDetails(bestMatch.id)
    
    if (!detailedEntity) {
      return null
    }

    // Calculate authority score
    const authorityScore = await WikidataService.calculateEntityAuthority(bestMatch.id)
    
    return {
      originalEntity: entityName,
      wikidataId: bestMatch.id,
      enhancedData: detailedEntity,
      confidence: calculateMatchConfidence(entityName, detailedEntity),
      authorityScore
    }
  } catch (error) {
    console.error(`Failed to enhance entity "${entityName}":`, error)
    return null
  }
}

/**
 * Calculate match confidence between search term and Wikidata entity
 */
function calculateMatchConfidence(searchTerm: string, entity: WikidataEntity): number {
  const searchLower = searchTerm.toLowerCase()
  const labelLower = entity.label.toLowerCase()
  
  // Exact match
  if (searchLower === labelLower) {
    return 1.0
  }
  
  // Check aliases
  const aliasMatch = entity.aliases.some(alias => 
    alias.toLowerCase() === searchLower
  )
  if (aliasMatch) {
    return 0.95
  }
  
  // Partial match
  if (labelLower.includes(searchLower) || searchLower.includes(labelLower)) {
    return 0.8
  }
  
  // Description match
  if (entity.description.toLowerCase().includes(searchLower)) {
    return 0.6
  }
  
  return 0.3 // Default low confidence
}

/**
 * Build knowledge graph connections for a set of entities
 */
export async function buildKnowledgeGraphConnections(
  entities: string[]
): Promise<Map<string, EntityEnhancement[]>> {
  const connections = new Map<string, EntityEnhancement[]>()
  
  for (const entity of entities) {
    try {
      const enhancement = await enhanceEntityWithWikidata(entity)
      
      if (enhancement) {
        // Find related entities
        const relatedEntities = await WikidataService.findRelatedEntities(
          enhancement.wikidataId
        )
        
        // Enhance related entities
        const enhancedRelated: EntityEnhancement[] = []
        
        for (const related of relatedEntities.slice(0, 5)) { // Limit to 5 related
          const relatedEnhancement = await enhanceEntityWithWikidata(related.label)
          if (relatedEnhancement) {
            enhancedRelated.push(relatedEnhancement)
          }
        }
        
        connections.set(entity, enhancedRelated)
      }
    } catch (error) {
      console.error(`Failed to build connections for ${entity}:`, error)
    }
  }
  
  return connections
}

/**
 * Generate enhanced schema markup with Wikidata connections
 */
export async function generateEnhancedSchemaMarkup(
  originalSchema: any,
  entityEnhancements: EntityEnhancement[]
): Promise<any> {
  const enhancedSchema = { ...originalSchema }
  
  // Enhance knowsAbout with Wikidata IDs
  if (enhancedSchema.knowsAbout) {
    enhancedSchema.knowsAbout = enhancedSchema.knowsAbout.map((item: any) => {
      const enhancement = entityEnhancements.find(e => 
        e.originalEntity.toLowerCase() === item.name?.toLowerCase()
      )
      
      if (enhancement) {
        return {
          ...item,
          "@id": `https://www.wikidata.org/wiki/${enhancement.wikidataId}`,
          "sameAs": `https://www.wikidata.org/wiki/${enhancement.wikidataId}`,
          "description": enhancement.enhancedData.description,
          "alternateName": enhancement.enhancedData.aliases
        }
      }
      
      return item
    })
  }
  
  // Add sameAs references where applicable
  if (enhancedSchema.sameAs && !Array.isArray(enhancedSchema.sameAs)) {
    enhancedSchema.sameAs = [enhancedSchema.sameAs]
  }
  
  // Add Wikidata references for the main entity
  const mainEntityEnhancement = entityEnhancements.find(e => 
    e.originalEntity === enhancedSchema.name
  )
  
  if (mainEntityEnhancement) {
    enhancedSchema.sameAs = [
      ...(enhancedSchema.sameAs || []),
      `https://www.wikidata.org/wiki/${mainEntityEnhancement.wikidataId}`
    ]
    
    // Add Wikipedia links if available
    const wikipediaLinks = mainEntityEnhancement.enhancedData.sitelinks
      .filter(link => link.site.includes('wiki'))
      .map(link => link.url)
    
    enhancedSchema.sameAs = [
      ...enhancedSchema.sameAs,
      ...wikipediaLinks
    ]
  }
  
  return enhancedSchema
}

/**
 * Validate entity authority and suggest improvements
 */
export function analyzeEntityAuthority(enhancement: EntityEnhancement): {
  score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
} {
  const entity = enhancement.enhancedData
  const score = enhancement.authorityScore
  
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: string[] = []
  
  // Analyze strengths
  if (entity.sitelinks.length > 10) {
    strengths.push(`Strong Wikipedia presence (${entity.sitelinks.length} language versions)`)
  }
  
  if (entity.claims.length > 20) {
    strengths.push(`Rich data profile (${entity.claims.length} statements)`)
  }
  
  if (entity.aliases.length > 5) {
    strengths.push(`Multiple name variations recognized`)
  }
  
  // Analyze weaknesses
  if (entity.sitelinks.length < 3) {
    weaknesses.push('Limited Wikipedia coverage')
    recommendations.push('Consider contributing to Wikipedia to increase entity recognition')
  }
  
  if (entity.description.length < 50) {
    weaknesses.push('Brief entity description')
    recommendations.push('Provide more detailed descriptions in content')
  }
  
  if (entity.claims.length < 10) {
    weaknesses.push('Limited structured data')
    recommendations.push('Add more structured data about your expertise and work')
  }
  
  return {
    score,
    strengths,
    weaknesses,
    recommendations
  }
}