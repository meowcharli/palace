"use client";

// app/(blog)/portable-text.tsx - CLIENT COMPONENT
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils"; 
import Image from "next/image";
import { useState } from "react";

// Helper function to parse Sanity image reference
function parseAssetRef(ref) {
  if (!ref || typeof ref !== 'string') return null;
  
  try {
    // Format is typically: image-Tb9Ew8CXIwaY6R1kjMvI9uRR-2000x1000-jpg
    const refParts = ref.split('-');
    
    // Need at least 3 parts: "image", [id], [format]
    if (refParts.length < 3) return null;
    
    // Get the ID (could be multiple segments for complex IDs)
    const idParts = refParts.slice(1, -1);
    const id = idParts.join('-');
    
    // Get the format (last part, may include dimensions)
    const lastPart = refParts[refParts.length - 1];
    let format = lastPart;
    
    // If the last part has dimensions (like 2000x1000-jpg)
    if (lastPart.includes('x') && lastPart.includes('-')) {
      format = lastPart.split('-').pop();
    }
    
    return { id, format };
  } catch (error) {
    console.error("Error parsing asset reference:", error);
    return null;
  }
}

// Image component that tries multiple approaches
function SanityImage({ value }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [approachIndex, setApproachIndex] = useState(0);
  
  if (!value?.asset?._ref) return null;
  
  // Get image dimensions from the reference if available
  let width = 800;
  let height = 500;
  
  try {
    const ref = value.asset._ref;
    const dimensionMatch = ref.match(/(\d+)x(\d+)/);
    if (dimensionMatch) {
      width = parseInt(dimensionMatch[1]);
      height = parseInt(dimensionMatch[2]);
    }
  } catch (e) {
    console.warn("Could not extract dimensions:", e);
  }
  
  // Create placeholder/fallback with correct dimensions
  const placeholder = (
    <div 
      className="bg-gray-200 rounded-lg" 
      style={{ 
        width: '100%', 
        maxWidth: `${width}px`,
        aspectRatio: `${width}/${height}`,
        margin: '0 auto'
      }}
    >
      <div className="flex items-center justify-center h-full text-gray-500">
        Image loading...
      </div>
    </div>
  );

  // Parse the asset reference to get direct URL components
  const assetInfo = parseAssetRef(value.asset._ref);
  if (!assetInfo) return placeholder;
  
  const { id, format } = assetInfo;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  
  // Approach 1: Using urlForImage from Sanity
  const sanityUrl = urlForImage(value)?.width(width).height(height).url();
  
  // Approach 2: Direct CDN URL construction
  const directUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
  
  // Approach 3: Extra-direct URL construction
  let extraDirectUrl = null;
  try {
    // Very direct reference parsing
    const ref = value.asset._ref;
    const plainId = ref.replace(/^image-/, '').split('-')[0];
    extraDirectUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${plainId}.${format}`;
  } catch (e) {
    console.warn("Could not create extra-direct URL:", e);
  }
  
  // Select approach based on current state
  const urls = [
    sanityUrl,
    directUrl,
    extraDirectUrl
  ].filter(Boolean);
  
  // If all approaches failed, show error
  if (approachIndex >= urls.length) {
    console.error("All image loading approaches failed for:", value);
    return (
      <div className="my-4 max-w-2xl mx-auto p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Image failed to load</p>
        <details className="mt-2 text-xs">
          <summary>Debug info</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify({
              ref: value.asset._ref,
              parsed: assetInfo,
              urls: urls
            }, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
  
  const currentUrl = urls[approachIndex];
  
  // Display an image with the correct proportions
  return (
    <div className="my-6 flex justify-center">
      <div className="relative max-w-full" style={{ maxWidth: `${width}px` }}>
        <img
          src={currentUrl}
          alt={value.alt || "Blog image"}
          width={width}
          height={height}
          className="rounded-lg shadow-md max-w-full h-auto"
          onError={() => {
            console.warn(`Image approach ${approachIndex + 1} failed, trying next approach`);
            setApproachIndex(prev => prev + 1);
          }}
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
      
      // Use our enhanced image component
      image: ({ value }) => <SanityImage value={value} />
    },
  };

  return (
    <div className={["prose lg:prose-xl", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
