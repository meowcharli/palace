// app/(blog)/layout.tsx
import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing, toPlainText } from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery, moreStoriesQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import * as demo from "@/sanity/lib/demo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Fetch recent posts for the header
async function getRecentPosts() {
  try {
    return await sanityFetch({ 
      query: moreStoriesQuery, 
      params: { skip: '', limit: 2 } 
    });
  } catch (error) {
    console.error("Error loading recent posts:", error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const description = data?.description || demo.description;
  const { isEnabled: isDraftMode } = await draftMode();
  const recentPosts = await getRecentPosts();

  return (
    <html lang="en" className={`${inter.variable} bg-black text-white`}>
      <body className="flex flex-col min-h-screen bg-black">
        {isDraftMode && <AlertBanner />}
        
        {/* Header with recent posts */}
        <BlogHeader recentPosts={recentPosts} />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <BlogFooter footer={footer} description={description} />
        {isDraftMode && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
