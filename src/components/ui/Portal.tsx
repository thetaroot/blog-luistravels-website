'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
  id?: string
}

/**
 * Portal component for rendering content outside the DOM hierarchy
 * Prevents z-index and overflow issues by rendering directly to document body
 */
export default function Portal({ children, id = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  const portalElement = useRef<Element | null>(null)

  useEffect(() => {
    // Find or create portal container
    let container = document.getElementById(id)
    
    if (!container) {
      container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)
    }
    
    portalElement.current = container
    setMounted(true)

    // Cleanup on unmount (only if we created the container)
    return () => {
      if (container && container.childNodes.length === 0) {
        container.remove()
      }
    }
  }, [id])

  // Don't render on server or before mount
  if (!mounted || !portalElement.current) return null

  return createPortal(children, portalElement.current)
}