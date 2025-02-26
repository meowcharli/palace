// app/(blog)/layout.tsx
import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";
import Header from "@/components/Header"; 

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body className="flex flex-col min-h-screen">
        {isDraftMode && <AlertBanner />}
        {/* Place the header outside any container to allow full width */}
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-[#26323D] border-accent-2 border-t">
          <div className="container mx-auto px-5">
            {footer.length > 0 ? (
              <PortableText
                className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
                value={footer as PortableTextBlock[]}
              />
            ) : (
              <div className="flex flex-col items-center py-12 lg:flex-row">
                <h3 className="mb-6 text-[#ddcdbf] text-center text-1xl leading-tight tracking-tighter py-3 px-12 lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-1xl">
                  Designed with ♥️ in Serbia.
                </h3>
                <div className="flex flex-col items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
                  <a
                    href="https://bsky.app/profile/4sigs.com"
                    className="mx-3 mb-6 border border-[#183f63] bg-[#183f63] py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-transparent hover:text-[#183f63] lg:mb-0 lg:px-8"
                  >
                    View our BlueSky 🦋
                  </a>
                  <a
                    href="mailto:hello@4sigs.com?subject=*Loud%20honk*%20This%20is%20me--%20contacting%20you!"
                    className="mx-3 mb-6 border border-[#89131f] bg-[#89131f] py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-transparent hover:text-[#89131f] lg:mb-0 lg:px-8"
                  >
                    Email us! 📧
                  </a>
                </div>
              </div>
            )}
          </div>
        </footer>
        {isDraftMode && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
