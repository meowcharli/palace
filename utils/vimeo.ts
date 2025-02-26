export interface VimeoThumbnail {
  width: number;
  height: number;
  url: string;
}

export interface VimeoMetadata {
  title: string;
  description: string;
  thumbnails: VimeoThumbnail[];
  duration: number;
  uploadDate: string;
}

// Extract Vimeo ID from a URL
export const getVimeoId = (url: string): string | null => {
  const regex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Build Vimeo embed URL with optional parameters
export const buildVimeoEmbedUrl = (
  vimeoId: string,
  options: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    background?: boolean;
  } = {}
): string => {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.loop) params.append('loop', '1');
  if (options.muted) params.append('muted', '1');
  if (options.background) params.append('background', '1');
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return `https://player.vimeo.com/video/${vimeoId}${queryString}`;
};
