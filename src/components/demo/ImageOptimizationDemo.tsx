'use client'

/**
 * Image Optimization Demo Component
 * SEO-Dominance-2025 - Showcasing advanced WebP/AVIF optimization capabilities
 */

import { useState, useEffect } from 'react'
import { AdvancedImage, HeroImage, GalleryImage, ContentImage } from '@/components/image/AdvancedImage'
import { useImageOptimization, useOptimalImageFormat } from '@/components/image/ImageOptimizationProvider'

export function ImageOptimizationDemo() {
  const { formats, config, isInitialized } = useImageOptimization()
  const { optimalFormat, supportsAVIF, supportsWebP, getImageUrl } = useOptimalImageFormat()
  const [demoImages] = useState([
    '/images/demo/hero-sample.jpg',
    '/images/demo/gallery-sample.jpg',
    '/images/demo/content-sample.jpg'
  ])

  if (!isInitialized) {
    return (
      <div className="p-8 bg-warm-white rounded-lg border border-dark/10">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-dark/20 border-t-dark/60 rounded-full animate-spin" />
          <span className="text-dark/70">Initializing image optimization system...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* System Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-dark/5">
        <h3 className="text-xl font-semibold text-dark mb-4">🚀 Advanced Image Optimization Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-dark/5">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${supportsAVIF ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium text-dark">AVIF Support</span>
            </div>
            <p className="text-sm text-dark/70">
              {supportsAVIF ? 'Supported - 50% smaller files' : 'Not supported - fallback to WebP'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-dark/5">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${supportsWebP ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium text-dark">WebP Support</span>
            </div>
            <p className="text-sm text-dark/70">
              {supportsWebP ? 'Supported - 25-35% smaller files' : 'Not supported - fallback to JPEG'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-dark/5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium text-dark">Optimal Format</span>
            </div>
            <p className="text-sm text-dark/70 uppercase font-medium">
              {optimalFormat}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-dark/5 rounded-lg">
          <h4 className="font-medium text-dark mb-2">Configuration:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-dark/70">
            <div>AVIF Quality: <span className="font-medium">{config.qualityAVIF}%</span></div>
            <div>WebP Quality: <span className="font-medium">{config.qualityWebP}%</span></div>
            <div>JPEG Quality: <span className="font-medium">{config.qualityFallback}%</span></div>
            <div>Cache Strategy: <span className="font-medium">{config.cacheStrategy}</span></div>
          </div>
        </div>
      </div>

      {/* Hero Image Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark">🎯 Hero Image Optimization</h3>
        <div className="bg-white p-6 rounded-lg border border-dark/5">
          <p className="text-dark/70 mb-4">
            Hero images use priority loading, highest quality settings, and AVIF format for maximum impact.
          </p>
          
          <div className="aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
            <HeroImage
              src="/images/portrait.jpg"
              alt="Hero image optimization demo"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-4 text-sm text-dark/60">
            <code className="bg-dark/5 px-2 py-1 rounded">
              {getImageUrl('/images/portrait.jpg', { format: optimalFormat as any, quality: 95 })}
            </code>
          </div>
        </div>
      </div>

      {/* Gallery Image Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark">🖼️ Gallery Image Optimization</h3>
        <div className="bg-white p-6 rounded-lg border border-dark/5">
          <p className="text-dark/70 mb-4">
            Gallery images use lazy loading, shimmer placeholders, and responsive sizing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <GalleryImage
                  src="/images/portrait.jpg"
                  alt={`Gallery image ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Image Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark">📄 Content Image Optimization</h3>
        <div className="bg-white p-6 rounded-lg border border-dark/5">
          <p className="text-dark/70 mb-4">
            Content images use balanced quality settings and blur placeholders for smooth loading.
          </p>
          
          <div className="max-w-lg mx-auto">
            <ContentImage
              src="/images/portrait.jpg"
              alt="Content image optimization demo"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-dark/5">
        <h3 className="text-xl font-semibold text-dark mb-4">📊 Expected Performance Improvements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-dark">File Size Reduction:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark/70">AVIF vs JPEG:</span>
                <span className="font-medium text-green-600">-50% to -70%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/70">WebP vs JPEG:</span>
                <span className="font-medium text-green-600">-25% to -35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/70">Responsive variants:</span>
                <span className="font-medium text-green-600">-40% to -60%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-dark">Core Web Vitals Impact:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark/70">LCP Improvement:</span>
                <span className="font-medium text-blue-600">-20% to -40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/70">CLS Reduction:</span>
                <span className="font-medium text-blue-600">Blur placeholders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/70">INP Optimization:</span>
                <span className="font-medium text-blue-600">Lazy loading</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-dark/5">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="font-medium text-dark">SEO Impact</span>
          </div>
          <p className="text-sm text-dark/70">
            Faster loading images contribute to better Core Web Vitals scores, which are a 
            Google ranking factor. Expected SEO score improvement: <span className="font-medium text-green-600">+15-25%</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageOptimizationDemo