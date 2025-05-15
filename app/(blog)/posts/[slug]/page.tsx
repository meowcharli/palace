import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "@/app/(blog)/avatar";
import CoverImage from "@/app/(blog)/cover-image";
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
    <div className="max-w-5xl mx-auto my-8">
      <article className="space-y-12">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tighter text-gray-800 md:text-3xl md:leading-none lg:text-3xl px-8 md:px-16">
          {post.title}
        </h1>
        <div className="hidden md:block px-8 md:px-16">
          {post.author && (
            <Avatar name={post.author.name} picture={post.author.picture} />
          )}
        </div>
        <div>
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
        <div className="px-8 md:px-16">
          <div className="block md:hidden mb-8">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
        </div>
        {post.content?.length && (
          <div className="px-8 md:px-16">
            <PortableText
              className="text-white"
              value={post.content as PortableTextBlock[]}
            />
          </div>
        )}
      </article>
      <div className="flex justify-center mt-32 mb-16 px-8 md:px-16">
        <Link href="/gallery" className="bg-black-500 px-8 py-4 font-semibold text-gray-700 hover:bg-black-600 transition-colors text-lg">
          (Click to return to the gallery!)
        </Link>
      </div>
    </div>
  );
}