function GalleryItemComponent({ item }: { item: GalleryItem }) {
  return (
    <Link 
      href={`/posts/${item.articleSlug}`} 
      className="gallery-item block transform transition-transform duration-300 hover:-translate-y-0.5 mb-2 w-full"
    >
      {item.videoEmbed?.url ? (
        // Video content - With explicit isClickable flag for overlay
        <div className="gallery-video-container w-full">
          <VimeoEmbed 
            url={item.videoEmbed.url} 
            embedCode={item.videoEmbed.embedCode}
            hideControls={true}
            autoplay={true}
            loop={true}
            showThumbnail={false}
            isClickable={true} // This enables the invisible overlay
            hideCaption={true}
          />
        </div>
      ) : item.image?.asset?._ref ? (
        // Image content
        <div className="gallery-image-container w-full">
          <Image
            src={urlForImage(item.image)?.url() || ''}
            alt={item.image.alt || item.title || 'Gallery image'}
            width={2000}
            height={0}
            quality={100}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="w-full h-auto rounded-lg shadow-lg"
            style={{ aspectRatio: 'auto' }}
            priority={true}
          />
        </div>
      ) : (
        // Fallback for items without image or video
        <div className="gallery-placeholder w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Image</span>
        </div>
      )}
    </Link>
  );
}
