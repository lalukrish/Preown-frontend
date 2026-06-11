"use client";
import React, { useRef, useState, useEffect } from 'react';
import styles from './OwnPreownedSection.module.css';
import { motion } from 'framer-motion';
import { MdPersonOutline, MdLocationOn } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from '@/utils/config';

const OwnPreownedSection = () => {
    const [categories, setCategories] = useState([]);
    const marqueeRef = useRef(null);
    const marqueeInnerRef = useRef(null);
    const strapiBaseUrl = STRAPI_BASE_URL;
    const strapiImageBaseUrl = STRAPI_IMAGE_BASE_URL;
    const router = useRouter();
    const [marqueeDistance, setMarqueeDistance] = useState(0);

    // Fetch categories from Strapi API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${strapiBaseUrl}/categories?populate=*`);
                const data = await response.json();
                if (data.data) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [strapiBaseUrl]);

    // Measure marquee width after categories (and DOM) update
    useEffect(() => {
        const measure = () => {
            if (marqueeInnerRef.current && categories.length > 0) {
                const totalWidth = marqueeInnerRef.current.scrollWidth || 0;

                const sets = 3;
                const distance = totalWidth / sets;
                setMarqueeDistance(distance);
            }
        };

        // Measure after a tick to ensure images/layout settled
        const t = setTimeout(measure, 50);
        window.addEventListener('resize', measure);
        return () => {
            clearTimeout(t);
            window.removeEventListener('resize', measure);
        };
    }, [categories]);

    const handleCategoryClick = (category) => {
        router.push(`/products?category=${category.id}`);
    };

    const handleWhatsapp = () => {
        const phone = '919995556734';
        const message = encodeURIComponent('Hi..');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };



    return (
        <section className={styles.store}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>Own Preowned</h2>
                    <p className={styles.subtitle}>Save big on every device without compromising quality.</p>
                </div>

                <div className={styles.helpSection}>
                    <div className={styles.helpItem}>
                        <span className={styles.helpIcon}>
                            <MdPersonOutline size={32} color="#1976d2" />
                        </span>
                        <div>
                            <div className={styles.helpTitle}>Need shopping help?</div>
                            <a className={styles.helpLink} onClick={handleWhatsapp}>Talk with PreOwn &rarr;</a>
                        </div>
                    </div>
                    <div className={styles.helpItem}>
                        <span className={styles.helpIcon}>
                            <MdLocationOn size={32} color="#222" />
                        </span>
                        <div>
                            <div className={styles.helpTitle}>Visit a PreOwn Store</div>
                            <a className={styles.helpLink} href='https://maps.app.goo.gl/CkdwR8tBQ5H1a4Yd6'>Find one near you &rarr;</a>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={styles.marqueeContainer}
                ref={marqueeRef}
            >
                <motion.div
                    ref={marqueeInnerRef} // attach ref to measure width
                    className={styles.marquee}
                    animate={
                        !marqueeDistance
                            ? { x: 0 }
                            : { x: [0, -marqueeDistance] }
                    }
                    transition={
                        !marqueeDistance
                            ? { duration: 0 }
                            : {
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 60,
                                    ease: "linear",
                                },
                            }
                    }
                    style={{
                        minWidth: 'max-content',
                        display: 'flex',
                        willChange: 'transform' // Optimize for performance
                    }}
                >
                    {/* First set of items */}
                    {categories.map((cat, index) => (
                        <div key={cat.id || index} className={styles.item} onClick={() => handleCategoryClick(cat)}>
                            <img
                                src={cat.categoryImage ? `${strapiImageBaseUrl}${cat.categoryImage.url}` : ''}
                                alt={cat.categoryImage?.alternativeText || cat.name}
                                className={styles.image}
                            />
                            <p className={styles.label}>{cat.name}</p>
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {categories.map((cat, index) => (
                        <div key={`duplicate-${cat.id || index}`} className={styles.item} onClick={() => handleCategoryClick(cat)}>
                            <img
                                src={cat.categoryImage ? `${strapiImageBaseUrl}${cat.categoryImage.url}` : ''}
                                alt={cat.categoryImage?.alternativeText || cat.name}
                                className={styles.image}
                            />
                            <p className={styles.label}>{cat.name}</p>
                        </div>
                    ))}
                    {/* Second duplicate - fixed unique keys */}
                    {categories.map((cat, index) => (
                        <div key={`duplicate2-${cat.id || index}`} className={styles.item} onClick={() => handleCategoryClick(cat)}>
                            <img
                                src={cat.categoryImage ? `${strapiImageBaseUrl}${cat.categoryImage.url}` : ''}
                                alt={cat.categoryImage?.alternativeText || cat.name}
                                className={styles.image}
                            />
                            <p className={styles.label}>{cat.name}</p>
                        </div>
                    ))}
                    {/* Third duplicate */}
                    {categories.map((cat, index) => (
                        <div key={`duplicate3-${cat.id || index}`} className={styles.item} onClick={() => handleCategoryClick(cat)}>
                            <img
                                src={cat.categoryImage ? `${strapiImageBaseUrl}${cat.categoryImage.url}` : ''}
                                alt={cat.categoryImage?.alternativeText || cat.name}
                                className={styles.image}
                            />
                            <p className={styles.label}>{cat.name}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default OwnPreownedSection;

