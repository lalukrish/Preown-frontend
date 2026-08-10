// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { motion, useInView } from "framer-motion";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import PhoneCardSmall from "@/components/Common/PhoneCard/PhoneCardSmall";
// import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";

// const WRAPPER =
//   "w-full mx-auto sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px] min-[1440px]:max-w-[1160px] min-[1537px]:max-w-[1336px]";

// const ScrollRightSection = ({
//   featured,
//   heading = "Which Device is Right for You",
//   cardProperties = "",
//   isJustIn = false,
// }) => {
//   const [selectedBrand, setSelectedBrand] = useState("Apple");
//   const [phones, setPhones] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const sectionRef = useRef(null);
//   const scrollRef = useRef(null);
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `https://backapp.preown.store/api/new-products?populate=*`,
//         );

//         if (response.data?.data) {
//           let filtered = response.data.data;
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
//     <div className={`flex ${WRAPPER} items-center justify-center min-w-0`}>
//       <section className={` py-10 ${cardProperties} `}>
//         <motion.div
//           ref={sectionRef}
//           className={`px-5 ${WRAPPER}`}
//           initial={{ opacity: 0, y: 40 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//           id="explore"
//         >
//           {/* Heading */}
//           <h3 className="text-[1.45rem] font-medium m-0 text-start text-gray-900">
//             {heading}
//           </h3>

//           {/* Brand toggle — hidden in featured mode */}
//           {!featured && (
//             <div className="mb-10 mt-5">
//               <div className="inline-flex bg-[#1f1f1f] rounded-full p-1">
//                 {["Apple", "Samsung"].map((brand) => (
//                   <button
//                     key={brand}
//                     onClick={() => setSelectedBrand(brand)}
//                     className={`px-5 py-1.5 rounded-full text-[0.8rem] font-medium transition-colors duration-200 cursor-pointer border-none
//                     ${
//                       selectedBrand === brand
//                         ? "bg-white text-[#222]"
//                         : "bg-transparent text-white hover:bg-[#737272]"
//                     }`}
//                   >
//                     {brand}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* States */}
//           {loading ? (
//             <div className="py-10 text-gray-500">Loading products...</div>
//           ) : phones.length === 0 ? (
//             <div className="py-10 text-gray-500">No products found.</div>
//           ) : (
//             <div className="relative mt-8 w-full min-w-0">
//               {/* Left arrow — desktop only */}
//               <button
//                 onClick={() =>
//                   scrollRef.current?.scrollBy({
//                     left: -236,
//                     behavior: "smooth",
//                   })
//                 }
//                 className="hidden md:flex absolute left-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
//                 aria-label="Scroll left"
//               >
//                 ‹
//               </button>

//               {/* Box wrapper — mobile: boxed scroll panel. desktop: plain, unaffected */}
//               <div className="relative w-full min-w-0 rounded-2xl border-2 border-gray-200 bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)] p-3 md:border-none md:bg-transparent md:shadow-none md:p-0 md:rounded-none">
//                 <div
//                   ref={scrollRef}
//                   className="flex w-full min-w-0 gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-1 md:px-5 md:pb-4 scroll-pl-1 scroll-pr-1 md:scroll-pl-5 md:scroll-pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//                   style={{ WebkitOverflowScrolling: "touch" }}
//                 >
//                   {phones.slice(0, 8).map((phone, index) => {
//                     const media = phone.ProductImagesAndVideos?.[0];
//                     const mediaPath =
//                       media?.formats?.small?.url || media?.url || null;
//                     const imageUrl = mediaPath
//                       ? `https://backapp.preown.store${mediaPath}`
//                       : "/placeholder.jpg";
//                     const href = `/products/${phone.slug || phone.documentId || phone.id}`;
//                     return (
//                       <div
//                         key={phone.id || phone.documentId || index}
//                         className="flex-none w-[78vw] max-w-[260px] md:w-[240px] snap-start rounded-md bg-white hover:shadow-sm transition-shadow"
//                       >
//                         <PhoneCardSmall
//                           index={index}
//                           id={phone.documentId || phone.id}
//                           imageUrl={imageUrl}
//                           name={phone.ProductName}
//                           price={phone.TotalPriceWithGST}
//                           oldPrice={phone.MRP}
//                           storage={phone.Storage ? `${phone.Storage}GB` : ""}
//                           condition={phone.Condition}
//                           color={phone.Color}
//                           href={href}
//                           onCardClick={() => router.push(href)}
//                           onBuyClick={() => handleWhatsapp(phone.ProductName)}
//                           isJustIn={isJustIn}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* fade edges — mobile only */}
//                 <div className="pointer-events-none absolute left-0 top-3 bottom-3 w-6 bg-gradient-to-r from-white to-transparent rounded-l-2xl md:hidden" />
//                 <div className="pointer-events-none absolute right-0 top-3 bottom-3 w-6 bg-gradient-to-l from-white to-transparent rounded-r-2xl md:hidden" />
//               </div>

