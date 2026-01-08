/**
 * Dynamic Blog Tag Routes
 * SEO-PERFECTION-2025 - Step 3: Tag Routes for SEO Dominance
 * +25 indexable tag pages, enhanced topic clustering, perfect structured data
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogTag, getAllBlogTags, getBlogPostsByTag } from '@/lib/blog'
import { generateTopicPageSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { EnhancedMetaTags } from '@/components/seo/SEOProvider'
import { DynamicBreadcrumbs } from '@/components/navigation/Breadcrumbs'
import { SmartImage } from '@/components/image/AdvancedImage'

interface BlogTagPageProps {
  params: { tag: string }
  searchParams: { page?: string }
}

// CRITICAL: Generate static params for all blog tags
export async function generateStaticParams() {
  try {
    const tags = await getAllBlogTags()
    console.log(`🏷️ Generating ${tags.length} blog tag routes for SEO`)
    
    return tags.map((tag) => ({
      tag: tag.slug
    }))
  } catch (error) {
    console.warn('Blog tags not found, generating empty static params')
    return []
  }
}

// CRITICAL: Enhanced metadata for perfect tag SEO
export async function generateMetadata({ params, searchParams }: BlogTagPageProps): Promise<Metadata> {
  try {
    const tag = await getBlogTag(params.tag)
    const posts = await getBlogPostsByTag(params.tag)
    const page = parseInt(searchParams.page || '1')
    
    if (!tag) {
      return {
        title: 'Tag Not Found | Here There & Gone',
        description: 'The requested blog tag could not be found.',
        robots: { index: false, follow: true },
      }
    }

    const canonicalUrl = page > 1 
      ? `https://heretheregone.com/blog/tag/${params.tag}?page=${page}`
      : `https://heretheregone.com/blog/tag/${params.tag}`
    
    const postCount = posts.length
    const pageTitle = page > 1 
      ? `${tag.name} Travel Posts - Page ${page} | Here There & Gone`
      : `${tag.name} Travel Posts | Here There & Gone`
    
    const enhancedDescription = `Explore ${postCount} travel stories and digital nomad experiences tagged with ${tag.name}. ${tag.description || `Discover insights, tips, and adventures related to ${tag.name}.`} | Professional travel content and photography.`
    
    // Enhanced keywords for tag pages
    const keywords = [
      tag.name,
      `${tag.name} travel`,
      `${tag.name} digital nomad`,
      `${tag.name} blog`,
      'travel stories',
      'nomad life',
      `${tag.name} experiences`,
      `${tag.name} tips`,
      `${tag.name} guide`,
      ...tag.relatedTags || []
    ].filter(Boolean)

    return {
      title: pageTitle,
      description: enhancedDescription.substring(0, 155),
      keywords: keywords.slice(0, 15),
      
      authors: [{ name: 'Luis Gunther', url: 'https://heretheregone.com' }],
      
      // Enhanced robots for 2025
      robots: {
        index: postCount > 2, // Only index tags with substantial content
        follow: true,
        nocache: false,
        googleBot: {
          index: postCount > 2,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      },

      // Complete Open Graph
      openGraph: {
        title: `${tag.name} Travel Content`,
        description: enhancedDescription.substring(0, 155),
        url: canonicalUrl,
        siteName: 'Here There & Gone',
        type: 'website',
        images: posts.slice(0, 4).map(post => ({
          url: post.featuredImage || 'https://heretheregone.com/images/default-blog.jpg',
          width: 1200,
          height: 630,
          alt: post.title
        })),
        locale: 'en_US'
      },

      // Enhanced Twitter Card
      twitter: {
        card: 'summary_large_image',
        site: '@heretheregone',
        creator: '@luis',
        title: `${tag.name} Travel Content`,
        description: enhancedDescription.substring(0, 155),
        images: posts[0]?.featuredImage ? 
          [posts[0].featuredImage] :
          ['https://heretheregone.com/images/default-blog.jpg']
      },

      // Canonical and alternates
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': canonicalUrl,
          'x-default': canonicalUrl
        }
      },

      // Enhanced 2025 metadata
      other: {
        'robots': postCount > 2 ? 'index, follow, max-snippet:-1, max-image-preview:large' : 'noindex, follow',
        'content-type': 'blog/tag',
        'content-tag': tag.name,
        'post-count': postCount.toString(),
        'page-number': page.toString(),
        'keywords': keywords.join(', '),
        'subject': `${tag.name} travel content`,
        'topic-cluster': tag.cluster || 'travel',
        'theme-color': '#ffffff'
      }
    }
  } catch (error) {
    console.error('Error generating tag metadata:', error)
    return {
      title: 'Blog Tag | Here There & Gone',
      description: 'Explore travel stories and digital nomad experiences by tag.',
    }
  }
}

export default async function BlogTagPage({ params, searchParams }: BlogTagPageProps) {
  try {
    const tag = await getBlogTag(params.tag)
    const page = parseInt(searchParams.page || '1')
    
    if (!tag) {
      notFound()
    }

    const posts = await getBlogPostsByTag(params.tag, page)
    const totalPosts = await getBlogPostsByTag(params.tag) // Get total count
    const postsPerPage = 12
    const totalPages = Math.ceil(totalPosts.length / postsPerPage)

    // Generate comprehensive structured data
    const topicSchema = generateTopicPageSchema({
      name: tag.name,
      description: tag.description || `Travel content about ${tag.name}`,
      url: `https://heretheregone.com/blog/tag/${params.tag}`,
      posts: posts,
      totalPosts: totalPosts.length,
      tag: tag.name,
      cluster: tag.cluster
    })

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: 'Tags', href: '/blog/tags' },
      { name: tag.name, href: `/blog/tag/${params.tag}` }
    ])

    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [topicSchema, breadcrumbSchema]
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
            slug: `/blog/tag/${params.tag}`,
            title: `${tag.name} Travel Content`,
            description: tag.description || `Travel stories about ${tag.name}`,
            keywords: [tag.name, ...tag.relatedTags || []],
            tags: [tag.name]
          }}
          pageType="blog-tag"
          language="en"
        />

        {/* Semantic HTML Structure */}
        <main className="blog-tag-page" itemScope itemType="https://schema.org/WebPage">
          {/* Enhanced Breadcrumbs */}
          <DynamicBreadcrumbs pathname={`/blog/tag/${params.tag}`} />
          
          {/* Tag Header */}
          <header className="tag-header">
            <div className="tag-title-section">
              <span className="tag-symbol" aria-hidden="true">#</span>
              <h1 itemProp="name" className="tag-title">
                {tag.name}
                {page > 1 && <span className="page-indicator"> - Page {page}</span>}
              </h1>
            </div>
            
            {tag.description && (
              <p itemProp="description" className="tag-description">
                {tag.description}
              </p>
            )}
            
            <aside className="tag-meta" role="complementary">
              <span className="post-count">
                📝 {totalPosts.length} {totalPosts.length === 1 ? 'story' : 'stories'}
              </span>
              
              {totalPages > 1 && (
                <span className="page-info">
                  📄 Page {page} of {totalPages}
                </span>
              )}
              
              {tag.cluster && (
                <span className="topic-cluster">
                  🎯 {tag.cluster} topic
                </span>
              )}
            </aside>
          </header>

          {/* Posts Grid */}
          <section className="posts-grid" aria-label={`Posts tagged with ${tag.name}`}>
            {posts && posts.length > 0 ? (
              <div className="posts-masonry">
                {posts.map((post, index) => (
                  <article 
                    key={post.slug}
                    className="post-card"
                    itemScope 
                    itemType="https://schema.org/BlogPosting"
                  >
                    {/* Post Image */}
                    {post.featuredImage && (
                      <div className="post-image">
                        <Link href={`/blog/${post.slug}`}>
                          <SmartImage
                            src={post.featuredImage}
                            alt={post.title}
                            contextType="thumbnail"
                            priority={index < 4}
                            width={300}
                            height={200}
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
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                          
                          {post.category && (
                            <span className="post-category">
                              📂 {post.category}
                            </span>
                          )}
                        </div>
                      </header>
                      
                      {post.excerpt && (
                        <p itemProp="description" className="post-excerpt">
                          {post.excerpt.substring(0, 120)}...
                        </p>
                      )}
                      
                      {/* Related Tags */}
                      {post.tags && post.tags.length > 1 && (
                        <footer className="post-tags">
                          {post.tags.filter(t => t !== tag.name).slice(0, 2).map((relatedTag) => (
                            <Link
                              key={relatedTag}
                              href={`/blog/tag/${relatedTag}`}
                              className="related-tag"
                            >
                              #{relatedTag}
                            </Link>
                          ))}
                        </footer>
                      )}
                    </div>
                    
                    {/* Hidden structured data */}
                    <div itemProp="author" itemScope itemType="https://schema.org/Person">
                      <meta itemProp="name" content="Luis Gunther" />
                    </div>
                    <div itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                      <meta itemProp="name" content="Here There & Gone" />
                    </div>
                    <meta itemProp="keywords" content={post.tags?.join(', ')} />
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-tag">
                <p>No posts found with this tag yet.</p>
                <Link href="/blog" className="back-link">
                  ← Explore all posts
                </Link>
              </div>
            )}
          </section>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Tag pages navigation">
              <ul className="pagination-list">
                {page > 1 && (
                  <li className="pagination-item">
                    <Link 
                      href={page > 2 ? `/blog/tag/${params.tag}?page=${page - 1}` : `/blog/tag/${params.tag}`}
                      className="pagination-link pagination-prev"
                      rel="prev"
                    >
                      ← Previous
                    </Link>
                  </li>
                )}
                
                {page < totalPages && (
                  <li className="pagination-item">
                    <Link 
                      href={`/blog/tag/${params.tag}?page=${page + 1}`}
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

          {/* Tag Footer with Related Content */}
          <footer className="tag-footer">
            {/* Related Tags */}
            {tag.relatedTags && tag.relatedTags.length > 0 && (
              <section className="related-tags" aria-labelledby="related-tags-heading">
                <h2 id="related-tags-heading">Related Topics</h2>
                <nav className="related-tags-nav">
                  {tag.relatedTags.slice(0, 6).map((relatedTag) => (
                    <Link
                      key={relatedTag}
                      href={`/blog/tag/${relatedTag}`}
                      className="related-tag-link"
                    >
                      #{relatedTag}
                    </Link>
                  ))}
                </nav>
              </section>
            )}
            
            {/* Navigation */}
            <section className="tag-navigation" aria-labelledby="nav-heading">
              <h2 id="nav-heading" className="sr-only">Navigate Blog</h2>
              <nav className="tag-nav">
                <Link href="/blog" className="nav-link">
                  All Posts
                </Link>
                <Link href="/blog/categories" className="nav-link">
                  Categories
                </Link>
                <Link href="/blog/tags" className="nav-link">
                  All Tags
                </Link>
              </nav>
            </section>
          </footer>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error rendering blog tag page:', error)
    notFound()
  }
}