import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import ClientLayout from './client-layout';
import { headers } from 'next/headers';
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { getTitleForDomain } from "@/sanity/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({ params, searchParams }: {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const settings = await sanityFetch({ query: settingsQuery });
  
  // Get domain from environment variables
  const hostname = process.env.VERCEL_URL || 
                  process.env.NEXT_PUBLIC_VERCEL_URL || 
                  'palace.ad';
  
  const title = getTitleForDomain(settings, hostname);
  
  return {
    title: title,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  );
}