// app/(blog)/page.tsx - Updated for mobile optimization
import Link from 'next/link';
import { Suspense } from 'react';

import Avatar from './avatar';
import CoverImage from './cover-image';
import Onboarding from './onboarding';
import PortableText from './portable-text';

import type { HeroQueryResult } from '@/sanity.types';
import * as demo from '@/sanity/lib/demo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { heroQuery, settingsQuery, moreStoriesQuery } from '@/sanity/lib/queries';

// Modified ArticlePost component with mobile-friendly classes
function ArticlePost({
  title,
  slug,
  excerpt,
  coverImage,
  videoEmbed,
  author,
  isHero = false,
}: {
  title: string;
  slug: string | null;
  excerpt?: string | null;
  coverImage: any;
  videoEmbed?: any;
  author?: any;
  isHero?: boolean;
}) {
  if (!slug) return null; // Skip rendering posts without a slug
  
  return (
    <article className={`mb-16 md:mb-24 ${isHero ? 'hero-post' : ''}`}>
      <Link 
        className="group mb-4 block md:mb-8" // Reduced margin by 50%
        href={`/posts/${slug}`}
      >
        <CoverImage 
          image={coverImage} 
          videoEmbed={videoEmbed || undefined} 
          priority={isHero} 
        />
      </Link>
      <div className="mb-16 md:mb-20 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-2xl leading-tight lg:text-3xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
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
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </article>
  );
}

// Footer Article List component with mobile-friendly classes
function FooterArticleList({ posts }: { posts: Array<{
  _id: string;
  title: string; 
  slug: string | null;
  excerpt?: string | null;
  author?: any;
}> }) {
  if (!posts || posts.length === 0) return null;
  
  return (
    <div className="footer-article-list mt-20 mb-12 border-t pt-10">
      <h2 className="mb-8 text-3xl font-semibold">All our stuff</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              {post.slug ? (
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              ) : (
                <span>{post.title}</span>
              )}
            </h3>
            {post.excerpt && (
              <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Wrap client components in Suspense with mobile-friendly classes
function PageContent({ posts, settings }: { 
  posts: Array<{
    _id: string;
    title: string;
    slug: string | null;
    excerpt?: string | null;
    coverImage: any;
    videoEmbed?: any;
    author?: any;
    date?: string;
  }>;
  settings: any;
}) {
  // If no posts, show onboarding
  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto">
        <Suspense fallback={<div className="py-60 text-center">Loading...</div>}>
          <Onboarding />
        </Suspense>
      </div>
    );
  }

  // Get the first post as hero and the rest for the main content
  const heroPost = posts[0];
  const mainPosts = posts.slice(1);
  
  return (
    <div className="container mx-auto">
      {/* Hero Post */}
      {heroPost && (
        <ArticlePost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          videoEmbed={heroPost.videoEmbed}
          excerpt={heroPost.excerpt}
          author={heroPost.author}
          isHero={true}
        />
      )}

      {/* Other Posts in the same format */}
      {mainPosts.length > 0 && (
        <div className="main-posts">
          {mainPosts.map((post) => (
            <ArticlePost
              key={post._id}
              title={post.title}
              slug={post.slug}
              coverImage={post.coverImage}
              videoEmbed={post.videoEmbed}
              excerpt={post.excerpt}
              author={post.author}
            />
          ))}
        </div>
      )}

      {/* Footer Article List */}
      <FooterArticleList posts={posts} />
    </div>
  );
}

export default async function Page() {
  // Modified to fetch all posts instead of just the hero post
  const [settings, allPosts] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({ 
      query: moreStoriesQuery, 
      params: { skip: '', limit: 100 } // Fetch more posts, adjust limit as needed
    }),
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading page...</div>}>
      <PageContent posts={allPosts} settings={settings} />
    </Suspense>
  );
}
