'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { CONTACT_CONFIG } from '@/lib/constants'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  general?: string
}

export default function ContactPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showCoffeeBubble, setShowCoffeeBubble] = useState(false)

  // Override global background color for this page - dark theme
  React.useEffect(() => {
    // Delay to ensure it runs after other pages' cleanup
    const timer = setTimeout(() => {
      document.body.style.setProperty('background-color', '#1a1a1a', 'important')
    }, 50)
    
    return () => {
      clearTimeout(timer)
      document.body.style.setProperty('background-color', 'var(--color-warm-white)', 'important')
    }
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Close coffee bubble when clicking elsewhere
  const handlePageClick = () => {
    if (showCoffeeBubble) {
      setShowCoffeeBubble(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4">
                {language === 'de' ? 'Nachricht gesendet!' : 'Message Sent!'}
              </h1>
              <p className="text-lg text-white/70 mb-8">
                {language === 'de' 
                  ? 'Vielen Dank für deine Nachricht! Ich werde mich so schnell wie möglich bei dir melden.'
                  : 'Thank you for your message! I will get back to you as soon as possible.'
                }
              </p>
              <button 
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ name: '', email: '', subject: '', message: '' })
                }}
                className="px-6 py-3 bg-white text-dark rounded-lg hover:bg-white/90 transition-colors"
              >
                {language === 'de' ? 'Neue Nachricht' : 'New Message'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen pt-24 pb-16 relative overflow-hidden" 
      style={{ backgroundColor: '#1a1a1a !important', minHeight: '100vh' }}
      onClick={handlePageClick}
    >
      {/* Subtle background pattern - dark theme */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gray-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-gray-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gray-700/25 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-gray-600/30 rounded-full blur-2xl" />
      </div>
      
      {/* Coffee Gimmick - Top Left Corner */}
      <div className="absolute top-8 left-8 z-20">
        <div className="relative">
          <motion.button
            onClick={() => setShowCoffeeBubble(!showCoffeeBubble)}
            className="w-16 h-16 flex items-center justify-center text-orange-500 hover:text-orange-400 transition-colors"
            whileHover={{ scale: 1.15, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              rotate: [0, -3, 3, 0],
              y: [0, -1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Cappuccino Cup SVG */}
            <svg 
              className="w-12 h-12" 
              fill="currentColor" 
              viewBox="0 0 100 100"
            >
              {/* Saucer */}
              <ellipse cx="50" cy="85" rx="25" ry="3" fill="currentColor" opacity="0.6"/>
              
              {/* Cup base */}
              <path d="M25 75 L35 40 L65 40 L75 75 Z" fill="currentColor"/>
              
              {/* Cup rim */}
              <ellipse cx="50" cy="40" rx="20" ry="3" fill="currentColor"/>
              
              {/* Coffee surface */}
              <ellipse cx="50" cy="42" rx="18" ry="2.5" fill="currentColor" opacity="0.3"/>
              
              {/* Handle */}
              <path d="M70 45 Q85 50 85 60 Q85 70 70 65" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"/>
              
              {/* Steam wisps */}
              <path d="M42 35 Q45 25 42 20 Q40 15 43 10" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    fill="none" 
                    opacity="0.7"/>
              <path d="M50 35 Q53 25 50 20 Q48 15 51 10" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    fill="none" 
                    opacity="0.8"/>
              <path d="M58 35 Q61 25 58 20 Q56 15 59 10" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    fill="none" 
                    opacity="0.7"/>
              
              {/* Highlight on cup */}
              <ellipse cx="45" cy="50" rx="3" ry="8" fill="white" opacity="0.2"/>
            </svg>
          </motion.button>
          
          {/* Apple Messages Style Speech Bubble */}
          <motion.div
            className="absolute left-full top-4 ml-2"
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ 
              opacity: showCoffeeBubble ? 1 : 0,
              scale: showCoffeeBubble ? 1 : 0.8,
              x: showCoffeeBubble ? 0 : -20
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ pointerEvents: showCoffeeBubble ? 'auto' : 'none' }}
          >
            <div className="relative">
              {/* Apple Messages bubble - long and thin */}
              <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                <p className="text-xs font-medium" style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                  {language === 'de' ? 'Schreib mir endlich!' : 'Finally write to me!'}
                </p>
              </div>
              {/* Apple Messages tail - from bottom */}
              <div className="absolute left-0 bottom-1 transform -translate-x-0.5">
                <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                  <path d="M0 8C0 8 6 2 6 8Z" fill="#3B82F6"/>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumbs 
            items={[
              { name: 'Home', href: '/', position: 1 },
              { name: 'Contact', position: 2, isCurrentPage: true }
            ]}
            variant="rich"
            className="mb-8"
          />
          
          {/* Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-white font-normal leading-relaxed tracking-tight mb-6" 
                   style={{ fontFamily: '"Poppins", "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                {language === 'de' 
                  ? (
                    <>
                      <div className="text-2xl md:text-3xl lg:text-4xl mb-4">
                        <span className="text-white/70">Schreib was </span>
                        <span className="text-white font-bold text-4xl md:text-5xl lg:text-6xl">nettes</span>
                        <span className="text-white/70"> und </span>
                        <span className="text-white font-semibold text-3xl md:text-4xl lg:text-5xl">das Thema ist egal</span>
                        <span className="text-white/70">.</span>
                      </div>
                      <div className="text-lg md:text-xl lg:text-2xl">
                        <span className="text-white/70">Wenn du auch in der Welt unterwegs bist, schreib gleich deine Stadt mit und wer weiß, vielleicht </span>
                        <span className="text-white font-bold text-xl md:text-2xl lg:text-3xl">treffen wir uns ja auf einen Kaffee</span>
                        <span className="text-white/70"> und quatschen demnächst :)</span>
                      </div>
                    </>
                  )
                  : (
                    <>
                      <div className="text-2xl md:text-3xl lg:text-4xl mb-4">
                        <span className="text-white/70">Write something </span>
                        <span className="text-white font-bold text-4xl md:text-5xl lg:text-6xl">nice</span>
                        <span className="text-white/70"> – </span>
                        <span className="text-white font-semibold text-3xl md:text-4xl lg:text-5xl">the topic doesn&apos;t matter</span>
                        <span className="text-white/70">.</span>
                      </div>
                      <div className="text-lg md:text-xl lg:text-2xl">
                        <span className="text-white/70">If you&apos;re also traveling the world, mention your city and who knows, maybe we&apos;ll </span>
                        <span className="text-white font-bold text-xl md:text-2xl lg:text-3xl">meet up for coffee</span>
                        <span className="text-white/70"> and chat soon :)</span>
                      </div>
                    </>
                  )
                }
              </div>
              
              <motion.p 
                className="text-lg md:text-xl text-white/80 font-medium tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
              >
                {language === 'de' 
                  ? 'Gerne als Insta DM oder ganz klassisch per Mail.'
                  : 'Happy to chat via Insta DM or classic email.'
                }
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-2xl mx-auto"
          >
            {/* Contact Icons - Large and Animated */}
            <div className="flex items-center justify-center gap-12">
              
              {/* Instagram Icon - Original Logo */}
              <motion.a 
                href={CONTACT_CONFIG.instagramDmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center text-white transition-all duration-500"
                whileHover={{ scale: 1.25, rotate: -15, y: -12 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 600, damping: 18 }}
                animate={{ 
                  rotate: [-2, 3, -1, 2, -2],
                  y: [0, -3, 1, -2, 0],
                  x: [0, 1, -1, 0.5, 0]
                }}
                
              >
                {/* Instagram Original Logo */}
                <motion.div
                  className="w-20 h-20"
                  whileHover={{ 
                    filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))",
                    rotateY: 25,
                    rotateX: 8
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <svg 
                    className="w-full h-full" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {/* Instagram square with rounded corners */}
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.div>
              </motion.a>
              
              {/* Separator - Static */}
              <div 
                className="w-1 h-20 bg-white/30 transform rotate-12"
              />
              
              {/* Email Icon - Envelope */}
              <motion.a 
                href={`mailto:${CONTACT_CONFIG.email}?subject=Hi%20Luis!`}
                className="group relative inline-flex items-center justify-center text-white transition-all duration-500"
                whileHover={{ scale: 1.3, rotate: 18, y: -15 }}
                whileTap={{ scale: 0.75 }}
                transition={{ type: "spring", stiffness: 650, damping: 16 }}
                animate={{ 
                  rotate: [8, 12, 6, 10, 8],
                  x: [0, 3, -1, 2, 0],
                  y: [0, -4, 2, -3, 0],
                  scale: [1, 1.05, 0.98, 1.02, 1]
                }}
                
              >
                {/* Envelope Icon */}
                <motion.div
                  className="w-20 h-20"
                  whileHover={{ 
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
                    rotateY: -30,
                    rotateX: -12,
                    rotateZ: 5
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <svg 
                    className="w-full h-full" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    {/* Envelope body */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </motion.div>
              </motion.a>
              
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}