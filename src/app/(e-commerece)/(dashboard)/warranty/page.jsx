"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import WarrantyCard from "@/components/dashboard/warranty/WarrantyCard";
import { useAuth } from "@/context/AuthContext";

const STRAPI_BASE = "https://backapp.preown.store";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// product_image_url comes back as an array of relative paths — use the first
function getItemImage(item) {
  const path = Array.isArray(item.product_image_url)
    ? item.product_image_url[0]
    : item.product_image_url;
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_BASE}${path}`;
}

function statusFromExpiry(expiryTime) {
  const daysLeft = (expiryTime - Date.now()) / MS_PER_DAY;
  if (daysLeft < 0) return "Expired";
  if (daysLeft <= 30) return "Expiring Soon";
  return "Active";
}

// shop_warrenty is a day-count off placed_at (confirmed: e.g. 15)
function buildShopWarranty(placedAt, days) {
  if (!days) return null;
  const expiryTime = new Date(placedAt).getTime() + Number(days) * MS_PER_DAY;
  return {
    label: "Shop Warranty",
    expiryDate: formatDate(expiryTime),
    status: statusFromExpiry(expiryTime),
  };
}

// prodcut_warrenty is an absolute expiry date string (confirmed: "2026-09-26"),
// NOT a day-count — different calc from shop warranty
function buildProductWarranty(dateStr) {
  if (!dateStr) return null;
  const expiryTime = new Date(dateStr).getTime();
  if (Number.isNaN(expiryTime)) return null;
  return {
    label: "Product Warranty",
    expiryDate: formatDate(expiryTime),
    status: statusFromExpiry(expiryTime),
  };
}

function flattenOrders(orders) {
  const cards = [];
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const warranties = [
        buildShopWarranty(order.placed_at, item.shop_warrenty),
        buildProductWarranty(item.prodcut_warrenty),
      ].filter(Boolean);

      cards.push({
        id: `${order.order_number}-${item.id}`,
        product: item.product_name,
        price: item.price,
        image: getItemImage(item),
        orderId: order.order_number,
        purchaseDate: formatDate(order.placed_at),
        serialNumber: item.SerialNumber,
        warranties,
      });
    });
  });
  return cards;
}

export default function WarrantyPage() {
  const { token } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://backapp.preown.store/api/orders?populate=*",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const json = response.data;
        setCards(flattenOrders(json.data || []));
      } catch (err) {
        console.error("fetchOrders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="space-y-4 page-wrapper mt-10 md:mt-0">
      <p className="text-sm text-gray-500">
        {loading ? "Loading..." : `${cards.length} warranty records`}
      </p>

      {!loading && !token && (
        <p className="text-sm text-gray-500">Log in to see your warranties.</p>
      )}

      <div className="space-y-3">
        {!loading && cards.map((c) => <WarrantyCard key={c.id} {...c} />)}
      </div>

      {!loading && token && cards.length === 0 && (
        <p className="text-sm text-gray-400">No orders yet.</p>
      )}
    </div>
  );
}
