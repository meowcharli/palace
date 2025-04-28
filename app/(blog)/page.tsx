'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FeaturedItemComponent from "./FeaturedItemComponent";
import type { GalleryItem } from "@/utils/types";
import Onboarding from "./onboarding";

export default function Page() {
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<GalleryItem[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsResponse, galleryResponse] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/gallery")
        ]);

        if (settingsResponse.ok && galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          setAllGalleryItems(galleryData);

          const featured = galleryData.filter((item: GalleryItem) => item.featured);
          setFeaturedItems(featured.length > 0 ? featured : galleryData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (featuredItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) =>
        prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [featuredItems]);

  if (loading) {
    return (
      <div className="container mx-auto px-5">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!allGalleryItems || allGalleryItems.length === 0) {
    return (
      <div className="container mx-auto px-5">
        <Onboarding />
      </div>
    );
  }

  const activeItem = featuredItems[currentFeaturedIndex];

  // Define CSS classes for responsive behavior with transitions
  const featuredContentClass = `
    featured-content max-w-4xl mx-auto mb-8 transition-all duration-300 ease-in-out
    w-full px-2 pb-12 pt-1
    sm:w-11/12 sm:px-4
    md:w-3/4 md:px-6 md:pb-28
    lg:w-3/5 lg:px-8
  `;

  return (
    <div className="container mx-auto px-5">
      <div className={featuredContentClass}>
        {activeItem && (
          <div className="relative">
            <FeaturedItemComponent item={activeItem} />
          </div>
        )}
  
        <div className="text-center mt-6">
          <Link
            href="/gallery"
            className="gallery-link text-white hover:underline text-lg"
          >
            Check out the entire gallery!
          </Link>
        </div>
      </div>

      {/* About Us Card - Fixed Size Business Card */}
      <div className="flex justify-center mb-16">
        <div 
          className="about-us-card bg-black border border-gray-800 rounded-xl p-3 relative w-full max-w-md" 
          style={{ aspectRatio: '3.5/2', width: '500px' }}
        >
          <span className="text-base text-gray-400 absolute top-3 left-3">→ about us</span>
          <div className="mt-6 text-gray-200">
            <p className="text-xl">
            type.tax is a design studio primarily based in serbia, working with creatives from all over the world. primarily focusing on visually creative projects in symbols and typography.
            </p>
            <p className="mt-8 text-xl">
              let's get in touch via c@type.tax!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .featured-content {
          transition: all 0.3s ease-in-out;
        }
        .about-us-card {
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 80%; /* Ensures it won't overflow on small screens */
        }
        @media (max-width: 400px) {
          .about-us-card {
            width: 50% !important; /* Overrides the fixed width on very small screens */
          }
        }
      `}</style>
    </div>
  );
}