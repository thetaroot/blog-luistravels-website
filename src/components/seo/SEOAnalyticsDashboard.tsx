'use client'

/**
 * SEO Analytics Dashboard - PHASE 5 SEO-PERFECTION-2025
 * Real-time SEO performance monitoring and Google dominance tracking
 * SENIOR GOOGLE SEO DEV Level Implementation
 */

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Search, 
  Globe, 
  Target, 
  BarChart3, 
  MapPin, 
  Eye, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Users,
  Star
} from 'lucide-react'

interface SEOMetrics {
  overview: {
    totalPosts: number
    optimizedPosts: number
    averageSEOScore: number
    totalKeywords: number
    avgPosition: number
    organicTraffic: number
    clickThroughRate: number
    conversionRate: number
  }
  performance: {
    topPerforming: Array<{
      slug: string
      title: string
      score: number
      position: number
      traffic: number
    }>
    needsImprovement: Array<{
      slug: string
      title: string
      score: number
      issues: string[]
    }>
  }
  keywords: {
    ranking: Array<{
      keyword: string
      position: number
      volume: number
      difficulty: number
      trend: 'up' | 'down' | 'stable'
    }>
    opportunities: Array<{
      keyword: string
      volume: number
      difficulty: number
      currentPosition?: number
    }>
  }
  technical: {
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
      status: 'good' | 'needs-improvement' | 'poor'
    }
    indexing: {
      indexed: number
      total: number
      errors: number
      warnings: number
    }
    schema: {
      implemented: number
      valid: number
      errors: number
    }
  }
  local: {
    locations: Array<{
      location: string
      posts: number
      avgPosition: number
      localTraffic: number
    }>
    businessListings: Array<{
      name: string
      type: string
      status: 'verified' | 'pending' | 'error'
      visibility: number
    }>
  }
}

interface SEOAnalyticsDashboardProps {
  className?: string
  refreshInterval?: number
}

