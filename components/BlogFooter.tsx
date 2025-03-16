// components/BlogFooter.tsx - Updated for dark mode
import Link from 'next/link';
import PortableText from '@/app/(blog)/portable-text';
import { PortableTextBlock } from "next-sanity";

interface BlogFooterProps {
  footer: any[];
  description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-5">
        {/* Site Description above the footer */}
        {description?.length > 0 && (
          <div className="py-4 text-center text-sm">
            <PortableText
              className="prose-sm text-gray-400 max-w-none"
              value={description}
            />
          </div>
        )}
        
        {footer.length > 0 ? (
          <PortableText
            className="prose-sm text-pretty bottom-0 w-full max-w-none bg-black py-12 text-gray-400 text-center md:py-20"
            value={footer}
          />
        ) : (
          <div className="flex flex-col items-center py-12 lg:flex-row">
            <h3 className="mb-6 text-gray-400 text-center text-xl leading-tight tracking-tighter py-3 px-12 lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left">
              Designed with 🍺 in Serbia.
            </h3>
            <div className="flex flex-col items-center justify-center lg:w-1/2 lg:flex-row">
              <a
                href="https://bsky.app/profile/4sigs.com"
                className="mx-3 mb-6 border border-gray-700 bg-gray-900 rounded-full py-3 px-12 font-bold text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white lg:mb-0 lg:px-8"
              >
                View our BlueSky ➚
              </a>
              <a
                href="mailto:hello@4sigs.com?subject=*Loud%20honk*%20This%20is%20me--%20contacting%20you!"
                className="mx-3 mb-6 border border-gray-700 bg-gray-900 rounded-full py-3 px-12 font-bold text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white lg:mb-0 lg:px-8"
              >
                Email us! ➚
              </a>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
