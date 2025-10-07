"use client";

/**
 * Client-side utility to detect the current hostname
 * @returns The current hostname
 */
export function useHostname(): string {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return '';
}

/**
 * Client-side utility to get the site title based on the hostname
 * @returns The site title
 */
export function useSiteTitle(): string {
  const hostname = useHostname();
  
  if (hostname.includes('type.tax')) {
    return 'Type.tax';
  }
  
  if (hostname.includes('palace.ad')) {
    return 'Palace.ad';
  }
  
  return 'Palace';
}