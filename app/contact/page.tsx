'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-5 py-12">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/" className="text-black hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-3 gap-6 text-left max-w-6xl">
        <p className="text-3xl max-w-2xl mx-auto">
          Let's get in touch and make something memorable!
        </p>
      </div>

            {/* Page header desc */}
      <div className="mb-12 gap-2 text-left max-w-6xl">
        <p className="text-xl max-w-2xl mx-auto">
          Send us an email at c@type.tax to start something fresh.
        </p>
      </div>

      {/* Contact grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Contact */}
                <div className="bg-[#202020] p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-100">Primary Contact</h3>
            <p className="text-gray-100 mb-2">
              <span className="font-medium">All-Purpose Email:</span> c@type.tax
            </p>
            <p className="text-gray-100">
              <span className="font-medium">We usually respond fast,</span> though you may wait up to 48 hours.
            </p>
          </div>

          {/* Availability */}
          <div className="bg-gray-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Availability</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">We're always open!</span> Monday - Sunday 24/7
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Our standard time zone is</span> CEST/CET.
            </p>
          </div>

          {/* Business Solutions */}
          <div className="bg-gray-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Dedicated Email Address</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">A dedicated address</span> is available on request
            </p>
            <p className="text-gray-700">
              <span className="font-medium"></span> though our standard email is fully operational.
            </p>
          </div>

          {/* Alternative Contact */}
          <div className="bg-gray-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Informal Contact</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">🦋 Bluesky:</span> @type.tax
            </p>
            <p className="text-gray-700">
              <span className="font-medium">-</span> We've stopped using Meta's services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}