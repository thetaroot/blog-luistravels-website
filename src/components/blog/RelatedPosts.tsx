'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { OptimizedImage } from '@/components/optimized/OptimizedImage'
import { BlogPost } from '@/lib/blog/types'

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  maxPosts?: number
}

export function RelatedPosts({ currentSlug, currentTags, maxPosts = 3 }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`/api/blog/related?slug=${currentSlug}&tags=${currentTags.join(',')}&limit=${maxPosts}`)
        const data = await response.json()
        
        if (data.success) {
          setRelatedPosts(data.posts)
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentSlug, currentTags, maxPosts])

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-dark mb-8">Related Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-dark/10 rounded-lg h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-dark/10 rounded w-3/4"></div>
                <div className="h-4 bg-dark/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 border-t border-dark/10">
      <h2 className="text-2xl font-bold text-dark mb-8">
        More Travel Stories
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article 
            key={post.slug} 
            className="group cursor-pointer"
            itemScope
            itemType="https://schema.org/Article"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              {/* Featured Image */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
                  <OptimizedImage
                    src={`/images/gallery/${post.gallery[0]}`}
                    alt={`Featured image for ${post.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              )}
              
              {/* Post Content */}
              <div className="space-y-3">
                <h3 
                  itemProp="headline"
                  className="text-lg font-semibold text-dark group-hover:text-dark/80 transition-colors line-clamp-2"
                >
                  {post.title}
                </h3>
                
                <p 
                  className="text-dark/70 text-sm line-clamp-3 leading-relaxed"
                  itemProp="description"
                >
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <time 
                    itemProp="datePublished"
                    dateTime={post.date}
                    className="text-xs text-dark/50"
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  
                  {/* Tags */}
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-dark/10 text-dark text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* View All Posts Link */}
      <div className="text-center mt-8">
        <Link 
          href="/blog"
          className="inline-flex items-center px-6 py-3 border-2 border-dark text-dark rounded-lg hover:bg-dark hover:text-warm-white transition-colors font-medium"
        >
          View All Blog Posts
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}