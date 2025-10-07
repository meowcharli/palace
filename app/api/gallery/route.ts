import { NextResponse } from 'next/server';
import { sanityFetch } from "@/sanity/lib/fetch";
import { galleryItemsQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    let galleryItems = [];
    
    try {
      // Try to fetch real items, but don't fail if none exist
      galleryItems = await sanityFetch({
        query: galleryItemsQuery,
      });
    } catch (fetchError) {
      console.warn('No gallery items found in Sanity, using fallback data');
    }
    
    // If no items were found or an error occurred, return fallback items
    if (!galleryItems || galleryItems.length === 0) {
      galleryItems = [
        {
          _id: 'fallback-1',
          title: 'Sample Gallery Item',
          featured: true,
          order: 1,
          articleSlug: 'sample-post'
        }
      ];
    }
    
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error in gallery API route:', error);
    // Return empty array instead of error to prevent homepage from crashing
    return NextResponse.json([]);
  }
}