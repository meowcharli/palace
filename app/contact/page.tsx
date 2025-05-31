'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [activeNotification, setActiveNotification] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (isMobile) return;
    
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -1; // Reduced to 25% of original (-4 to -1)
    const rotateY = (x - centerX) / centerX * 1; // Reduced to 25% of original (4 to 1)
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.0025)`; // Reduced scale to 25% of original (1.01 to 1.0025)
  };

  const handleMouseLeave = (index: number) => {
    if (isMobile) return;
    
    const card = cardRefs.current[index];
    if (!card) return;
    
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  const getMobileTransform = (index: number) => {
    // Remove 3D effects from mobile - return empty object
    return {};
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setActiveNotification(index);
    setTimeout(() => setActiveNotification(null), 2000);
  };

  const contactItems = [
    {
      title: "Primary Contact",
      content: [
        { text: "All-Purpose Email: c@type.tax" },
        { text: "We usually respond fast, though you may wait up to 48 hours." }
      ],
      copyText: "c@type.tax",
      notification: "Email copied!"
    },
    {
      title: "Availability",
      content: [
        { text: "We're always open! Monday - Sunday 24/7" },
        { text: "Our standard time zone is CEST/CET." }
      ],
      copyText: "Always open: Monday - Sunday 24/7 (CEST/CET)",
      notification: "Info copied!"
    },
    {
      title: "Dedicated Email Address",
      content: [
        { text: "A dedicated address is available on request" },
        { text: "though our standard email is fully operational." }
      ],
      copyText: "Dedicated email available on request (contact c@type.tax)",
      notification: "Info copied!"
    },
    {
      title: "Informal Contact",
      content: [
        { text: "🦋 Bluesky: @type.tax" },
        { text: "We usually hang out here." }
      ],
      copyText: "@type.tax",
      notification: "Social handle copied!"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Top section with white background */}
      <div className="bg-white">
        <div className="container mx-auto px-5 py-8">
          {/* Page header */}
          <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0">
            <p className="text-3xl max-w-2xl mx-auto text-black">
              Let&apos;s get in touch and make something memorable!
            </p>
          </div>

          {/* Page header desc */}
          <div className="mb-12 md:mb-20 gap-2 text-left max-w-8xl px-4 sm:px-0">
            <p className="text-xl max-w-2xl mx-auto text-black">
              Send us an email at c@type.tax to start something fresh.
            </p>
          </div>
        </div>
      </div>

      {/* Cards section with background image */}
      <div 
        className="bg-cover bg-center bg-no-repeat py-12 md:py-20 relative"
      >
        {/* Background image with 80% opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: 'url(https://i.imgur.com/S7a69iW.png)'
          }}
        ></div>

        {/* Contact grid */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
            {contactItems.map((item, index) => (
              <div 
                key={index}
                className="group relative cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => handleCopy(item.copyText, index)}
              >
                <div 
                  ref={el => { cardRefs.current[index] = el; }}
                  className="w-full aspect-[1.586/1] bg-cover bg-center bg-no-repeat transition-all duration-300 ease-out relative overflow-hidden shadow-lg"
                  style={{
                    backgroundImage: 'url(https://i.imgur.com/airNXGH.png)',
                    transformStyle: 'preserve-3d',
                    ...getMobileTransform(index)
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {/* Notification overlay */}
                  {activeNotification === index && (
                    <div className="absolute inset-0 bg-white bg-opacity-0 flex items-center justify-center text-black text-opacity-20 text-2xl font-medium z-20">
                      {item.notification}
                    </div>
                  )}

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between bg-white bg-opacity-85 group-hover:bg-opacity-90 transition-all duration-300">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-black">
                        {item.title}
                      </h3>
                      <div className="space-y-2">
                        {item.content.map((paragraph, pIndex) => (
                          <p 
                            key={pIndex} 
                            className="text-lg text-black leading-relaxed"
                          >
                            {paragraph.text}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Card footer */}
                    <div className="mt-4 pt-4 border-t border-gray-300 relative">
                      <div className="text-sm text-gray-600 font-mono">
                        c@type.tax | www.type.tax
                      </div>
                      
                      {/* Click to copy hint - styled like footer text */}
                      <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-600 font-mono">
                        Click to copy
                      </div>
                    </div>
                  </div>

                  {/* 3D depth effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
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