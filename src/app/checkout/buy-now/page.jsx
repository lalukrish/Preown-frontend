"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/auth/authModal";
import { BUY_NOW_KEY } from "@/app/products/[slug]/ProductDetailClient"; // adjust path if needed

// TODO: swap in your real order-placement endpoint + payload shape.
// This is a best-guess based on the other endpoints in CartContext —
// confirm before shipping.
const ORDER_API = "https://backapp.preown.store/api/orders";

export default function BuyNowCheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const {
    addresses,
    loadingAddresses,
    fetchAddresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    regionInfo,
  } = useCart();

  const [item, setItem] = useState(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [proceedError, setProceedError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // pull the single item straight from sessionStorage — never touches cart
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BUY_NOW_KEY);
      setItem(raw ? JSON.parse(raw) : null);
    } catch {
      setItem(null);
    } finally {
      setCheckedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchAddresses();
  }, [token, fetchAddresses]);

  const codBlocked = regionInfo && !regionInfo.codAvailable;
  const codExtra =
    paymentMethod === "cod" && regionInfo?.percent && item
      ? Math.round((item.price * regionInfo.percent) / 100)
      : 0;
  const total = item ? item.price + codExtra : 0;

  const handlePlaceOrder = async () => {
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

    setPlacing(true);
    try {
      const res = await fetch(ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item.id,
          quantity: item.qty || 1,
          addressId: selectedAddressId,
          paymentMethod,
        }),
      });
      if (!res.ok) throw new Error("Order failed");

      sessionStorage.removeItem(BUY_NOW_KEY);
      router.push("/order-success");
    } catch (err) {
      console.error("place order error:", err);
      setProceedError("Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (!checkedStorage) return null;

  if (!item) {
    return (
      <div className="mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
          <FiShoppingBag size={26} className="text-cyan-900" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          No item selected
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Head back to a product and hit Buy Now.
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper mx-auto px-4 md:px-0 py-6 md:py-10 pb-32 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Checkout
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
          Log in to pick a delivery address and place this order.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left — compact product summary: small image, minimal details */}
        <div>
          <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-4">
            <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
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
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                {item.color && <span>{item.color}</span>}
                {item.storage && <span>{item.storage} GB</span>}
                {item.ram && <span>{item.ram} GB RAM</span>}
                {item.condition && <span>{item.condition}</span>}
                {item.year && <span>{item.year}</span>}
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-2">
                ₹{item.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Right — address, payment, sticky summary (desktop) */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <AddressPicker
              addresses={addresses}
              loading={loadingAddresses}
              user={user}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              onNeedLogin={() => setShowLoginModal(true)}
            />

            <PaymentMethodPicker
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              regionInfo={regionInfo}
              selectedAddressId={selectedAddressId}
            />

            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Item price</span>
                  <span className="text-gray-900">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
                {codExtra > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>COD charge ({regionInfo?.label})</span>
                    <span className="text-gray-900">₹{codExtra}</span>
                  </div>
                )}
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
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-3.5 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors hover:cursor-pointer disabled:opacity-60"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — bottom fixed amount + place order bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4 z-40">
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="flex-1 max-w-[220px] py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors disabled:opacity-60"
        >
          {placing ? "Placing..." : "Place Order"}
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
  onNeedLogin,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Deliver to</h2>
        {user ? (
          <Link
            href="/profile"
            className="flex items-center gap-1 text-xs font-medium text-cyan-900 hover:underline cursor-pointer"
          >
            <FiPlus size={12} /> Add new
          </Link>
        ) : (
          <button
            onClick={onNeedLogin}
            className="flex items-center gap-1 text-xs font-medium text-cyan-900 hover:underline cursor-pointer"
          >
            <FiPlus size={12} /> Add new
          </button>
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
          <button
            onClick={onNeedLogin}
            className="text-cyan-900 font-medium hover:underline"
          >
            Log in
          </button>{" "}
          to pick a delivery address.
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
