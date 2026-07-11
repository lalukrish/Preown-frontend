"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const PhoneCardSmall = ({
  index = 0,
  imageUrl,
  name,
  price,
  href,
  onCardClick,
  onBuyClick,
  color = "",
  storage = "",
  condition = "",
  isJustIn = true,
  originalPrice = null,
  oldPrice = null,
}) => {
  const { addToCart } = useCart();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onCardClick) onCardClick();
  };

  const strikePrice = oldPrice || originalPrice;
  const discount = strikePrice
    ? Math.round(((strikePrice - (price || 44999)) / strikePrice) * 100)
    : 18; // dummy fallback

  const actualPrice = Number(price || 44999);
  const emi = Math.round(actualPrice / 12);

  // dummy color dots if no color prop
  const colorDots = color ? [color] : ["#1f1f1f", "#e5e5e5", "#d4a373"];

  return (
    <motion.div
      className="relative  border border-gray-200 rounded-md p-3 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.1 overflow-hidden w-full"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Top row: badge + offer tag */}
      <div className="flex items-center justify-between mb-2">
        {isJustIn && (
          <span className="text-black bg-gray-200 text-[9px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-xl">
            Just In
          </span>
        )}
        <span className="ml-auto bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      </div>

      {/* Image */}
      <div className="flex justify-center items-center bg-gray-50 rounded-md py-2 mb-3">
        <img src={imageUrl} alt={name} className="h-32 object-contain" />
      </div>

      {/* Name */}
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug m-0 line-clamp-2">
        {name || "iPhone 15 Pro"}
      </h3>

      {/* Storage / condition */}
      {(storage || condition) && (
        <p className="text-[10px] text-gray-400 mt-0.5 mb-0">
          {[storage, condition].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Price row */}
      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[16px] font-semibold text-gray-900">
          ₹{actualPrice.toLocaleString("en-IN")}
        </span>
        {strikePrice && (
          <span className="text-[11px] text-gray-400 line-through">
            ₹{Number(strikePrice).toLocaleString("en-IN")}
          </span>
        )}
        {!strikePrice && (
          <span className="text-[11px] text-gray-400 line-through">
            ₹
            {(actualPrice + Math.round(actualPrice * 0.2)).toLocaleString(
              "en-IN",
            )}
          </span>
        )}
      </div>

      {/* EMI */}
      <p className="text-[10px] text-blue-600 mt-0.5 mb-0 font-medium">
        EMI from ₹{emi.toLocaleString("en-IN")}/mo
      </p>

      {/* Color dots */}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[10px] text-gray-400">Colors:</span>
        {colorDots.map((c, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full border border-gray-200 inline-block"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3">
        {href && (
          // <Link
          //   href={href}
          //   className="flex-1 text-center px-2 py-1.5 rounded-full border border-gray-300 text-gray-700 text-[11px] font-medium hover:border-gray-900 hover:text-gray-900 transition-colors no-underline"
          //   onClick={(e) => e.stopPropagation()}
          // >
          //   Details
          // </Link>
          <button
            onClick={() =>
              addToCart({
                id: "sss",
                name: "phone.name",
                price: "phone.price",
                image: "imageUrl",
              })
            }
            className="flex-1 text-center px-2 py-1.5 rounded-full border border-gray-300 text-gray-700 text-[11px] font-medium hover:border-gray-900 hover:text-gray-900 transition-colors no-underline"
          >
            Add to Cart
          </button>
        )}
        <button
          className="flex-1 px-2 py-1.5 rounded-full text-white text-[11px] font-medium bg-cyan-900 hover:from-[#1f1f1f] hover:to-black transition-all cursor-pointer border-none"
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

export default PhoneCardSmall;
