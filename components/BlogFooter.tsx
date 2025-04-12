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
            <svg width="141" height="60" viewBox="0 0 135.39 57.39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path
                  d="M39.82 0v5.54H28.75v22.14h-5.54V5.54H12.14V0zm29.66 0v8.26L58.41 19.33v8.34h-5.54v-8.34L41.8 8.26V0h5.54v6.72l8.3 8.3 8.3-8.3V0zM93.6 0l5.54 5.54v5.54l-5.54 5.54H76.99v11.07h-5.54V0h22.14ZM76.99 11.07H93.6V5.53H76.99zM123.25 0v5.54h-16.61v5.54h11.07v5.54h-11.07v5.54h16.61v5.54h-22.14V0zM39.82 29.71v5.54H28.75v22.14h-5.54V35.25H12.14v-5.54zm24.12 0 5.54 5.54v22.14h-5.54V46.32H47.33v11.07h-5.54V35.25l5.54-5.54zM47.33 40.78h16.61v-5.54H47.33zm51.8-11.07v5.54h-3.16l-8.3 8.3 8.3 8.3h3.16v5.54H87.19v-5.06h2.17l-4.07-4.07-9.13 9.13h-4.71v-5.54h3.16l8.3-8.3-8.3-8.3h-3.16v-5.54h11.94v5.06h-2.17l4.07 4.07 9.13-9.13zm22.42 0-11.07 11.07h24.91v5.54h-24.91l11.07 11.07h-6.6l-13.84-13.84 13.84-13.84z"
                  fill="#9CA3AF"
                />
                <path
                  d="M125.23 0h10.16v38.8h-10.16zM0 0h10.16v57.39H0zm125.23 48.29h10.16v9.1h-10.16z"
                  fill="#9CA3AF"
                />
              </g>
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