/**
 * Enterprise Hreflang Management System
 * SEO-Dominance-2025 - Advanced international SEO and multi-language support
 * Google Senior Dev Level implementation for global search optimization
 */

export interface HreflangConfig {
  defaultLanguage: string
  defaultRegion?: string
  supportedLanguages: LanguageConfig[]
  autoDetect: boolean
  fallbackEnabled: boolean
  cookieEnabled: boolean
  urlStrategy: 'subdomain' | 'subdirectory' | 'parameter' | 'domain'
  generateSitemap: boolean
}

export interface LanguageConfig {
  code: string // ISO 639-1 language code (e.g., 'en', 'de', 'es')
  region?: string // ISO 3166-1 alpha-2 country code (e.g., 'US', 'DE', 'ES')
  name: string // Display name
  nativeName: string // Native language name
  direction: 'ltr' | 'rtl'
  enabled: boolean
  isDefault?: boolean
  domains?: string[] // For domain-based strategy
  subdomains?: string[] // For subdomain-based strategy
  paths?: string[] // For path-based strategy
}

export interface HreflangEntry {
  hreflang: string // Language-region code (e.g., 'en-US', 'de-DE', 'x-default')
  href: string // Absolute URL
  language: string
  region?: string
}

export interface PageTranslation {
  originalPath: string
  translations: Map<string, string> // language code -> translated path
  lastModified: Date
  priority: number
}

export interface InternationalSEOConfig {
  contentStrategy: 'translation' | 'localization' | 'transcreation'
  geoTargeting: boolean
  localizedImages: boolean
  localizedSchema: boolean
  currencyLocalization: boolean
  dateTimeLocalization: boolean
}

/**
 * Enterprise Hreflang Manager
 */
export class HreflangManager {
  private static instance: HreflangManager
  private config: HreflangConfig
  private translations: Map<string, PageTranslation> = new Map()
  private languageDetector: LanguageDetector
  private baseUrl: string = ''

  private constructor() {
    this.config = this.getDefaultConfig()
    this.languageDetector = new LanguageDetector()
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://luis-portfolio.com'
  }

  static getInstance(): HreflangManager {
    if (!HreflangManager.instance) {
      HreflangManager.instance = new HreflangManager()
    }
    return HreflangManager.instance
  }

  /**
   * Get default hreflang configuration
   */
  private getDefaultConfig(): HreflangConfig {
    return {
      defaultLanguage: 'en',
      defaultRegion: 'US',
      supportedLanguages: [
        {
          code: 'en',
          region: 'US',
          name: 'English',
          nativeName: 'English',
          direction: 'ltr',
          enabled: true,
          isDefault: true
        },
        {
          code: 'de',
          region: 'DE',
          name: 'German',
          nativeName: 'Deutsch',
          direction: 'ltr',
          enabled: true
        },
        {
          code: 'es',
          region: 'ES',
          name: 'Spanish',
          nativeName: 'Español',
          direction: 'ltr',
          enabled: true
        },
        {
          code: 'fr',
          region: 'FR',
          name: 'French',
          nativeName: 'Français',
          direction: 'ltr',
          enabled: false
        }
      ],
      autoDetect: true,
      fallbackEnabled: true,
      cookieEnabled: true,
      urlStrategy: 'subdirectory',
      generateSitemap: true
    }
  }

