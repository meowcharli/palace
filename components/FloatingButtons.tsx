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
    // Try to disable draft mode by fetching the API route
    fetch('/api/draft-mode/disable', { method: 'GET' })
      .then(() => {
        // Reload the page to ensure we're out of draft mode
        window.location.href = '/';
      })
      .catch(err => {
        console.error('Error disabling draft mode:', err);
        // If API call fails, just navigate normally
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
      {/* Draft mode exit button - in a completely separate div */}
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
              backgroundColor: '#004cff',
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
                      viewBox="0 0 750 90.16" 
                      className="w-full h-full"
                    >
                      <path 
                        d="M0 72.98V17.31L16.29 0h23.09l-17.7 18.72c-1.11 1.03-1.67 2.35-1.67 3.98v44.76c0 1.62.56 2.95 1.67 3.98l17.57 18.72H16.29zm56.94 17.18V72.2h47.2q2.955 0 5.13-2.31c1.45-1.54 2.18-3.38 2.18-5.52V54.11H62.97c-1.2 0-2.18-.19-2.95-.58s-1.39-.85-1.86-1.41c-.47-.55-.79-1.13-.96-1.73s-.26-1.07-.26-1.41V24.23L81.82 0h49.63v17.96h-47.2q-2.955 0-5.13 2.31c-1.46 1.54-2.18 3.38-2.18 5.51v10.39h48.48c1.2 0 2.18.19 2.95.58s1.39.86 1.86 1.41c.47.56.79 1.11.96 1.67s.26 1.01.26 1.35v24.88l-24.88 24.11H56.94Zm92.22 0V0h74.52v17.96h-50.66c-.86 0-1.71.41-2.56 1.22-.86.81-1.28 1.95-1.28 3.4v13.59h40.91v17.96h-40.91v13.59c0 1.37.43 2.46 1.28 3.27s1.71 1.22 2.56 1.22h50.66v17.96h-74.52Zm92.21-65.92L266.25 0H291l24.88 24.24v65.92h-20.01V54.12h-30.65c-.86 0-1.71.38-2.56 1.15-.86.77-1.28 1.88-1.28 3.33v31.55h-20.01zm48.48 15.77q2.31 0 4.17-1.92c1.24-1.28 1.86-2.86 1.86-4.75v-7.57c0-2.14-.71-3.98-2.12-5.51s-3.1-2.31-5.07-2.31h-20.14c-1.97 0-3.65.77-5.07 2.31-1.41 1.54-2.12 3.38-2.12 5.51v14.24h28.47Zm43.73-15.77L358.46 0h49.63v29.88L397.7 40.01c-2.57 2.57-3.85 5.17-3.85 7.82s.98 4.81 2.95 6.48 4.66 2.59 8.08 2.76l3.21.13v32.96h-20.01V70.67c0-2.05-.38-4.06-1.15-6.03s-1.86-3.72-3.27-5.26-3.12-2.8-5.13-3.78-4.25-1.47-6.73-1.47h-18.21v36.04h-20.01zm50.28 11.93q1.41 0 2.82-1.41c.94-.94 1.41-2.14 1.41-3.59V17.96h-30.27q-1.41 0-2.82 1.35c-.94.9-1.41 2.07-1.41 3.53v13.34h30.27Zm41.81 53.99V24.24L450.55 0h49.76v27.57h-20.14v-9.62h-26.55c-2.22 0-4.08.86-5.58 2.57s-2.24 3.68-2.24 5.9v45.79h29.88v-9.62h24.62v4.23l-23.47 23.34h-51.17Zm92.08 0V0h20.01v36.17h30.65c.85 0 1.71-.4 2.56-1.22.85-.81 1.28-1.9 1.28-3.27V0h20.01v90.16h-20.01V54.12H541.6c-.86 0-1.71.38-2.56 1.15-.86.77-1.28 1.84-1.28 3.21v31.68zm91.96 0 17.7-18.6c1.11-1.28 1.67-2.65 1.67-4.1V22.7c0-1.54-.56-2.86-1.67-3.98L609.71 0h23.09l16.29 17.31v55.66L632.8 90.16z" 
                        data-name="Layer 2"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                )}
                
                {/* Support Button - Hidden when search is open */}
                {!isSearchOpen && (
                  <Link 
                    href="/contact" 
                    className="pill-button flex items-center justify-center"
                  >
                    <svg 
                      data-name="Layer 2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 750 90.16" 
                      className="w-full h-full"
                    >
                      <path 
                        d="M0 72.98V17.31L16.29 0h23.09l-17.7 18.72c-1.11 1.03-1.67 2.35-1.67 3.98v44.76c0 1.62.56 2.95 1.67 3.98l17.57 18.72H16.29zm56.81 17.18V24.24L81.7 0h49.76v27.57h-20.14v-9.62H84.77c-2.22 0-4.08.86-5.58 2.57s-2.24 3.68-2.24 5.9v45.79h29.88v-9.62h24.62v4.23l-23.47 23.34zm92.09-65.92L173.78 0h49.63v66.05l-24.88 24.11H148.9zm47.97 47.97c1.71 0 3.23-.68 4.55-2.05s1.99-3.03 1.99-5v-47.2h-27.96c-1.71 0-3.23.71-4.55 2.12-1.33 1.41-1.99 3.1-1.99 5.07v47.07h27.96Zm44.24 17.95V0h20.01v14.11c0 2.14.81 4.02 2.44 5.64 5.39 5.22 10.73 10.41 16.03 15.58s10.65 10.37 16.03 15.58V0h20.01v90.16h-20.01V76.31c0-2.22-.77-4.02-2.31-5.39l-32.19-31.29v50.53zm119.41 0V22.57c0-1.45-.43-2.58-1.28-3.4-.86-.81-1.75-1.22-2.69-1.22h-23.21V0h74.52v17.96h-23.21c-.94 0-1.84.41-2.69 1.22-.86.81-1.28 1.95-1.28 3.4v67.59h-20.14Zm65.02-65.92L450.42 0h24.75l24.88 24.24v65.92h-20.01V54.12h-30.65c-.86 0-1.71.38-2.56 1.15-.86.77-1.28 1.88-1.28 3.33v31.55h-20.01zm48.48 15.77q2.31 0 4.17-1.92c1.24-1.28 1.86-2.86 1.86-4.75v-7.57c0-2.14-.71-3.98-2.12-5.51s-3.1-2.31-5.07-2.31h-20.14c-1.97 0-3.65.77-5.07 2.31-1.41 1.54-2.12 3.38-2.12 5.51v14.24H474Zm43.61 50.15V24.24L542.51 0h49.76v27.57h-20.14v-9.62h-26.55c-2.22 0-4.08.86-5.58 2.57s-2.24 3.68-2.24 5.9v45.79h29.88v-9.62h24.62v4.23l-23.47 23.34h-51.17Zm119.27 0V22.57c0-1.45-.43-2.58-1.28-3.4-.86-.81-1.75-1.22-2.69-1.22h-23.21V0h74.52v17.96h-23.21c-.94 0-1.84.41-2.69 1.22-.86.81-1.28 1.95-1.28 3.4v67.59h-20.14Zm64.9 0 17.7-18.6c1.11-1.28 1.67-2.65 1.67-4.1V22.7c0-1.54-.56-2.86-1.67-3.98L701.8 0h23.09l16.29 17.31v55.66l-16.29 17.19z" 
                        data-name="Layer 2"
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
    </>
  );
}