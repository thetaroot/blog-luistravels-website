import { getBlogPost, listBlogPostSlugs } from '@/lib/blog'
import { generateArticleSchema as generateOldArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/lib/blog/types'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { OptimizedImage } from '@/components/optimized/OptimizedImage'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { SITE_CONFIG } from '@/lib/constants'
import { SemanticBlogPost } from '@/components/semantic/SemanticBlogPost'
import { generateArticleSchema } from '@/lib/seo/entity-optimization'

// Only allow pre-generated paths
export const dynamicParams = false

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const slugs = await listBlogPostSlugs()
    // Return at least one dummy entry if no posts exist
    if (slugs.length === 0) {
      console.warn('No blog posts found, skipping blog routes')
      return [{ slug: '__no-posts__' }]
    }
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return [{ slug: '__no-posts__' }]
  }
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug)
    
    // Enhanced meta description with location and travel context
    const enhancedDescription = `${post.excerpt} ${post.tags.includes('Travel') ? `Travel stories and digital nomad experiences.` : 'Personal stories and insights.'}`
    
    // Canonical URL for this specific post
    const canonicalUrl = `${SITE_CONFIG.url}/blog/${params.slug}`
    
    // Featured image - use gallery image or default
    const featuredImage = post.gallery && post.gallery.length > 0 
      ? `${SITE_CONFIG.url}/images/gallery/${post.gallery[0]}`
      : `${SITE_CONFIG.url}/images/portrait.jpg`

    return {
      title: `${post.title} | Luis Travels`,
      description: enhancedDescription.substring(0, 155), // Optimal meta description length
      keywords: [
        ...post.tags,
        'digital nomad',
        'travel blog',
        'backpacker stories',
        'luis travels',
        'luis gunther'
      ].join(', '),
      authors: [{ 
        name: 'Luis Gunther', 
        url: SITE_CONFIG.url 
      }],
      creator: 'Luis Gunther',
      publisher: 'Luis Travels',
      
      // Open Graph optimization
      openGraph: {
        title: post.title,
        description: enhancedDescription.substring(0, 155),
        url: canonicalUrl,
        siteName: 'Luis Travels',
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: ['Luis Gunther'],
        tags: post.tags,
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: `${post.title} - Luis Travels`,
          }
        ],
        locale: 'en_US',
      },
      
      // Twitter Card optimization
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: enhancedDescription.substring(0, 155),
        creator: '@luistravels',
        images: [featuredImage],
      },
      
      // Robots and indexing
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      // Canonical and alternates
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': `/blog/${params.slug}`,
          'de': `/de/blog/${params.slug}`,
        }
      },
      
      // Additional metadata for better indexing
      other: {
        'article:published_time': post.date,
        'article:modified_time': post.date,
        'article:author': 'Luis Gunther',
        'article:section': 'Travel',
        'article:tag': post.tags.join(','),
      }
    }
  } catch (error) {
    console.error(`Error generating metadata for blog post ${params.slug}:`, error)
    
    // Return fallback metadata
    return {
      title: 'Blog Post | Luis Travels',
      description: 'Travel stories and digital nomad adventures from around the world.',
    }
  }
}

// Blog post page component
export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  let post: BlogPost
  
  try {
    post = await getBlogPost(params.slug)
  } catch (error) {
    console.error(`Blog post not found: ${params.slug}`, error)
    notFound()
  }

  // Generate 10/10 SEO structured data for this post
  const articleSchema = generateArticleSchema(post)
  const oldArticleSchema = generateOldArticleSchema(post) // Keep existing
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/', position: 1 },
    { name: 'Blog', href: '/blog', position: 2 },
    { name: post.title, position: 3 }
  ])

  // Combine all structured data with enhanced schemas
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, oldArticleSchema, breadcrumbSchema]
  }

  return (
    <>
      {/* Enhanced JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema, null, 2)
        }}
      />

      {/* 10/10 SEO Semantic Blog Post Component */}
      <SemanticBlogPost post={post} />

      {/* Related Posts with Topic Clustering */}
      <RelatedPosts currentSlug={params.slug} currentTags={post.tags} />
    </>
  )
}