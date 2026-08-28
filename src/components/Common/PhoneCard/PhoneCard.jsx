"use client";

import React from "react";

import { motion } from "framer-motion";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { FiInfo } from "react-icons/fi";

import { useCart } from "@/context/CartContext";

// keep this string identical to whatever key your BuyNowCheckoutPage reads
// from sessionStorage
const BUY_NOW_KEY = "buy_now_item";

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

  id,

  documentId,

  imageUrl,

  name,

  price,

  href,

  onCardClick,

  color = "",

  storage = "",

  condition = "",

  brand = "",

  category = "",

  isJustIn = false,

  originalPrice = null,

  oldPrice = null,
}) => {
  const { addToCart } = useCart();

  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onCardClick) onCardClick();
  };

  const strikePrice = oldPrice || originalPrice;
  const actualPrice = Number(price || 44999);
  const discount = strikePrice
    ? Math.round(((strikePrice - actualPrice) / strikePrice) * 100)
    : 18; // dummy fallback
  const emi = Math.round(actualPrice / 12);

  // dummy color dots if no color prop
  const colorDots = color ? [color] : ["#1f1f1f", "#e5e5e5", "#d4a373"];

  const buildCartItem = () => ({
    id: id || href,

    documentId,

    name,

    price: actualPrice,

    mrp: Number(strikePrice || actualPrice),

    image: imageUrl,

    color,

    storage,

    condition,

    brand,

    category,
  });

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // same shape as the working small-card reference — id, name, price, image
    addToCart({
      id: id || href,
      name,
      price: actualPrice,
      image: imageUrl,
    });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    try {
      sessionStorage.setItem(
        BUY_NOW_KEY,

        JSON.stringify({ ...buildCartItem(), qty: 1 }),
      );
    } catch (err) {
      console.error("failed to stash buy-now item:", err);
    }

    router.push("/checkout/buy-now"); // adjust to your actual BuyNowCheckoutPage route
  };

  return (
    <motion.div
      className="relative bg-white border border-gray-100 rounded-[20px] px-6 py-8 flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 overflow-hidden"
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
      {/* Top row: badge + offer tag */}
      <div className="w-full flex items-center justify-between mb-2">
        {isJustIn ? (
          <span className="text-black bg-gray-200 text-[10px] font-medium uppercase tracking-wide px-2.5 py-0.5 rounded-xl">
            Just In
          </span>
        ) : (
          <span />
        )}
        <span className="bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      </div>

      {/* Image */}
      <div className="w-full flex justify-center items-center bg-gray-50 rounded-md py-2 mb-3">
        <img src={imageUrl} alt={name} className="h-40 object-contain" />
      </div>

      {/* Name */}
      <h3 className="font-medium text-base text-gray-900 m-0 text-center leading-snug">
        {name || "iPhone 15 - Pre-Owned"}
      </h3>

      {/* Storage / condition */}
      {(storage || condition) && (
        <p className="text-[0.8rem] text-gray-400 mt-1 mb-0 text-center">
          {[storage, condition].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Price */}
      <div className="mt-4 mb-1 flex items-baseline gap-2 justify-center">
        <span className="text-[14px] font-semibold text-gray-900">
          ₹{actualPrice.toLocaleString("en-IN")}
        </span>

        {strikePrice ? (
          <span className="text-[13px] text-gray-400 line-through">
            ₹{Number(strikePrice).toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-[13px] text-gray-400 line-through">
            ₹
            {(actualPrice + Math.round(actualPrice * 0.2)).toLocaleString(
              "en-IN",
            )}
          </span>
        )}
      </div>

      {/* EMI */}
      {/* <p className="text-[11px] text-blue-600 mt-0.5 mb-2 font-medium">
        EMI from ₹{emi.toLocaleString("en-IN")}/mo
      </p> */}

      {/* Color dots */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-[11px] text-gray-400">Colors:</span>
        {colorDots.map((c, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full border border-gray-200 inline-block"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 w-full mt-auto">
        <button
          className="flex-1 text-center px-2 py-1.5 rounded-full border border-gray-300 text-gray-700 text-[11px] font-medium hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <button
          className="flex-1 px-2 py-1.5 rounded-full text-white text-[11px] font-medium bg-cyan-900 hover:from-[#1f1f1f] hover:to-black transition-all cursor-pointer border-none"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>

      {/* {href && (
        <Link
          href={href}
          className="mt-3 flex items-center justify-center gap-1.5 text-gray-500 text-[0.75rem] font-medium hover:text-gray-900 no-underline"
          onClick={(e) => e.stopPropagation()}
        >
          <FiInfo size={13} />
          View Details
        </Link>
      )} */}
    </motion.div>
  );
};

export default PhoneCard;