export default function SEOAnalyticsDashboard({
  className = '',
  refreshInterval = 60000 // 1 minute
}: SEOAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'technical' | 'local'>('overview')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch SEO metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/seo/analytics?timeRange=${selectedTimeRange}`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch SEO metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [selectedTimeRange, refreshInterval])

  if (loading && !metrics) {
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

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No SEO metrics available</p>
        <button
          onClick={fetchMetrics}
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
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">SEO Performance Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'keywords', label: 'Keywords', icon: Search },
            { id: 'technical', label: 'Technical', icon: Target },
            { id: 'local', label: 'Local SEO', icon: MapPin }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab metrics={metrics} />
        )}
        
        {activeTab === 'keywords' && (
          <KeywordsTab metrics={metrics} />
        )}
        
        {activeTab === 'technical' && (
          <TechnicalTab metrics={metrics} />
        )}
        
        {activeTab === 'local' && (
          <LocalSEOTab metrics={metrics} />
        )}
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ metrics }: { metrics: SEOMetrics }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="SEO Score"
          value={`${Math.round(metrics.overview.averageSEOScore)}/100`}
          icon={<Target className="w-5 h-5" />}
          color="blue"
          trend="+5.2%"
          status={metrics.overview.averageSEOScore >= 80 ? 'good' : 'warning'}
        />
        
        <MetricCard
          title="Avg Position"
          value={`#${metrics.overview.avgPosition}`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          trend="-2.1"
          status={metrics.overview.avgPosition <= 10 ? 'good' : 'warning'}
        />
        
        <MetricCard
          title="Organic Traffic"
          value={metrics.overview.organicTraffic.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          color="purple"
          trend="+12.3%"
          status="good"
        />
        
        <MetricCard
          title="CTR"
          value={`${(metrics.overview.clickThroughRate * 100).toFixed(1)}%`}
          icon={<Eye className="w-5 h-5" />}
          color="orange"
          trend="+1.8%"
          status={metrics.overview.clickThroughRate >= 0.05 ? 'good' : 'warning'}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Top Performing Posts
          </h3>
          <div className="space-y-3">
            {metrics.performance.topPerforming.slice(0, 5).map((post, index) => (
              <div key={post.slug} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xs" title={post.title}>
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-600">Position #{post.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{post.score}/100</p>
                  <p className="text-sm text-gray-600">{post.traffic} visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Needing Improvement */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Needs Improvement
          </h3>
          <div className="space-y-3">
            {metrics.performance.needsImprovement.slice(0, 5).map((post, index) => (
              <div key={post.slug} className="py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 truncate max-w-xs" title={post.title}>
                    {post.title}
                  </p>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {post.score}/100
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.issues.slice(0, 3).map((issue, issueIndex) => (
                    <span
                      key={issueIndex}
                      className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Keywords Tab Component
function KeywordsTab({ metrics }: { metrics: SEOMetrics }) {
  return (
    <div className="space-y-6">
      {/* Keyword Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900">Total Keywords</h4>
          <p className="text-2xl font-bold text-blue-700">{metrics.keywords.ranking.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900">Top 10 Positions</h4>
          <p className="text-2xl font-bold text-green-700">
            {metrics.keywords.ranking.filter(k => k.position <= 10).length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900">Opportunities</h4>
          <p className="text-2xl font-bold text-purple-700">{metrics.keywords.opportunities.length}</p>
        </div>
      </div>

      {/* Current Rankings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Rankings</h3>
        <div className="space-y-3">
          {metrics.keywords.ranking.slice(0, 10).map((keyword, index) => (
            <div key={keyword.keyword} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                  keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {keyword.position}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{keyword.keyword}</p>
                  <p className="text-sm text-gray-600">{keyword.volume.toLocaleString()} searches/month</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${
                  keyword.trend === 'up' ? 'text-green-600' :
                  keyword.trend === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {keyword.trend === 'up' ? '↗' : keyword.trend === 'down' ? '↘' : '→'}
                </span>
                <span className="text-sm text-gray-600">
                  Difficulty: {keyword.difficulty}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Opportunities */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">New Opportunities</h3>
        <div className="space-y-3">
          {metrics.keywords.opportunities.slice(0, 8).map((opportunity, index) => (
            <div key={opportunity.keyword} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{opportunity.keyword}</p>
                <p className="text-sm text-gray-600">{opportunity.volume.toLocaleString()} searches/month</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  opportunity.difficulty <= 30 ? 'bg-green-100 text-green-800' :
                  opportunity.difficulty <= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {opportunity.difficulty <= 30 ? 'Easy' :
                   opportunity.difficulty <= 60 ? 'Medium' : 'Hard'}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Target →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Technical Tab Component
function TechnicalTab({ metrics }: { metrics: SEOMetrics }) {
  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VitalCard
            title="LCP"
            value={`${metrics.technical.coreWebVitals.lcp}s`}
            description="Largest Contentful Paint"
            status={metrics.technical.coreWebVitals.lcp <= 2.5 ? 'good' : 'poor'}
          />
          <VitalCard
            title="FID"
            value={`${metrics.technical.coreWebVitals.fid}ms`}
            description="First Input Delay"
            status={metrics.technical.coreWebVitals.fid <= 100 ? 'good' : 'poor'}
          />
          <VitalCard
            title="CLS"
            value={metrics.technical.coreWebVitals.cls.toFixed(3)}
            description="Cumulative Layout Shift"
            status={metrics.technical.coreWebVitals.cls <= 0.1 ? 'good' : 'poor'}
          />
        </div>
      </div>

      {/* Indexing Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indexing Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Indexed Pages</span>
              <span className="font-semibold text-green-600">
                {metrics.technical.indexing.indexed}/{metrics.technical.indexing.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Errors</span>
              <span className="font-semibold text-red-600">{metrics.technical.indexing.errors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Warnings</span>
              <span className="font-semibold text-yellow-600">{metrics.technical.indexing.warnings}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schema Markup</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Implemented</span>
              <span className="font-semibold text-blue-600">{metrics.technical.schema.implemented}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Valid</span>
              <span className="font-semibold text-green-600">{metrics.technical.schema.valid}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Errors</span>
              <span className="font-semibold text-red-600">{metrics.technical.schema.errors}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Local SEO Tab Component
function LocalSEOTab({ metrics }: { metrics: SEOMetrics }) {
  return (
    <div className="space-y-6">
      {/* Location Performance */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Location Performance
        </h3>
        <div className="space-y-3">
          {metrics.local.locations.map((location, index) => (
            <div key={location.location} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{location.location}</p>
                  <p className="text-sm text-gray-600">{location.posts} posts</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">#{location.avgPosition}</p>
                <p className="text-sm text-gray-600">{location.localTraffic} visits</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Listings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Listings</h3>
        <div className="space-y-3">
          {metrics.local.businessListings.map((business, index) => (
            <div key={business.name} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{business.name}</p>
                <p className="text-sm text-gray-600">{business.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  business.status === 'verified' ? 'bg-green-100 text-green-800' :
                  business.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {business.status}
                </span>
                <span className="text-sm text-gray-600">{business.visibility}% visible</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper Components

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
  trend?: string
  status?: 'good' | 'warning' | 'error'
}

function MetricCard({ title, value, icon, color, trend, status }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  const statusIcons = {
    good: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {status && statusIcons[status]}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-gray-600">{title}</p>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.startsWith('+') ? 'text-green-600' : 
            trend.startsWith('-') && !trend.includes('position') ? 'text-red-600' : 
            'text-green-600' // Position decreases are good
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

function VitalCard({ title, value, description, status }: {
  title: string
  value: string
  description: string
  status: 'good' | 'poor'
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className={`w-3 h-3 rounded-full ${
          status === 'good' ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}