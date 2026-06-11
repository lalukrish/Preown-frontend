"use client";
import React from 'react';
import styles from './IntroductionSection.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

const IntroductionSection = () => {
    return (
        <motion.section
            className={styles.introduction}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className={styles.container}>
                <div className={styles.content}>
                <p className={styles.paragraph}>
    Welcome to <strong>Preown by applebae</strong>, your trusted source for premium pre-owned smartphones, tablets, laptops, and gadgets. 
    We offer certified, quality-checked devices from top brands, ensuring high performance, authenticity, and great value. 
    <strong>Our mission</strong> is to make premium technology affordable with transparency, warranty-backed products, and a seamless customer experience.
</p>

                    <Link href="/about" className={styles.aboutButton}>
                        About Us
                    </Link>
                </div>
            </div>
        </motion.section>
    );
};

export default IntroductionSection;

