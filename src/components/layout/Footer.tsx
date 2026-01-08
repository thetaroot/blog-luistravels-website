'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { SITE_CONFIG } from '@/lib/constants'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [currentLocation, setCurrentLocation] = useState<{country: string | null, emoji: string | null}>(
    {country: null, emoji: null}
  )

  // Load current location from location.json
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const response = await fetch('/content-location.json')
        const locationData = await response.json()
        setCurrentLocation({
          country: locationData.current,
          emoji: locationData.emoji
        })
      } catch (error) {
        console.log('No location data available yet')
      }
    }
    loadLocation()
  }, [])
  
  const content = {
    copyright: {
      en: `© ${currentYear} Luis Travels. All rights reserved.`,
      de: `© ${currentYear} Luis Travels. Alle Rechte vorbehalten.`
    },
    imageRights: {
      en: "All images are copyrighted. No use without permission.",
      de: "Alle Bilder sind urheberrechtlich geschützt. Keine Verwendung ohne Erlaubnis."
    },
    madeWith: {
      en: "Made with ☕ while prutscheling around the world",
      de: "Made with ☕ while prutscheling um die Welt"
    },
    followMe: {
      en: "Follow the journey",
      de: "Folge der Reise"
    },
    legal: {
      en: "Legal",
      de: "Rechtliches"
    },
    support: {
      en: "Support",
      de: "Unterstützen"
    },
    privacy: {
      en: "Privacy",
      de: "Datenschutz"
    },
    coffee: {
      en: "Buy me a coffee",
      de: "Spendier mir einen Kaffee"
    },
  }
  
  return (
    <footer className="bg-warm-white border-t border-dark/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Centered 3-Column Layout */}
        <div className="text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            {/* Support Column */}
            <div>
              <h4 className="font-medium text-dark mb-6">{content.support[language]}</h4>
              <div className="space-y-3">
                <a 
                  href={`https://coff.ee/${SITE_CONFIG.kofi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-dark/70 hover:text-dark transition-colors text-sm"
                >
                  ☕ {content.coffee[language]}
                </a>
              </div>
            </div>
            
            {/* Follow the Journey Column */}
            <div>
              <h4 className="font-medium text-dark mb-6">{content.followMe[language]}</h4>
              <div className="space-y-3">
                <a 
                  href={`https://instagram.com/${SITE_CONFIG.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-dark/70 hover:text-dark transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                <a 
                  href={`https://www.pinterest.com/${SITE_CONFIG.pinterest}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-dark/70 hover:text-dark transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12c6.626 0 12-5.374 12-12S18.626 0 12 0zm0 19c-.68 0-1.348-.069-1.994-.204.27-.426.686-1.122.859-1.737l.662-2.526s.164.32.637.582c2.086 1.164 3.667.14 4.249-1.336.619-1.569.045-3.734-1.563-4.548-.302-.153-.967-.108-1.272.06-1.045.577-1.726 1.877-1.726 3.268 0 .78.301 1.474.789 1.943.121.117-.302 1.656-.4 1.898-.13.322-.695-.06-.881-.154-1.372-.696-2.232-2.604-1.738-4.26.494-1.656 2.444-2.604 4.39-2.29 1.946.314 3.478 1.656 3.478 4.062 0 2.406-1.532 4.375-3.478 4.375-.302 0-.592-.059-.859-.157-.138-.204-.302-.371-.302-.697 0-.637.465-1.104.465-2.198 0-1.104-.604-1.656-1.532-1.656-.928 0-1.563.604-1.563 1.656 0 .593.17 1.104.465 1.479-.465 1.946-1.365 4.844-1.532 5.708C6.05 18.206 4.875 15.3 4.875 12c0-3.938 3.188-7.125 7.125-7.125S19.125 8.062 19.125 12s-3.188 7.125-7.125 7.125z"/>
                  </svg>
                  Pinterest
                </a>
              </div>
            </div>
            
            {/* Legal Column */}
            <div>
              <h4 className="font-medium text-dark mb-6">{content.legal[language]}</h4>
              <div className="space-y-3">
                <Link
                  href="/impressum"
                  className="block text-dark/70 hover:text-dark transition-colors text-sm"
                >
                  Impressum
                </Link>
                <Link
                  href="/privacy"
                  className="block text-dark/70 hover:text-dark transition-colors text-sm"
                >
                  {content.privacy[language]}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Bottom Notes - Same Width as Columns */}
          <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-dark/10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-sm text-dark/60">
              <div>
                {content.copyright[language]}
              </div>
              
              <div>
                {content.imageRights[language]}
              </div>
              
              {currentLocation.country && currentLocation.emoji && (
                <div>
                  {language === 'en' ? 'Currently roaming' : 'Gerade unterwegs'}: {currentLocation.emoji}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  )
}