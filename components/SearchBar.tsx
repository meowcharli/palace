"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset search when opening
      setSearchQuery('');
    }
  };

  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle click outside to close search
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.search-button')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close search
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
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
      // Navigate to search results page (you'll need to create this page)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={toggleSearch}
        className="search-button inline-flex items-center bg-white text-black px-3 py-1 md:px-4 md:py-2 rounded-full text-[0.85rem] md:text-[0.95rem] border border-gray-200 transition-colors duration-200 hover:bg-[#FFEFF4] hover:text-[#89131F]"
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

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="w-full max-w-3xl mt-32 px-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white text-black border-0 rounded-full py-4 pl-6 pr-12 shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#89131F]"
              />
              <button 
                type="submit" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#89131F]"
                aria-label="Submit search"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
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
            </form>
            <p className="text-white text-center mt-4 text-sm">Press ESC to cancel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
