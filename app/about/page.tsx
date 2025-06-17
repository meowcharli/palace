'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringTypetax, setIsHoveringTypetax] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const cardData = [
    {
      title: "What&apos;s the deal with shapes anyway?",
      content: "The biggest challenge in design is modularity. A logo might look perfect in its primary spot, but put it on print or change the color, and suddenly it looks amateur. That&apos;s where our obsession with form starts shining the most.",
      position: "md:translate-x-[-40px] md:translate-y-[20px]",
      rotation: "rotate-[-2deg] md:rotate-[-2deg]",
      image: "https://i.imgur.com/9TXGHIk.png"
    },
    {
      title: "Science is awesome!",
      content: "Science isn&apos;t just awesome; it&apos;s fundamental to everything we do. We skip the guesswork and dive deep into research, analyzing existing data and mapping evidence-based insights to ensure every decision is grounded in solid scientific principles rather than fleeting trends or hunches.",
      position: "md:translate-x-[20px] md:translate-y-[-30px]",
      rotation: "rotate-[2deg] md:rotate-[2deg]",
      image: "https://i.imgur.com/ITj3Osr.jpeg"
    },
    {
      title: "Team & Values",
      content: "Our team is always evolving, our network is always growing. Here&apos;s what stays the same:",
      values: [
        "The goal of form is to improve function, always.",
        "We never guess; we research, prove and only then deliver.",
        "A seriously refreshing level of transparency and clarity."
      ],
      position: "md:translate-x-[-10px] md:translate-y-[-90px]",
      rotation: "rotate-[-2deg] md:rotate-[-2deg]",
      image: "https://i.imgur.com/zh1YNti.png"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Top section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-3">
          {/* Page header */}
          <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0 font-semibold">
            <div className="text-3xl max-w-2xl mx-auto text-black">
              We&apos;re{' '}
              <span 
                className="relative inline-block cursor-pointer transition-all duration-300 ease-in-out"
                onMouseEnter={() => setIsHoveringTypetax(true)}
                onMouseLeave={() => setIsHoveringTypetax(false)}
              >
                <span 
                  className={`transition-opacity duration-200 ${
                    isHoveringTypetax ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Typetax
                </span>
                <span 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                    isHoveringTypetax ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src="/images/logo-default.svg"
                    alt="Typetax Logo"
                    width={120}
                    height={40}
                    className="h-auto w-auto max-h-[1.2em]"
                  />
                </span>
              </span>
              .
            </div>
          </div>

          {/* Page header desc */}
          <div className="mb-4 md:mb-6 gap-2 text-left max-w-8xl px-4 sm:px-0">
            <div className="text-xl max-w-2xl mx-auto text-black">
              We&apos;re dedicated to experimentation and innovation in all things type-design, glyphs, geometry and graphics. In other words; we just really really like shapes.
            </div>
          </div>
        </div>
      </div>

      {/* Main content section with background image */}
      <div 
        className="bg-cover bg-center bg-no-repeat py-8 md:py-12 relative min-h-[800px] -mt-4 md:-mt-8"
      >
        {/* Background image with opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{
            backgroundImage: 'url(LINK GOES HERE)'
          }}
        ></div>
        {/* Scattered cards container */}
        <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8">
          <div className="space-y-8 md:space-y-16">
            {cardData.map((card, index) => (
              <div 
                key={index}
                className={`relative transform max-w-md md:max-w-3xl mx-auto ${card.position} ${card.rotation}`}
                style={{
                  transformOrigin: 'center center'
                }}
              >
                <div 
                  ref={el => { cardRefs.current[index] = el; }}
                  className="w-full bg-white relative overflow-hidden shadow-lg flex flex-col md:flex-row"
                >
                  {/* Square image section */}
                  <div className="aspect-square md:w-80 md:flex-shrink-0 overflow-hidden">
                    <Image 
                      src={card.image}
                      alt="Design showcase"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content section */}
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">
                      {card.title}
                    </h3>
                    
                    <div className="text-gray-700 text-base md:text-lg leading-relaxed">
                      <p className="mb-6">
                        {card.content}
                      </p>
                      
                      {card.values && (
                        <ul className="list-disc pl-4 space-y-2 text-sm md:text-base">
                          {card.values.map((value, valueIndex) => (
                            <li key={valueIndex}>{value}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-8">
          {/* Navigation buttons */}
          <div className="text-center space-y-4">
            {/* Gallery button */}
            <div>
              <Link href="/" className="text-black inline-flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
<path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}