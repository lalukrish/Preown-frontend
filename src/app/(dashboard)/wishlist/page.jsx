import WishlistCard from "@/components/dashboard/wishlist/WishlistCard";

const items = [
  {
    name: "iPhone 14 Pro Max",
    price: "₹89,999",
    originalPrice: "₹1,09,999",
    image: "/phone1.png",
    inStock: true,
  },
  {
    name: "Sony WH-1000XM5",
    price: "₹24,999",
    originalPrice: "₹34,990",
    image: "/phone1.png",
    inStock: true,
  },
  {
    name: "iPad Mini 6",
    price: "₹42,900",
    originalPrice: "₹52,900",
    image: "/phone1.png",
    inStock: false,
  },
];

export default function WishlistPage() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">{items.length} saved items</p>
      {items.map((item, i) => (
        <WishlistCard key={i} {...item} />
      ))}
    </div>
  );
}
