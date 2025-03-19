'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import VimeoEmbed from "@/components/VimeoEmbed";
import { urlForImage } from '@/sanity/lib/utils';
import type { GalleryItem } from '@/utils/types';
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

// Main Page Component
export default function Page() {
  const [settings, setSettings] = useState<any>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>([]);

  // Fetch data on the client side
  useEffect(() => {
    async function fetchData() {
      try {
        // Using fetch to get data from API routes
        const settingsResponse = await fetch('/api/settings');
        const galleryResponse = await fetch('/api/gallery');
        
        if (settingsResponse.ok && galleryResponse.ok) {
          const settingsData = await settingsResponse.json();
          const galleryData = await galleryResponse.json();
          
          setSettings(settingsData);
          setGalleryItems(galleryData);
          
          // Shuffle the gallery items
          setShuffledItems(shuffleArray(galleryData));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Shuffle array function
  const shuffleArray = (array: GalleryItem[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-5">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }
  
  // Show onboarding if no gallery items
  if (!galleryItems || galleryItems.length === 0) {
    return (
      <div className="container mx-auto px-5">
        <Onboarding />
      </div>
    );
  }
  
  // Split the shuffled items into two columns
  const leftColumnItems = shuffledItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = shuffledItems.filter((_, index) => index % 2 === 1);
  
  return (
    <div className="container mx-auto px-5">
      {/* Gallery layout */}
      <div className="gallery-vertical-columns mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
          {/* Left Column */}
          <div className="gallery-column flex flex-col space-y-2">
            {leftColumnItems.map((item) => (
              <GalleryItemComponent key={item._id} item={item} />
            ))}
          </div>
          
          {/* Right Column */}
          <div className="gallery-column flex flex-col space-y-2">
            {rightColumnItems.map((item) => (
              <GalleryItemComponent key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Gallery Item Component
function GalleryItemComponent({ item }: { item: GalleryItem }) {
  return (
    <Link 
      href={`/posts/${item.articleSlug}`} 
      className="gallery-item block transform transition-transform duration-300 hover:-translate-y-0.5 mb-2 w-full"
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
              sizes="(max-width: 768px) 100vw, 800px"
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        </div>
      ) : (
        // Fallback for items without image or video
        <div className="gallery-placeholder w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Image</span>
        </div>
      )}
    </Link>
  );
}