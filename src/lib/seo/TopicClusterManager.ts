/**
 * Topic Cluster Manager - PHASE 5 SEO-PERFECTION-2025
 * Intelligent content clustering for SEO dominance and internal linking
 * Machine Learning approach to topic analysis and cluster generation
 */

import { 
  BlogPost, 
  TopicCluster, 
  InternalLink, 
  EntityMention,
  SearchIndex 
} from '@/lib/blog/types'

interface ClusterAnalysis {
  coherenceScore: number
  topicStrength: number
  competitiveValue: number
  seoOpportunity: number
  recommendedActions: string[]
}

interface ContentSimilarity {
  post1: string
  post2: string
  similarity: number
  sharedKeywords: string[]
  sharedEntities: string[]
  sharedTopics: string[]
}

export class TopicClusterManager {
  private posts: Map<string, BlogPost> = new Map()
  private clusters: Map<string, TopicCluster> = new Map()
  private similarityMatrix: Map<string, Map<string, number>> = new Map()
  private contentVectors: Map<string, number[]> = new Map()

  /**
   * Generate intelligent topic clusters from blog posts
   */
  async generateClusters(posts: BlogPost[]): Promise<TopicCluster[]> {
    console.log(`🎯 Generating topic clusters for ${posts.length} posts...`)
    
    // Store posts for processing
    posts.forEach(post => this.posts.set(post.slug, post))
    
    // Phase 1: Content Analysis and Feature Extraction
    await this.extractContentFeatures(posts)
    
    // Phase 2: Calculate content similarities
    await this.calculateContentSimilarities(posts)
    
    // Phase 3: Geographic clustering (Thailand, Colombia, etc.)
    const geographicClusters = await this.createGeographicClusters(posts)
    
    // Phase 4: Activity-based clustering (food, temples, beaches, etc.)
    const activityClusters = await this.createActivityClusters(posts)
    
    // Phase 5: Content type clustering (guides, stories, tips)
    const contentTypeClusters = await this.createContentTypeClusters(posts)
    
    // Phase 6: Semantic clustering using similarity analysis
    const semanticClusters = await this.createSemanticClusters(posts)
    
    // Phase 7: Combine and optimize clusters
    const allClusters = [
      ...geographicClusters,
      ...activityClusters, 
      ...contentTypeClusters,
      ...semanticClusters
    ]
    
    // Phase 8: Optimize cluster quality and remove overlaps
    const optimizedClusters = await this.optimizeClusters(allClusters)
    
    // Phase 9: Analyze cluster quality and SEO potential
    await this.analyzeClusters(optimizedClusters)
    
    // Store clusters
    optimizedClusters.forEach(cluster => this.clusters.set(cluster.id, cluster))
    
    console.log(`✅ Generated ${optimizedClusters.length} optimized topic clusters`)
    return optimizedClusters
  }

  /**
   * Generate strategic internal links based on topic clusters
   */
  async generateInternalLinks(clusters: TopicCluster[]): Promise<InternalLink[]> {
    console.log('🔗 Generating strategic internal links...')
    
    const internalLinks: InternalLink[] = []
    const now = new Date().toISOString()

    // Strategy 1: Cluster-based linking (within same cluster)
    for (const cluster of clusters) {
      const clusterLinks = await this.generateClusterLinks(cluster)
      internalLinks.push(...clusterLinks.map(link => ({
        ...link,
        linkType: 'cluster' as const,
        createdAt: now,
        isActive: true
      })))
    }

    // Strategy 2: Hub-and-spoke linking (centroid post to others)
    for (const cluster of clusters) {
      if (cluster.centroidPost) {
        const hubLinks = await this.generateHubLinks(cluster)
        internalLinks.push(...hubLinks.map(link => ({
          ...link,
          linkType: 'contextual' as const,
          createdAt: now,
          isActive: true
        })))
      }
    }

    // Strategy 3: Entity-based linking (posts mentioning same entities)
    const entityLinks = await this.generateEntityBasedLinks()
    internalLinks.push(...entityLinks.map(link => ({
      ...link,
      linkType: 'entity' as const,
      createdAt: now,
      isActive: true
    })))

    // Strategy 4: Geographic proximity linking
    const geoLinks = await this.generateGeographicLinks()
    internalLinks.push(...geoLinks.map(link => ({
      ...link,
      linkType: 'related' as const,
      createdAt: now,
      isActive: true
    })))

    // Remove duplicates and rank by relevance
    const uniqueLinks = this.deduplicateLinks(internalLinks)
    const rankedLinks = uniqueLinks
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, Math.min(500, this.posts.size * 5)) // Max 5 links per post

