'use client'

/**
 * 🎯 BREADCRUMB-DOMINANCE-2025: Enterprise Breadcrumb Navigation System
 * GOOGLE'S #1 SEO ARCHITECT - PERFECT BREADCRUMB SEO & ACCESSIBILITY
 * 
 * Features:
 * ✅ Complete Schema.org BreadcrumbList markup (JSON-LD + Microdata)
 * ✅ WCAG 2.1 AA accessibility compliance
 * ✅ Rich snippets optimization for search results
 * ✅ Dynamic breadcrumb generation
 * ✅ Mobile-first responsive design
 * ✅ Keyboard navigation support
 * ✅ Screen reader optimization
 * ✅ SEO-friendly URL structure
 */

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { SITE_CONFIG } from '@/lib/constants'

export interface BreadcrumbItem {
  name: string
  href?: string
  position: number
  isCurrentPage?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: 'chevron' | 'slash' | 'arrow'
  variant?: 'default' | 'compact' | 'rich'
  maxItems?: number
  autoGenerate?: boolean
}

/**
 * Enterprise Breadcrumb Navigation Component
 */
export function Breadcrumbs({ 
  items,
  className = '',
  showHome = true,
  separator = 'slash',
  variant = 'default',
  maxItems = 5,
  autoGenerate = false
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs automatically if not provided and autoGenerate is true
  const breadcrumbItems = items || (autoGenerate ? generateBreadcrumbsFromPath(pathname, showHome) : [])
  
  // Limit items if maxItems is set
  const displayItems = maxItems && breadcrumbItems.length > maxItems
    ? [
        breadcrumbItems[0], // Always show home
        { name: '...', position: -1 }, // Ellipsis
        ...breadcrumbItems.slice(-2) // Show last 2 items
      ]
    : breadcrumbItems
  
  // Generate structured data for breadcrumbs
  const structuredData = generateBreadcrumbSchema(breadcrumbItems.filter(item => item.position > 0))
  
  if (breadcrumbItems.length <= 1 && !showHome) {
    return null // Don't show breadcrumbs if only one item and not showing home
  }

  return (
    <>
      {/* JSON-LD Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
      
      {/* Enterprise Breadcrumb Navigation */}
      <nav 
        className={`breadcrumb-navigation ${variant}-breadcrumbs mb-6 ${className}`}
        role="navigation"
        aria-label="Breadcrumb navigation"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className={getBreadcrumbListStyles(variant)}>
          {displayItems.map((item, index) => (
            <BreadcrumbItem
              key={`${item.position}-${item.name}`}
              item={item}
              index={index}
              isLast={index === displayItems.length - 1}
              separator={separator}
              variant={variant}
            />
          ))}
        </ol>
      </nav>
    </>
  )
}

/**
 * Individual Breadcrumb Item Component
 */
interface BreadcrumbItemProps {
  item: BreadcrumbItem
  index: number
  isLast: boolean
  separator: 'chevron' | 'slash' | 'arrow'
  variant: string
}

function BreadcrumbItem({ item, index, isLast, separator, variant }: BreadcrumbItemProps) {
  const isEllipsis = item.position === -1
  const isCurrentPage = isLast && !item.href
  
  return (
    <li
      className={getBreadcrumbItemStyles(variant, isCurrentPage)}
      itemProp={isEllipsis ? undefined : "itemListElement"}
      itemScope={isEllipsis ? undefined : true}
      itemType={isEllipsis ? undefined : "https://schema.org/ListItem"}
    >
      {isEllipsis ? (
        // Ellipsis for truncated breadcrumbs
        <span 
          className="breadcrumb-ellipsis text-gray-500"
          aria-label="More breadcrumb levels"
        >
          ...
        </span>
      ) : item.href && !isCurrentPage ? (
        // Linked breadcrumb item
        <Link
          href={item.href}
          itemProp="item"
          className={getBreadcrumbLinkStyles(variant)}
          aria-label={`Go to ${item.name}`}
        >
          {index === 0 && item.name === 'Home' ? (
            <span className="flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
              <span itemProp="name" className={variant === 'compact' ? 'sr-only' : ''}>
                {item.name}
              </span>
            </span>
          ) : (
            <span itemProp="name">{item.name}</span>
          )}
        </Link>
      ) : (
        // Current page breadcrumb item (no link)
        <span 
          itemProp="name"
          className={getCurrentPageStyles(variant)}
          aria-current="page"
        >
          {item.name}
        </span>
      )}
      
      {/* Hidden metadata for SEO */}
      {!isEllipsis && (
        <meta itemProp="position" content={item.position.toString()} />
      )}
      
      {/* Separator */}
      {!isLast && !isEllipsis && (
        <span 
          className="breadcrumb-separator mx-2 text-gray-400"
          aria-hidden="true"
        >
          {getSeparatorIcon(separator)}
        </span>
      )}
    </li>
  )
}

/**
 * Generate breadcrumbs automatically from pathname
 */
function generateBreadcrumbsFromPath(pathname: string, showHome: boolean): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Add home if requested
  if (showHome) {
    breadcrumbs.push({
      name: 'Home',
      href: '/',
      position: 1
    })
  }
  
  // Generate breadcrumbs from path segments
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Format segment name
    const name = formatSegmentName(segment, currentPath)
    
    breadcrumbs.push({
      name,
      href: isLast ? undefined : currentPath, // No href for current page
      position: breadcrumbs.length + 1,
      isCurrentPage: isLast
    })
  })
  
  return breadcrumbs
}

