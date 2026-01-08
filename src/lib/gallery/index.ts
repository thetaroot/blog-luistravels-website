import { GalleryItem } from './types';

// Gallery items loaded from content system
const galleryItems: GalleryItem[] = [];

export function listGalleryItemSlugs(): string[] {
  return galleryItems.map(item => item.slug);
}

export function getGalleryItem(slug: string): GalleryItem | null {
  const item = galleryItems.find(item => item.slug === slug);
  return item || null;
}

export function listGalleryItems(): GalleryItem[] {
  return galleryItems;
}