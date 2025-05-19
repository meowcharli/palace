'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-5 py-12">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <div className="w-24 h-1 bg-gray-600 mx-auto"></div>
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg mb-4">
            This is still a placeholder, website is WIP
          </p>
          <p className="text-lg mb-4">
            Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. 
            Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
          </p>
        </section>
      </div>
    </div>
  );
}