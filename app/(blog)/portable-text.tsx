"use client";

// app/(blog)/portable-text.tsx - UPDATED VERSION WITH PADDING AND NO CAPTIONS
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { imageBuilder, urlForImage } from "@/sanity/lib/utils"; 
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

// Simplified Sanity image component with padding and 100% quality
function SanityImage({ value }: { value: SanityImageValue }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (!value?.asset?._ref) {
      setError(true);
      setLoading(false);
      return;
    }
    
    try {
      // Generate image URL using urlForImage with 100% quality
      const imgUrl = urlForImage(value)?.width(1200).quality(100).url();
      
      if (imgUrl) {
        setImageUrl(imgUrl);
        setLoading(false);
      } else {
        // Fallback to direct URL construction
        const ref = value.asset._ref;
        const [, id, dimensions, format] = ref.split('-');
        
        if (id && format) {
          const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
          const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
          const directUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}?q=100`;
          
          setImageUrl(directUrl);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Error creating image URL:", err);
      setError(true);
      setLoading(false);
    }
  }, [value]);
  
  if (loading) {
    return (
      <div className="my-8 px-8">
        <div className="bg-gray-200 animate-pulse w-full h-64"></div>
      </div>
    );
  }
  
  if (error || !imageUrl) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="my-6 mx-8 p-4 border border-red-300 bg-red-50 rounded-lg text-red-700">
          <p>Image failed to load: {JSON.stringify(value, null, 2)}</p>
        </div>
      );
    }
    return null;
  }
  
  return (
    <div className="my-8 px-8">
      <img
        src={imageUrl}
        alt={value?.alt || "Article image"}
        className="w-full h-auto object-cover"
      />
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
      h1: ({children}) => (
        <div className="max-w-2xl px-8">
          <h1 className="mb-4 text-3xl font-bold text-black">{children}</h1>
        </div>
      ),
      h2: ({children}) => (
        <div className="max-w-2xl px-8">
          <h2 className="mb-4 text-2xl font-bold text-black">{children}</h2>
        </div>
      ),
      h3: ({children}) => (
        <div className="max-w-2xl px-8">
          <h3 className="mb-4 text-xl font-bold text-black">{children}</h3>
        </div>
      ),
      h4: ({children}) => (
        <div className="max-w-2xl px-8">
          <h4 className="mb-4 text-lg font-bold text-black">{children}</h4>
        </div>
      ),
      h5: ({ children }) => (
        <div className="max-w-2xl px-8">
          <h5 className="mb-2 text-sm font-semibold text-black">{children}</h5>
        </div>
      ),
      h6: ({ children }) => (
        <div className="max-w-2xl px-8">
          <h6 className="mb-1 text-xs font-semibold text-black">{children}</h6>
        </div>
      ),
      normal: ({children}) => (
        <div className="max-w-2xl px-8">
          <p className="mb-4 text-lg text-black">{children}</p>
        </div>
      ),
      blockquote: ({children}) => (
        <div className="max-w-2xl px-8">
          <blockquote className="border-l-4 border-gray-700 pl-4 my-4 italic text-black">{children}</blockquote>
        </div>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a 
          href={value?.href} 
          className="text-blue-600 hover:text-blue-800 hover:underline"
          rel="noreferrer noopener"
          target={value?.href?.startsWith('http') ? '_blank' : undefined}
        >
          {children}
        </a>
      ),
      strong: ({children}) => <strong className="font-bold text-black">{children}</strong>,
      em: ({children}) => <em className="italic text-gray-600">{children}</em>,
    },
    types: {
      video: ({ value }) => {
        if (!value?.url) return null;

        const isYouTube = value.url.includes("youtube.com") || value.url.includes("youtu.be");
        const isVimeo = value.url.includes("vimeo.com");

        if (isYouTube) {
          return (
            <div className="my-8 px-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={value.url.replace("watch?v=", "embed/")}
                  title="YouTube Video"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          );
        }

        if (isVimeo) {
          return (
            <div className="my-8 px-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://player.vimeo.com/video/${value.url.split("/").pop()}`}
                  title="Vimeo Video"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          );
        }

        return <a href={value.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Watch Video</a>;
      },
      
      // Use our updated image component
      image: ({ value }) => <SanityImage value={value} />
    },
  };

  return (
    <div className={["prose lg:prose-xl max-w-none", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}