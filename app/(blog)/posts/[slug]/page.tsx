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
    <div className="bg-black min-h-screen" style={{ paddingTop: '50px' }}>
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="max-w-6xl mx-auto">
        <Link
          href="/work"
          className="text-white hover:text-white/80 text-lg font-medium transition-colors duration-200"
        >
          ← Back to Work
        </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black">
        {/* Hero Content */}
        <div className="relative z-10 bg-black">
          <div className="max-w-7xl mx-auto px-6 text-left bg-black pt-6 pb-8">
            <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-white/80 mb-6 max-w-4xl leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.author && (
              <div className="flex items-center justify-start gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative p-2">
                    <Avatar
                      name={post.author.name}
                      picture={post.author.picture}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">{post.author.name}</p>
                    <p className="text-sm text-white/80">Author</p>
                  </div>
                </div>

                <div className="w-px h-8 bg-white" />

                <div className="text-left">
                  <p className="font-semibold text-white">5 min read</p>
                  <p className="text-sm text-white/80">Estimated</p>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
{/* Main Content */}
<article className="max-w-7xl mx-auto px-0 sm:px-6 pb-8 bg-black">
  {post.content?.length && (
    <div className="prose prose-lg prose-slate max-w-none">
      <div className="bg-black border-2 border-black sm:mx-6">
        <PortableText
          className="leading-relaxed text-white"
          value={post.content as PortableTextBlock[]}
        />
      </div>
    </div>
  )}
</article>

      {/* Author Bio Section */}
      {post.author && (
        <section className="bg-black pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-black border-2 border-black p-6 lg:p-8 max-w-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-shrink-0 p-3">
                  <div className="w-20 h-20 overflow-hidden">
                    <Avatar
                      name={post.author.name}
                      picture={post.author.picture}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Written by {post.author.name}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Professional at being cool.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}