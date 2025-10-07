// sanity/lib/utils.ts - FIXED VERSION
import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/lib/api";

// Ensure project ID and dataset are available
const sanityProjectId = projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const sanityDataset = dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || "";

if (!sanityProjectId || !sanityDataset) {
  console.error(
    "Missing Sanity project ID or dataset. Check your environment variables.",
    { projectId: sanityProjectId, dataset: sanityDataset }
  );
}

// Create the image URL builder with explicit configuration
export const imageBuilder = createImageUrlBuilder({
  projectId: sanityProjectId,
  dataset: sanityDataset,
});

/**
 * Generate URL for a Sanity image
 * @param source The image source object from Sanity
 * @returns Image URL builder or undefined if source is invalid
 */
export const urlForImage = (source: any) => {
  // Log debugging information
  if (process.env.NODE_ENV !== "production") {
    console.log("urlForImage called with:", JSON.stringify(source, null, 2));
    console.log("Using project:", sanityProjectId, "dataset:", sanityDataset);
  }

  // Validation check for image source
  if (!source?.asset?._ref) {
    console.warn("Invalid image source:", source);
    return undefined;
  }

  try {
    // Use a more robust approach to building the image URL
    return imageBuilder.image(source).auto("format").fit("max");
  } catch (error) {
    console.error("Error building image URL:", error);
    return undefined;
  }
};

/**
 * Get the site title based on the current domain
 * @param settings The settings object from Sanity
 * @param domain The current domain
 * @returns The title for the current domain or default title
 */
export function getTitleForDomain(settings: any, domain?: string): string {
  if (!domain || !settings) {
    return settings?.title || "Palace";
  }

  // Normalize domain by removing www. prefix and http/https
  const normalizedDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0] // Get just the domain part
    .split(':')[0]; // Remove port if present

  // Debug
  if (process.env.NODE_ENV !== "production") {
    console.log(`Domain check: ${normalizedDomain}`);
  }

  // Define specific domain mappings
  if (normalizedDomain.includes('type.tax')) {
    return 'Type.tax';
  }
  
  if (normalizedDomain.includes('palace.ad')) {
    return 'Palace.ad';
  }

  // Look for a matching domain in domainTitles from Sanity
  const domainSpecificTitle = settings.domainTitles?.find(
    (dt: { domain: string; title: string }) => 
      dt.domain.toLowerCase() === normalizedDomain.toLowerCase()
  );

  // Return domain-specific title if found, otherwise default title
  return domainSpecificTitle?.title || settings.title || "Palace";
}

/**
 * Helper function to directly create a Sanity image URL from an asset reference
 * This is useful as a fallback when the standard approach fails
 */
export const createDirectImageUrl = (assetRef: string): string | undefined => {
  if (!assetRef) return undefined;
  
  try {
    // Extract image ID and format from reference
    // Format is typically like: image-a1b2c3d4e5f6-800x600-jpg
    const refParts = assetRef.replace('image-', '').split('-');
    const imageId = refParts[0];
    const format = refParts[refParts.length - 1];
    
    // Construct direct URL to Sanity CDN
    return `https://cdn.sanity.io/images/${sanityProjectId}/${sanityDataset}/${imageId}.${format}`;
  } catch (error) {
    console.error("Failed to create direct image URL:", error);
    return undefined;
  }
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  
  try {
    const url = urlForImage(image)?.width(width).height(height).fit("crop").url();
    if (!url) {
      console.warn("Could not generate Open Graph image URL");
      return;
    }
    return { url, alt: image?.alt as string, width, height };
  } catch (error) {
    console.error("Error resolving Open Graph image:", error);
    return;
  }
}

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/posts/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
