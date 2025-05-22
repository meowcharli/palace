'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-5 py-8">
      {/* Page header */}
      <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0 font-semibold">
        <p className="text-3xl max-w-2xl mx-auto">
          We&apos;re Typetax.
        </p>
      </div>

      {/* Page header desc */}
      <div className="mb-12 md:mb-20 gap-2 text-left max-w-8xl px-4 sm:px-0">
        <p className="text-xl max-w-2xl mx-auto">
          We&apos;re dedicated to experimentation and innovation in all things shapes, glyphs, geometry and graphics. In other words; we just really really like shapes.
        </p>
      </div>

      {/* About content */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-[#202020] p-6 md:p-14">
          <h3 className="text-2xl font-semibold mb-6 text-gray-100">
            What&apos;s the deal with shapes anyway?
          </h3>
          
          <div className="space-y-4 text-gray-100">
            <p>
              The biggest challenge in design is modularity. A logo might look perfect in its primary spot, but put it on print or change the color, and suddenly it looks amateur. That&apos;s where our obsession with form starts shining the most.
            </p>
            
            <p>
              Our team is always evolving. Nothing stays the same for long. What we do best is build teams of artists and experts who aren&apos;t just skilled, but genuinely excited about the work. These people then connect us with more amazing talent like themselves.
            </p>
            
            <p>
              We stand behind our work with pride, and we know our results inspire more than just our own creative drive.
            </p>

            <h4 className="text-xl font-medium mt-8 mb-4">
              Our Values
            </h4>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Design that works no matter what.</li>
              <li>Analytical and scientific approach to everything.</li>
              <li>More is less, no need to overcomplicate anything.</li>
              <li>Things being accessible and human-centered.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-black hover:text-blue-800 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}