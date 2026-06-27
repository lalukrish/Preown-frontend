"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import logo from "@/assets/newlogo.png";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <FiX size={20} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center px-8 pt-8">
              <img
                src={logo.src}
                alt="Logo"
                className="h-14 w-auto object-contain"
              />

              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="mt-2 text-center text-sm text-gray-500">
                {isLogin
                  ? "Sign in to continue shopping."
                  : "Create an account to continue."}
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-6">
              <form className="space-y-4">
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

                {!isLogin && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium text-orange-500 hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
