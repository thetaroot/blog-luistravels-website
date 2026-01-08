'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation
} from 'react-simple-maps'
import CountryPopup from '@/components/ui/CountryPopup'

// Import auto-generated country data
import autoCountryData from '@/data/countries.json'

// World topology URL (TopoJSON format for better performance)
// Using the highest resolution world map available
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"

interface CountryStatus {
  visited: boolean
  current: boolean
  posts?: number
  images?: number
}

interface SimpleWorldMapProps {
  currentCountry?: string
  visitedCountries?: string[]
  countryData?: Record<string, CountryStatus>
}

// Fallback data if auto-generated file doesn't exist
const fallbackCountryData: Record<string, CountryStatus> = {
  'Thailand': { visited: true, current: true, posts: 0, images: 0 },
  'Colombia': { visited: true, current: false, posts: 0, images: 0 },
  'Germany': { visited: true, current: false, posts: 0, images: 0 }
}

// Use auto-generated data or fallback
const defaultCountryData: Record<string, CountryStatus> = autoCountryData || fallbackCountryData

// Current location coordinates mapping
const locationCoordinates: Record<string, [number, number]> = {
  'Thailand': [100.5167, 13.7563], // Bangkok
  'Colombia': [-74.0721, 4.7110], // Bogotá
  'Germany': [13.4050, 52.5200], // Berlin
  'Singapore': [103.8198, 1.3521], // Singapore
  'Indonesia': [106.8456, -6.2088], // Jakarta
  'Malaysia': [101.6869, 3.1390], // Kuala Lumpur
  'Vietnam': [105.8542, 21.0285], // Hanoi
  'Philippines': [121.0244, 14.5995] // Manila
}

