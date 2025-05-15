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

  // Updated CSS classes with smaller desktop size and better mobile padding
  const featuredContentClass = `
    featured-content mx-auto mb-8 transition-all duration-300 ease-in-out
    w-full px-1 pb-12 pt-6
    sm:w-11/12 sm:px-2 sm:pt-4
    md:w-4/5 md:px-5 md:pb-24
    lg:w-1/2 lg:px-6
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
            className="gallery-link text-gray-700 hover:underline text-lg"
          >
            Check out the entire gallery!
          </Link>
        </div>
      </div>

{/* About Us Card - Responsive with better sizing */}
<div className="flex justify-center mb-36 mt-7 px-1">
  <div 
    className="about-us-card bg-white border border-gray-100 rounded-xl p-4 relative w-full"
  >
    <span className="text-base text-gray-400 absolute top-3 left-3">→ about us</span>
    <div className="mt-6 text-gray-700">
      <p className="text-xl">
        type.tax is a design studio primarily based in serbia, working with creatives from all over the world. primarily focusing on visually creative projects in symbols and typography.
      </p>
      <p className="mt-8 text-xl">
        let&apos;s get in touch via c@type.tax!
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
    width: 100%;
    max-width: 700px;
  }
  @media (min-width: 768px) {
    .about-us-card {
      padding: 1.5rem;
      min-height: 200px;
    }
  }
  @media (max-width: 767px) {
    .about-us-card {
      padding: 1.5rem 1rem;
      margin: 0 1rem;
    }
  }
`}</style>
    </div>
  );
}