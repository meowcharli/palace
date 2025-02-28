// app/(blog)/portable-text.tsx - ENHANCED DEBUGGING VERSION
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
  // Debug the incoming value to see what we're working with
  console.log('PortableText value:', JSON.stringify(value, null, 2));

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
        // Debug logging to see exactly what we're working with
        console.log('Image value:', JSON.stringify(value, null, 2));
        
        // Check if we have a valid asset reference
        if (!value?.asset?._ref) {
          console.error("Missing image asset reference:", value);
          return (
            <div className="my-4 p-4 bg-red-50 text-red-500 rounded-lg">
              Error: Missing image reference 
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          );
        }

        try {
          // Generate the image URL with proper sizing
          const imageUrlBuilder = urlForImage(value);
          
          if (!imageUrlBuilder) {
            console.error("Could not build image URL from:", value);
            return (
              <div className="my-4 p-4 bg-red-50 text-red-500 rounded-lg">
                Error: Could not build image URL
              </div>
            );
          }
          
          // Generate the URL explicitly with width and height
          const imageUrl = imageUrlBuilder.width(800).height(500).url();
          
          console.log('Generated image URL:', imageUrl);
          
          if (!imageUrl) {
            console.error("Failed to generate image URL");
            return (
              <div className="my-4 p-4 bg-red-50 text-red-500 rounded-lg">
                Error: Failed to generate image URL
              </div>
            );
          }

          // Fallback to direct URL construction if the above fails - this is a last resort
          const fallbackUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${value.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp').replace('-gif', '.gif')}`;
          
          console.log('Fallback URL:', fallbackUrl);

          // Add a way to toggle between next/image and regular img tag for debugging
          const useNextImage = true;

          return (
            <div className="my-6 flex justify-center">
              <div className="relative w-full max-w-2xl overflow-hidden">
                {useNextImage ? (
                  <Image
                    src={imageUrl || fallbackUrl}
                    alt={value.alt || "Blog image"}
                    className="rounded-lg shadow-md"
                    width={800}
                    height={500}
                    sizes="(max-width: 800px) 100vw, 800px"
                    unoptimized={!imageUrl} // If using fallback, don't optimize
                  />
                ) : (
                  <img 
                    src={imageUrl || fallbackUrl}
                    alt={value.alt || "Blog image"}
                    className="rounded-lg shadow-md w-full h-auto"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error rendering image:", error);
          return (
            <div className="my-4 p-4 bg-red-50 text-red-500 rounded-lg">
              Failed to load image: {(error as Error).message}
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          );
        }
      },
    },
  };

  return (
    <div className={["prose lg:prose-xl", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
