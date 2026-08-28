"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("token", token);
    if (!token) {
      router.replace("/");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;
  return (
    <div className="flex min-h-screen bg-white/70">
      {/* <Sidebar /> */}

      <div
        id="dash-content"
        className="flex-1 transition-[margin] duration-300 ease-in-out md:pt-28  page-wrapper"
      >
        <main className="overflow-y-auto">{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
