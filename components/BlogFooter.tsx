// components/BlogFooter.tsx
import Link from 'next/link';
import PortableText from '@/app/(blog)/portable-text';
import { PortableTextBlock } from "next-sanity";

interface BlogFooterProps {
  footer: PortableTextBlock[];
  description: PortableTextBlock[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <footer className="bg-[#DDDDDD] border-accent-2 border-t">
      <div className="container mx-auto px-5">
        {/* Site Description above the footer */}
        {description?.length > 0 && (
          <div className="py-4 text-center text-[#ddcdbf] text-sm">
            <PortableText
              className="prose-sm text-[#828282] max-w-none"
              value={description}
            />
          </div>
        )}
        
        {footer.length > 0 ? (
          <PortableText
            className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
            value={footer}
          />
        ) : (
          <div className="flex flex-col items-center py-12 lg:flex-row">
            <h3 className="mb-6 text-[#828282] text-center text-1xl leading-tight tracking-tighter py-3 px-12 lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-1xl">
              Designed with 🍺 in Serbia.
            </h3>
            <div className="flex flex-col items-center justify-center lg:w-1/2 lg:flex-row">
              <a
                href="https://bsky.app/profile/4sigs.com"
                className="mx-3 mb-6 border border-[#828282] bg-[#DDDDDD] rounded-full py-3 px-12 font-bold text-[#828282] transition-colors duration-200 hover:bg-transparent hover:text-[#183f63] lg:mb-0 lg:px-8"
              >
                View our BlueSky ➚
              </a>
              <a
                href="mailto:hello@4sigs.com?subject=*Loud%20honk*%20This%20is%20me--%20contacting%20you!"
                className="mx-3 mb-6 border border-[#828282] bg-[#DDDDDD] rounded-full py-3 px-12 font-bold text-[#828282] transition-colors duration-200 hover:bg-transparent hover:text-[#89131f] lg:mb-0 lg:px-8"
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
