// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

// Define props to control whether to show the title on homepage
interface HeaderProps {
  isHomePage?: boolean;
}

// Function to fetch recent articles
async function RecentArticles() {
  // Fetch the two most recent articles
  const recentPosts = await sanityFetch({ 
    query: moreStoriesQuery, 
    params: { skip: '', limit: 2 } 
  });

  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm">
      {recentPosts?.slice(0, 2).map((post) => (
        <Link 
          key={post._id} 
          href={`/posts/${post.slug}`}
          className="hover:underline overflow-hidden text-ellipsis whitespace-nowrap max-w-xs"
        >
          {post.title}
        </Link>
      ))}
    </div>
  );
}

export default async function Header({ isHomePage = false }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-2 shadow-sm">
      <div className="container mx-auto px-5 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <Image 
              src="/main/svg/logowo.svg" 
              alt="4Sigs Logo" 
              width={32} 
              height={32} 
              className="mr-2"
            />
          </Link>

          {/* Recent Articles */}
          <RecentArticles />
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/support" className="hover:underline">
            Support
          </Link>
        </div>
      </div>
    </header>
  );
}
