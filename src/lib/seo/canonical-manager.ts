/**
 * Enterprise Canonical URL Management System
 * SEO-Dominance-2025 - Advanced duplicate content prevention and URL canonicalization
 * Google Senior Dev Level implementation for optimal search engine indexing
 */

export interface CanonicalConfig {
  baseUrl: string
  trailingSlash: boolean
  wwwPrefix: boolean
  httpsEnforcement: boolean
  lowercaseUrls: boolean
  parameterHandling: 'preserve' | 'remove' | 'whitelist' | 'blacklist'
  allowedParams?: string[]
  ignoredParams?: string[]
  customRules?: CanonicalRule[]
}

export interface CanonicalRule {
  pattern: RegExp
  canonical: string | ((matches: RegExpMatchArray) => string)
  priority: number
}

export interface URLVariation {
  original: string
  canonical: string
  reason: string
  redirectType?: 301 | 302
}

/**
 * Enterprise Canonical URL Manager
 */
export class CanonicalManager {
  private static instance: CanonicalManager
  private config: CanonicalConfig
  private urlPatterns: Map<string, string> = new Map()
  private redirectRules: CanonicalRule[] = []

  private constructor() {
    this.config = this.getDefaultConfig()
    this.initializeDefaultRules()
  }

  static getInstance(): CanonicalManager {
    if (!CanonicalManager.instance) {
      CanonicalManager.instance = new CanonicalManager()
    }
    return CanonicalManager.instance
  }

  /**
   * Get default canonical configuration
   */
  private getDefaultConfig(): CanonicalConfig {
    return {
      baseUrl: typeof window !== 'undefined' ? window.location.origin : 'https://luis-portfolio.com',
      trailingSlash: false,
      wwwPrefix: false,
      httpsEnforcement: true,
      lowercaseUrls: true,
      parameterHandling: 'blacklist',
      ignoredParams: [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'msclkid', 'ref', 'source', 'campaign',
        '_ga', '_gl', 'mc_cid', 'mc_eid'
      ],
      customRules: []
    }
  }

  /**
   * Initialize default canonicalization rules
   */
  private initializeDefaultRules(): void {
    this.redirectRules = [
      // Blog post variations
      {
        pattern: /^\/blog\/(.+?)\/$/,
        canonical: (matches) => `/blog/${matches[1]}`,
        priority: 100
      },
      
      // Gallery variations
      {
        pattern: /^\/gallery\/(.+?)\/$/,
        canonical: (matches) => `/gallery/${matches[1]}`,
        priority: 100
      },
      
      // Case normalization
      {
        pattern: /^\/([A-Z].*)$/,
        canonical: (matches) => `/${matches[1].toLowerCase()}`,
        priority: 90
      },
      
      // Double slashes
      {
        pattern: /\/\/+/g,
        canonical: '/',
        priority: 95
      },
      
      // Index.html removal
      {
        pattern: /^(.*)\/index\.html?$/,
        canonical: (matches) => matches[1] || '/',
        priority: 85
      },
      
      // File extensions on pages
      {
        pattern: /^(.*)\.html?$/,
        canonical: (matches) => matches[1],
        priority: 80
      }
    ]
  }

  /**
   * Update canonical configuration
   */
  updateConfig(newConfig: Partial<CanonicalConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    if (newConfig.customRules) {
      this.redirectRules = [
        ...this.redirectRules,
        ...newConfig.customRules.sort((a, b) => b.priority - a.priority)
      ]
    }
  }

  /**
   * Generate canonical URL for a given path
   */
  generateCanonicalUrl(path: string, params?: URLSearchParams | Record<string, string>): string {
    try {
      // Normalize the path
      let normalizedPath = this.normalizePath(path)
      
      // Apply custom rules
      normalizedPath = this.applyCanonicalRules(normalizedPath)
      
      // Handle parameters
      const cleanParams = this.cleanParameters(params)
      const queryString = cleanParams.toString()
      
      // Construct the canonical URL
      let canonicalUrl = `${this.config.baseUrl}${normalizedPath}`
      
      if (queryString) {
        canonicalUrl += `?${queryString}`
      }
      
      return canonicalUrl
      
    } catch (error) {
      console.error('Error generating canonical URL:', error)
      return `${this.config.baseUrl}${path}`
    }
  }

