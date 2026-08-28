"use client";

import { useState, useEffect } from "react";
import OrderCard from "@/components/dashboard/orders/OrderCard";
import { useAuth } from "@/context/AuthContext";

const STATUS_MAP = {
  placed: "Processing",
  confirmed: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All Orders");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("https://backapp.preown.store/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const json = await res.json();

        const mapped = (json.data || []).map((o) => ({
          id: o.order_number,
          documentId: o.documentId,
          date: new Date(o.placed_at || o.createdAt).toLocaleDateString(
            "en-IN",
            { day: "2-digit", month: "short", year: "numeric" },
          ),
          status: STATUS_MAP[o.order_status] || o.order_status,
          amount: `₹${o.total_amount.toLocaleString("en-IN")}`,
          // TODO: product name/image not in this response — need order items
          // endpoint (e.g. /api/orders/:id or populate=order_items.new_product)
          // to show actual product + thumbnail per order.
          product: "—",
          image: "/phone1.png",
        }));

        setOrders(mapped);
      } catch (err) {
        console.error("fetchOrders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const filtered =
    statusFilter === "All Orders"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-4 page-wrapper mt-10 md:mt-0">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} orders found</p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-600"
        >
          <option>All Orders</option>
          <option>Delivered</option>
          <option>In Transit</option>
          <option>Processing</option>
          <option>Cancelled</option>
        </select>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading orders...</p>}

      {!loading && !token && (
        <p className="text-sm text-gray-500">Log in to see your orders.</p>
      )}

      {!loading && token && filtered.length === 0 && (
        <p className="text-sm text-gray-500">No orders found.</p>
      )}

      <div className="space-y-3">
        {filtered.map((order) => (
          <OrderCard key={order.documentId} {...order} />
        ))}
      </div>
    </div>
  );
}
