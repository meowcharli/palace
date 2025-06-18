import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { toPlainText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import * as demo from "@/sanity/lib/demo";

import BlogFooter from "@/components/BlogFooter";

export const metadata: Metadata = {
  title: "Showcase | type.tax",
  description: "Browse our showcase of featured content",
};

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
      <main className="flex-grow mt-16">
        {children}
      </main>
      <BlogFooter footer={footer} description={description} />
      {isDraftMode && <VisualEditing />}
      <SpeedInsights />
    </>
  );
}