  /**
   * Normalize URL path according to configuration
   */
  private normalizePath(path: string): string {
    let normalized = path

    // Ensure leading slash
    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`
    }

    // Lowercase URLs
    if (this.config.lowercaseUrls) {
      normalized = normalized.toLowerCase()
    }

    // Handle trailing slash
    if (this.config.trailingSlash) {
      if (!normalized.endsWith('/') && !normalized.includes('.')) {
        normalized += '/'
      }
    } else {
      if (normalized.endsWith('/') && normalized !== '/') {
        normalized = normalized.slice(0, -1)
      }
    }

    // Clean up double slashes
    normalized = normalized.replace(/\/+/g, '/')

    return normalized
  }

  /**
   * Apply canonical rules to path
   */
  private applyCanonicalRules(path: string): string {
    let result = path

    for (const rule of this.redirectRules.sort((a, b) => b.priority - a.priority)) {
      const matches = result.match(rule.pattern)
      if (matches) {
        if (typeof rule.canonical === 'function') {
          result = rule.canonical(matches)
        } else {
          result = rule.canonical
        }
        break // Apply only the highest priority matching rule
      }
    }

    return result
  }

  /**
   * Clean URL parameters according to configuration
   */
  private cleanParameters(params?: URLSearchParams | Record<string, string>): URLSearchParams {
    const cleanParams = new URLSearchParams()

    if (!params) return cleanParams

    const paramEntries = params instanceof URLSearchParams 
      ? Array.from(params.entries())
      : Object.entries(params)

    switch (this.config.parameterHandling) {
      case 'preserve':
        paramEntries.forEach(([key, value]) => {
          cleanParams.set(key, value)
        })
        break

      case 'remove':
        // Don't add any parameters
        break

      case 'whitelist':
        if (this.config.allowedParams) {
          paramEntries.forEach(([key, value]) => {
            if (this.config.allowedParams!.includes(key)) {
              cleanParams.set(key, value)
            }
          })
        }
        break

      case 'blacklist':
        paramEntries.forEach(([key, value]) => {
          if (!this.config.ignoredParams?.includes(key)) {
            cleanParams.set(key, value)
          }
        })
        break
    }

    return cleanParams
  }

  /**
   * Check if URL needs canonicalization
   */
  needsCanonicalization(url: string): URLVariation | null {
    try {
      const urlObj = new URL(url)
      const currentPath = urlObj.pathname
      const currentParams = urlObj.searchParams
      
      // Generate the canonical version
      const canonicalUrl = this.generateCanonicalUrl(currentPath, currentParams)
      const canonicalObj = new URL(canonicalUrl)
      
      // Check if canonicalization is needed
      const needsRedirect = 
        urlObj.protocol !== canonicalObj.protocol ||
        urlObj.hostname !== canonicalObj.hostname ||
        urlObj.pathname !== canonicalObj.pathname ||
        urlObj.search !== canonicalObj.search

      if (needsRedirect) {
        return {
          original: url,
          canonical: canonicalUrl,
          reason: this.getRedirectReason(urlObj, canonicalObj),
          redirectType: this.getRedirectType(urlObj, canonicalObj)
        }
      }

      return null

    } catch (error) {
      console.error('Error checking canonicalization:', error)
      return null
    }
  }

  /**
   * Get reason for redirect
   */
  private getRedirectReason(original: URL, canonical: URL): string {
    const reasons = []

    if (original.protocol !== canonical.protocol) {
      reasons.push('protocol mismatch')
    }
    if (original.hostname !== canonical.hostname) {
      reasons.push('hostname normalization')
    }
    if (original.pathname !== canonical.pathname) {
      reasons.push('path normalization')
    }
    if (original.search !== canonical.search) {
      reasons.push('parameter cleanup')
    }

    return reasons.join(', ')
  }

  /**
   * Get appropriate redirect type
   */
  private getRedirectType(original: URL, canonical: URL): 301 | 302 {
    // Permanent redirects for structural changes
    if (
      original.protocol !== canonical.protocol ||
      original.hostname !== canonical.hostname ||
      original.pathname.toLowerCase() !== original.pathname ||
      original.pathname.endsWith('/index.html')
    ) {
      return 301
    }

    // Temporary redirects for parameter cleanup
    return 302
  }

  /**
   * Generate canonical URLs for sitemap
   */
  generateSitemapUrls(paths: string[]): Array<{
    url: string
    canonical: string
    priority: number
    changefreq: string
  }> {
    return paths.map(path => {
      const canonical = this.generateCanonicalUrl(path)
      
      return {
        url: path,
        canonical,
        priority: this.calculateSitemapPriority(path),
        changefreq: this.calculateChangeFreq(path)
      }
    })
  }

  /**
   * Calculate sitemap priority based on path
   */
  private calculateSitemapPriority(path: string): number {
    if (path === '/') return 1.0
    if (path.startsWith('/blog/')) return 0.8
    if (path.startsWith('/gallery/')) return 0.7
    if (path === '/about') return 0.9
    if (path === '/contact') return 0.6
    return 0.5
  }

  /**
   * Calculate change frequency based on path
   */
  private calculateChangeFreq(path: string): string {
    if (path === '/') return 'weekly'
    if (path.startsWith('/blog/')) return 'monthly'
    if (path.startsWith('/gallery/')) return 'monthly'
    if (path === '/about') return 'yearly'
    if (path === '/contact') return 'yearly'
    return 'monthly'
  }

  /**
   * Add custom canonical rule
   */
  addCanonicalRule(rule: CanonicalRule): void {
    this.redirectRules.push(rule)
    this.redirectRules.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Remove canonical rule by pattern
   */
  removeCanonicalRule(pattern: RegExp): void {
    this.redirectRules = this.redirectRules.filter(rule => 
      rule.pattern.toString() !== pattern.toString()
    )
  }

  /**
   * Get all canonical variations for a URL
   */
  getAllUrlVariations(baseUrl: string): string[] {
    const variations = new Set<string>()
    
    try {
      const url = new URL(baseUrl)
      const path = url.pathname
      const params = url.searchParams

      // Protocol variations
      variations.add(`http://${url.hostname}${path}${url.search}`)
      variations.add(`https://${url.hostname}${path}${url.search}`)

      // WWW variations
      const hostname = url.hostname
      const wwwHostname = hostname.startsWith('www.') ? hostname : `www.${hostname}`
      const nonWwwHostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname

      variations.add(`https://${wwwHostname}${path}${url.search}`)
      variations.add(`https://${nonWwwHostname}${path}${url.search}`)

      // Trailing slash variations
      const pathWithSlash = path.endsWith('/') ? path : `${path}/`
      const pathWithoutSlash = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path

      variations.add(`https://${hostname}${pathWithSlash}${url.search}`)
      variations.add(`https://${hostname}${pathWithoutSlash}${url.search}`)

      // Case variations
      if (path !== path.toLowerCase()) {
        variations.add(`https://${hostname}${path.toLowerCase()}${url.search}`)
      }

      // Parameter variations
      if (params.size > 0) {
        variations.add(`https://${hostname}${path}`)
      }

    } catch (error) {
      console.error('Error generating URL variations:', error)
    }

