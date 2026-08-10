// "use client";
// import React from 'react';
// import styles from './TradeInSection.module.css';
// import trade1 from '@/assets/trade1.png';
// import trade2 from '@/assets/trade2.png';
// import trade3 from '@/assets/trade3.png';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';

// const cardVariants = {
//     hidden: { opacity: 0, y: 40 },
//     visible: { opacity: 1, y: 0 }
// };

// const TradeInSection = () => {
//     // Add handler to open WhatsApp chat
//     const handleWhatsapp = () => {
//         const phone = '919995556734';
//         const message = encodeURIComponent('Hi, I want to sell my phone.');
//         window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
//     };

//        const router = useRouter();

//         const handleNavClick = () => {
//                 router.push('/products?category=All%20Devices&all=true');
//         };
//     return (
//         <section className={styles.tradeIn}>
//             <h2 className={styles.heading}>Buy Smart Sell Fast Trade Up</h2>
//             <p className={styles.sectionDescription}>
//                 Whether you're upgrading, cashing out, or switching devices — Preown makes it
//                 easy, fast, and profitable.
//             </p>
//             <div className={styles.header}>
//                 <button className={styles.sell} onClick={handleWhatsapp}>Sell Your Phone</button>
//             </div>
//             <div className={styles.topSection}>
//                 <motion.div
//                     className={styles.card}
//                     variants={cardVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true, amount: 0.2 }}
//                     transition={{ duration: 0.7, ease: "easeOut", delay: 0 }}
//                 >
//                     <h3>Buy Preowned Devices</h3>
//                     <p style={{ color: "black", fontSize: "9px", marginBottom: "10px", marginTop: "0px" }}>Upgrade Without Overpaying</p>
//                     <p>
//                         Get premium iPhones, iPads, and MacBooks at up to 40% less than new — fully verified,
//                         warranty-backed, and delivered to your door
//                     </p>
//                     <div className={styles.header}>
//                         <button className={styles.sell} onClick={handleNavClick}>Shop Now</button>
//                     </div>
//                     <div className={styles.phoneCardImage}>
//                         <img src={trade1.src} alt="Phone Exchange" />
//                     </div>
//                 </motion.div>
//                 <motion.div
//                     className={styles.card}
//                     variants={cardVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true, amount: 0.2 }}
//                     transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
//                 >
//                     <h3>Sell Your Device</h3>
//                     <p style={{ color: "black", fontSize: "9px", marginBottom: "10px", marginTop: "0px" }}>Turn Your Device Into Instant Cash</p>

//                     <p>
//                         Get the best value for your old Apple or Samsung device. Free pickup. Instant payment.
//                         No hassles.

//                     </p>
//                     <div className={styles.header}>
//                         <button className={styles.sell_instant} onClick={handleWhatsapp}>Get Instant Quote</button>
//                     </div>
//                     <div className={styles.phoneCardImage_two}>
//                         <img src={trade2.src} alt="Trade-In Value" />
//                     </div>
//                 </motion.div>
//             </div>

//             <div className={styles.bottomSection} style={{ backgroundImage: `url(${trade3.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
//                 <div className={styles.deviceImages}>
//                     <motion.div
//                         className={styles.tradeButton}
//                         onClick={handleWhatsapp}
//                     >
//                         Trade Your Gadgets
//                     </motion.div>
//                 </div>

//                 <p className={styles.description}>
//                     Trade in your old gadget and upgrade to something better. Save big with our easy
//                     exchange process                </p>

//             </div>
//         </section>
//     );
// };

// export default TradeInSection;

