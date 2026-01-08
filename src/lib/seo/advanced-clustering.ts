/**
 * 🎯 ADVANCED TOPIC CLUSTERING SYSTEM
 * 10/10 SEO Dominance through Strategic Content Clustering
 */

import { BlogPost } from '@/types/blog'

export interface TopicCluster {
  id: string
  name: string
  pillarContent: string
  clusterPosts: string[]
  semanticKeywords: string[]
  entityConnections: string[]
  authorityScore: number
  lastUpdated: string
}

export interface InternalLink {
  url: string
  anchorText: string
  relevanceScore: number
  placement: 'introduction' | 'body' | 'conclusion'
  contextualSentence?: string
}

export interface SemanticRelation {
  sourcePost: string
  targetPost: string
  relationStrength: number
  sharedEntities: string[]
  sharedKeywords: string[]
}

/**
 * Advanced Topic Clusters for Digital Nomad Content
 */
export const advancedClusters: TopicCluster[] = [
  {
    id: 'digital-nomadism-hub',
    name: 'Digital Nomadism Mastery',
    pillarContent: '/blog/ultimate-digital-nomad-guide-2025',
    clusterPosts: [
      '/blog/remote-work-setup-nomads',
      '/blog/nomad-visa-complete-guide',
      '/blog/digital-nomad-tax-strategies',
      '/blog/location-independent-income-streams',
      '/blog/nomad-networking-communities',
      '/blog/digital-nomad-health-insurance'
    ],
    semanticKeywords: [
      'digital nomadism',
      'remote work',
      'location independence',
      'travel lifestyle',
      'nomad visa',
      'remote income',
      'workation'
    ],
    entityConnections: [
      'Digital Nomad',
      'Remote Work',
      'Travel',
      'Freelancing',
      'Location Independence'
    ],
    authorityScore: 95,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'travel-destinations-hub',
    name: 'Travel Destinations & Guides',
    pillarContent: '/blog/best-nomad-destinations-2025',
    clusterPosts: [
      '/blog/mexico-nomad-guide',
      '/blog/thailand-digital-nomad-hotspots',
      '/blog/portugal-nomad-visa-guide',
      '/blog/bali-coworking-spaces',
      '/blog/europe-nomad-friendly-cities',
      '/blog/south-america-budget-travel'
    ],
    semanticKeywords: [
      'travel destinations',
      'nomad-friendly cities',
      'coworking spaces',
      'cost of living',
      'visa requirements',
      'local culture',
      'nomad community'
    ],
    entityConnections: [
      'Travel Destination',
      'City',
      'Country',
      'Culture',
      'Tourism'
    ],
    authorityScore: 88,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'travel-photography-hub',
    name: 'Travel Photography & Visual Storytelling',
    pillarContent: '/blog/travel-photography-complete-guide',
    clusterPosts: [
      '/blog/street-photography-techniques',
      '/blog/landscape-photography-tips',
      '/blog/mobile-photography-nomads',
      '/blog/photo-editing-on-the-road',
      '/blog/building-photography-portfolio',
      '/blog/monetizing-travel-photography'
    ],
    semanticKeywords: [
      'travel photography',
      'visual storytelling',
      'street photography',
      'landscape photography',
      'photo editing',
      'photography gear',
      'photo monetization'
    ],
    entityConnections: [
      'Photography',
      'Visual Art',
      'Storytelling',
      'Creative Work'
    ],
    authorityScore: 85,
    lastUpdated: new Date().toISOString()
  }
]

/**
 * Calculate semantic relevance between two blog posts
 */
export function calculateSemanticRelevance(post1: BlogPost, post2: BlogPost): number {
  let relevanceScore = 0
  
  // Tag overlap (40% weight)
  if (post1.tags && post2.tags) {
    const sharedTags = post1.tags.filter(tag => post2.tags?.includes(tag))
    const tagRelevance = sharedTags.length / Math.max(post1.tags.length, post2.tags.length)
    relevanceScore += tagRelevance * 0.4
  }
  
  // Location overlap (20% weight)
  if (post1.location && post2.location) {
    const locationSimilarity = post1.location === post2.location ? 1 : 0.5
    relevanceScore += locationSimilarity * 0.2
  }
  
  // Category overlap (20% weight)
  if (post1.category && post2.category) {
    const categorySimilarity = post1.category === post2.category ? 1 : 0
    relevanceScore += categorySimilarity * 0.2
  }
  
  // Content similarity (20% weight)
  if (post1.content && post2.content) {
    const contentSimilarity = calculateContentSimilarity(post1.content, post2.content)
    relevanceScore += contentSimilarity * 0.2
  }
  
  return Math.min(relevanceScore, 1)
}

/**
 * Calculate content similarity using keyword frequency
 */
function calculateContentSimilarity(content1: string, content2: string): number {
  const words1 = extractKeywords(content1)
  const words2 = extractKeywords(content2)
  
  const sharedWords = words1.filter(word => words2.includes(word))
  return sharedWords.length / Math.max(words1.length, words2.length)
}

/**
 * Extract keywords from content
 */
function extractKeywords(content: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
    'should', 'now', 'a', 'an', 'as', 'i', 'you', 'he', 'she', 'it', 'we',
    'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'this', 'that',
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'doing', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall'
  ])
  
  return content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 50) // Top 50 keywords
}

/**
 * Find cluster for a specific post
 */
export function findClusterForPost(postSlug: string): TopicCluster | null {
  return advancedClusters.find(cluster => 
    cluster.pillarContent.includes(postSlug) || 
    cluster.clusterPosts.some(post => post.includes(postSlug))
  ) || null
}