    console.log(`✅ Generated ${rankedLinks.length} strategic internal links`)
    return rankedLinks
  }

  /**
   * Generate topic hub pages for SEO
   */
  async generateTopicPages(clusters: TopicCluster[]): Promise<void> {
    console.log('📄 Generating topic hub pages...')
    
    for (const cluster of clusters) {
      if (cluster.posts.length >= 3) { // Only create hubs for substantial clusters
        const hubPageUrl = `/topics/${this.slugify(cluster.name)}`
        
        // Update cluster with hub page URL
        cluster.hubPage = hubPageUrl
        
        console.log(`📄 Created hub page: ${hubPageUrl} for cluster "${cluster.name}"`)
      }
    }
  }

  /**
   * Extract content features for analysis
   */
  private async extractContentFeatures(posts: BlogPost[]): Promise<void> {
    console.log('🔍 Extracting content features...')
    
    for (const post of posts) {
      // Extract keywords using TF-IDF-like approach
      const keywords = this.extractKeywords(post.content + ' ' + post.title + ' ' + post.excerpt)
      
      // Extract topics from tags and content
      const topics = this.extractTopics(post)
      
      // Extract entities (locations, activities, etc.)
      const entities = this.extractBasicEntities(post)
      
      // Create feature vector
      const vector = this.createFeatureVector(keywords, topics, entities)
      this.contentVectors.set(post.slug, vector)
      
      // Store extracted features in post
      post.semanticKeywords = keywords.slice(0, 20) // Top 20 keywords
      post.entities = entities
      post.relatedTopics = topics
    }
  }

  /**
   * Calculate similarity between all post pairs
   */
  private async calculateContentSimilarities(posts: BlogPost[]): Promise<void> {
    console.log('🧮 Calculating content similarities...')
    
    for (let i = 0; i < posts.length; i++) {
      const post1 = posts[i]
      const similarities = new Map<string, number>()
      
      for (let j = i + 1; j < posts.length; j++) {
        const post2 = posts[j]
        
        // Calculate multiple similarity metrics
        const keywordSim = this.calculateKeywordSimilarity(post1, post2)
        const entitySim = this.calculateEntitySimilarity(post1, post2)
        const tagSim = this.calculateTagSimilarity(post1, post2)
        const geoSim = this.calculateGeographicSimilarity(post1, post2)
        
        // Weighted combination of similarities
        const overallSim = (
          keywordSim * 0.4 +
          entitySim * 0.3 +
          tagSim * 0.2 +
          geoSim * 0.1
        )
        
        similarities.set(post2.slug, overallSim)
      }
      
      this.similarityMatrix.set(post1.slug, similarities)
    }
  }

  /**
   * Create geographic clusters (Thailand, Colombia, etc.)
   */
  private async createGeographicClusters(posts: BlogPost[]): Promise<TopicCluster[]> {
    console.log('🌍 Creating geographic clusters...')
    
    const geoClusters = new Map<string, BlogPost[]>()
    
    // Known geographic regions for travel blog
    const geoRegions = [
      { name: 'Thailand', keywords: ['thailand', 'thai', 'bangkok', 'chiang mai', 'phuket', 'krabi'] },
      { name: 'Colombia', keywords: ['colombia', 'colombian', 'bogota', 'medellin', 'cartagena'] },
      { name: 'Vietnam', keywords: ['vietnam', 'vietnamese', 'ho chi minh', 'hanoi', 'da nang'] },
      { name: 'Indonesia', keywords: ['indonesia', 'indonesian', 'bali', 'jakarta', 'yogyakarta'] },
      { name: 'India', keywords: ['india', 'indian', 'delhi', 'mumbai', 'goa', 'kerala'] },
      { name: 'Nepal', keywords: ['nepal', 'nepalese', 'kathmandu', 'pokhara', 'everest'] },
      { name: 'Europe', keywords: ['europe', 'european', 'spain', 'germany', 'italy', 'france'] }
    ]
    
    // Classify posts by geographic regions
    posts.forEach(post => {
      const content = (post.content + ' ' + post.title + ' ' + post.excerpt + ' ' + 
                     post.tags.join(' ') + ' ' + (post.location || '')).toLowerCase()
      
      for (const region of geoRegions) {
        const matches = region.keywords.filter(keyword => content.includes(keyword))
        if (matches.length > 0 || post.countryCode?.toLowerCase().includes(region.name.toLowerCase())) {
          if (!geoClusters.has(region.name)) {
            geoClusters.set(region.name, [])
          }
          geoClusters.get(region.name)!.push(post)
          break // Assign to first matching region
        }
      }
    })
    
    // Convert to TopicCluster format
    const clusters: TopicCluster[] = []
    geoClusters.forEach((posts, regionName) => {
      if (posts.length >= 2) { // Minimum 2 posts per cluster
        clusters.push({
          id: `geo-${this.slugify(regionName)}`,
          name: `${regionName} Travel`,
          description: `Travel experiences and guides for ${regionName}`,
          posts: posts.map(p => p.slug),
          keywords: this.extractClusterKeywords(posts),
          centroidPost: this.findCentroidPost(posts),
          coherenceScore: this.calculateCoherence(posts),
          competitiveStrength: this.calculateCompetitiveStrength(posts),
          lastUpdated: new Date().toISOString()
        })
      }
    })
    
    return clusters
  }

  /**
   * Create activity-based clusters (food, temples, beaches, etc.)
   */
  private async createActivityClusters(posts: BlogPost[]): Promise<TopicCluster[]> {
    console.log('🏃‍♂️ Creating activity-based clusters...')
    
    const activityClusters = new Map<string, BlogPost[]>()
    
    // Travel activity categories
    const activities = [
      { name: 'Food & Cuisine', keywords: ['food', 'restaurant', 'cuisine', 'eat', 'dining', 'street food', 'cooking'] },
      { name: 'Temples & Culture', keywords: ['temple', 'culture', 'heritage', 'traditional', 'festival', 'ceremony'] },
      { name: 'Beaches & Islands', keywords: ['beach', 'island', 'ocean', 'snorkeling', 'diving', 'surf'] },
      { name: 'Trekking & Adventure', keywords: ['trek', 'hiking', 'mountain', 'adventure', 'climb', 'explore'] },
      { name: 'Cities & Urban', keywords: ['city', 'urban', 'downtown', 'nightlife', 'shopping', 'metro'] },
      { name: 'Nature & Wildlife', keywords: ['nature', 'wildlife', 'forest', 'national park', 'animals', 'jungle'] },
      { name: 'Transportation', keywords: ['transport', 'bus', 'train', 'flight', 'taxi', 'motorbike'] },
      { name: 'Accommodation', keywords: ['hotel', 'hostel', 'guesthouse', 'accommodation', 'stay', 'airbnb'] }
    ]
    
    // Classify posts by activities
    posts.forEach(post => {
      const content = (post.content + ' ' + post.title + ' ' + post.excerpt + ' ' + 
                     post.tags.join(' ')).toLowerCase()
      
      for (const activity of activities) {
        const matches = activity.keywords.filter(keyword => content.includes(keyword))
        if (matches.length >= 2) { // Require at least 2 keyword matches
          if (!activityClusters.has(activity.name)) {
            activityClusters.set(activity.name, [])
          }
          activityClusters.get(activity.name)!.push(post)
        }
      }
    })
    
    // Convert to TopicCluster format
    const clusters: TopicCluster[] = []
    activityClusters.forEach((posts, activityName) => {
      if (posts.length >= 2) {
        clusters.push({
          id: `activity-${this.slugify(activityName)}`,
          name: activityName,
          description: `Posts about ${activityName.toLowerCase()} during travel`,
          posts: posts.map(p => p.slug),
          keywords: this.extractClusterKeywords(posts),
          centroidPost: this.findCentroidPost(posts),
          coherenceScore: this.calculateCoherence(posts),
          competitiveStrength: this.calculateCompetitiveStrength(posts),
          lastUpdated: new Date().toISOString()
        })
      }
    })
    
    return clusters
  }

  /**
   * Create content type clusters (guides, stories, tips)
   */
  private async createContentTypeClusters(posts: BlogPost[]): Promise<TopicCluster[]> {
    console.log('📝 Creating content type clusters...')
    
    const typeClusters = new Map<string, BlogPost[]>()
    
    const contentTypes = [
      { name: 'Travel Guides', keywords: ['guide', 'how to', 'complete guide', 'ultimate guide', 'tips'] },
      { name: 'Travel Stories', keywords: ['story', 'experience', 'journey', 'adventure', 'happened'] },
      { name: 'Practical Tips', keywords: ['tips', 'advice', 'practical', 'budget', 'money', 'cost'] },
      { name: 'Photo Essays', keywords: ['photo', 'picture', 'gallery', 'visual', 'image'] },
      { name: 'Reviews', keywords: ['review', 'recommend', 'worth it', 'opinion', 'rating'] }
    ]
    
    posts.forEach(post => {
      const content = (post.title + ' ' + post.excerpt).toLowerCase()
      
      for (const type of contentTypes) {
        const matches = type.keywords.filter(keyword => content.includes(keyword))
        if (matches.length > 0) {
          if (!typeClusters.has(type.name)) {
            typeClusters.set(type.name, [])
          }
          typeClusters.get(type.name)!.push(post)
          break // Assign to first matching type
        }
      }
    })
    
    const clusters: TopicCluster[] = []
    typeClusters.forEach((posts, typeName) => {
      if (posts.length >= 3) { // Minimum 3 posts for content type clusters
        clusters.push({
          id: `type-${this.slugify(typeName)}`,
          name: typeName,
          description: `Collection of ${typeName.toLowerCase()} posts`,
          posts: posts.map(p => p.slug),
          keywords: this.extractClusterKeywords(posts),
          centroidPost: this.findCentroidPost(posts),
          coherenceScore: this.calculateCoherence(posts),
          competitiveStrength: this.calculateCompetitiveStrength(posts),
          lastUpdated: new Date().toISOString()
        })
      }
    })
    
    return clusters
  }

  /**
   * Create semantic clusters using similarity analysis
   */
  private async createSemanticClusters(posts: BlogPost[]): Promise<TopicCluster[]> {
    console.log('🧠 Creating semantic similarity clusters...')
    
    // Use hierarchical clustering based on content similarity
    const clusters: TopicCluster[] = []
    const processed = new Set<string>()
    
    posts.forEach(post => {
      if (processed.has(post.slug)) return
      
      // Find similar posts
      const similarPosts = this.findSimilarPosts(post, posts, 0.3) // 30% similarity threshold
      
      if (similarPosts.length >= 2) {
        const clusterPosts = [post, ...similarPosts]
        clusterPosts.forEach(p => processed.add(p.slug))
        
        clusters.push({
          id: `semantic-${this.generateClusterId()}`,
          name: this.generateClusterName(clusterPosts),
          description: this.generateClusterDescription(clusterPosts),
          posts: clusterPosts.map(p => p.slug),
          keywords: this.extractClusterKeywords(clusterPosts),
          centroidPost: this.findCentroidPost(clusterPosts),
          coherenceScore: this.calculateCoherence(clusterPosts),
          competitiveStrength: this.calculateCompetitiveStrength(clusterPosts),
          lastUpdated: new Date().toISOString()
        })
      }
    })
    
    return clusters
  }

  /**
   * Optimize clusters by removing overlaps and improving quality
   */
  private async optimizeClusters(clusters: TopicCluster[]): Promise<TopicCluster[]> {
    console.log('⚡ Optimizing clusters...')
    
    // Sort clusters by quality (coherence score + competitive strength)
    const sortedClusters = clusters.sort((a, b) => 
      (b.coherenceScore + b.competitiveStrength) - (a.coherenceScore + a.competitiveStrength)
    )
    
    // Remove overlapping clusters (posts can only belong to one primary cluster)
    const optimized: TopicCluster[] = []
    const assignedPosts = new Set<string>()
    
    for (const cluster of sortedClusters) {
      // Keep posts not already assigned to higher-quality clusters
      const availablePosts = cluster.posts.filter(postSlug => !assignedPosts.has(postSlug))
      
      if (availablePosts.length >= 2) { // Minimum cluster size
        cluster.posts = availablePosts
        availablePosts.forEach(postSlug => assignedPosts.add(postSlug))
        optimized.push(cluster)
      }
    }
    
    return optimized
  }

  /**
   * Analyze cluster quality and SEO potential
   */
  private async analyzeClusters(clusters: TopicCluster[]): Promise<void> {
    console.log('📊 Analyzing cluster quality...')
    
    clusters.forEach(cluster => {
      const analysis = this.analyzeCluster(cluster)
      console.log(`📊 Cluster "${cluster.name}": Coherence=${cluster.coherenceScore.toFixed(2)}, Competitive=${cluster.competitiveStrength.toFixed(2)}, Posts=${cluster.posts.length}`)
    })
  }

  // Helper methods for clustering algorithms

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (in production, use more sophisticated NLP)
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word))
      .slice(0, 50) // Top 50 keywords
  }

  private extractTopics(post: BlogPost): string[] {
    return [...post.tags, ...(post.category ? [post.category] : [])]
  }

  private extractBasicEntities(post: BlogPost): EntityMention[] {
    // Basic entity extraction (locations, activities)
    const entities: EntityMention[] = []
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    // Extract locations
    const locations = ['thailand', 'colombia', 'vietnam', 'indonesia', 'india', 'nepal']
    locations.forEach(location => {
      if (content.includes(location)) {
        entities.push({
          type: 'Place',
          name: location.charAt(0).toUpperCase() + location.slice(1),
          confidence: 0.8,
          context: location
        })
      }
    })
    
    return entities
  }

  private createFeatureVector(keywords: string[], topics: string[], entities: EntityMention[]): number[] {
    // Create simple feature vector (in production, use embeddings)
    const features: number[] = []
    
    // Add keyword features (top 20)
    keywords.slice(0, 20).forEach(() => features.push(1))
    
    // Add topic features
    topics.forEach(() => features.push(2))
    
    // Add entity features
    entities.forEach(() => features.push(3))
    
    return features
  }

  private calculateKeywordSimilarity(post1: BlogPost, post2: BlogPost): number {
    const keywords1 = new Set(post1.semanticKeywords || [])
    const keywords2 = new Set(post2.semanticKeywords || [])
    
    const intersection = new Set([...keywords1].filter(k => keywords2.has(k)))
    const union = new Set([...keywords1, ...keywords2])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  private calculateEntitySimilarity(post1: BlogPost, post2: BlogPost): number {
    const entities1 = new Set((post1.entities || []).map(e => e.name.toLowerCase()))
    const entities2 = new Set((post2.entities || []).map(e => e.name.toLowerCase()))
    
    const intersection = new Set([...entities1].filter(e => entities2.has(e)))
    const union = new Set([...entities1, ...entities2])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  private calculateTagSimilarity(post1: BlogPost, post2: BlogPost): number {
    const tags1 = new Set(post1.tags.map(t => t.toLowerCase()))
    const tags2 = new Set(post2.tags.map(t => t.toLowerCase()))
    
    const intersection = new Set([...tags1].filter(t => tags2.has(t)))
    const union = new Set([...tags1, ...tags2])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  private calculateGeographicSimilarity(post1: BlogPost, post2: BlogPost): number {
    if (post1.location && post2.location) {
      return post1.location.toLowerCase() === post2.location.toLowerCase() ? 1.0 : 0.0
    }
    if (post1.countryCode && post2.countryCode) {
      return post1.countryCode.toLowerCase() === post2.countryCode.toLowerCase() ? 0.8 : 0.0
    }
    return 0.0
  }

  private findSimilarPosts(targetPost: BlogPost, allPosts: BlogPost[], threshold: number): BlogPost[] {
    const similarities = this.similarityMatrix.get(targetPost.slug)
    if (!similarities) return []
    
    return allPosts.filter(post => {
      const similarity = similarities.get(post.slug) || 0
      return similarity >= threshold && post.slug !== targetPost.slug
    })
  }

  private extractClusterKeywords(posts: BlogPost[]): string[] {
    const keywordCounts = new Map<string, number>()
    
    posts.forEach(post => {
      (post.semanticKeywords || []).forEach(keyword => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1)
      })
    })
    
    return Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword]) => keyword)
  }

  private findCentroidPost(posts: BlogPost[]): string {
    // Find the post most similar to all others in the cluster
    let bestPost = posts[0].slug
    let bestScore = 0
    
    posts.forEach(post => {
      const similarities = this.similarityMatrix.get(post.slug)
      if (similarities) {
        const avgSimilarity = posts.reduce((sum, otherPost) => {
          return sum + (similarities.get(otherPost.slug) || 0)
        }, 0) / posts.length
        
        if (avgSimilarity > bestScore) {
          bestScore = avgSimilarity
          bestPost = post.slug
        }
      }
    })
    
    return bestPost
  }

  private calculateCoherence(posts: BlogPost[]): number {
    // Calculate how well posts fit together
    if (posts.length < 2) return 1.0
    
    let totalSimilarity = 0
    let comparisons = 0
    
    for (let i = 0; i < posts.length; i++) {
      for (let j = i + 1; j < posts.length; j++) {
        const sim1 = this.similarityMatrix.get(posts[i].slug)?.get(posts[j].slug) || 0
        const sim2 = this.similarityMatrix.get(posts[j].slug)?.get(posts[i].slug) || 0
        totalSimilarity += Math.max(sim1, sim2)
        comparisons++
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0
  }

  private calculateCompetitiveStrength(posts: BlogPost[]): number {
    // Estimate competitive strength based on post quality and engagement
    const avgViews = posts.reduce((sum, post) => sum + (post.views || 0), 0) / posts.length
    const avgQuality = posts.reduce((sum, post) => sum + (post.contentQuality || 0.5), 0) / posts.length
    
    return (avgViews / 1000 + avgQuality) / 2 // Normalize to 0-1 scale
  }

  private generateClusterId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private generateClusterName(posts: BlogPost[]): string {
    // Generate cluster name from most common keywords
    const keywords = this.extractClusterKeywords(posts)
    return keywords.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' & ')
  }

  private generateClusterDescription(posts: BlogPost[]): string {
    const keywords = this.extractClusterKeywords(posts)
    return `Posts about ${keywords.slice(0, 3).join(', ')} and related topics`
  }

  private analyzeCluster(cluster: TopicCluster): ClusterAnalysis {
    return {
      coherenceScore: cluster.coherenceScore,
      topicStrength: cluster.posts.length / 10, // Normalize by expected max cluster size
      competitiveValue: cluster.competitiveStrength,
      seoOpportunity: (cluster.coherenceScore + cluster.competitiveStrength) / 2,
      recommendedActions: this.generateClusterRecommendations(cluster)
    }
  }

  private generateClusterRecommendations(cluster: TopicCluster): string[] {
    const recommendations: string[] = []
    
    if (cluster.posts.length < 5) {
      recommendations.push('Create more content for this topic cluster')
    }
    
    if (cluster.coherenceScore < 0.5) {
      recommendations.push('Improve content consistency within cluster')
    }
    
    if (!cluster.hubPage) {
      recommendations.push('Create a topic hub page for this cluster')
    }
    
    return recommendations
  }

  // Internal linking generation methods
  private async generateClusterLinks(cluster: TopicCluster): Promise<Omit<InternalLink, 'linkType' | 'createdAt' | 'isActive'>[]> {
    const links: Omit<InternalLink, 'linkType' | 'createdAt' | 'isActive'>[] = []
    
    // Link each post to other posts in the same cluster
    for (let i = 0; i < cluster.posts.length; i++) {
      for (let j = i + 1; j < cluster.posts.length; j++) {
        const post1 = cluster.posts[i]
        const post2 = cluster.posts[j]
        
        // Calculate relevance score
        const similarity = this.similarityMatrix.get(post1)?.get(post2) || 0
        
        if (similarity > 0.3) { // 30% similarity threshold
          links.push({
            fromPost: post1,
            toPost: post2,
            anchorText: this.generateAnchorText(post1, post2),
            relevanceScore: similarity,
            position: 'content'
          })
        }
      }
    }
    
    return links
  }

  private async generateHubLinks(cluster: TopicCluster): Promise<Omit<InternalLink, 'linkType' | 'createdAt' | 'isActive'>[]> {
    const links: Omit<InternalLink, 'linkType' | 'createdAt' | 'isActive'>[] = []
    
    if (!cluster.centroidPost) return links
    
    // Link centroid post to all other posts in cluster
    cluster.posts.forEach(postSlug => {
      if (postSlug !== cluster.centroidPost) {
        links.push({
          fromPost: cluster.centroidPost!,
          toPost: postSlug,
          anchorText: this.generateAnchorText(cluster.centroidPost!, postSlug),
          relevanceScore: 0.8, // High relevance for hub links
          position: 'content'
        })
      }
    })
    
    return links
  }

  private async generateEntityBasedLinks(): Promise<Omit<InternalLink, 'linkType' | 'createdAt' | 'isActive'>[]> {
    // Implementation for entity-based linking
    return []
  }

  private async generateGeographicLinks(): Promise<Omit<InternalLink, 'linkType' | 'createdAt' | 'isActive'>[]> {
    // Implementation for geographic linking
    return []
  }

  private deduplicateLinks(links: InternalLink[]): InternalLink[] {
    const seen = new Set<string>()
    return links.filter(link => {
      const key = `${link.fromPost}-${link.toPost}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  private generateAnchorText(fromPost: string, toPost: string): string {
    const post = this.posts.get(toPost)
    return post ? post.title : 'Related post'
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
    ])
    return stopWords.has(word.toLowerCase())
  }

  /**
   * Get cluster statistics
   */
  getClusterStats(): object {
    return {
      totalClusters: this.clusters.size,
      totalPosts: this.posts.size,
      avgClusterSize: Array.from(this.clusters.values()).reduce((sum, cluster) => sum + cluster.posts.length, 0) / this.clusters.size,
      avgCoherence: Array.from(this.clusters.values()).reduce((sum, cluster) => sum + cluster.coherenceScore, 0) / this.clusters.size,
      lastUpdated: new Date().toISOString()
    }
  }
}