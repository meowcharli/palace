// app/(blog)/portable-text.tsx - FIXED VERSION
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
          console.log("Missing image asset reference", value);
          return null;
        }

        try {
          // Generate the image URL with proper sizing
          const imageBuilder = urlForImage(value);
          
          if (!imageBuilder) {
            console.log("Could not build image URL", value);
            return null;
          }
          
          const imageUrl = imageBuilder.width(800).height(500).url();
          
          if (!imageUrl) {
            console.log("Failed to generate image URL");
            return null;
          }

          return (
            <div className="my-6 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <Image
                  src={imageUrl}
                  alt={value.alt || "Blog image"}
                  className="rounded-lg shadow-md"
                  width={800}
                  height={500}
                  sizes="(max-width: 800px) 100vw, 800px"
                />
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error rendering image:", error);
          return (
            <div className="my-4 p-4 bg-red-50 text-red-500 rounded-lg">
              Failed to load image
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
