import OrderCard from "@/components/dashboard/orders/OrderCard";

const orders = [
  {
    id: "#ORD001",
    product: "iPhone 13 Pro",
    date: "12 Jun 2025",
    status: "Delivered",
    amount: "₹54,999",
    image: "/phone1.png",
  },
  {
    id: "#ORD002",
    product: "Samsung Galaxy S22",
    date: "02 Jun 2025",
    status: "In Transit",
    amount: "₹38,499",
    image: "/phone1.png",
  },
  {
    id: "#ORD003",
    product: "MacBook Air M1",
    date: "28 May 2025",
    status: "Processing",
    amount: "₹72,000",
    image: "/phone1.png",
  },
  {
    id: "#ORD004",
    product: "AirPods Pro",
    date: "15 May 2025",
    status: "Delivered",
    amount: "₹18,000",
    image: "/phone1.png",
  },
  {
    id: "#ORD005",
    product: "iPad Air 5th Gen",
    date: "10 Apr 2025",
    status: "Cancelled",
    amount: "₹48,000",
    image: "/phone1.png",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{orders.length} orders found</p>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-600">
          <option>All Orders</option>
          <option>Delivered</option>
          <option>In Transit</option>
          <option>Processing</option>
          <option>Cancelled</option>
        </select>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </div>
    </div>
  );
}
