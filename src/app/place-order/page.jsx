"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PlaceOrderPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const {
    items,
    subtotal,
    itemCount,
    selectedAddress,
    paymentMethod,
    regionInfo,
  } = useCart();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayReady);
  }, []);

  const total = subtotal;
  const advanceAmount =
    paymentMethod === "cod" && regionInfo
      ? Math.round((total * regionInfo.percent) / 100)
      : total;
  const remainingAmount = total - advanceAmount;

  if (!selectedAddress || !paymentMethod || items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-sm mb-4">
          Missing checkout details — go back to cart and pick an address and
          payment method.
        </p>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-cyan-900 font-medium text-sm hover:underline"
        >
          <FiArrowLeft size={14} /> Back to cart
        </Link>
      </div>
    );
  }

  // ---- verify-payment API, exact same body/shape as old CartPage had ----
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

  // ---- create-order API + razorpay open, exact same options as old CartPage's placeOrder ----
  const handleConfirm = async () => {
    setCheckoutError("");

    if (!razorpayReady || !window.Razorpay) {
      setCheckoutError("Payment SDK still loading, try again in a sec");
      return;
    }
    if (!user) {
      setCheckoutError("Please log in");
      return;
    }

    const body = {
      productIds: items.map((item) => item.id),
      addressId: selectedAddress.id,
      paymentMethod, // "online" | "cod"
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
        console.error("create-order failed:", res.status, errData);
        throw new Error(
          errData.message || errData.error?.message || "Order failed",
        );
      }
      const data = await res.json();
      const { order, razorpay } = data;

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
            router.push(`/orders/${order.id}/success`);
          } catch (err) {
            console.error("verify error:", err);
            setCheckoutError(err.message || "Payment verification failed");
          } finally {
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
        },
        theme: { color: "#164e63" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("checkout error:", err);
      setCheckoutError(err.message || "Order failed, try again");
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 md:px-0 py-6 md:py-10 pb-10 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/cart" className="text-gray-400 hover:text-gray-700">
          <FiArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Place Order</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">Delivering to</p>
        <p className="text-sm text-gray-600">
          {selectedAddress.AddressLine1}, {selectedAddress.AddressLine2}
        </p>
        <p className="text-sm text-gray-500">
          {selectedAddress.City}, {selectedAddress.District},{" "}
          {selectedAddress.State} - {selectedAddress.PinCode}
        </p>
        <p className="text-sm text-gray-400">{selectedAddress.PhoneNumber}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 text-sm">
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
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="font-medium text-gray-700">Total</span>
          <span className="font-bold text-gray-900">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 text-sm">
        <p className="font-medium text-gray-900">
          {paymentMethod === "cod" ? "Cash on Delivery" : "razorpay"}
          {paymentMethod === "cod" && regionInfo
            ? ` — ${regionInfo.label} (${regionInfo.percent}% advance)`
            : ""}
        </p>
        <div className="flex justify-between text-gray-700">
          <span>Pay now</span>
          <span className="font-semibold">
            ₹{advanceAmount.toLocaleString("en-IN")}
          </span>
        </div>
        {paymentMethod === "cod" && (
          <div className="flex justify-between text-gray-500">
            <span>Pay on delivery</span>
            <span>₹{remainingAmount.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>

      {checkoutError && <p className="text-sm text-red-500">{checkoutError}</p>}

      <button
        onClick={handleConfirm}
        disabled={placingOrder}
        className="w-full py-3.5 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FiCheck size={16} />
        {placingOrder ? "Placing order..." : "Confirm & Pay"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Secure checkout powered by Razorpay
      </p>
    </div>
  );
}
