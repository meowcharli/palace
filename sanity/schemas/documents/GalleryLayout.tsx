'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import VimeoEmbed from '@/components/VimeoEmbed';
import type { GalleryItem } from '@/utils/types';

interface GalleryLayoutProps {
  items: GalleryItem[];
}

export default function GalleryLayout({ items }: GalleryLayoutProps) {
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>([]);
  
  // Shuffle the gallery items on component mount
  useEffect(() => {
    const shuffleArray = (array: GalleryItem[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    
    setShuffledItems(shuffleArray(items));
  }, [items]);
  
  // Split the shuffled items into two columns
  const leftColumnItems = shuffledItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = shuffledItems.filter((_, index) => index % 2 === 1);
  
  return (
    <div className="gallery-vertical-columns mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        {/* Left Column */}
        <div className="gallery-column flex flex-col space-y-8">
          {leftColumnItems.map((item) => (
            <GalleryItemComponent key={item._id} item={item} />
          ))}
        </div>
        
        {/* Right Column */}
        <div className="gallery-column flex flex-col space-y-8">
          {rightColumnItems.map((item) => (
            <GalleryItemComponent key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual gallery item component
function GalleryItemComponent({ item }: { item: GalleryItem }) {
  return (
    <Link 
      href={`/posts/${item.articleSlug}`} 
      className="gallery-item block transform transition-transform duration-300 hover:-translate-y-2 mb-8 w-full"
    >
      {item.videoEmbed?.url ? (
        // Video content
        <div className="gallery-video-container w-full">
          <VimeoEmbed 
            url={item.videoEmbed.url} 
            embedCode={item.videoEmbed.embedCode}
            hideControls={item.videoEmbed.hideControls}
            autoplay={false}
            loop={item.videoEmbed.loop}
            showThumbnail={true}
            isClickable={true}
          />
          {item.title && (
            <h3 className="mt-3 text-xl font-medium text-white">{item.title}</h3>
          )}
        </div>
      ) : item.image?.asset?._ref ? (
        // Image content
        <div className="gallery-image-container w-full">
          <div className="relative w-full">
            <Image
              src={urlForImage(item.image)?.width(800).url() || ''}
              alt={item.image.alt || item.title || 'Gallery image'}
              width={800}
              height={0}
              sizes="(max-width: 2000px) 100vw, 800px"
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
          {item.title && (
            <h3 className="mt-3 text-xl font-medium text-white">{item.title}</h3>
          )}
        </div>
      ) : (
        // Fallback for items without image or video
        <div className="gallery-placeholder w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">{item.title || 'Untitled'}</span>
        </div>
      )}
    </Link>
  );
}
