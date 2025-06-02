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
  row: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    gap: '0.5rem', 
    marginBottom: '0.5rem',
    width: '100%'
  },
  item: { 
    marginBottom: '0rem', 
    overflow: 'hidden', 
    position: 'relative' as const,
    minWidth: '200px', // Minimum width for items
    maxWidth: '800px'   // Increased maximum width for wider items
  },
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
    mixBlendMode: 'difference' as const,
  },
  arrowIcon: {
    width: '40px',
    height: '40px',
    color: '#ffffff',
    mixBlendMode: 'difference' as const,
  }
};

// Function to get image dimensions and calculate aspect ratio
function getItemAspectRatio(item: GalleryItem): number {
  if (item.videoEmbed?.aspectRatio) {
    const [width, height] = item.videoEmbed.aspectRatio.split(':').map(Number);
    return width / height;
  }
  
  if (item.image?.asset?.metadata?.dimensions) {
    const { width, height } = item.image.asset.metadata.dimensions;
    return width / height;
  }
  
  // Default aspect ratio if no dimensions available
  return 1.5; // 3:2 ratio
}

// Function to calculate width based on aspect ratio
function calculateWidth(aspectRatio: number): string {
  // Map aspect ratios to width percentages
  if (aspectRatio >= 2.5) {
    // Very wide (panoramic): 70-80%
    return '75%';
  } else if (aspectRatio >= 2.0) {
    // Wide: 60-70%
    return '65%';
  } else if (aspectRatio >= 1.5) {
    // Moderately wide (3:2, 16:9): 45-55%
    return '50%';
  } else if (aspectRatio >= 1.2) {
    // Slightly wide: 35-45%
    return '40%';
  } else if (aspectRatio >= 0.8) {
    // Square-ish: 30-35%
    return '32%';
  } else if (aspectRatio >= 0.6) {
    // Portrait: 25-30%
    return '27%';
  } else {
    // Very tall portrait: 20-25%
    return '22%';
  }
}

function GalleryItemComponent({ item, width }: { item: GalleryItem; width: string }) {
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
      className="gallery-item block relative"
      style={{
        ...styles.item,
        width: isMobile ? '100%' : width,
        flex: isMobile ? 'none' : `0 0 ${width}`
      }}
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

// Enhanced function to create rows with dynamic width distribution
function createRows(items: GalleryItem[]) {
  const rows: Array<Array<{ item: GalleryItem; width: string }>> = [];
  let currentIndex = 0;

  while (currentIndex < items.length) {
    const remainingItems = items.length - currentIndex;
    
    // Calculate aspect ratios for next few items to make smarter grouping decisions
    const nextItems = items.slice(currentIndex, currentIndex + Math.min(4, remainingItems));
    const aspectRatios = nextItems.map(item => getItemAspectRatio(item));
    
    let itemsInRow: number;
    let rowItems: GalleryItem[] = [];
    
    // Smart grouping based on aspect ratios
    if (remainingItems === 1) {
      itemsInRow = 1;
      rowItems = [nextItems[0]];
    } else if (remainingItems === 2) {
      itemsInRow = 2;
      rowItems = [nextItems[0], nextItems[1]];
    } else {
      // For 3+ items, make decisions based on aspect ratios
      const firstRatio = aspectRatios[0];
      
      if (firstRatio >= 2.0) {
        // Very wide item - put it alone or with one small item
        if (aspectRatios.length > 1 && aspectRatios[1] <= 0.8) {
          itemsInRow = 2;
          rowItems = [nextItems[0], nextItems[1]];
        } else {
          itemsInRow = 1;
          rowItems = [nextItems[0]];
        }
      } else if (firstRatio <= 0.8) {
        // Portrait item - try to group with others
        let portraitCount = 0;
        for (let i = 0; i < Math.min(3, aspectRatios.length); i++) {
          if (aspectRatios[i] <= 0.8) portraitCount++;
          else break;
        }
        itemsInRow = Math.min(3, Math.max(2, portraitCount));
        rowItems = nextItems.slice(0, itemsInRow);
      } else {
        // Regular items - random distribution
        const options = [2, 2, 3];
        itemsInRow = options[Math.floor(Math.random() * options.length)];
        rowItems = nextItems.slice(0, itemsInRow);
      }
    }

    // Create the row with dynamic widths based on aspect ratios
    const row: Array<{ item: GalleryItem; width: string }> = [];
    
    if (itemsInRow === 1) {
      // Single item - use its natural width
      const aspectRatio = getItemAspectRatio(rowItems[0]);
      row.push({
        item: rowItems[0],
        width: calculateWidth(aspectRatio)
      });
    } else {
      // Multiple items - distribute width based on their aspect ratios
      const totalAspectRatio = rowItems.reduce((sum, item) => sum + getItemAspectRatio(item), 0);
      
      for (let i = 0; i < itemsInRow; i++) {
        const itemAspectRatio = getItemAspectRatio(rowItems[i]);
        const proportion = itemAspectRatio / totalAspectRatio;
        
        // Convert proportion to percentage, with some bounds
        let widthPercent = Math.round(proportion * 90); // Use 90% of total width
        widthPercent = Math.max(20, Math.min(60, widthPercent)); // Clamp between 20% and 60%
        
        row.push({
          item: rowItems[i],
          width: `${widthPercent}%`
        });
      }
    }
    
    rows.push(row);
    currentIndex += itemsInRow;
  }
  
  return rows;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>([]);
  const [rows, setRows] = useState<Array<Array<{ item: GalleryItem; width: string }>>>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          const nonFeatured = data.filter((item: GalleryItem) => !item.featured);
          setGalleryItems(nonFeatured);
          const shuffled = [...nonFeatured].sort(() => Math.random() - 0.5);
          setShuffledItems(shuffled);
          setRows(createRows(shuffled));
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

  return (
    <div className="container mx-auto px-5">
      <div style={styles.container}>
        {/* Mobile: Single column layout */}
        <div className="block md:hidden">
          <div className="flex flex-col space-y-2">
            {shuffledItems.map(item => (
              <GalleryItemComponent key={item._id} item={item} width="100%" />
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal rows layout */}
        <div className="hidden md:block">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={styles.row}>
              {row.map(({ item, width }, itemIndex) => (
                <GalleryItemComponent 
                  key={`${rowIndex}-${itemIndex}-${item._id}`} 
                  item={item} 
                  width={width} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}