"use client";

// app/(blog)/portable-text.tsx - TYPESCRIPT FIXED
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils"; 
import Image from "next/image";
import { useEffect, useState } from "react";

// Define types for the image value and status
interface SanityImageAsset {
  _ref: string;
  _type?: string;
}

interface SanityImageValue {
  _type?: string;
  asset?: SanityImageAsset;
  alt?: string;
  [key: string]: any;
}

interface ImageStatus {
  loaded: boolean;
  error: boolean;
  url: string;
  debugInfo: Record<string, any>;
}

// Simplified direct Sanity image component
function SimpleSanityImage({ value }: { value: SanityImageValue }) {
  const [imageStatus, setImageStatus] = useState<ImageStatus>({
    loaded: false,
    error: false,
    url: "",
    debugInfo: {}
  });
  
  useEffect(() => {
    if (!value?.asset?._ref) return;
    
    // Parse the asset reference directly - simplified approach
    try {
      const ref = value.asset._ref;
      console.log("Image reference:", ref);
      
      // Extract the ID part - the format is typically image-[id]-dimensions-format
      // e.g., image-abc123-800x600-jpg
      const match = ref.match(/^image-([a-zA-Z0-9]+)(?:-\d+x\d+)?-([a-z]+)$/);
      
      if (!match) {
        console.error("Invalid image reference format:", ref);
        setImageStatus({
          loaded: false, 
          error: true,
          url: "",
          debugInfo: { error: "Invalid reference format", ref }
        });
        return;
      }
      
      const imageId = match[1];
      const format = match[2];
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
      
      // Construct a direct URL - this should work regardless of the Sanity client
      const directUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}.${format}`;
      
      // Test if the URL is accessible
      const imgElement = new Image();
      imgElement.onload = () => {
        console.log("Image loaded successfully:", directUrl);
        setImageStatus({
          loaded: true,
          error: false,
          url: directUrl,
          debugInfo: { imageId, format, projectId, dataset, ref }
        });
      };
      imgElement.onerror = () => {
        console.error("Failed to load image:", directUrl);
        // Try alternative URL formats
        const altUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref.replace('image-', '').split('-')[0]}.${format}`;
        console.log("Trying alternate URL:", altUrl);
        
        setImageStatus({
          loaded: false,
          error: true,
          url: directUrl, // We'll still try to display it
          debugInfo: { imageId, format, projectId, dataset, ref, altUrl }
        });
      };
      imgElement.src = directUrl;
      
      // Set initial URL
      setImageStatus(prev => ({
        ...prev,
        url: directUrl,
        debugInfo: { imageId, format, projectId, dataset, ref }
      }));
      
    } catch (error) {
      console.error("Error parsing image reference:", error, value);
      setImageStatus({
        loaded: false,
        error: true,
        url: "",
        debugInfo: { error: (error as Error).message, value }
      });
    }
  }, [value]);
  
  // Get dimensions from the reference
  let width = 800;
  let height = 500;
  if (value?.asset?._ref) {
    const dimensionMatch = value.asset._ref.match(/(\d+)x(\d+)/);
    if (dimensionMatch) {
      width = parseInt(dimensionMatch[1]);
      height = parseInt(dimensionMatch[2]);
    }
  }
  
  // Return error state if needed
  if (imageStatus.error && process.env.NODE_ENV !== 'production') {
    return (
      <div className="my-4 max-w-2xl mx-auto">
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          <p className="font-bold">Image failed to load</p>
          <p>Check browser console for details</p>
          
          <details className="mt-2 text-xs">
            <summary>Debug info</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-64">
              {JSON.stringify(imageStatus.debugInfo, null, 2)}
            </pre>
          </details>
          
          {/* Still try to show the image */}
          {imageStatus.url && (
            <div className="mt-4 p-2 border border-gray-300 rounded-lg">
              <p className="text-xs mb-2">Attempted image:</p>
              <img 
                src={imageStatus.url} 
                alt="Failed to load - debug view" 
                className="max-w-full h-auto" 
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show loading placeholder if URL not set yet
  if (!imageStatus.url) {
    return (
      <div className="my-6 flex justify-center">
        <div 
          className="bg-gray-200 rounded-lg animate-pulse" 
          style={{ 
            width: '100%', 
            maxWidth: `${width}px`,
            aspectRatio: `${width}/${height}`,
          }}
        />
      </div>
    );
  }
  
  // Return the image
  return (
    <div className="my-6 flex justify-center">
      <div className="relative" style={{ width: '100%', maxWidth: `${width}px` }}>
        {/* Standard img tag for maximum compatibility */}
        <img
          src={imageStatus.url}
          alt={value?.alt || "Blog image"}
          width={width}
          height={height}
          className="rounded-lg shadow-md max-w-full h-auto"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      </div>
    </div>
  );
}

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  // Log the entire portable text value for debugging
  useEffect(() => {
    console.log('PortableText content:', value);
    // Look specifically for image blocks
    const imageBlocks = value?.filter(block => block._type === 'image');
    if (imageBlocks?.length) {
      console.log('Image blocks found:', imageBlocks);
    }
  }, [value]);

  const components: PortableTextComponents = {
    block: {
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a href={value?.href} rel="noreferrer noopener">
          {children}
        </a>
      ),
    },
    types: {
      video: ({ value }) => {
        if (!value?.url) return null;

        const isYouTube = value.url.includes("youtube.com") || value.url.includes("youtu.be");
        const isVimeo = value.url.includes("vimeo.com");

        if (isYouTube) {
          return (
            <iframe
              width="100%"
              height="400"
              src={value.url.replace("watch?v=", "embed/")}
              title="YouTube Video"
              frameBorder="0"
              allowFullScreen
            />
          );
        }

        if (isVimeo) {
          return (
            <iframe
              width="100%"
              height="400"
              src={`https://player.vimeo.com/video/${value.url.split("/").pop()}`}
              title="Vimeo Video"
              frameBorder="0"
              allowFullScreen
            />
          );
        }

        return <a href={value.url} target="_blank" rel="noopener noreferrer">Watch Video</a>;
      },
      
      // Use our simplified image component
      image: ({ value }) => <SimpleSanityImage value={value} />
    },
  };

  return (
    <div className={["prose lg:prose-xl", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
