// "use client";

// import React from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// const offers = [
//   {
//     id: 1,
//     tag: "Up to 30% Off",
//     name: "Samsung Galaxy S22",
//     price: "₹28,499",
//     originalPrice: "₹40,999",
//     image: "/apple-phone1.jpg",
//     href: "/products?category=sk2hy7rv4tn7bfgb7m2keny5",
//     bg: "bg-blue-50",
//   },
//   {
//     id: 2,
//     tag: "Flat ₹4,000 Off",
//     name: "iPhone 13 (128GB)",
//     price: "₹34,999",
//     originalPrice: "₹38,999",
//     image: "/apple-lap.jpg",
//     href: "/products?category=smartphones",
//     bg: "bg-orange-50",
//   },
//   {
//     id: 3,
//     tag: "Save ₹8,500",
//     name: "MacBook Air M1",
//     price: "₹56,999",
//     originalPrice: "₹65,499",
//     image: "/smartphone.jpg",
//     href: "/products?category=laptops",
//     bg: "bg-emerald-500",
//   },
//   {
//     id: 4,
//     tag: "Flat 40% Off",
//     name: "AirPods Pro (2nd Gen)",
//     price: "₹12,999",
//     originalPrice: "₹21,999",
//     image: "/headphone.jpg",
//     href: "/products?category=audio",
//     bg: "bg-purple-500",
//   },
// ];

// export default function TopOffersSection() {
//   return (
//     <section className="py-10 bg-white p-6 md:p-0">
//       <div className="page-wrapper mx-auto pl-0 md:pl-0">
//         <h3 className="text-[1.45rem] font-medium text-gray-900 mb-6">
//           Top Offers
//         </h3>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center items-center justify-center">
//           {offers.map((offer, i) => (
//             <motion.div
//               key={offer.id}
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: i * 0.08 }}
//             >
//               <Link href={offer.href}>
//                 {/* Product image */}
//                 <div className=" flex items-center justify-center">
//                   <img
//                     src={offer.image}
//                     alt={offer.name}
//                     className="h-[160px] w-auto object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//                 {/* Big offer title */}{" "}
//               </Link>
//               <p className="mt-2 text-[1.05rem] md:text-[1.4rem] font-semibold text-black-600 leading-tight">
//                 {offer.tag}
//               </p>
//               {/* Product name */}
//               {/* <p className="text-sm text-gray-700 mt-1 truncate">
//                 {offer.name}
//               </p> */}

//               {/* Offer price */}
//               {/* <div className="flex items-center gap-2 mt-1.5"> */}
//               {/* <span className="text-base font-semibold text-gray-900 mt-2!">
//                 {offer.price}
//               </span> */}
//               {/* {offer.originalPrice && (
//                 <span className="text-xs text-gray-400 line-through">
//                   {offer.originalPrice}
//                 </span>
//               )} */}
//               {/* </div> */}
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

const offers = [
  {
    id: 1,
    tag: "Up to 30% Off",
    name: "Samsung Galaxy S22",
    image: "/apple-phone1.jpg",
    href: "/products?category=sk2hy7rv4tn7bfgb7m2keny5",
  },
  {
    id: 2,
    tag: "Flat ₹4,000 Off",
    name: "iPhone 13 (128GB)",
    image: "/apple-lap.jpg",
    href: "/products?category=smartphones",
  },
  {
    id: 3,
    tag: "Save ₹8,500",
    name: "MacBook Air M1",
    image: "/smartphone.jpg",
    href: "/products?category=laptops",
  },
  {
    id: 4,
    tag: "Flat 40% Off",
    name: "AirPods Pro (2nd Gen)",
    image: "/headphone.jpg",
    href: "/products?category=audio",
  },
];

export default function TopOffersSection() {
  const [categories, setCategories] = useState([]);

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

  return (
    <section className="py-10 bg-white p-6 md:p-0">
      <div className="page-wrapper mx-auto pl-0 md:pl-0">
        <h3 className="text-[1.45rem] font-medium text-gray-900 mb-6">
          Top Offers
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center items-center justify-center">
          {offers.map((offer, i) => {
            const cat = categories[i];
            const catName = cat?.name ?? cat?.attributes?.name ?? offer.name;
            const catKey = cat?.documentId ?? cat?.id;
            const href = catKey ? `/products?category=${catKey}` : offer.href;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={href} className="group block">
                  {/* Same image */}
                  <div className="flex items-center justify-center">
                    <img
                      src={offer.image}
                      alt={catName}
                      className="h-[160px] w-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Same offer text */}
                  <p className="mt-2 text-[1.05rem] md:text-[1.4rem] font-semibold text-black-600 leading-tight">
                    {offer.tag}
                  </p>

                  {/* Category name from API */}
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    {catName}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
