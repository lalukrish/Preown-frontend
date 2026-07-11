import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div
        id="dash-content"
        className="flex-1 transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: "68px" }}
      >
        <main className="p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
