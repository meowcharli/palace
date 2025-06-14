"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FloatingButtonsProps {
  isDraftMode?: boolean;
}

export default function FloatingButtons({ isDraftMode = false }: FloatingButtonsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  // Toggle search input
  const toggleSearch = () => {
    setIsSearchOpen(prev => {
      const newState = !prev;
      if (newState) {
        // Opening search
        setSearchQuery('');
        setTimeout(() => {
          // Focus mobile input
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
          }
          // Focus desktop input
          if (desktopSearchInputRef.current) {
            desktopSearchInputRef.current.focus();
            desktopSearchInputRef.current.select();
          }
        }, 300);
      }
      return newState;
    });
  };

  // Close search
  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Handle exit preview mode
  const handleExitPreview = () => {
    console.log("Exit Preview Mode clicked");
    fetch('/api/draft-mode/disable', { method: 'GET' })
      .then(() => {
        window.location.href = '/';
      })
      .catch(err => {
        console.error('Error disabling draft mode:', err);
        window.location.href = '/';
      });
  };

  // Close search when clicking outside (desktop only)
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      // Only apply click-outside logic on desktop
      if (window.innerWidth > 768) {
        // Don't close if clicking on the search button
        if (searchButtonRef.current && searchButtonRef.current.contains(target)) {
          return;
        }
        
        // Don't close if clicking anywhere inside the desktop search container
        if (desktopSearchContainerRef.current && desktopSearchContainerRef.current.contains(target)) {
          return;
        }
        
        // Close search if clicking outside both the button and search container
        setIsSearchOpen(false);
      }
    };

    // Use a small delay to prevent immediate closing when opening
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close search with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      {/* Draft mode exit button - HIGHEST Z-INDEX */}
      {isDraftMode && (
        <div 
          style={{ 
            position: 'fixed', 
            top: '16px', 
            left: '0', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 999999, 
            pointerEvents: 'none'
          }}
        >
          <button
            onClick={handleExitPreview}
            style={{
              backgroundColor: '#000000',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '9999px',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              pointerEvents: 'auto'
            }}
          >
            Exit Preview Mode
          </button>
        </div>
      )}
      
      {/* Mobile Full-Width Search Bar */}
      <div 
        className={`mobile-search-overlay ${isSearchOpen ? 'mobile-search-active' : ''}`}
        ref={searchContainerRef}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="mobile-search-input"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="mobile-close-button"
            aria-label="Close search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </form>
      </div>

      {/* Icon in left margin - Hidden on mobile when search is open */}
      <div 
        className={`desktop-logo ${isSearchOpen ? 'logo-hidden-mobile' : ''}`}
        style={{ 
          position: 'fixed', 
          top: '25px', 
          left: '5px', 
          zIndex: 999998,
          display: 'flex',
          alignItems: 'center',
          height: '27px' // Keep the container height to align with buttons
        }}
      >
        <Link 
          href="/" 
          style={{ 
            display: 'inline-block',
            position: 'relative'
          }}
        >
          <div className="icon-hover-container">
            {/* Icon GIF */}
            <img
              src="/images/icon.gif"
              alt="Home"
              className="home-icon"
            />
            
            {/* Home text that slides out on hover */}
            <span className="home-text">home</span>
          </div>
        </Link>
      </div>
      
      {/* Search and Contact buttons in right margin - Hidden on mobile when search is open */}
      <div 
        className={`desktop-buttons ${isSearchOpen ? 'buttons-hidden-mobile' : ''}`}
        style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 999998,
          display: 'flex',
          alignItems: 'flex-start'
        }}
      >
        {/* Search Container - Desktop only */}
        <div 
          className={`search-container desktop-search ${isSearchOpen ? 'search-open' : 'search-closed'}`}
          ref={desktopSearchContainerRef}
          style={{ marginRight: '-85px' }}
        >
          <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              ref={desktopSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="search-input"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="desktop-close-button"
              aria-label="Close search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </form>
        </div>
        
        {/* SVG Buttons - Stacked Vertically */}
        <div 
          className={`svg-buttons-container ${isSearchOpen ? 'buttons-slide-out' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3.2px' }}
        >
          {/* Search Button SVG */}
          <svg 
            ref={searchButtonRef}
            data-name="Layer 2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 240.5 31.37"
            height="18" 
            className="svg-clickable"
            onClick={toggleSearch}
            aria-label="Search"
            style={{ cursor: 'pointer' }}
          >
            <path 
              d="m23.17 0 15.68 15.68-15.68 15.68h-7.48l12.55-12.55H0v-6.27h28.23L15.68 0h7.48Zm48.17 0v6.27H47.37v6.27h18.82l6.27 6.27v6.27l-6.27 6.27H42.22v-6.27h23.97v-6.27H47.37l-6.27-6.27V6.27L47.37 0zm34.73 0v6.27H80.98v6.27H99.8v6.27H80.98v6.27h25.09v6.27H74.7V0zm27.33 0 6.27 6.27v25.09h-6.27V18.81h-18.82v12.55h-6.27V6.27L114.58 0zm-18.82 12.55h18.82V6.28h-18.82zM167.01 0l6.27 6.27v6.27l-5.42 5.42 5.42 5.42v7.98h-6.27v-6.27l-6.27-6.27h-12.55v12.55h-6.27V0zm-18.82 12.55h18.82V6.28h-18.82zM200.62 0l6.27 6.27v6.27h-6.27V6.27H181.8v18.82h18.82v-6.27h6.27v6.27l-6.27 6.27H181.8l-6.27-6.27V6.27L181.8 0zm39.88 0v31.37h-6.27V18.82h-18.82v12.55h-6.27V0h6.27v12.55h18.82V0z"
              fill="#919191"
            />
          </svg>
          
          {/* Contact Button SVG */}
          <Link href="/contact">
            <svg 
              data-name="Layer 2" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 274.11 31.37" 
              height="18"
              className="svg-clickable"
              aria-label="Contact"
              style={{ cursor: 'pointer' }}
            >
              <path 
                d="m23.17 0 15.68 15.68-15.68 15.68h-7.48l12.55-12.55H0v-6.27h28.23L15.68 0h7.48Zm43.02 0 6.27 6.27v6.27h-6.27V6.27H47.37v18.82h18.82v-6.27h6.27v6.27l-6.27 6.27H47.37l-6.27-6.27V6.27L47.37 0zm33.6 0 6.27 6.27v18.82l-6.27 6.27H80.97l-6.27-6.27V6.27L80.97 0zM80.97 25.09h18.82V6.27H80.97zM139.68 0v31.37h-6.27v-2.29l-18.82-18.82v21.11h-6.27V0h6.27v2.29l18.82 18.82V0zm33.61 0v6.27h-12.55v25.09h-6.27V6.27h-12.55V0zm27.33 0 6.27 6.27v25.09h-6.27V18.81H181.8v12.55h-6.27V6.27L181.8 0zM181.8 12.55h18.82V6.28H181.8zM234.23 0l6.27 6.27v6.27h-6.27V6.27h-18.82v18.82h18.82v-6.27h6.27v6.27l-6.27 6.27h-18.82l-6.27-6.27V6.27L215.41 0zm39.88 0v6.27h-12.55v25.09h-6.27V6.27h-12.55V0z" 
                fill="#919191"
              />
            </svg>
          </Link>
        </div>
      </div>
      
      <style jsx global>{`
        .icon-hover-container {
          position: relative;
          display: flex;
          align-items: center;
          height: 60px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .home-icon {
          height: 70px;
          width: auto;
          display: block;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          flex-shrink: 0;
        }
        
        .home-text {
          color: #919191;
          font-size: 30px;
          font-weight: 500;
          margin-left: 0;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          white-space: nowrap;
          pointer-events: none;
        }
        
        /* Only apply hover effects on devices that support hover */
        @media (hover: hover) and (pointer: fine) {
          .icon-hover-container:hover {
            width: auto;
          }
          
          .icon-hover-container:hover .home-text {
            opacity: 1;
            transform: translateX(0);
            margin-left: -6px;
          }
        }
        
        /* Mobile full-width search overlay */
        .mobile-search-overlay {
          position: fixed;
          top: 15px;
          left: 15px;
          right: 15px;
          height: 50px;
          background-color: #E5E5E7;
          z-index: 999999;
          display: none;
          align-items: center;
          padding: 0 20px;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        
        .mobile-search-active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        
        .mobile-search-input {
          flex: 1;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #050507;
          font-size: 18px;
        }
        
        .mobile-search-input::placeholder {
          color: #a5a5a7;
        }
        
        .mobile-close-button {
          background: none;
          border: none;
          padding: 8px;
          margin-left: 8px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        
        .mobile-close-button:hover {
          color: #333;
        }
        
        .desktop-close-button {
          background: none;
          border: none;
          padding: 6px;
          margin-left: 8px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        
        .desktop-close-button:hover {
          color: #333;
        }
        
        /* Desktop button slide animation */
        .svg-buttons-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: right center;
        }
        
        .buttons-slide-out {
          transform: translateX(100px);
          opacity: 0.3;
        }
        
        /* Desktop search container */
        .search-container {
          height: 40px;
          background-color: #E5E5E7;
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: right center;
        }
        
        .search-closed {
          width: 0;
          opacity: 0;
          transform: scaleX(0);
        }
        
        .search-open {
          width: 380px;
          opacity: 1;
          transform: scaleX(1);
        }
        
        .search-input {
          flex: 1;
          height: 100%;
          padding: 0 10px;
          border: none;
          outline: none;
          background: transparent;
          color: #050507;
          font-size: 18px;
          transition: opacity 0.2s ease;
        }
        
        .search-closed .search-input {
          opacity: 0;
        }
        
        .search-open .search-input {
          opacity: 1;
        }
        
        .search-input::placeholder {
          color: #a5a5a7;
        }
        
        .svg-clickable {
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        
        .svg-clickable:hover {
          opacity: 0.7;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .mobile-search-overlay {
            display: flex;
          }
          
          .desktop-search {
            display: none !important;
          }
          
          .logo-hidden-mobile {
            transform: translateX(-100px);
            opacity: 0;
          }
          
          .buttons-hidden-mobile {
            transform: translateX(100px);
            opacity: 0;
          }
          
          .desktop-logo,
          .desktop-buttons {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Fix for mobile touch issues - ensure proper pointer events */
          .desktop-logo {
            pointer-events: auto;
          }
          
          .desktop-logo a {
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          .icon-hover-container {
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          /* Disable pointer events when hidden to prevent ghost clicks */
          .logo-hidden-mobile {
            pointer-events: none !important;
          }
          
          .logo-hidden-mobile * {
            pointer-events: none !important;
          }
        }
        
        /* Larger mobile adjustments */
        @media (max-width: 480px) {
          .mobile-search-overlay {
            left: 16px;
            right: 16px;
          }
        }
      `}</style>
    </>
  );
}