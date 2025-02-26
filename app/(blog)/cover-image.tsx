import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import { getVimeoId, buildVimeoEmbedUrl } from "@/utils/vimeo";
import { useMemo } from "react";

interface CoverImageProps {
  image: any;
  videoEmbed?: string;
  hideControls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { 
    image: source, 
    videoEmbed, 
    hideControls = false, 
    autoplay = false, 
    loop = false, 
    priority 
  } = props;

  // Process Vimeo URL if provided
  const vimeoId = videoEmbed ? getVimeoId(videoEmbed) : null;
  
  // Build the embed URL with options
  const embedUrl = vimeoId ? buildVimeoEmbedUrl(vimeoId, {
    autoplay,
    loop,
    background: hideControls, // Use background parameter to hide UI controls
    muted: autoplay // If autoplay is enabled, mute the video (browser requirement)
  }) : null;

  const content = embedUrl ? (
    <div className="video-embed">
      <iframe
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
        className="w-full h-auto"
        style={{ aspectRatio: '16/9' }}
      ></iframe>
    </div>
  ) : source?.asset?._ref ? (
    <Image
      className="h-auto w-full"
      width={2000}
      height={1000}
      alt={source?.alt || ""}
      src={urlForImage(source)?.height(1000).width(2000).url() as string}
      sizes="100vw"
      priority={priority}
    />
  ) : (
    <div className="bg-slate-50" style={{ paddingTop: "50%" }} />
  );

  return (
    <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
      {content}
    </div>
  );
}
