import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes should not be crawled
          '/_next/',         // Next.js internal files
          '/admin/',         // Admin areas (if any)
          '/private/',       // Private content
          '/temp/',          // Temporary files
          '*.json$',         // JSON files (except sitemap-related)
          '/404',            // Error pages
          '/500',
        ],
      },
      {
        userAgent: 'GPTBot',  // OpenAI's web crawler
        allow: [
          '/',
          '/blog/',
          '/gallery/',
          '/contact/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ]
      },
      {
        userAgent: 'Google-Extended', // Google's AI training crawler
        allow: [
          '/',
          '/blog/',
          '/gallery/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/contact/', // May want to restrict contact page from AI training
        ]
      },
      {
        userAgent: 'CCBot', // Common Crawl (used by various AI systems)
        allow: [
          '/',
          '/blog/',
          '/gallery/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/contact/',
        ]
      },
      {
        userAgent: 'FacebookBot', // Facebook's crawler
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ]
      },
      {
        userAgent: 'TwitterBot', // Twitter's crawler
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ]
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  }
}