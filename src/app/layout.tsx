import type { Metadata } from 'next'
import { Inter, Playfair_Display, Crimson_Text } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { PerformanceProvider } from '@/components/performance/PerformanceProvider'
import { ImageOptimizationProvider } from '@/components/image/ImageOptimizationProvider'
import { BundleOptimizationProvider } from '@/components/optimization/BundleOptimizationProvider'
import { HeadingProvider } from '@/components/seo/HeadingHierarchy'
import { SITE_CONFIG } from '@/lib/constants'
import { generateHomepageSchema } from '@/lib/seo/structured-data'
import PerformanceInitializer from '@/components/performance/PerformanceInitializer'
import { entitySchemas } from '@/lib/seo/entity-optimization'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})
const crimson = Crimson_Text({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-crimson',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: 'Luis Travels - Digital Nomad Adventures & Travel Stories',
  description: SITE_CONFIG.description,
  keywords: 'luis travels, digital nomad, travel blog, travel stories, nomad lifestyle, world travel, adventure travel, travel photography',
  authors: [{ name: 'Luis Gunther', url: SITE_CONFIG.url }],
  creator: 'Luis Gunther',
  openGraph: {
    title: 'Luis Travels - Digital Nomad Adventures & Travel Stories',
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: 'Luis Travels',
    images: [
      {
        url: '/images/portrait.jpg',
        width: 800,
        height: 600,
        alt: 'Luis Gunther - Digital Nomad and Travel Storyteller',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luis Travels - Digital Nomad Adventures',
    description: SITE_CONFIG.description,
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: {
      url: '/images/logo.png',
      type: 'image/png',
      sizes: '32x32',
    },
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate homepage schema for global SEO context
  const homepageSchema = generateHomepageSchema()

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={SITE_CONFIG.url} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Global structured data for homepage and error pages */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homepageSchema, null, 2)
          }}
        />
        
        {/* 10/10 SEO Entity Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entitySchemas.person, null, 2)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entitySchemas.website, null, 2)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entitySchemas.organization, null, 2)
          }}
        />
      </head>
      <body className={`${inter.className} ${playfair.variable} ${crimson.variable} flex flex-col min-h-screen`}>
        <PerformanceInitializer />
        <BundleOptimizationProvider 
          enableAnalytics={true}
          enableDevelopmentTools={process.env.NODE_ENV === 'development'}
        >
          <PerformanceProvider 
            enableDevMode={process.env.NODE_ENV === 'development'}
            reportingInterval={30000}
          >
            <ImageOptimizationProvider 
              enablePerformanceTracking={true}
              initialConfig={{
                enableAVIF: true,
                enableWebP: true,
                enableResponsive: true,
                qualityAVIF: 80,
                qualityWebP: 85,
                qualityFallback: 90,
                cacheStrategy: 'aggressive'
              }}
            >
              <HeadingProvider initialLevel={1} validateHierarchy={process.env.NODE_ENV === 'development'}>
                <LanguageProvider>
                  <NavigationProvider>
                    <Navigation />
                    <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                      {children}
                    </main>
                    <Footer />
                  </NavigationProvider>
                </LanguageProvider>
              </HeadingProvider>
            </ImageOptimizationProvider>
          </PerformanceProvider>
        </BundleOptimizationProvider>
        {/* Portal container for overlays */}
        <div id="portal-root" />
        {/* Accessibility announcements */}
        <div 
          id="accessibility-announcements"
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        />
      </body>
    </html>
  )
}