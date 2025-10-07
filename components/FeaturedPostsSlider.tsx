'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedPost {
  _id: string;
  title: string;
  excerpt?: string;
  slug: string;
  coverImage: string;
  coverImageAlt?: string;
  date: string;
}

export default function FeaturedPostsSlider({ posts }: { posts: FeaturedPost[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (posts.length <= 1) return;
    
    // Auto-rotate featured posts every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [posts.length]);
  
  if (!posts || posts.length === 0) {
    return <div className="featured-placeholder">No featured posts available</div>;
  }
  
  return (
    <div className="featured-posts-slider">
      {posts.map((post, index) => (
        <div 
          key={post._id} 
          className={`featured-post ${index === currentIndex ? 'active' : ''}`}
        >
          <Link href={`/posts/${post.slug}`}>
            <div className="featured-post-image-container">
              <Image 
                src={post.coverImage} 
                alt={post.coverImageAlt || post.title}
                fill
                priority={index === currentIndex}
                sizes="100vw"
                className="featured-post-image"
              />
              <div className="featured-post-overlay">
                <h2 className="featured-post-title">{post.title}</h2>
              </div>
            </div>
          </Link>
        </div>
      ))}
      
      {posts.length > 1 && (
        <div className="slider-dots">
          {posts.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .featured-posts-slider {
          position: relative;
          width: 100%;
          height: 70vh;
          max-height: 800px;
          min-height: 400px;
          background: #000;
          margin-bottom: 2rem;
        }
        
        .featured-post {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.8s ease;
          z-index: 1;
        }
        
        .featured-post.active {
          opacity: 1;
          z-index: 2;
        }
        
        .featured-post-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .featured-post-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          color: white;
        }
        
        .featured-post-title {
          font-size: 2.5rem;
          margin: 0;
        }
        
        .slider-dots {
          position: absolute;
          bottom: 1.5rem;
          right: 2rem;
          display: flex;
          gap: 0.5rem;
          z-index: 3;
        }
        
        .slider-dot {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.4);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .slider-dot.active {
          background-color: rgba(255,255,255,1);
        }
        
        .featured-placeholder {
          width: 100%;
          height: 400px;
          background: #000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .featured-posts-slider {
            height: 50vh;
            min-height: 300px;
          }
          
          .featured-post-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}