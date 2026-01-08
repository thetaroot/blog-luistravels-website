import { listBlogPosts } from '@/lib/blog'
import { SITE_CONFIG } from '@/lib/constants'
import fs from 'fs/promises'
import path from 'path'

export interface SitemapEntry {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  images?: Array<{
    url: string
    caption?: string
    title?: string
  }>
}

export interface SitemapIndexEntry {
  sitemap: string
  lastModified: string
}

/**
 * Generate comprehensive sitemap with advanced SEO optimizations
 */
export class AdvancedSitemapGenerator {
  private baseUrl: string
  private maxUrlsPerSitemap = 50000 // Google's limit
  private maxSitemapFileSize = 50 * 1024 * 1024 // 50MB limit

  constructor(baseUrl: string = SITE_CONFIG.url) {
    this.baseUrl = baseUrl
  }

  /**
   * Generate main sitemap with all URLs
   */
  async generateMainSitemap(): Promise<SitemapEntry[]> {
    const entries: SitemapEntry[] = []

    // Add static pages with strategic prioritization
    entries.push(...this.generateStaticPages())

    // Add dynamic blog posts
    entries.push(...await this.generateBlogPages())

    // Add gallery pages (when implemented)
    entries.push(...await this.generateGalleryPages())

    // Sort by priority and last modified for optimal crawling
    return entries.sort((a, b) => {
      // First by priority (higher first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      // Then by last modified (newer first)
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    })
  }

