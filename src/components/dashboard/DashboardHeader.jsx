"use client";

import { FiBell } from "react-icons/fi";
import { usePathname } from "next/navigation";

const titleMap = {
  "/dashboard": "Overview",
  "/orders": "My Orders",
  "/wishlist": "Wishlist",
  "/warranty": "Warranty Details",
  "/transactions": "Transactions",
  "/emi": "EMI Plans",
  "/profile": "Profile & Addresses",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <button className="relative p-2 text-gray-500 hover:text-orange-500 transition-colors">
        <FiBell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
      </button>
    </header>
  );
}
