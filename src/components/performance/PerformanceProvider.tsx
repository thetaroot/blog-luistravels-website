'use client'

/**
 * Performance Provider - Phase 2.4 Implementation
 * SEO-Dominance-2025 - Enterprise Performance Management System
 * Integrates Critical Resource Preloader + Advanced Performance Monitor
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import CriticalResourcePreloader from '@/lib/performance/resource-preloader'
import AdvancedPerformanceMonitor from '@/lib/performance/advanced-monitoring'
import GoogleAnalyticsManager from '@/lib/analytics/google-analytics'
import SearchConsoleManager from '@/lib/analytics/search-console'
import PerformanceAlertingSystem from '@/lib/analytics/performance-alerts'
import CWVOptimizationEngine from '@/lib/analytics/optimization-engine'
import type {
  PerformanceInsights,
  NavigationMetrics,
  UserExperienceMetrics
} from '@/lib/performance/advanced-monitoring'
import type { ResourceMetrics } from '@/lib/performance/resource-preloader'
import type { SearchConsoleInsights } from '@/lib/analytics/search-console'
import type { OptimizationAnalysis } from '@/lib/analytics/optimization-engine'
import type { Alert } from '@/lib/analytics/performance-alerts'

interface PerformanceContextType {
  preloader: CriticalResourcePreloader
  monitor: AdvancedPerformanceMonitor
  analytics: GoogleAnalyticsManager | null
  searchConsole: SearchConsoleManager | null
  alerting: PerformanceAlertingSystem | null
  optimization: CWVOptimizationEngine
  insights: PerformanceInsights | null
  navigationMetrics: NavigationMetrics | null
  userExperienceMetrics: UserExperienceMetrics | null
  preloadStats: {
    preloadedCount: number
    pendingCount: number
    metrics: ResourceMetrics[]
    averageLoadTime: number
    cacheHitRate: number
  } | null
  searchConsoleInsights: SearchConsoleInsights | null
  optimizationAnalysis: OptimizationAnalysis | null
  activeAlerts: Alert[]
  isInitialized: boolean
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}

interface PerformanceProviderProps {
  children: React.ReactNode
  enableDevMode?: boolean
  reportingInterval?: number
  enableAnalytics?: boolean
  enableSearchConsole?: boolean
  enableAlerting?: boolean
  analyticsConfig?: {
    measurementId: string
    enableDebugMode?: boolean
  }
}

export function PerformanceProvider({ 
  children, 
  enableDevMode = process.env.NODE_ENV === 'development',
  reportingInterval = 30000,
  enableAnalytics = true,
  enableSearchConsole = false,
  enableAlerting = true,
  analyticsConfig = {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    enableDebugMode: process.env.NODE_ENV === 'development'
  }
}: PerformanceProviderProps) {
  const [preloader] = useState(() => CriticalResourcePreloader.getInstance())
  const [monitor] = useState(() => AdvancedPerformanceMonitor.getInstance())
  const [optimization] = useState(() => CWVOptimizationEngine.getInstance())
  const [analytics, setAnalytics] = useState<GoogleAnalyticsManager | null>(null)
  const [searchConsole, setSearchConsole] = useState<SearchConsoleManager | null>(null)
  const [alerting, setAlerting] = useState<PerformanceAlertingSystem | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [insights, setInsights] = useState<PerformanceInsights | null>(null)
  const [navigationMetrics, setNavigationMetrics] = useState<NavigationMetrics | null>(null)
  const [userExperienceMetrics, setUserExperienceMetrics] = useState<UserExperienceMetrics | null>(null)
  const [preloadStats, setPreloadStats] = useState<PerformanceContextType['preloadStats']>(null)
  const [searchConsoleInsights, setSearchConsoleInsights] = useState<SearchConsoleInsights | null>(null)
  const [optimizationAnalysis, setOptimizationAnalysis] = useState<OptimizationAnalysis | null>(null)
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializePerformance = async () => {
      console.log('🚀 Initializing Enterprise Performance System...')
      
      try {
        // Initialize core systems
        preloader.initialize()
        monitor.initialize()
        optimization.initialize()
        
        // Initialize analytics systems
        if (enableAnalytics && analyticsConfig.measurementId !== 'G-XXXXXXXXXX') {
          const analyticsInstance = GoogleAnalyticsManager.getInstance({
            measurementId: analyticsConfig.measurementId,
            enableDebugMode: analyticsConfig.enableDebugMode || false,
            enableEnhancedMeasurement: true,
            enableCrossDomainTracking: false,
            sampleRate: 100,
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
          })
          
          await analyticsInstance.initialize()
          setAnalytics(analyticsInstance)
          
          console.log('📊 Google Analytics 4 initialized')
        }
        
        // Initialize Search Console (if enabled)
        if (enableSearchConsole) {
          // Note: Search Console requires OAuth setup
          console.log('🔍 Search Console integration available (requires configuration)')
        }
        
        // Initialize alerting system
        if (enableAlerting) {
          const alertingInstance = PerformanceAlertingSystem.getInstance({
            enableRealTimeAlerting: true,
            enableBrowserNotifications: enableDevMode,
            enableConsoleLogging: true,
            enableAnalyticsEvents: enableAnalytics,
            globalCooldownPeriod: 30000,
            maxAlertsPerSession: 10,
            enableAlertDeduplication: true
          })
          
          alertingInstance.initialize(analytics || undefined)
          setAlerting(alertingInstance)
          
          console.log('🚨 Performance Alerting System initialized')
        }
        
        setIsInitialized(true)
        
        if (enableDevMode) {
          console.log('✅ Enterprise Performance System initialized in development mode')
        }
        
        // Setup periodic updates
        const updateInterval = setInterval(() => {
          updatePerformanceMetrics()
        }, reportingInterval)

        // Update metrics after page load
        window.addEventListener('load', () => {
          setTimeout(updatePerformanceMetrics, 2000)
        })

        return () => {
          clearInterval(updateInterval)
        }
      } catch (error) {
        console.error('❌ Performance system initialization failed:', error)
      }
    }

    const updatePerformanceMetrics = () => {
      try {
        const currentInsights = monitor.generateInsights()
        const currentNavMetrics = monitor.getNavigationMetrics()
        const currentUserMetrics = monitor.getUserExperienceMetrics()
        const currentPreloadStats = preloader.getPreloadStats()
        const resourceTimings = monitor.getResourceTimings()

        setInsights(currentInsights)
        setNavigationMetrics(currentNavMetrics)
        setUserExperienceMetrics(currentUserMetrics)
        setPreloadStats(currentPreloadStats)

        // Update analytics if available
        if (analytics && currentNavMetrics && currentUserMetrics) {
          analytics.trackPerformanceMetrics(currentNavMetrics, currentUserMetrics, currentInsights)
        }

        // Evaluate alerts if available
        if (alerting && currentNavMetrics && currentUserMetrics) {
          alerting.evaluateMetrics(currentNavMetrics, currentUserMetrics, currentInsights)
          setActiveAlerts(alerting.getActiveAlerts())
        }

        // Generate optimization analysis
        if (currentNavMetrics && currentUserMetrics) {
          const analysis = optimization.generateOptimizationAnalysis(
            currentNavMetrics,
            currentUserMetrics,
            currentInsights,
            searchConsoleInsights || undefined,
            resourceTimings
          )
          setOptimizationAnalysis(analysis)
        }

        if (enableDevMode) {
          console.log('📊 Performance Metrics Updated:', {
            insights: currentInsights,
            navigation: currentNavMetrics,
            userExperience: currentUserMetrics,
            preloadStats: currentPreloadStats,
            activeAlerts: activeAlerts.length,
            optimizationScore: optimizationAnalysis?.overallScore
          })
        }
      } catch (error) {
        console.error('❌ Performance metrics update failed:', error)
      }
    }

    initializePerformance()

    // Cleanup on unmount
    return () => {
      preloader.cleanup()
      monitor.cleanup()
      analytics?.cleanup()
      searchConsole?.cleanup()
      alerting?.cleanup()
    }
  }, [preloader, monitor, optimization, enableDevMode, reportingInterval, enableAnalytics, enableSearchConsole, enableAlerting])

  // Route-based preloading
  useEffect(() => {
    if (!isInitialized) return

    const handleRouteChange = () => {
      const currentPath = window.location.pathname
      preloader.preloadRouteResources(currentPath)
    }

    // Initial route preload
    handleRouteChange()

    // Listen for route changes (for client-side navigation)
    const handlePopState = () => {
      setTimeout(handleRouteChange, 100)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isInitialized, preloader])

  const contextValue: PerformanceContextType = {
    preloader,
    monitor,
    analytics,
    searchConsole,
    alerting,
    optimization,
    insights,
    navigationMetrics,
    userExperienceMetrics,
    preloadStats,
    searchConsoleInsights,
    optimizationAnalysis,
    activeAlerts,
    isInitialized
  }

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      {enableDevMode && <PerformanceDevTools />}
    </PerformanceContext.Provider>
  )
}


/**
 * Development Tools Component for Performance Debugging
 */
