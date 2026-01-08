'use client'

/**
 * Phase 9 Quality Assurance Dashboard
 * Real-time monitoring and optimization for Google 10/10 SEO achievement
 */

import React, { useState, useEffect } from 'react'

interface Phase9Metrics {
  seoScore: number
  performanceScore: number
  accessibilityScore: number
  userExperienceScore: number
  technicalQualityScore: number
  contentQualityScore: number
  competitiveAdvantageScore: number
  futureProofScore: number
  overallQualityGrade: string
}

interface Phase9Data {
  post: {
    slug: string
    title: string
    url: string
  }
  qualityMetrics: Phase9Metrics
  finalScore: number
  google10of10Achieved: boolean
  competitivePosition: string
  futureProofRating: number
  processingTime: number
  lastOptimized: string
  optimizationPlan: Array<{
    priority: string
    category: string
    action: string
    expectedImprovement: number
    difficulty: string
    roi: string
  }>
  validation: {
    passed: boolean
    score: number
    criticalFailures: string[]
    warnings: string[]
    improvements: string[]
  }
}

export default function Phase9Dashboard() {
  const [phase9Results, setPhase9Results] = useState<Phase9Data[]>([])
  const [selectedPost, setSelectedPost] = useState<Phase9Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false)

  useEffect(() => {
    fetchPhase9Results()
  }, [])

  const fetchPhase9Results = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/seo/phase9/results')
      const data = await response.json()
      setPhase9Results(data.results || [])
    } catch (error) {
      console.error('Failed to fetch Phase 9 results:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeOptimization = async (slug: string) => {
    try {
      const response = await fetch('/api/seo/phase9/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, autoApply: autoOptimizeEnabled })
      })
      
      if (response.ok) {
        await fetchPhase9Results()
      }
    } catch (error) {
      console.error('Optimization failed:', error)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeColor = (grade: string): string => {
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-800'
    if (grade === 'B+' || grade === 'B') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const google10of10Count = phase9Results.filter(r => r.google10of10Achieved).length
  const averageScore = phase9Results.length > 0 
    ? phase9Results.reduce((sum, r) => sum + r.finalScore, 0) / phase9Results.length 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading Phase 9 Analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎯 Phase 9: Quality Assurance</h1>
              <p className="text-gray-600 mt-2">Google 10/10 Achievement Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoOptimizeEnabled}
                  onChange={(e) => setAutoOptimizeEnabled(e.target.checked)}
                  className="mr-2"
                />
                Auto-Optimize
              </label>
              <button
                onClick={fetchPhase9Results}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{google10of10Count}</div>
              <div className="text-gray-600">Google 10/10 Achieved</div>
              <div className="text-sm text-gray-500">
                {phase9Results.length > 0 ? Math.round((google10of10Count / phase9Results.length) * 100) : 0}% Success Rate
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}
              </div>
              <div className="text-gray-600">Average Score</div>
              <div className="text-sm text-gray-500">Out of 100</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{phase9Results.length}</div>
              <div className="text-gray-600">Posts Analyzed</div>
              <div className="text-sm text-gray-500">Total Optimizations</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {phase9Results.filter(r => r.competitivePosition === 'Market Leader').length}
              </div>
              <div className="text-gray-600">Market Leaders</div>
              <div className="text-sm text-gray-500">Competitive Position</div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Posts List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">SEO Quality Results</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {phase9Results.map((result) => (
                <div
                  key={result.post.slug}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedPost?.post.slug === result.post.slug ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPost(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {result.post.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-lg font-bold ${getScoreColor(result.finalScore)}`}>
                          {result.finalScore}/100
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getGradeColor(result.qualityMetrics.overallQualityGrade)}`}>
                          {result.qualityMetrics.overallQualityGrade}
                        </span>
                        {result.google10of10Achieved && (
                          <span className="text-green-600 text-sm">🏆 Google 10/10</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        executeOptimization(result.post.slug)
                      }}
                      className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed View */}
          <div className="bg-white rounded-lg shadow-sm">
            {selectedPost ? (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">{selectedPost.post.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-2xl font-bold ${getScoreColor(selectedPost.finalScore)}`}>
                      {selectedPost.finalScore}/100
                    </span>
                    <span className={`px-3 py-1 rounded-full ${getGradeColor(selectedPost.qualityMetrics.overallQualityGrade)}`}>
                      Grade {selectedPost.qualityMetrics.overallQualityGrade}
                    </span>
                    <span className="text-gray-600">
                      {selectedPost.competitivePosition}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Quality Metrics */}
                  <div>
                    <h3 className="font-medium mb-3">Quality Metrics</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'SEO Score', value: selectedPost.qualityMetrics.seoScore },
                        { label: 'Performance', value: selectedPost.qualityMetrics.performanceScore },
                        { label: 'Accessibility', value: selectedPost.qualityMetrics.accessibilityScore },
                        { label: 'User Experience', value: selectedPost.qualityMetrics.userExperienceScore },
                        { label: 'Technical Quality', value: selectedPost.qualityMetrics.technicalQualityScore },
                        { label: 'Content Quality', value: selectedPost.qualityMetrics.contentQualityScore }
                      ].map((metric) => (
                        <div key={metric.label} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{metric.label}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  metric.value >= 95 ? 'bg-green-500' :
                                  metric.value >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${metric.value}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(metric.value)}`}>
                              {metric.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Validation Status */}
                  <div>
                    <h3 className="font-medium mb-3">Validation Status</h3>
                    <div className="space-y-2">
                      {selectedPost.validation.criticalFailures.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-600 mb-1">Critical Failures</h4>
                          {selectedPost.validation.criticalFailures.map((failure, idx) => (
                            <div key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              🚨 {failure}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {selectedPost.validation.warnings.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-yellow-600 mb-1">Warnings</h4>
                          {selectedPost.validation.warnings.slice(0, 3).map((warning, idx) => (
                            <div key={idx} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                              ⚠️ {warning}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Optimization Plan */}
                  <div>
                    <h3 className="font-medium mb-3">Optimization Plan</h3>
                    <div className="space-y-2">
                      {selectedPost.optimizationPlan.slice(0, 5).map((plan, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{plan.action}</div>
                            <div className="text-xs text-gray-500">
                              {plan.category} • {plan.difficulty} • ROI: {plan.roi}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            +{plan.expectedImprovement}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Select a post to view detailed analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}