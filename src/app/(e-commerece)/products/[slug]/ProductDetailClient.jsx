// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import styles from "./ProductDetail.module.css";
// import { STRAPI_IMAGE_BASE_URL } from "@/utils/config";
// import { useCart } from "@/context/CartContext";

// export const BUY_NOW_KEY = "buy_now_item";

// // ProductImagesAndVideos is an array of Strapi media objects
// const getAllImages = (product) => {
//   const media = product?.ProductImagesAndVideos;
//   if (!media || !Array.isArray(media)) return [];
//   // keep only images (in case a video ever ends up in this field)
//   return media.filter((m) => !m.mime || m.mime.startsWith("image"));
// };

// const getImageUrl = (item) => {
//   if (!item) return "/placeholder.jpg";
//   const path =
//     item?.formats?.medium?.url ||
//     item?.formats?.small?.url ||
//     item?.formats?.thumbnail?.url ||
//     item?.url;
//   return path ? `https://backapp.preown.store${path}` : "/placeholder.jpg";
// };

// export default function ProductDetailClient({ product }) {
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [buyingNow, setBuyingNow] = useState(false);

//   const allImages = getAllImages(product);
//   const images =
//     allImages.length > 0 ? allImages : [{ url: "/placeholder.jpg" }];
//   const imageUrl = getImageUrl(images[selectedImageIndex]);

//   const name = product?.ProductName || "Pre-owned Device";
//   const currentPrice = product?.TotalPriceWithGST || 0;
//   const originalPrice = product?.MRP || 0;
//   const discount = originalPrice
//     ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
//     : 0;

//   const specs = [
//     { label: "Brand", value: product?.Brand },
//     { label: "Color", value: product?.Color },
//     {
//       label: "Storage",
//       value: product?.Storage ? `${product.Storage} GB` : null,
//     },
//     { label: "RAM", value: product?.RAM ? `${product.RAM} GB` : null },
//     { label: "Condition", value: product?.Condition },
//     { label: "Screen", value: product?.ScreenSizewithRefreshRate },
//     { label: "Processor", value: product?.Processor },
//     { label: "OS", value: product?.OS },
//     { label: "Network", value: product?.NetworkSupport },
//     { label: "Year", value: product?.ProductYear },
//     {
//       label: "Warranty",
//       value: product?.ShopWarrentyInDays
//         ? `${product.ShopWarrentyInDays} days`
//         : null,
//     },
//   ].filter((s) => s.value !== null && s.value !== undefined && s.value !== "");

//   // shared shape — used by both Add to Cart (context) and Buy Now (sessionStorage)
//   const buildCartItem = () => ({
//     id: product?.id,
//     documentId: product?.documentId,
//     name,
//     price: Number(currentPrice),
//     mrp: Number(originalPrice),
//     image: images[0] ? getImageUrl(images[0]) : null,
//     brand: product?.Brand,
//     category: product?.ProductCategory,
//     condition: product?.Condition,
//     soldOut: product?.SoldOutStatus,
//     color: product?.Color,
//     storage: product?.Storage,
//     ram: product?.RAM,
//     year: product?.ProductYear,
//     qty: 1,
//   });

//   // Add to Cart → normal cart flow via CartContext (server cart if logged in, guest cart otherwise)
//   const handleAddToCart = async () => {
//     if (addingToCart || !product?.id) return;
//     setAddingToCart(true);
//     try {
//       await addToCart(buildCartItem());
//     } catch (err) {
//       console.error("Add to cart failed:", err);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   // Buy Now → skip cart entirely. Stash single item in sessionStorage,
//   // /checkout/buy-now page reads it straight from there.
//   // Guest can still land on that page and see details — login only gated
//   // on the actual Place Order / Add address actions there.
//   const handleBuyNow = () => {
//     if (buyingNow || !product?.id) return;
//     setBuyingNow(true);
//     try {
//       sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(buildCartItem()));
//       router.push("/checkout/buy-now");
//     } finally {
//       setBuyingNow(false);
//     }
//   };

//   const handleThumbnailClick = (index) => setSelectedImageIndex(index);
//   const handlePrevImage = () =>
//     setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
//   const handleNextImage = () =>
//     setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

//   return (
//     <motion.div
//       className={`${styles.productDetail} page-wrapper py-10! md:py-16!`}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <button onClick={() => router.back()} className={styles.backButton}>
//         <FiArrowLeft /> Back
//       </button>

//       <div className={styles.productContainer}>
//         {/* Left Section - Product Images */}
//         <div className={styles.imageSection}>
//           <div className={styles.mainImageContainer}>
//             <motion.img
//               key={selectedImageIndex}
//               src={imageUrl}
//               alt={name}
//               className={styles.productImage}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>

//           {images.length > 1 && (
//             <div className={styles.thumbnailCarousel}>
//               <button
//                 className={styles.carouselArrow}
//                 onClick={handlePrevImage}
//                 aria-label="Previous image"
//               >
//                 <FiChevronLeft />
//               </button>

