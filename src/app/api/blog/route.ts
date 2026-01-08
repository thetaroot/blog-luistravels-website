import { NextRequest, NextResponse } from 'next/server'
import { listBlogPosts } from '@/lib/blog'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') as 'en' | 'de' || 'en'
    
    const posts = await listBlogPosts(language)
    
    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    })
  } catch (error) {
    console.error('API Error loading blog posts:', error)
    return NextResponse.json({
      success: false,
      posts: [],
      count: 0,
      error: 'Failed to load blog posts'
    }, { status: 500 })
  }
}