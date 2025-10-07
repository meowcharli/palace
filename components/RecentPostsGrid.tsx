'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  coverImageAlt?: string;
}

export default function RecentPostsGrid({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return null;
  }
  
  return (
    <div className="recent-posts-container">
      <h2 className="recent-posts-heading">Recent Posts</h2>
      <div className="recent-posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="recent-post-card">
            <Link href={`/posts/${post.slug}`}>
              <div className="recent-post-image-wrapper">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="recent-post-image"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .recent-posts-container {
          padding: 0 1rem;
          margin-bottom: 4rem;
        }
        
        .recent-posts-heading {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }
        
        .recent-posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        
        .recent-post-card {
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .recent-post-card:hover {
          transform: translateY(-5px);
        }
        
        .recent-post-image-wrapper {
          position: relative;
          height: 0;
          padding-bottom: 66.67%; /* 3:2 aspect ratio */
          overflow: hidden;
          background-color: #101010;
        }
        
        .recent-post-image {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .recent-post-card:hover .recent-post-image {
          transform: scale(1.05);
        }
        
        @media (max-width: 1024px) {
          .recent-posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 640px) {
          .recent-posts-grid {
            grid-template-columns: 1fr;
          }
          
          .recent-posts-heading {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}