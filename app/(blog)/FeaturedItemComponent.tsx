'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import VimeoEmbed from "@/components/VimeoEmbed";
import { urlForImage } from "@/sanity/lib/utils";
import type { GalleryItem } from "@/utils/types";

function FeaturedItemComponent({ item }: { item: GalleryItem }) {
  return (
    <Link
      href={`/posts/${item.articleSlug}`}
      className="featured-item block w-full relative group"
    >
      <div className="w-full aspect-video bg-black flex items-center justify-center overflow-hidden relative">
        {item.videoEmbed?.url ? (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-full h-full max-w-full max-h-full flex items-center justify-center overflow-hidden">
              <VimeoEmbed
                url={item.videoEmbed.url}
                embedCode={item.videoEmbed.embedCode}
                hideControls
                autoplay
                loop
                showThumbnail={true}
                isClickable
                hideCaption
                aspectRatio="1:1"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        ) : item.image?.asset?._ref ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={urlForImage(item.image)?.url() || ""}
              alt={item.image.alt || item.title || "Featured image"}
              fill
              sizes="100vw"
              quality={90}
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="featured-placeholder w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Featured Content</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default FeaturedItemComponent;