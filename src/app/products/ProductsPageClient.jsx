'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import styles from './ProductsPage.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import PhoneCard from '@/components/Common/PhoneCard/PhoneCard';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from '@/utils/config';


function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('category');

  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || 'all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleWhatsapp = (buy) => {
    const phone = '919995556734';
    const message = encodeURIComponent(`Hi, I want by ${buy} .`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Fetch categories from Strapi API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://strapi.preown.store/api/categories?populate=*`);
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from Strapi API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `https://strapi.preown.store/api/products?populate=*&sort=createdAt:desc`;

        // Filter by category if selected
        if (selectedCategoryId && selectedCategoryId !== 'all') {
          url = `https://strapi.preown.store/api/products?populate=*&filters[category][id][$eq]=${selectedCategoryId}&sort=createdAt:desc`;
        }

        const response = await axios.get(url);
        console.log('Fetched products:', response.data);
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
  }, [categoryId]);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (categoryId === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${categoryId}`);
    }
  };



  return (
    <motion.div
      ref={sectionRef}
      className={styles.productsPage}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <h1 className={styles.title}>Our Products Collection</h1>

      {/* Category Filter Buttons */}
      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterBtn} ${selectedCategoryId === 'all' ? styles.filterBtnActive : ''}`}
          onClick={() => handleCategoryFilter('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${selectedCategoryId === String(cat.id) ? styles.filterBtnActive : ''}`}
            onClick={() => handleCategoryFilter(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading products...
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {products.map((product, index) => {
            // Extract image URL from Strapi media array
            const imageUrl = product.image && product.image[0]
              ? `${STRAPI_IMAGE_BASE_URL}${product.image[0].url}`
              : '/placeholder.jpg';

            // Use slug if available, otherwise fallback to documentId or id
            const productSlug = product?.slug || product?.documentId || product?.id;
            const href = `/products/${productSlug}`;

            const handleCardClick = () => {
              router.push(href);
            };

            // Extract data from product
            const firstColor = product?.colors?.colors?.[0] || "";
            const firstStorage = product?.storage?.storage?.[0] || "";
            const condition = product.condition || "";
            const isJustIn = product.isJustIn !== undefined ? product.isJustIn : true;
            const oldPrice = product?.oldPrice || null;
            const originalPrice = oldPrice || product.originalPrice || product.newPrice || null;

            return (
              <PhoneCard
                key={productSlug || index}
                index={index}
                imageUrl={imageUrl}
                name={product.name}
                price={product.price}
                href={href}
                onCardClick={handleCardClick}
                onBuyClick={() => handleWhatsapp(product.name)}
                color={firstColor}
                storage={firstStorage}
                condition={condition}
                isJustIn={isJustIn}
                originalPrice={originalPrice}
                oldPrice={oldPrice}
              />
            );
          })}
        </div>
      )}


    </motion.div>
  );
}

export default function ProductsPageClient() {
  return (
    <Suspense fallback={
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        Loading products...
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}

