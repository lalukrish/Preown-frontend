"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronRight,
  FiPhone,
} from "react-icons/fi";

export default function HeaderBar({
  logo,
  navLinks,
  categories,
  isActive,
  user,
  logout,
  itemCount,
  setShowAuthModal,
  isMenuOpen,
  setIsMenuOpen,
  navVisible,
  navRef,
  trackRef,
  isPaused,
  setIsPaused,
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  filteredSuggestions,
  handleSearch,
  handleSuggestionClick,
  searchWrapRef,
  mobileSearchOpen,
  setMobileSearchOpen,
  mobileSearchWrapRef,
  mobileSearchInputRef,
}) {
  return (
    <>
      <div className="page-wrapper mx-auto px-4 sm:px-0 md:px-10 xl:px-10 2xl:px-0">
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
              className="hidden md:block relative flex-1 max-w-[660px] xl:max-w-[680px] 2xl:max-w-[786]"
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
                <div className="relative group hover:cursor-pointer ">
                  <button className="flex items-center gap-1.5 text-gray-600 hover:text-cyan-800 text-sm font-medium hover:cursor-pointer">
                    <FiUser size={20} />
                    <span>{user.username}</span>
                  </button>

                  {/* invisible bridge — keeps hover chain alive between button and menu, no gap */}
                  <div className="absolute top-full h-3 w-full min-w-[220px] hidden group-hover:block" />

                  <div className="absolute  top-full pt-3 hidden group-hover:block z-50">
                    <div className="bg-white shadow-xl border border-gray-100 rounded-lg w-56 py-1  overflow-hidden">
                      <div className="px-4 py-5 border-b border-gray-100 mb-3">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.username}
                        </p>
                        {user.email && (
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        )}
                      </div>
                      {/* <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-800 transition-colors"
                      >
                        My Account
                      </Link> */}
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-cyan-800 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/warranty"
                        className="block px-4 py-2  text-[15px] text-gray-700 hover:bg-gray-50 hover:text-cyan-800 transition-colors"
                      >
                        warranty
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2  text-[15px] text-gray-700 hover:bg-gray-50 hover:text-cyan-800 transition-colors"
                      >
                        profile
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
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
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
        <div className="page-wrapper mx-auto ">
          <nav className="border-t border-gray-100 ">
            <ul className="flex items-start gap-3 ">
              {navLinks.map((link) => (
                <li key={link.href} className="flex-shrink-0  ">
                  <Link
                    href={link.href}
                    className={`block px-0 py-3 px-1 text-[13.5px] text-[#011C1F]! font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isActive(link.href)
                        ? "text-cyan-900 border-cyan-500"
                        : "text-gray-600 border-transparent hover:text-cyan-600 hover:border-cyan-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li className="w-px h-5 md:h-10 bg-gray-200 mx-3 flex-shrink-0" />

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

              <li className="flex-shrink-0 mt-1.5">
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
    </>
  );
}
