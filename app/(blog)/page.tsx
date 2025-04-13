'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import VimeoEmbed from "@/components/VimeoEmbed";
import { urlForImage } from '@/sanity/lib/utils';
import type { GalleryItem } from '@/utils/types';
import Onboarding from "./onboarding";

function GalleryItemComponent({ item }: { item: GalleryItem }) {
  return (
    <Link 
      href={`/posts/${item.articleSlug}`} 
      className="gallery-item block mb-2 w-full relative group"
      style={{ display: 'block' }}
    >
      {item.videoEmbed?.url ? (
        <div className="gallery-video-container w-full">
          <VimeoEmbed 
            url={item.videoEmbed.url}
            embedCode={item.videoEmbed.embedCode}
            hideControls={true}
            autoplay={true}
            loop={true}
            showThumbnail={false}
            isClickable={true}
            hideCaption={true}
            aspectRatio={item.videoEmbed?.aspectRatio || "16:9"}
          />
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300"></div>
        </div>
      ) : item.image?.asset?._ref ? (
        <div className="gallery-image-container w-full relative">
          <Image
            src={urlForImage(item.image)?.url() || ''}
            alt={item.image.alt || item.title || 'Gallery image'}
            width={2000}
            height={0}
            quality={100}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="w-full h-auto shadow-lg"
            style={{ aspectRatio: 'auto' }}
            priority={true}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-7 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="gallery-placeholder w-full h-64 bg-gray-800 flex items-center justify-center relative">
          <span className="text-gray-400">Image</span>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-7 transition-opacity duration-300"></div>
        </div>
      )}
    </Link>
  );
}

export default function Page() {
  const [settings, setSettings] = useState<any>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const settingsResponse = await fetch('/api/settings');
        const galleryResponse = await fetch('/api/gallery');
        
        if (settingsResponse.ok && galleryResponse.ok) {
          const settingsData = await settingsResponse.json();
          const galleryData = await galleryResponse.json();
          
          setSettings(settingsData);
          setGalleryItems(galleryData);
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

  const shuffleArray = (array: GalleryItem[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-5">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
          <p className="mt-4 text-gray-400"> </p>
        </div>
      </div>
    );
  }

  if (!galleryItems || galleryItems.length === 0) {
    return (
      <div className="container mx-auto px-5">
        <Onboarding />
      </div>
    );
  }

  const leftColumnItems = shuffledItems.filter((_, index) => index % 3 === 0);
  const middleColumnItems = shuffledItems.filter((_, index) => index % 3 === 1);
  const rightColumnItems = shuffledItems.filter((_, index) => index % 3 === 2);

  return (
    <div className="container mx-auto px-5">
      <div className="gallery-vertical-columns mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-1">
          <div className="gallery-column flex flex-col space-y-0">
            {leftColumnItems.map((item) => (
              <GalleryItemComponent key={item._id} item={item} />
            ))}
          </div>
          
          <div className="gallery-column flex flex-col space-y-0">
            {middleColumnItems.map((item) => (
              <GalleryItemComponent key={item._id} item={item} />
            ))}
          </div>
          
          <div className="gallery-column flex flex-col space-y-0">
            {rightColumnItems.map((item) => (
              <GalleryItemComponent key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}