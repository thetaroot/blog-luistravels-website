/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'heretheregone.com',
      },
    ],
    // Advanced format support for SEO-Dominance-2025
    formats: ['image/avif', 'image/webp'], // AVIF first for maximum compression
    
    // Enterprise-level responsive breakpoints
    deviceSizes: [
      320,   // Mobile portrait
      480,   // Mobile landscape
      640,   // Small tablet portrait
      768,   // Tablet portrait
      1024,  // Tablet landscape / Small desktop
      1200,  // Desktop
      1440,  // Large desktop
      1600,  // Extra large desktop
      1920,  // Full HD
      2048,  // Retina desktop
      2560,  // 2K
      3840   // 4K
    ],
    
    // Optimized image sizes for various use cases
    imageSizes: [
      16,   // Icons
      32,   // Small icons
      48,   // Medium icons
      64,   // Large icons
      96,   // Avatar small
      128,  // Avatar medium
      160,  // Avatar large
      192,  // PWA icon
      256,  // Card thumbnail
      320,  // Mobile image
      384,  // Tablet image
      512,  // Desktop thumbnail
      640,  // Content image
      768,  // Hero mobile
      1024  // Hero desktop
    ],
    
    // Enhanced quality settings for different formats
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Minimums and limits for optimal performance
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization for static export
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  // Advanced Webpack optimizations for bundle splitting and performance
  webpack: (config, { isServer, dev }) => {
    // Add support for importing images as data URLs in development
    if (!isServer) {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Convert images < 8kb to data URLs
              fallback: 'file-loader',
              publicPath: '/_next/static/images/',
              outputPath: 'static/images/',
            },
          },
        ],
      })
    }

    // Enterprise-level bundle optimization for static export
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,      // Minimum chunk size (20KB)
          maxSize: 244000,     // Maximum chunk size (244KB)
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            // React and core libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              chunks: 'all',
              reuseExistingChunk: true,
            },
            
            // Animation libraries (heavy)
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion|@framer\/motion)[\\/]/,
              name: 'animations',
              priority: 15,
              chunks: 'async', // Only load when needed
              reuseExistingChunk: true,
            },
            
            // Vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'all',
              reuseExistingChunk: true,
              enforce: true,
            },
            
            // Common components used across pages
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              chunks: 'all',
              reuseExistingChunk: true,
            },
            
            // Large components that should be lazy loaded
            heavy: {
              test: /[\\/](GalleryLightbox|ImageOptimization|PerformanceMonitor)[\\/]/,
              name: 'heavy-components',
              priority: 8,
              chunks: 'async',
              reuseExistingChunk: true,
            }
          }
        },
        
        // Minimize bundle size
        usedExports: true,
        sideEffects: false,
        
        // Module concatenation for better tree shaking
        concatenateModules: true,
      }
      
      // Add bundle analyzer in development
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-analysis.html'
          })
        )
      }
    }
    
    return config
  },
  
  // Headers for image optimization (disabled for static export)
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*\\.(png|jpe?g|gif|svg|webp|avif|ico)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //       ],
  //     },
  //   ]
  // },
}

module.exports = nextConfig