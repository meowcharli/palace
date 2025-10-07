import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { toPlainText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, getTitleForDomain } from "@/sanity/lib/utils";
import * as demo from "@/sanity/lib/demo";

import BlogFooter from "@/components/BlogFooter";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({ query: settingsQuery });
  
  // Get domain from environment if available, else use default
  const domain = process.env.VERCEL_URL || 
                process.env.NEXT_PUBLIC_VERCEL_URL || 
                'palace.ad';
  
  const title = getTitleForDomain(settings, domain);
  
  return {
    title: `Showcase | ${title}`,
    description: "Browse our showcase of featured content",
  };
}

export default async function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const description = data?.description || demo.description;
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <main className="flex-grow mt-12">
        {children}
      </main>
      <BlogFooter footer={footer} description={description} />
      {isDraftMode && <VisualEditing />}
      <SpeedInsights />
    </>
  );
}