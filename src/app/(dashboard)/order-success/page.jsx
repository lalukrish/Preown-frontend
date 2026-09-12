"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

const REDIRECT_AFTER_MS = 3000;

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(REDIRECT_AFTER_MS / 1000),
  );

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/orders");
    }, REDIRECT_AFTER_MS);

    const tick = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(tick);
    };
  }, [router]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
        <FiCheckCircle size={30} className="text-green-600" />
      </div>

      <h1 className="text-xl font-semibold text-gray-900">
        Order placed successfully
      </h1>

      <p className="text-sm text-gray-500 mt-2">
        {orderId
          ? `Order #${orderId} is confirmed.`
          : "Your order is confirmed."}{" "}
        Taking you to your orders in {secondsLeft}s...
      </p>

      <Link
        href="/orders"
        className="inline-block mt-6 px-6 py-3 rounded-lg bg-cyan-900 text-white text-sm font-semibold hover:bg-cyan-800 transition-colors"
      >
        Go to Orders Now
      </Link>
    </div>
  );
}