/**
 * Get all posts in a cluster
 */
export function getClusterPosts(cluster: TopicCluster | null): BlogPost[] {
  if (!cluster) return []
  
  // This would typically fetch actual blog posts
  // For now, return mock data based on cluster posts
  return cluster.clusterPosts.map(postUrl => ({
    slug: postUrl.split('/').pop() || '',
    title: formatPostTitle(postUrl),
    excerpt: `Related content about ${cluster.name.toLowerCase()}`,
    content: '',
    date: new Date().toISOString(),
    tags: cluster.semanticKeywords.slice(0, 3),
    language: 'en'
  }))
}

/**
 * Format post title from URL
 */
function formatPostTitle(postUrl: string): string {
  const slug = postUrl.split('/').pop() || ''
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate contextual anchor text for internal links
 */
export function generateContextualAnchor(targetPost: BlogPost, currentPost: BlogPost): string {
  const sharedTags = currentPost.tags?.filter(tag => targetPost.tags?.includes(tag)) || []
  
  if (sharedTags.length > 0) {
    return `${targetPost.title} - ${sharedTags[0]} guide`
  }
  
  return targetPost.title
}

/**
 * Determine best placement for internal link
 */
export function determineBestPlacement(targetPost: BlogPost, currentPost: BlogPost): 'introduction' | 'body' | 'conclusion' {
  const relevance = calculateSemanticRelevance(targetPost, currentPost)
  
  if (relevance > 0.8) return 'introduction'
  if (relevance > 0.5) return 'body'
  return 'conclusion'
}

/**
 * Generate smart internal links based on clustering
 */
export function generateSmartInternalLinks(currentPost: BlogPost): InternalLink[] {
  const cluster = findClusterForPost(currentPost.slug)
  const relatedPosts = getClusterPosts(cluster)
  
  return relatedPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => ({
      url: `/blog/${post.slug}`,
      anchorText: generateContextualAnchor(post, currentPost),
      relevanceScore: calculateSemanticRelevance(post, currentPost),
      placement: determineBestPlacement(post, currentPost),
      contextualSentence: generateContextualSentence(post, currentPost)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)
}

/**
 * Generate contextual sentence for link placement
 */
function generateContextualSentence(targetPost: BlogPost, currentPost: BlogPost): string {
  const sharedTags = currentPost.tags?.filter(tag => targetPost.tags?.includes(tag)) || []
  
  if (sharedTags.length > 0) {
    return `For more insights on ${sharedTags[0]}, check out our comprehensive guide.`
  }
  
  return `You might also find this related article helpful.`
}

/**
 * Analyze cluster performance and authority
 */
export function analyzeClusterPerformance(clusterId: string): {
  totalPosts: number
  averageRelevance: number
  keywordCoverage: number
  authorityScore: number
  recommendations: string[]
} {
  const cluster = advancedClusters.find(c => c.id === clusterId)
  if (!cluster) {
    throw new Error(`Cluster ${clusterId} not found`)
  }
  
  const totalPosts = cluster.clusterPosts.length + 1 // +1 for pillar content
  const keywordCoverage = cluster.semanticKeywords.length
  
  const recommendations: string[] = []
  
  if (totalPosts < 5) {
    recommendations.push('Add more supporting content to strengthen cluster authority')
  }
  
  if (keywordCoverage < 10) {
    recommendations.push('Expand semantic keyword coverage for better topical authority')
  }
  
  if (cluster.authorityScore < 80) {
    recommendations.push('Improve content quality and internal linking to boost authority')
  }
  
  return {
    totalPosts,
    averageRelevance: 0.85, // This would be calculated from actual post analysis
    keywordCoverage,
    authorityScore: cluster.authorityScore,
    recommendations
  }
}

/**
 * Get related clusters for cross-cluster linking
 */
export function getRelatedClusters(clusterId: string): TopicCluster[] {
  const currentCluster = advancedClusters.find(c => c.id === clusterId)
  if (!currentCluster) return []
  
  return advancedClusters
    .filter(cluster => cluster.id !== clusterId)
    .filter(cluster => {
      // Find clusters with shared keywords or entities
      const sharedKeywords = cluster.semanticKeywords.some(keyword =>
        currentCluster.semanticKeywords.includes(keyword)
      )
      const sharedEntities = cluster.entityConnections.some(entity =>
        currentCluster.entityConnections.includes(entity)
      )
      
      return sharedKeywords || sharedEntities
    })
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 3)
}

/**
 * Generate cluster-based content recommendations
 */
export function generateContentRecommendations(clusterId: string): {
  missingTopics: string[]
  weakLinks: string[]
  optimizationOpportunities: string[]
} {
  const cluster = advancedClusters.find(c => c.id === clusterId)
  if (!cluster) {
    throw new Error(`Cluster ${clusterId} not found`)
  }
  
  // Analyze what's missing in the cluster
  const allKeywords = cluster.semanticKeywords
  const coveredTopics = cluster.clusterPosts.map(post => 
    post.split('/').pop()?.replace(/-/g, ' ')
  ).filter(Boolean)
  
  const missingTopics = allKeywords.filter(keyword => 
    !coveredTopics.some(topic => topic?.includes(keyword))
  )
  
  return {
    missingTopics: missingTopics.slice(0, 5),
    weakLinks: [], // This would analyze actual internal linking
    optimizationOpportunities: [
      'Create FAQ content for long-tail keywords',
      'Add more visual content (infographics, videos)',
      'Develop case studies and real-world examples',
      'Create comparison guides between related topics'
    ]
  }
}