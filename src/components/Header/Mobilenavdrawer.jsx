"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPhone } from "react-icons/fi";

export default function MobileNavDrawer({
  isMenuOpen,
  setIsMenuOpen,
  navLinks,
  isActive,
  user,
  logout,
  setShowAuthModal,
}) {
  return (
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
  );
}
