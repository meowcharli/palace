import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: {
    asset: {
      _ref: string;
    };
  };
}

/**
 * Search for posts in Sanity using a simple text query
 */
export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query) {
    return [];
  }

  // Sanitize the query to prevent injection
  const sanitizedQuery = query.trim().replace(/[*+~.()'"!:@]/g, '');
  
  if (!sanitizedQuery) {
    return [];
  }

  // Build the GROQ query with text search
  const searchQuery = `
    *[_type == "post" && defined(slug.current) && (
      title match "*${sanitizedQuery}*" || 
      excerpt match "*${sanitizedQuery}*" || 
      pt::text(content) match "*${sanitizedQuery}*"
    )] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "publishedAt": coalesce(publishedAt, _createdAt),
      "mainImage": coverImage
    } | order(publishedAt desc)[0...20]
  `;

  try {
    const results = await client.fetch<SearchResult[]>(searchQuery);
    return results;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
