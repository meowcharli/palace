// File: utils/types.ts

// Types for Vimeo embedding
export interface VimeoEmbedProps {
  url?: string;
  embedCode?: string;
  hideControls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  caption?: string;
  showThumbnail?: boolean;
  isClickable?: boolean;
  hideCaption?: boolean;
  customHeight?: number;
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

// Gallery Item type
export interface GalleryItem {
  _id: string;
  title: string;
  image?: any;
  videoEmbed?: VimeoEmbedProps;
  articleSlug: string;
  articleTitle: string;
  order: number;
  featured: boolean;
}