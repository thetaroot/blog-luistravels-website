export default function BlogPostLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-dark/10 rounded w-12"></div>
          <span className="text-dark/30">/</span>
          <div className="h-4 bg-dark/10 rounded w-16"></div>
          <span className="text-dark/30">/</span>
          <div className="h-4 bg-dark/10 rounded w-24"></div>
        </div>
      </nav>

      {/* Header Skeleton */}
      <header className="mb-8">
        {/* Title */}
        <div className="space-y-3 mb-4">
          <div className="h-8 bg-dark/10 rounded w-3/4"></div>
          <div className="h-8 bg-dark/10 rounded w-1/2"></div>
        </div>
        
        {/* Meta information */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="h-4 bg-dark/10 rounded w-24"></div>
          <div className="h-4 bg-dark/10 rounded w-20"></div>
          <div className="h-4 bg-dark/10 rounded w-16"></div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          <div className="h-6 bg-dark/10 rounded-lg w-16"></div>
          <div className="h-6 bg-dark/10 rounded-lg w-20"></div>
          <div className="h-6 bg-dark/10 rounded-lg w-14"></div>
        </div>
      </header>

      {/* Featured Image Skeleton */}
      <div className="mb-8">
        <div className="w-full h-64 md:h-96 bg-dark/10 rounded-lg"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-dark/10 rounded w-full"></div>
            <div className="h-4 bg-dark/10 rounded w-5/6"></div>
            <div className="h-4 bg-dark/10 rounded w-4/5"></div>
          </div>
        ))}
      </div>
    </div>
  )
}