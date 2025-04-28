import Link from 'next/link';

interface BlogFooterProps {
  footer: any[];
  description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <div style={{ backgroundColor: "#111111" }} className="border-t border-gray-800">
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        padding: "3rem 5%", 
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Changed to align items to the left
          textAlign: "left" // Changed to left-align text
        }}>
          <div style={{ marginBottom: "2rem" }}>
            <svg 
              width="141" 
              height="60" 
              viewBox="0 0 392.89 181.59" 
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#9CA3AF"
                d="M392.89 0v108.95H61.39l72.64 72.64H90.79L0 90.79 90.79 0h43.24L61.39 72.64h295.2V0z"
              />
            </svg>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Changed to align items to the left
            marginBottom: "1.5rem",
          }}>
            <a
              href="https://bsky.app/profile/4sigs.com"
              style={{
                color: "white",
                marginBottom: "0.4rem",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → bluesky
            </a>
            <a
              href="mailto:hello@4sigs.com?subject=*Loud%20honk*%20This%20is%20me--%20contacting%20you!"
              style={{
                color: "white",
                marginBottom: "0.4rem",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → email us
            </a>
            <Link
              href="/about"
              style={{
                color: "white",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → about us
            </Link>
          </div>
          <p style={{ 
            color: "#9CA3AF", 
            fontSize: "0.75rem", 
            marginTop: "0.3rem" 
          }}>
            Designed with 🍺 in Serbia.
          </p>
        </div>
      </div>
    </div>
  );
}