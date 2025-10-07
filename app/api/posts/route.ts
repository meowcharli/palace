import { NextResponse } from 'next/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { featuredPostsQuery, recentPostsQuery } from '@/sanity/lib/queries';

export async function GET() {
  try {
    const [featuredPosts, recentPosts] = await Promise.all([
      sanityFetch({ query: featuredPostsQuery }),
      sanityFetch({ query: recentPostsQuery })
    ]);

    return NextResponse.json({
      featuredPosts,
      recentPosts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}