//               <div className={styles.thumbnailContainer}>
//                 {images.slice(0, 4).map((img, index) => (
//                   <img
//                     key={img.id || index}
//                     src={getImageUrl(img)}
//                     alt={`${name} - View ${index + 1}`}
//                     className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ""}`}
//                     onClick={() => handleThumbnailClick(index)}
//                   />
//                 ))}
//               </div>

//               <button
//                 className={styles.carouselArrow}
//                 onClick={handleNextImage}
//                 aria-label="Next image"
//               >
//                 <FiChevronRight />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Right Section - Product Details */}
//         <div className={styles.infoSection}>
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <h1 className={styles.productName}>{name}</h1>

//             <div className={styles.pricingSection}>
//               <div className={styles.priceRow}>
//                 <span className={styles.currentPrice}>
//                   ₹ {Number(currentPrice).toLocaleString("en-IN")}
//                 </span>
//                 {originalPrice > 0 && (
//                   <>
//                     <span className={styles.originalPrice}>
//                       ₹ {Number(originalPrice).toLocaleString("en-IN")}
//                     </span>
//                     {discount > 0 && (
//                       <span
//                         className={"bg-green-700 text-white p-2 rounded-xs"}
//                       >
//                         {discount}% off
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Mobile action row */}
//             <div className="flex justify-center gap-3 md:hidden mb-8">
//               <button
//                 className="border border-cyan-950 text-cyan-950 flex flex-1 max-w-[160px] justify-center hover:bg-cyan-50 px-4 py-3.5 mt-3 items-center text-[16px] rounded-xs font-normal mb-2.5 cursor-pointer whitespace-nowrap!"
//                 onClick={handleAddToCart}
//                 disabled={addingToCart}
//               >
//                 {addingToCart ? "Adding..." : "Add to Cart"}
//               </button>
//               <button
//                 className="bg-black flex flex-1 max-w-[160px] justify-center hover:bg-cyan-900 px-4 py-3.5 mt-3 items-center text-[16px] rounded-xs shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal mb-2.5 text-white cursor-pointer whitespace-nowrap!"
//                 onClick={handleBuyNow}
//                 disabled={buyingNow}
//               >
//                 {buyingNow ? "..." : "Buy Now"}
//               </button>
//             </div>

//             {/* Specs */}
//             {specs.length > 0 && (
//               <div className={styles.optionGroup}>
//                 <label className={styles.optionLabel}>Specifications</label>
//                 <div className={styles.optionButtons}>
//                   {specs.map((spec) => (
//                     <span key={spec.label} className={styles.optionButton}>
//                       <strong>{spec.label}:</strong>&nbsp;{spec.value}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Desktop action row */}
//             <div className="hidden md:flex justify-start gap-3">
//               <button
//                 className="border border-cyan-950 text-cyan-950 flex w-[200px] justify-center hover:bg-cyan-50 px-4 py-3.5 mt-3 items-center text-[20px] rounded-xs font-normal mb-2.5 cursor-pointer whitespace-nowrap!"
//                 onClick={handleAddToCart}
//                 disabled={addingToCart}
//               >
//                 {addingToCart ? "Adding..." : "Add to Cart"}
//               </button>
//               <button
//                 className="bg-black flex w-[200px] justify-center hover:bg-cyan-900 px-4 py-3.5 mt-3 items-center text-[20px] rounded-xs shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal mb-2.5 text-white cursor-pointer whitespace-nowrap!"
//                 onClick={handleBuyNow}
//                 disabled={buyingNow}
//               >
//                 {buyingNow ? "..." : "Buy Now"}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export const BUY_NOW_KEY = "buy_now_item";

// ProductImagesAndVideos is an array of Strapi media objects
const getAllImages = (product) => {
  const media = product?.ProductImagesAndVideos;
  if (!media || !Array.isArray(media)) return [];
  // keep only images (in case a video ever ends up in this field)
  return media.filter((m) => !m.mime || m.mime.startsWith("image"));
};

// large first so the big gallery stays sharp
const getImageUrl = (item) => {
  if (!item) return "/placeholder.jpg";
  const path =
    item?.formats?.large?.url ||
    item?.formats?.medium?.url ||
    item?.formats?.small?.url ||
    item?.formats?.thumbnail?.url ||
    item?.url;
  return path ? `https://backapp.preown.store${path}` : "/placeholder.jpg";
};

const WHATSAPP_CHAT_LINK =
  "https://chat.whatsapp.com/EYnQKnUhFQhL8VdB9pQNIs?mode=ac_t";