  /**
   * Generate static pages with SEO-optimized priorities
   */
  private generateStaticPages(): SitemapEntry[] {
    const now = new Date().toISOString()

    return [
      {
        url: this.baseUrl,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1.0, // Highest priority for homepage
      },
      {
        url: `${this.baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'daily', // Frequent updates expected
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/gallery`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${this.baseUrl}/contact`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      }
    ]
  }

  /**
   * Generate blog pages with dynamic prioritization
   */
  private async generateBlogPages(): Promise<SitemapEntry[]> {
    try {
      const blogPosts = await listBlogPosts()
      
      return blogPosts.map((post) => {
        const lastModified = new Date(post.modifiedDate || post.date).toISOString()
        
        // Calculate intelligent priority based on multiple factors
        const priority = this.calculateBlogPostPriority(post)
        
        // Extract images from post for image sitemap
        const images = this.extractPostImages(post)

        return {
          url: `${this.baseUrl}/blog/${post.slug}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority,
          images: images.length > 0 ? images : undefined
        }
      })
    } catch (error) {
      console.error('Error generating blog pages for sitemap:', error)
      return []
    }
  }

  /**
   * Generate gallery pages (placeholder for future implementation)
   */
  private async generateGalleryPages(): Promise<SitemapEntry[]> {
    // TODO: Implement when gallery system is expanded
    return []
  }

  /**
   * Calculate dynamic priority for blog posts based on multiple SEO factors
   */
  private calculateBlogPostPriority(post: any): number {
    let priority = 0.6 // Base priority for blog posts

    // Recency factor - newer posts get higher priority
    const daysSincePublished = Math.floor(
      (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSincePublished <= 7) priority += 0.2      // Very recent (last week)
    else if (daysSincePublished <= 30) priority += 0.15  // Recent (last month)
    else if (daysSincePublished <= 90) priority += 0.1   // Moderately recent
    else if (daysSincePublished <= 180) priority += 0.05 // Older content

    // Content quality indicators
    if (post.tags && post.tags.length >= 3) priority += 0.05 // Well-tagged content
    if (post.gallery && post.gallery.length > 0) priority += 0.05 // Has images
    if (post.excerpt && post.excerpt.length > 100) priority += 0.05 // Good excerpt

    // Content length factor (assuming longer content is more valuable)
    if (post.content) {
      const wordCount = post.content.replace(/<[^>]*>/g, '').split(' ').length
      if (wordCount > 1000) priority += 0.1 // Long-form content
      else if (wordCount > 500) priority += 0.05 // Medium-form content
    }

    // Ensure priority stays within bounds
    return Math.min(Math.max(priority, 0.1), 1.0)
  }

  /**
   * Extract images from blog post for image sitemap
   */
  private extractPostImages(post: any): Array<{ url: string; caption?: string; title?: string }> {
    const images: Array<{ url: string; caption?: string; title?: string }> = []

    // Add gallery images
    if (post.gallery && Array.isArray(post.gallery)) {
      post.gallery.forEach((imageName: string, index: number) => {
        images.push({
          url: `${this.baseUrl}/images/gallery/${imageName}`,
          title: `${post.title} - Image ${index + 1}`,
          caption: `Travel photo from ${post.title}`
        })
      })
    }

    // Extract images from content (basic implementation)
    if (post.content) {
      const imgRegex = /<img[^>]+src="([^">]+)"/g
      let match
      while ((match = imgRegex.exec(post.content)) !== null) {
        const imgSrc = match[1]
        if (imgSrc.startsWith('/') || imgSrc.startsWith(this.baseUrl)) {
          const fullUrl = imgSrc.startsWith('/') ? `${this.baseUrl}${imgSrc}` : imgSrc
          images.push({
            url: fullUrl,
            title: `Image from ${post.title}`
          })
        }
      }
    }

    return images
  }

  /**
   * Generate XML sitemap content
   */
  generateSitemapXML(entries: SitemapEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
    const sitemapOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    const sitemapClose = '</urlset>'

    const urls = entries.map(entry => {
      let urlXml = `  <url>
    <loc>${this.escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>`

      // Add image entries if present
      if (entry.images && entry.images.length > 0) {
        entry.images.forEach(image => {
          urlXml += `
    <image:image>
      <image:loc>${this.escapeXml(image.url)}</image:loc>`
          if (image.title) {
            urlXml += `
      <image:title>${this.escapeXml(image.title)}</image:title>`
          }
          if (image.caption) {
            urlXml += `
      <image:caption>${this.escapeXml(image.caption)}</image:caption>`
          }
          urlXml += `
    </image:image>`
        })
      }

      urlXml += `
  </url>`
      return urlXml
    }).join('\n')

    return `${xmlHeader}\n${sitemapOpen}\n${urls}\n${sitemapClose}`
  }

  /**
   * Generate sitemap index for multiple sitemaps
   */
  generateSitemapIndexXML(sitemapEntries: SitemapIndexEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
    const indexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    const indexClose = '</sitemapindex>'

    const sitemaps = sitemapEntries.map(entry => `  <sitemap>
    <loc>${this.escapeXml(entry.sitemap)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
  </sitemap>`).join('\n')

    return `${xmlHeader}\n${indexOpen}\n${sitemaps}\n${indexClose}`
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case "'": return '&apos;'
        case '"': return '&quot;'
        default: return c
      }
    })
  }

  /**
   * Save sitemap to file system (for build-time generation)
   */
  async saveSitemapToFile(entries: SitemapEntry[], filePath: string): Promise<void> {
    try {
      const xml = this.generateSitemapXML(entries)
      await fs.writeFile(filePath, xml, 'utf-8')
      console.log(`Sitemap saved to ${filePath} with ${entries.length} URLs`)
    } catch (error) {
      console.error('Error saving sitemap to file:', error)
      throw error
    }
  }

  /**
   * Validate sitemap entries
   */
  validateSitemap(entries: SitemapEntry[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check URL count
    if (entries.length > this.maxUrlsPerSitemap) {
      errors.push(`Too many URLs: ${entries.length} (max: ${this.maxUrlsPerSitemap})`)
    }

    // Validate individual entries
    entries.forEach((entry, index) => {
      if (!entry.url || typeof entry.url !== 'string') {
        errors.push(`Entry ${index}: Invalid URL`)
      }
      
      if (!entry.lastModified || isNaN(new Date(entry.lastModified).getTime())) {
        errors.push(`Entry ${index}: Invalid lastModified date`)
      }
      
      if (entry.priority < 0 || entry.priority > 1) {
        errors.push(`Entry ${index}: Priority must be between 0 and 1`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * Convenience function to generate sitemap
 */
export async function generateAdvancedSitemap(): Promise<SitemapEntry[]> {
  const generator = new AdvancedSitemapGenerator()
  return await generator.generateMainSitemap()
}

/**
 * Generate and save sitemap to public directory
 */
export async function generateAndSaveSitemap(): Promise<void> {
  try {
    const generator = new AdvancedSitemapGenerator()
    const entries = await generator.generateMainSitemap()
    
    // Validate sitemap
    const validation = generator.validateSitemap(entries)
    if (!validation.valid) {
      console.warn('Sitemap validation warnings:', validation.errors)
    }

    // Save to public directory
    const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml')
    await generator.saveSitemapToFile(entries, publicPath)
    
    console.log(`✅ Advanced sitemap generated successfully with ${entries.length} URLs`)
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error)
    throw error
  }
}