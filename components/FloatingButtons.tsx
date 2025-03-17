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
          {/* Floating Logo - No Button Container */}
          <Link 
            href="/" 
            className="pointer-events-auto transition-all duration-200"
          >
            <svg width="115" height="28" viewBox="0 0 419.17 94.81" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
              <path d="M419.17 0v17.84h-53.06c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.06 24.03-.72.73h-49.68V76.97h53.06c2.36 0 4.27-1.92 4.27-4.28V56.91h-57.33V25.49l.73-.72L368.76.72l.73-.72zm-86 39.09v30.64l-.72.73-23.63 23.62-.72.73H258v-69.3l.73-.73L282.77.74l.73-.73h42.01l-4.22 4.22-12.89 12.9-.72.73h-27.55c-2.36 0-4.28 1.92-4.28 4.28v54.83h35.27c2.36 0 4.28-1.92 4.28-4.28v-33.6zM57.34 0h17.82v94.79H57.34V56.91H25.48l-.72-.72L.72 32.14 0 31.41V0h17.84v34.8c0 2.36 1.92 4.28 4.28 4.28h35.22zm103.82 0v17.84H108.1c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.05 24.03-.72.73H86V76.97h53.04c2.36 0 4.28-1.92 4.28-4.28V56.91H86V25.49l.72-.72L110.75.72l.73-.72zm86.02 0v17.84h-24.39c-2.36 0-4.28 1.91-4.28 4.27v50.58c0 2.36 1.92 4.28 4.28 4.28h24.39V94.8h-75.19V76.97h24.39c2.36 0 4.28-1.92 4.28-4.28V22.11c0-2.36-1.92-4.27-4.28-4.27h-24.39V0z" fill="#fff" stroke="#fff" stroke-width="1" />
            </svg>
          </Link>
          
          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3 pointer-events-auto">
            {/* Search Button & Input - Buttons 15% smaller, icons scaled down */}
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
                <button
                  onClick={toggleSearch}
                  className="bg-gray-900 hover:bg-gray-800 rounded-md shadow-lg w-10 h-10 flex items-center justify-center transition-all duration-200"
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Support Button - 15% smaller */}
            <Link 
              href="/support" 
              className="bg-gray-900 hover:bg-gray-800 rounded-md shadow-lg w-10 h-10 flex items-center justify-center transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
