'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import FeaturedItemComponent from './FeaturedItemComponent';
import type { GalleryItem } from '@/utils/types';
import Onboarding from './onboarding';
import Image from 'next/image';

export default function Page() {
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const galleryData: GalleryItem[] = await res.json();
        setAllGalleryItems(galleryData);
        const featured = galleryData.find((item) => item.featured);
        setActiveItem(featured || galleryData[0] || null);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-5">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!allGalleryItems || allGalleryItems.length === 0) {
    return (
      <div className="container mx-auto px-5">
        <Onboarding />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5">
      <div className="featured-content mx-auto w-full px-1 pb-4 pt-6 sm:w-11/12 sm:px-2 sm:pt-4 md:w-4/5 md:px-5 md:pb-8 lg:w-1/2 lg:px-6">
        {activeItem && (
          <div className="relative">
            <FeaturedItemComponent item={activeItem} />
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="mt-8 mb-7">
        <div className="flex justify-center">
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 flex overflow-x-auto scrollbar-hide md:overflow-visible pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-6 snap-x snap-mandatory">
            {/* About */}
            <Link href="/about" className="card-wrapper min-w-[210px] md:min-w-0 mr-4 md:mr-0 snap-center">
              <div className="card-scalable">
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/duWh9AI.png" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" rx="12" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">About us</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">click this card to learn</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">more about us!</text>
                </svg>
              </div>
            </Link>

            {/* Contact */}
            <Link href="/contact" className="card-wrapper min-w-[210px] md:min-w-0 mr-4 md:mr-0 snap-center">
              <div className="card-scalable">
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/KqZk8F8.png" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" rx="12" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#f5f5f7">Contact us</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#f5f5f7">click this card and let&apos;s</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#f5f5f7">make something new!</text>
                </svg>
              </div>
            </Link>

            {/* Gallery */}
            <Link href="/gallery" className="card-wrapper min-w-[210px] md:min-w-0 snap-center">
              <div className="card-scalable">
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/EZLr9cU.jpeg" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" rx="12" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">Full Gallery</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">click this card to view all</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">our stuff!</text>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Blog teaser - now with image */}
      <div className="mb-10 md:mb-12"> {/* Reduced vertical padding */}
        <div className="flex justify-center px-4 md:px-0"> {/* Added horizontal padding on mobile */}
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
            <Link href="/posts/signal-social-media-advertisement" className="blog-card-wrapper">
              <div className="blog-card-scalable">
                {/* Container with responsive aspect ratio */}
                <div className="relative w-full aspect-square md:aspect-video overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-200/70 via-transparent to-transparent z-10"></div>
                  <img
                    src="https://i.imgur.com/AuOmVsO.png"
                    alt="Recent project"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transformduration-500 ease-in-out transform"
                  />
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20"> {/* Reduced text padding */}
                    <h2 className="text-black text-lg md:text-xl lg:text-2xl font-semibold leading-tight">
                      View a recent project of ours!
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      

      <style jsx>{`
        .card-wrapper {
          flex-shrink: 0;
          width: 100%;
          display: block;
          position: relative;
          transform-origin: center center;
        }
        .blog-card-wrapper {
          display: block;
          position: relative;
          width: 100%;
          transform-origin: center center;
        }
        .card-scalable,
        .blog-card-scalable {
          width: 100%;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0, 0.2, 1), filter 0.4s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          overflow: hidden;
          will-change: transform, filter; /* Optimize for animation */
          transform: translateZ(0); /* Force GPU acceleration */
          filter: grayscale(90%); /* Apply grayscale by default */
        }
        .card-svg {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
        .card-scalable:hover {
          transform: translateY(-3px) rotate(1deg);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          filter: grayscale(0%); /* Remove grayscale on hover */
        }
        .blog-card-scalable:hover {
          transform: translateY(-3px) rotate(0.5deg);
          box-shadow: 0 10px 15px rgba(255, 255, 255, 0.1);
          filter: grayscale(0%); /* Remove grayscale on hover */
        }
        .card-scalable img,
        .blog-card-scalable img,
        .card-svg image {
          transition: transform 0.3s ease, filter 0.3s ease;
          transform-origin: center center;
        }
        .card-scalable:hover img,
        .blog-card-scalable:hover img,
        .card-scalable:hover .card-svg image {
          transform: scale(1.03);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 767px) {
          .card-wrapper {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
}