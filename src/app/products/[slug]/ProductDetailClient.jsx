'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './ProductDetail.module.css';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from '@/utils/config';

// Extract image URL properly from Strapi response
const getImageUrl = (image, index = 0) => {
  if (!image) return '/placeholder.jpg';

  if (Array.isArray(image) && image.length > 0) {
    return `${STRAPI_IMAGE_BASE_URL}${image[index]?.url}`;
  }
  if (image.url) {
    return `${STRAPI_IMAGE_BASE_URL}${image.url}`;
  }
  return '/placeholder.jpg';
};

// Get all images from product
const getAllImages = (product) => {
  if (!product?.image) return [];
  return Array.isArray(product.image) ? product.image : [product.image];
};

// Color mapping - map color names to hex values
const colorMap = {
  'Red': '#FF3B30',
  'red': '#FF3B30',
  'Pink': '#FF2D92',
  'pink': '#FF2D92',
  'Black': '#1C1C1E',
  'black': '#1C1C1E',
  'White': '#F5F5F7',
  'white': '#F5F5F7',
  'Blue': '#007AFF',
  'blue': '#007AFF',
  'Gray': '#A2AAAD',
  'gray': '#A2AAAD',
  'Orange': '#FF9500',
  'orange': '#FF9500',
  'Gold': '#FFD700',
  'gold': '#FFD700',
  'Purple': '#AF52DE',
  'purple': '#AF52DE',
};

export default function ProductDetailClient({ product }) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Extract data from product API response
  const storageOptions = product?.storage?.storage || ['128GB', '256GB', '512GB'];
  const colorNames = product?.colors?.colors || ['Red', 'Black', 'White', 'Blue'];
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0] || '128GB');
  const [selectedColor, setSelectedColor] = useState(colorNames[0] || 'Red');

  // Build color options with hex values
  const colorOptions = colorNames.map(color => ({
    name: color,
    value: colorMap[color] || '#1C1C1E'
  }));

  const currentPrice = product?.price || 0;
  const oldPrice = product?.oldPrice || null;
  const originalPrice = oldPrice || 0;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // Build product data
  const demoData = {
    name: product?.name || 'iPhone - Pre-owned',
    currentPrice: currentPrice,
    originalPrice: originalPrice,
    discount: discount,
    reviews: { count: 1, rating: 5 },
    storageOptions: storageOptions,
    colorOptions: colorOptions,
  };

  const handleWhatsapp = (productName) => {
    const phone = '919995556734';
    const message = encodeURIComponent(`Hi, I want to buy ${productName}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const images = getAllImages(product);
  const imageUrl = getImageUrl(product.image, selectedImageIndex);

  // Use demo images if product images are not available
  const allImages = images.length > 0 ? images : [
    { url: '/placeholder.jpg' },
    { url: '/placeholder.jpg' },
    { url: '/placeholder.jpg' },
    { url: '/placeholder.jpg' },
  ];

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };


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
              alt={demoData.name}
              className={styles.productImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {allImages.length > 1 && (
            <div className={styles.thumbnailCarousel}>
              <button
                className={styles.carouselArrow}
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>

              <div className={styles.thumbnailContainer}>
                {allImages.slice(0, 4).map((img, index) => {
                  const imgUrl = getImageUrl([img], 0);
                  return (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`${demoData.name} - View ${index + 1}`}
                      className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ''
                        }`}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  );
                })}
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
            {/* Product Title */}
            <h1 className={styles.productName}>{demoData.name}</h1>

            {/* Pricing Section */}
            <div className={styles.pricingSection}>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>
                  ₹ {Number(demoData.currentPrice).toLocaleString('en-IN')}
                </span>
                <span className={styles.originalPrice}>
                  ₹ {Number(demoData.originalPrice).toLocaleString('en-IN')}
                </span>
                <span className={styles.discountBadge}>
                  {demoData.discount}% off
                </span>
              </div>
            </div>


            {/* Storage Options */}
            {storageOptions && storageOptions.length > 0 && (
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Storage</label>
                <div className={styles.optionButtons}>
                  {demoData.storageOptions.map((storage) => (
                    <button
                      key={storage}
                      className={`${styles.optionButton} ${selectedStorage === storage ? styles.optionButtonActive : ''
                        }`}
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options */}
            {colorNames && colorNames.length > 0 && (
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Color:</label>
                <span className={styles.selectedColorName}>{selectedColor}</span>
                <div className={styles.colorSwatches}>
                  {demoData.colorOptions.map((color) => (
                    <button
                      key={color.name}
                      className={`${styles.colorSwatch} ${selectedColor === color.name ? styles.colorSwatchActive : ''
                        }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                      aria-label={color.name}
                    >
                      {selectedColor === color.name && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={styles.addToCartButton}
                onClick={() => handleWhatsapp(demoData.name)}
              >
                Enquire Now
              </button>
              <button
                className={styles.buyNowButton}
                onClick={() => handleWhatsapp(demoData.name)}
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

