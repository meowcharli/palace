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
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative">
          <div className="w-full aspect-video overflow-hidden lg:px-[40px]">
            <CoverImage image={post.coverImage} priority />
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-2 pb-0 text-center sm:pt-6">
        <Link
          href="/gallery"
          className="text-[#050507] hover:text-[#050507]/80 text-lg font-medium transition-colors duration-200"
        >
          ← Back to Gallery
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#f5f5f7]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 py-0 bg-[#f5f5f7]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-0 bg-[#f5f5f7] pt-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-[#050507]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-[#050507] max-w-4xl font-medium mx-auto leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.author && (
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      name={post.author.name}
                      picture={post.author.picture}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#050507]">{post.author.name}</p>
                    <p className="text-sm text-[#050507]">Author</p>
                  </div>
                </div>

                <div className="w-px h-8 bg-[#050507]" />

                <div className="text-left">
                  <p className="font-semibold text-[#050507]">5 min read</p>
                  <p className="text-sm text-[#050507]">Estimated</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 py-12 bg-[#f5f5f7]">
        {post.content?.length && (
          <div className="prose prose-lg prose-slate max-w-none">
            <div className="bg-white border-2 border-black p-4 sm:p-6 lg:p-8">
              <PortableText
                className="leading-relaxed text-[#050507]"
                value={post.content as PortableTextBlock[]}
              />
            </div>
          </div>
        )}
      </article>

      {/* Author Bio Section */}
      {post.author && (
        <section className="bg-[#f5f5f7] py-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="bg-white border-2 border-black p-6 lg:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 overflow-hidden">
                    <Avatar
                      name={post.author.name}
                      picture={post.author.picture}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-[#050507] mb-2">
                    Written by {post.author.name}
                  </h3>
                  <p className="text-[#050507] leading-relaxed">
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