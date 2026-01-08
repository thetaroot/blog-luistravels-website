'use client'

/**
 * Performance Demo Component - Phase 2.4 Showcase
 * SEO-Dominance-2025 - Demonstrating Enterprise Performance Systems
 * Showcases Critical Resource Preloading + Advanced Performance Monitoring
 */

import React, { useState, useEffect } from 'react'
import { usePerformance } from '@/components/performance/PerformanceProvider'

export function PerformanceDemo() {
  const { 
    insights, 
    navigationMetrics, 
    userExperienceMetrics, 
    preloadStats,
    isInitialized,
    preloader,
    monitor 
  } = usePerformance()
  
  const [simulatedLoad, setSimulatedLoad] = useState(false)
  const [demoMetrics, setDemoMetrics] = useState<any>(null)

  // Simulate heavy resource loading for demo
  const simulateHeavyLoad = async () => {
    setSimulatedLoad(true)
    
    // Simulate preloading heavy resources
    const heavyResources = [
      { 
        url: '/demo/heavy-image-1.jpg', 
        type: 'image' as const, 
        priority: 'high' as const, 
        as: 'image' as const 
      },
      { 
        url: '/demo/heavy-script.js', 
        type: 'script' as const, 
        priority: 'medium' as const, 
        as: 'script' as const 
      },
      { 
        url: '/demo/analytics.js', 
        type: 'script' as const, 
        priority: 'low' as const, 
        as: 'script' as const 
      }
    ]

    try {
      const preloadPromises = heavyResources.map(resource => 
        preloader.preloadResource(resource)
      )
      
      await Promise.allSettled(preloadPromises)
      
      // Update demo metrics
      setTimeout(() => {
        setDemoMetrics({
          preloadStats: preloader.getPreloadStats(),
          insights: monitor.generateInsights(),
          timestamp: new Date().toLocaleTimeString()
        })
        setSimulatedLoad(false)
      }, 1000)
    } catch (error) {
      console.error('Demo simulation failed:', error)
      setSimulatedLoad(false)
    }
  }

  // Generate performance score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  // Format Core Web Vitals rating
  const getVitalRating = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'LCP': { good: 2500, poor: 4000 },
      'INP': { good: 200, poor: 500 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'unknown'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-500'
      case 'needs-improvement': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getRatingEmoji = (rating: string) => {
    switch (rating) {
      case 'good': return '✅'
      case 'needs-improvement': return '⚠️'
      case 'poor': return '❌'
      default: return '⚪'
    }
  }

  if (!isInitialized) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing Performance Systems...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🚀 Enterprise Performance System</h2>
        <p className="text-blue-100">
          Advanced Critical Resource Preloading + Real-time Performance Monitoring
        </p>
        <div className="mt-4 text-sm opacity-90">
          SEO-Dominance-2025 • Phase 2.4 Implementation
        </div>
      </div>

      {/* Core Web Vitals Dashboard */}
      {navigationMetrics && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            📊 Core Web Vitals Dashboard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'LCP', value: navigationMetrics.lcp, unit: 'ms', target: '< 2.5s' },
              { name: 'INP', value: navigationMetrics.inp, unit: 'ms', target: '< 200ms' },
              { name: 'CLS', value: navigationMetrics.cls, unit: '', target: '< 0.1' },
              { name: 'FCP', value: navigationMetrics.fcp, unit: 'ms', target: '< 1.8s' },
              { name: 'TTFB', value: navigationMetrics.ttfb, unit: 'ms', target: '< 800ms' },
              { name: 'TBT', value: navigationMetrics.tbt, unit: 'ms', target: '< 200ms' }
            ].map(metric => {
              const rating = getVitalRating(metric.name, metric.value)
              const displayValue = metric.name === 'CLS' 
                ? metric.value.toFixed(3) 
                : `${Math.round(metric.value)}${metric.unit}`
              
              return (
                <div key={metric.name} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">{metric.name}</div>
                  <div className={`text-lg font-bold ${getRatingColor(rating)}`}>
                    {displayValue}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getRatingEmoji(rating)} {metric.target}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Performance Score & User Experience */}
      <div className="grid md:grid-cols-2 gap-6">
        {userExperienceMetrics && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              👤 User Experience Score
            </h3>
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold ${getScoreColor(userExperienceMetrics.performanceScore)}`}>
                {userExperienceMetrics.performanceScore}/100
              </div>
              <div className="text-gray-600 mt-2">Overall Performance Score</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Interactions:</span>
                <span className="font-semibold">{userExperienceMetrics.interactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scroll Depth:</span>
                <span className="font-semibold">{userExperienceMetrics.scrollDepth.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time on Page:</span>
                <span className="font-semibold">{Math.round(userExperienceMetrics.timeOnPage / 1000)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Error Count:</span>
                <span className={`font-semibold ${userExperienceMetrics.errorCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {userExperienceMetrics.errorCount}
                </span>
              </div>
            </div>
          </div>
        )}

        {preloadStats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              ⚡ Resource Preloading Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Preloaded Resources:</span>
                <span className="font-semibold text-blue-600">{preloadStats.preloadedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Loads:</span>
                <span className="font-semibold text-orange-500">{preloadStats.pendingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Load Time:</span>
                <span className="font-semibold">{preloadStats.averageLoadTime.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cache Hit Rate:</span>
                <span className="font-semibold text-green-600">
                  {(preloadStats.cacheHitRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      {insights && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🔍 Performance Insights & SEO Impact
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Critical Issues */}
            <div>
              <h4 className="font-semibold text-red-600 mb-3">🚨 Critical Issues</h4>
              {insights.criticalIssues.length > 0 ? (
                <ul className="space-y-2">
                  {insights.criticalIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                      • {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-green-600 bg-green-50 p-3 rounded">
                  ✅ No critical performance issues detected
                </div>
              )}
            </div>

            {/* SEO Impact */}
            <div>
              <h4 className="font-semibold text-blue-600 mb-3">📈 SEO Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ranking Factor:</span>
                  <span className="font-semibold">
                    {insights.seoImpact.rankingFactor.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Traffic Increase:</span>
                  <span className="font-semibold text-green-600">
                    +{insights.seoImpact.expectedTrafficIncrease.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Core Web Vitals Score:</span>
                  <span className={`font-semibold ${getScoreColor(insights.seoImpact.coreWebVitalsScore)}`}>
                    {insights.seoImpact.coreWebVitalsScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Opportunities */}
          {insights.optimizationOpportunities.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-orange-600 mb-3">💡 Optimization Opportunities</h4>
              <ul className="space-y-2">
                {insights.optimizationOpportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                    • {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Demo Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🧪 Performance Demo Controls</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={simulateHeavyLoad}
            disabled={simulatedLoad}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {simulatedLoad ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Simulating Heavy Load...
              </>
            ) : (
              'Simulate Heavy Resource Loading'
            )}
          </button>
          
          <div className="text-sm text-gray-600 flex items-center">
            Press <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+Shift+P</kbd> for DevTools
          </div>
        </div>

        {demoMetrics && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Demo Results ({demoMetrics.timestamp})</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Resources Preloaded:</span>
                <span className="ml-2 font-semibold">{demoMetrics.preloadStats.preloadedCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Avg Load Time:</span>
                <span className="ml-2 font-semibold">{demoMetrics.preloadStats.averageLoadTime.toFixed(0)}ms</span>
              </div>
              <div>
                <span className="text-gray-600">Cache Hit Rate:</span>
                <span className="ml-2 font-semibold">{(demoMetrics.preloadStats.cacheHitRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Critical Resource Preloader: Active
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Advanced Performance Monitor: Active
          </span>
        </div>
        <div className="mt-2 text-xs">
          SEO-Dominance-2025 • Enterprise Performance Management System
        </div>
      </div>
    </div>
  )
}

export default PerformanceDemo