/**
 * Format URL segment into readable breadcrumb name
 */
function formatSegmentName(segment: string, fullPath: string): string {
  // Special cases for common routes
  const specialCases: { [key: string]: string } = {
    'blog': 'Blog',
    'gallery': 'Gallery', 
    'contact': 'Contact',
    'about': 'About'
  }
  
  if (specialCases[segment]) {
    return specialCases[segment]
  }
  
  // For blog posts, try to get a better title
  if (fullPath.includes('/blog/') && segment !== 'blog') {
    // This would ideally fetch the actual post title
    // For now, format the slug
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // Default formatting: capitalize and replace hyphens
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Get separator icon based on type
 */
function getSeparatorIcon(separator: 'chevron' | 'slash' | 'arrow'): React.ReactNode {
  switch (separator) {
    case 'chevron':
      return <ChevronRightIcon className="w-4 h-4" />
    case 'slash':
      return '/'
    case 'arrow':
      return '→'
    default:
      return '/'
  }
}

/**
 * Styling functions for different variants
 */
function getBreadcrumbListStyles(variant: string): string {
  const baseStyles = 'flex items-center flex-wrap gap-1'
  
  switch (variant) {
    case 'compact':
      return `${baseStyles} text-xs text-gray-600`
    case 'rich':
      return `${baseStyles} text-sm bg-gray-50 rounded-lg px-4 py-2 border text-gray-700`
    default:
      return `${baseStyles} text-sm text-gray-600`
  }
}

function getBreadcrumbItemStyles(variant: string, isCurrentPage: boolean): string {
  const baseStyles = 'flex items-center'
  
  if (isCurrentPage) {
    return `${baseStyles} text-gray-900 font-medium`
  }
  
  switch (variant) {
    case 'compact':
      return `${baseStyles} text-gray-500`
    case 'rich':
      return `${baseStyles} text-gray-700`
    default:
      return baseStyles
  }
}

function getBreadcrumbLinkStyles(variant: string): string {
  const baseStyles = 'hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-colors duration-200'
  
  switch (variant) {
    case 'compact':
      return `${baseStyles} text-blue-600 hover:text-blue-800`
    case 'rich':
      return `${baseStyles} text-blue-700 hover:text-blue-900 px-1 py-0.5 hover:bg-blue-50 rounded`
    default:
      return `${baseStyles} text-blue-600 hover:text-blue-800`
  }
}

function getCurrentPageStyles(variant: string): string {
  switch (variant) {
    case 'compact':
      return 'text-gray-900 font-medium text-xs'
    case 'rich':
      return 'text-gray-900 font-semibold'
    default:
      return 'text-gray-900 font-medium'
  }
}

/**
 * Breadcrumb Hook for dynamic breadcrumb management
 */
export function useBreadcrumbs(customItems?: BreadcrumbItem[]) {
  const pathname = usePathname()
  
  const breadcrumbs = React.useMemo(() => {
    if (customItems) {
      return customItems
    }
    
    return generateBreadcrumbsFromPath(pathname, true)
  }, [pathname, customItems])
  
  return {
    breadcrumbs,
    pathname,
    addBreadcrumb: (item: Omit<BreadcrumbItem, 'position'>) => {
      return [...breadcrumbs, { ...item, position: breadcrumbs.length + 1 }]
    }
  }
}

/**
 * Page-specific breadcrumb components
 */

// Blog Post Breadcrumbs
interface BlogBreadcrumbsProps {
  postTitle: string
  postSlug: string
  category?: string
  className?: string
}

export function BlogBreadcrumbs({ postTitle, postSlug, category, className }: BlogBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { name: 'Home', href: '/', position: 1 },
    { name: 'Blog', href: '/blog', position: 2 }
  ]
  
  if (category) {
    items.push({
      name: category,
      href: `/blog?category=${category.toLowerCase()}`,
      position: 3
    })
  }
  
  items.push({
    name: postTitle,
    position: items.length + 1,
    isCurrentPage: true
  })
  
  return (
    <Breadcrumbs
      items={items}
      className={className}
      variant="rich"
    />
  )
}

// Gallery Breadcrumbs
interface GalleryBreadcrumbsProps {
  albumTitle?: string
  imageTitle?: string
  className?: string
}

export function GalleryBreadcrumbs({ albumTitle, imageTitle, className }: GalleryBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { name: 'Home', href: '/', position: 1 },
    { name: 'Gallery', href: '/gallery', position: 2 }
  ]
  
  if (albumTitle) {
    items.push({
      name: albumTitle,
      href: imageTitle ? `/gallery/${albumTitle.toLowerCase().replace(/\s+/g, '-')}` : undefined,
      position: 3,
      isCurrentPage: !imageTitle
    })
  }
  
  if (imageTitle) {
    items.push({
      name: imageTitle,
      position: 4,
      isCurrentPage: true
    })
  }
  
  return (
    <Breadcrumbs
      items={items}
      className={className}
      variant="rich"
    />
  )
}

/**
 * Dynamic Breadcrumbs - Auto-generates breadcrumbs from current path
 */
export function DynamicBreadcrumbs(props: Omit<BreadcrumbsProps, 'autoGenerate'>) {
  return <Breadcrumbs {...props} autoGenerate={true} />
}

export default Breadcrumbs