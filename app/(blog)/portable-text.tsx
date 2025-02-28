// app/(blog)/portable-text.tsx - AAAA
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils"; 
import Image from "next/image";

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

      image: ({ value }) => {
        // Check if we have a valid asset reference
        if (!value?.asset?._ref) {
          return null;
        }

        try {
          // For direct debugging, let's construct a direct Sanity CDN URL
          const assetRef = value.asset._ref;
          const refParts = assetRef.split('-');
          const imageId = refParts[1]; // The actual ID is the second part
          const formatPart = refParts[refParts.length - 1]; // Format is the last part
          const format = formatPart === 'jpg' ? 'jpg' : 
                        formatPart === 'png' ? 'png' : 
                        formatPart === 'webp' ? 'webp' : 
                        formatPart === 'gif' ? 'gif' : 'jpg';

          const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
          const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
          
          // Direct URL to the Sanity CDN
          const directUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}.${format}`;
          
          return (
            <div className="my-6 flex justify-center">
              <img 
                src={directUrl}
                alt={value.alt || "Blog image"}
                className="rounded-lg shadow-md max-w-full h-auto"
                loading="lazy"
              />
            </div>
          );
        } catch (error) {
          console.error("Error rendering image:", error, value);
          return (
            <div className="my-4 p-4 bg-red-50 text-red-500 rounded-lg">
              Image failed to load
            </div>
          );
        }
      }
    },
  };

  return (
    <div className={["prose lg:prose-xl", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
