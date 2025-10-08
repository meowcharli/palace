'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImage?: any;
  date: string;
  excerpt?: string;
}

export default function Page() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        
        setFeaturedPosts(data.featuredPosts || []);
        setRecentPosts(data.recentPosts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Shuffle through featured posts every 4 seconds
  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentFeatured = featuredPosts[currentFeaturedIndex];

  return (
    <div className="min-h-screen bg-black text-white" style={{ paddingTop: '60px' }}>
      {/* Featured Post Hero */}
      {currentFeatured && (
        <div className="px-2 md:px-4 lg:px-6" style={{ marginTop: window.innerWidth < 768 ? '-35px' : '-20px' }}>
          <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden rounded-xl">
            <Link href={`/posts/${currentFeatured.slug}`}>
              <div className="relative w-full h-full cursor-pointer">
                {currentFeatured.coverImage && (
                  <img
                    src={urlForImage(currentFeatured.coverImage)?.width(1920).height(1080).url()}
                    alt={currentFeatured.coverImage.alt || currentFeatured.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                
                {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16">
                <div className="max-w-4xl">
                  <h1 className="text-2xl md:text-4xl lg:text-6xl font-medium text-white mb-2 md:mb-4 leading-tight">
                    {currentFeatured.title}
                  </h1>
                  {currentFeatured.excerpt && (
                    <p className="text-sm md:text-lg text-white/90 max-w-2xl">
                      {currentFeatured.excerpt}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Featured indicator dots */}
              {featuredPosts.length > 1 && (
                <div className="absolute bottom-8 right-8 flex space-x-2">
                  {featuredPosts.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentFeaturedIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentFeaturedIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
        </div>
      )}

      {/* Recent Posts Grid */}
      <div className="py-16 px-8 md:px-16">
        <h2 className="text-2xl font-medium mb-12">Recent Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <Link key={post._id} href={`/posts/${post.slug}`}>
              <div className="cursor-pointer">
                <div className="relative overflow-hidden bg-gray-900 rounded-lg" style={{ aspectRatio: '5/4' }}>
                  {post.coverImage && (
                    <img
                      src={urlForImage(post.coverImage)?.width(600).height(480).url()}
                      alt={post.coverImage.alt || post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}