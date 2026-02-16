import React, { type ReactNode, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Import your converted pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardIndex from "./pages/DashboardIndex";
import Classes from "./pages/Classes";
import GoogleCallback from "./pages/GoogleCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ClassDetails from "./pages/ClassDetails";
import SystemAdmin from "./pages/SystemAdmin";
import UserManagement from "./pages/UserManagement";
import AllUsers from "./pages/AllUsers";
import CourseCatalog from "./pages/CourseCatalog";
import UpdateUser from "./pages/UpdateUser";
import AdminCourses from "./pages/AdminCourses";
import AdminClasses from "./pages/AdminClasses";
import AdminClassDetails from "./pages/AdminClassDetails";

// 1. Define Props for the PrivateRoute
interface PrivateRouteProps {
  children: ReactNode;
}

// This component protects the Dashboard
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const context = useContext(AuthContext);

  // Handle cases where context might be undefined
  if (!context) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { user, loading } = context;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-10 text-center font-bold text-blue-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes (Only for Logged in Users) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardIndex />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetails />} />
            <Route path="system-admin" element={<SystemAdmin />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="user-management/all-users" element={<AllUsers />} />
            <Route path="course-catalog" element={<CourseCatalog />} />
            <Route path="user-management/update-user/:username" element={<UpdateUser />} />
            <Route path="admin-courses" element={<AdminCourses />} />
            <Route path="admin-classes" element={<AdminClasses />} />
            <Route path="admin-classes/:id" element={<AdminClassDetails />} />
          </Route>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
