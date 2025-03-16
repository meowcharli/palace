// app/(blog)/page.tsx - Updated with image stack layout
import Link from 'next/link';
import { Suspense } from 'react';

import CoverImage from './cover-image';
import Onboarding from './onboarding';

import { sanityFetch } from '@/sanity/lib/fetch';
import { moreStoriesQuery } from '@/sanity/lib/queries';

// Simplified Image Stack component
function ImageStack({ posts }: { 
  posts: Array<{
    _id: string;
    title: string;
    slug: string | null;
    coverImage: any;
    videoEmbed?: any;
  }>
}) {
  if (!posts || posts.length === 0) {
    return null;
  }
  
  return (
    <div className="image-stack">
      {posts.map((post) => (
        <div key={post._id} className="image-stack-item">
          <Link href={`/posts/${post.slug || ''}`}>
            <CoverImage 
              image={post.coverImage} 
              videoEmbed={post.videoEmbed || undefined} 
              priority={posts.indexOf(post) < 2} 
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

// Content wrapper component
function PageContent({ posts }: { 
  posts: Array<{
    _id: string;
    title: string;
    slug: string | null;
    coverImage: any;
    videoEmbed?: any;
  }>;
}) {
  // If no posts, show onboarding
  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto">
        <Suspense fallback={<div className="py-60 text-center">Loading...</div>}>
          <Onboarding />
        </Suspense>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-5">
      <ImageStack posts={posts} />
    </div>
  );
}

export default async function Page() {
  // Fetch all posts
  const posts = await sanityFetch({ 
    query: moreStoriesQuery, 
    params: { skip: '', limit: 100 } // Fetch posts, adjust limit as needed
  });

  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center text-white">Loading...</div>}>
      <PageContent posts={posts} />
    </Suspense>
  );
}
