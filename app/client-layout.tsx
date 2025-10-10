"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSiteTitle } from '@/utils/hostname';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get site title based on the hostname
  const siteTitle = useSiteTitle();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll for banner and header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Track if user is at the very top
      const newIsAtTop = currentScrollY === 0;
      setIsAtTop(newIsAtTop);
      
      // Close search when reaching the top
      if (newIsAtTop && isSearchOpen) {
        closeSearch();
      }
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isSearchOpen]);

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
      }, 100);
    }
  };

  // Handle click outside search to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isSearchOpen) return;
      
      const target = event.target as Node;
      if (target) {
        if (searchContainerRef.current?.contains(target)) return;
        if (searchButtonRef.current?.contains(target)) return;
        if (desktopSearchContainerRef.current?.contains(target)) return;
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Handle escape key to close search
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* React handles transitions now */
          
          /* Floating Button Styles */
          .icon-hover-container {
            position: relative;
            display: flex;
            align-items: center;
            height: 48px;
            overflow: visible;
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
            color: #ffffff;
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
            display: none;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .mobile-search-overlay.mobile-search-active {
            opacity: 1;
            pointer-events: auto;
          }
          
          @media (max-width: 768px) {
            .mobile-search-overlay {
              display: flex;
            }
            
            .desktop-search {
              display: none !important;
            }
            
            .mobile-search-overlay.mobile-search-active {
              display: flex;
              opacity: 1;
              pointer-events: auto;
            }
          }
          
          .mobile-search-input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: #ffffff;
            font-size: 16px;
            -webkit-appearance: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          .mobile-search-input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .mobile-close-button, .desktop-close-button {
            background: none;
            border: none;
            padding: 6px;
            margin-left: 6px;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
            min-height: 44px;
            min-width: 44px;
          }
          
          .desktop-close-button {
            padding: 12px;
          }
          
          .mobile-close-button:hover, .desktop-close-button:hover {
            color: rgba(255, 255, 255, 1);
          }
          
          .svg-buttons-container {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: right center;
          }
          
          .buttons-slide-out {
            transform: translateX(80px);
            opacity: 0;
          }
          
          /* Desktop search styles now controlled directly by React */
          .desktop-search {
            display: flex;
            align-items: center;
          }
          
          .search-input {
            flex: 1;
            height: 100%;
            padding: 0 8px;
            border: none;
            outline: none;
            background: transparent;
            color: #ffffff;
            font-size: 16px;
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
            color: rgba(255, 255, 255, 0.7);
          }
          
          .svg-clickable {
            cursor: pointer;
            transition: opacity 0.3s ease;
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            user-select: none;
            color: rgba(255, 255, 255, 0.7);
          }
          
          .svg-clickable:hover {
            color: rgba(255, 255, 255, 1);
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
          
          /* Content spacing to account for fixed header */
          body {
            padding-top: 60px; /* Further reduced space for extended header */
          }
          
          @media (max-width: 768px) {
            body {
              padding-top: 50px; /* Standard mobile padding when thin banner is not visible */
            }
          }
          
          @media (max-width: 480px) {
            .mobile-search-overlay {
              left: 13px;
              right: 13px;
            }
          }
          
          /* Content spacing to account for fixed header */
        `
      }} />
        {/* Mobile Search Bar - Only visible on mobile */}
        <div 
          className={`mobile-search-overlay ${isSearchOpen ? 'mobile-search-active' : ''}`}
          ref={searchContainerRef}
          style={{
            position: 'fixed',
            top: (isMobile && isAtTop) ? '38px' : '8px',
            left: '8px',
            right: '8px',
            height: '40px',
            zIndex: 999999,
            transform: isHeaderVisible ? 'translateY(0)' : `translateY(${(isMobile && isAtTop) ? '-150px' : '-60px'})`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#FF4E00',
            borderRadius: '8px',
            padding: '0 16px',
            alignItems: 'center'
            // Let the CSS handle display and visibility based on screen size
          }}
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
          style={{ 
            position: 'fixed', 
            top: (isMobile && isAtTop) ? '46px' : '16px', 
            left: '8px', 
            zIndex: 999998, 
            display: 'flex', 
            alignItems: 'center', 
            height: isMobile ? '25px' : (isAtTop ? '90px' : '22px'),
            width: 'auto',
            transform: isHeaderVisible ? 'translateY(0)' : `translateY(${(isMobile && isAtTop) ? '-150px' : '-60px'})`,
            transition: 'all 0.3s ease',
            overflow: 'visible',
            opacity: isMobile ? (isAtTop ? 0 : 1) : 1,
            pointerEvents: isMobile ? (isAtTop ? 'none' : 'auto') : 'auto'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setIsFocused(false); }}
        >
          <div className={`icon-hover-container ${isLoaded ? 'loaded' : ''} ${(isHovered || isFocused) ? 'show-access' : ''}`}>
            <div 
              onContextMenu={handleLogoRightClick}
              onMouseDown={(e) => { if (e.button === 2) e.preventDefault(); }}
              style={{ 
                display: 'inline-block', 
                position: 'relative', 
                marginTop: isAtTop ? '0' : '5px',
                overflow: 'visible'
              }}
            >
              <Link 
                href="/" 
                style={{ display: 'inline-block', position: 'relative' }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onMouseDown={() => { setIsHovered(false); setIsFocused(false); }}
              >
                {/* Dynamic logo based on site title and scroll position */}
                <img
                  src={isMobile ? "/images/mobilelogo.svg" : (isAtTop ? "/images/logobig.svg" : (siteTitle.includes('Type') ? "/images/logo-type.svg" : "/images/logo.svg"))}
                  alt={siteTitle}
                  title={siteTitle}
                  className="home-icon"
                  style={{ 
                    height: isMobile ? '39px' : (isAtTop ? '90px' : '39px'), 
                    width: 'auto', 
                    display: 'block', 
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
                    flexShrink: 0 
                  }}
                  draggable={false}
                />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Thin Mobile Back Banner - Only shows on mobile */}
        {isMobile && (
          <div 
            style={{ 
              position: 'fixed', 
              top: '0px', 
              left: '0px',
              right: '0px',
              height: '20px',
              backgroundColor: '#FF4E00',
              zIndex: 999996,
              transition: 'transform 0.3s ease',
              transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: '16px'
            }}
          >
            <Link 
              href="/" 
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>◤</span>
              <span>home</span>
            </Link>
          </div>
        )}

        {/* Full Width Banner */}
        <div 
          style={{ 
            position: 'fixed', 
            top: (isMobile && isAtTop) ? '20px' : '0px', 
            left: '0px',
            right: '0px',
            height: isAtTop ? '120px' : '56px',
            backgroundColor: '#FF4E00',
            zIndex: 999997,
            transition: 'all 0.3s ease',
            transform: isHeaderVisible ? 'translateY(0)' : `translateY(${(isMobile && isAtTop) ? '-150px' : '-56px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'flex-end',
            paddingRight: isMobile ? '0' : '22px'
          }}
        >
          {/* Navigation SVGs - Always rendered for smooth transitions */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center',
            opacity: isAtTop ? 1 : 0,
            transform: isAtTop ? 'translateY(0)' : 'translateY(-40px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: isAtTop ? 'auto' : 'none'
          }}>
            <Link href="/work">
              <img
                src="/images/work.svg"
                alt="Work"
                style={{ 
                  height: '100px', 
                  width: 'auto', 
                  display: 'block', 
                  transition: 'all 0.3s ease 0.1s',
                  transform: isAtTop ? 'translateY(0)' : 'translateY(-20px)',
                  opacity: isAtTop ? 1 : 0
                }}
                draggable={false}
              />
            </Link>
            <Link href="/contact">
              <img
                src="/images/contact.svg"
                alt="Contact"
                style={{ 
                  height: '100px', 
                  width: 'auto', 
                  display: 'block', 
                  transition: 'all 0.3s ease 0.2s',
                  transform: isAtTop ? 'translateY(0)' : 'translateY(-20px)',
                  opacity: isAtTop ? 1 : 0
                }}
                draggable={false}
              />
            </Link>
            <Link href="/about">
              <img
                src="/images/about.svg"
                alt="About"
                style={{ 
                  height: '100px', 
                  width: 'auto', 
                  display: 'block', 
                  transition: 'all 0.3s ease 0.3s',
                  transform: isAtTop ? 'translateY(0)' : 'translateY(-20px)',
                  opacity: isAtTop ? 1 : 0
                }}
                draggable={false}
              />
            </Link>
          </div>
        </div>

        {/* Right Navigation and Search */}
        <div 
          className={`desktop-buttons ${isSearchOpen ? 'buttons-hidden-mobile' : ''}`}
          style={{ 
            position: 'fixed', 
            top: (isMobile && isAtTop) ? '43.5px' : '13.5px', 
            right: '22px', 
            zIndex: 999998, 
            display: 'flex', 
            alignItems: 'flex-start',
            transform: isHeaderVisible ? 'translateY(0)' : `translateY(${(isMobile && isAtTop) ? '-150px' : '-60px'})`,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Desktop Search Container */}
          <div 
            className="desktop-search"
            ref={desktopSearchContainerRef}
            style={{ 
              position: "fixed", 
              right: '12px', 
              top: "-7px", // Adjusted position higher
              zIndex: 999999,
              height: '40px',
              width: isSearchOpen ? '304px' : '0',
              opacity: isSearchOpen ? 1 : 0,
              transform: isSearchOpen ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'right center',
              borderRadius: '8px',
              backgroundColor: '#FF4E00',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center'
            }}
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
          
          {/* Navigation Links and Search Button */}
          <div 
            className={`svg-buttons-container ${isSearchOpen ? 'buttons-slide-out' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}
          >
            {/* Navigation Links - Desktop Only - Hidden when at top */}
            <div 
              className="nav-links" 
              style={{ 
                display: 'flex', 
                gap: '20px', 
                alignItems: 'center', 
                marginBottom: '4px',
                opacity: isAtTop ? 0 : 1,
                transform: isAtTop ? 'translateY(-20px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: isAtTop ? 'none' : 'auto'
              }}
            >
              <Link href="/work" className="nav-link">Work</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
              
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
                style={{ 
                  cursor: 'pointer', 
                  margin: '0 4px',
                  transition: 'opacity 0.3s ease',
                  opacity: isSearchOpen ? 0 : 1
                }}
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
                style={{ 
                  cursor: 'pointer',
                  opacity: (isSearchOpen || isAtTop) ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: (isSearchOpen || isAtTop) ? 'none' : 'auto'
                }}
              >
                <circle cx="11" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M21 20l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {children}
    </>
  );
}