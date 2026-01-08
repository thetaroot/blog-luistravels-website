/**
 * 🎯 SEO ADMIN DASHBOARD PAGE
 * 10/10 SEO Management Interface
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import SEODashboard from '@/components/seo/SEODashboard'

export const metadata: Metadata = {
  title: 'SEO Dashboard | Here There & Gone',
  description: 'Advanced SEO monitoring and optimization dashboard',
  robots: {
    index: false,
    follow: false
  }
}

export default function SEOAdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<DashboardSkeleton />}>
        <SEODashboard />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}