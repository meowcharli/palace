// components/BlogHeader.tsx - Updated for dark mode
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
    <header className="site-header w-full bg-black border-b border-gray-800 shadow-md">
      <div className="container-wide mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Logo with button background - always visible */}
          <Link href="/" className="flex items-center relative">
            <div className="logo-button rounded-2xl bg-black hover:bg-gray-900 transition-colors duration-200 absolute" aria-hidden="true"></div>
            <Logo className="w-10 h-10" />
          </Link>

          {/* Recent Articles */}
          <div className="flex space-x-3">
            {recentPosts?.length > 0 && (
              <div>
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
              <div>
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
        
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <SearchBar />
          
          {/* Support button */}
          <Link 
            href="/support" 
            className="inline-flex items-center bg-gray-900 text-white px-4 py-2 rounded-full text-sm border border-gray-700 transition-colors duration-200 hover:bg-gray-800"
          >
            Support
          </Link>
        </div>
      </div>
    </header>
  );
}
