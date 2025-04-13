import React from 'react';
import VimeoEmbed from './VimeoEmbed';

interface PostFeaturedVideoProps {
  videoUrl: string;
  title?: string;
}

const PostFeaturedVideo: React.FC<PostFeaturedVideoProps> = ({ videoUrl, title }) => {
  if (!videoUrl) return null;
  
  return (
    <div className="post-featured-video">
      <VimeoEmbed 
        url={videoUrl}
        caption={title}
        showThumbnail={true}
        className="mb-8" aspectRatio={''}      />
    </div>
  );
};

export default PostFeaturedVideo;
