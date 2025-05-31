'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [activeNotification, setActiveNotification] = useState<number | null>(null);

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
        { text: "We've stopped using Meta's services." }
      ],
      copyText: "@type.tax",
      notification: "Social handle copied!"
    }
  ];

  return (
    <div className="container mx-auto px-5 py-8">
      {/* Page header */}
      <div className="mb-3 gap-6 text-left max-w-8xl px-4 sm:px-0">
        <p className="text-3xl max-w-2xl mx-auto">
          Let&apos;s get in touch and make something memorable!
        </p>
      </div>

      {/* Page header desc */}
      <div className="mb-12 md:mb-20 gap-2 text-left max-w-8xl px-4 sm:px-0">
        <p className="text-xl max-w-2xl mx-auto">
          Send us an email at c@type.tax to start something fresh.
        </p>
      </div>

      {/* Contact grid */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
          {contactItems.map((item, index) => (
            <div 
              key={index}
              className="group bg-[#202020] p-6 md:p-6 hover:bg-[#303030] cursor-pointer transition-all duration-500 ease-in-out relative h-full min-h-[180px] flex flex-col"
              onClick={() => handleCopy(item.copyText, index)}
            >
              {/* Notification overlay */}
              {activeNotification === index && (
                <div className="absolute inset-0 bg-[#303030] bg-opacity-100 flex items-center justify-center text-gray-100 text-lg font-medium transition-opacity duration-50">
                  {item.notification}
                </div>
              )}

              <h3 className="text-xl font-semibold mb-3 text-gray-100 group-hover:text-gray-200">
                {item.title}
              </h3>
              <div className="flex-grow">
                {item.content.map((paragraph, pIndex) => (
                  <p 
                    key={pIndex} 
                    className="mb-2 last:mb-0 text-gray-100 group-hover:text-gray-200"
                  >
                    {paragraph.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back button moved to bottom */}
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