    return Array.from(variations)
  }

  /**
   * Validate canonical URL configuration
   */
  validateConfiguration(): Array<{ issue: string; severity: 'error' | 'warning'; suggestion: string }> {
    const issues = []

    // Check base URL format
    try {
      new URL(this.config.baseUrl)
    } catch {
      issues.push({
        issue: 'Invalid base URL format',
        severity: 'error' as const,
        suggestion: 'Ensure base URL is a valid absolute URL (e.g., https://example.com)'
      })
    }

    // Check HTTPS enforcement
    if (!this.config.httpsEnforcement && this.config.baseUrl.startsWith('http:')) {
      issues.push({
        issue: 'HTTP base URL without HTTPS enforcement',
        severity: 'warning' as const,
        suggestion: 'Consider enabling HTTPS enforcement for better SEO'
      })
    }

    // Check parameter handling conflicts
    if (this.config.parameterHandling === 'whitelist' && !this.config.allowedParams?.length) {
      issues.push({
        issue: 'Whitelist parameter handling without allowed parameters',
        severity: 'error' as const,
        suggestion: 'Define allowed parameters when using whitelist mode'
      })
    }

    // Check rule conflicts
    const patternStrings = this.redirectRules.map(rule => rule.pattern.toString())
    const duplicates = patternStrings.filter((pattern, index) => patternStrings.indexOf(pattern) !== index)
    
    if (duplicates.length > 0) {
      issues.push({
        issue: 'Duplicate canonical rules detected',
        severity: 'warning' as const,
        suggestion: 'Remove duplicate rules to avoid conflicts'
      })
    }

    return issues
  }

  /**
   * Get canonical statistics
   */
  getCanonicalStats(): {
    configuredRules: number
    baseUrl: string
    parameterHandling: string
    ignoredParamsCount: number
    allowedParamsCount: number
  } {
    return {
      configuredRules: this.redirectRules.length,
      baseUrl: this.config.baseUrl,
      parameterHandling: this.config.parameterHandling,
      ignoredParamsCount: this.config.ignoredParams?.length || 0,
      allowedParamsCount: this.config.allowedParams?.length || 0
    }
  }
}

export default CanonicalManager