import Link from ‘next/link’;

interface BlogFooterProps {
footer: any[];
description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
return (
<>
<style dangerouslySetInnerHTML={{
__html: `.footer-link { color: #1D1D1F; text-decoration: none; transition: text-decoration 0.2s ease; } .footer-link:hover { text-decoration: underline; } .footer-desktop { display: flex; justify-content: space-between; align-items: center; } .footer-mobile { display: none; } @media (max-width: 768px) { .footer-desktop { display: none; } .footer-mobile { display: block; } }`
}} />
<div style={{ backgroundColor: “#fff” }} className=“border-t border-gray-200”>
<div style={{
maxWidth: “12000px”,
margin: “0 auto”,
padding: “1rem 5%”,
}}>
{/* Desktop Layout */}
<div className="footer-desktop">
{/* Left side - Logo and navigation */}
<div style={{
display: “flex”,
alignItems: “center”,
gap: “2rem”
}}>
<svg 
width="100" 
height="46" 
viewBox="0 0 276.14 65.52" 
preserveAspectRatio="xMidYMid meet"
xmlns="http://www.w3.org/2000/svg"
>
<path
d=“M0 0h13.1v26.21h52.42v13.1H13.1v26.21H0zm135.73 0v19.56l-26.21 26.21v19.75h-13.1V45.77L70.21 19.56V0h13.1v15.91l19.66 19.66 19.66-19.66V0zm70.2 52.42-13.1 13.1h-13.1l-13.1-13.1V13.1h-26.21V0h65.52v52.42ZM179.72 13.1v39.31h13.1V13.1zm30.89 52.42v-13.1h52.42v-13.1h-39.31v-13.1h39.31v-13.1h-52.42V0h65.52v65.52z”
style={{ fill: “#5d5d5f” }}
data-name=“Layer 2”
/>
</svg>

```
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem"
          }}>
            <Link
              href="/contact"
              className="footer-link"
            >
              contact
            </Link>
            <span style={{ color: "#5d5d5f" }}>/</span>
            <Link
              href="/about"
              className="footer-link"
            >
              about
            </Link>
            <span style={{ color: "#5d5d5f" }}>/</span>
            <a
              href="https://bsky.app/profile/type.tax"
              className="footer-link"
            >
              bluesky
            </a>
          </div>
        </div>
        
        {/* Right side - Attribution */}
        <div style={{ 
          color: "#1D1D1F", 
          fontSize: "0.75rem",
          textAlign: "right"
        }}>
          <p style={{ margin: 0 }}>© 2025 Typetax. All rights reserved.</p>
          <p style={{ margin: 0 }}>Designed with 🍺 in Serbia.</p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="footer-mobile">
        {/* Top row - Logo left, links right */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <svg 
            width="80" 
            height="37" 
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
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem"
          }}>
            <Link
              href="/contact"
              className="footer-link"
            >
              contact
            </Link>
            <span style={{ color: "#5d5d5f" }}>/</span>
            <Link
              href="/about"
              className="footer-link"
            >
              about
            </Link>
            <span style={{ color: "#5d5d5f" }}>/</span>
            <a
              href="https://bsky.app/profile/type.tax"
              className="footer-link"
            >
              bluesky
            </a>
          </div>
        </div>
        
        {/* Bottom row - Centered attribution */}
        <div style={{ 
          color: "#1D1D1F", 
          fontSize: "0.75rem",
          textAlign: "center"
        }}>
          <p style={{ margin: 0 }}>© 2025 Typetax. All rights reserved.</p>
          <p style={{ margin: 0 }}>Designed with 🍺 in Serbia.</p>
        </div>
      </div>
    </div>
  </div>
</>
```

);
}