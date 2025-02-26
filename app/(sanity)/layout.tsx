// app/(sanity)/layout.tsx
import "../globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Custom Header component built directly into the studio layout
async function CustomHeader() {
  // Fetch the two most recent articles
  try {
    const recentPosts = await sanityFetch({ 
      query: moreStoriesQuery, 
      params: { skip: '', limit: 2 } 
    });

    return (
      <header className="site-header w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="container-wide mx-auto px-5 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              {/* Logo - now 2x the size */}
              <div className="w-10 h-10 mr-4 flex-shrink-0">
                <svg viewBox="0 0 159.47 159.48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <rect fill="#330613" x="41.37" y="41.37" width="76.73" height="76.73"/>
                    <g>
                      <path fill="#0468ad" d="M26.56,139.91v16.98h0c-4.96-1.86-9.46-4.65-13.29-8.16,0,0-.02-.02-.02-.02v-8.81h13.32Z"/>
                      <g>
                        <path fill="#ddcdbf" d="M79.74,0v39.05c0,.78-.02,1.55-.07,2.32-1.16,20.63-17.67,37.13-38.3,38.29-.77.05-1.54.07-2.32.07H0v-38.86C0,18.3,18.3,0,40.87,0h38.87Z"/>
                        <path fill="#183f63" d="M38.47,18.32h22.95v21.86c0,11.72-9.52,21.24-21.24,21.24h-21.86v-22.95c0-11.12,9.03-20.15,20.15-20.15Z"/>
                        <rect fill="#183f63" x="39.81" y="79.74" width="13.34" height="60.18"/>
                        <path fill="#89131f" d="M159.47,79.74v41.84h-.11c-.23,3.3-.86,6.5-1.84,9.53-5.28,16.45-20.7,28.36-38.91,28.36h-38.87v-44.9c0-.3,0-.6,0-.9.04-1.4.16-2.79.36-4.14,2.43-16.85,16.94-29.79,34.47-29.79h44.9Z"/>
                        <polygon fill="#ddcdbf" points="140.62 79.74 124.94 121.58 121.37 131.11 110.74 159.47 99.99 159.47 110.61 131.11 114.19 121.58 115.5 118.1 118.1 111.15 125.01 92.7 129.87 79.74 140.62 79.74"/>
                        <path fill="#ddcdbf" d="M159.36,121.58c-.23,3.3-.86,6.5-1.84,9.53h-77.77v-9.53h79.62Z"/>
                        <path fill="#ffb522" d="M159.47,40.87v38.86h-40.07c-.44,0-.87,0-1.31-.02-20.87-.68-37.66-17.47-38.34-38.34,0-.43-.02-.86-.02-1.31V0h38.86c22.57,0,40.87,18.3,40.87,40.87Z"/>
                        <path fill="#ffb522" d="M39.83,79.73v79.74h0v-.02c-4.66-.11-9.12-1.01-13.26-2.56h0v-77.17h13.28Z"/>
                        <rect fill="#183f63" x="66.4" y="94.89" width="13.34" height="45.03"/>
                        <rect fill="#ffb522" x="53.15" y="86.78" width="13.28" height="72.7"/>
                        <rect fill="#183f63" x="13.24" y="79.74" width="13.34" height="60.18"/>
                        <path fill="#ffb522" d="M13.26,79.73v69.01s-.02-.02-.02-.02c-8.14-7.47-13.24-18.2-13.24-30.12v-38.87h13.26Z"/>
                        <circle fill="#330613" cx="119.61" cy="39.87" r="26.51"/>
                        <path fill="#ddcdbf" d="M79.74,121.59s41.5-4.74,50.22-41.85l-14.39.09s12.92,37.82-35.84,29.65v12.11Z"/>
                      </g>
                      <rect fill="#0468ad" x="66.43" y="139.91" width="13.32" height="19.57"/>
                      <rect fill="#0468ad" x="39.82" y="139.91" width="13.31" height="19.57"/>
                    </g>
                  </g>
                </svg>
              </div>
            </Link>

            {/* Recent Articles */}
            <div className="flex flex-col md:flex-row gap-4">
              {recentPosts?.slice(0, 2).map((post) => (
                <Link 
                  key={post._id} 
                  href={`/posts/${post.slug}`}
                  className="header-button bg-[#D7E7EF] text-[#000000] px-4 py-2 rounded transition-colors duration-200 hover:bg-[#89131F] hover:text-[#DDCDBF] text-sm min-w-[200px] inline-block"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/contact" 
              className="header-button bg-[#D7E7EF] text-[#000000] px-4 py-2 rounded transition-colors duration-200 hover:bg-[#89131F] hover:text-[#DDCDBF] text-sm inline-block"
            >
              Contact
            </Link>
            <Link 
              href="/support" 
              className="header-button bg-[#D7E7EF] text-[#000000] px-4 py-2 rounded transition-colors duration-200 hover:bg-[#89131F] hover:text-[#DDCDBF] text-sm inline-block"
            >
              Support
            </Link>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error("Error in CustomHeader:", error);
    // Fallback header with just logo and basic links in case fetching posts fails
    return (
      <header className="site-header w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="container-wide mx-auto px-5 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 mr-4 flex-shrink-0">
              <svg viewBox="0 0 159.47 159.48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG content same as above */}
                <rect fill="#330613" x="41.37" y="41.37" width="76.73" height="76.73"/>
              </svg>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/contact" 
              className="header-button bg-[#D7E7EF] text-[#000000] px-4 py-2 rounded transition-colors duration-200 hover:bg-[#89131F] hover:text-[#DDCDBF] text-sm inline-block"
            >
              Contact
            </Link>
            <Link 
              href="/support" 
              className="header-button bg-[#D7E7EF] text-[#000000] px-4 py-2 rounded transition-colors duration-200 hover:bg-[#89131F] hover:text-[#DDCDBF] text-sm inline-block"
            >
              Support
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-text"> 
        <CustomHeader />
        {children}
      </body>
    </html>
  );
}