  /**
   * Update hreflang configuration
   */
  updateConfig(newConfig: Partial<HreflangConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Generate hreflang entries for a page
   */
  generateHreflangEntries(path: string): HreflangEntry[] {
    const entries: HreflangEntry[] = []
    const translation = this.translations.get(path)

    // Generate entries for all enabled languages
    for (const language of this.config.supportedLanguages) {
      if (!language.enabled) continue

      const hreflangCode = this.buildHreflangCode(language)
      const translatedPath = translation?.translations.get(language.code) || path
      const href = this.buildLocalizedUrl(translatedPath, language)

      entries.push({
        hreflang: hreflangCode,
        href,
        language: language.code,
        region: language.region
      })
    }

    // Add x-default entry (usually the default language)
    const defaultLanguage = this.config.supportedLanguages.find(lang => lang.isDefault) ||
                           this.config.supportedLanguages.find(lang => lang.code === this.config.defaultLanguage)

    if (defaultLanguage) {
      const defaultPath = translation?.translations.get(defaultLanguage.code) || path
      const defaultHref = this.buildLocalizedUrl(defaultPath, defaultLanguage)

      entries.push({
        hreflang: 'x-default',
        href: defaultHref,
        language: defaultLanguage.code,
        region: defaultLanguage.region
      })
    }

    return entries
  }

  /**
   * Build hreflang code (language-region format)
   */
  private buildHreflangCode(language: LanguageConfig): string {
    if (language.region) {
      return `${language.code}-${language.region}`
    }
    return language.code
  }

  /**
   * Build localized URL based on strategy
   */
  private buildLocalizedUrl(path: string, language: LanguageConfig): string {
    const isDefault = language.isDefault || language.code === this.config.defaultLanguage

    switch (this.config.urlStrategy) {
      case 'subdomain':
        if (isDefault && this.config.fallbackEnabled) {
          return `${this.baseUrl}${path}`
        }
        const subdomain = language.subdomains?.[0] || language.code
        const subdomainUrl = this.baseUrl.replace('://', `://${subdomain}.`)
        return `${subdomainUrl}${path}`

      case 'subdirectory':
        if (isDefault && this.config.fallbackEnabled) {
          return `${this.baseUrl}${path}`
        }
        const langPath = language.paths?.[0] || language.code
        return `${this.baseUrl}/${langPath}${path}`

      case 'parameter':
        const url = new URL(`${this.baseUrl}${path}`)
        if (!isDefault || !this.config.fallbackEnabled) {
          url.searchParams.set('lang', language.code)
          if (language.region) {
            url.searchParams.set('region', language.region)
          }
        }
        return url.toString()

      case 'domain':
        const domain = language.domains?.[0] || `${language.code}.${this.extractDomain(this.baseUrl)}`
        return `https://${domain}${path}`

      default:
        return `${this.baseUrl}${path}`
    }
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace(/^www\./, '')
    } catch {
      return 'example.com'
    }
  }

  /**
   * Add page translation
   */
  addPageTranslation(originalPath: string, translations: Record<string, string>, priority: number = 0.5): void {
    const translationMap = new Map(Object.entries(translations))
    
    this.translations.set(originalPath, {
      originalPath,
      translations: translationMap,
      lastModified: new Date(),
      priority
    })
  }

  /**
   * Get page translation
   */
  getPageTranslation(path: string, language: string): string | null {
    const translation = this.translations.get(path)
    return translation?.translations.get(language) || null
  }

  /**
   * Detect user language from various sources
   */
  detectUserLanguage(request?: {
    headers?: { 'accept-language'?: string }
    cookies?: Record<string, string>
    geo?: { country?: string }
  }): string {
    return this.languageDetector.detect(this.config, request)
  }

  /**
   * Generate hreflang HTML tags
   */
  generateHreflangHTML(path: string): string {
    const entries = this.generateHreflangEntries(path)
    
    return entries
      .map(entry => `<link rel="alternate" hreflang="${entry.hreflang}" href="${entry.href}" />`)
      .join('\n')
  }

  /**
   * Generate hreflang XML sitemap
   */
  generateHreflangSitemap(): string {
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    ]

    for (const [path, translation] of this.translations) {
      const entries = this.generateHreflangEntries(path)
      
      // Add URL entry for each language
      for (const language of this.config.supportedLanguages) {
        if (!language.enabled) continue

        const translatedPath = translation.translations.get(language.code) || path
        const href = this.buildLocalizedUrl(translatedPath, language)

        lines.push('  <url>')
        lines.push(`    <loc>${href}</loc>`)
        lines.push(`    <lastmod>${translation.lastModified.toISOString()}</lastmod>`)
        lines.push(`    <priority>${translation.priority}</priority>`)

        // Add alternate links for all languages
        entries.forEach(entry => {
          lines.push(`    <xhtml:link rel="alternate" hreflang="${entry.hreflang}" href="${entry.href}" />`)
        })

        lines.push('  </url>')
      }
    }

