import { sanityFetch as originalSanityFetch } from '@/sanity/lib/fetch';

/**
 * A wrapper around sanityFetch that handles errors gracefully
 * and returns a default value if the query fails
 */
export async function safeSanityFetch<T>({
  query,
  params = {},
  defaultValue = null,
  logErrors = true
}: {
  query: string;
  params?: any;
  defaultValue?: T | null;
  logErrors?: boolean;
}): Promise<T | null> {
  try {
    return await originalSanityFetch({ query, params });
  } catch (error) {
    if (logErrors) {
      console.warn('Sanity query failed, using fallback data:', error);
    }
    return defaultValue;
  }
}