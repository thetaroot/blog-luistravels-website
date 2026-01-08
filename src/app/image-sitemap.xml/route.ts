/**
 * Image Sitemap Generator - SEO-PERFECTION-2025
 * Dedicated image sitemap for enhanced Google Images SEO
 * Includes gallery images, blog post images, and profile photos
 */

import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog'
import { getGalleryAlbums } from '@/lib/gallery'
import { SITE_CONFIG } from '@/lib/constants'

export async function GET() {
  const baseUrl = SITE_CONFIG.url
  const currentDate = new Date().toISOString()
  
  try {
    // Get all content with images
    const [posts, albums] = await Promise.all([
      getBlogPosts(),
      getGalleryAlbums()
    ])

    let imageEntries: string[] = []

    // Blog post images
    posts.forEach(post => {
      if (post.featuredImage) {
        const imageUrl = post.featuredImage.startsWith('http') 
          ? post.featuredImage 
          : `${baseUrl}${post.featuredImage}`
        
        imageEntries.push(`
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <image:image>
        <image:loc>${imageUrl}</image:loc>
        <image:caption>${post.title}</image:caption>
        <image:title>${post.title}</image:title>
        <image:license>${baseUrl}/license</image:license>
      </image:image>
      <lastmod>${post.modifiedDate || post.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`)
      }

      // Additional gallery images from blog posts
      if (post.gallery && post.gallery.length > 0) {
        post.gallery.slice(0, 5).forEach(imagePath => {
          const imageUrl = imagePath.startsWith('http') 
            ? imagePath 
            : `${baseUrl}/images/gallery/${imagePath}`
          
          imageEntries.push(`
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <image:image>
        <image:loc>${imageUrl}</image:loc>
        <image:caption>Gallery image from ${post.title}</image:caption>
        <image:title>${post.title} - Gallery</image:title>
        <image:license>${baseUrl}/license</image:license>
      </image:image>
      <lastmod>${post.modifiedDate || post.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`)
        })
      }
    })

    // Gallery album images
    albums.forEach(album => {
      if (album.images && album.images.length > 0) {
        album.images.forEach(image => {
          const imageUrl = `${baseUrl}/images/gallery/${image.filename}`
          
          imageEntries.push(`
    <url>
      <loc>${baseUrl}/gallery/${album.slug}</loc>
      <image:image>
        <image:loc>${imageUrl}</image:loc>
        <image:caption>${image.caption || `${album.title} - ${image.filename}`}</image:caption>
        <image:title>${album.title}</image:title>
        <image:geo_location>${album.location || 'Travel Photography'}</image:geo_location>
        <image:license>${baseUrl}/license</image:license>
      </image:image>
      <lastmod>${album.dateModified || album.dateCreated || currentDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>`)
        })
      }
    })

    // Profile and brand images
    const brandImages = [
      {
        url: `${baseUrl}/images/portrait.jpg`,
        page: baseUrl,
        caption: 'Luis Gunther - Digital Nomad & Travel Blogger',
        title: 'Luis Gunther Profile Photo'
      },
      {
        url: `${baseUrl}/images/logo.png`,
        page: baseUrl,
        caption: 'Here There & Gone - Travel Blog Logo',
        title: 'Here There & Gone Logo'
      },
      {
        url: `${baseUrl}/images/hero-homepage.jpg`,
        page: baseUrl,
        caption: 'Digital nomad travel experiences',
        title: 'Travel Blog Hero Image'
      }
    ]

    brandImages.forEach(image => {
      imageEntries.push(`
    <url>
      <loc>${image.page}</loc>
      <image:image>
        <image:loc>${image.url}</image:loc>
        <image:caption>${image.caption}</image:caption>
        <image:title>${image.title}</image:title>
        <image:license>${baseUrl}/license</image:license>
      </image:image>
      <lastmod>${currentDate}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>1.0</priority>
    </url>`)
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.join('')}
</urlset>`

    console.log(`🖼️ Generated image sitemap with ${imageEntries.length} image entries`)

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
      },
    })

  } catch (error) {
    console.error('Error generating image sitemap:', error)
    
    // Fallback minimal sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/images/portrait.jpg</image:loc>
      <image:caption>Luis Gunther - Digital Nomad</image:caption>
      <image:title>Luis Gunther</image:title>
    </image:image>
    <lastmod>${currentDate}</lastmod>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // 1 hour for fallback
      },
    })
  }
}