export interface GalleryItem {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  location: string;
  country: string;
  date: string;
  tags: string[];
  blogPostSlug?: string; // Optional blog post reference
  highResUrl?: string; // Optional high resolution image URL
}