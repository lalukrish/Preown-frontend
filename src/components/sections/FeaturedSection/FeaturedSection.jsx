"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import PhoneCard from "@/components/Common/PhoneCard/PhoneCard";
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";

const FeaturedSection = ({ featured, products: externalProducts, title }) => {
  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(!externalProducts);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const router = useRouter();

  useEffect(() => {
    // Products handed in from parent (e.g. category page) — skip own fetch
    if (externalProducts) {
      setPhones(externalProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${STRAPI_BASE_URL}/products?populate=*`,
        );

        if (response.data?.data) {
          let filtered = response.data.data;

          if (featured) {
            filtered = filtered.filter((p) => p.Isfeatured === true);
          } else if (selectedBrand) {
            const categoryMap = { Apple: ["iphone"], Samsung: ["Samsung"] };
            const allowed = categoryMap[selectedBrand] || [];
            if (allowed.length) {
              filtered = filtered.filter(
                (p) => p.category && allowed.includes(p.category.name),
              );
            }
          }

          filtered = filtered.sort((a, b) => {
            const ts = (item) =>
              new Date(
                item.createdAt || item.publishedAt || item.updatedAt || 0,
              ).getTime();
            return ts(b) - ts(a);
          });

          setPhones(filtered);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setPhones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand, featured, externalProducts]);

  const handleWhatsapp = (name) => {
    const msg = encodeURIComponent(`Hi, I want to buy ${name}.`);
    window.open(`https://wa.me/919995556734?text=${msg}`, "_blank");
  };

  return (
    <motion.section
      ref={sectionRef}
      className="px-5 md:px-0 py-6 text-center page-wrapper mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      id="explore"
    >
      {/* Title */}
      <h2 className="text-[1.75rem] font-medium m-0">
        {title
          ? title
          : featured
            ? "Top Featured Devices for You"
            : "Which Device is Right for You"}
      </h2>

      {/* Brand toggle — hidden in featured mode and when products come from parent */}
      {!featured && !externalProducts && (
        <div className="mb-10 mt-5">
          <div className="inline-flex bg-[#1f1f1f] rounded-full p-1">
            {["Apple", "Samsung"].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-5 py-1.5 rounded-full text-[0.8rem] font-medium transition-colors duration-200 cursor-pointer border-none
                  ${
                    selectedBrand === brand
                      ? "bg-white text-[#222]"
                      : "bg-transparent text-white hover:bg-[#737272]"
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* States */}
      {loading ? (
        <div className="py-10 text-gray-500">Loading products...</div>
      ) : phones.length === 0 ? (
        <div className="py-10 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {(externalProducts ? phones : phones.slice(0, 8)).map(
            (phone, index) => {
              // Two schemas floating around:
              // - old "products" collection: lowercase fields (name, price,
              //   colors.colors, storage.storage, condition, ProductImagesAndVideos)
              // - "new_products" collection (from category API): PascalCase
              //   fields (ProductName, MRP, TotalPriceWithGST, Color, Storage,
              //   Condition). Check new-schema field first, fall back to old.
              const imageUrl = phone.ProductImagesAndVideos?.[0]?.url
                ? `https://backapp.preown.store${phone.ProductImagesAndVideos[0].url}`
                : phone.image?.[0]?.url
                  ? `${STRAPI_IMAGE_BASE_URL}${phone.image[0].url}`
                  : "/placeholder.jpg";

              const slug = phone?.slug || phone?.documentId || phone?.id;
              const href = `/products/${slug}`;

              const name = phone.ProductName || phone.name;
              const price =
                phone.TotalPriceWithGST ?? phone.MRP ?? phone.price ?? null;
              const firstColor =
                phone.Color || phone?.colors?.colors?.[0] || "";
              const firstStorage = phone.Storage
                ? `${phone.Storage} GB`
                : phone?.storage?.storage?.[0] || "";
              const condition = phone.Condition || phone.condition || "";
              const isJustIn =
                phone.isJustIn !== undefined ? phone.isJustIn : true;
              // MRP is the "was" price when it's actually higher than the selling price
              const oldPrice =
                phone.MRP &&
                phone.TotalPriceWithGST &&
                phone.MRP > phone.TotalPriceWithGST
                  ? phone.MRP
                  : phone.oldPrice || null;
              const originalPrice =
                oldPrice || phone.originalPrice || phone.newPrice || null;

              return (
                <PhoneCard
                  key={phone.id || phone.documentId || index}
                  index={index}
                  imageUrl={imageUrl}
                  name={name}
                  price={price}
                  href={href}
                  onCardClick={() => router.push(href)}
                  onBuyClick={() => handleWhatsapp(name)}
                  color={firstColor}
                  storage={firstStorage}
                  condition={condition}
                  isJustIn={isJustIn}
                  originalPrice={originalPrice}
                  oldPrice={oldPrice}
                />
              );
            },
          )}
        </div>
      )}
    </motion.section>
  );
};

export default FeaturedSection;
