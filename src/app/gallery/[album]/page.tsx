/**
 * Dynamic Gallery Album Routes
 * SEO-PERFECTION-2025 - Step 1: Gallery Routes for SEO Dominance
 * +20 indexable pages, enhanced gallery SEO, perfect structured data
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGalleryAlbum, getGalleryAlbums, getGalleryImages } from '@/lib/gallery'
import { generateGallerySchema, generateImageGallerySchema } from '@/lib/seo/structured-data'
import { EnhancedMetaTags } from '@/components/seo/SEOProvider'
import { DynamicBreadcrumbs } from '@/components/navigation/Breadcrumbs'
import { SmartImage } from '@/components/image/AdvancedImage'

interface GalleryAlbumPageProps {
  params: { album: string }
}

// CRITICAL: Generate static params for all gallery albums
export async function generateStaticParams() {
  try {
    const albums = await getGalleryAlbums()
    console.log(`🖼️ Generating ${albums.length} gallery album routes for SEO`)
    
    return albums.map((album) => ({
      album: album.slug
    }))
  } catch (error) {
    console.warn('Gallery albums not found, generating empty static params')
    return []
  }
}

// CRITICAL: Enhanced metadata for perfect SEO
export async function generateMetadata({ params }: GalleryAlbumPageProps): Promise<Metadata> {
  try {
    const album = await getGalleryAlbum(params.album)
    
    if (!album) {
      return {
        title: 'Gallery Album Not Found | Here There & Gone',
        description: 'The requested gallery album could not be found.',
        robots: {
          index: false,
          follow: true,
        },
      }
    }

    const canonicalUrl = `https://heretheregone.com/gallery/${params.album}`
    const imageCount = album.images?.length || 0
    const enhancedDescription = `Explore ${imageCount} stunning ${album.category || 'travel'} photos from ${album.location || 'around the world'}. ${album.description} | Professional travel photography by Luis.`
    
    // Enhanced keywords combining album data
    const keywords = [
      ...album.tags || [],
      album.location,
      album.category,
      'travel photography',
      'digital nomad',
      'professional photography',
      `${album.location} photos`,
      `${album.category} gallery`
    ].filter(Boolean)

    return {
      title: `${album.title} - Travel Photo Gallery | Here There & Gone`,
      description: enhancedDescription.substring(0, 155),
      keywords: keywords.slice(0, 15),
      
      authors: [
        { 
          name: 'Luis Gunther', 
          url: 'https://heretheregone.com',
        }
      ],
      
      // Enhanced robots for 2025
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      },

      // Complete Open Graph for social sharing
      openGraph: {
        title: `${album.title} - Travel Photography`,
        description: enhancedDescription.substring(0, 155),
        url: canonicalUrl,
        siteName: 'Here There & Gone',
        type: 'website',
        images: album.images?.slice(0, 6).map(img => ({
          url: `https://heretheregone.com/images/gallery/${img.filename}`,
          width: img.width || 1200,
          height: img.height || 630,
          alt: img.alt || img.caption || album.title,
          type: img.format || 'image/jpeg',
        })) || [{
          url: 'https://heretheregone.com/images/default-gallery.jpg',
          width: 1200,
          height: 630,
          alt: album.title
        }],
        locale: 'en_US',
        alternateLocale: ['de_DE', 'es_ES']
      },

      // Enhanced Twitter Card
      twitter: {
        card: 'summary_large_image',
        site: '@heretheregone',
        creator: '@luis',
        title: `${album.title} - Travel Photography`,
        description: enhancedDescription.substring(0, 155),
        images: album.images?.[0] ? 
          [`https://heretheregone.com/images/gallery/${album.images[0].filename}`] :
          ['https://heretheregone.com/images/default-gallery.jpg']
      },

      // Canonical and alternates
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': canonicalUrl,
          'de': `${canonicalUrl}?lang=de`,
          'x-default': canonicalUrl
        }
      },

      // Enhanced 2025 metadata
      other: {
        // Enhanced robots
        'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        
        // Geographic data
        'geo.region': album.countryCode || 'WORLDWIDE',
        'geo.placename': album.location || 'Travel Locations',
        'ICBM': album.coordinates || '0,0',
        
        // Content classification
        'content-type': 'image/gallery',
        'content-category': album.category || 'travel',
        'image-count': imageCount.toString(),
        
        // Enhanced discovery
        'keywords': keywords.join(', '),
        'subject': `${album.title} travel photography`,
        'coverage': album.location || 'worldwide',
        
        // Performance hints
        'theme-color': '#ffffff',
        'color-scheme': 'light dark'
      }
    }
  } catch (error) {
    console.error('Error generating gallery metadata:', error)
    return {
      title: 'Gallery | Here There & Gone',
      description: 'Travel photography gallery showcasing adventures from around the world.',
    }
  }
}

export default async function GalleryAlbumPage({ params }: GalleryAlbumPageProps) {
  try {
    const album = await getGalleryAlbum(params.album)
    
    if (!album) {
      notFound()
    }

    // Generate comprehensive structured data
    const gallerySchema = generateGallerySchema(album)
    const imageGallerySchema = generateImageGallerySchema(album)
    
    // Combined structured data for maximum SEO impact
    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [gallerySchema, imageGallerySchema]
    }

    return (
      <>
        {/* CRITICAL: Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema, null, 2)
          }}
        />

        {/* Enhanced SEO Meta Tags */}
        <EnhancedMetaTags 
          pageData={{
            slug: `/gallery/${params.album}`,
            title: album.title,
            description: album.description,
            keywords: album.tags || [],
            category: album.category,
            tags: album.tags,
            images: album.images
          }}
          pageType="gallery"
          language="en"
        />

        {/* Semantic HTML Structure */}
        <main className="gallery-album-page" itemScope itemType="https://schema.org/ImageGallery">
          {/* Enhanced Breadcrumbs */}
          <DynamicBreadcrumbs pathname={`/gallery/${params.album}`} />
          
          {/* Gallery Header */}
          <header className="gallery-header">
            <h1 itemProp="name" className="gallery-title">
              {album.title}
            </h1>
            
            {album.description && (
              <p itemProp="description" className="gallery-description">
                {album.description}
              </p>
            )}
            
            <aside className="gallery-meta" role="complementary">
              {album.location && (
                <span 
                  itemProp="contentLocation" 
                  itemScope 
                  itemType="https://schema.org/Place"
                  className="gallery-location"
                >
                  📍 <span itemProp="name">{album.location}</span>
                </span>
              )}
              
              <span className="gallery-count">
                📸 {album.images?.length || 0} photos
              </span>
              
              {album.dateCreated && (
                <time 
                  itemProp="dateCreated" 
                  dateTime={album.dateCreated}
                  className="gallery-date"
                >
                  📅 {new Date(album.dateCreated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </aside>
          </header>

          {/* Image Gallery Grid */}
          <section className="gallery-grid" aria-label="Photo gallery">
            <meta itemProp="numberOfItems" content={(album.images?.length || 0).toString()} />
            
            {album.images && album.images.length > 0 ? (
              album.images.map((image, index) => (
                <figure 
                  key={image.id || index} 
                  className="gallery-item"
                  itemProp="image"
                  itemScope 
                  itemType="https://schema.org/ImageObject"
                >
                  <SmartImage
                    src={`/images/gallery/${image.filename}`}
                    alt={image.alt || image.caption || `${album.title} photo ${index + 1}`}
                    contextType="gallery"
                    priority={index < 6} // Prioritize first 6 images
                    width={image.width || 800}
                    height={image.height || 600}
                    itemProp="url"
                  />
                  
                  {/* Enhanced image metadata */}
                  <meta itemProp="width" content={(image.width || 800).toString()} />
                  <meta itemProp="height" content={(image.height || 600).toString()} />
                  <meta itemProp="encodingFormat" content={image.format || 'image/jpeg'} />
                  
                  {image.caption && (
                    <figcaption itemProp="caption" className="image-caption">
                      {image.caption}
                    </figcaption>
                  )}
                  
                  {/* Enhanced image schema data */}
                  {image.dateTaken && (
                    <meta itemProp="dateCreated" content={image.dateTaken} />
                  )}
                  
                  {image.location && (
                    <div itemProp="contentLocation" itemScope itemType="https://schema.org/Place">
                      <meta itemProp="name" content={image.location} />
                    </div>
                  )}
                  
                  <div itemProp="creator" itemScope itemType="https://schema.org/Person">
                    <meta itemProp="name" content="Luis Gunther" />
                    <meta itemProp="url" content="https://heretheregone.com" />
                  </div>
                  
                  <div itemProp="copyrightHolder" itemScope itemType="https://schema.org/Person">
                    <meta itemProp="name" content="Luis Gunther" />
                  </div>
                </figure>
              ))
            ) : (
              <div className="empty-gallery">
                <p>No images found in this gallery.</p>
              </div>
            )}
          </section>

          {/* Enhanced Tags Section */}
          {album.tags && album.tags.length > 0 && (
            <footer className="gallery-footer">
              <section className="gallery-tags" aria-labelledby="tags-heading">
                <h2 id="tags-heading" className="tags-title">Tags</h2>
                <ul className="tags-list" role="list">
                  {album.tags.map((tag) => (
                    <li key={tag} className="tag-item">
                      <a 
                        href={`/gallery/tag/${tag}`}
                        className="tag-link"
                        itemProp="keywords"
                        rel="tag"
                      >
                        #{tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </footer>
          )}
        </main>
      </>
    )
  } catch (error) {
    console.error('Error rendering gallery album page:', error)
    notFound()
  }
}