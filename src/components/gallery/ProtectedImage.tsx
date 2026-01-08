'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function ProtectedImage({ 
  src, 
  alt, 
  width = 4000, 
  height = 3000,
  className = ""
}: ProtectedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onContextMenu={handleContextMenu}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Overlay to prevent saving */}
      <div 
        className="absolute inset-0 z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ pointerEvents: 'all' }}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-warm-white/50 animate-pulse" />
      )}
      
      {/* The actual image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={90} // High quality for 4K
        priority={false}
        loading="lazy"
        className={`relative z-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        draggable={false}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
        unoptimized={width > 3000} // Don't optimize 4K images
      />
      
      {/* Watermark overlay (optional) */}
      <div className="absolute bottom-2 right-2 text-white/50 text-xs z-20 pointer-events-none">
        © Luis Günther
      </div>
    </div>
  )
}