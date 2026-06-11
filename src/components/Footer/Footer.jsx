"use client";

import React, { useRef } from 'react';
import styles from './Footer.module.css';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import logo from '../../assets/PreOwn.png';

function Footer() {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const handleWhatsapp = (message = 'Hi.') => {
    const phone = '919995556734';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handleSellDevice = () => {
    handleWhatsapp('Hi, I want to sell my device.');
  };

  const sitemapLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/products', label: 'Products' },
    { href: '/blog', label: 'Blog' },
    { href: '/best-used-gadget-in-calicut', label: 'Calicut Store' },
    { href: '/best-used-gadget-in-kochi', label: 'Kochi Store' },
  ];

  return (
    <motion.footer
      ref={ref}
      className={styles.footer}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={styles.footerContent}>
        {/* Top Section with CTAs */}
        <div className={styles.ctaSection}>
          <p className={styles.subtitle}>PREMIUM PHONES & GADGETS FOR YOU</p>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDescription}>
            Preown by applebae is your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.
          </p>
          <div className={styles.ctaButtons}>
            <a href="tel:+919995556734" className={styles.secondaryButton}>
              Talk with Preown
            </a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Company Info Column */}
          <div className={styles.column}>
            <div className={styles.logoContainer}>
              <img src={logo.src} alt="PreOwn Logo" className={styles.logoImage} />
            </div>
            <p className={styles.companyDescription}>
              Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.
            </p>
            <div className={styles.socialLinks}>
              <a 
                href="https://www.instagram.com/i_applebae/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://www.facebook.com/marketplace/profile/100004581601128/?ref=permalink&tab=listings&mibextid=6ojiHh" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://chat.whatsapp.com/EYnQKnUhFQhL8VdB9pQNIs?mode=ac_t" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a 
                href="https://www.google.com/search?sca_esv=4ab2dcfe03ad0fc5&sxsrf=AE3TifMph-RMJsgaw2YYM9lNtgLHpEvokQ%3A1752747649610&kgmid=%2Fg%2F11lf7cpk3s&q=Phonebae&shndl=30&shem=lcuae%2Clsptb2%2Csdl1p%2Cuaasie&source=sh%2Fx%2Floc%2Funi%2Fm1%2F1&kgs=56d75edf9abdf1c5" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Location"
              >
                <FaMapMarkerAlt />
              </a>
            </div>
          </div>

          {/* Sitemap Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {sitemapLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contact Us</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <div>
                  <p className={styles.contactLabel}>Kochi</p>
                  <a href="tel:8590593909" className={styles.contactLink}>8590593909</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <div>
                  <p className={styles.contactLabel}>Kozhikode</p>
                  <a href="tel:9995556734" className={styles.contactLink}>9995556734</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <div>
                  <p className={styles.contactLabel}>Location</p>
                  <a 
                    href="https://www.google.com/search?sca_esv=4ab2dcfe03ad0fc5&sxsrf=AE3TifMph-RMJsgaw2YYM9lNtgLHpEvokQ%3A1752747649610&kgmid=%2Fg%2F11lf7cpk3s&q=Phonebae&shndl=30&shem=lcuae%2Clsptb2%2Csdl1p%2Cuaasie&source=sh%2Fx%2Floc%2Funi%2Fm1%2F1&kgs=56d75edf9abdf1c5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {currentYear} Preown by applebae. Trusted platform for premium pre-owned gadgets.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
