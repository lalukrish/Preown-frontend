"use client";
import React from "react";
import styles from "./SellSection.module.css";
import { motion } from "framer-motion";

const SellSection = () => {
  const handleWhatsapp = () => {
    const phone = "919995556734";
    const message = encodeURIComponent("Hi, I want to sell my device.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="page-wrapper py-6">
      <motion.section
        className={`${styles.sellSection} `}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className={styles.heading}>Sell Your Device</h2>
        <p className="max-w-3xl mx-auto w-full text-center flex items-center justify-center mb-7 text-gray-600">
          Easily sell your devices through Preown. Get the best value for your
          old devices with a simple, hassle-free process. Free pickup and
          instant payment available.
        </p>
        <div className={styles.header}>
          {/* <motion.button
          className={"bg-cyan-800 px-3"}
          onClick={handleWhatsapp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Sell Now
        </motion.button> */}
          <button
            className="flex-1 mx-auto max-w-[120px] px-2 py-2 rounded-full text-white text-[11px] font-medium bg-cyan-900 hover:from-[#1f1f1f] hover:to-black transition-all cursor-pointer border-none"
            onClick={handleWhatsapp}
          >
            Buy Now
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default SellSection;
