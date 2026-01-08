/**
 * SEO Optimization API - PHASE 5 SEO-PERFECTION-2025
 * Comprehensive SEO analysis, schema generation, and optimization recommendations
 */

import { NextRequest, NextResponse } from 'next/server'
import { SchemaGenerator } from '@/lib/seo/SchemaGenerator'
import { LocalSEOOptimizer } from '@/lib/seo/LocalSEOOptimizer'
import { SEOMetaGenerator } from '@/lib/seo/SEOMetaGenerator'
import { getBlogPosts, getBlogPost } from '@/lib/blog'

// Configuration
const seoConfig = {
  siteName: "Luis' Travel Blog",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://luistravel.blog',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@luistravel',
  authorName: 'Luis',
  authorUrl: '/about',
  logo: '/images/logo.png',
  socialProfiles: [
    'https://twitter.com/luistravel',
    'https://instagram.com/luistravel',
    'https://youtube.com/@luistravel'
  ],
  organization: {
    name: "Luis' Travel Blog",
    type: 'Organization',
    address: {
      addressLocality: 'Global',
      addressCountry: 'World'
    },
    contactPoint: {
      contactType: 'Content Creator',
      availableLanguage: ['en', 'de']
    }
  },
  defaultLocale: 'en_US',
  supportedLocales: ['en_US', 'de_DE'],
  brandKeywords: ['travel blog', 'cultural insights', 'adventure stories', 'local experiences']
}

// Singleton instances
let schemaGenerator: SchemaGenerator | null = null
let localSEOOptimizer: LocalSEOOptimizer | null = null
let metaGenerator: SEOMetaGenerator | null = null

function initializeSEOGenerators() {
  if (!schemaGenerator) {
    schemaGenerator = new SchemaGenerator(seoConfig)
  }
  if (!localSEOOptimizer) {
    localSEOOptimizer = new LocalSEOOptimizer()
  }
  if (!metaGenerator) {
    metaGenerator = new SEOMetaGenerator(seoConfig)
  }
  
  return { schemaGenerator, localSEOOptimizer, metaGenerator }
}

/**
 * GET /api/seo - Generate SEO data for posts or perform SEO analysis
 * 
 * Query Parameters:
 * - action: schema|meta|analysis|local|sitemap
 * - post: Post slug (for single post operations)
 * - type: Type of schema to generate
 * - includeLocal: Include local SEO optimizations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'schema'
    const postSlug = searchParams.get('post')
    const includeLocal = searchParams.get('includeLocal') === 'true'

    const { schemaGenerator, localSEOOptimizer, metaGenerator } = initializeSEOGenerators()

    switch (action) {
      case 'schema':
        return await handleSchemaGeneration(postSlug, schemaGenerator, localSEOOptimizer, includeLocal)
      
      case 'meta':
        return await handleMetaGeneration(postSlug, metaGenerator, includeLocal)
      
      case 'analysis':
        return await handleSEOAnalysis(postSlug)
      
      case 'local':
        return await handleLocalSEO(postSlug, localSEOOptimizer)
      
      case 'sitemap':
        return await handleSitemapGeneration()
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: schema, meta, analysis, local, or sitemap' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ SEO API error:', error)
    
    return NextResponse.json(
      {
        error: 'SEO processing failed',
        message: 'An error occurred while processing SEO request',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Handle schema generation
 */
async function handleSchemaGeneration(
  postSlug: string | null,
  schemaGenerator: SchemaGenerator,
  localSEOOptimizer: LocalSEOOptimizer,
  includeLocal: boolean
) {
  if (postSlug) {
    // Generate schema for specific post
    const post = await getBlogPost(postSlug)
    if (!post) {
      return NextResponse.json(
        { error: `Post not found: ${postSlug}` },
        { status: 404 }
      )
    }

    console.log(`🔧 Generating schema markup for: ${post.title}`)
    const startTime = Date.now()

    // Generate comprehensive schema
    const blogSchemas = schemaGenerator.generateBlogPostSchema(post)
    const locationSchemas = schemaGenerator.generateLocationSchema(post)
    const organizationSchema = schemaGenerator.generateOrganizationSchema()
    const websiteSchema = schemaGenerator.generateWebsiteSchema()

    let localBusinessSchemas: object[] = []
    if (includeLocal && post.location) {
      localBusinessSchemas = await localSEOOptimizer.generateLocalBusinessSchema(post)
    }

    const allSchemas = [
      ...blogSchemas,
      ...locationSchemas,
      ...localBusinessSchemas,
      organizationSchema,
      websiteSchema
    ].filter(schema => Object.keys(schema).length > 0)

    const processingTime = Date.now() - startTime

    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title,
        location: post.location
      },
      schemas: allSchemas,
      jsonLd: schemaGenerator.generateJsonLd(allSchemas),
      metadata: {
        schemaCount: allSchemas.length,
        includeLocal,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    })
  } else {
    // Generate site-wide schemas
    const organizationSchema = schemaGenerator.generateOrganizationSchema()
    const websiteSchema = schemaGenerator.generateWebsiteSchema()

    return NextResponse.json({
      schemas: [organizationSchema, websiteSchema],
      jsonLd: schemaGenerator.generateJsonLd([organizationSchema, websiteSchema]),
      metadata: {
        type: 'site-wide',
        timestamp: new Date().toISOString()
      }
    })
  }
}

