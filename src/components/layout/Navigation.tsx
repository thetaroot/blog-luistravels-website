'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigation } from '@/contexts/NavigationContext'
import { useOptimizedEventHandler, useThrottle, useBatchedUpdates } from '@/lib/performance/react-optimizations'
import Portal from '@/components/ui/Portal'

export default function Navigation() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [pillDimensions, setPillDimensions] = useState({ width: 0, left: 0 })
  const { language, setLanguage } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  
  // Performance optimizations
  const batchUpdate = useBatchedUpdates()

  const navItems = useMemo(() => [
    { 
      href: '/', 
      label: language === 'en' ? 'Home' : 'Start', 
      id: 'home' 
    },
    { 
      href: '/blog', 
      label: 'Blog', 
      id: 'blog' 
    },
    { 
      href: '/gallery', 
      label: language === 'en' ? 'Gallery' : 'Galerie', 
      id: 'gallery' 
    },
    { 
      href: '/contact', 
      label: language === 'en' ? 'Contact' : 'Kontakt', 
      id: 'contact' 
    }
  ], [language])

  const isActive = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }, [pathname])

  const getActiveItem = useCallback(() => {
    return navItems.find(item => isActive(item.href)) || navItems[0]
  }, [navItems, isActive])

  const updatePillPosition = useCallback((targetItem: string | null = null) => {
    const activeItem = targetItem || getActiveItem().id
    const targetElement = itemRefs.current[activeItem]
    const containerElement = navRef.current

    if (targetElement && containerElement) {
      // Batch DOM reads and writes to prevent layout thrashing
      batchUpdate(() => {
        const containerRect = containerElement.getBoundingClientRect()
        const targetRect = targetElement.getBoundingClientRect()
        
        // Calculate position accounting for container padding
        const containerPaddingLeft = 6 // from style padding: '4px 6px'
        const relativeLeft = targetRect.left - containerRect.left - containerPaddingLeft
        
        setPillDimensions({
          width: targetRect.width,
          left: relativeLeft
        })
      })
    }
  }, [getActiveItem, batchUpdate])

  useEffect(() => {
    updatePillPosition()
  }, [pathname, updatePillPosition])

  useEffect(() => {
    // Update pill position when language changes (text width changes)
    const timer = setTimeout(() => updatePillPosition(), 50) // Small delay for text render
    return () => clearTimeout(timer)
  }, [language, updatePillPosition])

  // Optimized resize handler with throttling
  const handleResize = useCallback(() => updatePillPosition(), [updatePillPosition])
  const throttledResize = useThrottle(handleResize, 16) // ~60fps

  useEffect(() => {
    window.addEventListener('resize', throttledResize, { passive: true })
    return () => window.removeEventListener('resize', throttledResize)
  }, [throttledResize])

  // Optimized scroll handler with throttling and batched updates
  const handleScroll = useCallback(() => {
    // Don't handle scroll events on homepage (where Hero section exists) or when mobile menu is open
    if (pathname === '/' || isMobileMenuOpen) return
    
    const currentScrollY = window.scrollY
    const scrollDelta = currentScrollY - lastScrollY
    
    // Threshold to prevent too sensitive reactions
    const threshold = 10
    
    if (Math.abs(scrollDelta) < threshold) return
    
    batchUpdate(() => {
      // Show when scrolling up or at the top
      if (scrollDelta < 0 || currentScrollY < 100) {
        setIsVisible(true)
      } 
      // Hide when scrolling down and past threshold
      else if (scrollDelta > 0 && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    })
  }, [lastScrollY, pathname, isMobileMenuOpen, batchUpdate])

  const throttledScroll = useThrottle(handleScroll, 16) // ~60fps

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [throttledScroll])

  // Check if we're on mobile - optimized with throttling
  const [isMobile, setIsMobile] = useState(false)
  
  const handleMobileCheck = useCallback(() => {
    batchUpdate(() => {
      setIsMobile(window.innerWidth < 768)
    })
  }, [batchUpdate])
  
  const throttledMobileCheck = useThrottle(handleMobileCheck, 100)
  
  useEffect(() => {
    handleMobileCheck() // Initial check
    window.addEventListener('resize', throttledMobileCheck, { passive: true })
    return () => window.removeEventListener('resize', throttledMobileCheck)
  }, [handleMobileCheck, throttledMobileCheck])

  // Block scrolling when mobile menu is open - optimized
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY
      
      // Batch DOM style updates
      batchUpdate(() => {
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
      })
      
      return () => {
        // Restore scrolling with batched updates
        batchUpdate(() => {
          document.body.style.position = ''
          document.body.style.top = ''
          document.body.style.width = ''
          window.scrollTo(0, scrollY)
        })
      }
    }
  }, [isMobileMenuOpen, batchUpdate])

  // Optimized event handlers for interactions
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }, [isMobileMenuOpen])

  const handleLanguageChange = useCallback((lang: 'en' | 'de') => {
    setLanguage(lang)
  }, [setLanguage])

  const handleMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      {/* Fixed Navigation Header - Mobile at bottom, Desktop at top */}
      <motion.nav 
        className={`fixed md:top-0 bottom-0 md:bottom-auto left-0 right-0 z-50 bg-warm-white/95 backdrop-blur-md md:border-b border-t md:border-t-0 border-dark/5 md:rounded-none ${
          isMobileMenuOpen ? 'rounded-none' : 'rounded-t-3xl'
        }`}
        animate={{ 
          y: isVisible ? 0 : (isMobile ? 100 : -100),
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Apple Segmented Control - Desktop - Extended to Account */}
            <div className="hidden md:flex items-center justify-between flex-1 px-8">
              {/* Extended Inset Track Container */}
              <div 
                ref={navRef}
                className="relative bg-warm-white/50 rounded-full shadow-inner flex items-center justify-between w-full"
                style={{
                  boxShadow: 'inset 0 1px 3px rgba(20, 20, 19, 0.1), inset 0 1px 2px rgba(20, 20, 19, 0.06)',
                  padding: '4px 6px'
                }}
              >
                {/* Sliding Pill */}
                <motion.div
                  className="absolute bg-pure-white rounded-full"
                  style={{
                    top: '4px',
                    height: 'calc(100% - 8px)',
                    boxShadow: '0 1px 2px rgba(20, 20, 19, 0.05), 0 0 1px rgba(20, 20, 19, 0.05)'
                  }}
                  animate={{
                    width: pillDimensions.width,
                    x: pillDimensions.left
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />

                {/* Hover Pill */}
                <AnimatePresence>
                  {hoveredItem && hoveredItem !== getActiveItem().id && hoveredItem !== 'account' && (
                    <motion.div
                      className="absolute bg-pure-white/60 rounded-full"
                      style={{ 
                        top: '4px',
                        height: 'calc(100% - 8px)',
                        width: itemRefs.current[hoveredItem] ? 
                          itemRefs.current[hoveredItem]!.getBoundingClientRect().width : 0,
                        left: itemRefs.current[hoveredItem] && navRef.current ? 
                          itemRefs.current[hoveredItem]!.getBoundingClientRect().left - 
                          navRef.current.getBoundingClientRect().left - 6 : 0
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>

                {/* Left Navigation Items */}
                <div className="relative flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      ref={(el) => { itemRefs.current[item.id] = el }}
                      className="relative z-10 px-2 py-2 text-sm font-medium text-dark transition-colors hover:text-dark/90"
                      onMouseEnter={() => {
                        setHoveredItem(item.id)
                        updatePillPosition(item.id)
                      }}
                      onMouseLeave={() => {
                        setHoveredItem(null)
                        updatePillPosition()
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Centered Logo/Brand */}
                <Link 
                  href="/" 
                  className="absolute left-1/2 transform -translate-x-1/2 text-xl font-playfair font-semibold text-dark hover:opacity-80 transition-opacity z-20 tracking-tight"
                >
                  Luis Travels
                </Link>

                {/* Right Side - Language Only */}
                <div className="relative flex items-center pr-2">
                  {/* Language Switcher */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleLanguageChange('en')}
                      className={`text-sm font-medium transition-colors hover:text-dark/80 ${
                        language === 'en' ? 'text-dark' : 'text-dark/70'
                      }`}
                    >
                      Eng
                    </button>
                    <span className="text-dark/30">|</span>
                    <button 
                      onClick={() => handleLanguageChange('de')}
                      className={`text-sm font-medium transition-colors hover:text-dark/80 ${
                        language === 'de' ? 'text-dark' : 'text-dark/70'
                      }`}
                    >
                      De
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* Mobile Layout - Apple Style Inset Design */}
            <div className="md:hidden flex items-center justify-center w-full px-4">
              {/* Apple-style inset container */}
              <div 
                className="relative bg-warm-white/50 rounded-full flex items-center justify-between w-full max-w-sm"
                style={{
                  boxShadow: `
                    inset 0 1px 4px rgba(20, 20, 19, 0.15),
                    inset 0 2px 6px rgba(20, 20, 19, 0.1),
                    inset 0 4px 12px rgba(20, 20, 19, 0.08),
                    inset 0 1px 0 rgba(20, 20, 19, 0.05)
                  `,
                  padding: '6px 8px'
                }}
              >
                {/* Mobile menu button - Left */}
                <button
                  onClick={handleMobileMenuToggle}
                  className="relative z-10 p-2 text-dark hover:text-dark/80 transition-colors rounded-full hover:bg-pure-white/60"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                      {/* Top line - furthest right */}
                      <div className="h-0.5 bg-current rounded-full transition-all duration-300" style={{ width: '16px', marginLeft: '3px' }}></div>
                      {/* Middle line - middle position */}
                      <div className="h-0.5 bg-current rounded-full transition-all duration-300" style={{ width: '14px', marginLeft: '2px' }}></div>
                      {/* Bottom line - base position */}
                      <div className="h-0.5 bg-current rounded-full transition-all duration-300" style={{ width: '12px', marginLeft: '0px' }}></div>
                    </div>
                  )}
                </button>

                {/* Mobile Logo - Centered with inset styling */}
                <Link 
                  href="/" 
                  className="absolute left-1/2 transform -translate-x-1/2 text-lg font-playfair font-semibold text-dark hover:opacity-80 transition-opacity z-20 px-3 py-1 rounded-full hover:bg-pure-white/40 tracking-tight"
                >
                  Luis Travels
                </Link>

                {/* Right side - Empty space for symmetry but invisible */}
                <div className="w-9 h-9"></div>
              </div>
            </div>
          </div>
        </div>

      </motion.nav>
      
      {/* Spacer for fixed nav - Desktop only */}
      <div className="md:h-16 h-0" />
      
        {/* Mobile Navigation Dropdown - Integrated with Header */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop Blur - Only for content below dropdown */}
              <Portal>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.05 }}
                  className="fixed inset-0 z-[40]"
                  onClick={handleMenuClose}
                >
                  {/* Blur area above mobile bottom menu */}
                  <div 
                    className="absolute left-0 right-0 top-0"
                    style={{
                      bottom: '240px', // End above dropdown
                      background: `
                        linear-gradient(
                          to top,
                          rgba(20, 20, 19, 0.1) 0%,
                          rgba(20, 20, 19, 0.2) 20%,
                          rgba(20, 20, 19, 0.25) 40%,
                          rgba(20, 20, 19, 0.2) 60%,
                          rgba(20, 20, 19, 0.15) 80%,
                          rgba(20, 20, 19, 0.05) 100%
                        )
                      `,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)'
                    }}
                  />
                </motion.div>
              </Portal>
              
              {/* Dropdown Menu - Seamless Extension of Header - Mobile positioned above bottom header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  duration: 0.15
                }}
                className="md:hidden fixed bottom-16 left-0 right-0 z-50"
                style={{ 
                  marginBottom: '-16px' // Pull down to connect directly with header
                }}
              >
                <div 
                  className="bg-warm-white/95 backdrop-blur-md"
                  style={{
                    boxShadow: `
                      0 -4px 20px -4px rgba(20, 20, 19, 0.1),
                      0 -8px 40px -8px rgba(20, 20, 19, 0.05),
                      0 -12px 60px -12px rgba(20, 20, 19, 0.03)
                    `,
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px'
                  }}
                >
                  <div className="max-w-7xl mx-auto px-4 pt-2">
                    {/* Dropdown content with same style as header */}
                    <div 
                      className="bg-warm-white/50 rounded-2xl mx-4 mb-4 mt-6 p-3"
                      style={{
                        boxShadow: `
                          inset 0 1px 4px rgba(20, 20, 19, 0.15),
                          inset 0 2px 6px rgba(20, 20, 19, 0.1),
                          inset 0 4px 12px rgba(20, 20, 19, 0.08)
                        `
                      }}
                    >
                      <div className="space-y-1">
                        {/* Navigation Items */}
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleMenuClose}
                            className={`relative block px-4 py-3 text-base font-medium transition-all duration-200 rounded-xl ${
                              isActive(item.href) 
                                ? 'text-dark bg-pure-white shadow-sm' 
                                : 'text-dark/70 hover:text-dark hover:bg-pure-white/60 active:bg-pure-white/80'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                        
                        {/* Separator */}
                        <div className="border-t border-dark/10 my-2"></div>
                        
                        {/* Language Switcher - minimal nach unten gesetzt */}
                        <div className="flex space-x-1 mt-1">
                          <button 
                            onClick={() => handleLanguageChange('en')}
                            className={`flex-1 px-4 py-3 text-base font-medium transition-all duration-200 rounded-xl ${
                              language === 'en' 
                                ? 'text-dark bg-pure-white shadow-sm' 
                                : 'text-dark/70 hover:text-dark hover:bg-pure-white/60 active:bg-pure-white/80'
                            }`}
                          >
                            English
                          </button>
                          <button 
                            onClick={() => handleLanguageChange('de')}
                            className={`flex-1 px-4 py-3 text-base font-medium transition-all duration-200 rounded-xl ${
                              language === 'de' 
                                ? 'text-dark bg-pure-white shadow-sm' 
                                : 'text-dark/70 hover:text-dark hover:bg-pure-white/60 active:bg-pure-white/80'
                            }`}
                          >
                            Deutsch
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </>
  )
}