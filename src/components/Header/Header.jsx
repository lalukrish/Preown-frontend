"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import logo from "@/assets/newlogo.png";
import AuthModal from "@/components/auth/authModal/index";
import { useAuth } from "@/context/AuthContext";

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
  { href: "/products?category=tablets", label: "Tablets", img: "/banner2.jpg" },
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
  const [isPaused, setIsPaused] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [navHeight, setNavHeight] = useState(0);

  const pathname = usePathname();
  const trackRef = useRef(null);
  const topBarRef = useRef(null);
  const navRef = useRef(null);

  const isActive = (path) => pathname === path;
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Auto-scroll category carousel
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isPaused) return;

    const interval = setInterval(() => {
      const card = track.querySelector("a");
      if (!card) return;
      const step = card.offsetWidth + 12;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + step,
        behavior: "smooth",
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Measure heights for spacer + CSS var
  useEffect(() => {
    const measure = () => {
      const tb = topBarRef.current?.offsetHeight || 0;
      const nv = navRef.current?.offsetHeight || 0;
      setTopBarHeight(tb);
      setNavHeight(nv);
      document.documentElement.style.setProperty("--header-h", tb + nv + "px");
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Hide category nav after scrolling 30% of viewport height
  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.3;
      setNavVisible(window.scrollY < threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed top bar — always visible */}
      <div
        ref={topBarRef}
        id="site-header"
        className=" fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
      >
        <div className=" page-wrapper mx-auto px-6 md:px-10 xl:px-10 2xl:px-0">
          <div className="flex items-center gap-4 py-3">
            <Link href="/" className="flex-shrink-0">
              <img
                src={logo.src}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <form
              className="flex flex-1 items-center border-2 border-gray-100 rounded-lg overflow-hidden focus-within:border-cyan-500 transition-colors"
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
                className="bg-cyan-900 hover:bg-orange-600 transition-colors text-white flex items-center justify-center flex-shrink-0"
                style={{ padding: "10px 16px" }}
              >
                <FiSearch size={20} />
              </button>
            </form>

            <div className="flex items-center gap-5 flex-shrink-0">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500 text-sm font-medium">
                    <FiUser size={20} />
                    <span>{user.username}</span>
                  </button>
                  <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-lg mt-1 w-40 py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-orange-500 text-sm font-medium"
                >
                  <FiUser size={20} />
                  <span>Login</span>
                </button>
              )}

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
        </div>

        {/* Category nav — collapses away after 30% scroll, still part of the fixed block */}
        <motion.div
          ref={navRef}
          animate={{
            height: navVisible ? "auto" : 0,
            opacity: navVisible ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="hidden md:block overflow-hidden"
        >
          <div className=" page-wrapper mx-auto px-6 md:px-10 xl:px-10 2xl:px-0">
            <nav className="border-t border-gray-100">
              <ul className="flex items-center">
                {navLinks.map((link) => (
                  <li key={link.href} className="flex-shrink-0">
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 text-[13.5px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                        isActive(link.href)
                          ? "text-cyan-900 border-cyan-500"
                          : "text-gray-600 border-transparent hover:text-cyan-600 hover:border-cyan-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                <li className="w-px h-5 bg-gray-200 mx-3 flex-shrink-0" />

                <li className="flex-1 min-w-0 relative">
                  <div
                    ref={trackRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-1"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] font-medium text-gray-600 whitespace-nowrap transition-colors hover:text-orange-500 hover:bg-orange-50"
                      >
                        <img
                          src={cat.img}
                          alt={cat.label}
                          className="w-[22px] h-[22px] object-contain flex-shrink-0"
                        />
                        {cat.label}
                      </Link>
                    ))}
                  </div>

                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent" />
                  <div className="scroll-hint-arrow">
                    <FiChevronRight size={14} />
                  </div>
                </li>

                <li className="w-px h-5 bg-gray-200 mx-3 flex-shrink-0" />

                <li className="flex-shrink-0">
                  <a
                    href="https://wa.me/919995556734"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-1.5 bg-cyan-600 hover:bg-orange-600 text-white! text-[13px] font-semibold rounded-full transition-colors whitespace-nowrap"
                  >
                    Sell Your Device
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>

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
      </div>

      {/* Spacer — pushes page content down by the fixed header's current height */}
      <div style={{ height: topBarHeight + (navVisible ? navHeight : 0) }} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
