'use client'

/**
 * Advanced Search Interface - PHASE 5 SEO-PERFECTION-2025
 * React component for sophisticated search experience with entity recognition,
 * topic clustering, and ML-powered recommendations
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Filter, X, Zap, Brain, MapPin, Tag, Calendar, Clock, Sparkles } from 'lucide-react'

interface SearchFilters {
  categories?: string[]
  tags?: string[]
  locations?: string[]
  language?: 'en' | 'de'
  dateRange?: { start: string; end: string }
  readingTime?: { min: number; max: number }
  entityTypes?: string[]
}

interface SearchResult {
  post: {
    slug: string
    title: string
    excerpt: string
    date: string
    tags: string[]
    category?: string
    location?: string
    readingTime?: number
    language: 'en' | 'de'
  }
  relevanceScore: number
  matchingPhrases: string[]
  snippet?: string
  highlights?: string[]
  entityMatches?: Array<{
    type: string
    name: string
    confidence: number
    context?: string
  }>
}

interface SearchResponse {
  query: string
  results: SearchResult[]
  metadata: {
    totalResults: number
    searchTime: string
    hasMore: boolean
  }
}

interface AdvancedSearchInterfaceProps {
  className?: string
  onResultClick?: (result: SearchResult) => void
  placeholder?: string
  showFilters?: boolean
  showEntityHighlights?: boolean
  maxResults?: number
}

export default function AdvancedSearchInterface({
  className = '',
  onResultClick,
  placeholder = 'Search posts, places, activities, and more...',
  showFilters = true,
  showEntityHighlights = true,
  maxResults = 20
}: AdvancedSearchInterfaceProps) {
  // State management
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'content' | 'entities' | 'semantic'>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchMetadata, setSearchMetadata] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Available filter options (in production, these would come from API)
  const availableCategories = ['Travel Guide', 'Food & Culture', 'Adventure', 'City Exploration', 'Nature']
  const availableLocations = ['Thailand', 'Colombia', 'Vietnam', 'Indonesia', 'India', 'Nepal']
  const availableEntityTypes = ['Place', 'Activity', 'Food', 'Cultural', 'Transport']

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults([])
        setSearchMetadata(null)
        return
      }

      setIsSearching(true)
      
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          type: searchType,
          sortBy,
          limit: maxResults.toString(),
          includeEntities: showEntityHighlights.toString()
        })

        // Add filters to params
        if (searchFilters.categories?.length) {
          params.append('category', searchFilters.categories.join(','))
        }
        if (searchFilters.tags?.length) {
          params.append('tags', searchFilters.tags.join(','))
        }
        if (searchFilters.locations?.length) {
          params.append('locations', searchFilters.locations.join(','))
        }
        if (searchFilters.language) {
          params.append('language', searchFilters.language)
        }
        if (searchFilters.dateRange) {
          params.append('startDate', searchFilters.dateRange.start)
          params.append('endDate', searchFilters.dateRange.end)
        }
        if (searchFilters.readingTime) {
          params.append('minReadingTime', searchFilters.readingTime.min.toString())
          params.append('maxReadingTime', searchFilters.readingTime.max.toString())
        }

        const response = await fetch(`/api/search?${params}`)
        
        if (!response.ok) {
          throw new Error('Search request failed')
        }

        const data: SearchResponse = await response.json()
        setResults(data.results || [])
        setSearchMetadata(data.metadata)

      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setSearchMetadata(null)
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [searchType, sortBy, maxResults, showEntityHighlights]
  )

  // Effect for search execution
  useEffect(() => {
    debouncedSearch(query, filters)
  }, [query, filters, debouncedSearch])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Show suggestions for non-empty queries
    if (value.trim()) {
      // In production, this would fetch real suggestions from API
      setSuggestions([
        `${value} in Thailand`,
        `${value} food`,
        `${value} guide`,
        `${value} activities`
      ])
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Handle filter changes
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
  }

  // Render search result with entity highlights
  const renderSearchResult = (result: SearchResult, index: number) => (
    <div
      key={`${result.post.slug}-${index}`}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onResultClick?.(result)}
    >
      {/* Header with relevance score and metadata */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {highlightText(result.post.title, result.highlights || [])}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date(result.post.date).toLocaleDateString()}</span>
            {result.post.location && (
              <>
                <MapPin className="w-4 h-4 ml-2" />
                <span>{result.post.location}</span>
              </>
            )}
            {result.post.readingTime && (
              <>
                <Clock className="w-4 h-4 ml-2" />
                <span>{result.post.readingTime}min read</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Zap className="w-3 h-3 mr-1" />
            {Math.round(result.relevanceScore * 100)}%
          </span>
        </div>
      </div>

      {/* Snippet */}
      <p className="text-gray-700 mb-3 leading-relaxed">
        {result.snippet 
          ? highlightText(result.snippet, result.highlights || [])
          : highlightText(result.post.excerpt, result.highlights || [])
        }
      </p>

      {/* Entity matches (if enabled) */}
      {showEntityHighlights && result.entityMatches && result.entityMatches.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Detected entities:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.entityMatches.slice(0, 5).map((entity, entityIndex) => (
              <span
                key={entityIndex}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                title={`${entity.type} - ${Math.round(entity.confidence * 100)}% confidence`}
              >
                {entity.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags and category */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result.post.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {result.post.category}
            </span>
          )}
          {result.post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        {/* Language indicator */}
        <span className="text-xs text-gray-500 uppercase">
          {result.post.language}
        </span>
      </div>
    </div>
  )

  // Highlight search terms in text
  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length) return text
    
    let highlightedText = text
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
    })
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            onFocus={() => setShowSuggestions(query.trim().length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setQuery(suggestion)
                  setShowSuggestions(false)
                }}
              >
                <Search className="inline w-4 h-4 mr-2 text-gray-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Search Type */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Content</option>
            <option value="content">Text Content</option>
            <option value="entities">Places & Activities</option>
            <option value="semantic">Semantic Search</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Most Relevant</option>
            <option value="date">Most Recent</option>
            <option value="popularity">Most Popular</option>
          </select>

          {/* Filter Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Results Count */}
        {searchMetadata && (
          <div className="text-sm text-gray-600">
            <Sparkles className="inline w-4 h-4 mr-1" />
            {searchMetadata.totalResults} results in {searchMetadata.searchTime}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <select
                multiple
                value={filters.categories || []}
                onChange={(e) => updateFilter('categories', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                size={3}
              >
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
              <select
                multiple
                value={filters.locations || []}
                onChange={(e) => updateFilter('locations', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                size={3}
              >
                {availableLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Entity Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entity Types</label>
              <select
                multiple
                value={filters.entityTypes || []}
                onChange={(e) => updateFilter('entityTypes', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                size={3}
              >
                {availableEntityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {results.map((result, index) => renderSearchResult(result, index))}
        
        {/* No Results */}
        {query && !isSearching && results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}