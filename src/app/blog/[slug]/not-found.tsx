import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Post Not Found | Luis Travels',
  description: 'The blog post you are looking for could not be found. Explore other travel stories and adventures.',
  robots: {
    index: false,
    follow: true,
  }
}

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* 404 Icon */}
        <div className="text-8xl mb-8">🗺️</div>
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-dark mb-4">
          Blog Post Not Found
        </h1>
        
        {/* Description */}
        <p className="text-lg text-dark/70 mb-8 leading-relaxed">
          Looks like this travel story has wandered off the beaten path! 
          The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-dark text-warm-white rounded-lg hover:bg-dark/90 transition-colors font-medium"
          >
            View All Blog Posts
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border-2 border-dark text-dark rounded-lg hover:bg-dark hover:text-warm-white transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
        
        {/* Popular Posts Suggestion */}
        <div className="mt-12 pt-8 border-t border-dark/10">
          <p className="text-dark/60 mb-4">
            Or explore some popular travel stories:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/blog" 
              className="px-3 py-1 bg-dark/10 text-dark text-sm rounded-lg hover:bg-dark/20 transition-colors"
            >
              Latest Adventures
            </Link>
            <Link 
              href="/gallery" 
              className="px-3 py-1 bg-dark/10 text-dark text-sm rounded-lg hover:bg-dark/20 transition-colors"
            >
              Photo Gallery
            </Link>
            <Link 
              href="/contact" 
              className="px-3 py-1 bg-dark/10 text-dark text-sm rounded-lg hover:bg-dark/20 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}