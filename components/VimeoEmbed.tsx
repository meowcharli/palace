// File: components/VimeoEmbed.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getVimeoId, buildVimeoEmbedUrl } from '@/utils/vimeo';
import type { VimeoEmbedProps } from '@/utils/types';

interface ComponentProps extends VimeoEmbedProps {
  className?: string;
  isClickable?: boolean;
  hideCaption?: boolean;
  customHeight?: number;
}

export default function VimeoEmbed({ 
  url, 
  embedCode,
  caption,
  showThumbnail = false,
  hideControls = false,
  autoplay = false,
  loop = false,
  className = '',
  isClickable = false,
  hideCaption = false,
  customHeight,
}: ComponentProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [playing, setPlaying] = useState(!showThumbnail || autoplay);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extract Vimeo ID from URL or embed code
  const vimeoId = getVimeoId(embedCode || url || '');
  
  // Fetch thumbnail if needed
  useEffect(() => {
    if (!vimeoId || !(showThumbnail && !autoplay)) return;
    
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
        if (!response.ok) throw new Error('Failed to fetch thumbnail');
        
        const data = await response.json();
        // Get a larger thumbnail if available (replace _640 with _1280 for higher quality)
        const highResThumb = data.thumbnail_url?.replace('_640', '_1280') || data.thumbnail_url;
        setThumbnailUrl(highResThumb);
        setError(false);
      } catch (err) {
        console.error('Error fetching Vimeo thumbnail:', err);
        setError(true);
      }
    };
    
    fetchThumbnail();
  }, [vimeoId, showThumbnail, autoplay]);

  // Handle click to play
  const handleThumbnailClick = (e: React.MouseEvent) => {
    if (isClickable) return; // Don't play when it's in clickable mode (gallery)
    e.preventDefault();
    setPlaying(true);
  };

  // If no valid Vimeo ID found, return null
  if (!vimeoId) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className={`my-4 p-4 border border-red-800 bg-red-900 rounded-lg text-red-300 ${className}`}>
          <p>Invalid Vimeo URL or embed code</p>
        </div>
      );
    }
    return null;
  }

  // Handle custom embed code if provided
  if (embedCode && embedCode.includes('<iframe')) {
    return (
      <div className={`video-embed w-full ${className}`} style={customHeight ? { height: `${customHeight}px` } : {}}>
        <div className="relative">
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
          
          {/* Add invisible overlay for clickable items */}
          {isClickable && (
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              aria-hidden="true"
            />
          )}
        </div>
        {!hideCaption && caption && <p className="video-caption mt-2">{caption}</p>}
      </div>
    );
  }

  // Show thumbnail if requested and not playing/autoplaying
  if (showThumbnail && !autoplay && !playing) {
    return (
      <div 
        className={`video-thumbnail-container ${className}`} 
        style={customHeight ? { height: `${customHeight}px` } : {}}
      >
        {thumbnailUrl ? (
          <div 
            className={`relative cursor-pointer h-full ${isClickable ? '' : 'overflow-hidden rounded-lg'}`}
            onClick={handleThumbnailClick}
          >
            {/* Use regular img tag for thumbnail */}
            <img 
              src={thumbnailUrl} 
              alt={caption || "Video thumbnail"}
              className="w-full h-full object-cover rounded-lg"
              onLoad={() => setThumbnailLoaded(true)}
            />
            
            {/* Add play button overlay if not in gallery mode */}
            {!isClickable && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* If this is a clickable item in a gallery, add an invisible overlay */}
            {isClickable && (
              <div 
                className="absolute inset-0 z-10 cursor-pointer" 
                aria-hidden="true"
              />
            )}
            
            {/* Loading placeholder */}
            {!thumbnailLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg"></div>
            )}
          </div>
        ) : error ? (
          <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center">
            <span className="text-gray-400">Video unavailable</span>
          </div>
        ) : (
          <div className="bg-gray-800 animate-pulse rounded-lg h-full flex items-center justify-center">
            <span className="text-gray-400">Loading...</span>
          </div>
        )}
        {!hideCaption && caption && <p className="video-caption mt-2">{caption}</p>}
      </div>
    );
  }

  // Build the embed URL with options for embedded player mode
  const embedUrl = buildVimeoEmbedUrl(vimeoId, {
    autoplay: autoplay || playing,
    loop,
    background: hideControls,
    muted: autoplay, // Must be muted for autoplay to work
    portrait: !hideControls,
    title: !hideControls,
    byline: !hideControls,
    dnt: true, // Enable "Do Not Track" for privacy
  });

  // Embedded player mode - used for autoplay videos in gallery
  return (
    <div 
      ref={containerRef}
      className={`video-container ${className}`} 
      style={{ 
        height: customHeight ? `${customHeight}px` : 'auto',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative' // Added for positioning the overlay correctly
      }}
    >
      <div 
        className="responsive-iframe-container"
        style={{ 
          height: '100%', 
          paddingBottom: customHeight ? '0' : '56.25%',
          margin: 0,
          backgroundColor: '#000'
        }}
      >
        <iframe 
          src={embedUrl}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
          title={caption || "Vimeo video player"}
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            top: 0, 
            left: 0,
            backgroundColor: '#000'
          }}
        />
      </div>
      
      {/* Add invisible overlay for clickable items */}
      {isClickable && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          aria-hidden="true"
        />
      )}
      
      {!hideCaption && caption && <p className="video-caption mt-2 text-gray-400">{caption}</p>}
    </div>
  );
}