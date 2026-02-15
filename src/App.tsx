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
import MonthDetails from "./pages/MonthDetails";
import QuizEditor from "./pages/QuizEditor";
import StudentBrowse from "./pages/dashboards/student/StudentBrowse";
import StudentClassDetails from "./pages/dashboards/student/StudentClassDetails";
import StudentMonthDetails from "./pages/dashboards/student/StudentMonthDetails";
import Payments from "./pages/Payments";
import TeacherPayments from "./pages/dashboards/teacher/TeacherPayments";
import VideoPlayerPage from "./pages/VideoPlayerPage";

import Videos from "./pages/Videos";

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

  console.log("PrivateRoute check:", { path: window.location.pathname, user: !!user, loading });
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
            <Route path="browse" element={<StudentBrowse />} />
            <Route path="browse/:id" element={<StudentClassDetails />} />
            <Route path="browse/:id/months/:yearMonth" element={<StudentMonthDetails />} />
            <Route path="classes/:id" element={<ClassDetails />} />
            <Route path="classes/:classId/months/:yearMonth" element={<MonthDetails />} />
            <Route path="quiz/:quizId" element={<QuizEditor />} />
            <Route path="videos" element={<Videos />} />
            <Route path="payments" element={<Payments />} />
            <Route path="earnings" element={<TeacherPayments />} />
          </Route>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <PrivateRoute>
                <VideoPlayerPage />
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
