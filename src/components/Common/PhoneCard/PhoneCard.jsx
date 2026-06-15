// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { FiInfo } from "react-icons/fi";
// import styles from "./PhoneCard.module.css";

// const cardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.15 },
//   }),
// };

// const PhoneCard = ({
//   index = 0,
//   imageUrl,
//   name,
//   price,
//   href,
//   onCardClick,
//   onBuyClick,
//   // Optional extra meta – for now we show nice demo defaults
//   color = "",
//   storage = "",
//   condition = "",
//   isJustIn = true,
//   originalPrice = null,
//   oldPrice = null,
// }) => {
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && onCardClick) {
//       onCardClick();
//     }
//   };

//   return (
//     <motion.div
//       className={styles.card}
//       custom={index}
//       variants={cardVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.2 }}
//       transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
//       onClick={onCardClick}
//       role="button"
//       tabIndex={0}
//       onKeyDown={handleKeyDown}
//     >
//       {isJustIn && <span className={styles.badge}>Just In</span>}

//       <img src={imageUrl} alt={name} className={styles.image} />

//       <h3 className={styles.name}>{name || "iPhone 15 - Pre-Owned"}</h3>

//       <p className={styles.subtitle}>
//         {color} - {storage} | {condition}
//       </p>

//       <div className={styles.priceBlock}>
//         {/* <span className={styles.priceLabel}>Starting at</span> */}
//         <div className={styles.priceRow}>
//           <span className={styles.currentPrice}>
//             ₹{Number(price || 44999).toLocaleString("en-IN")}
//           </span>
//           {(oldPrice || originalPrice) && (
//             <span className={styles.originalPrice}>
//               ₹{Number(oldPrice || originalPrice).toLocaleString("en-IN")}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className={styles.buttons}>
//         {href && (
//           <Link
//             href={href}
//             className={styles.learnBtn}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <FiInfo className={styles.buttonIcon} />
//             Details
//           </Link>
//         )}

//         <button
//           className={styles.buyBtn}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (onBuyClick) onBuyClick();
//           }}
//         >
//           Buy Now
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default PhoneCard;

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiInfo } from "react-icons/fi";

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
  color = "",
  storage = "",
  condition = "",
  isJustIn = true,
  originalPrice = null,
  oldPrice = null,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onCardClick) onCardClick();
  };

  return (
    <motion.div
      className="relative bg-white border border-gray-100 rounded-[20px] px-6 py-12 flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 overflow-hidden"
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
      {/* Badge */}
      {isJustIn && (
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
          Just In
        </span>
      )}

      {/* Image */}
      <img src={imageUrl} alt={name} className="h-40 object-contain mb-5" />

      {/* Name */}
      <h3 className="font-medium text-base text-gray-900 m-0 text-center leading-snug">
        {name || "iPhone 15 - Pre-Owned"}
      </h3>

      {/* Subtitle */}
      {(color || storage || condition) && (
        <p className="text-[0.8rem] text-gray-400 mt-1 mb-0 text-center">
          {[color, storage, condition].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Price */}
      <div className="mt-5 mb-4 flex items-baseline gap-2 justify-center">
        <span className="text-[14px] font-semibold text-gray-900">
          ₹{Number(price || 44999).toLocaleString("en-IN")}
        </span>
        {(oldPrice || originalPrice) && (
          <span className="text-[13px] text-gray-400 line-through">
            ₹{Number(oldPrice || originalPrice).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full mt-auto">
        {href && (
          <Link
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-[0.8rem] font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-900 hover:text-gray-900 hover:-translate-y-px no-underline"
            onClick={(e) => e.stopPropagation()}
          >
            <FiInfo size={14} />
            Details
          </Link>
        )}

        <button
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border-none text-white text-[0.8rem] font-medium bg-gradient-to-br from-[#0558ab] to-[#035ab0] transition-all duration-200 hover:from-[#1f1f1f] hover:to-black hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer"
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
