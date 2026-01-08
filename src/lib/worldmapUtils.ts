import fs from 'fs'
import path from 'path'
import { getLocation } from './location'

export interface CountryData {
  visited: boolean
  current: boolean
  posts: number
  images: number
  cities: string[]
  lastVisited?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface WorldmapData {
  countries: Record<string, CountryData>
  currentCountry: string
  visitedCountries: string[]
  totalCountries: number
  lastUpdated: string
}

export function generateWorldmapData(): WorldmapData {
  try {
    // Get current location
    const location = getLocation()
    const currentCountry = location.current
    
    // Load blog data
    const blogIndexPath = path.join(process.cwd(), 'src/data/blog-index.json')
    const galleryIndexPath = path.join(process.cwd(), 'src/data/gallery-index.json')
    
    const blogData = fs.existsSync(blogIndexPath) 
      ? JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'))
      : { posts: [] }
    
    const galleryData = fs.existsSync(galleryIndexPath) 
      ? JSON.parse(fs.readFileSync(galleryIndexPath, 'utf8'))
      : {}
    
    // Build country data
    const countries: Record<string, CountryData> = {}
    const visitedCountries: string[] = []
    
    // Process blog posts
    blogData.posts?.forEach((post: any) => {
      if (post.country) {
        if (!countries[post.country]) {
          countries[post.country] = {
            visited: true,
            current: post.country === currentCountry,
            posts: 0,
            images: 0,
            cities: []
          }
          visitedCountries.push(post.country)
        }
        
        countries[post.country].posts++
        
        if (post.city && !countries[post.country].cities.includes(post.city)) {
          countries[post.country].cities.push(post.city)
        }
        
        // Track last visited date
        if (post.date) {
          if (!countries[post.country].lastVisited || post.date > (countries[post.country].lastVisited || '')) {
            countries[post.country].lastVisited = post.date
          }
        }
      }
    })
    
    // Process gallery images
    Object.entries(galleryData).forEach(([country, data]: [string, any]) => {
      if (typeof data === 'object' && data.images) {
        if (!countries[country]) {
          countries[country] = {
            visited: true,
            current: country === currentCountry,
            posts: 0,
            images: 0,
            cities: []
          }
          if (!visitedCountries.includes(country)) {
            visitedCountries.push(country)
          }
        }
        
        countries[country].images = data.images
        
        // Add cities from gallery
        if (data.cities) {
          data.cities.forEach((cityData: any) => {
            if (cityData.name && !countries[country].cities.includes(cityData.name)) {
              countries[country].cities.push(cityData.name)
            }
          })
        }
      }
    })
    
    // Mark current country
    if (currentCountry && !countries[currentCountry]) {
      countries[currentCountry] = {
        visited: true,
        current: true,
        posts: 0,
        images: 0,
        cities: []
      }
      if (!visitedCountries.includes(currentCountry)) {
        visitedCountries.push(currentCountry)
      }
    }
    
    // Set current flag
    Object.keys(countries).forEach(country => {
      countries[country].current = country === currentCountry
    })
    
    return {
      countries,
      currentCountry,
      visitedCountries,
      totalCountries: visitedCountries.length,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating worldmap data:', error)
    
    // Return fallback data
    return {
      countries: {
        'Germany': { visited: true, current: true, posts: 0, images: 0, cities: [] }
      },
      currentCountry: 'Germany',
      visitedCountries: ['Germany'],
      totalCountries: 1,
      lastUpdated: new Date().toISOString()
    }
  }
}

export function getCountryCoordinates(countryName: string): { lat: number, lng: number } | null {
  // Country coordinates mapping
  const coordinates: Record<string, { lat: number, lng: number }> = {
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'Thailand': { lat: 15.8700, lng: 100.9925 },
    'Colombia': { lat: 4.5709, lng: -74.2973 },
    'Malaysia': { lat: 4.2105, lng: 101.9758 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Indonesia': { lat: -0.7893, lng: 113.9213 },
    'Vietnam': { lat: 14.0583, lng: 108.2772 },
    'Philippines': { lat: 12.8797, lng: 121.7740 },
    'Cambodia': { lat: 12.5657, lng: 104.9910 },
    'Laos': { lat: 19.8563, lng: 102.4955 },
    'Myanmar': { lat: 21.9162, lng: 95.9560 },
    'France': { lat: 46.6034, lng: 1.8883 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Belgium': { lat: 50.5039, lng: 4.4699 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Austria': { lat: 47.5162, lng: 14.5501 },
    'Switzerland': { lat: 46.8182, lng: 8.2275 },
    'Czech Republic': { lat: 49.8175, lng: 15.4730 },
    'Poland': { lat: 51.9194, lng: 19.1451 },
    'Portugal': { lat: 39.3999, lng: -8.2245 },
    'Greece': { lat: 39.0742, lng: 21.8243 },
    'Turkey': { lat: 38.9637, lng: 35.2433 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'South Korea': { lat: 35.9078, lng: 127.7669 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'Nepal': { lat: 28.3949, lng: 84.1240 },
    'Sri Lanka': { lat: 7.8731, lng: 80.7718 },
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'New Zealand': { lat: -40.9006, lng: 174.8860 },
    'United States': { lat: 37.0902, lng: -95.7129 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Mexico': { lat: 23.6345, lng: -102.5528 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'Argentina': { lat: -38.4161, lng: -63.6167 },
    'Chile': { lat: -35.6751, lng: -71.5430 },
    'Peru': { lat: -9.1900, lng: -75.0152 },
    'Ecuador': { lat: -1.8312, lng: -78.1834 },
    'Bolivia': { lat: -16.2902, lng: -63.5887 },
    'Venezuela': { lat: 6.4238, lng: -66.5897 },
    'Uruguay': { lat: -32.5228, lng: -55.7658 },
    'Paraguay': { lat: -23.4425, lng: -58.4438 },
    'Egypt': { lat: 26.0975, lng: 31.2357 },
    'Morocco': { lat: 31.7917, lng: -7.0926 },
    'South Africa': { lat: -30.5595, lng: 22.9375 },
    'Kenya': { lat: -0.0236, lng: 37.9062 },
    'Tanzania': { lat: -6.3690, lng: 34.8888 },
    'Uganda': { lat: 1.3733, lng: 32.2903 },
    'Rwanda': { lat: -1.9403, lng: 29.8739 },
    'Ethiopia': { lat: 9.1450, lng: 40.4897 },
    'Madagascar': { lat: -18.7669, lng: 46.8691 },
    'Mauritius': { lat: -20.3484, lng: 57.5522 },
    'Seychelles': { lat: -4.6796, lng: 55.4920 },
    'Maldives': { lat: 3.2028, lng: 73.2207 },
    'Fiji': { lat: -16.5780, lng: 179.4144 },
    'Samoa': { lat: -13.7590, lng: -172.1046 },
    'Tonga': { lat: -21.1789, lng: -175.1982 },
    'Vanuatu': { lat: -15.3767, lng: 166.9592 },
    'Solomon Islands': { lat: -9.6457, lng: 160.1562 },
    'Papua New Guinea': { lat: -6.3149, lng: 143.9555 },
    'Palau': { lat: 7.5150, lng: 134.5825 },
    'Micronesia': { lat: 7.4256, lng: 150.5508 },
    'Marshall Islands': { lat: 7.1315, lng: 171.1845 },
    'Kiribati': { lat: -3.3704, lng: -168.7340 },
    'Nauru': { lat: -0.5228, lng: 166.9315 },
    'Tuvalu': { lat: -7.1095, lng: 177.6493 }
  }
  
  return coordinates[countryName] || null
}

export function updateWorldmapData(): void {
  try {
    const worldmapData = generateWorldmapData()
    
    // Save to data directory
    const outputPath = path.join(process.cwd(), 'src/data/worldmap.json')
    fs.writeFileSync(outputPath, JSON.stringify(worldmapData, null, 2))
    
    console.log('✅ Worldmap data updated successfully')
  } catch (error) {
    console.error('❌ Error updating worldmap data:', error)
  }
}

export function getWorldmapData(): WorldmapData {
  try {
    const worldmapPath = path.join(process.cwd(), 'src/data/worldmap.json')
    
    if (fs.existsSync(worldmapPath)) {
      return JSON.parse(fs.readFileSync(worldmapPath, 'utf8'))
    } else {
      // Generate and save if doesn't exist
      const worldmapData = generateWorldmapData()
      fs.writeFileSync(worldmapPath, JSON.stringify(worldmapData, null, 2))
      return worldmapData
    }
  } catch (error) {
    console.error('Error loading worldmap data:', error)
    return generateWorldmapData()
  }
}