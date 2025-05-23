'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VimeoEmbed from "@/components/VimeoEmbed";
import { urlForImage } from "@/sanity/lib/utils";
import type { GalleryItem } from "@/utils/types";

// Properly typed CSS properties with correct mixBlendMode values
const styles = {
  container: { maxWidth: '1800px', margin: '0rem auto 2rem' },
  grid: { columnGap: '0.2rem' },
  column: { display: 'flex', flexDirection: 'column' as const, width: '100%' },
  item: { width: '100%', marginBottom: '0rem', overflow: 'hidden', position: 'relative' as const },
  imageContainer: { width: '100%', position: 'relative' as const },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover' as const,
    transition: 'all 0.4s ease',
    filter: 'grayscale(100%)',
    opacity: '0.95',
    borderRadius: '0',
  },
  videoContainer: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: '0',
    filter: 'grayscale(100%)',
    opacity: '0.95',
    transition: 'filter 0.4s ease, opacity 0.4s ease',
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    color: '#8E8E93',
    fontWeight: '500',
    fontSize: '1.2rem',
    borderRadius: '0',
    textAlign: 'center' as const,
    padding: '1rem 1rem',
    filter: 'grayscale(100%)',
    opacity: '0.95',
    transition: 'filter 0.4s ease, opacity 0.4s ease',
  },
  arrow: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.3)',
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    zIndex: '10',
    pointerEvents: 'none' as const,
    mixBlendMode: 'difference' as const, // Using const assertion for the correct type
  },
  arrowIcon: {
    width: '40px',
    height: '40px',
    color: '#ffffff',
    mixBlendMode: 'difference' as const, // Using const assertion for the correct type
  }
};

function GalleryItemComponent({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <Link
      href={`/posts/${item.articleSlug}`}
      className="gallery-item block mb-2 w-full relative"
      style={styles.item}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arrow overlay that appears on hover (desktop only) */}
      {!isMobile && (
        <div 
          className="arrow-overlay"
          style={{
            ...styles.arrow,
            ...(isHovered && { 
              opacity: '1', 
              transform: 'translate(-50%, -50%) scale(1)'
            })
          }}
        >
          <svg 
            className="arrow-icon" 
            style={styles.arrowIcon}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      )}
      
      {item.videoEmbed?.url ? (
        <div 
          className="gallery-video-container w-full relative"
          style={{
            ...styles.videoContainer,
            ...((isHovered && !isMobile) && { filter: 'grayscale(0%)', opacity: '1' }),
            ...(isMobile && { filter: 'grayscale(0%)', opacity: '1' })
          }}
        >
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
        </div>
      ) : item.image?.asset?._ref ? (
        <div className="gallery-image-container w-full relative" style={styles.imageContainer}>
          <Image
            src={urlForImage(item.image)?.url() || ""}
            alt={item.image.alt || item.title || "Gallery image"}
            width={2000}
            height={0}
            quality={100}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="w-full h-auto shadow-lg"
            style={{ 
              aspectRatio: "auto",
              ...styles.image,
              ...((isHovered && !isMobile) && { filter: 'grayscale(0%)', opacity: '1' }),
              ...(isMobile && { filter: 'grayscale(0%)', opacity: '1' })
            }}
            priority={true}
          />
        </div>
      ) : (
        <div 
          className="gallery-placeholder w-full h-64 flex items-center justify-center"
          style={{
            ...styles.placeholder,
            ...((isHovered && !isMobile) && { filter: 'grayscale(0%)', opacity: '1' }),
            ...(isMobile && { filter: 'grayscale(0%)', opacity: '1' })
          }}
        >
          <span className="text-gray-400">Image</span>
        </div>
      )}
    </Link>
  );
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          const nonFeatured = data.filter((item: GalleryItem) => !item.featured);
          setGalleryItems(nonFeatured);
          setShuffledItems([...nonFeatured].sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!galleryItems.length) {
    return (
      <div className="container mx-auto px-40 py-40">
        <div className="text-center py-40">
          <h2 className="text-2xl font-bold"></h2>
          <p className="mt-40"></p>
        </div>
      </div>
    );
  }

  // Distribute items across columns
  const columnItems = Array.from({ length: 3 }, (_, i) => 
    shuffledItems.filter((_, index) => index % 3 === i)
  );

  return (
    <div className="container mx-auto px-5">
      <div style={styles.container}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-1" style={styles.grid}>
          {columnItems.map((items, idx) => (
            <div key={idx} className="flex flex-col space-y-0" style={styles.column}>
              {items.map(item => (
                <GalleryItemComponent key={item._id} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}