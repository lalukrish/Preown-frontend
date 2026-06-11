"use client";
import React from 'react';
import styles from './TradeInSection.module.css';
import trade1 from '@/assets/trade1.png';
import trade2 from '@/assets/trade2.png';
import trade3 from '@/assets/trade3.png';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

const TradeInSection = () => {
    // Add handler to open WhatsApp chat
    const handleWhatsapp = () => {
        const phone = '919995556734';
        const message = encodeURIComponent('Hi, I want to sell my phone.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };



       const router = useRouter();
    
    
        const handleNavClick = () => {
                router.push('/products?category=All%20Devices&all=true');
        };
    return (
        <section className={styles.tradeIn}>
            <h2 className={styles.heading}>Buy Smart Sell Fast Trade Up</h2>
            <p className={styles.sectionDescription}>
                Whether you're upgrading, cashing out, or switching devices — Preown makes it
                easy, fast, and profitable.
            </p>
            <div className={styles.header}>
                <button className={styles.sell} onClick={handleWhatsapp}>Sell Your Phone</button>
            </div>
            <div className={styles.topSection}>
                <motion.div
                    className={styles.card}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0 }}
                >
                    <h3>Buy Preowned Devices</h3>
                    <p style={{ color: "black", fontSize: "9px", marginBottom: "10px", marginTop: "0px" }}>Upgrade Without Overpaying</p>
                    <p>
                        Get premium iPhones, iPads, and MacBooks at up to 40% less than new — fully verified,
                        warranty-backed, and delivered to your door
                    </p>
                    <div className={styles.header}>
                        <button className={styles.sell} onClick={handleNavClick}>Shop Now</button>
                    </div>
                    <div className={styles.phoneCardImage}>
                        <img src={trade1.src} alt="Phone Exchange" />
                    </div>
                </motion.div>
                <motion.div
                    className={styles.card}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                >
                    <h3>Sell Your Device</h3>
                    <p style={{ color: "black", fontSize: "9px", marginBottom: "10px", marginTop: "0px" }}>Turn Your Device Into Instant Cash</p>

                    <p>
                        Get the best value for your old Apple or Samsung device. Free pickup. Instant payment.
                        No hassles.

                    </p>
                    <div className={styles.header}>
                        <button className={styles.sell_instant} onClick={handleWhatsapp}>Get Instant Quote</button>
                    </div>
                    <div className={styles.phoneCardImage_two}>
                        <img src={trade2.src} alt="Trade-In Value" />
                    </div>
                </motion.div>
            </div>

            <div className={styles.bottomSection} style={{ backgroundImage: `url(${trade3.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                <div className={styles.deviceImages}>
                    <motion.div
                        className={styles.tradeButton}
                        onClick={handleWhatsapp}
                    >
                        Trade Your Gadgets
                    </motion.div>
                </div>

                <p className={styles.description}>
                    Trade in your old gadget and upgrade to something better. Save big with our easy
                    exchange process                </p>

            </div>
        </section>
    );
};

export default TradeInSection;
