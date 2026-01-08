'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface GalleryErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GalleryError({ error, reset }: GalleryErrorProps) {
  useEffect(() => {
    // Log gallery-specific error
    console.error('Gallery section error:', error)
    
    // Track gallery errors for SEO monitoring
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: `Gallery error: ${error.message}`,
        fatal: false,
        error_boundary: 'gallery',
        page_section: 'gallery'
      })
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* Gallery-themed error icon */}
        <div className="text-8xl mb-8">
          📸❌
        </div>
        
        <h1 className="text-4xl font-bold text-dark mb-6">
          Photo Loading Error
        </h1>
        
        <p className="text-xl text-dark/70 mb-8 leading-relaxed">
          Something went wrong while loading the photo gallery. 
          Even photographers sometimes have to deal with technical difficulties!
        </p>

        {/* Development error details */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Gallery Error Details:</h3>
            <p className="text-red-700 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center px-8 py-4 bg-dark text-warm-white rounded-xl hover:bg-dark/90 transition-all duration-300 font-semibold shadow-lg"
          >
            <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload Gallery
          </button>
          
          <Link 
            href="/gallery"
            className="inline-flex items-center px-8 py-4 border-2 border-dark text-dark rounded-xl hover:bg-dark hover:text-warm-white transition-all duration-300 font-semibold"
          >
            <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gallery Home
          </Link>
        </div>

        {/* Alternative content suggestions */}
        <div className="bg-pure-white rounded-2xl p-8 shadow-lg border border-dark/5">
          <h2 className="text-xl font-semibold text-dark mb-4">
            While we develop these photos...
          </h2>
          <p className="text-dark/70 mb-6">
            Explore the written stories and other content while we fix the gallery display.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Travel Stories
            </Link>
            
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            
            <Link 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}