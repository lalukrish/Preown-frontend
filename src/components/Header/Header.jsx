"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import logo from "@/assets/newlogo.png";
import AuthModal from "@/components/auth/authModal/index";
//import categoryImg from "@/assets/phone1.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

const categories = [
  {
    href: "/products?category=smartphones",
    label: "Smartphones",
    img: "/banner1.jpg",
  },
  {
    href: "/products?category=laptops",
    label: "Laptops & Gaming",
    img: "/phone1.png",
  },
  {
    href: "/products?category=tablets",
    label: "Tablets",
    img: "/banner2.jpg",
  },
  {
    href: "/products?category=wearables",
    label: "Wearables",
    img: "/phone1.png",
  },
  { href: "/products?category=audio", label: "Audio", img: "/phone1.png" },
  {
    href: "/products?category=accessories",
    label: "Accessories",
    img: "/phone1.png",
  },
];

export default function Header({ cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  console.log(showAuthModal);
  const isActive = (path) => pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Top Bar */}
        <div className="flex items-center gap-4 py-3 border-b border-gray-100">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={logo.src}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Search */}
          <form
            className="flex flex-1 items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-orange-500 transition-colors"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
              style={{ padding: "10px 16px" }}
            />
            <button
              type="submit"
              aria-label="Search"
              className="bg-orange-500 hover:bg-orange-600 transition-colors text-white flex items-center justify-center flex-shrink-0"
              style={{ padding: "10px 16px" }}
            >
              <FiSearch size={20} />
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <button
              // href="/login"
              onClick={() => setShowAuthModal(true)}
              className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium"
            >
              <FiUser size={20} />
              <span>Login</span>
            </button>

            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium"
            >
              <div className="relative">
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>

            <button
              className="md:hidden text-gray-600 p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Category Nav Row — desktop only */}
        <nav className="hidden md:block border-b border-gray-100">
          <ul className="flex items-center">
            {/* Static nav links */}
            {navLinks.map((link) => (
              <li key={link.href} className="flex-shrink-0">
                <Link
                  href={link.href}
                  className={`block px-4 py-3 text-[13.5px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive(link.href)
                      ? "text-orange-500 border-orange-500"
                      : "text-gray-600 border-transparent hover:text-orange-500 hover:border-orange-500"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li className="w-px h-5 bg-gray-200 mx-3 flex-shrink-0" />

            {/* Scrolling carousel */}
            <li className="flex-1 min-w-0">
              <div className="overflow-hidden">
                <div className="marquee-track flex">
                  {[...categories, ...categories].map((cat, i) => (
                    <Link
                      key={i}
                      href={cat.href}
                      className="flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium whitespace-nowrap text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      <img
                        src={cat.img}
                        alt={cat.label}
                        style={{
                          width: 22,
                          height: 22,
                          objectFit: "contain",
                          flexShrink: 0,
                        }}
                      />
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Divider */}
            <li className="w-px h-5 bg-gray-200 mx-3 flex-shrink-0" />

            {/* Sell Your Device */}
            <li className="flex-shrink-0">
              <a
                href="https://wa.me/919995556734"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white! text-[13px] font-semibold rounded-full transition-colors whitespace-nowrap"
              >
                Sell Your Device
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ul className="py-2">
              {[...navLinks, ...categories].map((link) => (
                <li key={link.href} onClick={() => setIsMenuOpen(false)}>
                  <Link
                    href={link.href}
                    className={`block px-6 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-orange-500"
                        : "text-gray-700 hover:text-orange-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="px-6 pt-3 pb-2">
                <a
                  href="https://wa.me/919995556734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sell Your Device
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}
