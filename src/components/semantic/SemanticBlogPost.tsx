import React from 'react'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

interface SemanticBlogPostProps {
  post: BlogPost
}

export function SemanticBlogPost({ post }: SemanticBlogPostProps) {
  const breadcrumbItems = [
    { name: 'Home', href: '/', position: 1 },
    { name: 'Blog', href: '/blog', position: 2 },
    { name: post.title, position: 3 }
  ]

  return (
    <article 
      itemScope 
      itemType="https://schema.org/BlogPosting"
      className="semantic-blog-post"
    >
      <Breadcrumbs items={breadcrumbItems} />
      
      <header className="article-header">
        <h1 itemProp="headline" className="article-title">
          {post.title}
        </h1>
        
        <div className="article-meta">
          <time 
            itemProp="datePublished" 
            dateTime={post.date}
            className="published-date"
          >
            {formatDate(post.date)}
          </time>
          
          {post.modifiedDate && (
            <time 
              itemProp="dateModified" 
              dateTime={post.modifiedDate}
              className="modified-date"
            >
              Updated: {formatDate(post.modifiedDate)}
            </time>
          )}
          
          <address 
            itemProp="author" 
            itemScope 
            itemType="https://schema.org/Person"
            className="author-info"
          >
            <span itemProp="name">Luis Gunther</span>
            <meta itemProp="url" content="https://heretheregone.com" />
          </address>
          
          {post.location && (
            <div 
              itemProp="contentLocation" 
              itemScope 
              itemType="https://schema.org/Place"
              className="content-location"
            >
              <span itemProp="name">{post.location}</span>
            </div>
          )}
        </div>

        {post.excerpt && (
          <div 
            itemProp="description" 
            className="article-excerpt"
          >
            {post.excerpt}
          </div>
        )}

        {post.gallery && post.gallery.length > 0 && (
          <div 
            itemProp="image" 
            itemScope 
            itemType="https://schema.org/ImageObject"
            className="featured-image"
          >
            <img 
              itemProp="url"
              src={`/images/gallery/${post.gallery[0]}`}
              alt={post.title}
              loading="eager"
            />
            <meta itemProp="width" content="1200" />
            <meta itemProp="height" content="800" />
          </div>
        )}
      </header>
      
      <div 
        itemProp="articleBody"
        className="article-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <footer className="article-footer">
        {post.tags && post.tags.length > 0 && (
          <div className="tags-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  itemProp="keywords"
                  className="tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="article-metadata">
          <meta itemProp="wordCount" content={post.content ? post.content.split(' ').length.toString() : '0'} />
          <meta itemProp="inLanguage" content={post.language || 'en'} />
          <meta itemProp="articleSection" content="Travel" />
          <link itemProp="mainEntityOfPage" href={`https://heretheregone.com/blog/${post.slug}`} />
        </div>
      </footer>
    </article>
  )
}