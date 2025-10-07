import { sanityFetch } from "@/sanity/lib/fetch";

export async function GET() {
  // Query to get all featured posts
  const featuredPostsQuery = `*[_type == "post" && featured == true] {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "date": publishedAt
  } | order(publishedAt desc)`;
  
  // Query to get latest posts
  const latestPostsQuery = `*[_type == "post"] {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "date": publishedAt
  } | order(publishedAt desc)[0...6]`;
  
  try {
    const featuredPosts = await sanityFetch({
      query: featuredPostsQuery
    });
    
    const latestPosts = await sanityFetch({
      query: latestPostsQuery
    });
    
    return new Response(
      JSON.stringify({ 
        featuredPosts: featuredPosts || [], 
        latestPosts: latestPosts || [] 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch posts",
        featuredPosts: [],
        latestPosts: []
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}