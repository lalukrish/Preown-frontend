"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiShield,
  FiCreditCard,
  FiList,
  FiChevronRight,
} from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: FiHome },
  { href: "/orders", label: "My Orders", icon: FiShoppingBag },
  { href: "/wishlist", label: "Wishlist", icon: FiHeart },
  { href: "/warranty", label: "Warranty", icon: FiShield },
  { href: "/transactions", label: "Transactions", icon: FiList },
  { href: "/emi", label: "EMI", icon: FiCreditCard },
  { href: "/profile", label: "Profile & Address", icon: FiUser },
];

const OPEN_W = 256;
const CLOSE_W = 68;

function setContentMargin(w) {
  const el = document.getElementById("dash-content");
  if (el) el.style.marginLeft = w + "px";
}

export default function Sidebar() {
  const pathname = usePathname();
  const isPinned = useRef(false);
  const hoverTimer = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    clearTimeout(hoverTimer.current);
    setIsOpen(true);
    setContentMargin(OPEN_W);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setContentMargin(CLOSE_W);
  };

  const handleMouseEnter = () => {
    if (isPinned.current) return;
    clearTimeout(hoverTimer.current);
    openSidebar();
  };

  // Key fix: check relatedTarget — if mouse moved onto the tab button, don't close
  const handleMouseLeave = (e) => {
    if (isPinned.current) return;
    const movingTo = e.relatedTarget;
    if (movingTo && movingTo.closest?.("[data-sidebar-tab]")) return;
    hoverTimer.current = setTimeout(closeSidebar, 150);
  };

  const handleTabMouseEnter = () => {
    // Prevent close timer when hovering tab
    clearTimeout(hoverTimer.current);
  };

  const handleTabMouseLeave = (e) => {
    if (isPinned.current) return;
    const movingTo = e.relatedTarget;
    // If moving back into the sidebar body, don't close
    if (movingTo && movingTo.closest?.("[data-sidebar-body]")) return;
    hoverTimer.current = setTimeout(closeSidebar, 150);
  };

  const handleTabClick = (e) => {
    e.stopPropagation();
    clearTimeout(hoverTimer.current);
    if (isPinned.current) {
      isPinned.current = false;
      closeSidebar();
    } else {
      isPinned.current = true;
      openSidebar();
    }
  };

  return (
    <aside
      style={{
        width: isOpen ? OPEN_W : CLOSE_W,
        top: "var(--header-h, 0px)",
        height: "calc(100vh - var(--header-h, 0px))",
      }}
      className="hidden md:flex flex-col fixed left-0 bg-white border-r border-gray-100 z-40 transition-[width] duration-300 ease-in-out overflow-visible"
    >
      {/* Body — hover zone */}
      <div
        data-sidebar-body
        className="flex flex-col h-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo row */}
        <div className="flex items-center h-16 border-b border-gray-100 px-4 flex-shrink-0 overflow-hidden">
          {isOpen ? (
            <span className="text-sm font-bold text-orange-500 whitespace-nowrap">
              My Account
            </span>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mx-auto">
              <span className="text-orange-500 font-bold text-xs">P</span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-0.5 px-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={!isOpen ? label : undefined}
                    className={`flex items-center gap-3 rounded-lg py-2.5 transition-colors ${
                      isOpen ? "px-3" : "justify-center px-0"
                    } ${
                      active
                        ? "bg-orange-50 text-orange-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-orange-500"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isOpen && (
                      <span className="text-sm font-medium whitespace-nowrap">
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div
          className={`border-t border-gray-100 p-3 flex items-center gap-3 flex-shrink-0 ${!isOpen ? "justify-center" : ""}`}
        >
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm flex-shrink-0">
            R
          </div>
          {isOpen && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                Rahul Kumar
              </p>
              <p className="text-xs text-gray-400 truncate">rahul@email.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle tab — outside hover zone, has its own handlers */}
      <button
        data-sidebar-tab
        onClick={handleTabClick}
        onMouseEnter={handleTabMouseEnter}
        onMouseLeave={handleTabMouseLeave}
        aria-label={isPinned.current ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute top-1/2 -translate-y-1/2 -right-4 z-50
          w-4 h-12 bg-white border border-gray-200 rounded-r-lg
          flex items-center justify-center
          text-gray-400 hover:text-orange-500 hover:border-orange-300
          transition-colors shadow-sm cursor-pointer"
      >
        <FiChevronRight
          size={13}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    </aside>
  );
}