function PerformanceDevTools() {
  const { 
    insights, 
    navigationMetrics, 
    userExperienceMetrics, 
    preloadStats,
    activeAlerts,
    optimizationAnalysis,
    isInitialized 
  } = usePerformance()
  
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])

  if (!isVisible || !isInitialized) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '80vh',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10000,
        overflow: 'auto',
        border: '2px solid #00ff00'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>🚀 Performance DevTools</h3>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Core Web Vitals */}
      {navigationMetrics && (
        <div style={{ marginBottom: '15px' }}>
          <h4>📊 Core Web Vitals</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '11px' }}>
            <div>LCP: {navigationMetrics.lcp.toFixed(0)}ms</div>
            <div>INP: {navigationMetrics.inp.toFixed(0)}ms</div>
            <div>CLS: {navigationMetrics.cls.toFixed(3)}</div>
            <div>FCP: {navigationMetrics.fcp.toFixed(0)}ms</div>
            <div>TTFB: {navigationMetrics.ttfb.toFixed(0)}ms</div>
            <div>TBT: {navigationMetrics.tbt.toFixed(0)}ms</div>
          </div>
        </div>
      )}

      {/* User Experience */}
      {userExperienceMetrics && (
        <div style={{ marginBottom: '15px' }}>
          <h4>👤 User Experience</h4>
          <div style={{ fontSize: '11px' }}>
            <div>Score: {userExperienceMetrics.performanceScore}/100</div>
            <div>Interactions: {userExperienceMetrics.interactionCount}</div>
            <div>Scroll: {userExperienceMetrics.scrollDepth.toFixed(1)}%</div>
            <div>Errors: {userExperienceMetrics.errorCount}</div>
          </div>
        </div>
      )}

      {/* Preload Stats */}
      {preloadStats && (
        <div style={{ marginBottom: '15px' }}>
          <h4>⚡ Preload Performance</h4>
          <div style={{ fontSize: '11px' }}>
            <div>Preloaded: {preloadStats.preloadedCount}</div>
            <div>Pending: {preloadStats.pendingCount}</div>
            <div>Avg Load: {preloadStats.averageLoadTime.toFixed(0)}ms</div>
            <div>Cache Hit: {(preloadStats.cacheHitRate * 100).toFixed(1)}%</div>
          </div>
        </div>
      )}

      {/* Critical Issues */}
      {insights && insights.criticalIssues.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h4>🚨 Critical Issues</h4>
          {insights.criticalIssues.map((issue, index) => (
            <div key={index} style={{ fontSize: '10px', color: '#ff6b6b', marginBottom: '2px' }}>
              • {issue}
            </div>
          ))}
        </div>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h4>🚨 Active Alerts</h4>
          {activeAlerts.slice(0, 3).map((alert, index) => (
            <div key={index} style={{ fontSize: '10px', color: '#ff6b6b', marginBottom: '2px' }}>
              • {alert.message}
            </div>
          ))}
          {activeAlerts.length > 3 && (
            <div style={{ fontSize: '9px', color: '#888' }}>
              +{activeAlerts.length - 3} more alerts
            </div>
          )}
        </div>
      )}

      {/* Optimization Score */}
      {optimizationAnalysis && (
        <div style={{ marginBottom: '15px' }}>
          <h4>🎯 Optimization</h4>
          <div style={{ fontSize: '11px' }}>
            <div>Score: {optimizationAnalysis.overallScore}/100</div>
            <div>Critical Issues: {optimizationAnalysis.criticalIssues}</div>
            <div>Quick Wins: {optimizationAnalysis.quickWins.length}</div>
          </div>
        </div>
      )}

      {/* SEO Impact */}
      {insights && (
        <div style={{ marginBottom: '15px' }}>
          <h4>📈 SEO Impact</h4>
          <div style={{ fontSize: '11px' }}>
            <div>Ranking Factor: {insights.seoImpact.rankingFactor.toFixed(1)}/10</div>
            <div>Traffic Impact: +{insights.seoImpact.expectedTrafficIncrease.toFixed(1)}%</div>
            <div>CWV Score: {insights.seoImpact.coreWebVitalsScore}/100</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center' }}>
        Press Ctrl+Shift+P to toggle • SEO-Dominance-2025 • Phase 2.5
      </div>
    </div>
  )
}

export default PerformanceProvider