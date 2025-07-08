'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { GalleryItem } from '@/utils/types';
import Onboarding from './onboarding';

export default function Page() {
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileCheck = width < 768;
      setIsMobile(isMobileCheck);
    };
    
    checkMobile();
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
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
        setTimeout(() => {
          setCardsLoaded(true);
        }, 200);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white" style={{ zIndex: 9999 }}></div>
    );
  }

  if (!allGalleryItems || allGalleryItems.length === 0) {
    return (
      <div className="container mx-auto px-0">
        <Onboarding />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Grid Container */}
      <div className="grid-container">
        {/* Desktop: Featured Card at top, Mobile: Will be repositioned */}
        {!isMobile && (
          <div className={`featured-item card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ animationDelay: '0.1s' }}>
            <Link href="/posts/banknote" className="card-wrapper">
              <div className="card-scalable featured-card">
                <div className="vimeo-wrapper">
                  <iframe
                    src="https://player.vimeo.com/video/1099244012?autoplay=1&loop=1&title=0&byline=0&portrait=0&controls=0&muted=1&background=1&quality=1080p"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="vimeo-iframe"
                    style={{ pointerEvents: 'none' }}
                  ></iframe>
                  <div className="overlay-content">
                    <div className="text-overlay">
                      <span className="plus-sign">+</span>
                      <span className="featured-text">Featured</span>
                      <span className="subtitle-text">NBS | Banknote</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Three Cards Row */}
        <div className="three-cards-row">
          {/* Typography Card */}
          <div className={`card-item card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ animationDelay: isMobile ? '0.1s' : '0.3s' }}>
            <Link href="/gallery" className="card-wrapper">
              <div className="card-scalable typography-card">
                <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/FheUxPW.gif" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                  <rect width="345" height="483" fill="transparent" />
                  <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#1D1D1F">Typography</text>
                </svg>
              </div>
            </Link>
          </div>

          {/* Visuals Card */}
          <div className={`card-item card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ animationDelay: isMobile ? '0.2s' : '0.4s' }}>
            <Link href="/showcase" className="card-wrapper">
              <div className="card-scalable visuals-card">
                <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/U2gmmAY.gif" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                  <rect width="345" height="483" fill="transparent" />
                  <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#fDfDfF">+</text>
                  <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#fDfDfF">Visuals</text>
                </svg>
              </div>
            </Link>
          </div>

          {/* About Card */}
          <div className={`card-item card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ animationDelay: isMobile ? '0.3s' : '0.2s' }}>
            <Link 
              href="/about"
              className="card-wrapper"
              onMouseEnter={() => setIsAboutHovered(true)}
              onMouseLeave={() => setIsAboutHovered(false)}
            >
              <div className="card-scalable about-card">
                <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image 
                    href={isAboutHovered ? "https://i.imgur.com/CRpeERR.gif" : "https://i.imgur.com/o1Vonsi.gif"} 
                    width="345" 
                    height="483" 
                    preserveAspectRatio="xMidYMid slice" 
                  />
                  <rect width="345" height="483" fill="transparent" />
                  <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#1D1D1F">About</text>
                </svg>
              </div>
            </Link>
          </div>

          {/* Featured Card - Mobile Only (appears after About card) */}
          {isMobile && (
            <div className={`card-item card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ animationDelay: '0.4s' }}>
              <Link href="/posts/banknote" className="card-wrapper">
                <div className="card-scalable featured-card">
                  <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                    <image href="https://i.imgur.com/RaWGLkI.jpeg" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                    <rect width="345" height="483" fill="transparent" />
                    <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#F4FFF4">+</text>
                    <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#F4FFF4">Featured</text>
                    <text x="28" y="104" fontFamily="sans-serif" fontSize="13" fill="#DEFFDE">NBS | Banknote</text>
                  </svg>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Contact Card */}
        <div className={`contact-item card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ animationDelay: '0.5s' }}>
          <Link href="/contact" className="card-wrapper">
            <div className="card-scalable contact-card">
              {isMobile ? (
                <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/xVua8wQ.gif" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                  <rect width="345" height="483" fill="transparent" />
                  <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#f5f5f7">+</text>
                  <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#f5f5f7">Contact</text>
                </svg>
              ) : (
                <svg viewBox="0 0 483 200" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/qZWh0Bt.png" width="483" height="282" preserveAspectRatio="xMidYMid slice" />
                  <rect width="483" height="282" fill="transparent" />
                  <text x="11" y="20" fontFamily="sans-serif" fontSize="13" fontWeight="600" fill="#f5f5f7">+</text>
                  <text x="11" y="33" fontFamily="sans-serif" fontSize="11" fill="#f5f5f7">Contact</text>
                </svg>
              )}
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .grid-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 0;
          margin: 0;
        }

        .featured-item {
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .three-cards-row {
          display: flex;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .card-item {
          flex: 1;
          padding: 0;
          margin: 0;
        }

        .contact-item {
          width: 100%;
          padding: 0;
          margin: 0;
        }

        /* Improved Vimeo video container */
        .vimeo-wrapper {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
          background: #000;
        }

        .vimeo-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          transform: scale(1.1); /* Slight scale to ensure full coverage */
          transform-origin: center center;
          pointer-events: none; /* This prevents the iframe from capturing clicks */
        }

        .overlay-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .text-overlay {
          position: absolute;
          top: 30px;
          left: 38px;
        }

        .plus-sign {
          display: block;
          font-family: sans-serif;
          font-size: 42px;
          font-weight: 600;
          color:rgb(255, 255, 255);
          line-height: 1;
        }

        .featured-text {
          display: block;
          font-family: sans-serif;
          font-size: 42px;
          color:rgb(255, 255, 255);
          line-height: 1;
          margin-top: 2px;
        }

        .subtitle-text {
          display: block;
          font-family: sans-serif;
          font-size: 22px;
          color:rgba(255, 255, 255, 0.75);
          line-height: 1;
          margin-top: 2px;
        }

        .featured-card {
          cursor: pointer;
        }

        /* Desktop specific styles */
        @media (min-width: 768px) {
          .grid-container {
            max-width: 100vw;
            margin: 0;
            padding: 0;
            gap: 0;
          }

          .three-cards-row {
            gap: 0;
          }

          /* Adjust aspect ratio for desktop featured card */
          .featured-item .vimeo-wrapper {
            padding-bottom: calc(271.7 / 483 * 100%); /* Match your original dimensions */
          }
        }
        
        .card-animate:not(.card-loaded) {
          transform: translateY(20px);
          opacity: 0;
        }
        
        .card-animate {
          transition: transform 0.6s ease-out, opacity 0.6s ease-out;
          opacity: 1;
        }
        
        .card-wrapper {
          display: block;
          position: relative;
          width: 100%;
          height: auto;
          transform-origin: center center;
          transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1);
        }
        
        .card-scalable {
          width: 100%;
          position: relative;
          transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1), filter 0.4s ease;
          overflow: hidden;
          will-change: transform, filter;
          transform: translateZ(0);
          filter: grayscale(100%);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          border-radius: 0px;
        }
        
        .about-card {
          filter: grayscale(100%) brightness(0.98) !important;
        }
        
        .featured-card {
          filter: grayscale(0%) !important;
        }

        .contact-card {
          filter: grayscale(0%) !important;
        }
        
        .card-svg {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 0px;
        }
        
        @media (min-width: 768px) {
          .card-scalable:hover {
            filter: grayscale(0%);
          }
          .about-card:hover {
            filter: grayscale(0%) brightness(1) !important;
          }
          
          .card-scalable:not(.about-card):not(.featured-card):not(.visuals-card):not(.contact-card):hover .card-svg image {
            transform: scale(1.06);
          }
          
          /* Add slight zoom effect to contact card */
          .contact-card:hover .card-svg image {
            transform: scale(1.005);
          }
          
          /* Add rotation effect to typography card */
          .typography-card:hover .card-svg image {
            transform: rotate(2deg);
          }
        }
        
        .card-scalable .card-svg image {
          transition: transform 0.3s ease, filter 0.3s ease;
          transform-origin: center center;
        }
        
        /* Mobile styles */
        @media (max-width: 767px) {
          .grid-container {
            padding: 0;
            gap: 0;
            margin: 0;
          }

          .three-cards-row {
            flex-direction: column;
            gap: 0;
          }

          .card-scalable {
            filter: none !important;
            transform: none !important;
            transition: none !important;
            margin: 0;
            padding: 0;
          }
          
          .card-scalable:hover {
            transform: none !important;
            filter: none !important;
          }
          
          .card-scalable .card-svg image {
            transform: none !important;
            transition: none !important;
          }
          
          .card-animate:not(.card-loaded) {
            transform: translateY(140px) !important;
            opacity: 1 !important;
          }

          /* Hide vimeo wrapper on mobile since you're using static image */
          .vimeo-wrapper {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}