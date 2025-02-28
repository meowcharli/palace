// components/BlogHeader.tsx - Updated for mobile optimization
import Link from 'next/link';
import Logo from './Logo';
import SearchBar from './SearchBar';

interface BlogHeaderProps {
  recentPosts: Array<{
    _id: string;
    title: string;
    slug: string | null;
  }>;
}

export default function BlogHeader({ recentPosts }: BlogHeaderProps) {
  return (
    <header className="site-header w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container-wide mx-auto flex justify-between items-center">
        {/* Left section with logo */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Logo with button background - always visible */}
          <Link href="/" className="flex items-center relative">
            <div className="logo-button rounded-2xl bg-white hover:bg-[#FFDCDC] transition-colors duration-200 absolute" aria-hidden="true"></div>
            <Logo className="mobile-logo" />
          </Link>

          {/* Recent Articles - hidden on mobile */}
          <div className="header-article-container">
            {recentPosts?.length > 0 && (
              <div className="header-article-primary">
                <Link 
                  key={recentPosts[0]._id} 
                  href={`/posts/${recentPosts[0].slug || ''}`}
                  className="header-button"
                >
                  {recentPosts[0].title}
                </Link>
              </div>
            )}
            
            {recentPosts?.length > 1 && (
              <div className="header-article-secondary">
                <Link 
                  key={recentPosts[1]._id} 
                  href={`/posts/${recentPosts[1].slug || ''}`}
                  className="header-button"
                >
                  {recentPosts[1].title}
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Right section with search and support (support hidden on mobile) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search bar - always visible */}
          <SearchBar className="mobile-visible" />
          
          {/* Support button - hidden on mobile */}
          <Link 
            href="/support" 
            className="inline-flex items-center bg-white text-black px-3 py-1 md:px-4 md:py-2 rounded-full text-[0.85rem] md:text-[0.95rem] border border-gray-200 transition-colors duration-200 hover:bg-[#FFEFF4] hover:text-[#89131F]"
          >
            Support
          </Link>
        </div>
      </div>
    </header>
  );
}
