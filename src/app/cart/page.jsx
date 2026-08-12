"use client";

import { useState, useEffect } from "react";
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

  // TODO: confirm exact field name for jwt in your AuthContext (user?.jwt, user?.token, etc.)
  const { user, token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const shipping = subtotal > 0 ? 0 : 0; // flat free shipping — adjust if needed
  const total = subtotal + shipping;

  const [codSettings, setCodSettings] = useState(null);

  useEffect(() => {
    const fetchCodSettings = async () => {
      try {
        const res = await fetch(
          "https://backapp.preown.store/api/cod-settings",
        );
        const json = await res.json();
        setCodSettings(json.data?.[0] || null);
      } catch (err) {
        console.error("failed to load cod settings:", err);
      }
    };
    fetchCodSettings();
  }, []);
  const SOUTH_INDIA_STATES = [
    "Tamil Nadu",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
    "Puducherry",
  ];

  const getCodInfo = () => {
    if (!codSettings) return null;

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) return null;

    const state = selectedAddr.State?.trim();

    let percent = codSettings.COD_ROI_Amount;
    let label = "Rest of India";

    if (state === "Kerala" && codSettings.COD_Kerala) {
      percent = codSettings.COD_Kerala_Amount;
      label = "Kerala";
    } else if (
      SOUTH_INDIA_STATES.includes(state) &&
      codSettings.COD_Sount_India
    ) {
      percent = codSettings.COD_South_India_Amount;
      label = "South India";
    }

    const advanceAmount = Math.round((total * percent) / 100);

    return { percent, label, advanceAmount };
  };

  const codInfo = getCodInfo();

  useEffect(() => {
    if (!user) {
      setLoadingAddresses(false);
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          "https://backapp.preown.store/api/addresses/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();

        // filter out empty/junk address entries (no AddressLine1)
        const valid = Array.isArray(data)
          ? data.filter((a) => a.AddressLine1)
          : [];
        setAddresses(valid);

        if (valid.length > 0) setSelectedAddressId(valid[0].id);
      } catch (err) {
        console.error("failed to load addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user, token]);

  const verifyPayment = async (paymentResponse, orderId) => {
    const res = await fetch(
      "https://backapp.preown.store/api/orders/verify-razorpay-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      },
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Payment verification failed");
    }

    return res.json();
  };

  const handleCheckout = async () => {
    setCheckoutError("");

    if (!user) {
      setCheckoutError("Log in to place order");
      return;
    }

    if (!selectedAddressId) {
      setCheckoutError("Pick delivery address first");
      return;
    }

    const body = {
      productIds: items.map((item) => item.id),
      addressId: selectedAddressId,
      paymentMethod: "cod",
    };

    setPlacingOrder(true);

    try {
      const res = await fetch(
        "https://backapp.preown.store/api/orders/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Order failed");
      }

      const data = await res.json();
      console.log("order created", data);

      const { order, razorpay } = data;

      // const scriptLoaded = await loadRazorpayScript();
      // if (!scriptLoaded) {
      //   setCheckoutError("Razorpay SDK failed to load. Check connection.");
      //   setPlacingOrder(false);
      //   return;
      // }

      const options = {
        key: razorpay.key_id,
        amount: razorpay.amount,
        currency: "INR",
        name: "Preown",
        description: `Order ${order.order_number}`,
        order_id: razorpay.razorpay_order_id,
        handler: async (response) => {
          try {
            await verifyPayment(response, order.id);
            console.log("payment verified");
            // TODO: redirect to order success page, clear cart
            // router.push(`/orders/${order.id}/success`);
          } catch (err) {
            console.error("verify error:", err);
            setCheckoutError(err.message || "Payment verification failed");
          } finally {
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            // user closed modal without pay
            setPlacingOrder(false);
          },
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
        },
        theme: {
          color: "#164e63", // matches cyan-900
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("checkout error:", err);
      setCheckoutError(err.message || "Order failed, try again");
      setPlacingOrder(false);
    }
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
                onClick={() => removeFromCart(item.documentCartId)}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                aria-label="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Right column — address picker + order summary, desktop sidebar sticky */}
        <div className="hidden lg:block space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Address picker */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h2 className="text-base font-semibold text-gray-900">
                Deliver to
              </h2>

              {loadingAddresses && (
                <p className="text-sm text-gray-400">Loading addresses...</p>
              )}

              {!loadingAddresses && user && addresses.length === 0 && (
                <p className="text-sm text-gray-500">
                  No saved address. Add one before checkout.
                </p>
              )}

              {!user && !loadingAddresses && (
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
                      {addr.City}, {addr.District}, {addr.State} -{" "}
                      {addr.PinCode}
                    </p>
                    <p className="text-gray-400">{addr.PhoneNumber}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Order summary */}
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

              {checkoutError && (
                <p className="text-sm text-red-500">{checkoutError}</p>
              )}
              {codInfo && (
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  COD advance ({codInfo.label}, {codInfo.percent}%): pay{" "}
                  <span className="font-semibold text-gray-900">
                    ₹{codInfo.advanceAmount.toLocaleString("en-IN")}
                  </span>{" "}
                  now, remaining on delivery.
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={placingOrder}
                className="w-full py-3.5 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors disabled:opacity-50"
              >
                {placingOrder ? "Placing order..." : "Proceed to Pay"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile address picker — shown above sticky bottom bar */}
      <div className="lg:hidden mt-6 bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Deliver to</h2>

        {loadingAddresses && (
          <p className="text-sm text-gray-400">Loading addresses...</p>
        )}

        {!loadingAddresses && user && addresses.length === 0 && (
          <p className="text-sm text-gray-500">
            No saved address. Add one before checkout.
          </p>
        )}

        {!user && !loadingAddresses && (
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
              name="address-mobile"
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

        {checkoutError && (
          <p className="text-sm text-red-500">{checkoutError}</p>
        )}
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
          disabled={placingOrder}
          className="flex-1 max-w-[220px] py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors disabled:opacity-50"
        >
          {placingOrder ? "Placing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
}
