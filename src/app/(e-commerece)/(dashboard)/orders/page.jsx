// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import OrderCard from "@/components/dashboard/orders/OrderCard";
// import { useAuth } from "@/context/AuthContext";

// const STATUS_MAP = {
//   placed: "Processing",
//   confirmed: "Confirmed",
//   shipped: "Shipped",
//   delivered: "Delivered",
//   cancelled: "Cancelled",
// };

// export default function OrdersPage() {
//   const { token } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("All Orders");

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(
//           "https://backapp.preown.store/api/orders?populate=*",
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         const json = response.data;

//         // one card PER ORDER — items stay grouped together, invoice
//         // breaks them out individually, the card itself just summarizes
//         const mapped = (json.data || []).map((o) => {
//           const items = o.items || [];
//           const orderDate = new Date(
//             o.placed_at || o.createdAt,
//           ).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           });
//           const status = STATUS_MAP[o.order_status] || o.order_status;

//           return {
//             id: o.order_number,
//             documentId: o.documentId,
//             date: orderDate,
//             status,
//             amount: `₹${Number(o.total_amount || 0).toLocaleString("en-IN")}`,
//             items,
//             subtotal: o.subtotal,
//             discount: o.discount,
//             shippingFee: o.shipping_fee,
//             paymentMethod: o.payment_method,
//             orderNumber: o.order_number,
//             // order-level payment breakdown — advance/remaining belong to
//             // the order as a whole, not per item
//             advanceAmount: o.advance_amount,
//             remainingAmount: o.remaining_amount,
//             paymentStatus: o.payment_status,
//             codConfirmed: o.cod_confirmed,
//           };
//         });

//         setOrders(mapped);
//       } catch (err) {
//         console.error("fetchOrders error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [token]);

//   const filtered =
//     statusFilter === "All Orders"
//       ? orders
//       : orders.filter((o) => o.status === statusFilter);

//   return (
//     <div className="space-y-4 page-wrapper mt-10 md:mt-0">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500">{filtered.length} orders found</p>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-600"
//         >
//           <option>All Orders</option>
//           <option>Delivered</option>
//           <option>Shipped</option>
//           <option>Confirmed</option>
//           <option>Processing</option>
//           <option>Cancelled</option>
//         </select>
//       </div>

//       {loading && <p className="text-sm text-gray-400">Loading orders...</p>}

//       {!loading && !token && (
//         <p className="text-sm text-gray-500">Log in to see your orders.</p>
//       )}

//       {!loading && token && filtered.length === 0 && (
//         <p className="text-sm text-gray-500">No orders found.</p>
//       )}

//       <div className="space-y-3">
//         {filtered.map((order) => (
//           <OrderCard key={order.documentId} {...order} />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import OrderCard from "@/components/dashboard/orders/OrderCard";
import { useAuth } from "@/context/AuthContext";

const STATUS_MAP = {
  placed: "Processing",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STRAPI_BASE = "https://backapp.preown.store";

// product_image_url comes back as an array of relative paths — use the first
function getItemImage(item) {
  const path = Array.isArray(item.product_image_url)
    ? item.product_image_url[0]
    : item.product_image_url;
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_BASE}${path}`;
}

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
        const response = await axios.get(
          "https://backapp.preown.store/api/orders?populate=*",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const json = response.data;

        // one card PER ORDER — items stay grouped together, invoice
        // breaks them out individually, the card itself just summarizes
        const mapped = (json.data || []).map((o) => {
          const items = o.items || [];
          const orderDate = new Date(
            o.placed_at || o.createdAt,
          ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const status = STATUS_MAP[o.order_status] || o.order_status;

          return {
            id: o.order_number,
            documentId: o.documentId,
            date: orderDate,
            status,
            amount: `₹${Number(o.total_amount || 0).toLocaleString("en-IN")}`,
            items,
            subtotal: o.subtotal,
            discount: o.discount,
            shippingFee: o.shipping_fee,
            paymentMethod: o.payment_method,
            orderNumber: o.order_number,
            // order-level payment breakdown — advance/remaining belong to
            // the order as a whole, not per item
            advanceAmount: o.advance_amount,
            remainingAmount: o.remaining_amount,
            paymentStatus: o.payment_status,
            codConfirmed: o.cod_confirmed,
          };
        });

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
          <option>Shipped</option>
          <option>Confirmed</option>
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