//               {/* Right arrow — desktop only */}
//               <button
//                 onClick={() =>
//                   scrollRef.current?.scrollBy({ left: 236, behavior: "smooth" })
//                 }
//                 className="hidden md:flex absolute right-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
//                 aria-label="Scroll right"
//               >
//                 ›
//               </button>
//             </div>
//           )}
//         </motion.div>
//       </section>
//     </div>
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

const WRAPPER =
  "w-full mx-auto sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px] min-[1440px]:max-w-[1160px] min-[1537px]:max-w-[1336px]";

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
          `https://backapp.preown.store/api/new-products?populate=*`,
        );

        if (response.data?.data) {
          let filtered = response.data.data;
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
    <section className={`w-full overflow-x-hidden py-10 ${cardProperties}`}>
      <motion.div
        ref={sectionRef}
        className={`px-5 ${WRAPPER}`}
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
            {/* Left arrow — desktop only */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -236,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute left-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              ‹
            </button>

            {/* Box wrapper — mobile: boxed scroll panel. desktop: plain, unaffected */}
            <div className="relative rounded-2xl border-1 border-gray-200 bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.02)] p-3 md:border-none md:bg-transparent md:shadow-none md:p-0 md:rounded-none">
              {/* GRID scroll track — mobile: grid-flow-col, auto-columns sized cards. desktop: switches to flex row same as before */}
              <div
                ref={scrollRef}
                className="grid grid-flow-col auto-cols-[86%] max-[380px]:auto-cols-[90%] gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-1 md:flex md:auto-cols-auto md:w-auto md:px-5 md:pb-4 scroll-pl-1 scroll-pr-1 md:scroll-pl-5 md:scroll-pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {phones.slice(0, 8).map((phone, index) => {
                  const media = phone.ProductImagesAndVideos?.[0];
                  const mediaPath =
                    media?.formats?.small?.url || media?.url || null;
                  const imageUrl = mediaPath
                    ? `https://backapp.preown.store${mediaPath}`
                    : "/placeholder.jpg";
                  const href = `/products/${phone.slug || phone.documentId || phone.id}`;
                  return (
                    <div
                      key={phone.id || phone.documentId || index}
                      className="w-full max-w-[260px] md:w-[240px] md:flex-none snap-start rounded-md bg-white hover:shadow-sm transition-shadow"
                    >
                      <PhoneCardSmall
                        index={index}
                        id={phone.documentId || phone.id}
                        imageUrl={imageUrl}
                        name={phone.ProductName}
                        price={phone.TotalPriceWithGST}
                        oldPrice={phone.MRP}
                        storage={phone.Storage ? `${phone.Storage}GB` : ""}
                        condition={phone.Condition}
                        color={phone.Color}
                        href={href}
                        onCardClick={() => router.push(href)}
                        onBuyClick={() => handleWhatsapp(phone.ProductName)}
                        isJustIn={isJustIn}
                      />
                    </div>
                  );
                })}
              </div>

              {/* fade edges — mobile only */}
              <div className="pointer-events-none absolute left-0 top-3 bottom-3 w-6 bg-gradient-to-r from-white to-transparent rounded-l-2xl md:hidden" />
              <div className="pointer-events-none absolute right-0 top-3 bottom-3 w-6 bg-gradient-to-l from-white to-transparent rounded-r-2xl md:hidden" />
            </div>

            {/* Right arrow — desktop only */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: 236, behavior: "smooth" })
              }
              className="hidden md:flex absolute right-1 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ScrollRightSection;
