import { listGalleryItems } from '@/lib/gallery/index';
import GalleryClientPage from './client-page';

export default function GalleryPage() {
  const initialItems = listGalleryItems();
  
  return <GalleryClientPage initialItems={initialItems} />;
}