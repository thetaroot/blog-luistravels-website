/**
 * Advanced Search Page - PHASE 5 SEO-PERFECTION-2025
 * Comprehensive search interface with entity recognition, topic clustering, and ML recommendations
 */

import AdvancedSearchInterface from '@/components/search/AdvancedSearchInterface'
import SearchAnalyticsDashboard from '@/components/search/SearchAnalytics'

export const metadata = {
  title: 'Advanced Search - Luis\' Travel Blog',
  description: 'Search through travel experiences, destinations, and cultural insights with our AI-powered search engine. Find content by location, activity, food, and more.',
  openGraph: {
    title: 'Advanced Search - Discover Travel Content',
    description: 'AI-powered search for travel experiences, destinations, and cultural insights',
    type: 'website'
  }
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Search through travel experiences, destinations, and cultural insights with our AI-powered search engine
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
              <span className="flex items-center gap-2">
                🧠 Entity Recognition
              </span>
              <span className="flex items-center gap-2">
                🎯 Topic Clustering
              </span>
              <span className="flex items-center gap-2">
                ⚡ ML Recommendations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Interface */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <AdvancedSearchInterface
          className="bg-white rounded-lg shadow-xl"
          placeholder="Search destinations, food, activities, culture, and more..."
          showFilters={true}
          showEntityHighlights={true}
          maxResults={20}
          onResultClick={(result) => {
            // Navigate to the blog post
            window.location.href = `/blog/${result.post.slug}`
          }}
        />
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our search engine uses cutting-edge technology to understand context, recognize entities, and provide personalized recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Entity Recognition */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              🧠
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Entity Recognition
            </h3>
            <p className="text-gray-600 mb-4">
              Automatically identifies places, foods, activities, and cultural elements in content for precise search results.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Geographic locations</li>
              <li>• Local cuisine & restaurants</li>
              <li>• Activities & attractions</li>
              <li>• Cultural experiences</li>
            </ul>
          </div>

          {/* Topic Clustering */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              🎯
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Intelligent Topic Clustering
            </h3>
            <p className="text-gray-600 mb-4">
              Groups related content automatically to help you discover comprehensive information on specific topics.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Geographic clustering</li>
              <li>• Activity-based groups</li>
              <li>• Cultural themes</li>
              <li>• Content type organization</li>
            </ul>
          </div>

          {/* ML Recommendations */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ML-Powered Recommendations
            </h3>
            <p className="text-gray-600 mb-4">
              Machine learning algorithms suggest related content based on your interests and reading patterns.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Personalized suggestions</li>
              <li>• Similar destination matching</li>
              <li>• Content similarity analysis</li>
              <li>• Trending topic recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Analytics */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <SearchAnalyticsDashboard className="mt-8" />
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your search journey and discover amazing travel experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Start Searching
            </button>
            <a 
              href="/blog"
              className="px-8 py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-semibold transition-colors"
            >
              Browse All Posts
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}