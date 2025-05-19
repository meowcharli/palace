'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import FeaturedItemComponent from './FeaturedItemComponent';
import type { GalleryItem } from '@/utils/types';
import Onboarding from './onboarding';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Page() {
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile on mount and when resizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Handle page transitions
  const handlePageTransition = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Delay navigation to allow transition animation
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  };

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
    <div className={`container mx-auto px-0 md:px-5 transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="featured-content mx-auto w-full px-0 pb-3 pt-4 sm:w-11/12 sm:px-2 sm:pt-4 md:w-4/5 md:px-5 md:pb-1.5 lg:w-1/2 lg:px-6">
        {activeItem && (
          <div className="relative">
            <FeaturedItemComponent item={activeItem} />
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="mt-4 md:mt-0 mb-8 md:mb-7">
        <div className="flex justify-center">
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 flex overflow-x-auto scrollbar-hide md:overflow-visible pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-6 snap-x snap-mandatory px-4 md:px-0">
            {/* About */}
            <Link 
              href="/about" 
              className="card-wrapper min-w-[250px] md:min-w-0 mr-4 md:mr-0 snap-center"
              onClick={(e) => handlePageTransition(e, '/about')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/QX9A5Ih.jpg" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" rx="12" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">About us</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">click this card to learn</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">more about us!</text>
                </svg>
              </div>
            </Link>

            {/* Contact */}
            <Link 
              href="/contact" 
              className="card-wrapper min-w-[250px] md:min-w-0 mr-4 md:mr-0 snap-center"
              onClick={(e) => handlePageTransition(e, '/contact')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
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
            <Link 
              href="/gallery" 
              className="card-wrapper min-w-[250px] md:min-w-0 snap-center"
              onClick={(e) => handlePageTransition(e, '/gallery')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
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
      <div className="mb-10 md:mb-12">
        <div className="flex justify-center px-4 md:px-0">
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
            <Link 
              href="/posts/signal-social-media-advertisement" 
              className="blog-card-wrapper"
              onClick={(e) => handlePageTransition(e, '/posts/signal-social-media-advertisement')}
            >
              <div className={`blog-card-scalable ${isMobile ? 'mobile-card' : ''}`}>
                {/* Container with responsive aspect ratio */}
                <div className="relative w-full aspect-square md:aspect-video overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-200/70 via-transparent to-transparent z-10"></div>
                  <img
                    src="https://i.imgur.com/AuOmVsO.png"
                    alt="Recent project"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out transform"
                  />
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20">
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
        .mobile-card {
          filter: grayscale(0%) !important; /* Always show in full color on mobile */
        }
        .card-svg {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
        /* Apply hover effects only on non-mobile devices */
        @media (min-width: 768px) {
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
          .card-scalable:hover img,
          .blog-card-scalable:hover img,
          .card-scalable:hover .card-svg image {
            transform: scale(1.06);
          }
        }
        .card-scalable img,
        .blog-card-scalable img,
        .card-svg image {
          transition: transform 0.3s ease, filter 0.3s ease;
          transform-origin: center center;
        }
        /* Increase the blog teaser image size to 101% */
        .blog-card-scalable img {
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
            width: 90%;
            margin-right: 15px;
          }
          .card-wrapper:last-child {
            margin-right: 0;
          }
          .featured-content {
            padding: 0;
            margin: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}