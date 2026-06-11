"use client";
import React, { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';
import { motion } from 'framer-motion';
import { FaTruck, FaShieldAlt, FaMoneyBillWave } from 'react-icons/fa';

const HeroSection = () => {
    const videoRef = useRef(null);

    const handleExploreClick = (e) => {
        e.preventDefault();
        const section = document.getElementById('explore');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleWhatsapp = () => {
        const phone = '919995556734';
        const message = encodeURIComponent('Hi, I want to sell my device.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
    }, []);

    return (
        <motion.section
            className={styles.hero}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className={styles.textContent}>
                <h1>
                   Own Premium  <span className={styles.highlight}>  Preowned</span> Devices <strong>  Trusted ,</strong>  <strong>Verified ,</strong>  <strong>Affordable</strong>
                </h1>
                <p className={styles.pricing}>Shop verified gadgets — up to 40% cheaper than new. 100% functional quality-checked, and
                    warranty-backed.<sup></sup></p>

                <span className={styles.buttons}>
                    <a
                        href="#explore"
                        className={styles.buttonFilled}
                        onClick={handleExploreClick}
                    >
                        Explore Gadgets
                    </a>

                    <a
                        href="#explore"
                        className={styles.buttonOutlined}
                        onClick={handleWhatsapp}
                    >
                        Sell Your Gadgets
                    </a>
                </span>
            </div>
            <div className={styles.imageContainer}>
                <motion.video
                    ref={videoRef}
                    src="/hero_video.mp4"
                    className={styles.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
                />
            </div>
            
        </motion.section>
    );
};

export default HeroSection;
