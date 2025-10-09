'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const handleCopy = (email: string, sectionId: string) => {
    navigator.clipboard.writeText(email);
    setActiveNotification(sectionId);
    setTimeout(() => setActiveNotification(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-5 py-12">
        {/* First Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="mb-8">
              <Image 
                src="/images/phone.svg" 
                alt="Contact Us" 
                width={288}
                height={288}
                className="w-72 h-72 mx-auto mb-6"
              />
              <h2 className="text-4xl md:text-5xl font-normal mb-8 text-white">
                Let&apos;s get in touch!
              </h2>
              <p className="text-3xl md:text-4xl font-light text-white mb-6 px-2 leading-relaxed">
                Want to start something memorable or just need help with one of our products? Send us an email and we&apos;ll respond ASAP.
              </p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => handleCopy('contact@palace.ad', 'section1')}
                className="text-3xl md:text-4xl font-medium mb-4 hover:underline transition-all duration-200 relative"
                style={{ color: '#FF4800' }}
              >
                click to copy - contact@palace.ad
              </button>
              
              {activeNotification === 'section1' && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded text-sm">
                  Email copied!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second Section */}
        <div className="max-w-4xl mx-auto mb-16 mt-24">
          <div className="text-center">
            <div className="mb-8">
              <Image 
                src="/images/contactlogo.svg" 
                alt="Anything Goes" 
                width={288}
                height={288}
                className="w-72 h-72 mx-auto mb-6"
              />
              <h2 className="text-4xl md:text-5xl font-normal mb-8 text-white">
                Anything goes!
              </h2>
              <p className="text-3xl md:text-4xl font-light text-white mb-6 px-2 leading-relaxed">
                This is the email we use for our store, collaborations and more! If needed, we&apos;ll create a unique private contact address just for you.
              </p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => handleCopy('contact@palace.ad', 'section2')}
                className="text-3xl md:text-4xl font-medium mb-20 hover:underline transition-all duration-200 relative"
                style={{ color: '#FF4800' }}
              >
                click to copy - contact@palace.ad
              </button>
              
              {activeNotification === 'section2' && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded text-sm">
                  Email copied!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center">
          <Link href="/" className="text-white hover:text-orange-400 inline-flex items-center font-regular">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}