"use client";

import StatCard from "@/components/dashboard/StatCard";
import { FiShoppingBag, FiHeart, FiShield, FiCreditCard } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const recentOrders = [
  {
    id: "#ORD001",
    product: "iPhone 13 Pro",
    date: "12 Jun 2025",
    status: "Delivered",
    amount: "₹54,999",
  },
  {
    id: "#ORD002",
    product: "Samsung Galaxy S22",
    date: "02 Jun 2025",
    status: "In Transit",
    amount: "₹38,499",
  },
  {
    id: "#ORD003",
    product: "MacBook Air M1",
    date: "28 May 2025",
    status: "Processing",
    amount: "₹72,000",
  },
];

const statusColor = {
  Delivered: "bg-green-100 text-green-600",
  "In Transit": "bg-blue-100 text-blue-600",
  Processing: "bg-yellow-100 text-yellow-600",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.username || "there";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Hey, {displayName} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={12}
          icon={<FiShoppingBag size={22} />}
          color="bg-orange-50 text-cyan-800"
        />
        <StatCard
          label="Wishlist Items"
          value={5}
          icon={<FiHeart size={22} />}
          color="bg-pink-50 text-pink-500"
        />
        <StatCard
          label="Active Warranties"
          value={3}
          icon={<FiShield size={22} />}
          color="bg-green-50 text-green-500"
        />
        <StatCard
          label="EMI Active"
          value={2}
          icon={<FiCreditCard size={22} />}
          color="bg-purple-50 text-purple-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-cyan-800 text-sm font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {order.product}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {order.id} · {order.date}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status]}`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {order.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
