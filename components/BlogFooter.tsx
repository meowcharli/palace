import Link from 'next/link';

interface BlogFooterProps {
  footer: any[];
  description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <div style={{ backgroundColor: "#111111" }} className="border-t border-gray-800">
      <div className="container mx-auto px-5 py-12">
        <div className="flex flex-col items-end text-right">
          <div className="mb-8">
            <svg 
              width="141" 
              height="60" 
              viewBox="0 0 392.89 181.59" 
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[60px] w-[141px]" // Explicit dimensions
            >
              <path
                fill="#9CA3AF"
                d="M392.89 0v108.95H61.39l72.64 72.64H90.79L0 90.79 90.79 0h43.24L61.39 72.64h295.2V0z"
              />
            </svg>
          </div>
          <div className="flex flex-col items-end space-y-3 mb-3"> {/* Reduced space-y-4 to space-y-3 and mb-4 to mb-3 */}
            <a
              href="https://bsky.app/profile/4sigs.com"
              className="text-white hover:text-white transition-colors duration-200 text-lg" // Reduced text-xl to text-lg
            >
              → bluesky
            </a>
            <a
              href="mailto:hello@4sigs.com?subject=*Loud%20honk*%20This%20is%20me--%20contacting%20you!"
              className="text-white hover:text-white transition-colors duration-200 text-lg"
            >
              → email us
            </a>
            <Link
              href="/about"
              className="text-white hover:text-white transition-colors duration-200 text-lg"
            >
              → about us
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-2"> {/* Added mt-2 for small top margin */}
            Designed with 🍺 in Serbia.
          </p>
        </div>
      </div>
    </div>
  );
}