// app/api/showcase/route.ts
import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { showcaseQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    let showcaseItems = [];
    
    try {
      // Try to fetch real items, but don't fail if none exist
      showcaseItems = await sanityFetch({
        query: showcaseQuery,
      });
    } catch (fetchError) {
      console.warn('No showcase items found in Sanity, using fallback data');
    }
    
    // If no items were found or an error occurred, return fallback items
    if (!showcaseItems || showcaseItems.length === 0) {
      showcaseItems = [
        {
          _id: 'fallback-showcase-1',
          title: 'Sample Showcase Item',
          description: 'This is a sample showcase item',
          image: null
        }
      ];
    }
    
    return NextResponse.json(showcaseItems);
  } catch (error) {
    console.error("Error in showcase API route:", error);
    // Return empty array instead of error to prevent homepage from crashing
    return NextResponse.json([]);
  }
}