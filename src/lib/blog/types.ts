
/**
 * PHASE 5 ENHANCED: Advanced Blog Data Architecture
 * Supporting topic clustering, entity recognition, and ML recommendations
 */

// PHASE 5: Core Content Types
export interface BlogPost {
  // Existing fields
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  gallery?: string[];
  content: string;
  language: 'en' | 'de';
  
  // PHASE 5 ENHANCEMENTS:
  modifiedDate?: string;
  category?: string;
  topicCluster?: string;
  entities?: EntityMention[];
  internalLinks?: InternalLink[];
  readingTime?: number;
  contentQuality?: number;
  recommendedPosts?: string[];
  relatedTopics?: string[];
  semanticKeywords?: string[];
  location?: string;
  coordinates?: string;
  countryCode?: string;
  featured?: boolean;
  views?: number;
  alternativeTitle?: string;
  sources?: string[];
}

// PHASE 5: Topic Clustering System
export interface BlogTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  cluster: string;
  relatedTopics: string[];
  posts: string[];
  popularity: number;
  lastUpdated: string;
  keywords: string[];
  parentTopic?: string;
  childTopics?: string[];
}

// PHASE 5: Enhanced Categories
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  posts: string[];
  parentCategory?: string;
  childCategories?: string[];
  postCount?: number;
  seoTitle?: string;
  seoDescription?: string;
}

// PHASE 5: Content Recommendations
export interface ContentRecommendation {
  postSlug: string;
  title: string;
  relevanceScore: number;
  recommendationType: 'related' | 'popular' | 'recent' | 'cluster' | 'entity' | 'geographic';
  matchingFactors: string[];
  reasoning?: string;
}

// PHASE 5: Entity Recognition & Knowledge Graph
export interface EntityMention {
  type: 'Person' | 'Place' | 'Organization' | 'Event' | 'Thing' | 'Activity' | 'Cultural' | 'Food' | 'Transport';
  name: string;
  confidence: number;
  context: string;
  category?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relevance?: number;
  knowledgeGraphId?: string;
  wikidataId?: string;
  sameAs?: string[];
  coordinates?: string;
  description?: string;
}

export interface KnowledgeGraphEntity {
  id: string;
  name: string;
  type: 'Person' | 'Place' | 'Organization' | 'Event' | 'Thing' | 'Activity' | 'Cultural' | 'Food' | 'Transport';
  frequency: number;
  connections: string[];
  confidence: number;
  properties: { [key: string]: any };
  relatedPosts: string[];
  lastUpdated: string;
}

// PHASE 5: Strategic Internal Linking
export interface InternalLink {
  fromPost: string;
  toPost: string;
  anchorText: string;
  relevanceScore: number;
  linkType: 'related' | 'mentioned' | 'contextual' | 'cluster' | 'entity';
  position?: 'header' | 'content' | 'footer';
  createdAt: string;
  isActive: boolean;
}

// PHASE 5: Topic Clusters
export interface TopicCluster {
  id: string;
  name: string;
  description: string;
  posts: string[];
  keywords: string[];
  centroidPost?: string; // Main representative post
  coherenceScore: number; // How well posts fit together
  competitiveStrength: number; // SEO competition analysis
  lastUpdated: string;
  hubPage?: string; // Auto-generated hub page URL
}

// PHASE 5: Advanced Search
export interface SearchOptions {
  query: string;
  type?: 'content' | 'title' | 'tags' | 'entities' | 'all';
  filters?: {
    categories?: string[];
    tags?: string[];
    locations?: string[];
    dateRange?: { start: string; end: string };
    language?: 'en' | 'de';
    readingTime?: { min: number; max: number };
  };
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'popularity' | 'readingTime';
  includeEntities?: boolean;
  includeClusters?: boolean;
}

export interface SearchResult {
  post: BlogPost;
  relevanceScore: number;
  matchingPhrases: string[];
  entityMatches?: EntityMention[];
  snippet?: string;
  highlights?: string[];
}

// PHASE 5: Knowledge Graph
export interface KnowledgeGraph {
  entities: Map<string, EntityMention>;
  relationships: Map<string, EntityRelationship[]>;
  clusters: Map<string, TopicCluster>;
  posts: Map<string, BlogPost>;
  lastUpdated: string;
}

export interface EntityRelationship {
  fromEntity: string;
  toEntity: string;
  relationshipType: 'located_in' | 'part_of' | 'related_to' | 'mentioned_with' | 'co_occurs';
  strength: number;
  context: string[];
  posts: string[];
}

// PHASE 5: Content Analytics
export interface ContentMetrics {
  postSlug: string;
  views: number;
  engagementScore: number;
  averageTimeOnPage: number;
  bounceRate: number;
  internalLinkClicks: number;
  searchRankings: Map<string, number>;
  socialShares: number;
  lastUpdated: string;
}

// PHASE 5: Search Index
export interface SearchIndex {
  termFrequencies: Map<string, Map<string, number>>; // term -> post -> frequency
  inverseDocumentFrequencies: Map<string, number>;
  postVectors: Map<string, number[]>;
  entityIndex: Map<string, string[]>; // entity -> posts
  locationIndex: Map<string, string[]>; // location -> posts  
  clusterIndex: Map<string, string[]>; // cluster -> posts
  lastUpdated: string;
}

// PHASE 5: Utility Types
export type ContentType = 'guide' | 'story' | 'tips' | 'review' | 'experience' | 'culture';
export type TravelStyle = 'backpacking' | 'luxury' | 'budget' | 'adventure' | 'cultural' | 'nomad';
export type GeographicScope = 'city' | 'region' | 'country' | 'continent' | 'worldwide';

// PHASE 5: Configuration Types
export interface Phase5Config {
  clustering: {
    enabled: boolean;
    minClusterSize: number;
    maxClusters: number;
    coherenceThreshold: number;
  };
  recommendations: {
    enabled: boolean;
    maxRecommendations: number;
    algorithms: ('similarity' | 'collaborative' | 'content' | 'hybrid')[];
  };
  search: {
    enabled: boolean;
    indexingStrategy: 'build-time' | 'runtime' | 'hybrid';
    fuzzyMatchThreshold: number;
  };
  entities: {
    enabled: boolean;
    confidenceThreshold: number;
    wikidataIntegration: boolean;
  };
}
