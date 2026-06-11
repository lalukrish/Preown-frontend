"use client";
import React from 'react';
import styles from './SellSection.module.css';
import { motion } from 'framer-motion';

const SellSection = () => {
    const handleWhatsapp = () => {
        const phone = '919995556734';
        const message = encodeURIComponent('Hi, I want to sell my device.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <motion.section
            className={styles.sellSection}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <h2 className={styles.heading}>Sell Your Device</h2>
            <p className={styles.sectionDescription}>
                Easily sell your devices through Preown. Get the best value for your old devices with a simple, hassle-free process. Free pickup and instant payment available.
            </p>
            <div className={styles.header}>
                <motion.button
                    className={styles.sellButton}
                    onClick={handleWhatsapp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Sell Now
                </motion.button>
            </div>
        </motion.section>
    );
};

export default SellSection; 