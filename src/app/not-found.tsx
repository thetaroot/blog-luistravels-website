import Link from 'next/link'
import { Metadata } from 'next'
import { generatePersonSchema, generateWebsiteSchema } from '@/lib/seo/structured-data'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Luis Travels',
  description: 'The page you are looking for could not be found. Explore our travel stories, photo gallery, and nomad adventures instead.',
  robots: {
    index: false,        // Don't index 404 pages
    follow: true,        // But follow links on the page
    noarchive: true,     // Don't archive this page
    nosnippet: false,    // Allow snippets for better UX
  },
  openGraph: {
    title: '404 - Page Not Found | Luis Travels',
    description: 'Oops! This page seems to have wandered off the beaten path. Discover our travel stories instead.',
    url: `${SITE_CONFIG.url}/404`,
    siteName: 'Luis Travels',
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/404-wanderer.jpg`, // Custom 404 image if available
        width: 1200,
        height: 630,
        alt: 'Lost wanderer - 404 page illustration',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 - Page Not Found | Luis Travels',
    description: 'This page seems to have wandered off! Explore our travel adventures instead.',
  }
}

export default function GlobalNotFound() {
  // Generate structured data to maintain SEO context
  const personSchema = generatePersonSchema()
  const websiteSchema = generateWebsiteSchema()
  
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [personSchema, websiteSchema]
  }

  return (
    <>
      {/* Maintain structured data even on error pages */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema, null, 2)
        }}
      />

      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-warm-white to-pure-white">
        <div className="text-center max-w-2xl">
          {/* Hero Section */}
          <div className="mb-12">
            {/* Custom 404 Animation/Icon */}
            <div className="text-8xl mb-6 animate-bounce">
              🗺️
            </div>
            
            {/* Main Heading - SEO Optimized */}
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
              Lost on the Digital Trail
            </h1>
            
            {/* Descriptive Content - Good for SEO */}
            <p className="text-xl text-dark/70 mb-8 leading-relaxed">
              Looks like this page has wandered off the beaten path! 
              Even the best explorers sometimes take a wrong turn.
            </p>
            
            {/* Additional Context */}
            <p className="text-lg text-dark/60 mb-12">
              The page you&apos;re looking for might have been moved, deleted, or never existed. 
              But don&apos;t worry – there are plenty of adventures waiting for you!
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-6 mb-12">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 bg-dark text-warm-white rounded-xl hover:bg-dark/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home Base
              </Link>
              
              <Link 
                href="/blog"
                className="inline-flex items-center px-8 py-4 border-2 border-dark text-dark rounded-xl hover:bg-dark hover:text-warm-white transition-all duration-300 font-semibold"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Explore Travel Stories
              </Link>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/gallery" 
                className="inline-flex items-center px-4 py-2 bg-dark/10 text-dark rounded-lg hover:bg-dark/20 transition-colors text-sm font-medium"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photo Gallery
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

          {/* Search Suggestion */}
          <div className="bg-pure-white rounded-2xl p-8 shadow-lg border border-dark/5">
            <h2 className="text-xl font-semibold text-dark mb-4">
              Looking for something specific?
            </h2>
            <p className="text-dark/70 mb-6">
              Try browsing our latest adventures or use the navigation to find your way around.
            </p>
            
            {/* Popular Content Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <h3 className="font-medium text-dark mb-2">Popular Destinations</h3>
                <ul className="space-y-1 text-sm text-dark/70">
                  <li>Southeast Asia Adventures</li>
                  <li>European Wanderings</li>
                  <li>Digital Nomad Guides</li>
                  <li>Photography Tips</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="font-medium text-dark mb-2">Recent Updates</h3>
                <ul className="space-y-1 text-sm text-dark/70">
                  <li>Latest Blog Posts</li>
                  <li>New Photo Collections</li>
                  <li>Travel Resources</li>
                  <li>About the Journey</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-dark/10">
            <p className="text-dark/50 text-sm">
              Still can&apos;t find what you&apos;re looking for? The page might have moved or the URL might be outdated.
            </p>
            <p className="text-dark/50 text-sm mt-2">
              <Link href="/contact" className="underline hover:text-dark transition-colors">
                Let me know
              </Link> if you think this is a mistake!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}