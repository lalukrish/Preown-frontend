"use client";
import React from 'react';
import styles from './WhatsAppButton.module.css';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const handleWhatsapp = () => {
        const phone = '919995556734';
        const message = encodeURIComponent('Hi, I need help with PreOwn products.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <button 
            className={styles.whatsappButton}
            onClick={handleWhatsapp}
            aria-label="Contact us on WhatsApp"
        >
            <FaWhatsapp className={styles.icon} />
        </button>
    );
};

export default WhatsAppButton;

