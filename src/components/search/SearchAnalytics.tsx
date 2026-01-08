'use client'

/**
 * Search Analytics Dashboard - PHASE 5 SEO-PERFECTION-2025
 * Analytics and insights for search performance and user behavior
 */

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Eye, 
  Clock, 
  Target,
  Users,
  Zap,
  Brain,
  MapPin,
  RefreshCw
} from 'lucide-react'

interface SearchAnalytics {
  totalSearches: number
  totalResults: number
  averageSearchTime: number
  topQueries: Array<{
    query: string
    count: number
    averageResults: number
    clickThroughRate: number
  }>
  entityDistribution: Array<{
    type: string
    count: number
    percentage: number
  }>
  searchTrends: Array<{
    date: string
    searches: number
    uniqueQueries: number
  }>
  performanceMetrics: {
    averageResponseTime: number
    cacheHitRate: number
    errorRate: number
    userSatisfaction: number
  }
  locationInsights: Array<{
    location: string
    searches: number
    topQueries: string[]
  }>
}

interface SearchAnalyticsProps {
  className?: string
  refreshInterval?: number
}

export default function SearchAnalyticsDashboard({
  className = '',
  refreshInterval = 30000 // 30 seconds
}: SearchAnalyticsProps) {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/search/analytics?timeRange=${selectedTimeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch search analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load and periodic refresh
  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, refreshInterval)
    return () => clearInterval(interval)
  }, [selectedTimeRange, refreshInterval])

  if (loading && !analytics) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No analytics data available</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry Loading
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Search Analytics</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Searches"
            value={analytics.totalSearches.toLocaleString()}
            icon={<Search className="w-5 h-5" />}
            color="blue"
            trend="+12%"
          />
          <MetricCard
            title="Results Found"
            value={analytics.totalResults.toLocaleString()}
            icon={<Eye className="w-5 h-5" />}
            color="green"
            trend="+8%"
          />
          <MetricCard
            title="Avg Search Time"
            value={`${analytics.averageSearchTime}ms`}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
            trend="-5%"
          />
          <MetricCard
            title="User Satisfaction"
            value={`${Math.round(analytics.performanceMetrics.userSatisfaction * 100)}%`}
            icon={<Target className="w-5 h-5" />}
            color="purple"
            trend="+3%"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PerformanceCard
            title="Response Time"
            value={`${analytics.performanceMetrics.averageResponseTime}ms`}
            description="Average API response time"
            status={analytics.performanceMetrics.averageResponseTime < 200 ? 'good' : 'warning'}
          />
          <PerformanceCard
            title="Cache Hit Rate"
            value={`${Math.round(analytics.performanceMetrics.cacheHitRate * 100)}%`}
            description="Percentage of cached responses"
            status={analytics.performanceMetrics.cacheHitRate > 0.8 ? 'good' : 'warning'}
          />
          <PerformanceCard
            title="Error Rate"
            value={`${(analytics.performanceMetrics.errorRate * 100).toFixed(2)}%`}
            description="Search request failures"
            status={analytics.performanceMetrics.errorRate < 0.01 ? 'good' : 'error'}
          />
        </div>

        {/* Top Queries */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Search Queries
          </h3>
          <div className="space-y-3">
            {analytics.topQueries.slice(0, 10).map((query, index) => (
              <div key={query.query} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{query.query}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{query.count} searches</span>
                  <span>{query.averageResults} results</span>
                  <span className="text-green-600">{Math.round(query.clickThroughRate * 100)}% CTR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entity Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Entity Types Distribution
            </h3>
            <div className="space-y-3">
              {analytics.entityDistribution.map((entity) => (
                <div key={entity.type} className="flex items-center justify-between">
                  <span className="text-gray-700">{entity.type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${entity.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {entity.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Popular Destinations
            </h3>
            <div className="space-y-4">
              {analytics.locationInsights.slice(0, 5).map((location) => (
                <div key={location.location} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{location.location}</span>
                    <span className="text-sm text-gray-600">{location.searches} searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {location.topQueries.slice(0, 3).map((query) => (
                      <span
                        key={query}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {query}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Trends Chart */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Search Volume Trends
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.searchTrends.map((trend, index) => (
              <div key={trend.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{
                    height: `${(trend.searches / Math.max(...analytics.searchTrends.map(t => t.searches))) * 200}px`,
                    minHeight: '2px'
                  }}
                  title={`${trend.searches} searches on ${trend.date}`}
                />
                <span className="text-xs text-gray-600 mt-2 transform -rotate-45">
                  {new Date(trend.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'purple'
  trend?: string
}

function MetricCard({ title, value, icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.startsWith('+') ? 'text-green-600' : 
            trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

interface PerformanceCardProps {
  title: string
  value: string
  description: string
  status: 'good' | 'warning' | 'error'
}

function PerformanceCard({ title, value, description, status }: PerformanceCardProps) {
  const statusColors = {
    good: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error: 'text-red-600 bg-red-50'
  }

  const statusIcons = {
    good: '✓',
    warning: '⚠',
    error: '✗'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {statusIcons[status]}
        </span>
      </div>
      <p className="text-xl font-semibold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}