import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../globals.css';
import FloatingButtons from '../../components/FloatingButtons';
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { getTitleForDomain } from "@/sanity/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({ query: settingsQuery });
  
  // Get domain from environment if available, else use default
  const domain = process.env.VERCEL_URL || 
                process.env.NEXT_PUBLIC_VERCEL_URL || 
                'palace.ad';
  
  const title = getTitleForDomain(settings, domain);
  
  return {
    title: `${title} Studio`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Glass Header Styles - consider moving to globals.css for production */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .glass-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 55px;
            z-index: 999997;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(20px) saturate(1.8);
            -webkit-backdrop-filter: blur(20px) saturate(1.8);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: backdrop-filter;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .glass-header::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.15) 100%
            );
            pointer-events: none;
            mix-blend-mode: overlay;
          }
          .glass-header::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 50%,
              transparent 100%
            );
            animation: shimmer 3s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes shimmer {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
          }
          @supports (-webkit-touch-callout: none) {
            .glass-header {
              background: rgba(255, 255, 255, 0.50);
              backdrop-filter: blur(15px) saturate(1.5);
              -webkit-backdrop-filter: blur(15px) saturate(1.5);
            }
          }
          .glass-header + * {
            padding-top: 55px;
          }
        `
      }} />
      {/* Simplified Glass Header */}
      <div className="glass-header">
        {/* Optional: Add your header content here */}
      </div>
      <FloatingButtons />
      {children}
    </>
  );
}