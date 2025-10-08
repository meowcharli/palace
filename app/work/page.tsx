'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VimeoEmbed from "@/components/VimeoEmbed";
import { urlForImage } from "@/sanity/lib/utils";
import type { showcaseItem } from "@/utils/types";

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
    borderRadius: '0',
  },
  videoContainer: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: '0',
    transition: 'all 0.4s ease',
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    color: '#8E8E93',
    fontWeight: '500',
    fontSize: '1.2rem',
    borderRadius: '0',
    textAlign: 'center' as const,
    padding: '1rem 1rem',
    transition: 'all 0.4s ease',
  },
  plusIcon: {
    position: 'absolute' as const,
    top: '16px',
    left: '16px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    zIndex: '10',
    pointerEvents: 'none' as const,
    transform: 'scale(0.8)',
    mixBlendMode: 'difference' as const,
  },
  plus: {
    width: '32px',
    height: '32px',
    position: 'relative' as const,
  },
  plusHorizontal: {
    position: 'absolute' as const,
    top: '50%',
    left: '0',
    width: '32px',
    height: '4px',
    backgroundColor: '#ffffff',
    transform: 'translateY(-50%)',
  },
  plusVertical: {
    position: 'absolute' as const,
    top: '0',
    left: '50%',
    width: '4px',
    height: '32px',
    backgroundColor: '#ffffff',
    transform: 'translateX(-50%)',
  }
};

// Function to get image dimensions and calculate aspect ratio
function getItemAspectRatio(item: showcaseItem): number {
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

function ShowcaseItemComponent({ item, width }: { item: showcaseItem; width: string }) {
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
      className="showcase-item block relative"
      style={{
        ...styles.item,
        width: isMobile ? '100%' : width,
        flex: isMobile ? 'none' : `0 0 ${width}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Plus icon overlay that appears on hover (desktop only) */}
      {!isMobile && (
        <div 
          className="plus-overlay"
          style={{
            ...styles.plusIcon,
            ...(isHovered && { 
              opacity: '1', 
              transform: 'scale(1)'
            })
          }}
        >
          <div style={styles.plus}>
            <div style={styles.plusHorizontal}></div>
            <div style={styles.plusVertical}></div>
          </div>
        </div>
      )}
      
      {item.videoEmbed?.url ? (
        <div 
          className="showcase-video-container w-full relative"
          style={styles.videoContainer}
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
        <div className="showcase-image-container w-full relative" style={styles.imageContainer}>
          <Image
            src={urlForImage(item.image)?.url() || ""}
            alt={item.image.alt || item.title || "Showcase image"}
            width={2000}
            height={0}
            quality={100}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="w-full h-auto shadow-lg"
            style={{ 
              aspectRatio: "auto",
              ...styles.image
            }}
            priority={true}
          />
        </div>
      ) : (
        <div 
          className="showcase-placeholder w-full h-64 flex items-center justify-center"
          style={styles.placeholder}
        >
          <span className="text-gray-400">Image</span>
        </div>
      )}
    </Link>
  );
}

// Enhanced function to create rows with dynamic width distribution
function createRows(items: showcaseItem[]) {
  const rows: Array<Array<{ item: showcaseItem; width: string }>> = [];
  let currentIndex = 0;

  while (currentIndex < items.length) {
    const remainingItems = items.length - currentIndex;
    
    // Calculate aspect ratios for next few items to make smarter grouping decisions
    const nextItems = items.slice(currentIndex, currentIndex + Math.min(4, remainingItems));
    const aspectRatios = nextItems.map(item => getItemAspectRatio(item));
    
    let itemsInRow: number;
    let rowItems: showcaseItem[] = [];
    
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
    const row: Array<{ item: showcaseItem; width: string }> = [];
    
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

export default function WorkPage() {
  const [showcaseItems, setShowcaseItems] = useState<showcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffledItems, setShuffledItems] = useState<showcaseItem[]>([]);
  const [rows, setRows] = useState<Array<Array<{ item: showcaseItem; width: string }>>>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/showcase");
        if (res.ok) {
          const data = await res.json();
          const nonFeatured = data.filter((item: showcaseItem) => !item.featured);
          setShowcaseItems(nonFeatured);
          const shuffled = [...nonFeatured].sort(() => Math.random() - 0.5);
          setShuffledItems(shuffled);
          setRows(createRows(shuffled));
        }
      } catch (error) {
        console.error("Error fetching showcase data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!showcaseItems.length) {
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
              <ShowcaseItemComponent key={item._id} item={item} width="100%" />
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal rows layout */}
        <div className="hidden md:block">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={styles.row}>
              {row.map(({ item, width }, itemIndex) => (
                <ShowcaseItemComponent 
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
