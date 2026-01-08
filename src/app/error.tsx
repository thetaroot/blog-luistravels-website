'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to external service (e.g., Sentry, LogRocket)
    console.error('Global error occurred:', error)
    
    // Track error for SEO monitoring
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        error_boundary: 'global'
      })
    }
  }, [error])

  return (
    <html>
      <body>
        {/* Minimal structured data for error context */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Server Error - Luis Travels",
              "description": "A server error occurred. We're working to fix it.",
              "url": "https://heretheregone.com/500",
              "mainEntity": {
                "@type": "Person",
                "name": "Luis Gunther",
                "url": "https://heretheregone.com"
              }
            }, null, 2)
          }}
        />

        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center max-w-2xl">
            {/* Error Icon */}
            <div className="text-8xl mb-8 animate-pulse">
              ⚠️
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Technical Difficulties
            </h1>
            
            {/* Error Description */}
            <p className="text-xl text-dark/70 mb-8 leading-relaxed">
              Oops! Something went wrong on our end. 
              Even digital nomads sometimes encounter technical storms.
            </p>
            
            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-8 text-left">
                <h3 className="font-semibold text-red-800 mb-2">Error Details (Dev Mode):</h3>
                <p className="text-red-700 text-sm font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-red-600 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={reset}
                className="inline-flex items-center px-8 py-4 bg-dark text-warm-white rounded-xl hover:bg-dark/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 border-2 border-dark text-dark rounded-xl hover:bg-dark hover:text-warm-white transition-all duration-300 font-semibold"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
              </Link>
            </div>

            {/* Helpful Information */}
            <div className="bg-pure-white rounded-2xl p-8 shadow-lg border border-dark/5">
              <h2 className="text-xl font-semibold text-dark mb-4">
                What happened?
              </h2>
              <p className="text-dark/70 mb-6">
                A server error occurred while processing your request. 
                This could be due to high traffic, a temporary glitch, or maintenance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-medium text-dark mb-2">What you can do:</h3>
                  <ul className="space-y-1 text-sm text-dark/70">
                    <li>• Try refreshing the page</li>
                    <li>• Wait a few minutes and try again</li>
                    <li>• Check your internet connection</li>
                    <li>• Visit our homepage instead</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-dark mb-2">Still having issues?</h3>
                  <ul className="space-y-1 text-sm text-dark/70">
                    <li>• The error has been logged</li>
                    <li>• We&apos;re working on a fix</li>
                    <li>• Try again in a few minutes</li>
                    <li>• <Link href="/contact" className="underline hover:text-dark">Contact us</Link> if it persists</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Navigation */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
              >
                Travel Stories
              </Link>
              
              <Link 
                href="/gallery" 
                className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
              >
                Photo Gallery
              </Link>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}