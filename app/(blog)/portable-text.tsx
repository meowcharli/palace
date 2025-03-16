"use client";

// app/(blog)/portable-text.tsx - DARK MODE VERSION
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

// Simplified Sanity image component
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
      // Generate image URL using urlForImage from your utils
      const imgUrl = urlForImage(value)?.width(800).url();
      
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
          const directUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
          
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
      <div className="my-6 flex justify-center">
        <div className="bg-gray-800 rounded-lg animate-pulse w-full h-64"></div>
      </div>
    );
  }
  
  if (error || !imageUrl) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="my-4 p-4 border border-red-800 bg-red-900 rounded-lg text-red-300">
          <p>Image failed to load: {JSON.stringify(value, null, 2)}</p>
        </div>
      );
    }
    return null;
  }
  
  return (
    <div className="my-6 flex justify-center">
      <img
        src={imageUrl}
        alt={value?.alt || "Article image"}
        className="max-w-full h-auto rounded-lg shadow-md"
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
        <h1 className="mb-4 text-3xl font-bold text-white">{children}</h1>
      ),
      h2: ({children}) => (
        <h2 className="mb-4 text-2xl font-bold text-white">{children}</h2>
      ),
      h3: ({children}) => (
        <h3 className="mb-4 text-xl font-bold text-white">{children}</h3>
      ),
      h4: ({children}) => (
        <h4 className="mb-4 text-lg font-bold text-white">{children}</h4>
      ),
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold text-white">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold text-white">{children}</h6>
      ),
      normal: ({children}) => (
        <p className="mb-4 text-lg text-gray-300">{children}</p>
      ),
      blockquote: ({children}) => (
        <blockquote className="border-l-4 border-gray-700 pl-4 my-4 italic text-gray-400">{children}</blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a 
          href={value?.href} 
          className="text-blue-400 hover:underline"
          rel="noreferrer noopener"
          target={value?.href?.startsWith('http') ? '_blank' : undefined}
        >
          {children}
        </a>
      ),
      strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
      em: ({children}) => <em className="italic text-gray-300">{children}</em>,
    },
    types: {
      video: ({ value }) => {
        if (!value?.url) return null;

        const isYouTube = value.url.includes("youtube.com") || value.url.includes("youtu.be");
        const isVimeo = value.url.includes("vimeo.com");

        if (isYouTube) {
          return (
            <div className="my-6">
              <div className="responsive-iframe-container">
                <iframe
                  src={value.url.replace("watch?v=", "embed/")}
                  title="YouTube Video"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
              {value.caption && <p className="text-center text-sm mt-2 text-gray-400">{value.caption}</p>}
            </div>
          );
        }

        if (isVimeo) {
          return (
            <div className="my-6">
              <div className="responsive-iframe-container">
                <iframe
                  src={`https://player.vimeo.com/video/${value.url.split("/").pop()}`}
                  title="Vimeo Video"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
              {value.caption && <p className="text-center text-sm mt-2 text-gray-400">{value.caption}</p>}
            </div>
          );
        }

        return <a href={value.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Watch Video</a>;
      },
      
      // Use our simplified image component
      image: ({ value }) => <SanityImage value={value} />
    },
  };

  return (
    <div className={["prose lg:prose-xl max-w-none text-white", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