export default function SimpleWorldMap({
  currentCountry = 'Thailand',
  visitedCountries = ['Thailand', 'Colombia', 'Germany'],
  countryData = defaultCountryData
}: SimpleWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  // Focus on Southeast Asia initially
  const mapCenter: [number, number] = useMemo(() => [100.5, 13.7], [])
  
  // Mobile-responsive initial zoom and limits - STRICT
  const { initialZoom, minZoom, maxZoom } = useMemo(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768
      return {
        initialZoom: isMobile ? 5 : 3,
        minZoom: isMobile ? 3 : 1, // Mobile: much stricter limit
        maxZoom: isMobile ? 12 : 25 // Mobile: also limit max zoom
      }
    }
    return { initialZoom: 3, minZoom: 1, maxZoom: 25 }
  }, [])
  
  const [position, setPosition] = useState({ coordinates: mapCenter, zoom: initialZoom })
  const mapRef = useRef<HTMLDivElement>(null)

  const handleMoveEnd = useCallback((nextPosition: any) => {
    // Extract proper coordinates and zoom from the event
    const zoom = nextPosition.zoom || nextPosition.k || 1
    const coordinates = nextPosition.coordinates || nextPosition.center || mapCenter
    
    setPosition({ 
      coordinates, 
      zoom: Math.max(minZoom, Math.min(maxZoom, zoom))
    })
  }, [mapCenter, minZoom, maxZoom])

  const handleZoom = useCallback((event: WheelEvent) => {
    event.preventDefault()
    
    // Percentage-based zoom for consistent feel at all levels
    const delta = event.deltaY
    const zoomFactor = delta > 0 ? 0.95 : 1.05  // 5% change each step
    const newZoom = Math.max(minZoom, Math.min(maxZoom, position.zoom * zoomFactor))
    
    // Only update if zoom actually changes (prevents bug at min zoom)
    if (Math.abs(newZoom - position.zoom) > 0.01) {
      setPosition(prev => ({
        ...prev,
        zoom: newZoom
      }))
    }
  }, [position.zoom, minZoom, maxZoom])

  // Add wheel event listener for trackpad/mouse wheel zoom
  useEffect(() => {
    const mapElement = mapRef.current
    if (!mapElement) return

    const wheelHandler = (event: WheelEvent) => {
      handleZoom(event)
    }

    mapElement.addEventListener('wheel', wheelHandler, { passive: false })
    
    return () => {
      mapElement.removeEventListener('wheel', wheelHandler)
    }
  }, [handleZoom])

  return (
    <div 
      ref={mapRef}
      className="w-full h-full bg-transparent relative"
    >
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{
            scale: 160,
            center: mapCenter
          }}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'all'
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={minZoom}
            maxZoom={maxZoom}
          >
            {/* World countries */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.NAME || geo.properties.name || geo.properties.NAME_EN || 'Unknown'
                  const isCurrentCountry = countryName === currentCountry
                  const isVisited = visitedCountries.includes(countryName)
                  
                  // Dynamic stroke opacity based on zoom level (capped at zoom 6)
                  const zoomForStroke = Math.min(6, position.zoom)
                  const strokeOpacity = Math.min(0.4, Math.max(0.1, (zoomForStroke - 1) * 0.08))
                  const strokeWidth = Math.min(0.5, Math.max(0.2, 0.1 * (zoomForStroke / 3)))
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(countryName)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setSelectedCountry(countryName)}
                      style={{
                        default: {
                          fill: isVisited ? '#252524' : '#141413',
                          stroke: 'rgba(241, 237, 228, ' + strokeOpacity + ')',
                          strokeWidth: strokeWidth,
                          outline: 'none',
                          cursor: isVisited || isCurrentCountry ? 'pointer' : 'default'
                        },
                        hover: {
                          fill: isVisited ? '#323231' : '#1a1a19',
                          stroke: 'rgba(241, 237, 228, ' + Math.min(0.7, strokeOpacity * 1.8) + ')',
                          strokeWidth: strokeWidth * 1.3,
                          outline: 'none',
                          cursor: isVisited || isCurrentCountry ? 'pointer' : 'default'
                        },
                        pressed: {
                          fill: isVisited ? '#292928' : '#232322',
                          stroke: 'rgba(241, 237, 228, ' + Math.min(0.6, strokeOpacity * 1.5) + ')',
                          strokeWidth: strokeWidth * 1.2,
                          outline: 'none',
                          cursor: 'pointer'
                        }
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* Current Location Marker - Zoom-Reactive Apple Style */}
            {useMemo(() => {
              if (!locationCoordinates[currentCountry]) return null
              const zoomLevel = position.zoom
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
              
              // Desktop: smaller marker, Mobile: original size
              const baseGlowRadius = isMobile ? 18 : 12
              const baseDotRadius = isMobile ? 10 : 6
              
              const glowRadius = Math.max(2, Math.min(isMobile ? 15 : 10, baseGlowRadius - (zoomLevel * 2)))
              const dotRadius = Math.max(1, Math.min(isMobile ? 8 : 5, baseDotRadius - (zoomLevel * 1)))
              const glowOpacity = Math.max(0.1, Math.min(0.4, 0.5 - (zoomLevel * 0.04)))
              
              return (
                <Marker coordinates={locationCoordinates[currentCountry]}>
                  <g>
                    
                    {/* Zoom-reactive breathing glow */}
                    <circle
                      r={glowRadius}
                      fill={`rgba(178, 34, 34, ${glowOpacity})`}
                      style={{
                        animation: 'breathing-glow 4s ease-in-out infinite'
                      }}
                    />
                    {/* Zoom-reactive main dot */}
                    <circle
                      r={dotRadius}
                      fill="#B22222"
                      style={{
                        filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.3))`,
                        animation: 'breathing-dot 4s ease-in-out infinite'
                      }}
                    />
                  </g>
                </Marker>
              )
            }, [position.zoom, currentCountry])}

          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip for hovered country */}
        {hoveredCountry && (
          <div className="absolute top-4 left-4 bg-dark/80 text-warm-white px-3 py-2 rounded-lg text-sm pointer-events-none">
            {hoveredCountry}
          </div>
        )}

        {/* Country popup rendered through Portal */}
        <CountryPopup
          countryName={selectedCountry}
          countryData={selectedCountry ? countryData[selectedCountry] : undefined}
          onClose={() => setSelectedCountry(null)}
        />
        
    </div>
  )
}