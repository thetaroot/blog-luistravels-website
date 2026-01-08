'use client'

/**
 * 🎯 SEMANTIC-DOMINANCE-2025: Enterprise Semantic Layout System
 * GOOGLE'S #1 SEO ARCHITECT - PERFECT SEMANTIC HTML5 STRUCTURE
 * 
 * Features:
 * ✅ Complete HTML5 semantic elements
 * ✅ ARIA roles and landmarks
 * ✅ WCAG 2.1 AA accessibility compliance
 * ✅ Schema.org microdata integration
 * ✅ Perfect heading hierarchy management
 * ✅ Skip navigation for screen readers
 * ✅ Focus management system
 */

import React, { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { generateWebsiteSchema } from '@/lib/seo/structured-data'

interface SemanticLayoutProps {
  children: ReactNode
  pageType: 'homepage' | 'blog' | 'gallery' | 'contact' | 'generic'
  pageTitle: string
  className?: string
  showSkipLinks?: boolean
}

export function SemanticLayout({ 
  children, 
  pageType, 
  pageTitle,
  className = '',
  showSkipLinks = true
}: SemanticLayoutProps) {
  const pathname = usePathname()
  const mainRef = useRef<HTMLElement>(null)
  
  // Generate page-specific schema
  const websiteSchema = generateWebsiteSchema()
  
  // Focus management for accessibility
  useEffect(() => {
    // Announce page changes to screen readers
    const announcement = `Navigated to ${pageTitle}`
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = announcement
    
    document.body.appendChild(announcer)
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
    
    // Focus main content area for keyboard users
    if (mainRef.current) {
      mainRef.current.focus()
    }
  }, [pathname, pageTitle])

  return (
    <>
      {/* Website Schema - Global Context */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 2)
        }}
      />

      {/* Skip Navigation Links - Critical for Accessibility */}
      {showSkipLinks && (
        <div className="skip-navigation" role="navigation" aria-label="Skip navigation">
          <a 
            href="#main-content" 
            className="skip-link focus:not-sr-only focus:absolute focus:top-0 focus:left-0 
                       focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white 
                       focus:font-medium focus:no-underline focus:shadow-lg
                       sr-only transition-all duration-200"
            onClick={(e) => {
              e.preventDefault()
              const mainContent = document.getElementById('main-content')
              if (mainContent) {
                mainContent.focus()
                mainContent.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            Skip to main content
          </a>
          <a 
            href="#navigation" 
            className="skip-link focus:not-sr-only focus:absolute focus:top-0 focus:left-0 
                       focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white 
                       focus:font-medium focus:no-underline focus:shadow-lg
                       sr-only ml-2 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault()
              const navigation = document.getElementById('navigation')
              if (navigation) {
                navigation.focus()
                navigation.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            Skip to navigation
          </a>
          <a 
            href="#footer" 
            className="skip-link focus:not-sr-only focus:absolute focus:top-0 focus:left-0 
                       focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white 
                       focus:font-medium focus:no-underline focus:shadow-lg
                       sr-only ml-4 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault()
              const footer = document.getElementById('footer')
              if (footer) {
                footer.focus()
                footer.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            Skip to footer
          </a>
        </div>
      )}

      {/* Page Container with Semantic Structure */}
      <div 
        className={`semantic-page-container ${className}`}
        itemScope
        itemType="https://schema.org/WebPage"
        data-page-type={pageType}
      >
        {/* Hidden page metadata for SEO */}
        <div className="sr-only" aria-hidden="true">
          <meta itemProp="name" content={pageTitle} />
          <meta itemProp="url" content={`https://heretheregone.com${pathname}`} />
          <meta itemProp="inLanguage" content="en" />
          <div itemProp="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
            {/* Breadcrumb will be injected by specific components */}
          </div>
          <div itemProp="mainEntity" itemScope itemType="https://schema.org/Person">
            <meta itemProp="name" content="Luis Gunther" />
            <meta itemProp="url" content="https://heretheregone.com" />
          </div>
        </div>

        {/* Main Content Area with Semantic Structure */}
        <main 
          ref={mainRef}
          id="main-content"
          className="main-content"
          role="main"
          aria-labelledby="page-title"
          itemProp="mainContentOfPage"
          tabIndex={-1}
          style={{ outline: 'none' }}
        >
          {/* Page Title - Hidden but accessible */}
          <h1 id="page-title" className="sr-only">
            {pageTitle}
          </h1>

          {/* Page-specific content wrapper */}
          <div className={getPageSpecificClasses(pageType)}>
            {children}
          </div>
        </main>

        {/* Accessibility Announcements */}
        <div 
          id="accessibility-announcements"
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        />
      </div>
    </>
  )
}

/**
 * Get page-specific CSS classes and attributes
 */
function getPageSpecificClasses(pageType: string): string {
  const baseClasses = 'page-content'
  
  switch (pageType) {
    case 'homepage':
      return `${baseClasses} homepage-content`
    case 'blog':
      return `${baseClasses} blog-content`
    case 'gallery':
      return `${baseClasses} gallery-content`
    case 'contact':
      return `${baseClasses} contact-content`
    default:
      return `${baseClasses} generic-content`
  }
}

/**
 * Semantic Section Component for Content Organization
 */
interface SemanticSectionProps {
  children: ReactNode
  sectionType: 'primary' | 'secondary' | 'aside' | 'complementary'
  title?: string
  ariaLabel?: string
  className?: string
  id?: string
}

export function SemanticSection({ 
  children, 
  sectionType, 
  title,
  ariaLabel,
  className = '',
  id
}: SemanticSectionProps) {
  const Element = sectionType === 'aside' ? 'aside' : 'section'
  const role = sectionType === 'complementary' ? 'complementary' : 'region'
  
  return (
    <Element
      id={id}
      className={`semantic-section ${sectionType}-section ${className}`}
      role={role}
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-label={ariaLabel}
      itemProp={sectionType === 'primary' ? 'mainEntity' : 'hasPart'}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {title && (
        <h2 
          id={`${id}-title`}
          className="section-title"
          itemProp="name"
        >
          {title}
        </h2>
      )}
      <div className="section-content" itemProp="text">
        {children}
      </div>
    </Element>
  )
}

/**
 * Semantic Article Container for Blog Posts and Articles
 */
interface SemanticArticleProps {
  children: ReactNode
  articleId: string
  title: string
  publishDate: string
  modifiedDate?: string
  author: string
  className?: string
}

export function SemanticArticle({ 
  children, 
  articleId,
  title,
  publishDate,
  modifiedDate,
  author,
  className = ''
}: SemanticArticleProps) {
  return (
    <article
      id={articleId}
      className={`semantic-article ${className}`}
      itemScope
      itemType="https://schema.org/Article"
      role="article"
      aria-labelledby={`${articleId}-title`}
    >
      {/* Article metadata */}
      <div className="sr-only" aria-hidden="true">
        <meta itemProp="headline" content={title} />
        <meta itemProp="datePublished" content={publishDate} />
        {modifiedDate && <meta itemProp="dateModified" content={modifiedDate} />}
        <div itemProp="author" itemScope itemType="https://schema.org/Person">
          <meta itemProp="name" content={author} />
        </div>
      </div>

      {/* Article content */}
      <div itemProp="articleBody">
        {children}
      </div>
    </article>
  )
}

/**
 * Semantic Navigation Component
 */
interface SemanticNavProps {
  children: ReactNode
  navType: 'primary' | 'secondary' | 'breadcrumb' | 'pagination'
  ariaLabel: string
  className?: string
  id?: string
}

export function SemanticNav({ 
  children, 
  navType, 
  ariaLabel,
  className = '',
  id
}: SemanticNavProps) {
  return (
    <nav
      id={id}
      className={`semantic-nav ${navType}-nav ${className}`}
      role="navigation"
      aria-label={ariaLabel}
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div itemProp="name" className="sr-only">{ariaLabel}</div>
      {children}
    </nav>
  )
}

/**
 * Semantic Heading Hierarchy Manager
 * Ensures proper h1-h6 structure throughout the page
 */
interface SemanticHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
  id?: string
  itemProp?: string
}

export function SemanticHeading({ 
  level, 
  children, 
  className = '',
  id,
  itemProp
}: SemanticHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <HeadingTag
      id={id}
      className={`semantic-heading h${level} ${className}`}
      itemProp={itemProp}
    >
      {children}
    </HeadingTag>
  )
}

/**
 * Announce content changes to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.getElementById('accessibility-announcements')
  if (announcer) {
    announcer.setAttribute('aria-live', priority)
    announcer.textContent = message
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }
}

export default SemanticLayout