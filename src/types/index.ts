export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  author: string
  tags: string[]
}

export interface Photo {
  id: string
  title: string
  description: string
  url: string
  price: number
  category: string
}

export interface AnimationSection {
  id: string
  type: 'worldmap' | 'about' | 'prutscheln' | 'blog' | 'content'
  duration: number
  title?: string | { en: string; de: string }
  content?: string[]
  showPolaroid?: boolean
  polaroidImage?: string
  showYouTube?: boolean
  showBlogPosts?: boolean
  showGalleryPreview?: boolean
  showContactButtons?: boolean
}

