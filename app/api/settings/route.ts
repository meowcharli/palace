import { NextResponse } from 'next/server';
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    let settings = null;
    
    try {
      // Try to fetch real settings, but don't fail if none exist
      settings = await sanityFetch({
        query: settingsQuery,
      });
    } catch (fetchError) {
      console.warn('No settings found in Sanity, using fallback data');
    }
    
    // If no settings were found or an error occurred, return fallback settings
    if (!settings) {
      settings = {
        title: "Palace",
        description: [{ _type: "block", children: [{ _type: "span", text: "A modern web platform" }] }],
        ogImage: null
      };
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error in settings API route:', error);
    // Return basic settings instead of error to prevent site from crashing
    return NextResponse.json({
      title: "Palace",
      description: [{ _type: "block", children: [{ _type: "span", text: "A modern web platform" }] }]
    });
  }
}