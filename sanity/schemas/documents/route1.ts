import { NextResponse } from 'next/server';
import { sanityFetch } from "@/sanity/lib/fetch";
import { galleryItemsQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    const galleryItems = await sanityFetch({
      query: galleryItemsQuery,
    });
    
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}