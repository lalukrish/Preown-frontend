// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { motion, useInView } from "framer-motion";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import Link from "next/link";
// import PhoneCard from "@/components/Common/PhoneCard/PhoneCard";
// import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";
// import PhoneCardSmall from "@/components/Common/PhoneCard/PhoneCardSmall";

// const ScrollRightSection = ({ featured }) => {
//   const [selectedBrand, setSelectedBrand] = useState("Apple");
//   const [phones, setPhones] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // ✅ Fix — type both properly
//   const sectionRef = useRef(null);
//   const scrollRef = useRef(null);
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${STRAPI_BASE_URL}/products?populate=*`,
//         );

//         if (response.data?.data) {
//           let filtered = response.data.data;

//           if (featured) {
//             filtered = filtered.filter((p) => p.Isfeatured === true);
//           } else if (selectedBrand) {
//             const categoryMap = { Apple: ["iphone"], Samsung: ["Samsung"] };
//             const allowed = categoryMap[selectedBrand] || [];
//             if (allowed.length) {
//               filtered = filtered.filter(
//                 (p) => p.category && allowed.includes(p.category.name),
//               );
//             }
//           }

//           filtered = filtered.sort((a, b) => {
//             const ts = (item) =>
//               new Date(
//                 item.createdAt || item.publishedAt || item.updatedAt || 0,
//               ).getTime();
//             return ts(b) - ts(a);
//           });

//           setPhones(filtered);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setPhones([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedBrand, featured]);

//   const handleWhatsapp = (name) => {
//     const msg = encodeURIComponent(`Hi, I want to buy ${name}.`);
//     window.open(`https://wa.me/919995556734?text=${msg}`, "_blank");
//   };

//   return (
//     <motion.section
//       ref={sectionRef}
//       className="px-5 py-6 text-center max-w-screen-xl mx-auto"
//       initial={{ opacity: 0, y: 40 }}
//       animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
//       transition={{ duration: 0.7, ease: "easeOut" }}
//       id="explore"
//     >
//       {/* Title */}

//       <h3 className="text-[1.45rem] font-medium m-0 text-start">
//         {featured
//           ? "Top Featured Devices for You"
//           : "Which Device is Right for You"}
//       </h3>

//       {/* Brand toggle — hidden in featured mode */}
//       {!featured && (
//         <div className="mb-10 mt-5">
//           <div className="inline-flex bg-[#1f1f1f] rounded-full p-1">
//             {["Apple", "Samsung"].map((brand) => (
//               <button
//                 key={brand}
//                 onClick={() => setSelectedBrand(brand)}
//                 className={`px-5 py-1.5 rounded-full text-[0.8rem] font-medium transition-colors duration-200 cursor-pointer border-none
//                   ${
//                     selectedBrand === brand
//                       ? "bg-white text-[#222]"
//                       : "bg-transparent text-white hover:bg-[#737272]"
//                   }`}
//               >
//                 {brand}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* States */}
//       {loading ? (
//         <div className="py-10 text-gray-500">Loading products...</div>
//       ) : phones.length === 0 ? (
//         <div className="py-10 text-gray-500">No products found.</div>
//       ) : (
//         <div className="relative mt-8">
//           {/* Left arrow */}
//           <button
//             onClick={() =>
//               scrollRef.current?.scrollBy({ left: -236, behavior: "smooth" })
//             }
//             className="absolute left-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
//             aria-label="Scroll left"
//           >
//             ‹
//           </button>

//           <div
//             ref={scrollRef}
//             className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//           >
//             {phones.slice(0, 8).map((phone, index) => {
//               const imageUrl = phone.image?.[0]?.url
//                 ? `${STRAPI_IMAGE_BASE_URL}${phone.image[0].url}`
//                 : "/placeholder.jpg";
//               const slug = phone?.slug || phone?.documentId || phone?.id;
//               const href = `/products/${slug}`;

//               return (
//                 <div
//                   key={phone.id || phone.documentId || index}
//                   className="flex-none w-[220px] snap-start"
//                 >
//                   <PhoneCardSmall
//                     index={index}
//                     imageUrl={imageUrl}
//                     name={phone.name}
//                     price={phone.price}
//                     href={href}
//                     onCardClick={() => router.push(href)}
//                     onBuyClick={() => handleWhatsapp(phone.name)}
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Right arrow */}
//           <button
//             onClick={() =>
//               scrollRef.current?.scrollBy({ left: 236, behavior: "smooth" })
//             }
//             className="absolute right-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
//             aria-label="Scroll right"
//           >
//             ›
//           </button>
//         </div>
//       )}
//     </motion.section>
//   );
// };

// export default ScrollRightSection;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import PhoneCardSmall from "@/components/Common/PhoneCard/PhoneCardSmall";
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";

const ScrollRightSection = ({
  featured,
  heading = "Which Device is Right for You",
  cardProperties = "",
  isJustIn = false,
}) => {
  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
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
    <div className="flex page-wrapper items-center justify-center">
      <section className={` py-10 ${cardProperties} `}>
        <motion.div
          ref={sectionRef}
          className="px-5 page-wrapper mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          id="explore"
        >
          {/* Heading */}
          <h3 className="text-[1.45rem] font-medium m-0 text-start text-gray-900">
            {heading}
          </h3>

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
            <div className="relative mt-8">
              {/* Left arrow */}
              <button
                onClick={() =>
                  scrollRef.current?.scrollBy({
                    left: -236,
                    behavior: "smooth",
                  })
                }
                className="absolute left-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                ‹
              </button>

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {phones.slice(0, 8).map((phone, index) => {
                  const imageUrl = phone.image?.[0]?.url
                    ? `${STRAPI_IMAGE_BASE_URL}${phone.image[0].url}`
                    : "/placeholder.jpg";
                  const slug = phone?.slug || phone?.documentId || phone?.id;
                  const href = `/products/${slug}`;

                  return (
                    <div
                      key={phone.id || phone.documentId || index}
                      className="flex-none w-[240px] snap-start rounded-md bg-white  hover:shadow-sm transition-shadow"
                    >
                      <PhoneCardSmall
                        index={index}
                        imageUrl={imageUrl}
                        name={phone.name}
                        price={phone.price}
                        href={href}
                        onCardClick={() => router.push(href)}
                        onBuyClick={() => handleWhatsapp(phone.name)}
                        isJustIn={isJustIn}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right arrow */}
              <button
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: 236, behavior: "smooth" })
                }
                className="absolute right-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default ScrollRightSection;
