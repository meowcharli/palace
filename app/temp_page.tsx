'use client';

import React, { useEffect, useState } from 'react';
import FeaturedPostsSlider from '@/components/FeaturedPostsSlider';
import RecentPostsGrid from '@/components/RecentPostsGrid';

interface Post {
  _id: string;
  title: string;
  excerpt?: string;
  slug: string;
  coverImage: string;
  coverImageAlt?: string;
  date: string;
}

interface PostsData {
  featuredPosts: Post[];
  latestPosts: Post[];
}

export default function Page() {
  const [postsData, setPostsData] = useState<PostsData>({ featuredPosts: [], latestPosts: [] });
  const [loading, setLoading] = useState(true);

  // Fetch posts data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/featured-posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data: PostsData = await res.json();
        setPostsData(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black" style={{ zIndex: 9999 }}></div>
    );
  }

  return (
    <div className="homepage-container">
      <FeaturedPostsSlider posts={postsData.featuredPosts} />
      <RecentPostsGrid posts={postsData.latestPosts} />
      
      <style jsx>{`
        .homepage-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
        }
        
        @media (max-width: 768px) {
          .homepage-container {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
