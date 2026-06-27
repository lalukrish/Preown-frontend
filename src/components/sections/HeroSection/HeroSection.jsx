"use client";
import React, { useEffect, useRef } from "react";
import BannerCarousel from "./Banner-carousel";
import OwnPreownedSection from "../OwnPreownedSection/OwnPreownedSection";
import FeaturedSection from "../FeaturedSection/FeaturedSection";
import ScrollRightSection from "../landing/scrollRight";

const HeroSection = () => {
  const videoRef = useRef(null);

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

  return (
    <>
      <BannerCarousel
        slides={[
          {
            id: 1,
            img: "/banner3.jpg",
            href: "/products?category=smartphones",
          },

          { id: 2, img: "/banner2.jpg", href: "/products?category=laptops" },
          { id: 3, img: "/banner1.jpg", href: "https://wa.me/919995556734" },
        ]}
        height="35vh"
      />
      <OwnPreownedSection />

      {/* <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className={styles.textContent}>
          <h1 className="">
            Own Premium test data
            <span className={styles.highlight}> Preowned </span> Devices{" "}
            <strong> Trusted ,</strong> <strong>Verified ,</strong>{" "}
            <strong>Affordable</strong>
          </h1>
          <p className={styles.pricing}>
            Shop verified gadgets — up to 40% cheaper than new. 100% functional
            quality-checked, and warranty-backed.<sup></sup>
          </p>

          <span className={styles.buttons}>
            <a
              href="#explore"
              className={styles.buttonFilled}
              onClick={handleExploreClick}
            >
              Explore Gadgets
            </a>

            <a
              href="#explore"
              className={styles.buttonOutlined}
              onClick={handleWhatsapp}
            >
              Sell Your Gadgets
            </a>
          </span>
        </div>
        <div className={styles.imageContainer}>
          <motion.video
            ref={videoRef}
            src="/hero_video.mp4"
            className={styles.image}
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        </div>
      </motion.section> */}
      <ScrollRightSection featured={true} />
      <ScrollRightSection featured={true} />

      <FeaturedSection featured={true} />
    </>
  );
};

export default HeroSection;
