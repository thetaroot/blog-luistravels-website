'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { useOptimizedEventHandler, useOptimizedImageLoading } from '@/lib/performance/react-optimizations'
import { AdvancedImage, type AdvancedImageProps } from '@/components/image/AdvancedImage'

interface OptimizedImageProps {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
  width?: number
  height?: number
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fill?: boolean
  style?: React.CSSProperties
}

export function OptimizedImage({ 
  src, 
  alt, 
  priority = false, 
  sizes,
  className = '',
  width,
  height,
  quality = 90,
  placeholder = 'blur',
  blurDataURL,
  fill = false,
  style
}: OptimizedImageProps) {
  // Delegate to the new AdvancedImage component with enhanced optimizations
  return (
    <AdvancedImage
      src={src}
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={className}
      width={width}
      height={height}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      fill={fill}
      style={style}
      enableAVIF={true}
      enableWebP={true}
      enableResponsive={true}
      context="content"
    />
  )
}