// import Sidebar from "@/components/dashboard/Sidebar";
// import BottomNav from "@/components/dashboard/BottomNav";
// import DashboardHeader from "@/components/dashboard/DashboardHeader";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Fixed Left Sidebar — desktop only */}
//       <Sidebar />

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col md:ml-64">
//         <DashboardHeader />
//         <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
//       </div>

//       {/* Bottom Nav — mobile only */}
//       <BottomNav />
//     </div>
//   );
// }

// import Sidebar from "@/components/dashboard/Sidebar";
// import BottomNav from "@/components/dashboard/BottomNav";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar — desktop only, sits below root header */}
//       <Sidebar />

//       {/* Main content — offset for sidebar on desktop */}
//       <div
//         className="flex-1 flex flex-col transition-all duration-300 md:ml-[68px]"
//         id="dash-content"
//       >
//         <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
//       </div>

//       {/* Bottom Nav — mobile only */}
//       <BottomNav />
//     </div>
//   );
// }

// import Sidebar from "@/components/dashboard/Sidebar";
// import BottomNav from "@/components/dashboard/BottomNav";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />

//       {/* margin-left matches collapsed sidebar width (68px), JS updates it */}
//       <div
//         id="dash-content"
//         className="flex-1 transition-[margin] duration-300 ease-in-out"
//         style={{ marginLeft: "68px" }}
//       >
//         <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

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
