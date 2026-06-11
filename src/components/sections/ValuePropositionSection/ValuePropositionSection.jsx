"use client";
import React from 'react';
import styles from './ValuePropositionSection.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ValuePropositionSection = () => {
    const cards = [
        {
            id: 1,
            title: "Buy Smartly with Confidence",
            content: `
            At <strong>Preown by applebae</strong>, we make buying pre-owned smart devices simple, safe, and transparent. Every device we offer is carefully inspected, tested, and verified by experts to ensure you receive high-quality performance without any hidden issues. From battery health to internal components and overall functionality, each product must meet our strict standards before it reaches you.
            
            We understand that purchasing a pre-owned device can feel uncertain—that’s why we provide honest condition ratings, clear product details, and pricing based on real market value. You always know exactly what you’re getting.
            
            
            `,
            
            image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop",
            alt: "Person holding and examining a smartphone"
        }
    ];

    return (
        <section className={styles.valueProposition}>
            <div className={styles.container}>
                <div className={styles.cardsList}>
                    {cards.map((card, index) => (
                        <motion.article
                            key={card.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        >
                            <div className={styles.cardImage}>
                                <Image
                                    src={card.image}
                                    alt={card.alt}
                                    width={600}
                                    height={400}
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardHeading}>{card.title}</h3>
                                <div className={styles.cardBody}>
                                    <p
                                        className={styles.cardDescription}
                                        dangerouslySetInnerHTML={{ __html: card.content }}
                                    />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuePropositionSection;
