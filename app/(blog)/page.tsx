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
  const [containerDimensions, setContainerDimensions] = useState({ width: 1920, height: 1080 });
  const [dragPosition, setDragPosition] = useState({ x: 160, y: 870 });
  const [isDragging, setIsDragging] = useState(false);

  // Check if the device is mobile and calculate container dimensions
  useEffect(() => {
    const checkMobileAndDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobileCheck = width < 768;
      
      setIsMobile(isMobileCheck);
      
      if (!isMobileCheck) {
        // For desktop, use 16:9 aspect ratio as base
        const targetAspectRatio = 16 / 9;
        const currentAspectRatio = width / height;
        
        // Scale based on viewport while maintaining 16:9 proportions
        let containerWidth, containerHeight;
        
        if (currentAspectRatio > targetAspectRatio) {
          // Screen is wider than 16:9, scale based on height
          containerHeight = height;
          containerWidth = height * targetAspectRatio;
        } else {
          // Screen is narrower than or equal to 16:9, scale based on width
          containerWidth = width;
          containerHeight = width / targetAspectRatio;
        }
        
        setContainerDimensions({ 
          width: containerWidth, 
          height: containerHeight 
        });
      }
    };
    
    checkMobileAndDimensions();
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobileAndDimensions, 100);
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

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    
    setIsDragging(true);
    const startX = e.clientX - dragPosition.x;
    const startY = e.clientY - dragPosition.y;

    const handleMouseMove = (e: MouseEvent) => {
      setDragPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Calculate responsive positions based on container dimensions
  const getResponsivePosition = (basePosition: any) => {
    if (isMobile) return basePosition.mobile;
    
    const scaleX = containerDimensions.width / 1920; // Base design width
    const scaleY = containerDimensions.height / 1080; // Base design height
    
    return {
      top: basePosition.desktop.top * scaleY,
      left: basePosition.desktop.left !== undefined ? basePosition.desktop.left * scaleX : undefined,
      right: basePosition.desktop.right !== undefined ? basePosition.desktop.right * scaleX : undefined,
    };
  };

  // Card positions configuration - Swapped About and Gallery positions
  const cardPositions = {
    about: {
      desktop: { top: 40, left: 65 }, // Moved to former Gallery position (Slot 2)
      mobile: { top: 0, left: 0 }
    },
    gallery: {
      desktop: { top: -40, left: 680 }, // Moved to former About position (Slot 1)
      mobile: { top: 0, left: 0 }
    },
    galleryDuplicate: {
      desktop: { top: 10, left: 1290 }, // Slot 3 - unchanged
      mobile: { top: 0, left: 0 }
    },
    contact: {
      desktop: { top: 870, left: 90 }, // Business Card - unchanged
      mobile: { top: 0, left: 0 }
    },
    featured: {
      desktop: { top: 790, right: 90 }, // 16:9 - unchanged
      mobile: { top: 0, left: 0 }
    }
  };

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

  const aboutPos = getResponsivePosition(cardPositions.about);
  const galleryPos = getResponsivePosition(cardPositions.gallery);
  const galleryDuplicatePos = getResponsivePosition(cardPositions.galleryDuplicate);
  const contactPos = getResponsivePosition(cardPositions.contact);
  const featuredPos = getResponsivePosition(cardPositions.featured);

  // Calculate responsive padding based on featured card position
  const getResponsivePadding = () => {
    if (isMobile) return '0';
    
    const featuredCardHeight = 270 * (containerDimensions.height / 1080); // Scaled card height
    const featuredCardBottom = featuredPos.top + featuredCardHeight;
    const additionalPadding = 550 * (containerDimensions.height / 1080); // Scaled padding
    
    return `${featuredCardBottom + additionalPadding}px`;
  };

  return (
    <div className="px-0 md:px-0 min-h-screen relative">
      <div 
        className="relative w-full h-full mx-auto"
        style={!isMobile ? {
          width: containerDimensions.width,
          height: containerDimensions.height,
          maxWidth: '100vw',
          maxHeight: '100vh',
          paddingBottom: getResponsivePadding()
        } : {}}
      >
        
        {/* Draggable Image - Desktop Only */}
        {!isMobile && (
          <div 
            className="absolute draggable-image"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              zIndex: 20,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
          >
            <img 
              src="https://i.imgur.com/JqD6tLw.png" 
              alt="Draggable item"
              className="draggable-img"
              draggable={false}
            />
          </div>
        )}

        {/* Visuals */}
        <div className={`absolute card-container card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ 
          top: `${galleryDuplicatePos.top}px`, 
          left: galleryDuplicatePos.left !== undefined ? `${galleryDuplicatePos.left}px` : undefined,
          right: galleryDuplicatePos.right !== undefined ? `${galleryDuplicatePos.right}px` : undefined,
          transform: isMobile ? 'none' : 'rotate(0deg)',
          zIndex: 2, // Increased z-index to be above SWAP ME card
          animationDelay: '0.1s',
          order: isMobile ? 2 : 'unset'
        }}>
          <Link href="/showcase" className="card-wrapper">
            <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
              <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                <image href="https://i.imgur.com/U2gmmAY.gif" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                <rect width="345" height="483" fill="transparent" />
                <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#fDfDfF">+</text>
                <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#fDfDfF">Visuals</text>
              </svg>
            </div>
          </Link>
        </div>

        {/* Typography Card */}
        <div className={`absolute card-container card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ 
          top: `${galleryPos.top}px`, 
          left: galleryPos.left !== undefined ? `${galleryPos.left}px` : undefined,
          right: galleryPos.right !== undefined ? `${galleryPos.right}px` : undefined,
          transform: isMobile ? 'none' : 'rotate(0deg)', // Using About's original rotation
          zIndex: 3, // Lower z-index to be below Gallery duplicate
          animationDelay: '0.2s',
          order: isMobile ? 1 : 'unset'
        }}>
          <Link href="/gallery" className="card-wrapper">
            <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
              <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                <image href="https://i.imgur.com/FheUxPW.gif" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                <rect width="345" height="483" fill="transparent" />
                <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#1D1D1F">+</text>
                <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#1D1D1F">Typography</text>
              </svg>
            </div>
          </Link>
        </div>

        {/* About Card - Order 3 in mobile */}
        <div className={`absolute card-container card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ 
          top: `${aboutPos.top}px`, 
          left: aboutPos.left !== undefined ? `${aboutPos.left}px` : undefined,
          right: aboutPos.right !== undefined ? `${aboutPos.right}px` : undefined,
          transform: isMobile ? 'none' : 'rotate(0deg)', // Using Gallery's original rotation
          zIndex: 2, // Using Gallery's original z-index
          animationDelay: '0.3s',
          order: isMobile ? 3 : 'unset'
        }}>
          <Link 
            href="/about"
            className="card-wrapper"
            onMouseEnter={() => setIsAboutHovered(true)}
            onMouseLeave={() => setIsAboutHovered(false)}
          >
            <div className={`card-scalable about-card ${isMobile ? 'mobile-card' : ''}`}>
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

        {/* Business Card Style Contact Card - Order 4 in mobile */}
        <div className={`absolute card-container business-card card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ 
          top: `${contactPos.top}px`, 
          left: contactPos.left !== undefined ? `${contactPos.left}px` : undefined,
          right: contactPos.right !== undefined ? `${contactPos.right}px` : undefined,
          transform: isMobile ? 'none' : 'rotate(0deg)',
          zIndex: 0,
          animationDelay: '0.4s',
          order: isMobile ? 4 : 'unset'
        }}>
          <Link href="/contact" className="card-wrapper">
            <div className={`card-scalable ${isMobile ? 'mobile-card' : ''}`}>
              <svg viewBox="0 0 483 270" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                <image href="https://i.imgur.com/xVua8wQ.gif" width="483" height="270" preserveAspectRatio="xMidYMid slice" />
                <rect width="483" height="270" fill="transparent" />
                <text x="20" y="35" fontFamily="sans-serif" fontSize="23" fontWeight="600" fill="#f5f5f7">+</text>
                <text x="20" y="60" fontFamily="sans-serif" fontSize="18" fill="#f5f5f7">Contact</text>
              </svg>
            </div>
          </Link>
        </div>

        {/* Featured Card - Mobile - Order 5 */}
        {isMobile && (
          <div className={`absolute card-container card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ 
            top: '0px', 
            left: '0px',
            transform: 'none',
            zIndex: 4,
            animationDelay: '0.5s',
            order: 5
          }}>
            <Link href="/posts/signal-social-media-advertisement" className="card-wrapper">
              <div className="card-scalable mobile-card">
                <svg viewBox="0 0 345 483" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/AuOmVsO.png" width="345" height="483" preserveAspectRatio="xMidYMid slice" />
                  <rect width="345" height="483" fill="transparent" />
                  <text x="28" y="52" fontFamily="sans-serif" fontSize="32" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="28" y="85" fontFamily="sans-serif" fontSize="26" fill="#1D1D1F">Featured</text>
                  <text x="28" y="104" fontFamily="sans-serif" fontSize="13" fill="#3D3D3F">Signal | Ad</text>
                </svg>
              </div>
            </Link>
          </div>
        )}

        {/* Featured Card - Desktop */}
        {!isMobile && (
          <div className={`absolute card-container featured-desktop card-animate ${cardsLoaded ? 'card-loaded' : ''}`} style={{ 
            top: `${featuredPos.top}px`, 
            left: featuredPos.left !== undefined ? `${featuredPos.left}px` : undefined,
            right: featuredPos.right !== undefined ? `${featuredPos.right}px` : undefined,
            transform: 'rotate(0deg)',
            zIndex: 1,
            animationDelay: '0.4s'
          }}>
            <Link href="/posts/signal-social-media-advertisement" className="card-wrapper">
              <div className="card-scalable">
                <svg viewBox="0 0 483 270" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  <image href="https://i.imgur.com/AuOmVsO.png" width="483" height="282" preserveAspectRatio="xMidYMid slice" />
                  <rect width="483" height="270" fill="transparent" />
                  <text x="20" y="29" fontFamily="sans-serif" fontSize="16" fontWeight="600" fill="#1D1D1F">+</text>
                  <text x="20" y="45" fontFamily="sans-serif" fontSize="13" fill="#1D1D1F">Featured</text>
                  <text x="20" y="55" fontFamily="sans-serif" fontSize="7.5" fill="#3D3D3F">Signal | Ad</text>
                </svg>
              </div>
            </Link>
          </div>
        )}

      </div>

      <style jsx>{`
        .draggable-image {
          user-select: none;
          transition: transform 0.2s ease;
        }
        
        .draggable-img {
          width: 50px;
          height: auto;
          transition: transform 0.2s ease;
          user-select: none;
          pointer-events: none;
        }
        
        .draggable-image:hover .draggable-img {
          transform: rotate(5deg);
        }
        
        .card-container {
          width: ${isMobile ? '100%' : `${518 * (containerDimensions.width / 1820)}px`};
          height: auto;
        }
        .card-container.featured-desktop {
          width: ${isMobile ? '100%' : `${1035 * (containerDimensions.width / 1720)}px`};
        }
        .card-container.business-card {
          width: ${isMobile ? '100%' : `${690 * (containerDimensions.width / 1720)}px`};
        }
        
        .card-animate:not(.card-loaded) {
          transform: translateY(-10px) rotate(-1deg) !important;
        }
        
        .card-animate:not(.card-loaded)[style*="rotate(-8deg)"] {
          transform: translateY(-10px) rotate(-6deg) !important; 
        }
        
        .card-animate:not(.card-loaded)[style*="rotate(12deg)"] {
          transform: translateY(-10px) rotate(10deg) !important;
        }
        
        .card-animate:not(.card-loaded)[style*="rotate(-6deg)"] {
          transform: translateY(-10px) rotate(-4deg) !important;
        }
        
        .card-animate:not(.card-loaded)[style*="rotate(-2deg)"] {
          transform: translateY(-10px) rotate(0deg) !important;
        }
        
        .card-animate {
          transition: transform 0.6s ease-out;
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-radius: 0px;
        }
        
        .about-card {
          filter: grayscale(100%) brightness(0.98) !important;
        }
        
        .mobile-card {
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
            transform: translateY(-3px) rotate(1deg);
            filter: grayscale(0%);
          }
          .about-card:hover {
            filter: grayscale(0%) brightness(1) !important;
          }
          .card-scalable:not(.about-card):hover .card-svg image {
            transform: scale(1.06) rotate(1deg);
          }
        }
        
        .card-scalable .card-svg image {
          transition: transform 0.3s ease, filter 0.3s ease;
          transform-origin: center center;
        }
        
        @media (max-width: 767px) {
          .relative.w-full.h-full {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            min-height: auto;
            padding: 0;
            margin: 0;
          }
          .card-container {
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            transform: none !important;
            display: block;
          }
          .card-wrapper {
            width: 100%;
            margin: 0;
            padding: 0;
            display: block;
          }
          .card-scalable {
            filter: none !important;
            transform: none !important;
            transition: none !important;
            margin: 0 !important;
            padding: 0 !important;
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
          }
        }
      `}</style>
    </div>
  );
}