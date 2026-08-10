"use client";
import React, { useEffect, useRef, useState } from "react";
import BannerCarousel from "./Banner-carousel";
import OwnPreownedSection from "../OwnPreownedSection/OwnPreownedSection";
import FeaturedSection from "../FeaturedSection/FeaturedSection";
import ScrollRightSection from "../landing/scrollRight";
import TopOffersSection from "@/components/landing/topOffers";

const STRAPI_BASE = "https://backapp.preown.store";

// fallback slides in case API fails or returns empty
const FALLBACK_SLIDES = [
  { id: 1, img: "/banner3.jpg", href: "/products?category=smartphones" },
  { id: 2, img: "/banner2.jpg", href: "/products?category=laptops" },
  { id: 3, img: "/banner1.jpg", href: "https://wa.me/919995556734" },
];

const HeroSection = () => {
  const videoRef = useRef(null);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [bannersReady, setBannersReady] = useState(false);

  const handleExploreClick = (e) => {
    e.preventDefault();
    const section = document.getElementById("explore");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsapp = () => {
    const phone = "919995556734";
    const message = encodeURIComponent("Hi, I want to sell my device.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `https://backapp.preown.store/api/hero-banners?populate=*`, // adjust endpoint path if different
        );
        if (!res.ok) throw new Error("Failed to fetch banners");
        const json = await res.json();

        console.log("RAW banner response:", json); // remove once shape confirmed

        const raw = json.data || [];
        if (raw.length === 0) return; // keep fallback

        const normalized = raw.map((b) => {
          // ⚠️ TEMP: adjust field name once confirmed (b.Banner, b.Image, b.BannerImage, etc.)
          const mediaUrl =
            b.Banner?.url ||
            b.Image?.url ||
            b.BannerImage?.url ||
            b.attributes?.Banner?.data?.attributes?.url; // classic Strapi v4 nested shape

          return {
            id: b.id,
            img: mediaUrl
              ? mediaUrl.startsWith("http")
                ? mediaUrl
                : `${STRAPI_BASE}${mediaUrl}`
              : null,
            href: b.RedirectionLink || "#",
            name: b.BannerName,
          };
        });

        // drop any banner that resolved to no image so carousel doesn't break
        const valid = normalized.filter((s) => s.img);
        if (valid.length > 0) setSlides(valid);
      } catch (err) {
        console.error("fetchBanners error:", err);
        // fallback slides stay in place
      } finally {
        setBannersReady(true);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
      <BannerCarousel slides={slides} height="35vh" />
      <OwnPreownedSection />

      <ScrollRightSection featured={true} isJustIn={true} />
      <TopOffersSection />

      <ScrollRightSection
        featured={true}
        cardProperties="bg-gradient-to-br from-white via-[#EAF8FC] to-[#ADD8E6]"
        isJustIn={false}
      />
      <FeaturedSection featured={true} />
    </>
  );
};

export default HeroSection;
