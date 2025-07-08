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
            
            /* Safari-specific optimizations */
            @supports (-webkit-backdrop-filter: blur(1px)) {
              .glass-effect-layer {
                -webkit-backdrop-filter: blur(0px);
                backdrop-filter: blur(0px);
              }
            }
            
            /* Force hardware acceleration for Safari */
            .glass-effect-layer {
              -webkit-transform: translate3d(0, 0, 0);
              transform: translate3d(0, 0, 0);
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              -webkit-perspective: 1000;
              perspective: 1000;
            }
          `
        }} />
      </head>
      <body className="min-h-screen">
        {/* SVG Filter Definition - Safari Compatible */}
        <svg 
          width="0" 
          height="0" 
          style={{ 
            position: 'absolute', 
            pointerEvents: 'none',
            visibility: 'hidden' 
          }} 
          aria-hidden="true"
        >
          <defs>
            <filter id="glass-distortion" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
              <feTurbulence
                baseFrequency="0.01 0.01"
                numOctaves="2"
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
                result="displaced"
              />
            </filter>
            <filter id="glass-distortion-subtle" x="-100%" y="-100%" width="300%" height="300%" filterUnits="objectBoundingBox">
              <feTurbulence
                baseFrequency="0.005 0.005"
                numOctaves="3"
                result="turbulence"
                type="turbulence"
                seed="10"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="15"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feOffset
                in="displaced"
                dx="0"
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
          willChange: 'transform', // Hint to browser for optimization
        }}>
          {/* Glass Effect Layer */}
          <div 
            className="glass-effect-layer"
            style={{
              position: 'absolute',
              zIndex: 0,
              inset: 0,
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)',
              filter: 'url(#glass-distortion-subtle) blur(15px)',
              WebkitFilter: 'url(#glass-distortion-subtle) blur(15px)',
              overflow: 'hidden',
              isolation: 'isolate',
              transform: 'translateZ(0)', // Force hardware acceleration
              WebkitTransform: 'translateZ(0)',
              // Additional Safari-specific properties
              WebkitTransformStyle: 'preserve-3d',
              transformStyle: 'preserve-3d',
              contain: 'layout style paint',
            }} 
          />
          
          {/* Tint Layer */}
          <div style={{
            zIndex: 1,
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            // Force hardware acceleration for this layer too
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
          }} />
          
          {/* Shine Layer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            overflow: 'hidden',
            // Force hardware acceleration
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
          }} />
        </div>

        <FloatingButtons />
        {children}
      </body>
    </html>
  );
}