"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './FeaturedSection.module.css';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PhoneCard from '@/components/Common/PhoneCard/PhoneCard';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from '@/utils/config';

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15 }
    }),
};

const FeaturedSection = ({ featured }) => {
    const [selectedBrand, setSelectedBrand] = useState('Apple');
    const [phones, setPhones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(0);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
    const router = useRouter();

    // Fetch products from Strapi API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${STRAPI_BASE_URL}/products?populate=*`);

                if (response.data && response.data.data) {
                    let filteredProducts = response.data.data;

                    // Filter by featured if featured prop is true
                    if (featured) {
                        filteredProducts = filteredProducts.filter(product => product.Isfeatured === true);
                    }

                    // Filter by brand/category
                    if (!featured && selectedBrand) {
                        // Map selected brand to category names
                        const categoryMap = {
                            'Apple': ['iphone'],
                            'Samsung': ['Samsung']
                        };

                        const allowedCategories = categoryMap[selectedBrand] || [];
                        if (allowedCategories.length > 0) {
                            filteredProducts = filteredProducts.filter(product =>
                                product.category &&
                                allowedCategories.includes(product.category.name)
                            );
                        }
                    }

                    filteredProducts = filteredProducts.sort((a, b) => {
                        const getTimestamp = (item) => {
                            const dateValue = item.createdAt || item.publishedAt || item.updatedAt;
                            return dateValue ? new Date(dateValue).getTime() : 0;
                        };
                        return getTimestamp(b) - getTimestamp(a);
                    });

                    setPhones(filteredProducts);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setPhones([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedBrand, featured]);

    useEffect(() => {
        const updateDisplayCount = () => {
            // Show only 3 devices (latest) for both featured and regular sections
            setDisplayCount(6);
        };
        updateDisplayCount();
        window.addEventListener('resize', updateDisplayCount);
        return () => window.removeEventListener('resize', updateDisplayCount);
    }, [featured]);

    const handleWhatsapp = (buy) => {
        const phone = '919995556734';
        const message = encodeURIComponent(`Hi, I want by ${buy} .`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };




    return (
        <motion.section
            ref={sectionRef}
            className={styles.phoneSelector}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            id='explore'
        >

            {featured ? <h2 className={styles.title}>Top Featured Devices for You</h2>
                :

                <h2 className={styles.title}>Which Device is Right for You</h2>
            }

            {featured ? "" :
                <div className={styles.toggleWrapper}>
                    <div className={styles.toggle}>
                        <button
                            className={`${styles.toggleBtn} ${selectedBrand === 'Apple' ? styles.active : ''}`}
                            onClick={() => setSelectedBrand('Apple')}
                        >
                            Apple
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${selectedBrand === 'Samsung' ? styles.active : ''}`}
                            onClick={() => setSelectedBrand('Samsung')}
                        >
                            Samsung
                        </button>
                    </div>
                </div>
            }

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading products...</p>
                </div>
            ) : phones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>No products found.</p>
                </div>
            ) : (
                <div className={styles.cardGrid}>
                    {phones.slice(0, displayCount).map((phone, index) => {
                        const imageUrl = phone.image && phone.image[0]
                            ? `${STRAPI_IMAGE_BASE_URL}${phone.image[0].url}`
                            : '/placeholder.jpg';

                        const productSlug = phone?.slug || phone?.documentId || phone?.id;
                        const href = `/products/${productSlug}`;

                        const handleCardClick = () => {
                            router.push(href);
                        };

                        return (
                            <PhoneCard
                                key={phone.id || phone.documentId || index}
                                index={index}
                                imageUrl={imageUrl}
                                name={phone.name}
                                price={phone.price}
                                href={href}
                                onCardClick={handleCardClick}
                                onBuyClick={() => handleWhatsapp(phone.name)}
                            />
                        );
                    })}
                </div>
            )}

            {/* <a href="#" className={styles.shopLink}>Shop all Iphone and andriod</a> */}
        </motion.section>
    );
};

export default FeaturedSection;
