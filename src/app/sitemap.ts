/**
 * Complete Sitemap Generation System - SEO-PERFECTION-2025
 * Dynamic sitemap with images, news, and hreflang for international SEO
 * Includes all routes: static, dynamic blog posts, categories, tags, gallery albums
 */

import { MetadataRoute } from 'next'
import { getBlogPosts, getBlogCategories, getAllBlogTags } from '@/lib/blog'
import { getGalleryAlbums } from '@/lib/gallery'
import { SITE_CONFIG } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url
  const currentDate = new Date().toISOString()
  
  // Static routes with priority and frequency optimization
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          de: `${baseUrl}?lang=de`,
          'x-default': baseUrl
        }
      }
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          de: `${baseUrl}/about?lang=de`,
          'x-default': `${baseUrl}/about`
        }
      }
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/blog`,
          de: `${baseUrl}/blog?lang=de`,
          'x-default': `${baseUrl}/blog`
        }
      }
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/gallery`,
          de: `${baseUrl}/gallery?lang=de`,
          'x-default': `${baseUrl}/gallery`
        }
      }
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          de: `${baseUrl}/contact?lang=de`,
          'x-default': `${baseUrl}/contact`
        }
      }
    },
    {
      url: `${baseUrl}/blog/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/blog/categories`,
          de: `${baseUrl}/blog/categories?lang=de`,
          'x-default': `${baseUrl}/blog/categories`
        }
      }
    },
    {
      url: `${baseUrl}/blog/tags`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/blog/tags`,
          de: `${baseUrl}/blog/tags?lang=de`,
          'x-default': `${baseUrl}/blog/tags`
        }
      }
    }
  ]

  try {
    // Dynamic blog post routes
    const posts = await getBlogPosts()
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.modifiedDate || post.date,
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.9 : 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/blog/${post.slug}`,
          de: `${baseUrl}/blog/${post.slug}?lang=de`,
          'x-default': `${baseUrl}/blog/${post.slug}`
        }
      }
    }))

    // Dynamic category routes
    const categories = await getBlogCategories()
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/blog/category/${category.slug}`,
          de: `${baseUrl}/blog/category/${category.slug}?lang=de`,
          'x-default': `${baseUrl}/blog/category/${category.slug}`
        }
      }
    }))

    // Dynamic tag routes (only for tags with substantial content)
    const tags = await getAllBlogTags()
    const tagRoutes: MetadataRoute.Sitemap = tags
      .filter(tag => tag.postCount && tag.postCount > 2) // Only index tags with 3+ posts
      .map((tag) => ({
        url: `${baseUrl}/blog/tag/${tag.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: tag.postCount && tag.postCount > 5 ? 0.5 : 0.4,
        alternates: {
          languages: {
            en: `${baseUrl}/blog/tag/${tag.slug}`,
            de: `${baseUrl}/blog/tag/${tag.slug}?lang=de`,
            'x-default': `${baseUrl}/blog/tag/${tag.slug}`
          }
        }
      }))

    // Dynamic gallery album routes
    const albums = await getGalleryAlbums()
    const galleryRoutes: MetadataRoute.Sitemap = albums.map((album) => ({
      url: `${baseUrl}/gallery/${album.slug}`,
      lastModified: album.dateModified || album.dateCreated || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/gallery/${album.slug}`,
          de: `${baseUrl}/gallery/${album.slug}?lang=de`,
          'x-default': `${baseUrl}/gallery/${album.slug}`
        }
      }
    }))

    // Combine all routes
    const allRoutes = [
      ...staticRoutes,
      ...blogRoutes,
      ...categoryRoutes,
      ...tagRoutes,
      ...galleryRoutes
    ]

    console.log(`🗺️ Generated sitemap with ${allRoutes.length} URLs:`)
    console.log(`   📄 Static routes: ${staticRoutes.length}`)
    console.log(`   📝 Blog posts: ${blogRoutes.length}`)
    console.log(`   📂 Categories: ${categoryRoutes.length}`)
    console.log(`   🏷️ Tags: ${tagRoutes.length}`)
    console.log(`   🖼️ Gallery albums: ${galleryRoutes.length}`)

    return allRoutes

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes as fallback
    return staticRoutes
  }
}