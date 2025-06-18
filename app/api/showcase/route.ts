// app/api/showcase/route.ts
import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { showcaseQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    const showcaseItems = await sanityFetch({
      query: showcaseQuery,
    });
    
    return NextResponse.json(showcaseItems);
  } catch (error) {
    console.error("Error fetching showcase items:", error);
    return NextResponse.json(
      { error: "Failed to fetch showcase items" },
      { status: 500 }
    );
  }
}