"use client";
import React from "react";
import Image from "next/image";
import trade1 from "@/assets/trade1.png";
import trade2 from "@/assets/trade2.png";
import trade3 from "@/assets/trade3.png";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const TradeInSection = () => {
  const handleWhatsapp = () => {
    const phone = "919995556734";
    const message = encodeURIComponent("Hi, I want to sell my phone.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const router = useRouter();

  const handleNavClick = () => {
    router.push("/products?category=All%20Devices&all=true");
  };

  return (
    <section className="p-4 md:p-8 bg-gradient-to-br from-white via-[#e7f6fb] to-[#c2b2d6] rounded-[2rem] max-w-[1200px] mx-auto">
      <h2 className="text-center text-[1.3rem] md:text-[1.6rem] font-medium mb-2 text-[#222]">
        Buy Smart Sell Fast Trade Up
      </h2>
      <p className="text-center text-xs text-[#555] mb-6 max-w-[500px] mx-auto">
        Whether you're upgrading, cashing out, or switching devices — Preown
        makes it easy, fast, and profitable.
      </p>

      <div className="flex justify-center items-center mb-4">
        <button
          className="bg-black px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal text-[10px] mb-2.5 text-white cursor-pointer"
          onClick={handleWhatsapp}
        >
          Sell Your Phone
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap items-center md:justify-center gap-4 mb-5">
        <motion.div
          className="p-4 md:p-6 rounded-2xl text-center flex-1 basis-[300px] border border-[#e0e0e0] relative h-auto min-h-[320px] md:h-[500px] bg-white overflow-hidden w-full"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0 }}
        >
          <h3 className="text-base md:text-xl font-medium">
            Buy Preowned Devices
          </h3>
          <p className="text-cyan-800 text-[9px] md:text-[12px]! mb-3.5 mt-1">
            Upgrade Without Overpaying
          </p>
          <p className="text-[11px] md:text-[15px] max-w-[95vw] md:max-w-[410px] text-center mx-auto text-gray-500 mb-2.5 relative">
            Get premium iPhones, iPads, and MacBooks at up to 40% less than new
            — fully verified, warranty-backed, and delivered to your door
          </p>
          <div className="flex justify-center items-center mb-4">
            <button
              className="bg-cyan-900 hover:bg-cyan-950 px-5 py-3.5 md:py-2  text-[10px] md:text-[13px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal  mb-2.5 text-white cursor-pointer"
              onClick={handleNavClick}
            >
              Shop Now
            </button>
          </div>
          <div className="flex justify-center items-center absolute bottom-0 left-0 right-0  ">
            <Image
              src={trade1}
              alt="Phone Exchange"
              className="mt-4  w-full max-w-[100px] md:max-w-[260px]  h-[270px]"
              placeholder="blur"
              sizes="(max-width: 768px) 160px, 400px"
            />
          </div>
        </motion.div>

        <motion.div
          className="p-4 md:p-6 rounded-2xl text-center flex-1 basis-[300px] border border-[#e0e0e0] relative h-auto min-h-[320px] md:h-[500px] bg-white overflow-hidden w-full"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <h3 className="text-base md:text-[16px]! font-medium">
            Sell Your Device
          </h3>
          <p className="text-cyan-800 text-[9px] md:text-[12px]! mb-2.5 mt-0">
            Turn Your Device Into Instant Cash
          </p>
          <p className="text-[11px]  md:text-[16px]!  max-w-[95vw] md:max-w-[410px] text-center mx-auto text-gray-500 mb-2.5 relative">
            Get the best value for your old Apple or Samsung device. Free
            pickup. Instant payment. No hassles.
          </p>
          <div className="flex justify-center items-center mb-4">
            <button
              className="hidden md:inline-block bg-black px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal text-[10px] mb-2.5 text-white cursor-pointer"
              onClick={handleWhatsapp}
            >
              Get Instant Quote
            </button>
          </div>
          <div className="flex justify-center items-center absolute bottom-0 left-0 right-0">
            <Image
              src={trade2}
              alt="Trade-In Value"
              className="mt-4 w-full max-w-[160px] md:max-w-full h-auto"
              placeholder="blur"
              sizes="(max-width: 768px) 160px, 400px"
            />
          </div>
        </motion.div>
      </div>

      {/* Background image section — Next/Image used as a fill layer instead of CSS background-image */}
      <div className="relative text-center p-4 md:p-6 h-auto min-h-[180px] md:h-[300px] rounded-2xl border border-[#e0e0e0] bg-white overflow-hidden flex flex-col justify-center items-center">
        <Image
          src={trade3}
          alt=""
          fill
          className="object-cover -z-10"
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 1200px"
        />

        <div className="flex flex-col items-center relative z-10 ">
          <motion.div
            className="bg-cyan-900 hover:bg-cyan-950 px-5 py-3.5 md:py-2  text-[9px] md:text-[13px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-normal  my-4 md:mb-2.5 md:mt-0 text-white cursor-pointer w-full md:w-fit min-w-[120px] text-center"
            onClick={handleWhatsapp}
          >
            Trade Your Gadgets
          </motion.div>
        </div>

        <p className="relative z-10 text-[11px]  md:text-[16px]! max-w-[95vw] md:max-w-[500px] mx-auto text-black md:text-[#6b6b6b] mt-2.5">
          Trade in your old gadget and upgrade to something better. Save big
          with our easy exchange process
        </p>
      </div>
    </section>
  );
};

export default TradeInSection;
