/**
 * React Performance Optimizations for INP
 * Enterprise-level component optimization strategies
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react'

/**
 * Debounce hook for optimizing frequent interactions
 * Critical for reducing INP by batching rapid events
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    ((...args: Parameters<T>) => {
      if (delay === 0) {
        callbackRef.current(...args)
        return
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay]
  )
}

/**
 * Throttle hook for limiting interaction frequency
 * Prevents excessive event handling that increases INP
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false)
  const callbackRef = useRef(callback)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    ((...args: Parameters<T>) => {
      if (limit === 0) {
        callbackRef.current(...args)
        return
      }
      
      if (!inThrottle.current) {
        callbackRef.current(...args)
        inThrottle.current = true
        setTimeout(() => {
          inThrottle.current = false
        }, limit)
      }
    }) as T,
    [limit]
  )
}

/**
 * Optimized event handler hook
 * Reduces INP by optimizing event processing
 */
export function useOptimizedEventHandler<T extends Event>(
  handler: (event: T) => void,
  options: {
    debounce?: number
    throttle?: number
    passive?: boolean
    capture?: boolean
  } = {}
) {
  const { debounce, throttle, passive = true, capture = false } = options
  
  const baseHandler = useCallback(handler, [handler])
  
  // Always call hooks in the same order - use conditional logic inside hook callbacks
  const debouncedHandler = useDebounce(baseHandler, debounce || 0)
  const throttledHandler = useThrottle(baseHandler, throttle || 0)
  
  const optimizedHandler = useMemo(() => {
    if (debounce) return debouncedHandler
    if (throttle) return throttledHandler
    return baseHandler
  }, [debounce, throttle, debouncedHandler, throttledHandler, baseHandler])
  
  return useCallback((event: T) => {
    // Use requestIdleCallback for non-critical processing
    if ('requestIdleCallback' in window && !capture) {
      (window as any).requestIdleCallback(() => {
        optimizedHandler(event)
      })
    } else {
      optimizedHandler(event)
    }
  }, [optimizedHandler, capture])
}

/**
 * Hook for batching DOM updates to reduce layout thrashing
 */
export function useBatchedUpdates() {
  const batchRef = useRef<(() => void)[]>([])
  const frameRef = useRef<number>()

  const batchUpdate = useCallback((update: () => void) => {
    batchRef.current.push(update)
    
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        // Process all batched updates
        const updates = batchRef.current.splice(0)
        updates.forEach(update => update())
        frameRef.current = undefined
      })
    }
  }, [])

  return batchUpdate
}

/**
 * Hook for efficient intersection observation
 * Reduces INP by optimizing visibility tracking
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver>()
  const callbackRef = useRef(callback)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const observe = useCallback((element: Element) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Use requestIdleCallback for non-critical processing
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
              callbackRef.current(entries)
            })
          } else {
            callbackRef.current(entries)
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
          ...options
        }
      )
    }
    
    observerRef.current.observe(element)
    
    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(element)
      }
    }
  }, [options])

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = undefined
    }
  }, [])

  useEffect(() => {
    return disconnect
  }, [disconnect])

  return { observe, disconnect }
}

/**
 * Hook for optimizing image loading to reduce layout shift and improve INP
 */
export function useOptimizedImageLoading() {
  const imageCache = useRef<Map<string, boolean>>(new Map())
  
  const preloadImage = useCallback((src: string): Promise<void> => {
    if (imageCache.current.has(src)) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        imageCache.current.set(src, true)
        resolve()
      }
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      img.src = src
    })
  }, [])

  const preloadImages = useCallback(async (sources: string[]) => {
    try {
      await Promise.all(sources.map(preloadImage))
    } catch (error) {
      console.warn('Some images failed to preload:', error)
    }
  }, [preloadImage])

  return { preloadImage, preloadImages, isImageCached: (src: string) => imageCache.current.has(src) }
}

/**
 * Hook for managing focus to improve keyboard navigation and reduce INP
 */
export function useFocusManagement() {
  const focusQueue = useRef<HTMLElement[]>([])
  
  const enqueueFocus = useCallback((element: HTMLElement) => {
    focusQueue.current.push(element)
    
    // Process focus queue in next frame to avoid blocking current interaction
    requestAnimationFrame(() => {
      const nextElement = focusQueue.current.shift()
      if (nextElement && document.contains(nextElement)) {
        nextElement.focus({ preventScroll: true })
      }
    })
  }, [])

  const manageFocus = useCallback((
    element: HTMLElement | null,
    options: { preventScroll?: boolean; delay?: number } = {}
  ) => {
    if (!element) return
    
    const { preventScroll = true, delay = 0 } = options
    
    if (delay > 0) {
      setTimeout(() => {
        element.focus({ preventScroll })
      }, delay)
    } else {
      enqueueFocus(element)
    }
  }, [enqueueFocus])

  return { manageFocus }
}

/**
 * Hook for optimizing scroll performance
 */
export function useOptimizedScroll(
  handler: (event: Event) => void,
  options: { throttle?: number; passive?: boolean } = {}
) {
  const { throttle = 16, passive = true } = options // ~60fps throttling by default
  
  const optimizedHandler = useThrottle(handler, throttle)
  
  useEffect(() => {
    const scrollHandler = (event: Event) => {
      // Use requestAnimationFrame for smooth scroll handling
      requestAnimationFrame(() => {
        optimizedHandler(event)
      })
    }
    
    window.addEventListener('scroll', scrollHandler, { passive })
    
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [optimizedHandler, passive])
}

/**
 * Hook for reducing main thread blocking
 */
export function useNonBlockingTask<T>(
  task: () => T,
  dependencies: React.DependencyList = []
): T | null {
  const [result, setResult] = useState<T | null>(null)
  const taskRef = useRef(task)
  
  // Update task ref when task changes
  useEffect(() => {
    taskRef.current = task
  }, [task])
  
  useEffect(() => {
    let cancelled = false
    
    // Use MessageChannel for true async execution
    const channel = new MessageChannel()
    channel.port2.onmessage = () => {
      if (!cancelled) {
        try {
          const taskResult = taskRef.current()
          setResult(taskResult)
        } catch (error) {
          console.error('Non-blocking task failed:', error)
        }
      }
    }
    
    // Schedule task execution
    channel.port1.postMessage(null)
    
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
  
  return result
}

/**
 * Performance-optimized component wrapper HOC
 */
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  optimizations: {
    memo?: boolean
    lazy?: boolean
    preload?: string[]
  } = {}
) {
  const { memo = true, lazy = false, preload = [] } = optimizations
  
  let OptimizedComponent = Component
  
  // Apply React.memo if requested
  if (memo) {
    OptimizedComponent = React.memo(OptimizedComponent) as React.ComponentType<P>
  }
  
  // Apply lazy loading if requested
  if (lazy) {
    OptimizedComponent = React.lazy(() => 
      Promise.resolve({ default: OptimizedComponent })
    ) as React.ComponentType<P>
  }
  
  // Wrapped component with preloading
  const WrappedComponent = (props: P) => {
    const { preloadImages } = useOptimizedImageLoading()
    
    useEffect(() => {
      if (preload.length > 0) {
        preloadImages(preload)
      }
    }, [preloadImages])
    
    return React.createElement(OptimizedComponent, props)
  }
  
  return WrappedComponent
}

// Re-export React hooks with performance considerations
export { useCallback, useMemo } from 'react'