export default function ProductDetailClient({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const allImages = getAllImages(product);
  const images =
    allImages.length > 0 ? allImages : [{ url: "/placeholder.jpg" }];
  const imageUrl = getImageUrl(images[selectedImageIndex]);

  const name = product?.ProductName || "Pre-owned Device";
  const currentPrice = product?.TotalPriceWithGST || 0;
  const originalPrice = product?.MRP || 0;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const specs = [
    { label: "Brand", value: product?.Brand },
    { label: "Color", value: product?.Color },
    {
      label: "Storage",
      value: product?.Storage ? `${product.Storage} GB` : null,
    },
    { label: "RAM", value: product?.RAM ? `${product.RAM} GB` : null },
    { label: "Condition", value: product?.Condition },
    { label: "Screen", value: product?.ScreenSizewithRefreshRate },
    { label: "Processor", value: product?.Processor },
    { label: "OS", value: product?.OS },
    { label: "Network", value: product?.NetworkSupport },
    { label: "Year", value: product?.ProductYear },
    {
      label: "Warranty",
      value: product?.ShopWarrentyInDays
        ? `${product.ShopWarrentyInDays} days`
        : null,
    },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== "");

  // shared shape — used by both Add to Cart (context) and Buy Now (sessionStorage)
  const buildCartItem = () => ({
    id: product?.id,
    documentId: product?.documentId,
    name,
    price: Number(currentPrice),
    mrp: Number(originalPrice),
    image: images[0] ? getImageUrl(images[0]) : null,
    brand: product?.Brand,
    category: product?.ProductCategory,
    condition: product?.Condition,
    soldOut: product?.SoldOutStatus,
    color: product?.Color,
    storage: product?.Storage,
    ram: product?.RAM,
    year: product?.ProductYear,
    qty: 1,
  });

  // Add to Cart → normal cart flow via CartContext (server cart if logged in, guest cart otherwise)
  const handleAddToCart = async () => {
    if (addingToCart || !product?.id) return;
    setAddingToCart(true);
    try {
      await addToCart(buildCartItem());
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy Now → skip cart entirely. Stash single item in sessionStorage,
  // /checkout/buy-now page reads it straight from there.
  // Guest can still land on that page and see details — login only gated
  // on the actual Place Order / Add address actions there.
  const handleBuyNow = () => {
    if (buyingNow || !product?.id) return;
    setBuyingNow(true);
    try {
      // sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(buildCartItem()));
      // router.push("/checkout/buy-now");
      //commenting the buy now with payment for a while and changing this into the whatsapp redirection
      // router.push("/checkout/buy-now"); // adjust to your actual BuyNowCheckoutPage route
      window.open(WHATSAPP_CHAT_LINK, "_blank", "noopener,noreferrer");
    } finally {
      setBuyingNow(false);
    }
  };

  const handlePrevImage = () =>
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNextImage = () =>
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  const priceText = `₹ ${Number(currentPrice).toLocaleString("en-IN")}`;
  const mrpText = `₹ ${Number(originalPrice).toLocaleString("en-IN")}`;

  return (
    <motion.div
      className="page-wrapper py-10! md:py-16! p-3 md:p-0 text-[#1d1d1f]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:underline cursor-pointer"
      >
        <FiArrowLeft /> Back
      </button>

      {/* Title block */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Shop {name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-base md:text-lg">
          <span>
            Buy at <strong className="font-semibold">{priceText}</strong>
          </span>
          {originalPrice > 0 && (
            <>
              <span className="text-[#6e6e73] line-through">{mrpText}</span>
              {discount > 0 && (
                <span className="rounded-xs bg-green-700 px-2 py-1 text-sm text-white">
                  {discount}% off
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
        {/* Left: big gallery, sticks while right column scrolls */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative flex h-[55vh] items-center justify-center overflow-hidden rounded-3xl bg-[#f5f5f7] lg:h-[72vh]">
            <motion.img
              key={selectedImageIndex}
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain p-6 md:p-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#d2d2d7]/70 text-xl text-[#1d1d1f] backdrop-blur hover:bg-[#d2d2d7] cursor-pointer"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#d2d2d7]/70 text-xl text-[#1d1d1f] backdrop-blur hover:bg-[#d2d2d7] cursor-pointer"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>

                {/* dots */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {images.map((img, index) => (
                    <button
                      key={img.id || index}
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                        selectedImageIndex === index
                          ? "bg-[#1d1d1f]"
                          : "bg-[#86868b]/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: apple style sections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {specs.length > 0 && (
            <section>
              <h2 className="mb-5 text-2xl font-semibold leading-tight md:text-[28px]">
                Specifications.{" "}
                <span className="text-[#86868b]">Know your device.</span>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-xl border border-[#d2d2d7] bg-white px-5 py-4"
                  >
                    <p className="text-xs text-[#6e6e73]">{spec.label}</p>
                    <p className="mt-1 text-base font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>

      {/* Sticky buy bar: name + price left, buttons right. Rests at end of section. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-10 border-t border-[#d2d2d7] bg-white/90 px-4 py-3 backdrop-blur md:mx-0 md:mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold md:text-lg">
              {name}
            </p>
            <p className="text-sm text-[#6e6e73]">
              {priceText}
              {originalPrice > 0 && (
                <span className="ml-2 line-through">{mrpText}</span>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="rounded-md border border-gray-400 px-5 py-2.5 text-sm font-normal whitespace-nowrap text-[#0071e3] hover:bg-[#0071e3]/10 cursor-pointer disabled:opacity-50 md:px-7 md:text-base"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="rounded-md bg-[#000] px-5 py-2.5 text-sm font-normal whitespace-nowrap text-white hover:bg-[#0077ed] cursor-pointer disabled:opacity-50 md:px-7 md:text-base"
              onClick={handleBuyNow}
              disabled={buyingNow}
            >
              {buyingNow ? "..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
