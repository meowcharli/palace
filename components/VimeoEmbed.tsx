import React from 'react';
import { getVimeoId, buildVimeoEmbedUrl } from '../utils/vimeo';
import Image from 'next/image';

interface VimeoEmbedProps {
  url: string;
  caption?: string;
  showThumbnail?: boolean;
  className?: string;
}

const VimeoEmbed: React.FC<VimeoEmbedProps> = ({ 
  url, 
  caption,
  showThumbnail = false,
  className = ''
}) => {
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string | null>(null);
  const [playing, setPlaying] = React.useState(!showThumbnail);
  
  const vimeoId = getVimeoId(url);
  
  if (!vimeoId) {
    return <div className="text-red-500">Invalid Vimeo URL</div>;
  }

  // If thumbnail mode is on, fetch the thumbnail image
  React.useEffect(() => {
    if (showThumbnail && vimeoId) {
      // For simplicity, we're using the oEmbed API to get the thumbnail
      // Note: In production, you might want to cache this or use a server component
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`)
        .then(res => res.json())
        .then(data => {
          setThumbnailUrl(data.thumbnail_url);
        })
        .catch(err => {
          console.error('Error fetching Vimeo thumbnail:', err);
        });
    }
  }, [vimeoId, showThumbnail]);

  // Thumbnail mode
  if (showThumbnail && !playing) {
    return (
      <div className={`video-thumbnail-container ${className}`}>
        {thumbnailUrl ? (
          <div 
            className="relative cursor-pointer" 
            onClick={() => setPlaying(true)}
          >
            <Image 
              src={thumbnailUrl} 
              alt={caption || "Video thumbnail"} 
              width={640} 
              height={360} 
              className="rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-200 animate-pulse rounded-lg aspect-video flex items-center justify-center">
            <span>Loading thumbnail...</span>
          </div>
        )}
        {caption && <p className="video-caption mt-2">{caption}</p>}
      </div>
    );
  }

  // Embedded player mode
  return (
    <div className={`video-container ${className}`}>
      <div className="responsive-iframe-container">
        <iframe 
          src={buildVimeoEmbedUrl(vimeoId, {
            autoplay: playing,
            loop: false,
          })}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
          title={caption || "Vimeo video player"}
        />
      </div>
      {caption && <p className="video-caption mt-2">{caption}</p>}
    </div>
  );
};

export default VimeoEmbed;
