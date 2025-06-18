'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [activeNotification, setActiveNotification] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -1;
    const rotateY = (x - centerX) / centerX * 1;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.0025)`;
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    const card = cardRef.current;
    if (!card) return;
    
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('c@type.tax');
    setActiveNotification(true);
    setTimeout(() => setActiveNotification(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Top section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-8">
          {/* Page header with wave gif */}
          <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0">
            <div className="max-w-2xl mx-auto">
              {/* Desktop layout - wave and text side by side */}
              <div className="hidden md:flex items-center justify-center">
                <img 
                  src="/images/wave.gif" 
                  alt="Wave animation" 
                  className="w-12 h-12 mr-4 flex-shrink-0"
                />
                <p className="text-3xl text-black">
                  Let&apos;s get in touch and make something memorable!
                </p>
              </div>
              
              {/* Mobile layout - text first, then subtitle, then wave below */}
              <div className="md:hidden">
                <p className="text-3xl text-black text-left">
                  Let&apos;s get in touch and make something memorable!
                </p>
              </div>
            </div>
          </div>

          {/* Page header desc */}
          <div className="mb-8 md:mb-12 gap-2 text-left max-w-8xl px-4 sm:px-0">
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-black hidden md:block text-center">
                Send us an email at c@type.tax to start something fresh.
              </p>
              
              {/* Mobile layout - subtitle then wave */}
              <div className="md:hidden">
                <p className="text-xl text-black text-left mb-4">
                  Send us an email at c@type.tax to start something fresh.
                </p>
                <img 
                  src="/images/wave.gif" 
                  alt="Wave animation" 
                  className="w-12 h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card section with background image */}
      <div 
        className="bg-cover bg-center bg-no-repeat py-12 md:py-20 relative"
      >
        {/* Background image with 50% opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1523878288860-7ad281611901?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
          }}
        ></div>

        {/* Single contact card */}
        <div className="max-w-2xl mx-auto relative z-10 px-4 md:px-0">
          <div 
            className="group relative cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={handleCopy}
          >
            <div 
              ref={cardRef}
              className="w-full aspect-[1.586/1] bg-cover bg-center bg-no-repeat transition-all duration-300 ease-out relative overflow-hidden shadow-lg"
              style={{
                backgroundImage: 'url(https://i.imgur.com/airNXGH.png)',
                transformStyle: 'preserve-3d'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Notification overlay */}
              {activeNotification && (
                <div className="absolute inset-0 bg-white bg-opacity-0 flex items-center justify-center text-black text-opacity-20 text-lg md:text-2xl font-medium z-20">
                  Email copied!
                </div>
              )}

              {/* Content overlay */}
              <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between bg-white bg-opacity-85 group-hover:bg-opacity-90 transition-all duration-300">
                <div className="flex-1">
                  <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-6 text-black">
                    Primary Contact
                  </h3>
                  <div className="space-y-1 md:space-y-3">
                    <p className="text-sm md:text-xl text-black leading-relaxed">
                      All-Purpose Email: c@type.tax
                    </p>
                    <p className="text-sm md:text-xl text-black leading-relaxed">
                      We usually respond fast, though you may wait up to 48 hours.
                    </p>
                  </div>
                </div>
                
                {/* Card footer */}
                <div className="mt-2 md:mt-6 pt-2 md:pt-6 border-t border-gray-300 relative">
                  <div className="text-xs md:text-base text-gray-600 font-mono">
                    c@type.tax | www.type.tax
                  </div>
                  
                  {/* Click to copy hint */}
                  <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs md:text-base text-gray-600 font-mono">
                    Click to copy
                  </div>
                </div>
              </div>

              {/* 3D depth effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
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