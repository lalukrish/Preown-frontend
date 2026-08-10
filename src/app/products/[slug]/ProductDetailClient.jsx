"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./ProductDetail.module.css";
import { STRAPI_IMAGE_BASE_URL } from "@/utils/config";

// ProductImagesAndVideos is an array of Strapi media objects
const getAllImages = (product) => {
  console.log("product", product);
  const media = product?.ProductImagesAndVideos;
  if (!media || !Array.isArray(media)) return [];
  // keep only images (in case a video ever ends up in this field)
  return media.filter((m) => !m.mime || m.mime.startsWith("image"));
};

const getImageUrl = (item) => {
  console.log("item", item);
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const allImages = getAllImages(product);
  console.log("allImages", allImages);
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

  const handleWhatsapp = (productName) => {
    const phone = "919995556734";
    const message = encodeURIComponent(`Hi, I want to buy ${productName}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleThumbnailClick = (index) => setSelectedImageIndex(index);
  const handlePrevImage = () =>
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNextImage = () =>
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  return (
    <motion.div
      className={styles.productDetail}
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

            <div className={styles.actionButtons}>
              <button
                className={styles.addToCartButton}
                onClick={() => handleWhatsapp(name)}
              >
                Enquire Now
              </button>
              <button
                className={styles.buyNowButton}
                onClick={() => handleWhatsapp(name)}
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
