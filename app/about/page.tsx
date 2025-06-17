'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringTypetax, setIsHoveringTypetax] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInScrollSection, setIsInScrollSection] = useState(false);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Calculate which card should be visible based on scroll position
      if (cardsContainerRef.current) {
        const container = cardsContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress through the cards section
        const sectionTop = containerRect.top + window.scrollY - windowHeight;
        const sectionHeight = container.offsetHeight + windowHeight;
        const rawScrollProgress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / sectionHeight));
        
        // Check if we're in the scrolling section (show bar from 27% to 78% of scroll)
        const inScrollSection = rawScrollProgress >= 0.27 && rawScrollProgress <= 0.78;
        setIsInScrollSection(inScrollSection);
        
        // Map the progress to 0-100% within the visible range
        const mappedProgress = Math.max(0, Math.min(1, (rawScrollProgress - 0.27) / (0.78 - 0.27)));
        setScrollProgress(mappedProgress);
        
        // Enhanced timing: give first and last cards more dwell time
        let cardIndex;
        if (rawScrollProgress <= 0.4) {
          // First 40% of scroll = first card
          cardIndex = 0;
        } else if (rawScrollProgress <= 0.6) {
          // Next 20% of scroll = second card
          cardIndex = 1;
        } else {
          // Final 40% of scroll = third card
          cardIndex = 2;
        }
        
        setCurrentCardIndex(cardIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cardData = [
    {
      title: "What's the deal with shapes anyway?",
      content: "The biggest challenge in design is modularity. A logo might look perfect in its primary spot, but put it on print or change the color, and suddenly it looks amateur. That's where our obsession with form starts shining the most.",
      translateX: { mobile: 0, desktop: -20 },
      translateY: { mobile: 0, desktop: 30 },
      rotation: -2,
      image: "https://i.imgur.com/9TXGHIk.png"
    },
    {
      title: "Science is awesome!",
      content: "Science isn't just awesome; it's fundamental to everything we do. We skip the guesswork and dive deep into research, analyzing existing data and mapping evidence-based insights to ensure every decision is grounded in solid scientific principles rather than fleeting trends or hunches.",
      translateX: { mobile: 0, desktop: 10 },
      translateY: { mobile: 0, desktop: 60 },
      rotation: 2,
      image: "https://i.imgur.com/ITj3Osr.jpeg"
    },
    {
      title: "Team & Values",
      content: "Our team is always evolving, our network is always growing. Here's what stays the same:",
      values: [
        "The goal of form is to improve function, always.",
        "We never guess; we research, prove and only then deliver.",
        "A seriously refreshing level of transparency and clarity."
      ],
      translateX: { mobile: 0, desktop: -20 },
      translateY: { mobile: 0, desktop: 90 },
      rotation: -4,
      image: "https://i.imgur.com/zh1YNti.png"
    }
  ];

  // Calculate dynamic transforms for the current card
  const getDynamicTransform = () => {
    const currentCard = cardData[currentCardIndex];
    const baseTranslateX = isMobile ? currentCard.translateX.mobile : currentCard.translateX.desktop;
    const baseTranslateY = isMobile ? currentCard.translateY.mobile : currentCard.translateY.desktop;
    
    // Add scroll-based movement - vertical only with rotation
    const scrollTranslateY = -scrollProgress * 40; // Move up as you scroll (negative for upward movement)
    const scrollRotation = scrollProgress * 8; // Gradual rotation as you scroll
    
    return {
      transform: `translate(${baseTranslateX}px, ${baseTranslateY + scrollTranslateY * 2}px) rotate(${currentCard.rotation + scrollRotation / 2}deg)`,
      transformOrigin: 'center center'
    };
  };

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
                  <img
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
        ref={cardsContainerRef}
        className="bg-cover bg-center bg-no-repeat py-8 md:py-12 relative -mt-4 md:-mt-8"
        style={{ minHeight: '300vh' }} // Make it tall enough to scroll through all cards
      >
        {/* Background image with opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{
            backgroundImage: 'url(LINK GOES HERE)'
          }}
        ></div>
        
        {/* Sticky card container */}
        <div className="sticky top-20 max-w-8xl mx-auto relative z-10 px-4 md:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            {/* Single card that changes content */}
            <div 
              className="relative max-w-md md:max-w-3xl transition-all duration-700 ease-out"
              style={getDynamicTransform()}
            >
              <div className="w-full bg-white relative overflow-hidden shadow-lg flex flex-col md:flex-row">
                {/* Square image section */}
                <div className="aspect-square md:w-80 md:flex-shrink-0 overflow-hidden">
                  <img 
                    key={currentCardIndex} // Force re-render for smooth transitions
                    src={cardData[currentCardIndex].image}
                    alt="Design showcase"
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                  />
                </div>

                {/* Content section */}
                <div className="p-5 md:p-8 flex-1">
                  <h3 className="text-xl md:text-3xl font-semibold mb-4 text-gray-900 transition-all duration-500 ease-in-out">
                    {cardData[currentCardIndex].title}
                  </h3>
                  
                  <div className="text-gray-700 text-sm md:text-lg leading-relaxed transition-all duration-500 ease-in-out">
                    <p className="mb-6">
                      {cardData[currentCardIndex].content}
                    </p>
                    
                    {cardData[currentCardIndex].values && (
                      <ul className="list-disc pl-4 space-y-2 text-sm md:text-base">
                        {cardData[currentCardIndex].values.map((value, valueIndex) => (
                          <li key={valueIndex} className="transition-all duration-500 ease-in-out">
                            {value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll progress indicator - centered progress bar */}
        {isInScrollSection && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
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