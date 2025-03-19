// File: utils/vimeo.ts
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
  if (!input) return null;
  
  // Handle embed codes containing iframe
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["'](https?:\/\/player\.vimeo\.com\/video\/(\d+)[^"']*)["']/i);
    if (srcMatch && srcMatch[2]) {
      return srcMatch[2];
    }
  }
  
  // Handle various Vimeo URL formats
  // Standard URL: https://vimeo.com/123456789
  // Channel URL: https://vimeo.com/channels/staffpicks/123456789
  // Player URL: https://player.vimeo.com/video/123456789
  // Handles URLs with query parameters: https://vimeo.com/123456789?h=abc123def
  const patterns = [
    /vimeo\.com\/(\d+)(?:\?.*)?$/i,                     // Basic format
    /vimeo\.com\/channels\/[^\/]+\/(\d+)(?:\?.*)?$/i,   // Channel format
    /vimeo\.com\/groups\/[^\/]+\/videos\/(\d+)(?:\?.*)?$/i, // Group format
    /player\.vimeo\.com\/video\/(\d+)(?:\?.*)?$/i       // Player format
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Parse parameters from an embed code
export const parseEmbedParameters = (embedCode: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  if (embedCode && embedCode.includes('<iframe')) {
    const srcMatch = embedCode.match(/src=["']([^"']*)["']/i);
    if (srcMatch && srcMatch[1]) {
      try {
        const url = new URL(srcMatch[1]);
        url.searchParams.forEach((value, key) => {
          params[key] = value;
        });
      } catch (e) {
        console.error('Error parsing embed URL:', e);
      }
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
  if (!vimeoId) return '';
  
  const params = new URLSearchParams();
  
  // Add parameters based on options
  if (options.autoplay) params.append('autoplay', '1');
  if (options.loop) params.append('loop', '1');
  if (options.muted) params.append('muted', '1');
  if (options.background) params.append('background', '1');
  if (options.color !== undefined) params.append('color', options.color.replace('#', ''));
  if (options.portrait === false) params.append('portrait', '0');
  if (options.title === false) params.append('title', '0');
  if (options.byline === false) params.append('byline', '0');
  if (options.dnt) params.append('dnt', '1');
  
  // Quality settings for better performance
  params.append('quality', 'auto');
  
  // App ID for tracking
  params.append('app_id', 'custom_website');
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return `https://player.vimeo.com/video/${vimeoId}${queryString}`;
};

// Get high-quality thumbnail from Vimeo ID
export const getVimeoThumbnail = async (vimeoId: string): Promise<string | null> => {
  if (!vimeoId) return null;
  
  try {
    const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
    if (!response.ok) throw new Error('Failed to fetch thumbnail');
    
    const data = await response.json();
    
    // Try to get higher resolution thumbnail
    // Vimeo thumbnails often follow this pattern where _640 can be replaced with higher values
    if (data.thumbnail_url) {
      return data.thumbnail_url.replace('_640', '_1280');
    }
    
    return data.thumbnail_url || null;
  } catch (error) {
    console.error('Error fetching Vimeo thumbnail:', error);
    return null;
  }
};