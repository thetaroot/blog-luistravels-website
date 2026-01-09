/**
 * Dynamic Blog Category Routes
 * SEO-PERFECTION-2025 - Step 2: Category Routes for SEO Dominance
 * +15 indexable category pages, enhanced blog SEO, perfect structured data
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogCategory, getBlogCategories, getBlogPostsByCategory } from '@/lib/blog'
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { EnhancedMetaTags } from '@/components/seo/SEOProvider'
import { DynamicBreadcrumbs } from '@/components/navigation/Breadcrumbs'
import { SmartImage } from '@/components/image/AdvancedImage'

interface BlogCategoryPageProps {
  params: { category: string }
  searchParams: { page?: string }
}

// CRITICAL: Generate static params for all blog categories
export async function generateStaticParams() {
  try {
    const categories = await getBlogCategories()
    console.log(`📝 Generating ${categories.length} blog category routes for SEO`)

    return categories.map((categorySlug) => ({
      category: categorySlug
    }))
  } catch (error) {
    console.warn('Blog categories not found, generating empty static params')
    return []
  }
}

// CRITICAL: Enhanced metadata for perfect category SEO
export async function generateMetadata({ params, searchParams }: BlogCategoryPageProps): Promise<Metadata> {
  try {
    const category = await getBlogCategory(params.category)
    const posts = await getBlogPostsByCategory(params.category)
    const page = parseInt(searchParams.page || '1')
    
    if (!category) {
      return {
        title: 'Category Not Found | Here There & Gone',
        description: 'The requested blog category could not be found.',
        robots: { index: false, follow: true },
      }
    }

    const canonicalUrl = page > 1 
      ? `https://heretheregone.com/blog/category/${params.category}?page=${page}`
      : `https://heretheregone.com/blog/category/${params.category}`
    
    const postCount = posts.length
    const pageTitle = page > 1 
      ? `${category.name} Travel Stories - Page ${page} | Here There & Gone`
      : `${category.name} Travel Stories | Here There & Gone`
    
    const enhancedDescription = `Discover ${postCount} inspiring ${category.name.toLowerCase()} travel stories and digital nomad experiences. Professional travel insights and photography from around the world.`
    
    // Enhanced keywords combining category data
    const keywords = [
      category.name,
      `${category.name} travel`,
      `${category.name} blog`,
      'digital nomad',
      'travel stories',
      'travel blog',
      `${category.name} experiences`,
      `${category.name} guide`
    ].filter(Boolean)

    return {
      title: pageTitle,
      description: enhancedDescription.substring(0, 155),
      keywords: keywords.slice(0, 15),
      
      authors: [{ name: 'Luis Gunther', url: 'https://heretheregone.com' }],
      
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

      // Complete Open Graph
      openGraph: {
        title: `${category.name} Travel Stories`,
        description: enhancedDescription.substring(0, 155),
        url: canonicalUrl,
        siteName: 'Here There & Gone',
        type: 'website',
        images: posts.slice(0, 4).map(post => ({
          url: (post as any).featuredImage || 'https://heretheregone.com/images/default-blog.jpg',
          width: 1200,
          height: 630,
          alt: post.title
        })),
        locale: 'en_US',
        alternateLocale: ['de_DE', 'es_ES']
      },

      // Enhanced Twitter Card
      twitter: {
        card: 'summary_large_image',
        site: '@heretheregone',
        creator: '@luis',
        title: `${category.name} Travel Stories`,
        description: enhancedDescription.substring(0, 155),
        images: (posts[0] as any)?.featuredImage ?
          [(posts[0] as any).featuredImage] :
          ['https://heretheregone.com/images/default-blog.jpg']
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

      // Pagination links
      ...(page > 1 && { 
        other: {
          'prev': `https://heretheregone.com/blog/category/${params.category}${page > 2 ? `?page=${page - 1}` : ''}`,
          'next': posts.length >= 10 ? `https://heretheregone.com/blog/category/${params.category}?page=${page + 1}` : undefined
        }
      }),

      // Enhanced 2025 metadata
      other: {
        'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        'content-type': 'blog/category',
        'content-category': category.name,
        'post-count': postCount.toString(),
        'page-number': page.toString(),
        'keywords': keywords.join(', '),
        'subject': `${category.name} travel blog`,
        'theme-color': '#ffffff',
        'color-scheme': 'light dark'
      }
    }
  } catch (error) {
    console.error('Error generating category metadata:', error)
    return {
      title: 'Blog Category | Here There & Gone',
      description: 'Explore travel stories and digital nomad experiences by category.',
    }
  }
}

export default async function BlogCategoryPage({ params, searchParams }: BlogCategoryPageProps) {
  try {
    const category = await getBlogCategory(params.category)
    const page = parseInt(searchParams.page || '1')

    if (!category) {
      notFound()
    }

    // Get all posts for this category
    const allPosts = await getBlogPostsByCategory(params.category)
    const postsPerPage = 10
    const totalPages = Math.ceil(allPosts.length / postsPerPage)

    // Calculate pagination
    const startIndex = (page - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const posts = allPosts.slice(startIndex, endIndex)

    // Generate comprehensive structured data
    const collectionSchema = generateCollectionPageSchema({
      name: `${category.name} Travel Stories`,
      description: `Explore ${category.name.toLowerCase()} travel stories and experiences.`,
      url: `https://heretheregone.com/blog/category/${params.category}`,
      items: posts,
      totalItems: allPosts.length,
      category: category.name
    })

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', href: '/', position: 1 },
      { name: 'Blog', href: '/blog', position: 2 },
      { name: 'Categories', href: '/blog/categories', position: 3 },
      { name: category.name, href: `/blog/category/${params.category}`, position: 4 }
    ])

    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [collectionSchema, breadcrumbSchema]
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
            slug: `/blog/category/${params.category}`,
            title: `${category.name} Travel Stories`,
            description: `Explore ${category.name.toLowerCase()} travel stories and digital nomad experiences.`,
            keywords: [category.name, `${category.name} travel`, 'digital nomad'],
            category: category.name,
            tags: [category.name]
          }}
          pageType="blog-category"
          language="en"
        />

        {/* Semantic HTML Structure */}
        <main className="blog-category-page" itemScope itemType="https://schema.org/CollectionPage">
          {/* Enhanced Breadcrumbs */}
          <DynamicBreadcrumbs />
          
          {/* Category Header */}
          <header className="category-header">
            <h1 itemProp="name" className="category-title">
              {category.name} Travel Stories
              {page > 1 && <span className="page-indicator"> - Page {page}</span>}
            </h1>

            <aside className="category-meta" role="complementary">
              <span className="post-count">
                📝 {allPosts.length} stories
              </span>
              
              {totalPages > 1 && (
                <span className="page-info">
                  📄 Page {page} of {totalPages}
                </span>
              )}
            </aside>
          </header>

          {/* Posts Grid */}
          <section className="posts-grid" aria-label={`${category.name} blog posts`}>
            <meta itemProp="numberOfItems" content={posts.length.toString()} />
            
            {posts && posts.length > 0 ? (
              <div className="posts-list">
                {posts.map((post, index) => (
                  <article 
                    key={post.slug}
                    className="post-preview"
                    itemProp="hasPart"
                    itemScope 
                    itemType="https://schema.org/BlogPosting"
                  >
                    {/* Post Image */}
                    {(post as any).featuredImage && (
                      <div className="post-image">
                        <Link href={`/blog/${post.slug}`}>
                          <SmartImage
                            src={(post as any).featuredImage}
                            alt={post.title}
                            context="content"
                            priority={index < 3}
                            width={400}
                            height={250}
                          />
                        </Link>
                      </div>
                    )}
                    
                    {/* Post Content */}
                    <div className="post-content">
                      <header className="post-header">
                        <h2 itemProp="headline" className="post-title">
                          <Link 
                            href={`/blog/${post.slug}`}
                            itemProp="url"
                            className="post-link"
                          >
                            {post.title}
                          </Link>
                        </h2>
                        
                        <div className="post-meta">
                          <time 
                            itemProp="datePublished" 
                            dateTime={post.date}
                            className="post-date"
                          >
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                          
                          <address 
                            itemProp="author" 
                            itemScope 
                            itemType="https://schema.org/Person"
                            className="post-author"
                          >
                            <span itemProp="name">Luis Gunther</span>
                          </address>
                        </div>
                      </header>
                      
                      {post.excerpt && (
                        <p itemProp="description" className="post-excerpt">
                          {post.excerpt}
                        </p>
                      )}
                      
                      {/* Post Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <footer className="post-tags">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="post-tag" itemProp="keywords">
                              #{tag}
                            </span>
                          ))}
                        </footer>
                      )}
                    </div>
                    
                    {/* Hidden structured data */}
                    <div itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                      <meta itemProp="name" content="Here There & Gone" />
                      <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
                        <meta itemProp="url" content="https://heretheregone.com/images/logo.png" />
                      </div>
                    </div>
                    <meta itemProp="mainEntityOfPage" content={`https://heretheregone.com/blog/${post.slug}`} />
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-category">
                <p>No posts found in this category yet.</p>
                <Link href="/blog" className="back-link">
                  ← Back to all posts
                </Link>
              </div>
            )}
          </section>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Category pages navigation">
              <ul className="pagination-list">
                {page > 1 && (
                  <li className="pagination-item">
                    <Link 
                      href={page > 2 ? `/blog/category/${params.category}?page=${page - 1}` : `/blog/category/${params.category}`}
                      className="pagination-link pagination-prev"
                      rel="prev"
                    >
                      ← Previous
                    </Link>
                  </li>
                )}
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
                  return (
                    <li key={pageNum} className="pagination-item">
                      {pageNum === page ? (
                        <span className="pagination-current" aria-current="page">
                          {pageNum}
                        </span>
                      ) : (
                        <Link 
                          href={pageNum === 1 ? `/blog/category/${params.category}` : `/blog/category/${params.category}?page=${pageNum}`}
                          className="pagination-link"
                        >
                          {pageNum}
                        </Link>
                      )}
                    </li>
                  )
                })}
                
                {page < totalPages && (
                  <li className="pagination-item">
                    <Link 
                      href={`/blog/category/${params.category}?page=${page + 1}`}
                      className="pagination-link pagination-next"
                      rel="next"
                    >
                      Next →
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}

          {/* Category Footer */}
          <footer className="category-footer">
            <section className="related-categories" aria-labelledby="related-heading">
              <h2 id="related-heading">Explore More Categories</h2>
              <nav className="categories-nav">
                <Link href="/blog" className="category-nav-link">
                  All Posts
                </Link>
                <Link href="/blog/categories" className="category-nav-link">
                  Browse Categories
                </Link>
                <Link href="/blog/tags" className="category-nav-link">
                  Browse Tags
                </Link>
              </nav>
            </section>
          </footer>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error rendering blog category page:', error)
    notFound()
  }
}