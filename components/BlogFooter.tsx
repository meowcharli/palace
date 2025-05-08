import Link from 'next/link';

interface BlogFooterProps {
  footer: any[];
  description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <div style={{ backgroundColor: "#111111" }} className="border-t border-gray-800">
      <div style={{ 
        maxWidth: "12000px", 
        margin: "0 auto",
        padding: "1.8rem 5%", 
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Changed to align items to the left
          textAlign: "left" // Changed to left-align text
        }}>
          <div style={{ marginBottom: "0rem" }}>
            <svg 
              width="200" 
              height="60" 
              viewBox="0 0 755.08 100.86" 
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Layer_2-2" data-name="Layer 2">
                <path fill="#919191" d="M205.78 9.48v16.38h-32.76v65.52h-16.38V25.86h-32.76V9.48h81.91Zm87.76 0v24.45l-32.76 32.76v24.69H244.4V66.69l-32.76-32.76V9.48h16.38v19.89l24.57 24.57 24.57-24.57V9.48zm71.37 0 16.38 16.38v16.38l-16.38 16.38h-49.14v32.76h-16.38V9.48zm-49.14 32.76h49.14V25.86h-49.14zM469.05 9.48v16.38h-65.52v16.38h49.14v16.38h-49.14V75h65.52v16.38h-81.9V9.48zm110.05 0v16.38h-32.76v65.52h-16.38V25.86H497.2V9.48h81.91Zm71.85 0 16.38 16.38v65.52h-16.38V58.62h-49.14v32.76h-16.38V25.86l16.38-16.38zm-49.14 32.76h49.14V25.86h-49.14zM755.08 9.48v16.38h-9.36l-24.57 24.57L745.72 75h9.36v16.38h-35.34V76.4h6.44l-12.05-12.05-27.03 27.03h-13.92V75h9.36l24.57-24.57-24.57-24.57h-9.36V9.48h35.34v14.98h-6.44l12.05 12.05 27.03-27.03z"/>
                <rect fill="#919191" x="485.34" y="63.7" width="27.69" height="27.69" rx="13.84" ry="13.84"/>
                <path fill="#919191" d="M72.27 0H28.58C12.79 0 0 12.8 0 28.59v15.85h12V28.59C12 19.44 19.44 12 28.58 12h43.69c9.15 0 16.59 7.44 16.59 16.59v43.69c0 9.14-7.44 16.58-16.59 16.58H28.58C19.44 88.86 12 81.42 12 72.28v-7.65H0v7.65c0 15.79 12.79 28.58 28.58 28.58h43.69c15.79 0 28.59-12.79 28.59-28.58V28.59C100.86 12.8 88.06 0 72.27 0"/>
                <path fill="#919191" d="m83.05 50.43-32.1 32.1H33.17l25.67-25.68H0V44.02h58.84L33.17 18.34h17.78z"/>
              </g>
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
              → visit our bluesky
            </a>
            <a
              href="mailto:c@type.tax?subject=Hi%20there!%20Let's%20make%20something%20new!&body=(Your%20creative%20outlet%20goes%20here)"
              style={{
                color: "white",
                marginBottom: "0.4rem",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → click to email us
            </a>
            <Link
              href="/about"
              style={{
                color: "white",
                fontSize: "1.125rem",
                transition: "color 0.2s ease"
              }}
            >
              → more about us
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