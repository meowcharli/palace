'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      if (isMobile) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -0.5; // Reduced to half potency (-1 to -0.5)
    const rotateY = (x - centerX) / centerX * 0.5; // Reduced to half potency (1 to 0.5)
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.00125)`; // Reduced scale to half potency (1.0025 to 1.00125)
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    const card = cardRef.current;
    if (!card) return;
    
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div className="min-h-screen">
      {/* Top section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-8">
          {/* Page header */}
          <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0 font-semibold">
            <p className="text-3xl max-w-2xl mx-auto text-black">
              We&apos;re Typetax.
            </p>
          </div>

          {/* Page header desc */}
          <div className="mb-12 md:mb-20 gap-2 text-left max-w-8xl px-4 sm:px-0">
            <p className="text-xl max-w-2xl mx-auto text-black">
              We&apos;re dedicated to experimentation and innovation in all things shapes, glyphs, geometry and graphics. In other words; we just really really like shapes.
            </p>
          </div>
        </div>
      </div>

      {/* Main content section with background image */}
      <div 
        className="bg-cover bg-center bg-no-repeat py-12 md:py-20 relative"
      >
        {/* Background image with 50% opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://i.imgur.com/S7a69iW.png)'
          }}
        ></div>

        {/* About content card */}
        <div className="max-w-3xl mx-auto relative z-10 px-4 md:px-0">
          <div 
            className="group relative cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <div 
              ref={cardRef}
              className="w-full bg-white transition-all duration-300 ease-out relative overflow-hidden shadow-lg p-6 md:p-12"
              style={{
                transformStyle: 'preserve-3d'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                What&apos;s the deal with shapes anyway?
              </h3>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  The biggest challenge in design is modularity. A logo might look perfect in its primary spot, but put it on print or change the color, and suddenly it looks amateur. That&apos;s where our obsession with form starts shining the most.
                </p>
                
                <p>
                  Our team is always evolving. Nothing stays the same for long. What we do best is build teams of artists and experts who aren&apos;t just skilled, but genuinely excited about the work. These people then connect us with more amazing talent like themselves.
                </p>
                
                <p>
                  We stand behind our work with pride, and we know our results inspire more than just our own creative drive.
                </p>

                <h4 className="text-xl font-medium mt-8 mb-4 text-gray-900">
                  Our Values
                </h4>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>Design that works no matter what.</li>
                  <li>Analytical and scientific approach to everything.</li>
                  <li>More is less, no need to overcomplicate anything.</li>
                  <li>Things being accessible and human-centered.</li>
                </ul>
              </div>

              {/* Card footer */}
              <div className="mt-8 pt-4 border-t border-gray-300">
                <div className="text-sm text-gray-600 font-mono">
                  c@type.tax | www.type.tax
                </div>
              </div>

              {/* 3D depth effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-8">
          {/* Back button */}
          <div className="text-center">
            <Link href="/" className="text-black hover:text-blue-800 inline-flex items-center font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}