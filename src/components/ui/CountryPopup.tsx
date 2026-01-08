'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Portal from './Portal'

interface CountryData {
  visited: boolean
  current: boolean
  posts?: number
  images?: number
}

interface CountryPopupProps {
  countryName: string | null
  countryData?: CountryData
  onClose: () => void
}

/**
 * Elegant country information popup with smooth animations
 * Renders through Portal to avoid z-index and overflow issues
 */
export default function CountryPopup({ countryName, countryData, onClose }: CountryPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (countryName) {
      // Small delay for smoother animation
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [countryName])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (countryName) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [countryName, onClose])

  if (!countryName) return null

  return (
    <Portal>
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-dark/10 backdrop-blur-sm z-[100]"
              onClick={onClose}
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
                className="bg-warm-white/98 backdrop-blur-xl text-dark p-6 rounded-3xl shadow-xl max-w-sm"
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
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-dark/5 hover:bg-dark/10 transition-colors group"
                  aria-label="Close popup"
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 14 14" 
                    fill="none"
                    className="group-hover:scale-110 transition-transform"
                  >
                    <path 
                      d="M1 1L13 13M1 13L13 1" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                      className="text-dark/40 group-hover:text-dark/60"
                    />
                  </svg>
                </button>
                
                {/* Country name */}
                <h3 className="font-semibold text-xl mb-3 pr-8">{countryName}</h3>
                
                {/* Status */}
                <div className="text-sm text-dark/70 mb-3">
                  {countryData?.current && (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Aktuell hier
                    </span>
                  )}
                  {countryData && !countryData.current && countryData.visited && 'Bereits bereist'}
                  {!countryData?.visited && 'Noch nicht bereist'}
                </div>
                
                {/* Stats and CTA */}
                {countryData?.visited && (
                  <>
                    <div className="text-sm text-dark/60 mb-4 flex items-center gap-4">
                      <span>{countryData.posts || 0} Posts</span>
                      <span className="text-dark/30">•</span>
                      <span>{countryData.images || 0} Bilder</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        window.location.href = `/countries/${countryName.toLowerCase().replace(/\s+/g, '-')}`
                      }}
                      className="w-full bg-dark text-warm-white py-3 px-5 rounded-2xl text-sm font-medium hover:bg-dark/90 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Entdecken
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}