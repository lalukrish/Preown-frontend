"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import styles from "./ProductsPage.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import FeaturedSection from "@/components/sections/FeaturedSection/FeaturedSection";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("category"); // this is a documentId, e.g. sk2hy7rv4tn7bfgb7m2keny5

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categoryId || "all",
  );
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Fetch categories from Strapi API (nav buttons)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://backapp.preown.store/api/categories?populate=*`,
        );
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products for a single category (by documentId)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (selectedCategoryId && selectedCategoryId !== "all") {
          // populate=* only populates the category's first-level relations
          // (new_products itself) but not fields nested one level deeper on
          // each product (e.g. its images). Ask for a deep populate on
          // new_products so image data actually comes back.
          const response = await axios.get(
            `https://backapp.preown.store/api/categories/${selectedCategoryId}?populate[new_products][populate]=*`,
          );
          console.log("Fetched category:", response.data);
          setProducts(response.data?.data?.new_products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
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

  const handleCategoryFilter = (docId) => {
    setSelectedCategoryId(docId);
    if (docId === "all") {
      router.push("/products");
    } else {
      router.push(`/products?category=${docId}`);
    }
  };

  return (
    <motion.div
      ref={sectionRef}
      className={styles.productsPage}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h1 className={`${styles.title} pt-20`}>Our Products Collection</h1>

      {/* Category Filter Buttons */}
      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterBtn} ${selectedCategoryId === "all" ? styles.filterBtnActive : ""}`}
          onClick={() => handleCategoryFilter("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.documentId || cat.id}
            className={`${styles.filterBtn} ${selectedCategoryId === cat.documentId ? styles.filterBtnActive : ""}`}
            onClick={() => handleCategoryFilter(cat.documentId)}
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
        <FeaturedSection products={products} />
      )}
    </motion.div>
  );
}

export default function ProductsPageClient() {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading products...
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