/**
 * Handle meta tag generation
 */
async function handleMetaGeneration(
  postSlug: string | null,
  metaGenerator: SEOMetaGenerator,
  includeLocal: boolean
) {
  if (postSlug) {
    const post = await getBlogPost(postSlug)
    if (!post) {
      return NextResponse.json(
        { error: `Post not found: ${postSlug}` },
        { status: 404 }
      )
    }

    console.log(`🏷️ Generating meta tags for: ${post.title}`)
    
    const metaTags = metaGenerator.generateMetaTags(post, {
      includeEntityKeywords: true,
      optimizeForLocal: includeLocal
    })

    const structuredData = metaGenerator.generateStructuredData(post)

    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title
      },
      metaTags,
      structuredData,
      metadata: {
        includeLocal,
        timestamp: new Date().toISOString()
      }
    })
  } else {
    return NextResponse.json(
      { error: 'Post slug is required for meta tag generation' },
      { status: 400 }
    )
  }
}

/**
 * Handle comprehensive SEO analysis
 */
async function handleSEOAnalysis(postSlug: string | null) {
  if (postSlug) {
    const post = await getBlogPost(postSlug)
    if (!post) {
      return NextResponse.json(
        { error: `Post not found: ${postSlug}` },
        { status: 404 }
      )
    }

    console.log(`📊 Analyzing SEO for: ${post.title}`)
    
    const analysis = await performSEOAnalysis(post)

    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title
      },
      analysis,
      metadata: {
        timestamp: new Date().toISOString()
      }
    })
  } else {
    // Site-wide SEO analysis
    const posts = await getBlogPosts()
    const siteAnalysis = await performSiteWideSEOAnalysis(posts)

    return NextResponse.json({
      analysis: siteAnalysis,
      metadata: {
        type: 'site-wide',
        totalPosts: posts.length,
        timestamp: new Date().toISOString()
      }
    })
  }
}

/**
 * Handle local SEO optimization
 */
async function handleLocalSEO(postSlug: string | null, localSEOOptimizer: LocalSEOOptimizer) {
  if (postSlug) {
    const post = await getBlogPost(postSlug)
    if (!post) {
      return NextResponse.json(
        { error: `Post not found: ${postSlug}` },
        { status: 404 }
      )
    }

    console.log(`🌍 Optimizing local SEO for: ${post.title}`)
    
    const localOptimization = await localSEOOptimizer.optimizeForLocalSEO(post)
    const geoMetaTags = localSEOOptimizer.generateGeoMetaTags(post)
    const locationSchemas = localSEOOptimizer.generateLocationSchema(post)

    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title,
        location: post.location
      },
      optimization: localOptimization,
      geoMetaTags,
      locationSchemas,
      metadata: {
        hasLocation: !!post.location,
        timestamp: new Date().toISOString()
      }
    })
  } else {
    return NextResponse.json(
      { error: 'Post slug is required for local SEO optimization' },
      { status: 400 }
    )
  }
}

/**
 * Handle sitemap generation
 */
async function handleSitemapGeneration() {
  const posts = await getBlogPosts()
  const baseUrl = seoConfig.siteUrl

  const sitemap = {
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9'
      },
      url: [
        // Homepage
        {
          loc: baseUrl,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: '1.0'
        },
        // Blog posts
        ...posts.map(post => ({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.modifiedDate || post.date,
          changefreq: 'weekly',
          priority: '0.8',
          ...(post.gallery && post.gallery.length > 0 && {
            'image:image': post.gallery.map(image => ({
              'image:loc': image,
              'image:title': post.title,
              'image:caption': post.excerpt
            }))
          })
        }))
      ]
    }
  }

  return NextResponse.json({
    sitemap,
    metadata: {
      totalUrls: sitemap.urlset.url.length,
      lastGenerated: new Date().toISOString()
    }
  })
}

/**
 * POST /api/seo - Batch SEO operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    const { schemaGenerator, localSEOOptimizer, metaGenerator } = initializeSEOGenerators()

    switch (body.action) {
      case 'batch-optimize':
        return await handleBatchOptimization(body, schemaGenerator, localSEOOptimizer, metaGenerator)
      
      case 'validate-schemas':
        return await handleSchemaValidation(body)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ SEO POST error:', error)
    
    return NextResponse.json(
      { error: 'SEO operation failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle batch SEO optimization
 */
