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
                  width="200" 
                  height="30" 
                  viewBox="0 0 276.14 65.52" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="logo-default"
                >
                  <path 
                    d="M0 0h13.1v26.21h52.42v13.1H13.1v26.21H0zm135.73 0v19.56l-26.21 26.21v19.75h-13.1V45.77L70.21 19.56V0h13.1v15.91l19.66 19.66 19.66-19.66V0zm70.2 52.42-13.1 13.1h-13.1l-13.1-13.1V13.1h-26.21V0h65.52v52.42ZM179.72 13.1v39.31h13.1V13.1zm30.89 52.42v-13.1h52.42v-13.1h-39.31v-13.1h39.31v-13.1h-52.42V0h65.52v65.52z" 
                    fill="#1D1D1F"
                  />
                </svg>
                
                {/* Hover Logo */}
                <svg 
                  width="200" 
                  height="30" 
                  viewBox="0 0 276.14 65.52" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="logo-hover"
                >
                  <path 
                    d="M65.52 0v13.1H39.31v52.42h-13.1V13.1H0V0zm70.21 65.52h-19.56L89.96 39.31H70.21v-13.1h19.75L116.16 0h19.56v13.1h-15.91l-19.66 19.66 19.66 19.66h15.91v13.1Zm17.78 0-13.1-13.1v-13.1l13.1-13.1h39.31V.01h13.1v65.52H153.5Zm39.32-26.21h-39.31v13.1h39.31zM210.61 0h13.1v52.42h13.1V13.11h13.1v39.31h13.1V0h13.1v65.52h-65.52V0Z" 
                    fill="#1D1D1F"
                  />
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
                  height="18" 
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
                    height="18"
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
          transition: opacity 0.3s ease;
        }
        
        .logo-hover {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
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