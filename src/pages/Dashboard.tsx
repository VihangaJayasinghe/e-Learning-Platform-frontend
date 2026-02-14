import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  LogOut,
  BookOpen,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";

const Dashboard: React.FC = () => {
  // 1. Safe context access with type support for 'user' and 'logout'
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Dashboard must be used within an AuthProvider");
  }

  const { user, logout } = context;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* --- PROFESSIONAL NAVBAR --- */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            ELP<span className="text-blue-600">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 group px-3 py-1.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {user?.username}
              </p>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {user?.role}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <UserIcon size={20} className="text-white" />
            </div>
          </button>

          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            Overview
          </div>
          <h2 className="text-4xl font-black text-gray-900">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Here is what is happening with your learning portal today.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Conditional Card: Teacher Only */}
          {user?.role.toUpperCase() === "TEACHER" && (
            <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-500">
                <Users
                  className="text-blue-600 group-hover:text-white"
                  size={28}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Student Management
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Track your students' progress, grade assignments, and manage
                enrollments.
              </p>
            </div>
          )}

          {/* Conditional Card: Student Only */}
          {user?.role.toUpperCase() === "STUDENT" && (
            <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500">
                <GraduationCap
                  className="text-indigo-600 group-hover:text-white"
                  size={28}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                My Learning
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Access your enrolled courses, view certificates, and continue
                your lessons.
              </p>
            </div>
          )}

          {/* Conditional Card: Admin Only */}
          {user?.role.toUpperCase() === "ADMIN" && (
            <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-red-500 hover:shadow-2xl hover:shadow-red-100/50 transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-500">
                <Shield
                  className="text-red-600 group-hover:text-white"
                  size={28}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                System Admin
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Manage system configurations, user permissions, and security
                logs.
              </p>
            </div>
          )}

          {/* Common Card: Courses */}
          <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 cursor-pointer">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-500">
              <BookOpen
                className="text-emerald-600 group-hover:text-white"
                size={28}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Course Catalog
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Explore new topics and expand your knowledge with our top-rated
              courses.
            </p>
          </div>

          {/* Common Card: Profile Settings */}
          <div
            onClick={() => navigate("/profile")}
            className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 cursor-pointer"
          >
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-500">
              <Settings
                className="text-orange-600 group-hover:text-white"
                size={28}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Profile & Security
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Update your details, change your password, and manage session
              settings.
            </p>
          </div>
        </div>

        <footer className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            © 2026 ELP Learning Systems. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
