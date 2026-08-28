"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./ProductDetail.module.css";
import { STRAPI_IMAGE_BASE_URL } from "@/utils/config";
import { useCart } from "@/context/CartContext";

export const BUY_NOW_KEY = "buy_now_item";

// ProductImagesAndVideos is an array of Strapi media objects
const getAllImages = (product) => {
  const media = product?.ProductImagesAndVideos;
  if (!media || !Array.isArray(media)) return [];
  // keep only images (in case a video ever ends up in this field)
  return media.filter((m) => !m.mime || m.mime.startsWith("image"));
};

const getImageUrl = (item) => {
  if (!item) return "/placeholder.jpg";
  const path =
    item?.formats?.medium?.url ||
    item?.formats?.small?.url ||
    item?.formats?.thumbnail?.url ||
    item?.url;
  return path ? `https://backapp.preown.store${path}` : "/placeholder.jpg";
};

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
      sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(buildCartItem()));
      router.push("/checkout/buy-now");
    } finally {
      setBuyingNow(false);
    }
  };

  const handleThumbnailClick = (index) => setSelectedImageIndex(index);
  const handlePrevImage = () =>
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNextImage = () =>
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  return (
    <motion.div
      className={`${styles.productDetail} page-wrapper py-10! md:py-16!`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => router.back()} className={styles.backButton}>
        <FiArrowLeft /> Back
      </button>

      <div className={styles.productContainer}>
        {/* Left Section - Product Images */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageContainer}>
            <motion.img
              key={selectedImageIndex}
              src={imageUrl}
              alt={name}
              className={styles.productImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnailCarousel}>
              <button
                className={styles.carouselArrow}
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>

              <div className={styles.thumbnailContainer}>
                {images.slice(0, 4).map((img, index) => (
                  <img
                    key={img.id || index}
                    src={getImageUrl(img)}
                    alt={`${name} - View ${index + 1}`}
                    className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ""}`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>

              <button
                className={styles.carouselArrow}
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Right Section - Product Details */}
        <div className={styles.infoSection}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className={styles.productName}>{name}</h1>

            <div className={styles.pricingSection}>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>
                  ₹ {Number(currentPrice).toLocaleString("en-IN")}
                </span>
                {originalPrice > 0 && (
                  <>
                    <span className={styles.originalPrice}>
                      ₹ {Number(originalPrice).toLocaleString("en-IN")}
                    </span>
                    {discount > 0 && (
                      <span className={styles.discountBadge}>
                        {discount}% off
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mobile action row */}
            <div className="flex justify-center gap-3 md:hidden mb-8">
              <button
                className="border border-cyan-950 text-cyan-950 flex flex-1 max-w-[160px] justify-center hover:bg-cyan-50 px-4 py-3.5 mt-3 items-center text-[16px] rounded-xs font-normal mb-2.5 cursor-pointer whitespace-nowrap!"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                className="bg-cyan-950 flex flex-1 max-w-[160px] justify-center hover:bg-cyan-900 px-4 py-3.5 mt-3 items-center text-[16px] rounded-xs shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal mb-2.5 text-white cursor-pointer whitespace-nowrap!"
                onClick={handleBuyNow}
                disabled={buyingNow}
              >
                {buyingNow ? "..." : "Buy Now"}
              </button>
            </div>

            {/* Specs */}
            {specs.length > 0 && (
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Specifications</label>
                <div className={styles.optionButtons}>
                  {specs.map((spec) => (
                    <span key={spec.label} className={styles.optionButton}>
                      <strong>{spec.label}:</strong>&nbsp;{spec.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop action row */}
            <div className="hidden md:flex justify-start gap-3">
              <button
                className="border border-cyan-950 text-cyan-950 flex w-[200px] justify-center hover:bg-cyan-50 px-4 py-3.5 mt-3 items-center text-[20px] rounded-xs font-normal mb-2.5 cursor-pointer whitespace-nowrap!"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                className="bg-cyan-950 flex w-[200px] justify-center hover:bg-cyan-900 px-4 py-3.5 mt-3 items-center text-[20px] rounded-xs shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal mb-2.5 text-white cursor-pointer whitespace-nowrap!"
                onClick={handleBuyNow}
                disabled={buyingNow}
              >
                {buyingNow ? "..." : "Buy Now"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
