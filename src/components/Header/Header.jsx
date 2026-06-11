'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/assets/newlogo.png';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
    ];

    const isActive = (path) => pathname === path;

    return (
        <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className={styles.headerContent}>
                <Link href="/" className={styles.logo}>
                    <img src={logo.src} alt="Logo" className={styles.logoImage} />
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <ul className={styles.navList}>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contact Us Button */}
                <a
                    href="https://wa.me/yournumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactButton}
                >

                    <span className={styles.contactText}>Contact Us</span>
                </a>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        className={styles.mobileNav}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <ul className={styles.mobileNavList}>
                            {navLinks.map((link) => (
                                <li key={link.href} onClick={() => setIsMenuOpen(false)}>
                                    <Link
                                        href={link.href}
                                        className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

export default Header;