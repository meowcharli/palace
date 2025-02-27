import Link from 'next/link';
import CoverImage from '@/app/(blog)/cover-image';
import Avatar from '@/app/(blog)/avatar';
import type { Post } from '@/utils/types';

type HeroPostProps = {
  post: Post;
};

export default function HeroPost({ post }: HeroPostProps) {
  const { title, slug, excerpt, coverImage, videoEmbed, author } = post;
  
  // Convert author.picture to the format expected by Avatar component
  const authorPicture = author?.picture ? {
    ...author.picture,
    _type: "image"
  } : null;
  
  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug || ''}`}>
        <CoverImage 
          image={coverImage} 
          videoEmbed={videoEmbed || undefined} 
          priority 
        />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-2xl leading-tight lg:text-3xl">
            <Link href={`/posts/${slug || ''}`} className="hover:underline">
              {title}
            </Link>
          </h3>
        </div>
        <div>
          {excerpt && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          {author && <Avatar name={author.name} picture={authorPicture} />}
        </div>
      </div>
    </article>
  );
}
