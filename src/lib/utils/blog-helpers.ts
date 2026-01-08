/**
 * 🎯 SEMANTIC-DOMINANCE-2025: Blog Utility Functions
 * GOOGLE'S #1 SEO ARCHITECT - Enterprise Blog Helper Functions
 */

/**
 * Format date for human reading with proper internationalization
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString)
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Calculate estimated reading time based on content
 * Uses industry standard of 200-250 words per minute
 */
export function calculateReadTime(content: string): number {
  // Remove HTML tags for accurate word count
  const textContent = content.replace(/<[^>]*>/g, '')
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
  
  // Average reading speed: 225 words per minute
  const readingTimeMinutes = Math.ceil(wordCount / 225)
  
  // Minimum 1 minute for any content
  return Math.max(1, readingTimeMinutes)
}

/**
 * Generate SEO-optimized slug from title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Extract excerpt from content with proper sentence boundaries
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '')
  
  if (textContent.length <= maxLength) {
    return textContent
  }
  
  // Find the last complete sentence within the limit
  const truncated = textContent.substring(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  )
  
  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, lastSentenceEnd + 1)
  }
  
  // If no good sentence break, find last complete word
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace) + '...'
}

/**
 * Calculate content quality score based on multiple factors
 */
export function calculateContentQuality(post: {
  title: string
  content: string
  tags: string[]
  excerpt?: string
}): {
  score: number
  factors: {
    titleLength: number
    contentLength: number
    tagCount: number
    hasExcerpt: boolean
    readability: number
  }
} {
  const factors = {
    titleLength: post.title.length,
    contentLength: post.content.replace(/<[^>]*>/g, '').length,
    tagCount: post.tags.length,
    hasExcerpt: Boolean(post.excerpt),
    readability: calculateReadabilityScore(post.content)
  }
  
  let score = 0
  
  // Title length (optimal: 50-60 characters)
  if (factors.titleLength >= 30 && factors.titleLength <= 70) {
    score += 20
  } else if (factors.titleLength >= 20 && factors.titleLength <= 80) {
    score += 15
  } else {
    score += 5
  }
  
  // Content length (optimal: 1000+ words)
  if (factors.contentLength >= 1500) {
    score += 25
  } else if (factors.contentLength >= 800) {
    score += 20
  } else if (factors.contentLength >= 300) {
    score += 10
  } else {
    score += 5
  }
  
  // Tag count (optimal: 3-7 tags)
  if (factors.tagCount >= 3 && factors.tagCount <= 7) {
    score += 15
  } else if (factors.tagCount >= 1 && factors.tagCount <= 10) {
    score += 10
  } else {
    score += 2
  }
  
  // Has excerpt
  if (factors.hasExcerpt) {
    score += 15
  }
  
  // Readability
  score += Math.min(25, factors.readability)
  
  return { score, factors }
}

/**
 * Simple readability score based on sentence and word length
 */
function calculateReadabilityScore(content: string): number {
  const textContent = content.replace(/<[^>]*>/g, '')
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = textContent.split(/\s+/).filter(w => w.length > 0)
  
  if (sentences.length === 0 || words.length === 0) {
    return 0
  }
  
  const avgWordsPerSentence = words.length / sentences.length
  const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length
  
  // Optimal: 15-20 words per sentence, 4-6 characters per word
  let score = 25
  
  // Penalty for too long/short sentences
  if (avgWordsPerSentence > 25 || avgWordsPerSentence < 8) {
    score -= 5
  }
  
  // Penalty for too long/short words
  if (avgCharsPerWord > 7 || avgCharsPerWord < 3) {
    score -= 5
  }
  
  return Math.max(0, score)
}

/**
 * Generate structured data for FAQ sections within blog posts
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

/**
 * Extract headings from content for table of contents
 */
export function extractHeadings(content: string): Array<{
  id: string
  text: string
  level: number
}> {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
  const headings: Array<{ id: string; text: string; level: number }> = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    const id = createSlug(text)
    
    headings.push({ id, text, level })
  }
  
  return headings
}

/**
 * Validate blog post for SEO completeness
 */
export function validateBlogPostSEO(post: {
  title: string
  content: string
  excerpt?: string
  tags: string[]
  slug: string
  featuredImage?: string
}): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  score: number
} {
  const errors: string[] = []
  const warnings: string[] = []
  let score = 0
  
  // Required fields
  if (!post.title || post.title.length < 10) {
    errors.push('Title must be at least 10 characters long')
  } else {
    score += 20
    if (post.title.length > 70) {
      warnings.push('Title is longer than recommended 70 characters')
    }
  }
  
  if (!post.content || post.content.length < 300) {
    errors.push('Content must be at least 300 characters long')
  } else {
    score += 30
  }
  
  if (!post.slug || post.slug.length < 3) {
    errors.push('Slug must be at least 3 characters long')
  } else {
    score += 10
  }
  
  // Recommendations
  if (!post.excerpt || post.excerpt.length < 120) {
    warnings.push('Excerpt should be at least 120 characters for better SEO')
  } else {
    score += 15
  }
  
  if (!post.tags || post.tags.length < 2) {
    warnings.push('At least 2 tags recommended for better categorization')
  } else {
    score += 15
  }
  
  if (!post.featuredImage) {
    warnings.push('Featured image recommended for social media sharing')
  } else {
    score += 10
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  }
}