// app/(blog)/onboarding.tsx
"use client";

/**
 * This file is used for onboarding when you don't have any posts yet and are using the template for the first time.
 * Once you have content, and know where to go to access the Sanity Studio and create content, you can delete this file.
 */

import Link from "next/link";

export default function Onboarding() {
  return (
    <div className="grid grid-flow-row gap-8 py-40 text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-black">Welcome to Palace</h1>
        <p className="text-xl text-gray-600 mb-12">
          A beautifully crafted digital experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gallery</h3>
            <p className="text-gray-600 mb-4">
              Explore our curated collection of visual experiences
            </p>
            <Link 
              href="/gallery" 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              Visit Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Blog</h3>
            <p className="text-gray-600 mb-4">
              Insights, stories, and perspectives from our team
            </p>
            <Link 
              href="/posts" 
              className="inline-flex items-center text-pink-600 hover:text-pink-800"
            >
              Read Blog
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Showcase</h3>
            <p className="text-gray-600 mb-4">
              Featured projects and collaborative works
            </p>
            <Link 
              href="/showcase" 
              className="inline-flex items-center text-amber-600 hover:text-amber-800"
            >
              View Showcase
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom section with admin link */}
      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">About Palace</h2>
          <p className="text-gray-600 mb-8">
            Palace is a digital platform showcasing creative works, thought leadership, and interactive experiences. 
            Explore our gallery, read our latest posts, or discover featured projects in our showcase section.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors"
          >
            Contact Us
          </Link>
          
          <Link
            href="/about"
            className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors"
          >
            Learn More
          </Link>
          
          <Link
            href="/studio"
            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}