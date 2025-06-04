import Link from 'next/link';

interface BlogFooterProps {
  footer: any[];
  description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <div style={{ backgroundColor: "#fff" }} className="border-t border-gray-200">
      <div style={{ 
        maxWidth: "12000px", 
        margin: "0 auto",
        padding: "1.8rem 5%", 
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left"
        }}>
          <div style={{ marginBottom: "0rem" }}>
            <svg 
              width="130" 
              height="60" 
              viewBox="0 0 276.14 65.52" 
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0 0h13.1v26.21h52.42v13.1H13.1v26.21H0zm135.73 0v19.56l-26.21 26.21v19.75h-13.1V45.77L70.21 19.56V0h13.1v15.91l19.66 19.66 19.66-19.66V0zm70.2 52.42-13.1 13.1h-13.1l-13.1-13.1V13.1h-26.21V0h65.52v52.42ZM179.72 13.1v39.31h13.1V13.1zm30.89 52.42v-13.1h52.42v-13.1h-39.31v-13.1h39.31v-13.1h-52.42V0h65.52v65.52z" 
                style={{ fill: "#5d5d5f" }} 
                data-name="Layer 2"
              />
            </svg>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}>
            <a
              href="https://bsky.app/profile/type.tax"
              style={{
                color: "#1D1D1F",
                marginBottom: "0.4rem",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → visit our bluesky
            </a>
            <a
              href="/contact"
              style={{
                color: "#1D1D1F",
                marginBottom: "0.4rem",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → contact us
            </a>
            <Link
              href="/about"
              style={{
                color: "#1D1D1F",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → more about us
            </Link>
          </div>
          <p style={{ 
            color: "#1D1D1F", 
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