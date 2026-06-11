"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiInfo } from "react-icons/fi";
import styles from "./PhoneCard.module.css";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

const PhoneCard = ({
  index = 0,
  imageUrl,
  name,
  price,
  href,
  onCardClick,
  onBuyClick,
  // Optional extra meta – for now we show nice demo defaults
  color = "",
  storage = "",
  condition = "",
  isJustIn = true,
  originalPrice = null,
  oldPrice = null,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onCardClick) {
      onCardClick();
    }
  };

  return (
    <motion.div
      className={styles.card}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {isJustIn && <span className={styles.badge}>Just In</span>}

      <img src={imageUrl} alt={name} className={styles.image} />

      <h3 className={styles.name}>{name || "iPhone 15 - Pre-Owned"}</h3>

      <p className={styles.subtitle}>
        {color} - {storage} | {condition}
      </p>

      <div className={styles.priceBlock}>
        {/* <span className={styles.priceLabel}>Starting at</span> */}
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>
            ₹{Number(price || 44999).toLocaleString("en-IN")}
          </span>
          {(oldPrice || originalPrice) && (
            <span className={styles.originalPrice}>
              ₹{Number(oldPrice || originalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      <div className={styles.buttons}>
        {href && (
          <Link
            href={href}
            className={styles.learnBtn}
            onClick={(e) => e.stopPropagation()}
          >
            <FiInfo className={styles.buttonIcon} />
            Learn More
          </Link>
        )}

        <button
          className={styles.buyBtn}
          onClick={(e) => {
            e.stopPropagation();
            if (onBuyClick) onBuyClick();
          }}
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
};

export default PhoneCard;


