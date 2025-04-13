// File: app/(blog)/posts/[slug]/page.tsx
import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "@/app/(blog)/avatar";
import CoverImage from "@/app/(blog)/cover-image";
import MoreStories from "@/app/(blog)/more-stories";
import PortableText from "@/app/(blog)/portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const [post, settings] = await Promise.all([
    sanityFetch({ query: postQuery, params }),
    sanityFetch({ query: settingsQuery }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      {/* Removed the back home link since we have the floating button */}
      <article>
        {/* Made the title smaller (text-4xl instead of text-6xl) */}
        <h1 className="text-balance mb-8 mt-8 text-4xl font-boldd leading-tight tracking-tighter text-white md:text-5xl md:leading-none lg:text-5xl">
          {post.title}
        </h1>
        <div className="hidden md:mb-12 md:block">
          {post.author && (
            <Avatar name={post.author.name} picture={post.author.picture} />
          )}
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage
            image={post.coverImage}
            videoEmbed={
              post.videoEmbed
                ? { aspectRatio: "16:9", ...post.videoEmbed }
                : undefined
            }
            priority
          />
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 block md:hidden">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
        </div>
        {post.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl text-white"
            value={post.content as PortableTextBlock[]}
          />
        )}
      </article>
      <aside>
        <hr className="border-gray-800 mb-24 mt-28" />
        {/* Changed heading to "All Posts" and made it smaller */}
        <h2 className="mb-8 text-3xl font-bold leading-tight tracking-tighter text-white md:text-4xl">
          all posts ▾
        </h2>
        <Suspense>
          {/* Removing the parameters since MoreStories now shows all posts */}
          <MoreStories />
        </Suspense>
      </aside>
    </div>
  );
}
