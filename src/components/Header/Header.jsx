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
  FiPhone,
} from "react-icons/fi";
import logo from "@/assets/newlogo.png";
import AuthModal from "@/components/auth/authModal/index";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { IoCloseCircle } from "react-icons/io5";

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

// Dummy search suggestions — replace with a real API call later
const DUMMY_SUGGESTIONS = [
  "iPhone 13",
  "iPhone 14 Pro",
  "Samsung Galaxy S22",
  "MacBook Air M1",
  "AirPods Pro",
  "iPad 9th Gen",
];

export default function Header({ cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const { itemCount } = useCart();
  const [offerBarHeight, setOfferBarHeight] = useState(42);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const trackRef = useRef(null);
  const topBarRef = useRef(null);
  const navRef = useRef(null);
  const searchWrapRef = useRef(null);
  const mobileSearchWrapRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const offerBarRef = useRef(null);
  const isActive = (path) => pathname === path;
  const { user, logout } = useAuth();

  const offer = offers[currentIndex];

  const filteredSuggestions = searchQuery.trim()
    ? DUMMY_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : DUMMY_SUGGESTIONS;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMobileSearchOpen(false);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    window.location.href = `/products?search=${encodeURIComponent(term)}`;
  };

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.3;
      setNavVisible(window.scrollY < threshold);
      setScrolled(window.scrollY > offerBarHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [offerBarHeight]);
  useEffect(() => {
    const measure = () => {
      const ob = closed ? 0 : offerBarRef.current?.offsetHeight || 0;
      const nv = navRef.current?.offsetHeight || 0;
      setOfferBarHeight(ob);
      setNavHeight(nv);
      document.documentElement.style.setProperty("--header-h", ob + nv + "px");
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [offer, closed]);
  // Close suggestions / mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (
        mobileSearchWrapRef.current &&
        !mobileSearchWrapRef.current.contains(e.target)
      ) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus mobile input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

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

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          `https://backapp.preown.store/api/top-header-tags`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch offers");
        }

        const result = await res.json();
        setOffers(result?.data || []);
      } catch (error) {
        console.error("Top offer API error:", error);
      }
    };

    fetchOffers();
  }, []);

  // Rotate offers
  useEffect(() => {
    if (offers.length <= 1 || closed) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [offers.length, closed]);

  if (offers.length === 0) {
    return null;
  }

  const content = (
    <span className="text-sm font-medium md:text-base">{offer.TagName}</span>
  );

  return (
    <>
      {/* Fixed top bar — always visible */}
      {!closed && offers.length > 0 && (
        <div
          ref={offerBarRef}
          className="relative z-[9999] grid grid-cols-[1fr_auto_1fr] items-center bg-cyan-900 px-4 py-2 text-white min-h-[42px] transition-transform duration-300 ease-in-out"
          style={{
            transform: scrolled
              ? `translateY(-${offerBarHeight}px)`
              : "translateY(0)",
          }}
        >
          <div />
          <div className="text-center">
            {offer.RedirectionLink ? (
              <Link
                href={offer.RedirectionLink}
                className="transition-opacity hover:opacity-80"
              >
                {content}
              </Link>
            ) : (
              content
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setClosed(true)}
              aria-label="Close offer"
              className="rounded-full p-1 transition hover:bg-white/10"
            >
              <IoCloseCircle size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
      <div
        ref={topBarRef}
        id="site-header"
        className="fixed left-0 right-0 z-50 bg-white border-b border-gray-100 transition-[top] duration-300 ease-in-out"
        style={{ top: scrolled || closed ? 0 : offerBarHeight }}
      >
        <div className="page-wrapper mx-auto px-6 md:px-10 xl:px-10 2xl:px-0">
          {mobileSearchOpen ? (
            /* MOBILE SEARCH — full white row, replaces normal header row */
            <div
              ref={mobileSearchWrapRef}
              className="flex md:hidden items-center gap-3 py-3 bg-white relative"
            >
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
                className="text-gray-600 p-1 flex-shrink-0"
              >
                <FiX size={22} />
              </button>

              <form
                className="flex-1 flex items-center border-2 border-gray-100 rounded-lg overflow-hidden focus-within:border-cyan-500 transition-colors"
                onSubmit={handleSearch}
              >
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
                  style={{ padding: "10px 14px" }}
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="bg-cyan-900 hover:bg-cyan-950 transition-colors text-white flex items-center justify-center flex-shrink-0"
                  style={{ padding: "10px 14px" }}
                >
                  <FiSearch size={18} />
                </button>
              </form>

              {/* Suggestions for mobile search */}
              <AnimatePresence>
                {filteredSuggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-12 right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-50 max-h-64 overflow-y-auto"
                  >
                    {filteredSuggestions.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-900 text-left transition-colors"
                        >
                          <FiSearch
                            size={13}
                            className="text-gray-400 flex-shrink-0"
                          />
                          {term}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* NORMAL HEADER ROW */
            <div className="flex items-center gap-4 py-3">
              <Link href="/" className="flex-shrink-0">
                <img
                  src={logo.src}
                  alt="Logo"
                  className="h-8   md:h-10 w-auto object-contain"
                />
              </Link>

              {/* Search — desktop only now, full bar with suggestions */}
              <div
                ref={searchWrapRef}
                className="hidden md:block relative flex-1 max-w-[660px] xl:max-w-[680px]"
              >
                <form
                  className="flex items-center border-2 border-gray-100 rounded-lg overflow-hidden focus-within:border-cyan-500 transition-colors"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
                    style={{ padding: "10px 14px" }}
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="bg-cyan-900 hover:bg-cyan-950 transition-colors text-white flex items-center justify-center flex-shrink-0"
                    style={{ padding: "10px 14px" }}
                  >
                    <FiSearch size={18} />
                  </button>
                </form>

                <AnimatePresence>
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-50 max-h-64 overflow-y-auto"
                    >
                      {filteredSuggestions.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(term)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-900 text-left transition-colors"
                          >
                            <FiSearch
                              size={13}
                              className="text-gray-400 flex-shrink-0"
                            />
                            {term}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Push right actions to end on mobile since search bar gone */}
              <div className="flex-1 md:hidden" />

              {/* Right actions */}
              <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                {/* Mobile search icon — opens white search row */}
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(true)}
                  aria-label="Open search"
                  className="md:hidden text-gray-600 p-1"
                >
                  <FiSearch size={20} />
                </button>

                {user ? (
                  <div className="relative group hover:cursor-pointer">
                    <button className="flex items-center gap-1.5 text-gray-600 hover:text-cyan-800 text-sm font-medium hover:cursor-pointer">
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
                    className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-cyan-800 text-sm font-medium hover:cursor-pointer"
                  >
                    <FiUser size={20} />
                    <span>Login</span>
                  </button>
                )}

                <Link
                  href="/cart"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-cyan-800 transition-colors text-sm font-medium"
                >
                  <div className="relative">
                    <FiShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-cyan-950 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:inline">Cart</span>
                </Link>

                {/* "New" offers chip */}
                <Link
                  href="/products?deals=true"
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 text-cyan-600 text-xs font-semibold hover:bg-orange-100 transition-colors"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-35" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
                  </span>
                  New
                </Link>

                {/* Contact button */}
                <Link
                  href="/about#contact"
                  className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-cyan-900 text-sm font-medium"
                >
                  <FiPhone size={18} />
                  <span>Contact</span>
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
          )}
        </div>

        {/* Category nav — collapses away after 30% scroll */}
        <motion.div
          ref={navRef}
          animate={{
            height: navVisible ? "auto" : 0,
            opacity: navVisible ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="hidden md:block overflow-hidden"
        >
          <div className="page-wrapper mx-auto px-6 md:px-10 xl:px-10 2xl:px-0">
            <nav className="border-t border-gray-100">
              <ul className="flex items-center">
                {navLinks.map((link) => (
                  <li key={link.href} className="flex-shrink-0">
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 text-[13.5px] text-[#011C1F]! font-medium whitespace-nowrap border-b-2 transition-colors ${
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
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] font-medium text-gray-600 whitespace-nowrap transition-colors hover:text-cyan-800 hover:bg-orange-50"
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
                    className="inline-block px-4 py-1.5 border  border-cyan-500  hover:bg-cyan-600 hover:text-white! text-[13px] font-semibold rounded-full transition-colors whitespace-nowrap"
                  >
                    Sell Your Device
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>

        {/* Mobile Nav Drawer */}
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
                {navLinks.map((link) => (
                  <li key={link.href} onClick={() => setIsMenuOpen(false)}>
                    <Link
                      href={link.href}
                      className={`block px-6 py-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-cyan-800"
                          : "text-gray-700 hover:text-cyan-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Login / Signup or account */}
                <li className="px-6 py-3 border-t border-gray-100 mt-1">
                  {user ? (
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-cyan-800"
                      >
                        <FiUser size={16} />
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-cyan-800 text-left mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowAuthModal(true);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-cyan-800"
                    >
                      <FiUser size={16} />
                      Login / Signup
                    </button>
                  )}
                </li>

                <li className="px-6 py-3">
                  <Link
                    href="/about#contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-cyan-800"
                  >
                    <FiPhone size={16} />
                    Contact Us
                  </Link>
                </li>
                <li className="px-6 pt-3 pb-2">
                  <a
                    href="https://wa.me/919995556734"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 bg-cyan-950 hover:bg-cyan-950 text-white text-sm font-semibold rounded-lg transition-colors"
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

      {/* Spacer */}
      <div style={{ height: offerBarHeight + (navVisible ? navHeight : 0) }} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
