import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import VimeoEmbed from "@/components/VimeoEmbed";
import { VimeoEmbedProps } from "@/utils/types";

interface CoverImageProps {
  image: any;
  videoEmbed?: VimeoEmbedProps | string;
  priority?: boolean;
}

export default function CoverImage({ image, videoEmbed, priority = false }: CoverImageProps) {
  // If we have a valid video embed, render it instead of the image
  if (videoEmbed) {
    // Handle string format for backward compatibility
    const videoProps = typeof videoEmbed === 'string' 
      ? { url: videoEmbed } 
      : videoEmbed;
      
    return (
      <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
        <VimeoEmbed {...videoProps} />
      </div>
    );
  }
  
  // If we have an image, render it
  if (image?.asset?._ref) {
    return (
      <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
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
      <div className="bg-slate-50" style={{ paddingTop: "50%" }} />
    </div>
  );
}
