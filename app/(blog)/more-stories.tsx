// File: app/(blog)/more-stories.tsx
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";

// We need to create a custom type for this component since it includes 'tags'
interface PostWithTags {
  _id: string;
  status?: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
  videoEmbed?: any;
  date?: string;
  author?: any;
  tags?: string[];
}

// Updated query - no longer skips any posts and shows all posts
const allPostsQuery = `
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    _id,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage,
    videoEmbed,
    "date": coalesce(date, _updatedAt),
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
    tags
  }
`;

export default async function MoreStories() {
  // Fetch all posts instead of just a few
  const data = await sanityFetch<PostWithTags[]>({ query: allPostsQuery });

  return (
    <>
      <div className="mb-8 grid grid-cols-3 gap-y-0 md:grid-cols-3 md:gap-x-0 md:gap-y-0 lg:gap-x-8">
        {data?.map((post: PostWithTags) => {
          const { _id, title, slug, coverImage, videoEmbed, tags } = post;
          const postUrl = `/posts/${slug}`;
          
          return (
            <article key={_id} className="bg-black">
              <Link href={postUrl} className="group mb-0 block">
              </Link>
              <h3 className="text-balance mb-0 text-lg leading-none text-white">
                <Link href={postUrl} className="hover:underline">
                  {title}
                </Link>
              </h3>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag: string) => (
                    <Link 
                      key={tag} 
                      href={`/tags/${tag}`}
                      className="text-xs px-2 py-0 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}