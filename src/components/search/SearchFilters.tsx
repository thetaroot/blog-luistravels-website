'use client'

/**
 * Advanced Search Filters - PHASE 5 SEO-PERFECTION-2025
 * Comprehensive filtering interface with entity types, date ranges, and smart suggestions
 */

import React, { useState } from 'react'
import { Calendar, MapPin, Tag, Filter, X, ChevronDown, ChevronUp, Sliders } from 'lucide-react'

interface SearchFilters {
  categories?: string[]
  tags?: string[]
  locations?: string[]
  language?: 'en' | 'de'
  dateRange?: { start: string; end: string }
  readingTime?: { min: number; max: number }
  entityTypes?: string[]
  contentTypes?: string[]
  sortBy?: 'relevance' | 'date' | 'popularity' | 'readingTime'
}

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  availableOptions: {
    categories: string[]
    tags: string[]
    locations: string[]
    entityTypes: string[]
    contentTypes: string[]
  }
  className?: string
  isCollapsed?: boolean
}

export default function SearchFiltersComponent({
  filters,
  onFiltersChange,
  availableOptions,
  className = '',
  isCollapsed = false
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['categories', 'locations']))
  const [isCompactMode, setIsCompactMode] = useState(isCollapsed)

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const addToArrayFilter = (key: keyof SearchFilters, value: string) => {
    const current = (filters[key] as string[]) || []
    if (!current.includes(value)) {
      updateFilter(key, [...current, value])
    }
  }

  const removeFromArrayFilter = (key: keyof SearchFilters, value: string) => {
    const current = (filters[key] as string[]) || []
    updateFilter(key, current.filter(item => item !== value))
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.categories?.length) count += filters.categories.length
    if (filters.tags?.length) count += filters.tags.length
    if (filters.locations?.length) count += filters.locations.length
    if (filters.entityTypes?.length) count += filters.entityTypes.length
    if (filters.contentTypes?.length) count += filters.contentTypes.length
    if (filters.language) count += 1
    if (filters.dateRange) count += 1
    if (filters.readingTime) count += 1
    return count
  }

  if (isCompactMode) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCompactMode(false)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Expand
          </button>
        </div>
        
        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.categories?.map(category => (
              <FilterTag
                key={category}
                label={category}
                onRemove={() => removeFromArrayFilter('categories', category)}
                color="blue"
              />
            ))}
            {filters.locations?.map(location => (
              <FilterTag
                key={location}
                label={location}
                onRemove={() => removeFromArrayFilter('locations', location)}
                color="green"
              />
            ))}
            {filters.entityTypes?.map(type => (
              <FilterTag
                key={type}
                label={type}
                onRemove={() => removeFromArrayFilter('entityTypes', type)}
                color="purple"
              />
            ))}
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Search Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsCompactMode(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        <FilterSection
          title="Categories"
          icon={<Tag className="w-4 h-4" />}
          isExpanded={expandedSections.has('categories')}
          onToggle={() => toggleSection('categories')}
        >
          <div className="grid grid-cols-1 gap-2">
            {availableOptions.categories.map(category => (
              <FilterCheckbox
                key={category}
                label={category}
                checked={filters.categories?.includes(category) || false}
                onChange={(checked) => {
                  if (checked) {
                    addToArrayFilter('categories', category)
                  } else {
                    removeFromArrayFilter('categories', category)
                  }
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Locations */}
        <FilterSection
          title="Locations"
          icon={<MapPin className="w-4 h-4" />}
          isExpanded={expandedSections.has('locations')}
          onToggle={() => toggleSection('locations')}
        >
          <div className="grid grid-cols-1 gap-2">
            {availableOptions.locations.map(location => (
              <FilterCheckbox
                key={location}
                label={location}
                checked={filters.locations?.includes(location) || false}
                onChange={(checked) => {
                  if (checked) {
                    addToArrayFilter('locations', location)
                  } else {
                    removeFromArrayFilter('locations', location)
                  }
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Entity Types */}
        <FilterSection
          title="Entity Types"
          icon={<Filter className="w-4 h-4" />}
          isExpanded={expandedSections.has('entityTypes')}
          onToggle={() => toggleSection('entityTypes')}
        >
          <div className="grid grid-cols-2 gap-2">
            {availableOptions.entityTypes.map(type => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={filters.entityTypes?.includes(type) || false}
                onChange={(checked) => {
                  if (checked) {
                    addToArrayFilter('entityTypes', type)
                  } else {
                    removeFromArrayFilter('entityTypes', type)
                  }
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Date Range */}
        <FilterSection
          title="Date Range"
          icon={<Calendar className="w-4 h-4" />}
          isExpanded={expandedSections.has('dateRange')}
          onToggle={() => toggleSection('dateRange')}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => updateFilter('dateRange', {
                  start: e.target.value,
                  end: filters.dateRange?.end || ''
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => updateFilter('dateRange', {
                  start: filters.dateRange?.start || '',
                  end: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </FilterSection>

        {/* Reading Time */}
        <FilterSection
          title="Reading Time"
          icon={<X className="w-4 h-4" />}
          isExpanded={expandedSections.has('readingTime')}
          onToggle={() => toggleSection('readingTime')}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min: {filters.readingTime?.min || 0} minutes
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={filters.readingTime?.min || 0}
                onChange={(e) => updateFilter('readingTime', {
                  min: parseInt(e.target.value),
                  max: filters.readingTime?.max || 30
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max: {filters.readingTime?.max || 30} minutes
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={filters.readingTime?.max || 30}
                onChange={(e) => updateFilter('readingTime', {
                  min: filters.readingTime?.min || 0,
                  max: parseInt(e.target.value)
                })}
                className="w-full"
              />
            </div>
          </div>
        </FilterSection>

        {/* Language */}
        <FilterSection
          title="Language"
          icon={<X className="w-4 h-4" />}
          isExpanded={expandedSections.has('language')}
          onToggle={() => toggleSection('language')}
        >
          <div className="space-y-2">
            <FilterCheckbox
              label="English"
              checked={filters.language === 'en'}
              onChange={(checked) => updateFilter('language', checked ? 'en' : undefined)}
            />
            <FilterCheckbox
              label="Deutsch"
              checked={filters.language === 'de'}
              onChange={(checked) => updateFilter('language', checked ? 'de' : undefined)}
            />
          </div>
        </FilterSection>
      </div>
    </div>
  )
}

interface FilterSectionProps {
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, icon, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{icon}</span>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  )
}

interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className={checked ? 'font-medium text-gray-900' : 'text-gray-700'}>
        {label}
      </span>
    </label>
  )
}

interface FilterTagProps {
  label: string
  onRemove: () => void
  color: 'blue' | 'green' | 'purple' | 'red'
}

function FilterTag({ label, onRemove, color }: FilterTagProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}