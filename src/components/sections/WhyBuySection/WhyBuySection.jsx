// "use client";
// import React from 'react';
// import styles from './WhyBuySection.module.css';
// import { motion } from 'framer-motion';
// import { FaShieldAlt, FaCheckCircle, FaHeadset } from 'react-icons/fa';

// const WhyBuySection = () => {
//     const features = [
//         {
//             icon: FaShieldAlt,
//             title: '30days Replacement warranty',
//             description: ''
//         },
//         {
//             icon: FaCheckCircle,
//             title: 'Quality Verified device',
//             description: ''
//         },
//         {
//             icon: FaHeadset,
//             title: '24x7 Support',
//             description: ''
//         }
//     ];

//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.2,
//                 delayChildren: 0.1,
//             },
//         },
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: { duration: 0.6, ease: 'easeOut' },
//         },
//     };

//     return (
//         <section className={styles.whyBuy}>
//             <motion.div
//                 className={styles.container}
//                 variants={containerVariants}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true, amount: 0.2 }}
//             >
//                 <motion.h2 className={styles.title} variants={itemVariants}>
//                   Why buy preowned from preown
//                 </motion.h2>

//                 <div className={styles.featuresGrid}>
//                     {features.map((feature, index) => {
//                         const Icon = feature.icon;
//                         return (
//                             <motion.div
//                                 key={index}
//                                 className={styles.featureCard}
//                                 variants={itemVariants}
//                             >
//                                 <div className={styles.iconWrapper}>
//                                     <Icon size={16} className={styles.icon} />
//                                 </div>
//                                 <h4 className={styles.featureTitle}>{feature.title}</h4>
//                                 {feature.description && <p className={styles.featureDescription}>{feature.description}</p>}
//                             </motion.div>
//                         );
//                     })}
//                 </div>
//             </motion.div>
//         </section>
//     );
// };

// export default WhyBuySection;

"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaCheckCircle, FaHeadset } from "react-icons/fa";

const WhyBuySection = () => {
  const features = [
    { icon: FaShieldAlt, title: "30days Replacement warranty" },
    { icon: FaCheckCircle, title: "Quality Verified device" },
    { icon: FaHeadset, title: "24x7 Support" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[rgb(246,246,246)] sm:bg-transparent px-4 py-6 sm:px-5 sm:py-[50px]">
      <motion.div
        className="max-w-[1200px] mx-auto py-14"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-center font-ubuntu text-base sm:text-[1.7rem] font-normal sm:font-medium mb-5 sm:mb-10 text-[#1a1a1a] tracking-[-0.02em] leading-tight"
          variants={itemVariants}
        >
          Why buy preowned from preown
        </motion.h2>

        <div className="flex flex-row flex-wrap items-center justify-center gap-3.5 sm:gap-8 max-w-[1000px] mx-auto ">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-row items-center gap-2.5 sm:gap-4 bg-white sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full sm:rounded-none"
                variants={itemVariants}
              >
                <div className="w-[30px] h-[30px] sm:w-10 sm:h-10 rounded-lg bg-transparent sm:bg-[#f5f5f7] flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <Icon className="text-[16px] sm:text-2xl text-cyan-600 w-3 sm:w-auto" />
                </div>
                <h4 className="font-ubuntu text-[0.8rem] sm:text-base md:text-xl font-medium text-[#1a1a1a] tracking-[-0.01em] leading-snug text-left">
                  {feature.title}
                </h4>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyBuySection;
