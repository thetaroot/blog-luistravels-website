import fs from 'fs'
import path from 'path'
// import { ExifImage } from 'exif' // Optional: install exif package for metadata extraction

export interface GalleryImage {
  filename: string
  path: string
  country: string
  city: string
  url: string
  thumbnail?: string
  metadata?: ImageMetadata
  tags?: string[]
}

export interface ImageMetadata {
  dateTaken?: string
  camera?: string
  lens?: string
  settings?: {
    aperture?: string
    shutter?: string
    iso?: number
  }
  location?: {
    lat?: number
    lng?: number
  }
}

export interface GalleryIndex {
  images: GalleryImage[]
  totalImages: number
  countries: { [key: string]: number }
  cities: { [key: string]: { [key: string]: number } }
  lastUpdated: string
}

export function getLatestImages(limit: number = 6): GalleryImage[] {
  try {
    const indexPath = path.join(process.cwd(), 'src/data/gallery-index.json')
    if (!fs.existsSync(indexPath)) {
      return []
    }
    
    const galleryIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    const images = getAllGalleryImages()
    
    // Sort by date taken if available, otherwise by filename
    return images
      .sort((a, b) => {
        const dateA = a.metadata?.dateTaken ? new Date(a.metadata.dateTaken).getTime() : 0
        const dateB = b.metadata?.dateTaken ? new Date(b.metadata.dateTaken).getTime() : 0
        
        if (dateA && dateB) {
          return dateB - dateA
        }
        
        return b.filename.localeCompare(a.filename)
      })
      .slice(0, limit)
  } catch (error) {
    console.error('Error loading latest images:', error)
    return []
  }
}

export function getImagesByCountry(country: string): GalleryImage[] {
  try {
    const images = getAllGalleryImages()
    return images.filter(img => img.country === country)
  } catch (error) {
    console.error('Error loading images by country:', error)
    return []
  }
}

export function getImagesByCity(country: string, city: string): GalleryImage[] {
  try {
    const images = getAllGalleryImages()
    return images.filter(img => img.country === country && img.city === city)
  } catch (error) {
    console.error('Error loading images by city:', error)
    return []
  }
}

export function getAllGalleryImages(): GalleryImage[] {
  try {
    const galleryDir = path.join(process.cwd(), 'content/gallery')
    if (!fs.existsSync(galleryDir)) {
      return []
    }
    
    const images: GalleryImage[] = []
    const countries = fs.readdirSync(galleryDir).filter(item => {
      const itemPath = path.join(galleryDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
    
    countries.forEach(country => {
      const countryPath = path.join(galleryDir, country)
      const cities = fs.readdirSync(countryPath).filter(item => {
        const itemPath = path.join(countryPath, item)
        return fs.statSync(itemPath).isDirectory()
      })
      
      cities.forEach(city => {
        const cityPath = path.join(countryPath, city)
        const files = fs.readdirSync(cityPath).filter(file => {
          return /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
        })
        
        files.forEach(file => {
          const fullPath = path.join(cityPath, file)
          const relativePath = path.relative(path.join(process.cwd(), 'content'), fullPath)
          
          images.push({
            filename: file,
            path: relativePath,
            country,
            city,
            url: `/content/${relativePath}`,
            thumbnail: `/content/gallery/${country}/${city}/thumbs/${file}`,
            metadata: extractImageMetadata(fullPath),
            tags: generateImageTags(file, country, city)
          })
        })
      })
    })
    
    return images
  } catch (error) {
    console.error('Error loading gallery images:', error)
    return []
  }
}

export function extractImageMetadata(imagePath: string): ImageMetadata | undefined {
  // Placeholder implementation - requires exif package
  // Install with: npm install exif @types/exif
  try {
    const stats = require('fs').statSync(imagePath)
    return {
      dateTaken: stats.birthtime.toISOString()
    }
  } catch (error) {
    return undefined
  }
}

function convertDMSToDD(dms: number[], ref: string): number {
  if (!dms || dms.length !== 3) return 0
  
  let dd = dms[0] + dms[1] / 60 + dms[2] / 3600
  if (ref === 'S' || ref === 'W') dd = dd * -1
  
  return dd
}

export function generateImageTags(filename: string, country: string, city: string): string[] {
  const tags = [country.toLowerCase(), city.toLowerCase()]
  
  // Extract potential tags from filename
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  const nameParts = nameWithoutExt.split(/[-_\s]+/)
  
  nameParts.forEach(part => {
    if (part.length > 2 && !tags.includes(part.toLowerCase())) {
      tags.push(part.toLowerCase())
    }
  })
  
  return tags
}

export function createImageThumbnails(imagePath: string, outputPath: string): Promise<void> {
  // This would require a library like sharp for image processing
  // For now, we'll create a placeholder implementation
  return Promise.resolve()
}

export function optimizeImage(imagePath: string): Promise<string> {
  // This would compress and optimize images
  // For now, return the original path
  return Promise.resolve(imagePath)
}

export function generateGalleryManifest(): string {
  const images = getAllGalleryImages()
  const manifest = {
    images: images.map(img => ({
      url: img.url,
      country: img.country,
      city: img.city,
      tags: img.tags,
      metadata: img.metadata
    })),
    totalImages: images.length,
    lastUpdated: new Date().toISOString()
  }
  
  return JSON.stringify(manifest, null, 2)
}