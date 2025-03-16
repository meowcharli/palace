// utils/types.ts

// Types for Vimeo embedding
export interface VimeoEmbedProps {
  url?: string;
  embedCode?: string;
  hideControls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  caption?: string;
  showThumbnail?: boolean;
  isClickable?: boolean; // Added this new property
}

// Post type definitions 
export interface Post {
  _id: string;
  status?: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
  videoEmbed?: VimeoEmbedProps | string;
  date?: string;
  author?: Author;
  content?: any;
}

export interface Author {
  name: string;
  picture?: {
    asset?: {
      _ref: string;
    };
    alt?: string;
    _type?: string;
  } | null;
}

// Settings type
export interface Settings {
  title?: string;
  description?: any[];
  footer?: any[];
  ogImage?: any;
}
