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

// Extract Vimeo ID from a URL or embed code
export const getVimeoId = (input: string): string | null => {
  // Check if it's an embed code by looking for iframe
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["'](https?:\/\/player\.vimeo\.com\/video\/(\d+)[^"']*)["']/i);
    if (srcMatch && srcMatch[2]) {
      return srcMatch[2];
    }
  }
  
  // Handle normal vimeo URLs
  const urlRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i;
  const urlMatch = input.match(urlRegex);
  return urlMatch ? urlMatch[1] : null;
};

// Parse parameters from an embed code if present
export const parseEmbedParameters = (embedCode: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  if (embedCode.includes('<iframe')) {
    const srcMatch = embedCode.match(/src=["']([^"']*)["']/i);
    if (srcMatch && srcMatch[1]) {
      const url = new URL(srcMatch[1]);
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }
  }
  
  return params;
};

// Build Vimeo embed URL with optional parameters
export const buildVimeoEmbedUrl = (
  vimeoId: string,
  options: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    background?: boolean;
    color?: string;
    portrait?: boolean;
    title?: boolean;
    byline?: boolean;
    dnt?: boolean; // Do Not Track
  } = {}
): string => {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.loop) params.append('loop', '1');
  if (options.muted) params.append('muted', '1');
  if (options.background) params.append('background', '1');
  if (options.color !== undefined) params.append('color', options.color.replace('#', ''));
  if (options.portrait === false) params.append('portrait', '0');
  if (options.title === false) params.append('title', '0');
  if (options.byline === false) params.append('byline', '0');
  if (options.dnt) params.append('dnt', '1');
  
  // Always add these for better performance
  params.append('app_id', 'your_site_name');
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return `https://player.vimeo.com/video/${vimeoId}${queryString}`;
};

// Generate full embed code with custom parameters
export const generateVimeoEmbedCode = (
  vimeoId: string,
  options: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    background?: boolean;
    color?: string;
    width?: string;
    height?: string;
    responsive?: boolean;
    portrait?: boolean;
    title?: boolean;
    byline?: boolean;
    dnt?: boolean;
  } = {}
): string => {
  const embedUrl = buildVimeoEmbedUrl(vimeoId, options);
  const width = options.width || '640';
  const height = options.height || '360';
  
  if (options.responsive) {
    return `<div style="padding:56.25% 0 0 0;position:relative;">
      <iframe src="${embedUrl}" 
        style="position:absolute;top:0;left:0;width:100%;height:100%;" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen
        title="Vimeo Video Player">
      </iframe>
    </div>
    <script src="https://player.vimeo.com/api/player.js"></script>`;
  }
  
  return `<iframe 
    src="${embedUrl}" 
    width="${width}" 
    height="${height}" 
    frameborder="0" 
    allow="autoplay; fullscreen; picture-in-picture" 
    allowfullscreen
    title="Vimeo Video Player">
  </iframe>
  <script src="https://player.vimeo.com/api/player.js"></script>`;
};
