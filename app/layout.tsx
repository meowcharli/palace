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
            .liquidGlass-wrapper {
              font-weight: 600;
              overflow: hidden;
              color: black;
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
            }
          `
        }} />
      </head>
      <body className="min-h-screen">
        {/* SVG Filter Definition */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="glass-distortion" x="0%" y="-50%" width="200%" height="200%">
              <feTurbulence
                baseFrequency="0.01 0.01"
                numOctaves={2}
                result="turbulence"
                type="turbulence"
                seed="2"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="300"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter id="glass-distortion-subtle" x="-100%" y="-100%" width="300%" height="300%">
              <feTurbulence
                baseFrequency="0.00 0.0"
                numOctaves={20}
                result="turbulence"
                type="turbulence"
                seed="10"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="300"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feOffset
                in="displaced"
                dx="-150"
                dy="0"
                result="centered"
              />
            </filter>
          </defs>
        </svg>

        {/* Liquid Glass Header */}
        <div className="liquidGlass-wrapper" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '55px',
          zIndex: 999997,
          borderRadius: 0,
        }}>
          {/* Glass Effect Layer */}
          <div style={{
            position: 'absolute',
            zIndex: 0,
            inset: 0,
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
            filter: 'url(#glass-distortion-subtle) blur(15px)',
            overflow: 'hidden',
            isolation: 'isolate',
          }} />
          
          {/* Tint Layer */}
          <div style={{
            zIndex: 1,
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.8)',
          }} />
          
          {/* Shine Layer - removed box-shadow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            overflow: 'hidden',
          }} />
        </div>

        <FloatingButtons />
        {children}
      </body>
    </html>
  );
}