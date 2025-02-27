"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MorphingSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Toggle search bar expansion
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Reset search when opening
      setSearchQuery('');
    }
  };

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Wait for transition to complete
    }
  }, [isExpanded]);

  // Handle click outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
    }
  };

  // Create overlay for dimming the page when search is expanded
  const overlay = isExpanded ? (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
      onClick={() => setIsExpanded(false)}
    />
  ) : null;

  return (
    <>
      {overlay}
      <div 
        ref={containerRef}
        className={`relative z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64 md:w-80' : 'w-auto'}`}
      >
        <form onSubmit={handleSubmit} className="relative flex items-center">
          {!isExpanded ? (
            <button
              type="button"
              onClick={toggleSearch}
              className="inline-flex items-center bg-white text-black px-3 py-1 md:px-4 md:py-2 rounded-full text-[0.85rem] md:text-[0.95rem] border border-gray-200 transition-colors duration-200 hover:bg-[#FFEFF4] hover:text-[#89131F]"
              aria-label="Search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              Search
            </button>
          ) : (
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white text-black border border-gray-200 rounded-full py-1 pl-6 pr-14 md:py-2 focus:outline-none focus:ring-2 focus:ring-[#89131F]"
              />
              <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                <button 
                  type="submit" 
                  className="h-full px-2 flex items-center justify-center text-gray-500 hover:text-[#89131F]"
                  aria-label="Submit search"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={toggleSearch}
                  className="h-full px-2 flex items-center justify-center text-gray-500 hover:text-[#89131F]"
                  aria-label="Close search"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default MorphingSearch;
