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

  // Updated CSS classes with reduced bottom padding
  const featuredContentClass = `
    featured-content mx-auto transition-all duration-300 ease-in-out
    w-full px-1 pb-4 pt-6
    sm:w-11/12 sm:px-2 sm:pt-4
    md:w-4/5 md:px-5 md:pb-8
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
      </div>

      {/* Card Grid - with true 1:1 scaling */}
      <div className="mt-8 mb-16">
        <div className="flex justify-center">
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 flex overflow-x-auto scrollbar-hide md:overflow-visible pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-6 snap-x snap-mandatory">
            {/* About Us Card */}
            <Link href="/about" className="card-wrapper min-w-[210px] md:min-w-0 mr-4 md:mr-0 snap-center">
              <div className="card-scalable">
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  {/* Background */}
                  <rect width="300" height="420" rx="12" fill="white" />
                  
                  {/* Text Content */}
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">About us</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#919191">click this card to learn</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#919191">more about us!</text>
                  
                  {/* Image/Illustration */}
                  <g transform="translate(25, 198) scale(0.45)">
                    <path d="M0 0h125.31v122.72H0zm0 159.48h125.31v123.79H0zm0 160.56h125.31v121.75H0zM162.08 0h228.76v122.72H162.08zm-7.878 177.051 226.248-33.813 18.297 122.43L172.5 299.483zm7.878 142.989h228.76v121.75H162.08zM427.61 0h126.78v122.72H427.61zm0 159.48h126.78v123.79H427.61zm0 160.56h126.78v121.75H427.61z" fill="#FF9CB1"/>
                  </g>
                </svg>
              </div>
            </Link>

            {/* Contact Us Card */}
            <Link href="/contact" className="card-wrapper min-w-[210px] md:min-w-0 mr-4 md:mr-0 snap-center">
              <div className="card-scalable">
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  {/* Background */}
                  <rect width="300" height="420" rx="12" fill="#2393e8" />
                  
                  {/* Text Content */}
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#ffffff">Contact us</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#e4eff7">click this card and let&apos;s</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#e4eff7">make something new!</text>
                  
                  {/* Image/Illustration */}
                  <g transform="translate(26, 175) scale(0.50)">
                    <path fill="#66dbff" d="M196.98 224.65h298.46v103.71H196.98zM0 336.61h395.36v103.71H0zM495.44 0v103.71h-23.91v49.23l-54.64-49.23H0V0z"/>
                    <path fill="#66dbff" d="M257.75 111.96v103.71H79.36L24.72 264.9v-49.23H0V111.96z"/>
                  </g>
                </svg>
              </div>
            </Link>

            {/* Gallery Card */}
            <Link href="/gallery" className="card-wrapper min-w-[210px] md:min-w-0 snap-center">
              <div className="card-scalable">
                <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className="card-svg">
                  {/* Background */}
                  <rect width="300" height="420" rx="12" fill="white" />
                  
                  {/* Text Content */}
                  <text x="24" y="45" fontFamily="sans-serif" fontSize="28" fontWeight="600" fill="#1D1D1F">Full Gallery</text>
                  <text x="24" y="74" fontFamily="sans-serif" fontSize="23" fill="#919191">click this card to view all</text>
                  <text x="24" y="96" fontFamily="sans-serif" fontSize="23" fill="#919191">our stuff!</text>
                  
                  {/* Image/Illustration */}
                  <g transform="translate(25, 221) scale(0.45)">
                    <path fill="#DAFF00" d="M554.39 0v158.99h-209.2v234.4H0v-234.4h209.19V0z"/>
                  </g>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .featured-content {
          transition: all 0.3s ease-in-out;
        }
        .card-wrapper {
          flex-shrink: 0;
          width: 100%;
          display: block;
          position: relative;
        }
        .card-scalable {
          width: 100%;
          position: relative;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }
        .card-svg {
          display: block;
          width: 100%;
          height: auto;
        }
        .card-scalable:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        @media (max-width: 767px) {
          .card-wrapper {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
}