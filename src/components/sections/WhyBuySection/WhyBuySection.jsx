"use client";
import React from 'react';
import styles from './WhyBuySection.module.css';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaHeadset } from 'react-icons/fa';

const WhyBuySection = () => {
    const features = [
        {
            icon: FaShieldAlt,
            title: '30days Replacement warranty',
            description: ''
        },
        {
            icon: FaCheckCircle,
            title: 'Quality Verified device',
            description: ''
        },
        {
            icon: FaHeadset,
            title: '24x7 Support',
            description: ''
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className={styles.whyBuy}>
            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2 className={styles.title} variants={itemVariants}>
                  Why buy preowned from preown
                </motion.h2>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                className={styles.featureCard}
                                variants={itemVariants}
                            >
                                <div className={styles.iconWrapper}>
                                    <Icon size={16} className={styles.icon} />
                                </div>
                                <h4 className={styles.featureTitle}>{feature.title}</h4>
                                {feature.description && <p className={styles.featureDescription}>{feature.description}</p>}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default WhyBuySection;
