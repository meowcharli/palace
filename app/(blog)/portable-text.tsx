import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";

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
        if (!value?.asset?._ref) return null;

        return (
          <div className="my-4 flex justify-center">
            <img
              src={value.asset.url}
              alt={value.alt || "Blog image"}
              className="rounded-lg shadow-md max-w-full h-auto"
            />
          </div>
        );
      },
    },
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
