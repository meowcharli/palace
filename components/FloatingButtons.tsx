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
      
      {/* Logo section */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            {/* Logo with hover effect */}
            <Link href="/" className="pointer-events-auto">
              <div className="logo-hover-container">
                {/* Default Logo */}
                <svg 
                  width="120" 
                  height="60" 
                  viewBox="0 0 392.9 181.59" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="logo-default"
                >
                  <path fill="#919191" d="M87.59 0v17.52H52.55v70.07H35.03V17.52H0V0zm93.84 0v26.15l-35.04 35.04v26.4h-17.52v-26.4L93.83 26.15V0h17.52v21.27l26.28 26.28 26.28-26.28V0zm76.33 0 17.52 17.52v17.52l-17.52 17.52h-52.55V87.6h-17.52V0zm-52.55 35.04h52.55V17.52h-52.55zM369.12 0v17.52h-70.07v17.52h52.55v17.52h-52.55v17.52h70.07V87.6h-87.59V0zM87.59 94v17.52H52.55v70.07H35.03v-70.07H0V94zm76.32 0 17.52 17.52v70.07h-17.52v-35.04h-52.55v35.04H93.84v-70.07L111.36 94zm-52.55 35.04h52.55v-17.52h-52.55zM275.28 94v17.52h-10.01l-26.28 26.28 26.28 26.28h10.01v17.52h-37.79v-16.02h6.88l-12.89-12.89-28.9 28.9h-14.89v-17.52h10.01l26.28-26.28-26.28-26.28h-10.01V93.99h37.79v16.02h-6.88l12.89 12.89 28.9-28.9z" />
                  <path fill="#919191" d="M392.9 0v146.55h-92.16l35.03 35.04h-20.89l-43.8-43.8L314.88 94h20.89l-35.03 35.04h74.64V0z" />
                </svg>
                
                {/* Hover Logo */}
                <svg 
                  width="120" 
                  height="60" 
                  viewBox="0 0 392.89 181.59" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="logo-hover"
                >
                  <path fill="#2E2E30" d="M392.89 0v108.95H61.39l72.64 72.64H90.79L0 90.79 90.79 0h43.24L61.39 72.64h295.2V0z" />
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
                  viewBox="0 0 207.2 31.37" 
                  height="20"
                  className="svg-clickable"
                  onClick={toggleSearch}
                  aria-label="Search"
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
          transition: opacity 0.1s ease;
        }
        
        .logo-hover {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity 0.1s ease;
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