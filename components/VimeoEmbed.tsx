"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
}: ComponentProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(!showThumbnail);
  
  // Extract Vimeo ID from URL or embed code
  const vimeoId = getVimeoId(embedCode || url || '');
  
  // Fetch thumbnail if needed
  useEffect(() => {
    if (showThumbnail && vimeoId) {
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`)
        .then(res => res.json())
        .then(data => {
          setThumbnailUrl(data.thumbnail_url);
        })
        .catch(err => {
          console.error('Error fetching Vimeo thumbnail:', err);
        });
    }
  }, [vimeoId, showThumbnail]);

  // If no valid Vimeo ID found, return null
  if (!vimeoId) {
    return null;
  }

  // Handle custom embed code if provided
  if (embedCode && embedCode.includes('<iframe')) {
    return (
      <div className={`video-embed w-full ${className}`}>
        <div dangerouslySetInnerHTML={{ __html: embedCode }} />
        {caption && <p className="video-caption mt-2">{caption}</p>}
      </div>
    );
  }

  // Show thumbnail view if requested and not playing yet
  if (showThumbnail && !playing) {
    return (
      <div className={`video-thumbnail-container ${className}`}>
        {thumbnailUrl ? (
          <div 
            className="relative cursor-pointer" 
            onClick={() => setPlaying(true)}
          >
            <Image 
              src={thumbnailUrl} 
              alt={caption || "Video thumbnail"} 
              width={640} 
              height={360} 
              className="rounded-lg"
            />
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
          </div>
        ) : (
          <div className="bg-gray-200 animate-pulse rounded-lg aspect-video flex items-center justify-center">
            <span>Loading thumbnail...</span>
          </div>
        )}
        {caption && <p className="video-caption mt-2">{caption}</p>}
      </div>
    );
  }

  // Build the embed URL with options
  const embedUrl = buildVimeoEmbedUrl(vimeoId, {
    autoplay: playing || autoplay,
    loop,
    background: hideControls,
    muted: autoplay, // If autoplay is enabled, mute by default (browser requirement)
    portrait: !hideControls,
    title: !hideControls,
    byline: !hideControls,
  });

  // Embedded player mode
  return (
    <div className={`video-container ${className}`}>
      <div className="responsive-iframe-container">
        <iframe 
          src={embedUrl}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
          title={caption || "Vimeo video player"}
        />
      </div>
      {caption && <p className="video-caption mt-2">{caption}</p>}
    </div>
  );
}
