import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("DashboardLayout must be used within an AuthProvider");
  }

  return (
    <div className="min-h-screen bg-teal-50 font-sans text-gray-900">
      {/* --- HEADER (Fixed Top) --- */}
      <Header />

      {/* --- SIDEBAR (Fixed Left, Top-16) --- */}
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      {/* pt-16 for header space, ml-16 for sidebar space */}
      <div className="pt-16 ml-16 min-h-screen flex flex-col transition-all duration-300">

        {/* Title Section / Breadcrumbs (Placeholder as requested) */}
        {/* <div className="px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-teal-100/50">
            <h2 className="text-xl font-bold text-gray-800">Overview</h2>
        </div> */}

        <main className="p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
