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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  // Prevent flash on load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle search input
  const toggleSearch = () => {
    setIsSearchOpen(prev => {
      const newState = !prev;
      if (newState) {
        setSearchQuery('');
        // iOS needs longer delay and requestAnimationFrame
        const focusInput = () => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
          }
          if (desktopSearchInputRef.current) {
            desktopSearchInputRef.current.focus();
            desktopSearchInputRef.current.select();
          }
        };
        
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          requestAnimationFrame(() => setTimeout(focusInput, 400));
        } else {
          setTimeout(focusInput, 300);
        }
      }
      return newState;
    });
  };

  // Close search
  const closeSearch = () => {
    setIsSearchOpen(false);
    // Blur inputs to hide iOS keyboard
    if (searchInputRef.current) searchInputRef.current.blur();
    if (desktopSearchInputRef.current) desktopSearchInputRef.current.blur();
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  // Handle exit preview mode
  const handleExitPreview = async () => {
    try {
      await fetch('/api/draft-mode/disable', { method: 'GET' });
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      }
      sessionStorage.clear();
      window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + '_t=' + Date.now();
    } catch (err) {
      console.error('Error exiting preview mode:', err);
      window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + '_t=' + Date.now();
    }
  };

  // Handle right-click on logo (desktop only)
  const handleLogoRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const logoElement = e.currentTarget.querySelector('.home-icon') as HTMLImageElement;
    if (logoElement) {
      logoElement.style.transition = 'opacity 0.1s ease';
      logoElement.style.opacity = '0.3';
      setTimeout(() => {
        logoElement.style.opacity = '1';
        setTimeout(() => {
          logoElement.style.opacity = '0.3';
          setTimeout(() => {
            logoElement.style.opacity = '1';
            setTimeout(() => {
              logoElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }
    
    if (window.innerWidth > 768 && isDraftMode) {
      setTimeout(() => handleExitPreview(), 500);
    }
  };

  // Close search when clicking outside (desktop only)
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: Event) => {
      const target = e.target as Node;
      
      if (window.innerWidth > 768) {
        if (searchButtonRef.current?.contains(target)) return;
        if (desktopSearchContainerRef.current?.contains(target)) return;
        setIsSearchOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close search with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Mobile Search Bar */}
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
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <button type="button" onClick={closeSearch} className="mobile-close-button" aria-label="Close search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </form>
      </div>

      {/* Left Logo */}
      <div 
        className={`desktop-logo ${isSearchOpen ? 'logo-hidden-mobile' : ''}`}
        style={{ position: 'fixed', top: '18px', left: '4px', zIndex: 999998, display: 'flex', alignItems: 'center', height: '22px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsFocused(false); }}
      >
        <div className={`icon-hover-container ${isLoaded ? 'loaded' : ''} ${(isHovered || isFocused) ? 'show-access' : ''}`}>
          <div 
            onContextMenu={handleLogoRightClick}
            onMouseDown={(e) => { if (e.button === 2) e.preventDefault(); }}
            style={{ display: 'inline-block', position: 'relative', marginTop: '5px' }}
          >
            <Link 
              href="/" 
              style={{ display: 'inline-block', position: 'relative' }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onMouseDown={() => { setIsHovered(false); setIsFocused(false); }}
            >
              <img
                src="/images/icon.gif"
                alt="Home"
                className="home-icon"
                style={{ height: '50px', width: 'auto', display: 'block', transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', flexShrink: 0 }}
                draggable={false}
              />
            </Link>
          </div>
          
          <div 
            className="access-link"
            onClick={() => window.location.href = '/accessible.html'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = '/accessible.html'; } }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseDown={() => { setIsHovered(false); setIsFocused(false); }}
          >
            <img src="/images/access.svg" alt="Accessibility" className="access-icon" style={{ height: '19px', width: 'auto', display: 'block' }} draggable={false} />
          </div>
        </div>
      </div>
      
      {/* Right Navigation and Search */}
      <div 
        className={`desktop-buttons ${isSearchOpen ? 'buttons-hidden-mobile' : ''}`}
        style={{ position: 'fixed', top: '13.5px', right: '22px', zIndex: 999998, display: 'flex', alignItems: 'flex-start' }}
      >
        {/* Desktop Search Container */}
        <div 
          className={`search-container desktop-search ${isSearchOpen ? 'search-open' : 'search-closed'}`}
          ref={desktopSearchContainerRef}
          style={{ position: "fixed", right: '12px', top: "7px" }}
        >
          <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              ref={desktopSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="search-input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <button type="button" onClick={closeSearch} className="desktop-close-button" aria-label="Close search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </form>
        </div>
        
        {        /* Navigation Links and Search Button */}
        <div 
          className={`svg-buttons-container ${isSearchOpen ? 'buttons-slide-out' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}
        >
          {/* Navigation Links - Desktop Only */}
          <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '4px' }}>
            <Link href="/gallery" className="nav-link">Type</Link>
            <Link href="/showcase" className="nav-link">Visuals</Link>
            
            {/* Search Button inline - Desktop */}
            <svg 
              ref={searchButtonRef}
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              height="24"
              width="24"
              className="svg-clickable desktop-search-btn"
              onClick={toggleSearch}
              aria-label="Search"
              style={{ cursor: 'pointer', margin: '0 4px' }}
            >
              <circle cx="11" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M21 20l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            
            <Link href="/about" className="nav-link">About</Link>
          </div>
          
          {/* Mobile Search Button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              height="29"
              width="29"
              className="svg-clickable mobile-search-btn"
              onClick={toggleSearch}
              aria-label="Search"
              style={{ cursor: 'pointer' }}
            >
              <circle cx="11" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M21 20l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .icon-hover-container {
          position: relative;
          display: flex;
          align-items: center;
          height: 48px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .access-link {
          display: flex;
          align-items: center;
          margin-left: 0;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          cursor: pointer;
        }
        
        .icon-hover-container:not(.loaded) .access-link {
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        .icon-hover-container.loaded .access-link {
          visibility: visible;
        }
        
        .icon-hover-container.show-access .access-link {
          opacity: 1;
          transform: translateX(0);
          margin-left: -5px;
          pointer-events: auto;
        }
        
        /* Navigation Links */
        .nav-links {
          transition: opacity 0.3s ease;
        }
        
        .nav-link {
          color: #050507;
          text-decoration: none;
          font-size: 17px;
          font-weight: 400;
          font-variation-settings: 'wght' 400;
          transition: font-variation-settings 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        
        .nav-link:hover {
          font-variation-settings: 'wght' 600;
        }
        
        /* Mobile search overlay */
        .mobile-search-overlay {
          position: fixed;
          top: 8px;
          left: 8px;
          right: 8px;
          height: 40px;
          background-color: rgb(255, 255, 255, 0.4);
          z-index: 999999;
          display: none;
          align-items: center;
          padding: 0 16px;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          border-radius: 8px;
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
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
          font-size: 16px; /* Prevent iOS zoom */
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .mobile-search-input::placeholder {
          color: #a5a5a7;
        }
        
        .mobile-close-button, .desktop-close-button {
          background: none;
          border: none;
          padding: 6px;
          margin-left: 6px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          -webkit-tap-highlight-color: transparent;
          min-height: 44px; /* iOS touch target */
          min-width: 44px;
        }
        
        .desktop-close-button {
          padding: 12px;
        }
        
        .mobile-close-button:hover, .desktop-close-button:hover {
          color: #333;
        }
        
        .svg-buttons-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: right center;
        }
        
        .buttons-slide-out {
          transform: translateX(80px);
          opacity: 0;
        }
        
        /* Desktop search */
        .search-container {
          height: 40px;
          background-color: rgb(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: right center;
          border-radius: 8px;
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
        }
        
        .search-closed {
          width: 0;
          opacity: 0;
          transform: scaleX(0);
        }
        
        .search-open {
          width: 304px;
          opacity: 1;
          transform: scaleX(1);
        }
        
        .search-input {
          flex: 1;
          height: 100%;
          padding: 0 8px;
          border: none;
          outline: none;
          background: transparent;
          color: #050507;
          font-size: 16px; /* Prevent iOS zoom */
          transition: opacity 0.2s ease;
          -webkit-appearance: none;
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
          -webkit-tap-highlight-color: transparent;
          -webkit-user-select: none;
          user-select: none;
          color: rgba(5, 5, 7, 0.7);
        }
        
        .svg-clickable:hover {
          color: rgba(5, 5, 7, 1);
        }
        
        /* Search button visibility */
        .mobile-search-btn {
          display: none;
        }
        
        .desktop-search-btn {
          display: block;
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .svg-buttons-container {
            align-items: center !important;
          }
          
          .mobile-search-overlay {
            display: flex;
          }
          
          .desktop-search {
            display: none !important;
          }
          
          .nav-links {
            display: none !important;
          }
          
          .mobile-search-btn {
            display: block;
          }
          
          .desktop-search-btn {
            display: none;
          }
          
          .logo-hidden-mobile {
            transform: translateX(-80px);
            opacity: 0;
          }
          
          .buttons-hidden-mobile {
            transform: translateX(80px);
            opacity: 0;
          }
          
          .desktop-logo, .desktop-buttons {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .icon-hover-container {
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          .access-link {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          .desktop-logo {
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
          }
          
          .desktop-logo * {
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          .home-icon {
            transition: none !important;
          }
          
          .logo-hidden-mobile {
            pointer-events: none !important;
          }
          
          .logo-hidden-mobile * {
            pointer-events: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-search-overlay {
            left: 13px;
            right: 13px;
          }
        }
      `}</style>
    </>
  );
}