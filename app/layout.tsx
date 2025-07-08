import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import FloatingButtons from '@/components/FloatingButtons';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "type.tax",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            .glass-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              height: 55px;
              z-index: 999997;
              background-color: rgb(255, 255, 255, 0.8);
              -webkit-backdrop-filter: blur(18px);
              backdrop-filter: blur(18px);
            }
            
            /* Content spacing to account for fixed header */
          `
        }} />
      </head>
      <body className="min-h-screen">
        {/* Simplified Glass Header */}
        <div className="glass-header">
          {/* Optional: Add your header content here */}
        </div>

        <FloatingButtons />
        {children}
      </body>
    </html>
  );
}