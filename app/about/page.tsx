'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringTypetax, setIsHoveringTypetax] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInScrollSection, setIsInScrollSection] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update portal container visibility and progress bar
    if (portalContainer) {
      portalContainer.style.display = isInScrollSection ? 'flex' : 'none';
    }
  }, [isInScrollSection, portalContainer]);

  useEffect(() => {
    // Create a container that bypasses all CSS fuckery
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed !important;
      bottom: 2rem !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 999999 !important;
      background-color: rgba(255, 255, 255, 0.9) !important;
      color: black !important;
      border-radius: 9999px !important;
      padding: 1rem !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
      pointer-events: none !important;
      display: flex !important;
      align-items: center !important;
    `;
    document.body.appendChild(container);
    setPortalContainer(container);
    
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

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
        const containerTop = container.offsetTop;
        const containerHeight = container.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate when the container starts and ends being in view
        const scrollTop = window.scrollY;
        const containerStart = containerTop - viewportHeight;
        const containerEnd = containerTop + containerHeight;
        
        // Raw progress from 0 to 1 through the entire scrollable section
        const totalScrollableDistance = containerEnd - containerStart;
        const currentScrollDistance = scrollTop - containerStart;
        const rawScrollProgress = Math.max(0, Math.min(1, currentScrollDistance / totalScrollableDistance));
        
        // Show progress bar only between 20% and 80% of scroll through the section
        const showBarStart = 0.2;
        const showBarEnd = 0.8;
        const inScrollSection = rawScrollProgress >= showBarStart && rawScrollProgress <= showBarEnd;
        setIsInScrollSection(inScrollSection);
        
        // Map the progress to 0-100% within the visible range
        const mappedProgress = Math.max(0, Math.min(1, (rawScrollProgress - showBarStart) / (showBarEnd - showBarStart)));
        setScrollProgress(mappedProgress);
        
        // Enhanced timing: give first and last cards more dwell time
        let cardIndex;
        if (rawScrollProgress <= 0.35) {
          cardIndex = 0;
        } else if (rawScrollProgress <= 0.65) {
          cardIndex = 1;
        } else {
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
      {/* PORTAL PROGRESS BAR - RENDERS DIRECTLY TO BODY */}
      {portalContainer && createPortal(
        <div style={{ 
          width: '6rem', 
          height: '0.25rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '9999px', 
          overflow: 'hidden' 
        }}>
          <div 
            style={{ 
              height: '100%', 
              backgroundColor: '#000000', 
              borderRadius: '9999px', 
              transition: 'width 100ms ease-out',
              width: `${scrollProgress * 100}%`
            }}
          />
        </div>,
        portalContainer
      )}

      {/* Top section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-3">
          {/* Page header */}
          <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0 font-semibold">
            <div className="text-3xl max-w-2xl mx-auto text-black">
              We're{' '}
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
                  <div className="w-24 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                    LOGO
                  </div>
                </span>
              </span>
              .
            </div>
          </div>

          {/* Page header desc */}
          <div className="mb-4 md:mb-6 gap-2 text-left max-w-8xl px-4 sm:px-0">
            <div className="text-xl max-w-2xl mx-auto text-black">
              We're dedicated to experimentation and innovation in all things type-design, glyphs, geometry and graphics. In other words; we just really really like shapes.
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
        <div className="sticky top-16 md:top-20 max-w-7xl mx-auto relative z-10 px-2 md:px-8">
          <div className="flex justify-center items-start md:items-center min-h-[60vh] pt-4 md:pt-0">
            {/* Single card that changes content */}
            <div 
              className="relative w-full max-w-2xl md:max-w-3xl transition-all duration-700 ease-out"
              style={getDynamicTransform()}
            >
              <div className="w-full bg-white relative overflow-hidden shadow-lg flex flex-col md:flex-row">
                {/* Square image section */}
                <div className="aspect-square w-60 md:w-80 md:flex-shrink-0 overflow-hidden mx-auto md:mx-0">
                  <img 
                    key={currentCardIndex}
                    src={cardData[currentCardIndex].image}
                    alt="Design showcase"
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                  />
                </div>

                {/* Content section */}
                <div className="p-4 md:p-8 flex-1">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-900 transition-all duration-500 ease-in-out">
                    {cardData[currentCardIndex].title}
                  </h3>
                  
                  <div className="text-gray-700 text-md md:text-lg leading-relaxed transition-all duration-500 ease-in-out">
                    <p className="mb-4 md:mb-6">
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
      </div>

      {/* Bottom section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-8">
          <div className="text-center space-y-4">
            <div>
              <button className="text-black inline-flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}