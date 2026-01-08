import fs from 'fs'
import path from 'path'

export interface HashtagData {
  tag: string
  count: number
  posts: string[]
  locations: string[]
  lastUsed: string
}

export interface HashtagIndex {
  tags: Record<string, HashtagData>
  totalTags: number
  popularTags: string[]
  lastUpdated: string
}

export function generateHashtagIndex(): HashtagIndex {
  try {
    const blogIndexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    
    if (!fs.existsSync(blogIndexPath)) {
      return {
        tags: {},
        totalTags: 0,
        popularTags: [],
        lastUpdated: new Date().toISOString()
      }
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'))
    const posts = blogIndex.posts || []
    
    const tagMap: Record<string, HashtagData> = {}
    
    posts.forEach((post: any) => {
      const tags = post.tags || []
      const location = post.country || 'Unknown'
      
      tags.forEach((tag: string) => {
        const normalizedTag = tag.toLowerCase().trim()
        
        if (!tagMap[normalizedTag]) {
          tagMap[normalizedTag] = {
            tag: normalizedTag,
            count: 0,
            posts: [],
            locations: [],
            lastUsed: post.date
          }
        }
        
        tagMap[normalizedTag].count++
        tagMap[normalizedTag].posts.push(post.slug)
        
        if (!tagMap[normalizedTag].locations.includes(location)) {
          tagMap[normalizedTag].locations.push(location)
        }
        
        // Update last used date
        if (post.date > tagMap[normalizedTag].lastUsed) {
          tagMap[normalizedTag].lastUsed = post.date
        }
      })
    })
    
    // Sort tags by popularity
    const popularTags = Object.values(tagMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(tag => tag.tag)
    
    return {
      tags: tagMap,
      totalTags: Object.keys(tagMap).length,
      popularTags,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating hashtag index:', error)
    return {
      tags: {},
      totalTags: 0,
      popularTags: [],
      lastUpdated: new Date().toISOString()
    }
  }
}

export function createHashtagLinks(content: string): string {
  try {
    const hashtagIndexPath = path.join(process.cwd(), 'src/data/hashtag-index.json')
    
    if (!fs.existsSync(hashtagIndexPath)) {
      return content
    }
    
    const hashtagIndex = JSON.parse(fs.readFileSync(hashtagIndexPath, 'utf8'))
    const tags = Object.keys(hashtagIndex.tags || {})
    
    let processedContent = content
    
    // Process hashtags in content
    tags.forEach(tag => {
      const hashtagPattern = new RegExp(`#${tag}(?![a-zA-Z0-9])`, 'gi')
      const replacement = `[#${tag}](/blog/tag/${tag})`
      processedContent = processedContent.replace(hashtagPattern, replacement)
    })
    
    // Process location hashtags
    const locationPattern = /#([A-Za-z]+)(?![a-zA-Z0-9])/g
    processedContent = processedContent.replace(locationPattern, (match, location) => {
      const normalizedLocation = location.toLowerCase()
      if (!tags.includes(normalizedLocation)) {
        return `[${match}](/blog/location/${normalizedLocation})`
      }
      return match
    })
    
    return processedContent
  } catch (error) {
    console.error('Error creating hashtag links:', error)
    return content
  }
}

export function generateTagPage(tag: string, language: 'en' | 'de' = 'de'): string {
  try {
    const blogIndexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    
    if (!fs.existsSync(blogIndexPath)) {
      return ''
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'))
    const posts = blogIndex.posts || []
    
    const taggedPosts = posts.filter((post: any) => 
      post.tags?.includes(tag) && post.language === language
    )
    
    const pageContent = `---
title: "${tag}"
description: "Alle Posts zu ${tag}"
language: ${language}
---

# Posts zu #${tag}

${taggedPosts.map((post: any) => `
## [${post.title}](/${post.slug})
*${post.date}*

${post.excerpt}

---
`).join('')}
`
    
    return pageContent
  } catch (error) {
    console.error('Error generating tag page:', error)
    return ''
  }
}

export function generateLocationPage(location: string, language: 'en' | 'de' = 'de'): string {
  try {
    const blogIndexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    
    if (!fs.existsSync(blogIndexPath)) {
      return ''
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'))
    const posts = blogIndex.posts || []
    
    const locationPosts = posts.filter((post: any) => 
      (post.country?.toLowerCase() === location.toLowerCase() || 
       post.city?.toLowerCase() === location.toLowerCase()) &&
      post.language === language
    )
    
    const pageContent = `---
title: "${location}"
description: "Alle Posts aus ${location}"
language: ${language}
---

# Posts aus ${location}

${locationPosts.map((post: any) => `
## [${post.title}](/${post.slug})
*${post.date} • ${post.city || post.country}*

${post.excerpt}

---
`).join('')}
`
    
    return pageContent
  } catch (error) {
    console.error('Error generating location page:', error)
    return ''
  }
}

export function updateHashtagIndex(): void {
  try {
    const hashtagIndex = generateHashtagIndex()
    
    const outputPath = path.join(process.cwd(), 'src/data/hashtag-index.json')
    fs.writeFileSync(outputPath, JSON.stringify(hashtagIndex, null, 2))
    
    console.log('✅ Hashtag index updated successfully')
  } catch (error) {
    console.error('❌ Error updating hashtag index:', error)
  }
}

export function generateRelatedPosts(currentPost: any, limit: number = 3): any[] {
  try {
    const blogIndexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    
    if (!fs.existsSync(blogIndexPath)) {
      return []
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'))
    const posts = blogIndex.posts || []
    
    const currentTags = currentPost.tags || []
    const currentLocation = currentPost.country || currentPost.city
    
    // Score posts based on shared tags and location
    const scoredPosts = posts
      .filter((post: any) => post.slug !== currentPost.slug)
      .map((post: any) => {
        let score = 0
        
        // Score for shared tags
        const sharedTags = (post.tags || []).filter((tag: string) => 
          currentTags.includes(tag)
        )
        score += sharedTags.length * 2
        
        // Score for shared location
        if (post.country === currentLocation || post.city === currentLocation) {
          score += 1
        }
        
        return { ...post, score }
      })
      .filter((post: any) => post.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, limit)
    
    return scoredPosts
  } catch (error) {
    console.error('Error generating related posts:', error)
    return []
  }
}

export function createBlogNavigation(currentPost: any): { prev: any | null, next: any | null } {
  try {
    const blogIndexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    
    if (!fs.existsSync(blogIndexPath)) {
      return { prev: null, next: null }
    }
    
    const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'))
    const posts = blogIndex.posts || []
    
    // Sort posts by date
    const sortedPosts = posts.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    const currentIndex = sortedPosts.findIndex((post: any) => 
      post.slug === currentPost.slug
    )
    
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }
    
    return {
      prev: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
      next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
    }
  } catch (error) {
    console.error('Error creating blog navigation:', error)
    return { prev: null, next: null }
  }
}