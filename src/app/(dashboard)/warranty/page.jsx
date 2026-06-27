import WarrantyCard from "@/components/dashboard/warranty/WarrantyCard";

const warranties = [
  {
    product: "iPhone 13 Pro",
    orderId: "#ORD001",
    purchaseDate: "12 Jun 2024",
    expiryDate: "12 Jun 2025",
    status: "Expiring Soon",
    image: "/phone1.png",
  },
  {
    product: "MacBook Air M1",
    orderId: "#ORD003",
    purchaseDate: "28 May 2024",
    expiryDate: "28 May 2026",
    status: "Active",
    image: "/phone1.png",
  },
  {
    product: "AirPods Pro",
    orderId: "#ORD004",
    purchaseDate: "15 May 2023",
    expiryDate: "15 May 2024",
    status: "Expired",
    image: "/phone1.png",
  },
];

export default function WarrantyPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {warranties.length} warranty records
      </p>
      <div className="space-y-3">
        {warranties.map((w, i) => (
          <WarrantyCard key={i} {...w} />
        ))}
      </div>
    </div>
  );
}
