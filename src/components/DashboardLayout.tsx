import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("DashboardLayout must be used within an AuthProvider");
  }

  return (
    <div className="min-h-screen bg-white font-sans flex text-gray-900">
      {/* --- VS CODE STYLE SIDEBAR --- */}
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      {/* Add margin-left to account for fixed sidebar */}
      <div className="flex-1 ml-16 min-h-screen flex flex-col">
        {/* Top Header (Optional, maybe for breadcrumbs or title, keeping it minimal as requested) */}
        {/* 
        <header className="h-12 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-40">
           <span className="text-sm text-gray-500">Dashboard</span> 
        </header> 
        */}

        <main className="p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
