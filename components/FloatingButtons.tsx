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
                  viewBox="0 0 755.08 100.86" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="logo-default"
                >
                  <g>
                    <path className="cls-1" d="M205.78 9.48v16.38h-32.76v65.52h-16.38V25.86h-32.76V9.48h81.91Zm87.76 0v24.45l-32.76 32.76v24.69H244.4V66.69l-32.76-32.76V9.48h16.38v19.89l24.57 24.57 24.57-24.57V9.48zm71.37 0 16.38 16.38v16.38l-16.38 16.38h-49.14v32.76h-16.38V9.48zm-49.14 32.76h49.14V25.86h-49.14zM469.05 9.48v16.38h-65.52v16.38h49.14v16.38h-49.14V75h65.52v16.38h-81.9V9.48zm110.05 0v16.38h-32.76v65.52h-16.38V25.86H497.2V9.48h81.91Zm71.85 0 16.38 16.38v65.52h-16.38V58.62h-49.14v32.76h-16.38V25.86l16.38-16.38zm-49.14 32.76h49.14V25.86h-49.14zM755.08 9.48v16.38h-9.36l-24.57 24.57L745.72 75h9.36v16.38h-35.34V76.4h6.44l-12.05-12.05-27.03 27.03h-13.92V75h9.36l24.57-24.57-24.57-24.57h-9.36V9.48h35.34v14.98h-6.44l12.05 12.05 27.03-27.03z" fill="#919191"/>
                    <rect className="cls-1" x="485.34" y="63.7" width="27.69" height="27.69" rx="13.84" ry="13.84" fill="#919191"/>
                    <path className="cls-1" d="M72.27 0H28.58C12.79 0 0 12.8 0 28.59v15.85h12V28.59C12 19.44 19.44 12 28.58 12h43.69c9.15 0 16.59 7.44 16.59 16.59v43.69c0 9.14-7.44 16.58-16.59 16.58H28.58C19.44 88.86 12 81.42 12 72.28v-7.65H0v7.65c0 15.79 12.79 28.58 28.58 28.58h43.69c15.79 0 28.59-12.79 28.59-28.58V28.59C100.86 12.8 88.06 0 72.27 0" fill="#919191"/>
                    <path className="cls-1" d="m83.05 50.43-32.1 32.1H33.17l25.67-25.68H0V44.02h58.84L33.17 18.34h17.78z" fill="#919191"/>
                  </g>
                </svg>
                
                {/* Hover Logo */}
                <svg 
                  width="200" 
                  height="30" 
                  viewBox="0 0 755.09 100.86" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="logo-hover"
                >
                  <g>
                    <path className="cls-1" d="M205.79 9.48v16.38h-32.76v65.52h-16.38V25.86h-32.76V9.48h81.91Zm87.75 0v24.45l-32.76 32.76v24.69H244.4V66.69l-32.76-32.76V9.48h16.38v19.89l24.57 24.57 24.57-24.57V9.48zm71.38 0 16.38 16.38v16.38l-16.38 16.38h-49.14v32.76H299.4V9.48zm-49.15 32.76h49.14V25.86h-49.14zM469.05 9.48v16.38h-65.52v16.38h49.14v16.38h-49.14V75h65.52v16.38h-81.9V9.48zm110.05 0v16.38h-32.76v65.52h-16.38V25.86H497.2V9.48h81.91Zm71.85 0 16.38 16.38v65.52h-16.38V58.62h-49.14v32.76h-16.38V25.86l16.38-16.38zm-49.14 32.76h49.14V25.86h-49.14zM755.09 9.48v16.38h-9.36l-24.57 24.57L745.73 75h9.36v16.38h-35.34V76.4h6.44l-12.05-12.05-27.03 27.03h-13.92V75h9.36l24.57-24.57-24.57-24.57h-9.36V9.48h35.34v14.98h-6.44l12.05 12.05 27.03-27.03z" fill="#404eff"/>
                    <rect className="cls-1" x="485.34" y="63.7" width="27.69" height="27.69" rx="13.84" ry="13.84" fill="#404eff"/>
                    <path className="cls-1" d="M72.28 12c9.14 0 16.58 7.44 16.58 16.58v43.69c0 9.14-7.44 16.58-16.58 16.58h-43.7C19.44 88.85 12 81.41 12 72.27V28.58C12 19.44 19.44 12 28.58 12h43.69m.01-12h-43.7C12.8 0 0 12.8 0 28.58v43.69c0 15.79 12.8 28.58 28.58 28.58h43.69c15.79 0 28.58-12.8 28.58-28.58V28.58C100.85 12.79 88.05 0 72.27 0Z" fill="#404eff"/>
                    <path className="cls-1" d="M80.22 38.17v39.98H60.36V49.57H40.5v28.58H20.64V38.17l29.79-19.51z" fill="#404eff"/>
                  </g>
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