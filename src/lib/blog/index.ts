import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { BlogPost } from './types';

export async function listBlogPosts(language: 'en' | 'de' = 'en'): Promise<BlogPost[]> {
  try {
    // Try to read from data file first (build-time generated)
    const dataPath = path.join(process.cwd(), 'src/data/blog-index.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const blogIndex = JSON.parse(data);
    
    // Early return if no posts
    if (!blogIndex.posts || blogIndex.posts.length === 0) {
      return [];
    }
    
    // Convert to our BlogPost type and add content
    const posts = await Promise.all(
      blogIndex.posts.map(async (post: any) => {
        const content = await getPostContent(post.slug);
        return {
          slug: post.slug,
          title: post.title,
          date: post.date,
          tags: post.tags || [],
          excerpt: `Exploring ${post.city}, ${post.country}...`,
          gallery: post.gallery ? [post.gallery] : undefined,
          content: content,
          language: language,
        };
      })
    );
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

async function getPostContent(slug: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { content } = matter(fileContent);
    
    const processedContent = await remark().use(html).process(content);
    return processedContent.toString();
  } catch (error) {
    console.error(`Error loading content for ${slug}:`, error);
    return '<p>Content could not be loaded.</p>';
  }
}

export async function getBlogPost(slug: string, language: 'en' | 'de' = 'en'): Promise<BlogPost> {
  const posts = await listBlogPosts(language);
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    throw new Error(`Post not found for slug: ${slug}`);
  }
  
  return post;
}

export async function listBlogPostSlugs(): Promise<string[]> {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/blog-index.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const blogIndex = JSON.parse(data);
    return blogIndex.posts.map((post: any) => post.slug);
  } catch (error) {
    console.error('Error loading blog slugs:', error);
    return [];
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const posts = await listBlogPosts();
    const categories = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => categories.add(tag));
    });
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error getting blog categories:', error);
    return [];
  }
}

export async function getBlogCategory(category: string): Promise<{ name: string; count: number } | null> {
  try {
    const posts = await listBlogPosts();
    const postsInCategory = posts.filter(post => post.tags?.includes(category));
    return postsInCategory.length > 0 ? { name: category, count: postsInCategory.length } : null;
  } catch (error) {
    console.error(`Error getting category ${category}:`, error);
    return null;
  }
}

export async function getBlogPostsByCategory(category: string, language: 'en' | 'de' = 'en'): Promise<BlogPost[]> {
  try {
    const posts = await listBlogPosts(language);
    return posts.filter(post => post.tags?.includes(category));
  } catch (error) {
    console.error(`Error getting posts for category ${category}:`, error);
    return [];
  }
}

export async function getAllBlogTags(): Promise<string[]> {
  return getBlogCategories();
}

export async function getBlogTag(tag: string): Promise<{ name: string; count: number } | null> {
  return getBlogCategory(tag);
}

export async function getBlogPostsByTag(tag: string, language: 'en' | 'de' = 'en'): Promise<BlogPost[]> {
  return getBlogPostsByCategory(tag, language);
}

export { listBlogPosts as getBlogPosts };