import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Enhanced blog utilities for automation
export interface BlogIndex {
  posts: BlogPost[]
  totalPosts: number
  lastUpdated: string
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  language: 'en' | 'de'
  image?: string
  country?: string
  city?: string
  featured?: boolean
  gallery?: string[]
}

export function getLatestPosts(limit: number = 3, language?: 'en' | 'de'): BlogPost[] {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    if (!fs.existsSync(indexPath)) {
      return []
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    let posts = blogIndex.posts || []
    
    // Filter by language if specified
    if (language) {
      posts = posts.filter((post: BlogPost) => post.language === language)
    }
    
    // Sort by date and take the latest
    return posts
      .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error loading latest posts:', error)
    return []
  }
}

export function getFeaturedPosts(limit: number = 2, language?: 'en' | 'de'): BlogPost[] {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    if (!fs.existsSync(indexPath)) {
      return []
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    let posts = blogIndex.posts || []
    
    // Filter by language and featured status
    posts = posts.filter((post: BlogPost) => {
      if (language && post.language !== language) return false
      return post.featured === true
    })
    
    // Sort by date and take the latest featured
    return posts
      .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error loading featured posts:', error)
    return []
  }
}

export function getPostsByCountry(country: string, language?: 'en' | 'de'): BlogPost[] {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    if (!fs.existsSync(indexPath)) {
      return []
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    let posts = blogIndex.posts || []
    
    // Filter by country and language
    posts = posts.filter((post: BlogPost) => {
      if (language && post.language !== language) return false
      return post.country === country
    })
    
    // Sort by date
    return posts.sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error loading posts by country:', error)
    return []
  }
}

export function getPostsByTag(tag: string, language?: 'en' | 'de'): BlogPost[] {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    if (!fs.existsSync(indexPath)) {
      return []
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    let posts = blogIndex.posts || []
    
    // Filter by tag and language
    posts = posts.filter((post: BlogPost) => {
      if (language && post.language !== language) return false
      return post.tags.includes(tag)
    })
    
    // Sort by date
    return posts.sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error loading posts by tag:', error)
    return []
  }
}

export function getAllTags(language?: 'en' | 'de'): string[] {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    if (!fs.existsSync(indexPath)) {
      return []
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    let posts = blogIndex.posts || []
    
    // Filter by language if specified
    if (language) {
      posts = posts.filter((post: BlogPost) => post.language === language)
    }
    
    // Extract all tags and remove duplicates
    const allTags = posts.reduce((tags: string[], post: BlogPost) => {
      return [...tags, ...post.tags]
    }, [])
    
    return Array.from(new Set(allTags)) as string[]
  } catch (error) {
    console.error('Error loading tags:', error)
    return []
  }
}

export function createAutomaticHashtags(content: string, tags: string[]): string {
  // Find hashtag patterns in content and create links
  let processedContent = content
  
  // Process existing hashtags
  tags.forEach(tag => {
    const hashtagPattern = new RegExp(`#${tag}(?![a-zA-Z0-9])`, 'gi')
    processedContent = processedContent.replace(hashtagPattern, `[#${tag}](/blog/tag/${tag.toLowerCase()})`)
  })
  
  // Process location hashtags
  const locationPattern = /#([A-Za-z]+)(?![a-zA-Z0-9])/g
  processedContent = processedContent.replace(locationPattern, (match, location) => {
    if (!tags.includes(location)) {
      return `[${match}](/blog/location/${location.toLowerCase()})`
    }
    return match
  })
  
  return processedContent
}

export function generateBlogSitemap(): string {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    if (!fs.existsSync(indexPath)) {
      return ''
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    const posts = blogIndex.posts || []
    
    const sitemapUrls = posts.map((post: BlogPost) => {
      const lastmod = new Date(post.date).toISOString().split('T')[0]
      return `  <url>
    <loc>https://luisgunther.com/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    }).join('\n')
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    return ''
  }
}