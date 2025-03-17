"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FloatingButtons() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
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
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Floating Logo with CSS-based transition */}
          <Link 
            href="/" 
            className="pointer-events-auto transition-all duration-300"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <svg width="115" height="28" viewBox="0 0 419.17 94.81" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 hover:translate-y-[-1px]">
              <path 
                d="M419.17 0v17.84h-53.06c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.06 24.03-.72.73h-49.68V76.97h53.06c2.36 0 4.27-1.92 4.27-4.28V56.91h-57.33V25.49l.73-.72L368.76.72l.73-.72zm-86 39.09v30.64l-.72.73-23.63 23.62-.72.73H258v-69.3l.73-.73L282.77.74l.73-.73h42.01l-4.22 4.22-12.89 12.9-.72.73h-27.55c-2.36 0-4.28 1.92-4.28 4.28v54.83h35.27c2.36 0 4.28-1.92 4.28-4.28v-33.6zM57.34 0h17.82v94.79H57.34V56.91H25.48l-.72-.72L.72 32.14 0 31.41V0h17.84v34.8c0 2.36 1.92 4.28 4.28 4.28h35.22zm103.82 0v17.84H108.1c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.05 24.03-.72.73H86V76.97h53.04c2.36 0 4.28-1.92 4.28-4.28V56.91H86V25.49l.72-.72L110.75.72l.73-.72zm86.02 0v17.84h-24.39c-2.36 0-4.28 1.91-4.28 4.27v50.58c0 2.36 1.92 4.28 4.28 4.28h24.39V94.8h-75.19V76.97h24.39c2.36 0 4.28-1.92 4.28-4.28V22.11c0-2.36-1.92-4.27-4.28-4.27h-24.39V0z" 
                fill="#fff" 
                stroke="#fff" 
                strokeWidth={isLogoHovered ? 12 : 0}
                className="logo-path transition-all duration-500 ease-in-out" 
              />
            </svg>
          </Link>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 pointer-events-auto">
            {/* Search Icon & Input */}
            <div ref={searchContainerRef} className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 z-50">
                  <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                    <div className="flex items-center">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="bg-gray-900 text-white py-2 pl-3 pr-16 focus:outline-none focus:ring-1 focus:ring-gray-600 w-48 rounded-md"
                      />
                      <div className="absolute right-2 flex items-center space-x-2">
                        <button 
                          type="submit" 
                          className="text-gray-300 hover:text-white h-6 w-6 flex items-center justify-center"
                          aria-label="Submit search"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                        <button 
                          type="button" 
                          onClick={toggleSearch}
                          className="text-gray-300 hover:text-white h-6 w-6 flex items-center justify-center"
                          aria-label="Close search"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div 
                  onClick={toggleSearch}
                  className="transition-all duration-300 hover:translate-y-[-1px] cursor-pointer"
                  aria-label="Search"
                >
                  <svg 
                    data-name="Layer 2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 108.4 108.4" 
                    className="h-7 w-7 text-white"
                    onMouseEnter={(e) => {
                      const svgPath = e.currentTarget.querySelector('path');
                      if (svgPath) {
                        svgPath.setAttribute('stroke', 'currentColor');
                        svgPath.setAttribute('stroke-width', '8');
                      }
                    }}
                    onMouseLeave={(e) => {
                      const svgPath = e.currentTarget.querySelector('path');
                      if (svgPath) {
                        svgPath.setAttribute('stroke-width', '0');
                      }
                    }}
                  >
                    <path 
                      d="M86.46 73.84V16.28L70.18 0h-53.9L0 16.28v53.9l16.28 16.28h57.56l21.94 21.94 12.62-12.62zM70.18 57.56l-.25-.25-12.62 12.62.25.25H16.28v-53.9h53.9z" 
                      fill="currentColor" 
                      className="transition-all duration-500 ease-in-out" 
                      stroke="currentColor"
                      strokeWidth="0"
                      data-name="Layer 2"
                    />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Support Icon */}
            <Link 
              href="/support" 
              className="transition-all duration-300 hover:translate-y-[-1px]"
            >
              <svg 
                data-name="Layer 2" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 113.98 94.8" 
                className="h-7 w-7 text-white"
                onMouseEnter={(e) => {
                  const svgPath = e.currentTarget.querySelector('path');
                  if (svgPath) {
                    svgPath.setAttribute('stroke', 'currentColor');
                    svgPath.setAttribute('stroke-width', '8');
                  }
                }}
                onMouseLeave={(e) => {
                  const svgPath = e.currentTarget.querySelector('path');
                  if (svgPath) {
                    svgPath.setAttribute('stroke-width', '0');
                  }
                }}
              >
                <path 
                  d="M96.13 0H17.85L0 17.85v59.1L17.85 94.8h78.28l17.85-17.85v-59.1zM17.85 76.95V40.36l26.52 26.51 10.08 10.08zm2.74-59.1h72.8l-36.4 36.4zm75.54 59.1H59.54l10.08-10.07 26.51-26.52z" 
                  fill="currentColor" 
                  className="transition-all duration-500 ease-in-out" 
                  stroke="currentColor"
                  strokeWidth="0"
                  data-name="Layer 2"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
