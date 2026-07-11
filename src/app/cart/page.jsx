// app/cart/page.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { items, ready, updateQty, removeFromCart, subtotal, itemCount } =
    useCart();
  const { user } = useAuth();

  const shipping = subtotal > 0 ? 0 : 0; // flat free shipping — adjust if needed
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Razorpay integration goes here later
    console.log("proceed to pay", { total, items });
  };

  if (!ready) return null; // avoid flashing an empty cart before localStorage loads

  if (items.length === 0) {
    return (
      <div className="r mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
          <FiShoppingBag size={26} className="text-cyan-900" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Browse our devices and add something you like.
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper mx-auto px-4 md:px-6 py-6 md:py-10 pb-32 md:pb-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Your Cart{" "}
          <span className="text-gray-400 font-normal">({itemCount})</span>
        </h1>
        <Link
          href="/products"
          className="hidden md:flex items-center gap-1.5 text-sm text-cyan-900 font-medium hover:underline"
        >
          <FiArrowLeft size={14} />
          Continue Shopping
        </Link>
      </div>

      {!user && (
        <div className="mb-6 rounded-lg bg-cyan-50 border border-cyan-100 px-4 py-3 text-sm text-cyan-900">
          You're not signed in — your cart is saved on this device. Log in to
          keep it saved to your account.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Item list */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-3 md:p-4"
            >
              {/* Image */}
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                {/* Desktop-only secondary detail */}
                {item.variant && (
                  <p className="hidden md:block text-xs text-gray-400 mt-0.5">
                    {item.variant}
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Qty stepper */}
              <div className="flex items-center border border-gray-200 rounded-lg flex-shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-cyan-900"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium text-gray-900">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-cyan-900"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Remove — desktop only inline, mobile as icon-only smaller */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                aria-label="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary — desktop sidebar, sticky */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-gray-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors"
            >
              Proceed to Pay
            </button>

            <p className="text-xs text-gray-400 text-center">
              Secure checkout powered by Razorpay
            </p>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4 z-40">
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          className="flex-1 max-w-[220px] py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors"
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}
