// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import styles from "./FeaturedSection.module.css";
// import { motion, useInView } from "framer-motion";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import PhoneCard from "@/components/Common/PhoneCard/PhoneCard";
// import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";

// const cardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.15 },
//   }),
// };

// const FeaturedSection = ({ featured }) => {
//   const [selectedBrand, setSelectedBrand] = useState("Apple");
//   const [phones, setPhones] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayCount, setDisplayCount] = useState(0);
//   const sectionRef = useRef(null);
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
//   const router = useRouter();

//   // Fetch products from Strapi API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${STRAPI_BASE_URL}/products?populate=*`,
//         );

//         if (response.data && response.data.data) {
//           let filteredProducts = response.data.data;

//           // Filter by featured if featured prop is true
//           if (featured) {
//             filteredProducts = filteredProducts.filter(
//               (product) => product.Isfeatured === true,
//             );
//           }

//           // Filter by brand/category
//           if (!featured && selectedBrand) {
//             // Map selected brand to category names
//             const categoryMap = {
//               Apple: ["iphone"],
//               Samsung: ["Samsung"],
//             };

//             const allowedCategories = categoryMap[selectedBrand] || [];
//             if (allowedCategories.length > 0) {
//               filteredProducts = filteredProducts.filter(
//                 (product) =>
//                   product.category &&
//                   allowedCategories.includes(product.category.name),
//               );
//             }
//           }

//           filteredProducts = filteredProducts.sort((a, b) => {
//             const getTimestamp = (item) => {
//               const dateValue =
//                 item.createdAt || item.publishedAt || item.updatedAt;
//               return dateValue ? new Date(dateValue).getTime() : 0;
//             };
//             return getTimestamp(b) - getTimestamp(a);
//           });

//           setPhones(filteredProducts);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setPhones([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedBrand, featured]);

//   useEffect(() => {
//     const updateDisplayCount = () => {
//       // Show only 3 devices (latest) for both featured and regular sections
//       setDisplayCount(6);
//     };
//     updateDisplayCount();
//     window.addEventListener("resize", updateDisplayCount);
//     return () => window.removeEventListener("resize", updateDisplayCount);
//   }, [featured]);

//   const handleWhatsapp = (buy) => {
//     const phone = "919995556734";
//     const message = encodeURIComponent(`Hi, I want by ${buy} .`);
//     window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
//   };

//   return (
//     <motion.section
//       ref={sectionRef}
//       className={styles.phoneSelector}
//       initial={{ opacity: 0, y: 10 }}
//       animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
//       transition={{ duration: 0.7, ease: "easeOut" }}
//       id="explore"
//     >
//       {featured ? (
//         <h2 className={styles.title}>Top Featured Devices for You</h2>
//       ) : (
//         <h2 className={styles.title}>Which Device is Right for You</h2>
//       )}

//       {featured ? (
//         ""
//       ) : (
//         <div className={styles.toggleWrapper}>
//           <div className={styles.toggle}>
//             <button
//               className={`${styles.toggleBtn} ${selectedBrand === "Apple" ? styles.active : ""}`}
//               onClick={() => setSelectedBrand("Apple")}
//             >
//               Apple
//             </button>
//             <button
//               className={`${styles.toggleBtn} ${selectedBrand === "Samsung" ? styles.active : ""}`}
//               onClick={() => setSelectedBrand("Samsung")}
//             >
//               Samsung
//             </button>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "40px" }}>
//           <p>Loading products...</p>
//         </div>
//       ) : phones.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "40px" }}>
//           <p>No products found.</p>
//         </div>
//       ) : (
//         <div className={styles.cardGrid}>
//           {phones.slice(0, displayCount).map((phone, index) => {
//             const imageUrl =
//               phone.image && phone.image[0]
//                 ? `${STRAPI_IMAGE_BASE_URL}${phone.image[0].url}`
//                 : "/placeholder.jpg";

//             const productSlug = phone?.slug || phone?.documentId || phone?.id;
//             const href = `/products/${productSlug}`;

//             const handleCardClick = () => {
//               router.push(href);
//             };

//             return (
//               <PhoneCard
//                 key={phone.id || phone.documentId || index}
//                 index={index}
//                 imageUrl={imageUrl}
//                 name={phone.name}
//                 price={phone.price}
//                 href={href}
//                 onCardClick={handleCardClick}
//                 onBuyClick={() => handleWhatsapp(phone.name)}
//               />
//             );
//           })}
//         </div>
//       )}

//       {/* <a href="#" className={styles.shopLink}>Shop all Iphone and andriod</a> */}
//     </motion.section>
//   );
// };

// export default FeaturedSection;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import PhoneCard from "@/components/Common/PhoneCard/PhoneCard";
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";

const FeaturedSection = ({ featured }) => {
  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const router = useRouter();

  useEffect(() => {
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
  }, [selectedBrand, featured]);

  const handleWhatsapp = (name) => {
    const msg = encodeURIComponent(`Hi, I want to buy ${name}.`);
    window.open(`https://wa.me/919995556734?text=${msg}`, "_blank");
  };

  return (
    <motion.section
      ref={sectionRef}
      className="px-5 py-6 text-center max-w-screen-xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      id="explore"
    >
      {/* Title */}
      <h2 className="text-[1.75rem] font-medium m-0">
        {featured
          ? "Top Featured Devices for You"
          : "Which Device is Right for You"}
      </h2>

      {/* Brand toggle — hidden in featured mode */}
      {!featured && (
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
          {phones.slice(0, 8).map((phone, index) => {
            const imageUrl = phone.image?.[0]?.url
              ? `${STRAPI_IMAGE_BASE_URL}${phone.image[0].url}`
              : "/placeholder.jpg";

            const slug = phone?.slug || phone?.documentId || phone?.id;
            const href = `/products/${slug}`;

            return (
              <PhoneCard
                key={phone.id || phone.documentId || index}
                index={index}
                imageUrl={imageUrl}
                name={phone.name}
                price={phone.price}
                href={href}
                onCardClick={() => router.push(href)}
                onBuyClick={() => handleWhatsapp(phone.name)}
              />
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

export default FeaturedSection;
