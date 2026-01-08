'use client'

/**
 * Entity Highlighter Component - PHASE 5 SEO-PERFECTION-2025
 * Highlights entities in search results with confidence indicators and knowledge graph links
 */

import React, { useState } from 'react'
import { MapPin, Utensils, Camera, Mountain, Building, User, Calendar, Info } from 'lucide-react'

interface EntityMention {
  type: 'Person' | 'Place' | 'Organization' | 'Event' | 'Thing' | 'Activity' | 'Cultural' | 'Food' | 'Transport'
  name: string
  confidence: number
  context?: string
  category?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  relevance?: number
  knowledgeGraphId?: string
}

interface EntityHighlighterProps {
  entities: EntityMention[]
  className?: string
  maxEntities?: number
  showConfidence?: boolean
  showTooltips?: boolean
  onEntityClick?: (entity: EntityMention) => void
}

const entityIcons = {
  Person: <User className="w-3 h-3" />,
  Place: <MapPin className="w-3 h-3" />,
  Organization: <Building className="w-3 h-3" />,
  Event: <Calendar className="w-3 h-3" />,
  Thing: <Info className="w-3 h-3" />,
  Activity: <Mountain className="w-3 h-3" />,
  Cultural: <Camera className="w-3 h-3" />,
  Food: <Utensils className="w-3 h-3" />,
  Transport: <Mountain className="w-3 h-3" />
}

const entityColors = {
  Person: 'bg-blue-100 text-blue-800 border-blue-200',
  Place: 'bg-green-100 text-green-800 border-green-200',
  Organization: 'bg-purple-100 text-purple-800 border-purple-200',
  Event: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Thing: 'bg-gray-100 text-gray-800 border-gray-200',
  Activity: 'bg-red-100 text-red-800 border-red-200',
  Cultural: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Food: 'bg-orange-100 text-orange-800 border-orange-200',
  Transport: 'bg-pink-100 text-pink-800 border-pink-200'
}

const sentimentColors = {
  positive: 'ring-green-300',
  neutral: 'ring-gray-300',
  negative: 'ring-red-300'
}

export default function EntityHighlighter({
  entities,
  className = '',
  maxEntities = 10,
  showConfidence = true,
  showTooltips = true,
  onEntityClick
}: EntityHighlighterProps) {
  const [hoveredEntity, setHoveredEntity] = useState<EntityMention | null>(null)

  // Sort entities by relevance and confidence
  const sortedEntities = entities
    .sort((a, b) => {
      const scoreA = (a.relevance || 0) * a.confidence
      const scoreB = (b.relevance || 0) * b.confidence
      return scoreB - scoreA
    })
    .slice(0, maxEntities)

  if (sortedEntities.length === 0) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2">
        {sortedEntities.map((entity, index) => (
          <EntityTag
            key={`${entity.type}-${entity.name}-${index}`}
            entity={entity}
            showConfidence={showConfidence}
            showTooltips={showTooltips}
            onEntityClick={onEntityClick}
            onHover={showTooltips ? setHoveredEntity : undefined}
          />
        ))}
      </div>

      {/* Tooltip */}
      {showTooltips && hoveredEntity && (
        <EntityTooltip
          entity={hoveredEntity}
          onClose={() => setHoveredEntity(null)}
        />
      )}
    </div>
  )
}

interface EntityTagProps {
  entity: EntityMention
  showConfidence: boolean
  showTooltips: boolean
  onEntityClick?: (entity: EntityMention) => void
  onHover?: (entity: EntityMention | null) => void
}

function EntityTag({
  entity,
  showConfidence,
  showTooltips,
  onEntityClick,
  onHover
}: EntityTagProps) {
  const baseClasses = `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${entityColors[entity.type]}`
  
  const sentimentRing = entity.sentiment ? sentimentColors[entity.sentiment] : ''
  const confidenceOpacity = entity.confidence < 0.7 ? 'opacity-75' : ''
  const clickableClasses = onEntityClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''
  
  const finalClasses = `${baseClasses} ${sentimentRing} ${confidenceOpacity} ${clickableClasses}`

  return (
    <span
      className={finalClasses}
      onClick={() => onEntityClick?.(entity)}
      onMouseEnter={() => onHover?.(entity)}
      onMouseLeave={() => onHover?.(null)}
      title={showTooltips ? undefined : `${entity.type}: ${entity.name} (${Math.round(entity.confidence * 100)}%)`}
    >
      {entityIcons[entity.type]}
      <span className="truncate max-w-24">{entity.name}</span>
      
      {showConfidence && (
        <span className="ml-1 text-xs opacity-75">
          {Math.round(entity.confidence * 100)}%
        </span>
      )}
      
      {entity.sentiment && (
        <div
          className={`w-2 h-2 rounded-full ml-1 ${
            entity.sentiment === 'positive' ? 'bg-green-400' :
            entity.sentiment === 'negative' ? 'bg-red-400' :
            'bg-gray-400'
          }`}
          title={`Sentiment: ${entity.sentiment}`}
        />
      )}
    </span>
  )
}

interface EntityTooltipProps {
  entity: EntityMention
  onClose: () => void
}

function EntityTooltip({ entity, onClose }: EntityTooltipProps) {
  return (
    <div className="absolute top-full left-0 z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full ${entityColors[entity.type]}`}>
            {entityIcons[entity.type]}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{entity.name}</h4>
            <p className="text-sm text-gray-500">{entity.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ×
        </button>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {entity.category && (
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{entity.category}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  entity.confidence > 0.8 ? 'bg-green-500' :
                  entity.confidence > 0.6 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${entity.confidence * 100}%` }}
              />
            </div>
            <span className="font-medium">{Math.round(entity.confidence * 100)}%</span>
          </div>
        </div>

        {entity.relevance && (
          <div className="flex justify-between">
            <span className="text-gray-600">Relevance:</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${entity.relevance * 100}%` }}
                />
              </div>
              <span className="font-medium">{Math.round(entity.relevance * 100)}%</span>
            </div>
          </div>
        )}

        {entity.sentiment && (
          <div className="flex justify-between">
            <span className="text-gray-600">Sentiment:</span>
            <span className={`font-medium capitalize ${
              entity.sentiment === 'positive' ? 'text-green-600' :
              entity.sentiment === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {entity.sentiment}
            </span>
          </div>
        )}
      </div>

      {/* Context */}
      {entity.context && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium">Context: </span>
            {entity.context.length > 100 
              ? `${entity.context.substring(0, 100)}...`
              : entity.context
            }
          </p>
        </div>
      )}

      {/* Knowledge Graph Link */}
      {entity.knowledgeGraphId && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            View in Knowledge Graph →
          </button>
        </div>
      )}
    </div>
  )
}