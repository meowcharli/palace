'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setResults([]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Using JSX to avoid quote escaping issues
  const queryDisplay = (
    <span className="font-semibold">
      {'"'}{query}{'"'}
    </span>
  );

  return (
    <div className="container mx-auto px-5 py-12">
      <h1 className="text-4xl font-bold mb-8">Search Results</h1>
      {query ? (
        <p className="text-xl mb-8">
          Showing results for: {queryDisplay}
        </p>
      ) : (
        <p className="text-xl mb-8">
          Please enter a search term to find articles.
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {results.map((result) => (
            <div key={result.id} className="border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/posts/${result.slug}`} className="hover:underline">
                  {result.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{result.excerpt}</p>
              <Link 
                href={`/posts/${result.slug}`}
                className="text-[#89131F] hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">No results found.</p>
          <p className="mt-2">Try another search term or browse our recent articles.</p>
          <Link 
            href="/"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-[#FFEFF4] text-[#89131F] hover:bg-[#89131F] hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
