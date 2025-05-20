'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { GalleryItem } from '@/utils/types';
import Onboarding from './onboarding';
import Image from 'next/image';

export default function Page() {
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);

  // Check if the device is mobile on mount and when resizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Fetch gallery data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const galleryData: GalleryItem[] = await res.json();
        setAllGalleryItems(galleryData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle page transitions - memoized with useCallback
  const handlePageTransition = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Delay navigation to allow transition animation
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-5">
        <div className="text-center py-20">
          <div className="animate-spin h-24 w-24 border-t-4 border-b-4 border-l-4 border-r-4 border-black mx-auto"></div>
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
    <div className={`container mx-auto px-4 md:px-0 transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>

      {/* Cards */}
      <div className="mt-3 mb-3 md:mt-8 md:mb-8">
        <div className="flex justify-center">
          <div className="w-full md:w-5/7 lg:w-3/4 xl:w-2/3 flex flex-col-reverse md:flex-row md:grid md:grid-cols-3 md:gap-6">
            {/* About */}
            <Link 
              href="/about" 
              className="card-wrapper w-full mb-1 md:mb-0"
              onClick={(e) => handlePageTransition(e, '/about')}
              onMouseEnter={() => setIsAboutHovered(true)}
              onMouseLeave={() => setIsAboutHovered(false)}
            >
              <div className={`card-scalable about-card ${isMobile ? 'mobile-card' : ''}`}>
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image 
                    href={isAboutHovered ? "https://i.imgur.com/CRpeERR.gif" : "https://i.imgur.com/o1Vonsi.gif"} 
                    width="300" 
                    height="420" 
                    preserveAspectRatio="xMidYMid slice" 
                    className="about-image" 
                  />
                  <rect width="300" height="420" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">About</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F"></text>
                </svg>
              </div>
            </Link>

            {/* Contact */}
            <Link 
              href="/contact" 
              className="card-wrapper w-full mb-1 md:mb-0"
              onClick={(e) => handlePageTransition(e, '/contact')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/xVua8wQ.gif" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#f5f5f7">+</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#f5f5f7">Contact</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#f5f5f7"></text>
                </svg>
              </div>
            </Link>

            {/* Gallery */}
            <Link 
              href="/gallery" 
              className="card-wrapper w-full mb-1 md:mb-0"
              onClick={(e) => handlePageTransition(e, '/gallery')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/FheUxPW.gif" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">Gallery</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F"></text>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Card */}
            {isMobile && (
      <div className="mb-4 md:mb-10 mt-2 md:mt-4">
        <div className="flex justify-center">
          <div className="w-full md:w-5/7 lg:w-3/4 xl:w-2/3">
            <Link 
              href="/posts/signal-social-media-advertisement" 
              className="card-wrapper w-full"
              onClick={(e) => handlePageTransition(e, '/posts/signal-social-media-advertisement')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/AuOmVsO.png" width="300" height="420" preserveAspectRatio="xMidYMid slice" />
                  <rect width="300" height="420" fill="transparent" />
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#1D1D1F">Featured</text>
                  <text x="24" y="90" fontFamily="sans-serif" fontSize="11" fill="#3D3D3F">Signal | Ad</text>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
            )}

      {/* Desktop Card (hide this one on mobile) */}
      {!isMobile && (
      <div className="mb-4 md:mb-10 mt-2 md:mt-4">
        <div className="flex justify-center">
          <div className="w-full md:w-5/7 lg:w-3/4 xl:w-2/3">
            <Link 
              href="/posts/signal-social-media-advertisement" 
              className="card-wrapper w-full"
              onClick={(e) => handlePageTransition(e, '/posts/signal-social-media-advertisement')}
            >
              <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
                <svg viewBox="0 0 420 235" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/AuOmVsO.png" width="420" height="245" preserveAspectRatio="xMidYMid slice" />
                  <rect width="420" height="235" fill="transparent" />
                  <text x="17" y="25" fontFamily="sans-serif" fontSize="14" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="17" y="39" fontFamily="sans-serif" fontSize="11" fill="#1D1D1F">Featured</text>
                  <text x="17" y="48" fontFamily="sans-serif" fontSize="6.5" fill="#3D3D3F">Signal | Ad</text>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
      )}

      <style jsx>{`
        .card-wrapper {
          flex-shrink: 0;
          width: 100%;
          display: block;
          position: relative;
          transform-origin: center center;
        }
        .card-scalable {
          width: 100%;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1), filter 0.4s ease;
          overflow: hidden;
          will-change: transform, filter; /* Optimize for animation */
          transform: translateZ(0); /* Force GPU acceleration */
          filter: grayscale(100%); /* Apply grayscale by default */
        }
        .mobile-card {
          filter: grayscale(0%) !important; /* Always show in full color on mobile */
        }
        .card-svg {
          display: block;
          width: 100%;
          height: auto;
        }
        .about-image {
          transition: opacity 0.3s ease;
        }
        /* Apply hover effects only on non-mobile devices */
        @media (min-width: 768px) {
          .card-scalable:hover {
            transform: translateY(-3px) rotate(1deg);
            filter: grayscale(0%); /* Remove grayscale on hover */
          }
          /* Apply zoom effect to all cards except the about card */
          .card-scalable:not(.about-card):hover .card-svg image {
            transform: scale(1.06);
          }
        }
        .card-scalable .card-svg image:not(.about-image) {
          transition: transform 0.3s ease, filter 0.3s ease;
          transform-origin: center center;
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
            width: 100%;
            margin-right: 0;
            margin-bottom: 1px;
          }
          .featured-content {
            padding: 0;
            margin: 0;
            width: 100%;
          }
          .card-svg {
            height: auto;
            max-height: none;
            width: 100%; /* Use 100% width instead of viewport calculation */
          }
          .card-wrapper:last-child {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}