async function handleBatchOptimization(
  body: any,
  schemaGenerator: SchemaGenerator,
  localSEOOptimizer: LocalSEOOptimizer,
  metaGenerator: SEOMetaGenerator
) {
  const postSlugs = body.posts || []
  
  if (!Array.isArray(postSlugs) || postSlugs.length === 0) {
    return NextResponse.json(
      { error: 'Posts array is required' },
      { status: 400 }
    )
  }

  if (postSlugs.length > 50) {
    return NextResponse.json(
      { error: 'Maximum 50 posts per batch' },
      { status: 400 }
    )
  }

  console.log(`🔧 Batch optimizing SEO for ${postSlugs.length} posts...`)
  const startTime = Date.now()

  const results = []

  for (const slug of postSlugs) {
    try {
      const post = await getBlogPost(slug)
      if (!post) continue

      const schemas = schemaGenerator.generateBlogPostSchema(post)
      const metaTags = metaGenerator.generateMetaTags(post)
      const localOptimization = await localSEOOptimizer.optimizeForLocalSEO(post)

      results.push({
        slug,
        title: post.title,
        schemas: schemas.length,
        metaTags: Object.keys(metaTags.additional).length,
        localKeywords: localOptimization.localKeywords.length,
        recommendations: localOptimization.recommendations.length
      })
    } catch (error) {
      console.warn(`Failed to optimize ${slug}:`, error)
      results.push({
        slug,
        error: 'Optimization failed'
      })
    }
  }

  const processingTime = Date.now() - startTime

  return NextResponse.json({
    results,
    metadata: {
      totalPosts: postSlugs.length,
      successful: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Handle schema validation
 */
async function handleSchemaValidation(body: any) {
  const schemas = body.schemas || []
  
  if (!Array.isArray(schemas)) {
    return NextResponse.json(
      { error: 'Schemas array is required' },
      { status: 400 }
    )
  }

  const validationResults = schemas.map((schema, index) => {
    const validation = validateSchema(schema)
    return {
      index,
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings
    }
  })

  return NextResponse.json({
    validationResults,
    summary: {
      total: schemas.length,
      valid: validationResults.filter(r => r.valid).length,
      invalid: validationResults.filter(r => !r.valid).length
    }
  })
}

// Helper functions

async function performSEOAnalysis(post: BlogPost) {
  const analysis = {
    title: {
      length: post.title.length,
      optimal: post.title.length >= 30 && post.title.length <= 60,
      hasLocation: post.location ? post.title.toLowerCase().includes(post.location.toLowerCase()) : false
    },
    description: {
      length: post.excerpt.length,
      optimal: post.excerpt.length >= 120 && post.excerpt.length <= 160
    },
    content: {
      wordCount: post.content.split(/\s+/).length,
      hasImages: post.gallery && post.gallery.length > 0,
      hasLocation: !!post.location,
      hasCoordinates: !!post.coordinates
    },
    tags: {
      count: post.tags.length,
      optimal: post.tags.length >= 3 && post.tags.length <= 8
    },
    seoScore: 0
  }

  // Calculate SEO score
  let score = 0
  if (analysis.title.optimal) score += 20
  if (analysis.description.optimal) score += 20
  if (analysis.content.wordCount >= 300) score += 15
  if (analysis.content.hasImages) score += 10
  if (analysis.content.hasLocation) score += 15
  if (analysis.tags.optimal) score += 10
  if (post.entities && post.entities.length > 0) score += 10

  analysis.seoScore = score

  return analysis
}

async function performSiteWideSEOAnalysis(posts: BlogPost[]) {
  const totalPosts = posts.length
  const postsWithLocation = posts.filter(p => p.location).length
  const postsWithImages = posts.filter(p => p.gallery && p.gallery.length > 0).length
  const postsWithEntities = posts.filter(p => p.entities && p.entities.length > 0).length

  // Most common locations
  const locationCounts = posts.reduce((acc, post) => {
    if (post.location) {
      acc[post.location] = (acc[post.location] || 0) + 1
    }
    return acc
  }, {} as { [key: string]: number })

  const topLocations = Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([location, count]) => ({ location, count }))

  return {
    overview: {
      totalPosts,
      postsWithLocation,
      postsWithImages,
      postsWithEntities,
      locationCoverage: Math.round((postsWithLocation / totalPosts) * 100),
      imageCoverage: Math.round((postsWithImages / totalPosts) * 100),
      entityCoverage: Math.round((postsWithEntities / totalPosts) * 100)
    },
    topLocations,
    recommendations: [
      postsWithLocation < totalPosts * 0.8 && 'Add location information to more posts',
      postsWithImages < totalPosts * 0.9 && 'Add images to more posts for better SEO',
      postsWithEntities < totalPosts * 0.5 && 'Implement entity recognition for more posts'
    ].filter(Boolean)
  }
}

function validateSchema(schema: any) {
  const errors = []
  const warnings = []

  // Basic validation
  if (!schema['@context']) {
    errors.push('Missing @context')
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type')
  }

  // Type-specific validation
  if (schema['@type'] === 'BlogPosting') {
    if (!schema.headline) warnings.push('Missing headline')
    if (!schema.author) warnings.push('Missing author')
    if (!schema.datePublished) warnings.push('Missing datePublished')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}