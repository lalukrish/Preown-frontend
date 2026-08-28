"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import logo from "@/assets/newlogo.png";
import AuthModal from "@/components/auth/authModal/index";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import OfferBar from "./offerbar";
import HeaderBar from "./Headerbar";
import MobileNavDrawer from "./Mobilenavdrawer";

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
  const [navHeight, setNavHeight] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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

  return (
    <>
      <OfferBar
        offers={offers}
        currentIndex={currentIndex}
        closed={closed}
        setClosed={setClosed}
        scrolled={scrolled}
        offerBarHeight={offerBarHeight}
        offerBarRef={offerBarRef}
      />

      <div
        ref={topBarRef}
        id="site-header"
        className="fixed left-0 right-0 z-50 bg-white border-b border-gray-100 transition-[top] duration-300 ease-in-out"
        style={{ top: scrolled || closed ? 0 : offerBarHeight }}
      >
        <HeaderBar
          logo={logo}
          navLinks={navLinks}
          categories={categories}
          isActive={isActive}
          user={user}
          logout={logout}
          itemCount={itemCount}
          setShowAuthModal={setShowAuthModal}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          navVisible={navVisible}
          navRef={navRef}
          trackRef={trackRef}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          filteredSuggestions={filteredSuggestions}
          handleSearch={handleSearch}
          handleSuggestionClick={handleSuggestionClick}
          searchWrapRef={searchWrapRef}
          mobileSearchOpen={mobileSearchOpen}
          setMobileSearchOpen={setMobileSearchOpen}
          mobileSearchWrapRef={mobileSearchWrapRef}
          mobileSearchInputRef={mobileSearchInputRef}
        />

        <MobileNavDrawer
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          navLinks={navLinks}
          isActive={isActive}
          user={user}
          logout={logout}
          setShowAuthModal={setShowAuthModal}
        />
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
