import fs from 'fs'
import path from 'path'

export interface GalleryImage {
  filename: string
  title: string
  description: string
  date: string
  location?: string
  tags: string[]
  width?: number
  height?: number
}

export interface GalleryMetadata {
  images: GalleryImage[]
}

const galleryDirectory = path.join(process.cwd(), 'public/gallery')
const metadataPath = path.join(process.cwd(), 'content/gallery/metadata.json')

export function getGalleryImages(): GalleryImage[] {
  // Check if metadata exists
  if (!fs.existsSync(metadataPath)) {
    // Return empty array if no metadata yet
    return []
  }

  const metadataContents = fs.readFileSync(metadataPath, 'utf8')
  const metadata: GalleryMetadata = JSON.parse(metadataContents)

  // Filter out images that don't exist
  return metadata.images.filter(image => {
    const imagePath = path.join(galleryDirectory, image.filename)
    return fs.existsSync(imagePath)
  })
}

export function getImageUrl(filename: string): string {
  return `/gallery/${filename}`
}