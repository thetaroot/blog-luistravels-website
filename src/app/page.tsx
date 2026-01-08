'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigation } from '@/contexts/NavigationContext'
import Image from 'next/image'
import Link from 'next/link'
import { pageContent, animationSections } from '@/lib/pageContent'
import { BlogPost } from '@/lib/blog/types'

const SimpleWorldMap = dynamic(
  () => import('@/components/SimpleWorldMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-2xl">
        <div className="text-white/60">Loading world map...</div>
      </div>
    )
  }
)

// Hero Slide Component with Flashlight Effect
interface HeroSlideProps {
  title: { en: string; de: string }
  content?: string[]
  showExploreButton?: boolean
  onNavigateToCarousel: () => void
  language: 'en' | 'de'
}

function HeroSlide({ title, content, showExploreButton, onNavigateToCarousel, language }: HeroSlideProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [revealRadius, setRevealRadius] = useState(2000) // Start with large radius (full map visible)
  const [revealCenter, setRevealCenter] = useState({ x: 0, y: 0 })
  const [isRevealing, setIsRevealing] = useState(true)
  const [isMobileWandering, setIsMobileWandering] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect()
      const newMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      setMousePosition(newMousePos)
      
      // Update reveal center immediately when mouse moves after animation completes
      if (!isRevealing) {
        setRevealCenter(newMousePos)
      }
    }
  }, [isRevealing])

  // Map reveal animation effect
  useEffect(() => {
    if (!heroRef.current) return

    const rect = heroRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Set initial reveal center to screen center
    setRevealCenter({ x: centerX, y: centerY })
    
    // Determine final target position
    let finalCenterX, finalCenterY
    
    // Get current mouse position for initial targeting
    if (typeof window !== 'undefined' && (window as any).lastMouseEvent) {
      const mouseX = (window as any).lastMouseEvent.clientX - rect.left
      const mouseY = (window as any).lastMouseEvent.clientY - rect.top
      if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
        finalCenterX = mouseX
        finalCenterY = mouseY
      } else {
        // Default elegant position
        finalCenterX = centerX * 1.1
        finalCenterY = centerY * 0.9
      }
    } else {
      // Mobile or no mouse - use elegant center-right position
      finalCenterX = centerX * 1.1
      finalCenterY = centerY * 0.9
    }
    
    // Animation: Full map visible -> shrink to spotlight
    let startTime = Date.now()
    const duration = 2500 // 2.5 seconds
    const startRadius = 2000 // Full map visible
    const endRadius = 200 // Final spotlight size
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing for reveal effect
      const easeInOutQuart = (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
      const easedProgress = easeInOutQuart(progress)
      
      // Animate radius: large -> small
      const currentRadius = startRadius - (startRadius - endRadius) * easedProgress
      setRevealRadius(currentRadius)
      
      // Animate center position: screen center -> final position
      const currentCenterX = centerX + (finalCenterX - centerX) * easedProgress
      const currentCenterY = centerY + (finalCenterY - centerY) * easedProgress
      setRevealCenter({ x: currentCenterX, y: currentCenterY })
      
      if (progress < 1 && isRevealing) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete - set final position and enable mouse tracking
        setIsRevealing(false)
        setRevealRadius(endRadius)
        
        // Use current mouse position if available, otherwise final position
        if (mousePosition.x !== 0 || mousePosition.y !== 0) {
          setRevealCenter(mousePosition)
        } else {
          setRevealCenter({ x: finalCenterX, y: finalCenterY })
          
          // Start mobile wandering animation after initial reveal
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setTimeout(() => {
              setIsMobileWandering(true)
            }, 1000) // Start wandering 1 second after reveal completes
          }
        }
      }
    }
    
    if (isRevealing) {
      // Small delay for dramatic effect
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 300)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRevealing])

  // Mobile wandering animation
  useEffect(() => {
    if (!isMobileWandering || !heroRef.current) return

    const rect = heroRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Define interesting points on the map for the spotlight to visit
    const waypoints = [
      { x: centerX * 0.3, y: centerY * 0.4, duration: 2000 }, // Top-left (e.g., Europe)
      { x: centerX * 1.4, y: centerY * 0.6, duration: 2500 }, // Right (e.g., Asia)  
      { x: centerX * 0.8, y: centerY * 1.4, duration: 2000 }, // Bottom (e.g., Australia)
      { x: centerX * 0.6, y: centerY * 0.8, duration: 2500 }, // Center-left (e.g., Africa)
      { x: centerX * 1.2, y: centerY * 0.3, duration: 2000 }, // Top-right (e.g., Asia)
    ]

    let currentWaypointIndex = 0
    let startTime = Date.now()
    let startPosition = revealCenter

    const animateWandering = () => {
      const currentWaypoint = waypoints[currentWaypointIndex]
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / currentWaypoint.duration, 1)
      
      // Smooth easing
      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
      const easedProgress = easeInOutSine(progress)
      
      // Interpolate position
      const currentX = startPosition.x + (currentWaypoint.x - startPosition.x) * easedProgress
      const currentY = startPosition.y + (currentWaypoint.y - startPosition.y) * easedProgress
      
      setRevealCenter({ x: currentX, y: currentY })
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateWandering)
      } else {
        // Move to next waypoint
        currentWaypointIndex = (currentWaypointIndex + 1) % waypoints.length
        startTime = Date.now()
        startPosition = { x: currentX, y: currentY }
        animationRef.current = requestAnimationFrame(animateWandering)
      }
    }

    animationRef.current = requestAnimationFrame(animateWandering)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMobileWandering, revealCenter])

  // Global mouse tracking for initial position detection
  useEffect(() => {
    // Store global mouse position for initial animation
    const handleGlobalMouseMove = (e: MouseEvent) => {
      (window as any).lastMouseEvent = e
    }
    
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    // Stop mobile wandering on touch/click
    if (isMobileWandering) {
      setIsMobileWandering(false)
    }
    // Navigate to carousel unless clicking on blog button
    if (!target.closest('a[href="/blog"]') && !target.closest('button.blog-button')) {
      onNavigateToCarousel()
    }
  }, [onNavigateToCarousel, isMobileWandering])
  
  // Handle touch start to stop wandering
  const handleTouchStart = useCallback(() => {
    if (isMobileWandering) {
      setIsMobileWandering(false)
    }
  }, [isMobileWandering])

  return (
    <div 
      ref={heroRef}
      className="w-full h-full cursor-pointer overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      style={{
        background: '#1a1a1a'
      }}
    >
      {/* Hidden World Map Background */}
      <div className="absolute inset-0">
        <SimpleWorldMap />
      </div>
      
      {/* Flashlight Effect Overlay - Reveal animation from full map to spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: '#0a0a0a', // Darker background for more contrast
          mask: `radial-gradient(circle ${revealRadius}px at ${revealCenter.x}px ${revealCenter.y}px, transparent 0%, transparent 25%, rgba(0,0,0,0.8) 60%, black 100%)`,
          WebkitMask: `radial-gradient(circle ${revealRadius}px at ${revealCenter.x}px ${revealCenter.y}px, transparent 0%, transparent 25%, rgba(0,0,0,0.8) 60%, black 100%)`,
          transition: isRevealing ? 'none' : 'mask 0.1s ease-out, -webkit-mask 0.1s ease-out'
        }}
      />
      
      {/* Mobile: Desktop-like flashlight effect */}
      <div 
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background: '#0a0a0a', // Same darker background as desktop
          mask: `radial-gradient(circle ${revealRadius}px at ${revealCenter.x}px ${revealCenter.y}px, transparent 0%, transparent 25%, rgba(0,0,0,0.8) 60%, black 100%)`,
          WebkitMask: `radial-gradient(circle ${revealRadius}px at ${revealCenter.x}px ${revealCenter.y}px, transparent 0%, transparent 25%, rgba(0,0,0,0.8) 60%, black 100%)`,
          transition: isRevealing ? 'none' : 'mask 0.1s ease-out, -webkit-mask 0.1s ease-out'
        }}
      />
      
      {/* Hero Content */}
      <div className="hero-content absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-8 px-6 max-w-2xl">
          {/* Main Title */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {title[language]}
          </motion.h1>
          
          
          {/* Blog Button - Centered */}
          {showExploreButton && (
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Link href="/blog">
                <button className="blog-button px-8 py-3 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-dark transition-colors transform hover:scale-105 active:scale-95">
                  {language === 'en' ? 'Check it out' : 'Sieh es dir an'}
                </button>
              </Link>
            </motion.div>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { language } = useLanguage()
  const { isMobileMenuOpen } = useNavigation()
  
  // Always start at 0 to prevent hydration mismatch, then check sessionStorage in useEffect
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isProgressVisible, setIsProgressVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [previewDirection, setPreviewDirection] = useState<'left' | 'right' | null>(null)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [showNavHint, setShowNavHint] = useState(false)
  const [hasVisitedCarousel, setHasVisitedCarousel] = useState(false)
  const [hasLeftHero, setHasLeftHero] = useState(false)
  const [isClientMounted, setIsClientMounted] = useState(false)
  const [blogMorphState, setBlogMorphState] = useState(0) // 0: featured post, 1: two more posts, 2: all posts button
  const [showContactModal, setShowContactModal] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const currentSection = animationSections[currentSectionIndex]
  const totalDuration = animationSections.reduce((sum, section) => sum + section.duration, 0)
  
  // No need to calculate - flexbox handles it
  const contentHeight = "100%" // Fill available flex space
  
  const startProgressTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    progressIntervalRef.current = setInterval(() => {
      if (!isPaused && !showContactModal && !isMobileMenuOpen) {
        const elapsed = Date.now() - startTimeRef.current
        const sectionProgress = (elapsed / currentSection.duration) * 100
        setProgress(Math.min(sectionProgress, 100))
      }
    }, 50)
  }, [isPaused, showContactModal, isMobileMenuOpen, currentSection.duration])

  
  const stopProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }
  
  const goToNextSection = () => {
    let nextIndex = currentSectionIndex + 1
    
    // Mark that we've left hero when leaving it for the first time
    if (currentSectionIndex === 0 && animationSections[0].type === 'hero') {
      setHasLeftHero(true)
      // No sessionStorage - only in-memory state during current session
    }
    
    // Handle end of carousel - if we've left hero, skip it when wrapping around
    if (nextIndex >= animationSections.length) {
      if (hasLeftHero || (currentSectionIndex === 0 && animationSections[0].type === 'hero')) {
        // Skip hero (index 0) and go to index 1 (map)
        nextIndex = 1
      } else {
        nextIndex = 0 // First time through, allow going to hero
      }
    }
    
    // Skip hero section if we encounter it and have already left it
    if (hasLeftHero && nextIndex < animationSections.length && animationSections[nextIndex].type === 'hero') {
      nextIndex = nextIndex + 1 < animationSections.length ? nextIndex + 1 : 1
    }
    
    setCurrentSectionIndex(nextIndex)
    setProgress(0)
    setBlogMorphState(0) // Reset blog morph state when leaving blog slide
  }
  
  const goToPrevSection = () => {
    let prevIndex = currentSectionIndex === 0 ? animationSections.length - 1 : currentSectionIndex - 1
    
    // Skip hero section if we've already left it
    if (hasLeftHero && animationSections[prevIndex].type === 'hero') {
      // Go to the last non-hero section instead
      prevIndex = animationSections.length - 1
    }
    
    setCurrentSectionIndex(prevIndex)
    setProgress(0)
    setBlogMorphState(0) // Reset blog morph state when leaving blog slide
  }

  // Navigation with preview effect
  const handleNavigation = (direction: 'left' | 'right') => {
    setPreviewDirection(direction)
    setIsPreviewActive(true)
    
    // Brief preview effect
    setTimeout(() => {
      if (direction === 'right') {
        goToNextSection()
      } else {
        goToPrevSection()
      }
      setIsPreviewActive(false)
      setPreviewDirection(null)
    }, 150)
  }

  // Load blog posts
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await fetch(`/api/blog?language=${language}`)
        const data = await response.json()
        
        if (data.success) {
          setBlogPosts(data.posts)
        } else {
          console.error('API Error:', data.error)
          setBlogPosts([])
        }
      } catch (error) {
        console.error('Error loading blog posts:', error)
        setBlogPosts([])
      } finally {
        setLoadingBlogs(false)
      }
    }

    loadBlogPosts()
  }, [language])

  // Handle client-side mounting - no sessionStorage check
  useEffect(() => {
    setIsClientMounted(true)
    // Always start fresh with Hero on page load/refresh
  }, [])

  // Control body overflow when Hero is active - prevent scrolling
  useEffect(() => {
    if (currentSection.type === 'hero') {
      // Disable scrolling when Hero is active
      document.body.style.overflow = 'hidden'
      
      // Additional prevention of scroll events
      const preventScroll = (e: WheelEvent | TouchEvent) => {
        e.preventDefault()
      }
      
      // Prevent wheel scrolling
      document.addEventListener('wheel', preventScroll, { passive: false })
      // Prevent touch scrolling  
      document.addEventListener('touchmove', preventScroll, { passive: false })
      
      return () => {
        document.removeEventListener('wheel', preventScroll)
        document.removeEventListener('touchmove', preventScroll)
      }
    } else {
      // Re-enable scrolling when not on Hero
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [currentSection.type])

  // Show navigation areas briefly on page load
  useEffect(() => {
    if (!isClientMounted) return
    setTimeout(() => setShowNavHint(true), 800)
    setTimeout(() => setShowNavHint(false), 2500)
  }, [isClientMounted])

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevSection()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextSection()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Touch/Swipe Navigation
  useEffect(() => {
    let startX: number | null = null
    let startY: number | null = null

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = startX - endX
      const deltaY = startY - endY

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next section
          goToNextSection()
        } else {
          // Swipe right - previous section
          goToPrevSection()
        }
      }

      startX = null
      startY = null
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true })
      container.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [])

  // Hide/Show progress bar on scroll - EXACT COPY of nav bar logic
  useEffect(() => {
    const handleScroll = () => {
      // Don't handle scroll events when Hero is active
      if (currentSection.type === 'hero') return
      
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY
      
      // Threshold to prevent too sensitive reactions
      const threshold = 10
      
      if (Math.abs(scrollDelta) < threshold) return
      
      // Show when scrolling up or at the top
      if (scrollDelta < 0 || currentScrollY < 100) {
        setIsProgressVisible(true)
      } 
      // Hide when scrolling down and past threshold
      else if (scrollDelta > 0 && currentScrollY > 100) {
        setIsProgressVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, currentSection.type])
  
  useEffect(() => {
    if (!isPaused && !showContactModal && !isMobileMenuOpen && currentSection.type !== 'hero') {
      stopProgressTimer()
      startProgressTimer()
      
      timerRef.current = setTimeout(() => {
        goToNextSection()
      }, currentSection.duration)
    }
    
    // Show navigation hints on first carousel visit
    if (currentSection.type !== 'hero' && !hasVisitedCarousel) {
      setHasVisitedCarousel(true)
      setShowNavHint(true)
      setTimeout(() => setShowNavHint(false), 2500)
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      stopProgressTimer()
    }
  }, [currentSectionIndex, isPaused, showContactModal, isMobileMenuOpen, currentSection.duration, startProgressTimer, hasVisitedCarousel])
  
  const renderContent = () => {
    if (currentSection.type === 'worldmap') {
      return (
        <div className="w-full h-full rounded-2xl relative overflow-hidden" style={{ isolation: 'isolate' }}>
          <SimpleWorldMap />
        </div>
      )
    }

    if (currentSection.type === 'about') {
      // Check if this is the intro slide (has title)
      const isIntroSlide = 'title' in currentSection && currentSection.title
      
      if (isIntroSlide) {
        // Intro slide: Polaroid top, title left-centered
        return (
          <div className="h-full flex items-center justify-center">
            <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto">
              
              {/* Polaroid at top, centered */}
              {'showPolaroid' in currentSection && currentSection.showPolaroid && (
                <div className="flex justify-center mb-6">
                  <div className="relative image-container">
                    <div className="bg-white p-3 sm:p-4 shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300">
                      <Image 
                        src={'polaroidImage' in currentSection ? currentSection.polaroidImage : '/images/portrait.jpg'}
                        alt="Luis Portrait"
                        width={200}
                        height={200}
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        draggable={false}
                        style={{ 
                          WebkitUserSelect: 'none',
                          WebkitTouchCallout: 'none',
                          userSelect: 'none'
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Title - left-centered */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark text-left">
                {typeof (currentSection as any).title === 'string' 
                  ? (() => {
                      const content = pageContent[(currentSection as any).title as keyof typeof pageContent]
                      return typeof content === 'function' ? content() : content?.[language] || ''
                    })()
                  : (currentSection as any).title[language]
                }
              </h1>
              
              {/* Text content - left-aligned */}
              <div className="space-y-4 text-base sm:text-lg text-dark/80">
                {'content' in currentSection && currentSection.content?.map((key, idx) => (
                  <p key={idx} className="leading-relaxed text-left">
                    {(() => {
                      const content = pageContent[key as keyof typeof pageContent]
                      return typeof content === 'function' ? content() : content?.[language] || ''
                    })()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )
      } else {
        // Journey slide: Polaroid bottom, no title, centered text
        return (
          <div className="h-full flex items-center justify-center">
            <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto text-center">
              
              {/* Text content - mobile-first vertical flow */}
              <div className="space-y-4 text-base sm:text-lg text-dark/80 max-w-2xl mx-auto">
                {'content' in currentSection && currentSection.content?.map((key, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {(() => {
                      const content = pageContent[key as keyof typeof pageContent]
                      return typeof content === 'function' ? content() : content?.[language] || ''
                    })()}
                  </p>
                ))}
              </div>

              {/* Polaroid at bottom for journey slide */}
              {'showPolaroid' in currentSection && currentSection.showPolaroid && (
                <div className="flex justify-center mt-6">
                  <div className="relative image-container">
                    <div className="bg-white p-3 sm:p-4 shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300">
                      <Image 
                        src={'polaroidImage' in currentSection ? currentSection.polaroidImage : '/images/portrait.jpg'}
                        alt="Luis Portrait"
                        width={200}
                        height={200}
                        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        draggable={false}
                        style={{ 
                          WebkitUserSelect: 'none',
                          WebkitTouchCallout: 'none',
                          userSelect: 'none'
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }
    }


    if (currentSection.type === 'blog') {
      // Handle blog morph swipe
      const handleBlogSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left' && blogMorphState < 2) {
          setBlogMorphState(prev => prev + 1)
        } else if (direction === 'right' && blogMorphState > 0) {
          setBlogMorphState(prev => prev - 1)
        }
      }

      // Blog morph state 0: Featured post
      if (blogMorphState === 0) {
        return (
          <div 
            className="h-full flex flex-col justify-between p-4 sm:p-6"
            onTouchStart={(e) => {
              // Only enable swipe on mobile (when cards are stacked)
              if (window.innerWidth >= 1024) return // lg breakpoint
              
              const startX = e.touches[0].clientX
              const handleTouchEnd = (endEvent: TouchEvent) => {
                const endX = endEvent.changedTouches[0].clientX
                const deltaX = startX - endX
                if (Math.abs(deltaX) > 50) {
                  if (deltaX > 0) handleBlogSwipe('left')
                  else handleBlogSwipe('right')
                }
                document.removeEventListener('touchend', handleTouchEnd)
              }
              document.addEventListener('touchend', handleTouchEnd)
            }}
          >
            {/* Top section: Title and Description in same column */}
            <div className="mb-6 mt-4 text-center lg:text-left">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">
                {typeof (currentSection as any).title === 'string' 
                  ? (() => {
                      const content = pageContent[(currentSection as any).title as keyof typeof pageContent]
                      return typeof content === 'function' ? content() : content?.[language] || ''
                    })()
                  : (currentSection as any).title[language]
                }
              </h1>
              
              {/* Description - directly under title */}
              <div className="text-sm sm:text-base text-dark/80 max-w-2xl mx-auto lg:mx-0">
                {'content' in currentSection && currentSection.content?.map((key, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {(() => {
                      const content = pageContent[key as keyof typeof pageContent]
                      return typeof content === 'function' ? content() : content?.[language] || ''
                    })()}
                  </p>
                ))}
              </div>
            </div>

            {/* Center: Responsive Blog Cards */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-6xl">
                {/* Show loading or fallback if no posts */}
                {loadingBlogs ? (
                  <div className="text-center py-16 text-dark/60">
                    <div className="text-6xl mb-4">⏳</div>
                    <div className="text-lg">{language === 'de' ? 'Lade Blog Posts...' : 'Loading blog posts...'}</div>
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="text-center py-16 text-dark/60">
                    <div className="text-6xl mb-4">📝</div>
                    <div className="text-lg">{language === 'de' ? 'Erste Blog Posts kommen bald!' : 'First blog posts coming soon!'}</div>
                    <div className="text-sm mt-2">{language === 'de' ? 'Die nächsten Abenteuer werden gerade dokumentiert...' : 'The next adventures are being documented...'}</div>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Single card (latest post) */}
                    <div className="lg:hidden flex justify-center">
                      {blogPosts.slice(0, 1).map((post, idx) => (
                        <motion.a 
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="group block w-full max-w-md"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="bg-pure-white rounded-2xl p-6 shadow-xl border border-dark/10 group-hover:border-dark/20 transition-all duration-300">
                            {/* Featured Badge */}
                            <div className="inline-flex items-center px-3 py-1 bg-dark text-warm-white text-xs font-medium rounded-full mb-4">
                              {language === 'de' ? 'Neueste' : 'Latest'}
                            </div>
                            
                            {/* Post Date */}
                            <div className="text-sm text-dark/50 mb-3">
                              {new Date(post.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            
                            {/* Post Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-dark mb-4 group-hover:text-dark/80 transition-colors">
                              {post.title}
                            </h3>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-dark/10 text-dark text-xs rounded-lg">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Post Excerpt */}
                            <p className="text-dark/70 mb-4 leading-relaxed">
                              {post.excerpt}
                            </p>
                            
                            {/* Read More */}
                            <div className="text-dark font-semibold group-hover:text-dark/70 transition-colors flex items-center">
                              {language === 'de' ? 'Ganzen Artikel lesen' : 'Read full article'} 
                              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </>
                )}

                {/* Desktop: Multiple cards (lg: 2 cards, xl: 3 cards) */}
                {!loadingBlogs && blogPosts.length > 0 && (
                  <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blogPosts.slice(0, 3).map((post, idx) => (
                      <motion.a 
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="bg-pure-white rounded-2xl p-6 shadow-xl border border-dark/10 group-hover:border-dark/20 transition-all duration-300 h-full">
                          {/* Featured badge for first post */}
                          {idx === 0 && (
                            <div className="inline-flex items-center px-3 py-1 bg-dark text-warm-white text-xs font-medium rounded-full mb-4">
                              {language === 'de' ? 'Neueste' : 'Latest'}
                            </div>
                          )}
                          
                          <div className="text-sm text-dark/50 mb-3">
                            {new Date(post.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          
                          <h3 className="text-lg font-bold text-dark mb-3 group-hover:text-dark/80 transition-colors">
                            {post.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-dark/10 text-dark text-xs rounded-lg">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <p className="text-dark/70 mb-4 leading-relaxed text-sm">
                            {post.excerpt}
                          </p>
                          
                          <div className="text-dark font-semibold group-hover:text-dark/70 transition-colors flex items-center text-sm">
                            {language === 'de' ? 'Lesen' : 'Read'} 
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: CTA Button */}
            <div className="text-center mt-6">
              <a
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-dark text-warm-white rounded-xl hover:bg-dark/90 active:bg-dark transition-all duration-300 font-semibold active:scale-95 shadow-lg"
              >
                {language === 'de' ? 'Mehr Artikel entdecken' : 'Discover more articles'}
                <span className="ml-2">→</span>
              </a>
            </div>

          </div>
        )
      }

      // Blog morph state 1: Two more posts
      if (blogMorphState === 1) {
        return (
          <div 
            className="h-full flex flex-col justify-center p-4 sm:p-6"
            onTouchStart={(e) => {
              // Only enable swipe on mobile
              if (window.innerWidth >= 1024) return // lg breakpoint
              
              const startX = e.touches[0].clientX
              const handleTouchEnd = (endEvent: TouchEvent) => {
                const endX = endEvent.changedTouches[0].clientX
                const deltaX = startX - endX
                if (Math.abs(deltaX) > 50) {
                  if (deltaX > 0) handleBlogSwipe('left')
                  else handleBlogSwipe('right')
                }
                document.removeEventListener('touchend', handleTouchEnd)
              }
              document.addEventListener('touchend', handleTouchEnd)
            }}
          >

            {/* Two Blog Cards */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {Array(2).fill(0).map((_, idx) => (
                <motion.div 
                  key={idx} 
                  className="bg-warm-white rounded-2xl p-4 border border-dark/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="text-sm text-dark/50 mb-2">
                    {language === 'de' ? 'Bald verfügbar' : 'Coming soon'}
                  </div>
                  <h3 className="text-lg font-bold text-dark/70 mb-2">
                    {language === 'de' ? `Artikel ${idx + 2} unterwegs` : `Article ${idx + 2} on the way`}
                  </h3>
                  <p className="text-dark/60 leading-relaxed text-sm">
                    {language === 'de' 
                      ? 'Neue Geschichten von unterwegs sind in Arbeit...'
                      : 'New stories from the road are in the works...'}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => handleBlogSwipe('left')}
                className="inline-flex items-center px-8 py-4 bg-dark text-warm-white rounded-xl hover:bg-dark/90 active:bg-dark transition-all duration-300 font-semibold active:scale-95"
              >
                {language === 'de' ? 'Alle Artikel ansehen' : 'View all articles'}
                <span className="ml-2">→</span>
              </button>
            </div>

          </div>
        )
      }

      // Blog morph state 2: Final state - all posts button
      if (blogMorphState === 2) {
        return (
          <div 
            className="h-full flex flex-col justify-center items-center p-4 sm:p-6"
            onTouchStart={(e) => {
              // Only enable swipe on mobile
              if (window.innerWidth >= 1024) return // lg breakpoint
              
              const startX = e.touches[0].clientX
              const handleTouchEnd = (endEvent: TouchEvent) => {
                const endX = endEvent.changedTouches[0].clientX
                const deltaX = startX - endX
                if (Math.abs(deltaX) > 50) {
                  if (deltaX < 0) handleBlogSwipe('right') // Only allow going back
                }
                document.removeEventListener('touchend', handleTouchEnd)
              }
              document.addEventListener('touchend', handleTouchEnd)
            }}
          >
            {/* Final call to action */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">
                {language === 'de' ? 'Bereit für mehr?' : 'Ready for more?'}
              </h2>
              <p className="text-dark/70 mb-8 max-w-md">
                {language === 'de' 
                  ? 'Entdecke alle meine Geschichten und Abenteuer auf der Blog-Seite.'
                  : 'Discover all my stories and adventures on the blog page.'}
              </p>
              
              <a 
                href="/blog"
                className="inline-flex items-center px-10 py-5 bg-dark text-warm-white rounded-2xl hover:bg-dark/90 active:bg-dark transition-all duration-300 font-bold text-lg active:scale-95 shadow-2xl"
              >
                {language === 'de' ? 'Zum Blog' : 'Go to Blog'}
                <span className="ml-3 text-xl">→</span>
              </a>
            </motion.div>

          </div>
        )
      }
    }
    
    // Gallery slide: Full-container layout
    if (currentSection.showGalleryPreview) {
      return (
        <>
          {/* Mobile: Original layout with title and button */}
          <div className="lg:hidden flex items-center justify-center h-full px-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* Title only */}
              {currentSection.title && (
                <h1 className="text-4xl font-bold text-dark mb-8">
                  {typeof currentSection.title === 'string' 
                    ? (() => {
                        const content = pageContent[currentSection.title as keyof typeof pageContent]
                        return typeof content === 'function' ? content() : content?.[language] || ''
                      })()
                    : (currentSection as any).title?.[language] || ''
                  }
                </h1>
              )}
              
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="relative">
                      <div className="bg-pure-white p-3 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300" 
                           style={{transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (Math.random() * 4 + 1)}deg)`}}>
                        <div className="w-full h-32 bg-warm-white rounded-sm flex items-center justify-center text-dark/40">
                          Foto {i}
                        </div>
                        <div className="text-xs text-dark/60 mt-2 text-center">
                          {pageContent.blogComingSoon[language]}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 text-center mt-4">
                    <a 
                      href="/gallery" 
                      className="inline-flex items-center px-6 py-3 bg-dark text-warm-white rounded-lg hover:bg-dark/90 transition-colors"
                    >
                      {pageContent.toGallery[language]}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Gallery with title and button, polaroids around */}
          <div className="hidden lg:block h-full w-full relative">
            {/* Title - Safe zone at top */}
            <div className="absolute top-8 left-0 right-0 text-center z-30">
              {currentSection.title && (
                <h1 className="text-4xl font-bold text-dark">
                  {typeof currentSection.title === 'string' 
                    ? (() => {
                        const content = pageContent[currentSection.title as keyof typeof pageContent]
                        return typeof content === 'function' ? content() : content?.[language] || ''
                      })()
                    : (currentSection as any).title?.[language] || ''
                  }
                </h1>
              )}
            </div>

            {/* Button - Safe zone at bottom */}
            <div className="absolute bottom-8 left-0 right-0 text-center z-30">
              <motion.a 
                href="/gallery" 
                className="inline-flex items-center px-8 py-4 bg-dark text-warm-white rounded-xl hover:bg-dark/90 transition-all duration-300 font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pageContent.toGallery[language]}
                <span className="ml-2">→</span>
              </motion.a>
            </div>

            {/* Gallery Wall - Polaroids around title/button with safe zones */}
            <div className="absolute inset-0 p-8">
              {[
                // Top area (avoiding title safe zone and right edge)
                { id: 1, x: '12%', y: '25%', rotation: -8, delay: 0 },
                { id: 2, x: '35%', y: '22%', rotation: 12, delay: 0.1 },
                { id: 3, x: '68%', y: '28%', rotation: -5, delay: 0.2 },
                
                // Middle area (well spaced)
                { id: 4, x: '18%', y: '45%', rotation: 15, delay: 0.3 },
                { id: 5, x: '50%', y: '42%', rotation: -12, delay: 0.4 },
                { id: 6, x: '78%', y: '48%', rotation: 8, delay: 0.5 },
                
                // Bottom area (avoiding button safe zone)
                { id: 7, x: '25%', y: '68%', rotation: -7, delay: 0.6 }
              ].map((polaroid) => (
                <div key={polaroid.id} className="contents">
                  {/* Pushpin - positioned independently, NOT rotated */}
                  <motion.div
                    className="absolute w-3 h-3 bg-red-500 rounded-full shadow-sm z-20"
                    style={{
                      left: polaroid.x,
                      top: polaroid.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ delay: polaroid.delay + 0.3, type: "spring" }}
                  />
                  
                  {/* Polaroid - positioned and rotated */}
                  <motion.div
                    className="absolute"
                    style={{
                      left: polaroid.x,
                      top: polaroid.y,
                      transform: `translate(-50%, -50%) rotate(${polaroid.rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: polaroid.delay,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      zIndex: 15,
                      rotate: 0,
                      transition: { type: "spring", stiffness: 400, damping: 20 }
                    }}
                    onClick={() => window.open('/gallery', '_blank')}
                  >
                    <div className="bg-pure-white p-3 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                      {/* Landscape Polaroid Format */}
                      <div className="w-24 h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 bg-warm-white rounded-sm flex items-center justify-center text-dark/40 text-xs">
                        {language === 'de' ? 'Bild' : 'Photo'} {polaroid.id}
                      </div>
                      <div className="text-xs text-dark/60 mt-2 text-center italic">
                        {language === 'de' ? 'Bald verfügbar...' : 'Coming soon...'}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </>
      )
    }
    
    // Default layout for other content slides
    return (
      <div className="flex items-center justify-center h-full px-6">
        <div className="max-w-4xl mx-auto">
          {/* Other content slides keep original layout */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                {currentSection.title && (
                  <h1 className="text-4xl font-bold text-dark mb-6">
                    {typeof currentSection.title === 'string' 
                      ? (() => {
                          const content = pageContent[currentSection.title as keyof typeof pageContent]
                          return typeof content === 'function' ? content() : content?.[language] || ''
                        })()
                      : (currentSection as any).title?.[language] || ''
                    }
                  </h1>
                )}
                <div className="text-lg text-dark/80 space-y-4">
                  {currentSection.content?.map((key, idx) => {
                    // Special handling for contact description with emphasis
                    if (key === 'contactDescription1' && currentSection.content?.includes('contactDescription1Strong')) {
                      const content = pageContent[key as keyof typeof pageContent]
                      const strongContent = pageContent['contactDescription1Strong' as keyof typeof pageContent]
                      const text = typeof content === 'function' ? content() : content?.[language] || ''
                      const strongText = typeof strongContent === 'function' ? strongContent() : strongContent?.[language] || ''
                      
                      return (
                        <p key={idx}>
                          {text}
                          <span className="text-dark font-medium">{strongText}</span>
                        </p>
                      )
                    }
                    
                    // Skip rendering contactDescription1Strong separately since it's handled above
                    if (key === 'contactDescription1Strong') {
                      return null
                    }
                    
                    // Default rendering for other content
                    const content = pageContent[key as keyof typeof pageContent]
                    return (
                      <p key={idx}>
                        {typeof content === 'function' ? content() : content?.[language] || ''}
                      </p>
                    )
                  })}
                </div>

                {/* Contact Icon - positioned to the right under text */}
                {currentSection.showContactButtons && (
                  <div className="mt-8 flex justify-center md:justify-start md:ml-16">
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="group relative inline-flex items-center justify-center w-24 h-24 text-dark hover:text-dark/80 transition-all duration-500"
                    >
                      {/* Paper Plane - Default tilted position */}
                      <div className="group-hover:opacity-0 transition-opacity duration-500">
                        <svg 
                          className="w-16 h-16 transform rotate-12 -translate-y-1 translate-x-1 transition-transform group-hover:scale-110 duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                      
                      {/* Unfolded Paper - Shows on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="w-14 h-16 bg-warm-white border-2 border-dark/20 rounded-sm shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative">
                          {/* Paper lines to simulate text */}
                          <div className="absolute top-3 left-2 right-2 space-y-1">
                            <div className="h-0.5 bg-dark/30 rounded w-3/4"></div>
                            <div className="h-0.5 bg-dark/30 rounded w-full"></div>
                            <div className="h-0.5 bg-dark/30 rounded w-2/3"></div>
                            <div className="h-0.5 bg-dark/30 rounded w-4/5"></div>
                            <div className="h-0.5 bg-dark/30 rounded w-1/2"></div>
                          </div>
                          
                          {/* Small heart at bottom right */}
                          <div className="absolute bottom-2 right-2 text-red-400 text-xs">♥</div>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 rounded-full bg-dark/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Special content based on section */}
              <div className="flex justify-center mt-8">
                {(currentSection as any).showBlogPreview && (
                  <div className="text-center py-16 text-dark/60">
                    <div className="text-6xl mb-4">📝</div>
                    <div className="text-lg">{pageContent.blogComingSoon[language]}</div>
                    <div className="text-sm mt-2">{pageContent.blogFirstPosts[language]}</div>
                    <a 
                      href="/blog" 
                      className="inline-flex items-center px-6 py-3 bg-dark text-warm-white rounded-lg hover:bg-dark/90 transition-colors mt-6"
                    >
                      {pageContent.readAllPosts[language]}
                    </a>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    )
  }
  
  // Main render for Home component
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slide - Full Screen */}
      {currentSection.type === 'hero' && (
        <div 
          ref={containerRef}
          className="fixed md:top-16 top-0 left-0 right-0 bottom-0"
        >
          <HeroSlide 
            title={typeof currentSection.title === 'object' ? currentSection.title : { en: '', de: '' }}
            content={currentSection.content}
            showExploreButton={currentSection.showExploreButton}
            onNavigateToCarousel={() => goToNextSection()}
            language={language}
          />
        </div>
      )}

      {/* Main Content Area - Complete Original Carousel System */}
      {currentSection.type !== 'hero' && (
        <div 
          ref={containerRef}
          className="h-screen pt-[5vh] pb-[12vh] px-4 flex items-center justify-center relative"
        >
          {/* Content Frame with INTENSIFIED inset depth effect and Progress Border */}
          <div 
            className="absolute top-[5vh] bottom-[12vh] left-[5vw] right-[5vw] rounded-2xl bg-warm-white backdrop-blur-md transition-all duration-300 overflow-hidden"
            style={{
              // No border here - we'll add it separately for contact slide
              ...(currentSection.showContactButtons ? {} : {
                border: `2px solid rgba(20, 20, 19, ${0.08 + (progress / 100) * 0.4})`,
                boxShadow: `
                  inset 0 2px 8px rgba(20, 20, 19, 0.15),
                  inset 0 4px 16px rgba(20, 20, 19, 0.12),
                  inset 0 8px 32px rgba(20, 20, 19, 0.08),
                  inset 0 1px 0 rgba(20, 20, 19, 0.05),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                `
              })
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Content inside the frame with preview effect */}
            <motion.div 
              className="w-full h-full flex items-center justify-center"
              animate={{
                x: isPreviewActive ? (previewDirection === 'right' ? -20 : 20) : 0,
                opacity: isPreviewActive ? 0.7 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.15
              }}
            >
              {renderContent()}
            </motion.div>

            {/* Contact Slide Border and Shadow - Only where paper doesn't overlay */}
            {currentSection.showContactButtons && (
              <div 
                className="absolute top-0 bottom-0 left-0 right-0 rounded-2xl border-2 hidden lg:block pointer-events-none"
                style={{
                  borderColor: `rgba(20, 20, 19, ${0.08 + (progress / 100) * 0.4})`,
                  boxShadow: `
                    inset 0 2px 8px rgba(20, 20, 19, 0.15),
                    inset 0 4px 16px rgba(20, 20, 19, 0.12),
                    inset 0 8px 32px rgba(20, 20, 19, 0.08),
                    inset 0 1px 0 rgba(20, 20, 19, 0.05),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  // Mask out the area where paper overlays (right side)
                  maskImage: 'linear-gradient(to right, black 0%, black 65%, transparent 75%)',
                  WebkitMaskImage: 'linear-gradient(to right, black 0%, black 65%, transparent 75%)'
                }}
              />
            )}

            {/* Contact Slide Border and Shadow for Mobile */}
            {currentSection.showContactButtons && (
              <div 
                className="absolute top-0 bottom-0 left-0 right-0 rounded-2xl border-2 lg:hidden pointer-events-none"
                style={{
                  borderColor: `rgba(20, 20, 19, ${0.08 + (progress / 100) * 0.4})`,
                  boxShadow: `
                    inset 0 2px 8px rgba(20, 20, 19, 0.15),
                    inset 0 4px 16px rgba(20, 20, 19, 0.12),
                    inset 0 8px 32px rgba(20, 20, 19, 0.08),
                    inset 0 1px 0 rgba(20, 20, 19, 0.05),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                  `
                }}
              />
            )}

            {/* College Block Paper Overlay - Only on Contact Slide Desktop */}
            {currentSection.showContactButtons && (
              <div className="absolute top-[-4vh] right-[-8vw] w-[40vw] h-[115vh] hidden lg:block pointer-events-none transform rotate-[3deg] z-50">
                {/* Paper Background with yellowed color and torn corner */}
                <div 
                  className="w-full h-full relative"
                  style={{
                    background: `
                      radial-gradient(ellipse at 30% 20%, #e8dcc0 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, #d4c4a0 0%, transparent 60%),
                      radial-gradient(ellipse at 20% 70%, #e0d2b0 0%, transparent 45%),
                      radial-gradient(ellipse at 80% 30%, #cdbf95 0%, transparent 55%),
                      linear-gradient(135deg, 
                        #f2e8d0 0%, 
                        #ede3c8 15%, 
                        #e8ddc0 25%, 
                        #e0d3ab 40%, 
                        #d8c99d 55%, 
                        #d2c291 70%, 
                        #ccbb85 85%, 
                        #c7b67a 100%
                      )
                    `,
                    // No clipPath - normal rectangular paper
                    boxShadow: `
                      0 12px 35px rgba(0, 0, 0, 0.18),
                      0 6px 15px rgba(0, 0, 0, 0.12),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      inset 0 -2px 4px rgba(139, 122, 90, 0.1)
                    `
                  }}
                >
                  {/* Red margin line */}
                  <div 
                    className="absolute left-[12%] top-0 bottom-0 w-[1px]"
                    style={{ backgroundColor: '#dc2626' }}
                  />
                  
                  {/* Horizontal ruled lines */}
                  {Array.from({ length: 40 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-[1px] opacity-40"
                      style={{
                        backgroundColor: '#8b7a5a',
                        top: `${8 + i * 2.3}%`
                      }}
                    />
                  ))}

                  {/* Subtle paper texture */}
                  <div 
                    className="absolute inset-0 opacity-3"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 25% 40%, rgba(139, 115, 85, 0.1) 1px, transparent 1px),
                        radial-gradient(circle at 75% 60%, rgba(160, 132, 92, 0.08) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px, 55px 55px'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Curved Navigation Zones - Instagram Style */}
            {/* Left Navigation Zone - PRECISE ELLIPSE MATCHING */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-[30%] cursor-pointer group z-30 md:w-[25%] pointer-events-none"
              style={{
                clipPath: 'ellipse(80% 90% at 0% 50%)'
              }}
            >
              {/* Clickable area that matches visual exactly */}
              <div 
                className="absolute inset-0 pointer-events-auto"
                onClick={() => handleNavigation('left')}
                onTouchStart={(e) => {
                  e.currentTarget.parentElement!.style.transform = 'scale(0.98)'
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.parentElement!.style.transform = 'scale(1)'
                }}
              />
              {/* Instagram-style curved touch area - dark for visibility */}
              <div 
                className={`absolute inset-0 transition-all duration-500 group-hover:opacity-100 group-active:opacity-100 ${
                  showNavHint ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `
                    radial-gradient(
                      ellipse 60% 70% at 20% 50%,
                      rgba(20, 20, 19, 0.15) 0%,
                      rgba(20, 20, 19, 0.08) 40%,
                      transparent 80%
                    )
                  `,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '0 40px 40px 0',
                  clipPath: 'ellipse(80% 90% at 0% 50%)'
                }}
              />
            </div>

            {/* Right Navigation Zone - PRECISE ELLIPSE MATCHING */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-[30%] cursor-pointer group z-30 md:w-[25%] pointer-events-none"
              style={{
                clipPath: 'ellipse(80% 90% at 100% 50%)'
              }}
            >
              {/* Clickable area that matches visual exactly */}
              <div 
                className="absolute inset-0 pointer-events-auto"
                onClick={() => handleNavigation('right')}
                onTouchStart={(e) => {
                  e.currentTarget.parentElement!.style.transform = 'scale(0.98)'
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.parentElement!.style.transform = 'scale(1)'
                }}
              />
              {/* Instagram-style curved touch area - dark for visibility */}
              <div 
                className={`absolute inset-0 transition-all duration-500 group-hover:opacity-100 group-active:opacity-100 ${
                  showNavHint ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `
                    radial-gradient(
                      ellipse 60% 70% at 80% 50%,
                      rgba(20, 20, 19, 0.15) 0%,
                      rgba(20, 20, 19, 0.08) 40%,
                      transparent 80%
                    )
                  `,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '40px 0 0 40px',
                  clipPath: 'ellipse(80% 90% at 100% 50%)'
                }}
              />
            </div>
          </div>
        
          {/* Section Indicator Dots - positioned just below the frame */}
          <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            {animationSections.map((section, idx) => {
              // Skip hero section in dots
              if (section.type === 'hero') return null
              return (
                <button
                  key={idx}
                  onClick={() => {
                    // Don't allow navigation to hero section if we've already left it
                    if (idx === 0 && animationSections[0].type === 'hero' && hasLeftHero) {
                      return
                    }
                    setCurrentSectionIndex(idx)
                    setProgress(0)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSectionIndex 
                      ? 'bg-dark w-8' 
                      : 'bg-dark/30 hover:bg-dark/50'
                  }`}
                  aria-label={`Go to section ${idx + 1}`}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Contact Modal - Exact Country Popup Style */}
      {showContactModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark/10 backdrop-blur-sm z-[100]"
            onClick={() => setShowContactModal(false)}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2 
            }}
            className="fixed bottom-8 right-8 z-[101]"
          >
            <div 
              className="bg-warm-white backdrop-blur-xl text-dark p-8 rounded-3xl max-w-sm min-h-[280px] relative"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(20, 20, 19, 0.05),
                  0 10px 40px -10px rgba(20, 20, 19, 0.15),
                  0 20px 50px -20px rgba(20, 20, 19, 0.1),
                  0 1px 3px rgba(20, 20, 19, 0.05)
                `
              }}
            >
              {/* Close button */}
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-dark/5 hover:bg-dark/10 transition-colors group z-10"
                aria-label="Close"
              >
                <svg className="w-4 h-4 text-dark/60 group-hover:text-dark/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="space-y-6 pt-2">
                <div className="pr-8">
                  <h3 className="font-semibold text-xl leading-tight">{pageContent.contactPopupTitle[language]}</h3>
                </div>
                
                {/* Contact Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Instagram DM - Mobile: Top, Desktop: Top */}
                  <a 
                    href="https://instagram.com/lu.is.gone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 hover:from-purple-100 hover:via-pink-100 hover:to-orange-100 transition-all duration-300 group border border-pink-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span className="font-medium text-dark">Send a DM</span>
                  </a>
                  
                  {/* Email */}
                  <a 
                    href="mailto:gunther.luis@icloud.com?subject=Hi%20Luis!"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark/5 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 text-warm-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Email</span>
                  </a>
                  
                </div>
                
              </div>
              
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
