'use client'

/**
 * Search Suggestions Component - PHASE 5 SEO-PERFECTION-2025
 * Intelligent search suggestions with entity recognition and trending topics
 */

import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, MapPin, Utensils, Camera, Mountain, Calendar } from 'lucide-react'

interface SearchSuggestion {
  query: string
  type: 'trending' | 'entity' | 'category' | 'location' | 'recent'
  count?: number
  icon?: React.ReactNode
  description?: string
}

interface SearchSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
  isVisible: boolean
  maxSuggestions?: number
}

export default function SearchSuggestions({
  query,
  onSuggestionClick,
  isVisible,
  maxSuggestions = 8
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim() || !isVisible) {
      setSuggestions([])
      return
    }

    const generateSuggestions = async () => {
      setLoading(true)
      
      try {
        // In production, this would call your suggestions API
        const mockSuggestions = await getMockSuggestions(query)
        setSuggestions(mockSuggestions.slice(0, maxSuggestions))
      } catch (error) {
        console.error('Error generating suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(generateSuggestions, 150)
    return () => clearTimeout(debounceTimer)
  }, [query, isVisible, maxSuggestions])

  if (!isVisible || (!loading && suggestions.length === 0)) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Finding suggestions...</p>
        </div>
      ) : (
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors"
              onClick={() => onSuggestionClick(suggestion.query)}
            >
              <div className="flex-shrink-0 text-gray-400">
                {suggestion.icon || <Search className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {highlightMatch(suggestion.query, query)}
                  </span>
                  
                  {suggestion.type === 'trending' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </span>
                  )}
                  
                  {suggestion.count && (
                    <span className="text-xs text-gray-500">
                      {suggestion.count} posts
                    </span>
                  )}
                </div>
                
                {suggestion.description && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {suggestion.description}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <span className="text-xs text-gray-400 capitalize">
                  {suggestion.type}
                </span>
              </div>
            </button>
          ))}
          
          {/* Show all results option */}
          <div className="border-t border-gray-100 pt-2">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-blue-600 font-medium"
              onClick={() => onSuggestionClick(query)}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Search for &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Mock suggestions generator (replace with real API call)
async function getMockSuggestions(query: string): Promise<SearchSuggestion[]> {
  const queryLower = query.toLowerCase()
  
  const baseSuggestions: SearchSuggestion[] = [
    // Location-based suggestions
    {
      query: `${query} in Thailand`,
      type: 'location',
      icon: <MapPin className="w-4 h-4" />,
      description: 'Travel experiences in Thailand',
      count: 45
    },
    {
      query: `${query} in Colombia`,
      type: 'location',
      icon: <MapPin className="w-4 h-4" />,
      description: 'Colombian adventures and culture',
      count: 32
    },
    {
      query: `${query} in Vietnam`,
      type: 'location',
      icon: <MapPin className="w-4 h-4" />,
      description: 'Vietnamese travel guides',
      count: 28
    },
    
    // Category-based suggestions
    {
      query: `${query} food`,
      type: 'category',
      icon: <Utensils className="w-4 h-4" />,
      description: 'Local cuisine and street food',
      count: 67
    },
    {
      query: `${query} photography`,
      type: 'category',
      icon: <Camera className="w-4 h-4" />,
      description: 'Photo spots and tips',
      count: 23
    },
    {
      query: `${query} trekking`,
      type: 'category',
      icon: <Mountain className="w-4 h-4" />,
      description: 'Hiking and adventure activities',
      count: 19
    },
    
    // Trending suggestions
    {
      query: `best ${query} 2024`,
      type: 'trending',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Latest recommendations',
      count: 12
    },
    {
      query: `${query} guide`,
      type: 'category',
      icon: <Search className="w-4 h-4" />,
      description: 'Complete travel guides',
      count: 156
    }
  ]

  // Filter suggestions based on query relevance
  return baseSuggestions.filter(suggestion => {
    const suggestionText = suggestion.query.toLowerCase()
    return suggestionText.includes(queryLower) || suggestion.description?.toLowerCase().includes(queryLower)
  })
}

// Highlight matching text in suggestions
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  )
}