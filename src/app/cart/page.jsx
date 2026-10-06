"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/authModal";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    ready,
    removeFromCart,
    subtotal,
    itemCount,
    addresses,
    loadingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    regionInfo,
  } = useCart();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [proceedError, setProceedError] = useState("");

  const total = subtotal;
  const codBlocked = regionInfo && !regionInfo.codAvailable;

  const handleProceedClick = () => {
    setProceedError("");
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (addresses.length === 0) {
      setProceedError("Add a delivery address in your profile first");
      return;
    }
    if (!selectedAddressId) {
      setProceedError("Pick delivery address first");
      return;
    }
    if (!paymentMethod) {
      setProceedError("Pick a payment method");
      return;
    }
    if (paymentMethod === "cod" && codBlocked) {
      setProceedError("COD not available for this address");
      return;
    }
    router.push("/place-order");
  };

  if (!ready) return null;

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
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-black text-white! text-sm font-semibold hover:bg-black transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper mx-auto px-4 md:px-0 py-6 md:py-10 pb-32 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Your Cart{" "}
          <span className="text-gray-400 font-normal">({itemCount})</span>
        </h1>
        <Link
          href="/products"
          className="hidden md:flex items-center gap-1.5 text-sm text-white font-medium hover:underline"
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
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-3 md:p-4"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                {item.variant && (
                  <p className="hidden md:block text-xs text-gray-400 mt-0.5">
                    {item.variant}
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg flex-shrink-0">
                <span className="w-6 text-center text-sm font-medium text-gray-900">
                  {item.qty}
                </span>
              </div>
              <button
                onClick={() => removeFromCart(item.documentCartId)}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                aria-label="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <AddressPicker
              addresses={addresses}
              loading={loadingAddresses}
              user={user}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />

            <PaymentMethodPicker
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              regionInfo={regionInfo}
              selectedAddressId={selectedAddressId}
            />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
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
              {proceedError && (
                <p className="text-sm text-red-500">{proceedError}</p>
              )}
              <button
                onClick={handleProceedClick}
                className="w-full py-3.5 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors hover:cursor-pointer"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4 z-40">
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          onClick={handleProceedClick}
          className="flex-1 max-w-[220px] py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors"
        >
          Proceed to Pay
        </button>
      </div>
      {proceedError && (
        <p className="lg:hidden text-sm text-red-500 mt-2 px-4">
          {proceedError}
        </p>
      )}

      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

function AddressPicker({
  addresses,
  loading,
  user,
  selectedAddressId,
  setSelectedAddressId,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Deliver to</h2>
        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-1 text-xs font-medium text-cyan-900 hover:underline cursor-pointer"
          >
            <FiPlus size={12} /> Add new
          </Link>
        )}
      </div>

      {loading && <p className="text-sm text-gray-400">Loading addresses...</p>}

      {!loading && user && addresses.length === 0 && (
        <p className="text-sm text-gray-500">
          No saved address.{" "}
          <Link
            href="/profile"
            className="text-cyan-900 font-medium hover:underline"
          >
            Add one in your profile
          </Link>
        </p>
      )}

      {!user && !loading && (
        <p className="text-sm text-gray-500">
          Log in to pick a delivery address.
        </p>
      )}

      {addresses.map((addr) => (
        <label
          key={addr.id}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
            selectedAddressId === addr.id
              ? "border-cyan-900 bg-cyan-50"
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="address"
            checked={selectedAddressId === addr.id}
            onChange={() => setSelectedAddressId(addr.id)}
            className="mt-1"
          />
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {addr.AddressLine1}, {addr.AddressLine2}
            </p>
            <p className="text-gray-500">
              {addr.City}, {addr.District}, {addr.State} - {addr.PinCode}
            </p>
            <p className="text-gray-400">{addr.PhoneNumber}</p>
          </div>
        </label>
      ))}
    </div>
  );
}

function PaymentMethodPicker({
  paymentMethod,
  setPaymentMethod,
  regionInfo,
  selectedAddressId,
}) {
  const codDisabled =
    !selectedAddressId || !regionInfo || !regionInfo.codAvailable;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <h2 className="text-base font-semibold text-gray-900">Payment Method</h2>

      <label
        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
          paymentMethod === "razorpay"
            ? "border-cyan-900 bg-cyan-50"
            : "border-gray-200"
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={paymentMethod === "razorpay"}
          onChange={() => setPaymentMethod("razorpay")}
        />
        <span className="text-sm text-gray-800 font-medium">Pay Now</span>
      </label>

      <label
        className={`flex items-center gap-3 p-3 rounded-lg border ${
          codDisabled
            ? "border-gray-100 opacity-50 cursor-not-allowed"
            : "border-gray-200 cursor-pointer"
        } ${paymentMethod === "cod" ? "border-cyan-900 bg-cyan-50" : ""}`}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={paymentMethod === "cod"}
          disabled={codDisabled}
          onChange={() => setPaymentMethod("cod")}
        />
        <span className="text-sm text-gray-800 font-medium">
          Cash on Delivery
        </span>
      </label>

      {selectedAddressId && regionInfo && (
        <div
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg ${
            regionInfo.codAvailable
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {regionInfo.codAvailable ? (
            <FiCheckCircle size={14} />
          ) : (
            <FiXCircle size={14} />
          )}
          {regionInfo.codAvailable
            ? `COD available (${regionInfo.label})`
            : `COD not available for this location (${regionInfo.label})`}
        </div>
      )}
    </div>
  );
}
