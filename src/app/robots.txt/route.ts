/**
 * Enhanced Robots.txt Generator - SEO-PERFECTION-2025
 * AI-crawler friendly with 2025 bot support and intelligent crawl control
 */

import { NextRequest, NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getBaseUrl(request)
    
    const robotsTxt = `# Robots.txt - SEO-PERFECTION-2025
# Enhanced for AI crawlers and search engines
# Generated: ${new Date().toISOString()}

# Default crawling rules for all bots
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /tmp/
Disallow: /temp/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /private/
Disallow: /drafts/

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1
Request-rate: 1/1s

User-agent: Bingbot
Allow: /
Crawl-delay: 1
Request-rate: 1/2s

User-agent: Slurp
Allow: /
Crawl-delay: 2

# AI Training Bots - 2025 Enhanced Support
User-agent: GPTBot
Allow: /
Crawl-delay: 2
# Allow AI training on public content

User-agent: Google-Extended
Allow: /
# Google's AI training crawler

User-agent: ChatGPT-User
Allow: /
Crawl-delay: 1
# OpenAI ChatGPT browsing

User-agent: Claude-Web
Allow: /
Crawl-delay: 1
# Anthropic Claude web access

User-agent: anthropic-ai
Allow: /
Crawl-delay: 1
# Anthropic AI crawlers

User-agent: PerplexityBot
Allow: /
Crawl-delay: 2
# Perplexity AI search

User-agent: YouBot
Allow: /
Crawl-delay: 2
# You.com AI search

# Social Media Bots
User-agent: facebookexternalhit
Allow: /
# Facebook link previews

User-agent: Twitterbot
Allow: /
# Twitter/X link previews

User-agent: LinkedInBot
Allow: /
# LinkedIn link previews

User-agent: WhatsApp
Allow: /
# WhatsApp link previews

User-agent: TelegramBot
Allow: /
# Telegram link previews

# Archive and Research Bots
User-agent: ia_archiver
Allow: /
Crawl-delay: 10
# Internet Archive Wayback Machine

User-agent: archive.org_bot
Allow: /
Crawl-delay: 10

# SEO and Analytics Bots
User-agent: AhrefsBot
Allow: /
Crawl-delay: 5

User-agent: SemrushBot
Allow: /
Crawl-delay: 5

User-agent: MJ12bot
Allow: /
Crawl-delay: 10

# Image Search Bots
User-agent: Googlebot-Image
Allow: /images/
Allow: /gallery/
Crawl-delay: 1

User-agent: Bingbot-Image
Allow: /images/
Allow: /gallery/
Crawl-delay: 2

# News and Feed Bots
User-agent: Googlebot-News
Allow: /blog/
Crawl-delay: 1

# Mobile Crawlers
User-agent: Googlebot-Mobile
Allow: /
Crawl-delay: 1

# Blocked Bots (Aggressive or Unwanted)
User-agent: MJ12bot
Crawl-delay: 30
# Slow down aggressive crawling

User-agent: SemrushBot
Crawl-delay: 20
# Limit SEO tool crawling

User-agent: AhrefsBot
Crawl-delay: 20

# Spam and Bad Bots
User-agent: EmailCollector
Disallow: /

User-agent: EmailSiphon
Disallow: /

User-agent: WebBandit
Disallow: /

User-agent: EmailWolf
Disallow: /

User-agent: ExtractorPro
Disallow: /

User-agent: CopyRightCheck
Disallow: /

User-agent: psbot
Disallow: /

User-agent: SurveyBot
Disallow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/image-sitemap.xml

# Additional Directives
Host: ${baseUrl.replace('https://', '').replace('http://', '')}

# Clean URLs preferred
# This file supports international SEO and AI training
# Contact: hello@luistravels.com for crawler questions
`

    console.log('🤖 Generated enhanced robots.txt with AI crawler support')

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    })

  } catch (error) {
    console.error('Error generating robots.txt:', error)
    
    // Fallback robots.txt
    const fallbackRobots = `# Fallback robots.txt due to generation error
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Allow: /

Sitemap: ${getBaseUrl(request)}/sitemap.xml`

    return new NextResponse(fallbackRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300', // Shorter cache for fallback
      }
    })
  }
}

/**
 * Determine environment from request context
 */
function determineEnvironment(request: NextRequest): 'production' | 'staging' | 'development' {
  const url = new URL(request.url)
  const hostname = url.hostname
  
  // Check environment variables first
  const nodeEnv = process.env.NODE_ENV
  const vercelEnv = process.env.VERCEL_ENV
  
  // Explicit environment override
  if (process.env.ROBOTS_ENVIRONMENT) {
    const env = process.env.ROBOTS_ENVIRONMENT as 'production' | 'staging' | 'development'
    return env
  }
  
  // Vercel environment detection
  if (vercelEnv === 'production') return 'production'
  if (vercelEnv === 'preview') return 'staging'
  
  // Hostname-based detection
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development'
  }
  
  if (hostname.includes('staging') || hostname.includes('preview') || hostname.includes('dev.')) {
    return 'staging'
  }
  
  // Production domains
  const productionDomains = [
    'luis-portfolio.com',
    'luisportfolio.com',
    'luis.dev'
  ]
  
  if (productionDomains.some(domain => hostname.includes(domain))) {
    return 'production'
  }
  
  // Default based on NODE_ENV
  if (nodeEnv === 'production') return 'production'
  if (nodeEnv === 'development') return 'development'
  
  // Default to staging for unknown environments
  return 'staging'
}

/**
 * Get base URL from request
 */
function getBaseUrl(request: NextRequest): string {
  const url = new URL(request.url)
  return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`
}

// Handle HEAD requests (some crawlers send HEAD first)
export async function HEAD(request: NextRequest) {
  const response = await GET(request)
  
  // Return headers only, no body
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers
  })
}