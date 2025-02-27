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
}

// Post type definitions 
export interface Post {
  _id: string;
  status?: string;
  title: string;
  slug: string;
  excerpt?: string;
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
  } | null;
}

// Settings type
export interface Settings {
  title?: string;
  description?: any[];
  footer?: any[];
  ogImage?: any;
}
