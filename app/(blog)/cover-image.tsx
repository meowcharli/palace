import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
  videoEmbed?: string;
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, videoEmbed, priority } = props;

  const content = videoEmbed ? (
    <div className="video-embed">
      <iframe
        src={videoEmbed}
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