    lines.push('</urlset>')
    return lines.join('\n')
  }

  /**
   * Generate language switcher data
   */
  generateLanguageSwitcher(currentPath: string, currentLanguage: string): Array<{
    code: string
    name: string
    nativeName: string
    href: string
    isActive: boolean
    direction: 'ltr' | 'rtl'
  }> {
    return this.config.supportedLanguages
      .filter(lang => lang.enabled)
      .map(language => {
        const translatedPath = this.getPageTranslation(currentPath, language.code) || currentPath
        const href = this.buildLocalizedUrl(translatedPath, language)

        return {
          code: language.code,
          name: language.name,
          nativeName: language.nativeName,
          href,
          isActive: language.code === currentLanguage,
          direction: language.direction
        }
      })
  }

  /**
   * Validate hreflang implementation
   */
  validateHreflang(path: string): Array<{
    issue: string
    severity: 'error' | 'warning'
    suggestion: string
  }> {
    const issues = []
    const entries = this.generateHreflangEntries(path)

    // Check for duplicate hreflang codes
    const hreflangCodes = entries.map(entry => entry.hreflang)
    const duplicates = hreflangCodes.filter((code, index) => hreflangCodes.indexOf(code) !== index)
    
    if (duplicates.length > 0) {
      issues.push({
        issue: `Duplicate hreflang codes found: ${duplicates.join(', ')}`,
        severity: 'error' as const,
        suggestion: 'Ensure each language-region combination is unique'
      })
    }

    // Check for x-default presence
    const hasXDefault = entries.some(entry => entry.hreflang === 'x-default')
    if (!hasXDefault) {
      issues.push({
        issue: 'Missing x-default hreflang entry',
        severity: 'warning' as const,
        suggestion: 'Add x-default entry pointing to your default language version'
      })
    }

    // Check for bidirectional linking
    entries.forEach(entry => {
      if (entry.hreflang === 'x-default') return

      try {
        const targetEntries = this.generateHreflangEntries(entry.href.replace(this.baseUrl, ''))
        const hasBackLink = targetEntries.some(target => 
          target.href === `${this.baseUrl}${path}` && 
          target.hreflang === this.buildHreflangCode(
            this.config.supportedLanguages.find(l => l.isDefault) || this.config.supportedLanguages[0]
          )
        )

        if (!hasBackLink) {
          issues.push({
            issue: `Missing bidirectional link for ${entry.hreflang}`,
            severity: 'warning' as const,
            suggestion: 'Ensure all language versions link back to each other'
          })
        }
      } catch (error) {
        console.warn('Error validating bidirectional links:', error)
      }
    })

    return issues
  }

  /**
   * Get language statistics
   */
  getLanguageStats(): {
    totalLanguages: number
    enabledLanguages: number
    translatedPages: number
    averageTranslationCoverage: number
    urlStrategy: string
  } {
    const enabledLanguages = this.config.supportedLanguages.filter(lang => lang.enabled)
    const translatedPages = this.translations.size
    
    let totalTranslations = 0
    let possibleTranslations = 0

    for (const translation of this.translations.values()) {
      totalTranslations += translation.translations.size
      possibleTranslations += enabledLanguages.length
    }

    const averageTranslationCoverage = possibleTranslations > 0 
      ? (totalTranslations / possibleTranslations) * 100 
      : 0

    return {
      totalLanguages: this.config.supportedLanguages.length,
      enabledLanguages: enabledLanguages.length,
      translatedPages,
      averageTranslationCoverage: Math.round(averageTranslationCoverage),
      urlStrategy: this.config.urlStrategy
    }
  }
}

/**
 * Language Detection Helper
 */
class LanguageDetector {
  detect(config: HreflangConfig, request?: {
    headers?: { 'accept-language'?: string }
    cookies?: Record<string, string>
    geo?: { country?: string }
  }): string {
    // Check cookie first (user preference)
    if (config.cookieEnabled && request?.cookies?.language) {
      const cookieLang = request.cookies.language
      const supported = config.supportedLanguages.find(lang => 
        lang.enabled && (lang.code === cookieLang || `${lang.code}-${lang.region}` === cookieLang)
      )
      if (supported) return supported.code
    }

    // Check browser language preferences
    if (config.autoDetect && request?.headers?.['accept-language']) {
      const browserLang = this.parseBrowserLanguages(request.headers['accept-language'])
      for (const lang of browserLang) {
        const supported = config.supportedLanguages.find(supportedLang => 
          supportedLang.enabled && (
            supportedLang.code === lang.code ||
            (supportedLang.region && `${supportedLang.code}-${supportedLang.region}` === `${lang.code}-${lang.region}`)
          )
        )
        if (supported) return supported.code
      }
    }

    // Check geo-location
    if (request?.geo?.country) {
      const supported = config.supportedLanguages.find(lang => 
        lang.enabled && lang.region === request.geo!.country
      )
      if (supported) return supported.code
    }

    // Return default language
    return config.defaultLanguage
  }

  private parseBrowserLanguages(acceptLanguage: string): Array<{ code: string; region?: string; quality: number }> {
    return acceptLanguage
      .split(',')
      .map(lang => {
        const [code, quality = 'q=1'] = lang.trim().split(';')
        const [langCode, region] = code.split('-')
        
        return {
          code: langCode.toLowerCase(),
          region: region?.toUpperCase(),
          quality: parseFloat(quality.replace('q=', ''))
        }
      })
      .sort((a, b) => b.quality - a.quality)
  }
}

export default HreflangManager