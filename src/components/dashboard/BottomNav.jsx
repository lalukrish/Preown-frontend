"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";

const items = [
  { href: "/dashboard", label: "Home", icon: FiHome },
  { href: "/orders", label: "Orders", icon: FiShoppingBag },
  { href: "/wishlist", label: "Wishlist", icon: FiHeart },
  { href: "/emi", label: "EMI", icon: FiCreditCard },
  { href: "/profile", label: "Profile", icon: FiUser },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              active ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
