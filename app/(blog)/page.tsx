// app/(blog)/page.tsx
import Link from "next/link";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  videoEmbed,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "videoEmbed" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} videoEmbed={videoEmbed || undefined} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          {/* Reduced title size by changing from text-4xl/text-6xl to text-2xl/text-3xl */}
          <h3 className="text-pretty mb-4 text-2xl leading-tight lg:text-3xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          {/* Date component removed */}
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

// Wrap client components in Suspense
function PageContent({ heroPost, settings }: { heroPost: any, settings: any }) {
  return (
    <div className="container mx-auto px-5">
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          videoEmbed={heroPost.videoEmbed}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <Suspense fallback={<div className="py-60 text-center">Loading...</div>}>
          <Onboarding />
        </Suspense>
      )}
      {heroPost?._id && (
        <aside>
          <h2 className="mb-8 text-6xl font-semibold leading-tight tracking-tighter md:text-4xl">
            More of our stuff ↴
          </h2>
          <Suspense fallback={<div className="py-20 text-center">Loading more stories...</div>}>
            <MoreStories skip={heroPost._id} limit={100} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({ query: heroQuery }),
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-5 py-20 text-center">Loading page...</div>}>
      <PageContent heroPost={heroPost} settings={settings} />
    </Suspense>
  );
}
