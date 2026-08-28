"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const PremiumSection = () => {
  const videoRef = useRef(null);

  const handleExploreClick = (e) => {
    e.preventDefault();
    const section = document.getElementById("explore");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhatsapp = () => {
    window.open("https://wa.me/919995556734", "_blank");
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <div className="border border-gray-50 bg-gray-50 page-wrapper mx-auto">
      <div>
        <motion.section
          className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 md:px-16  py-16 md:py-24 "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Text */}
          <div className="flex-1 flex flex-col gap-3">
            <h1 className="text-2xl md:text-5xl lg:text-5xl font-normal text-gray-900 leading-tight">
              Own <span className="">Premium</span>{" "}
              <span className="text-cyan-800">Preowned</span> Devices{" "}
              <strong className="font-normal font-ubuntu">Trusted,</strong>{" "}
              <strong className="font-normal font-ubuntu">Verified,</strong>{" "}
              <strong className="font-normal font-ubuntu">Affordable</strong>
            </h1>

            <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
              Shop verified gadgets — up to 40% cheaper than new. 100%
              functional, quality-checked, and warranty-backed.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
              <a
                href="#explore"
                onClick={handleExploreClick}
                className="px-4 md:px-7 py-3 bg-cyan-900 hover:bg-cyan-950 text-white! text-xs md:text-sm font-semibold rounded-full transition-colors"
              >
                Explore Gadgets
              </a>
              <a
                href="#explore"
                onClick={handleWhatsapp}
                className="px-4 md:px-7 py-3 border-2 border-cyan-600 text-cyan-800 hover:bg-orange-50 text-xs md:text-sm font-semibold rounded-full transition-colors"
              >
                Sell Your Gadgets
              </a>
            </div>
          </div>

          {/* Video */}
          <div className="flex-1 w-full flex items-center justify-center">
            {/* <motion.video
            ref={videoRef}
            src="/hero_video.mp4"
            className="w-full max-w-lg rounded-2xl object-cover"
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          /> */}
            <Image
              src={"/eco.png"}
              alt="eco"
              width={200}
              height={200}
              className="w-full max-w-lg rounded-2xl object-cover"
            />
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default PremiumSection;
