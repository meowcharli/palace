'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FeaturedItemComponent from "./FeaturedItemComponent";
import type { GalleryItem } from "@/utils/types";
import Onboarding from "./onboarding";

export default function Page() {
  const [settings, setSettings] = useState<any>(null);
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<GalleryItem[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const settingsResponse = await fetch("/api/settings");
        const galleryResponse = await fetch("/api/gallery");

        if (settingsResponse.ok && galleryResponse.ok) {
          const settingsData = await settingsResponse.json();
          const galleryData = await galleryResponse.json();

          setSettings(settingsData);
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

  return (
    <div className="container mx-auto px-5">
      <div
        className="featured-content max-w-4xl mx-auto mb-8"
        style={{
          paddingTop: '12px',
          paddingBottom: '200px',
          paddingLeft: '0px', // Adjust the left padding
          paddingRight: '0px', // Adjust the right padding
        }}
      >
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
    </div>
  );
}