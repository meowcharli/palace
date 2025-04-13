"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getVimeoId, buildVimeoEmbedUrl } from '@/utils/vimeo';
import type { VimeoEmbedProps } from '@/utils/types';

interface ComponentProps extends VimeoEmbedProps {
  className?: string;
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
  aspectRatio = '16:9',
}: ComponentProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [playing, setPlaying] = useState(!showThumbnail || autoplay);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const vimeoId = getVimeoId(embedCode || url || '');

  useEffect(() => {
    if (!vimeoId || !(showThumbnail && !autoplay)) return;
    
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
        if (!response.ok) throw new Error('Failed to fetch thumbnail');
        
        const data = await response.json();
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

  const handleThumbnailClick = (e: React.MouseEvent) => {
    if (isClickable) return;
    e.preventDefault();
    setPlaying(true);
  };

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

  if (embedCode && embedCode.includes('<iframe')) {
    return (
      <div className={`video-embed w-full ${className}`} style={customHeight ? { height: `${customHeight}px` } : {}}>
        <div className="relative">
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
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
            <div 
              className="relative w-full overflow-hidden rounded-lg"
              style={{
                aspectRatio: aspectRatio.replace(':', '/')
              }}
            >
              <img 
                src={thumbnailUrl} 
                alt={caption || "Video thumbnail"}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                onLoad={() => setThumbnailLoaded(true)}
              />
            </div>
            
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
            
            {isClickable && (
              <div 
                className="absolute inset-0 z-10 cursor-pointer" 
                aria-hidden="true"
              />
            )}
            
            {!thumbnailLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg"></div>
            )}
          </div>
        ) : error ? (
          <div 
            className="bg-gray-800 rounded-lg flex items-center justify-center"
            style={{
              aspectRatio: aspectRatio.replace(':', '/')
            }}
          >
            <span className="text-gray-400">Video unavailable</span>
          </div>
        ) : (
          <div 
            className="bg-gray-800 animate-pulse rounded-lg flex items-center justify-center"
            style={{
              aspectRatio: aspectRatio.replace(':', '/')
            }}
          >
            <span className="text-gray-400">Loading...</span>
          </div>
        )}
        {!hideCaption && caption && <p className="video-caption mt-2">{caption}</p>}
      </div>
    );
  }

  const embedUrl = buildVimeoEmbedUrl(vimeoId, {
    autoplay: autoplay || playing,
    loop,
    background: hideControls,
    muted: autoplay,
    portrait: !hideControls,
    title: !hideControls,
    byline: !hideControls,
    dnt: true,
  });

  return (
    <div 
      ref={containerRef}
      className={`video-container ${className}`} 
      style={{ 
        width: '100%',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: aspectRatio.replace(':', '/')
      }}
    >
      <div 
        className="responsive-iframe-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        <iframe 
          src={embedUrl}
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: 'none'
          }}
        />
      </div>
      
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