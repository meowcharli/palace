import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import { getVimeoId, buildVimeoEmbedUrl, parseEmbedParameters } from "@/utils/vimeo";

// Either import the VideoEmbed interface with the correct path
// import { VideoEmbed } from "@/sanity.types";
// Or define it locally
interface VideoEmbed {
  url?: string;
  embedCode?: string;
  hideControls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

interface CoverImageProps {
  image: any;
  videoEmbed?: VideoEmbed | string;
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, videoEmbed, priority } = props;

  // Handle both string and object formats for backward compatibility
  let vimeoUrl: string | undefined;
  let embedCode: string | undefined;
  let hideControls = false;
  let autoplay = false;
  let loop = false;

  if (typeof videoEmbed === 'string') {
    vimeoUrl = videoEmbed;
  } else if (videoEmbed) {
    vimeoUrl = videoEmbed.url;
    embedCode = videoEmbed.embedCode;
    hideControls = videoEmbed.hideControls || false;
    autoplay = videoEmbed.autoplay || false;
    loop = videoEmbed.loop || false;
  }

  // First try to get Vimeo ID from embed code if available
  let vimeoId: string | null = null;
  
  if (embedCode) {
    vimeoId = getVimeoId(embedCode);
    
    // If we have a valid embed code, just use it directly
    if (vimeoId && embedCode.includes('<iframe')) {
      const content = (
        <div 
          className="video-embed w-full"
          dangerouslySetInnerHTML={{ __html: embedCode }} 
        />
      );
      
      return (
        <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
          {content}
        </div>
      );
    }
  }
  
  // Otherwise, fall back to URL-based embed
  if (!vimeoId && vimeoUrl) {
    vimeoId = getVimeoId(vimeoUrl);
  }
  
  // Build the embed URL with options if we have a valid ID
  const embedUrl = vimeoId ? buildVimeoEmbedUrl(vimeoId, {
    autoplay,
    loop,
    background: hideControls, // Use background parameter to hide UI controls
    muted: autoplay, // If autoplay is enabled, mute the video (browser requirement)
    portrait: !hideControls,
    title: !hideControls,
    byline: !hideControls,
    color: '00adef' // Use your brand color
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
