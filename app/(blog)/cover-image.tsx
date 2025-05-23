import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import VimeoEmbed from "@/components/VimeoEmbed";
import { VimeoEmbedProps } from "@/utils/types";

interface CoverImageProps {
  image: any;
  videoEmbed?: VimeoEmbedProps | string;
  priority?: boolean;
}

export default function CoverImage({ 
  image, 
  videoEmbed, 
  priority = false
}: CoverImageProps) {
  // If we have a valid video embed, render it instead of the image
  if (videoEmbed) {
    // Handle string format for backward compatibility.
    // Ensure that an aspectRatio is always passed
    const videoProps: VimeoEmbedProps = typeof videoEmbed === 'string' 
      ? { url: videoEmbed, aspectRatio: "16:9" }
      : { 
          ...videoEmbed, 
          aspectRatio: videoEmbed.aspectRatio || "16:9" 
        };
        
    return (
      <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0 relative">
        {/* The actual video embed */}
        <VimeoEmbed {...videoProps} showThumbnail={true} />
        
        {/* Transparent overlay to make the entire area clickable */}
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          aria-hidden="true"
        />
      </div>
    );
  }
  
  // If we have an image, render it
  if (image?.asset?._ref) {
    return (
      <div className="transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
        <Image
          className="h-auto w-full"
          width={2000}
          height={1000}
          alt={image?.alt || ""}
          src={urlForImage(image)?.height(1000).width(2000).url() as string}
          sizes="100vw"
          priority={priority}
        />
      </div>
    );
  }
  
  // Fallback when no image or video is available
  return (
    <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
      <div className="bg-gray-900" style={{ paddingTop: "50%" }} />
    </div>
  );
}
