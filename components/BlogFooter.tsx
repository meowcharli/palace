// components/BlogFooter.tsx - No PortableText
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
          <div className="mb-6">
            <svg width="120" height="24" viewBox="0 0 420 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M419.17 0v17.84h-53.06c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.06 24.03-.72.73h-49.68V76.97h53.06c2.36 0 4.27-1.92 4.27-4.28V56.91h-57.33V25.49l.73-.72L368.76.72l.73-.72zm-86 39.09v30.64l-.72.73-23.63 23.62-.72.73H258v-69.3l.73-.73L282.77.74l.73-.73h42.01l-4.22 4.22-12.89 12.9-.72.73h-27.55c-2.36 0-4.28 1.92-4.28 4.28v54.83h35.27c2.36 0 4.28-1.92 4.28-4.28v-33.6zM57.34 0h17.82v94.79H57.34V56.91H25.48l-.72-.72L.72 32.14 0 31.41V0h17.84v34.8c0 2.36 1.92 4.28 4.28 4.28h35.22zm103.82 0v17.84H108.1c-2.36 0-4.28 1.91-4.28 4.27v16.96h57.34v30.24l-.72.73-24.05 24.03-.72.73H86V76.97h53.04c2.36 0 4.28-1.92 4.28-4.28V56.91H86V25.49l.72-.72L110.75.72l.73-.72zm86.02 0v17.84h-24.39c-2.36 0-4.28 1.91-4.28 4.27v50.58c0 2.36 1.92 4.28 4.28 4.28h24.39V94.8h-75.19V76.97h24.39c2.36 0 4.28-1.92 4.28-4.28V22.11c0-2.36-1.92-4.27-4.28-4.27h-24.39V0z"
                fill="#9CA3AF"
              />
            </svg>
          </div>
          <div className="flex flex-col items-end space-y-4 mb-4">
            <a
              href="https://bsky.app/profile/4sigs.com"
              className="text-white hover:text-white transition-colors duration-200 text-xl"
            >
              → bluesky
            </a>
            <a
              href="mailto:hello@4sigs.com?subject=*Loud%20honk*%20This%20is%20me--%20contacting%20you!"
              className="text-white hover:text-white transition-colors duration-200 text-xl"
            >
              → email us
            </a>
            <Link
              href="/about"
              className="text-white hover:text-white transition-colors duration-200 text-xl"
            >
              → about us
            </Link>
          </div>
          <p className="text-gray-400 text-xs">
            Designed with 🍺 in Serbia.
          </p>
        </div>
      </div>
    </div>
  );
}