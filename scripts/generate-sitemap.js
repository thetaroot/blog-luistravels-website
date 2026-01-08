#!/usr/bin/env node

/**
 * Build-time sitemap generation script
 * Generates comprehensive sitemap with all dynamic content
 * Integrates with the existing content generation system
 */

const fs = require('fs').promises
const path = require('path')

// Import the existing blog system dynamically to avoid module conflicts

const SITE_CONFIG = {
  url: 'https://luistravels.com'
}

/**
 * Advanced sitemap generator for build time
 */
class BuildTimeSitemapGenerator {
  constructor() {
    this.baseUrl = SITE_CONFIG.url
    this.maxUrlsPerSitemap = 50000
  }

  /**
   * Generate complete sitemap with all content
   */
  async generateCompleteSitemap() {
    console.log('🗺️  Generating comprehensive sitemap...')
    
    try {
      const entries = []

      // Add static pages
      entries.push(...this.generateStaticPages())

      // Add dynamic blog posts
      const blogEntries = await this.generateBlogPages()
      entries.push(...blogEntries)

      // Sort by priority for optimal crawling
      entries.sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority
        }
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      })

      console.log(`📊 Generated ${entries.length} sitemap entries:`)
      console.log(`   - ${this.generateStaticPages().length} static pages`)
      console.log(`   - ${blogEntries.length} blog posts`)

      // Generate XML
      const xml = this.generateSitemapXML(entries)

      // Save to public directory
      const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml')
      await fs.writeFile(publicPath, xml, 'utf-8')

      // Also save a backup with timestamp
      const backupPath = path.join(process.cwd(), 'public', `sitemap-${Date.now()}.xml`)
      await fs.writeFile(backupPath, xml, 'utf-8')

      console.log(`✅ Sitemap saved to ${publicPath}`)
      console.log(`💾 Backup saved to ${backupPath}`)

      // Generate sitemap stats
      await this.generateSitemapStats(entries)

      return entries

    } catch (error) {
      console.error('❌ Error generating sitemap:', error)
      throw error
    }
  }

  /**
   * Generate static pages
   */
  generateStaticPages() {
    const now = new Date().toISOString()

    return [
      {
        url: this.baseUrl,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${this.baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'daily',
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
   * Generate blog pages with dynamic content
   */
  async generateBlogPages() {
    try {
      // Try to dynamically import the blog system
      let listBlogPosts
      
      try {
        const blogModule = await import('../src/lib/blog/index.js')
        listBlogPosts = blogModule.listBlogPosts
      } catch (importError) {
        console.warn('Blog module not found, generating sitemap without blog posts:', importError.message)
        return []
      }

      if (!listBlogPosts) {
        console.warn('listBlogPosts function not available, skipping blog posts in sitemap')
        return []
      }

      const blogPosts = await listBlogPosts()

      return blogPosts.map((post) => {
        const lastModified = new Date(post.modifiedDate || post.date).toISOString()
        const priority = this.calculateBlogPostPriority(post)

        return {
          url: `${this.baseUrl}/blog/${post.slug}`,
          lastModified,
          changeFrequency: 'monthly',
          priority,
          images: this.extractPostImages(post)
        }
      })
    } catch (error) {
      console.error('Error loading blog posts for sitemap:', error)
      return []
    }
  }

  /**
   * Calculate intelligent priority for blog posts
   */
  calculateBlogPostPriority(post) {
    let priority = 0.6

    const daysSincePublished = Math.floor(
      (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Recency bonus
    if (daysSincePublished <= 7) priority += 0.2
    else if (daysSincePublished <= 30) priority += 0.15
    else if (daysSincePublished <= 90) priority += 0.1
    else if (daysSincePublished <= 180) priority += 0.05

    // Content quality indicators
    if (post.tags && post.tags.length >= 3) priority += 0.05
    if (post.gallery && post.gallery.length > 0) priority += 0.05
    if (post.excerpt && post.excerpt.length > 100) priority += 0.05

    // Content length factor
    if (post.content) {
      const wordCount = post.content.replace(/<[^>]*>/g, '').split(' ').length
      if (wordCount > 1000) priority += 0.1
      else if (wordCount > 500) priority += 0.05
    }

    return Math.min(Math.max(priority, 0.1), 1.0)
  }

  /**
   * Extract images from post
   */
  extractPostImages(post) {
    const images = []

    if (post.gallery && Array.isArray(post.gallery)) {
      post.gallery.forEach((imageName, index) => {
        images.push({
          url: `${this.baseUrl}/images/gallery/${imageName}`,
          title: `${post.title} - Image ${index + 1}`,
          caption: `Travel photo from ${post.title}`
        })
      })
    }

    return images
  }

  /**
   * Generate XML sitemap
   */
  generateSitemapXML(entries) {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
    const sitemapOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    const sitemapClose = '</urlset>'

    const urls = entries.map(entry => {
      let urlXml = `  <url>
    <loc>${this.escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>`

      // Add images if present
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
   * Generate sitemap statistics
   */
  async generateSitemapStats(entries) {
    const stats = {
      totalUrls: entries.length,
      priorityDistribution: {},
      changeFrequencyDistribution: {},
      totalImages: 0,
      generatedAt: new Date().toISOString()
    }

    entries.forEach(entry => {
      // Priority distribution
      const priorityKey = entry.priority.toFixed(1)
      stats.priorityDistribution[priorityKey] = (stats.priorityDistribution[priorityKey] || 0) + 1

      // Change frequency distribution
      stats.changeFrequencyDistribution[entry.changeFrequency] = 
        (stats.changeFrequencyDistribution[entry.changeFrequency] || 0) + 1

      // Count images
      if (entry.images) {
        stats.totalImages += entry.images.length
      }
    })

    // Save stats
    const statsPath = path.join(process.cwd(), 'public', 'sitemap-stats.json')
    await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), 'utf-8')

    console.log(`📈 Sitemap statistics:`)
    console.log(`   - Total URLs: ${stats.totalUrls}`)
    console.log(`   - Total Images: ${stats.totalImages}`)
    console.log(`   - Priority distribution:`, stats.priorityDistribution)
    console.log(`   - Change frequency distribution:`, stats.changeFrequencyDistribution)
  }

  /**
   * Escape XML characters
   */
  escapeXml(unsafe) {
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
}

/**
 * Main execution
 */
async function main() {
  try {
    const generator = new BuildTimeSitemapGenerator()
    const entries = await generator.generateCompleteSitemap()
    
    console.log(`\n🎉 Sitemap generation completed successfully!`)
    console.log(`🔗 View sitemap at: ${SITE_CONFIG.url}/sitemap.xml`)
    
    process.exit(0)
  } catch (error) {
    console.error('\n💥 Sitemap generation failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { BuildTimeSitemapGenerator }