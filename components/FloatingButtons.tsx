"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FloatingButtons() {
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
          {/* Logo with dual outlines */}
          <Link href="/" className="pointer-events-auto">
            <div className="invisible-button">
              <div className="logo-container">
                <svg width="138" height="33.6" viewBox="-10 -10 439.17 114.81" className="logo">
                  {/* Added padding to the viewBox (-10 on each side) */}
                  <path className="logo-path-black" d="M419.17 0v17.84h-53.06c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.06 24.03-.72.73h-49.68V76.97h53.06c2.36 0 4.27-1.92 4.27-4.28V56.91h-57.33V25.49l.73-.72L368.76.72l.73-.72zm-86 39.09v30.64l-.72.73-23.63 23.62-.72.73H258v-69.3l.73-.73L282.77.74l.73-.73h42.01l-4.22 4.22-12.89 12.9-.72.73h-27.55c-2.36 0-4.28 1.92-4.28 4.28v54.83h35.27c2.36 0 4.28-1.92 4.28-4.28v-33.6zM57.34 0h17.82v94.79H57.34V56.91H25.48l-.72-.72L.72 32.14 0 31.41V0h17.84v34.8c0 2.36 1.92 4.28 4.28 4.28h35.22zm103.82 0v17.84H108.1c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.05 24.03-.72.73H86V76.97h53.04c2.36 0 4.28-1.92 4.28-4.28V56.91H86V25.49l.72-.72L110.75.72l.73-.72zm86.02 0v17.84h-24.39c-2.36 0-4.28 1.91-4.28 4.27v50.58c0 2.36 1.92 4.28 4.28 4.28h24.39V94.8h-75.19V76.97h24.39c2.36 0 4.28-1.92 4.28-4.28V22.11c0-2.36-1.92-4.27-4.28-4.27h-24.39V0z" />
                  <path className="logo-path-white" d="M419.17 0v17.84h-53.06c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.06 24.03-.72.73h-49.68V76.97h53.06c2.36 0 4.27-1.92 4.27-4.28V56.91h-57.33V25.49l.73-.72L368.76.72l.73-.72zm-86 39.09v30.64l-.72.73-23.63 23.62-.72.73H258v-69.3l.73-.73L282.77.74l.73-.73h42.01l-4.22 4.22-12.89 12.9-.72.73h-27.55c-2.36 0-4.28 1.92-4.28 4.28v54.83h35.27c2.36 0 4.28-1.92 4.28-4.28v-33.6zM57.34 0h17.82v94.79H57.34V56.91H25.48l-.72-.72L.72 32.14 0 31.41V0h17.84v34.8c0 2.36 1.92 4.28 4.28 4.28h35.22zm103.82 0v17.84H108.1c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.05 24.03-.72.73H86V76.97h53.04c2.36 0 4.28-1.92 4.28-4.28V56.91H86V25.49l.72-.72L110.75.72l.73-.72zm86.02 0v17.84h-24.39c-2.36 0-4.28 1.91-4.28 4.27v50.58c0 2.36 1.92 4.28 4.28 4.28h24.39V94.8h-75.19V76.97h24.39c2.36 0 4.28-1.92 4.28-4.28V22.11c0-2.36-1.92-4.27-4.28-4.27h-24.39V0z" />
                </svg>
              </div>
            </div>
          </Link>
          
          {/* Right Side Pill with Icons */}
          <div className="flex items-center pointer-events-auto">
            {/* Pill Container */}
            <div className={`pill-container ${isSearchOpen ? 'expanded' : 'collapsed'}`} ref={searchContainerRef}>
              {/* Search Input (Conditionally Rendered with Delayed Appearance) */}
              {isSearchOpen && (
                <div className="flex-grow px-3">
                  <div className="search-pill-wrapper">
                    <div className="search-pill">
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
                  </div>
                </div>
              )}
              
              {/* Search Button - Hidden when search is open */}
              {!isSearchOpen && (
                <button
                  onClick={toggleSearch}
                  className="pill-button"
                  aria-label="Search"
                >
                  <svg 
                    data-name="Layer 2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 108.4 108.4" 
                    className="w-5 h-5"
                    style={{ margin: '0 auto', filter: 'drop-shadow(0px 0px 1px #000)' }}
                  >
                    <path 
                      d="M86.46 73.84V16.28L70.18 0h-53.9L0 16.28v53.9l16.28 16.28h57.56l21.94 21.94 12.62-12.62zM70.18 57.56l-.25-.25-12.62 12.62.25.25H16.28v-53.9h53.9z" 
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
              
              {/* Support Button - Hidden when search is open */}
              {!isSearchOpen && (
                <Link 
                  href="/support" 
                  className="pill-button flex items-center justify-center"
                >
                  <svg 
                    data-name="Layer 2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 113.98 94.8" 
                    className="w-5 h-5"
                    style={{ margin: '0 auto' }}
                  >
                    <path 
                      d="M96.13 0H17.85L0 17.85v59.1L17.85 94.8h78.28l17.85-17.85v-59.1zM17.85 76.95V40.36l26.52 26.51 10.08 10.08zm2.74-59.1h72.8l-36.4 36.4zm75.54 59.1H59.54l10.08-10.07 26.51-26.52z" 
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
