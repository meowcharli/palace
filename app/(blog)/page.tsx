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

      {/* Card Grid - replaces the About Us Card */}
      <div className="mt-8 mb-16">
        <div className="flex justify-center">
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 flex overflow-x-auto scrollbar-hide md:overflow-visible pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-6 snap-x snap-mandatory">
            {/* About Us Card */}
            <Link href="/about" className="card-link min-w-[210px] md:min-w-0 mr-4 md:mr-0 snap-center">
              <div className="card bg-white rounded-xl shadow-md flex flex-col h-full">
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-semibold text-[#1D1D1F]">About us</h3>
                  <p className="text-[#919191] mt-2 text-lg">click this card to learn more about us!</p>
                </div>
                <div className="illustration-container p-0 pb-14 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 554.39 441.79" className="w-3/5 h-auto">
                    <path d="M0 0h125.31v122.72H0zm0 159.48h125.31v123.79H0zm0 160.56h125.31v121.75H0zM162.08 0h228.76v122.72H162.08zm-7.878 177.051 226.248-33.813 18.297 122.43L172.5 299.483zm7.878 142.989h228.76v121.75H162.08zM427.61 0h126.78v122.72H427.61zm0 159.48h126.78v123.79H427.61zm0 160.56h126.78v121.75H427.61z" fill="#FF9CB1"/>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Contact Us Card */}
            <Link href="/contact" className="card-link min-w-[210px] md:min-w-0 mr-4 md:mr-0 snap-center">
              <div className="card bg-white rounded-xl shadow-md flex flex-col h-full">
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-semibold text-[#1D1D1F]">Contact us</h3>
                  <p className="text-[#919191] mt-2 text-lg">click this card and let&apos;s make something new!</p>
                </div>
                <div className="illustration-container p-0 pb-14 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495.44 440.32" className="w-3/5 h-auto">
                    <g>
                      <path fill="#07A1ED" d="M196.98 224.65h298.46v103.71H196.98zM0 336.61h395.36v103.71H0zM495.44 0v103.71h-23.91v49.23l-54.64-49.23H0V0z"/>
                      <path fill="#07A1ED" d="M257.75 111.96v103.71H79.36L24.72 264.9v-49.23H0V111.96z"/>
                    </g>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Gallery Card */}
            <Link href="/gallery" className="card-link min-w-[210px] md:min-w-0 snap-center">
              <div className="card bg-white rounded-xl shadow-md flex flex-col h-full">
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-semibold text-[#1D1D1F]">Full Gallery</h3>
                  <p className="text-[#919191] mt-2 text-lg">click this card to view all our stuff!</p>
                </div>
                <div className="illustration-container p-0 pb-14 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 554.39 393.39" className="w-3/5 h-auto">
                    <path fill="#DAFF00" d="M554.39 0v158.99h-209.2v234.4H0v-234.4h209.19V0z"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .featured-content {
          transition: all 0.3s ease-in-out;
        }
        .card {
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          height: 100%;
          aspect-ratio: 1/1.4;
          display: flex;
          flex-direction: column;
          background-color: #fff;
          position: relative;
          overflow: hidden;
        }
        .card-link {
          flex-shrink: 0;
          width: 100%;
        }
        .illustration-container {
          flex: 0 0 auto;
          margin-top: auto;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px rgba(255, 255, 255, 0.05);
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
          .card-link {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
}