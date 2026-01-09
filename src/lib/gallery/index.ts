import type { GalleryItem } from './types';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

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

export async function getGalleryAlbums(): Promise<string[]> {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/gallery-index.json');
    const data = await readFile(dataPath, 'utf-8');
    const galleryIndex = JSON.parse(data);
    return galleryIndex.albums || [];
  } catch (error) {
    console.error('Error loading gallery albums:', error);
    return [];
  }
}

export async function getGalleryAlbum(album: string): Promise<{ name: string; images: any[] } | null> {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/gallery-index.json');
    const data = await readFile(dataPath, 'utf-8');
    const galleryIndex = JSON.parse(data);
    const images = galleryIndex.images?.filter((img: any) => img.album === album) || [];
    return images.length > 0 ? { name: album, images } : null;
  } catch (error) {
    console.error(`Error loading album ${album}:`, error);
    return null;
  }
}

export async function getGalleryImages(): Promise<any[]> {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/gallery-index.json');
    const data = await readFile(dataPath, 'utf-8');
    const galleryIndex = JSON.parse(data);
    return galleryIndex.images || [];
  } catch (error) {
    console.error('Error loading gallery images:', error);
    return [];
  }
}
