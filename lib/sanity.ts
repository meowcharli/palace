import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Configure the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Ensure this matches your .env.local file
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Ensure this matches your .env.local file
  apiVersion: "2023-05-03", // Use the latest API version
  useCdn: true, // Enable the CDN for faster responses
});

// Create a URL builder for images
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export function urlFor(source: any) {
  return builder.image(source);
}
