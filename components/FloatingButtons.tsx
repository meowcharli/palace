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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Toggle search input
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
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

  // Close search when clicking outside
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
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
      {/* Draft mode exit button */}
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
            zIndex: 10000, 
            pointerEvents: 'all'
          }}
        >
          <button
            onClick={handleExitPreview}
            style={{
              backgroundColor: '000000',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '9999px',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              border: 'none',
              outline: 'none'
            }}
          >
            Exit Preview Mode
          </button>
        </div>
      )}
      
      {/* Regular floating buttons */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            {/* Logo with hover effect */}
            <Link href="/" className="pointer-events-auto">
              <div className="logo-hover-container">
                <svg width="111.11" height="57.39" viewBox="0 0 111.11 57.39" className="logo-default">
                  <path d="M27.68 0v5.54H16.61v22.14h-5.54V5.54H0V0zm29.66 0v8.26L46.27 19.33v8.34h-5.54v-8.34L29.66 8.26V0h5.54v6.72l8.3 8.3 8.3-8.3V0zm24.12 0L87 5.54v5.54l-5.54 5.54H64.85v11.07h-5.54V0h22.14ZM64.85 11.07h16.61V5.53H64.85zM111.11 0v5.54H94.5v5.54h11.07v5.54H94.5v5.54h16.61v5.54H88.97V0zM27.68 29.71v5.54H16.61v22.14h-5.54V35.25H0v-5.54zm24.12 0 5.54 5.54v22.14H51.8V46.32H35.19v11.07h-5.54V35.25l5.54-5.54zM35.19 40.78H51.8v-5.54H35.19zm51.8-11.07v5.54h-3.16l-8.3 8.3 8.3 8.3h3.16v5.54H75.05v-5.06h2.17l-4.07-4.07-9.13 9.13h-4.71v-5.54h3.16l8.3-8.3-8.3-8.3h-3.16v-5.54h11.94v5.06h-2.17l4.07 4.07 9.13-9.13z" fill="#919191" />
                </svg>
                <svg width="123.25" height="57.39" viewBox="0 0 123.25 57.39" className="logo-hover">
                  <path d="M27.68 0v5.54H16.61v22.14h-5.54V5.54H0V0zm29.66 0v8.26L46.27 19.33v8.34h-5.54v-8.34L29.66 8.26V0h5.54v6.72l8.3 8.3 8.3-8.3V0zm24.12 0L87 5.54v5.54l-5.54 5.54H64.85v11.07h-5.54V0h22.14ZM64.85 11.07h16.61V5.53H64.85zM111.11 0v5.54H94.5v5.54h11.07v5.54H94.5v5.54h16.61v5.54H88.97V0zM27.68 29.71v5.54H16.61v22.14h-5.54V35.25H0v-5.54zm24.12 0 5.54 5.54v22.14H51.8V46.32H35.19v11.07h-5.54V35.25l5.54-5.54zM35.19 40.78H51.8v-5.54H35.19zm51.8-11.07v5.54h-3.16l-8.3 8.3 8.3 8.3h3.16v5.54H75.05v-5.06h2.17l-4.07-4.07-9.13 9.13h-4.71v-5.54h3.16l8.3-8.3-8.3-8.3h-3.16v-5.54h11.94v5.06h-2.17l4.07 4.07 9.13-9.13zm22.42 0L98.34 40.78h24.91v5.54H98.34l11.07 11.07h-6.6L88.97 43.55l13.84-13.84z" fill="#9f9f9f" />
                </svg>
              </div>
            </Link>
            
            {/* Right Side - SVGs and Search */}
            <div className="flex items-start pointer-events-auto">
              {/* Search Container (Only appears when search is open) */}
              {isSearchOpen && (
                <div className="search-container mr-4" ref={searchContainerRef}>
                  <form onSubmit={handleSubmit} className="w-full">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="search-input"
                    />
                  </form>
                </div>
              )}
              
              {/* SVG Buttons - Stacked Vertically */}
              <div className="flex flex-col items-end" style={{ gap: `${0.2}rem` }}>
                {/* Search Button SVG */}
                <svg 
                  data-name="Layer 2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="-19 0 234.23 31.37" 
                  height="20"
                  className="svg-clickable"
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <path 
                    d="m23.17 0 15.68 15.68-15.68 15.68h-7.48l12.55-12.55H0v-6.27h28.23L15.68 0h7.48Zm48.17 0v6.27H47.37v6.27h18.82l6.27 6.27v6.27l-6.27 6.27H42.22v-6.27h23.97v-6.27H47.37l-6.27-6.27V6.27L47.37 0zm28.45 0v6.27H80.97v6.27h12.55v6.27H80.97v6.27h18.82v6.27H74.7V0zm27.34 0 6.27 6.27v25.09h-6.27V18.81h-18.82v12.55h-6.27V6.27L108.31 0zm-18.82 12.55h18.82V6.28h-18.82zM160.74 0l6.27 6.27v6.27l-5.42 5.42 5.42 5.42v7.98h-6.27v-6.27l-6.27-6.27h-12.55v12.55h-6.27V0zm-18.82 12.55h18.82V6.28h-18.82zM194.35 0l6.27 6.27v6.27h-6.27V6.27h-18.82v18.82h18.82v-6.27h6.27v6.27l-6.27 6.27h-18.82l-6.27-6.27V6.27L175.53 0zm39.88 0v31.37h-6.27V18.82h-18.82v12.55h-6.27V0h6.27v12.55h18.82V0z" 
                    fill="#919191"
                  />
                </svg>
                
                {/* Contact Button SVG */}
                <Link href="/contact">
                  <svg 
                    data-name="Layer 2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 274.11 31.37" 
                    height="20"
                    className="svg-clickable"
                    aria-label="Contact"
                  >
                    <path 
                      d="m23.17 0 15.68 15.68-15.68 15.68h-7.48l12.55-12.55H0v-6.27h28.23L15.68 0h7.48Zm43.02 0 6.27 6.27v6.27h-6.27V6.27H47.37v18.82h18.82v-6.27h6.27v6.27l-6.27 6.27H47.37l-6.27-6.27V6.27L47.37 0zm33.6 0 6.27 6.27v18.82l-6.27 6.27H80.97l-6.27-6.27V6.27L80.97 0zM80.97 25.09h18.82V6.27H80.97zM139.68 0v31.37h-6.27v-2.29l-18.82-18.82v21.11h-6.27V0h6.27v2.29l18.82 18.82V0zm33.61 0v6.27h-12.55v25.09h-6.27V6.27h-12.55V0zm27.33 0 6.27 6.27v25.09h-6.27V18.81H181.8v12.55h-6.27V6.27L181.8 0zM181.8 12.55h18.82V6.28H181.8zM234.23 0l6.27 6.27v6.27h-6.27V6.27h-18.82v18.82h18.82v-6.27h6.27v6.27l-6.27 6.27h-18.82l-6.27-6.27V6.27L215.41 0zm39.88 0v6.27h-12.55v25.09h-6.27V6.27h-12.55V0z" 
                      fill="#919191"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .logo-hover-container {
          position: relative;
          display: inline-block;
        }
        
        .logo-default {
          display: block;
          transition: opacity 0s ease;
        }
        
        .logo-hover {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity 0s ease;
        }
        
        .logo-hover-container:hover .logo-default {
          opacity: 0;
        }
        
        .logo-hover-container:hover .logo-hover {
          opacity: 1;
        }
        
        .search-container {
          height: 45px;
          width: 400px;
          background-color:rgb(0, 0, 0);
          display: flex;
          align-items: center;
        }
        
        .search-input {
          width: 100%;
          height: 100%;
          padding: 0 10px;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-size: 16px;
        }
        
        .search-input::placeholder {
          color: #000;
        }
        
        .svg-clickable {
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        
        .svg-clickable:hover {
          opacity: 0.7;
        }
      `}</style>
    </>
  );
}