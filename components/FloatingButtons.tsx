import React from 'react';
import Link from 'next/link';

const FloatingButtons: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[999999]">
      {/* Button to navigate to the main site */}
      <Link href="/" passHref>
        <button
          className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all"
          title="Back to Site"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
      </Link>
      
      {/* Button to navigate to the Sanity Studio */}
      <Link href="/studio" passHref>
        <button
          className="p-3 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-all"
          title="Sanity Studio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </Link>
    </div>
  );
};

export default FloatingButtons;