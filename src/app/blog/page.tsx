import { listBlogPosts } from '@/lib/blog';
import BlogClientPage from './client-page';

export default async function BlogPage() {
  const posts = await listBlogPosts('de');

  return <BlogClientPage initialPosts={posts} />;
}