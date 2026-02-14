import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import AdminDashboard from "./dashboards/AdminDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

const Dashboard: React.FC = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Dashboard must be used within an AuthProvider");
  }

  const { user } = context;

  const renderDashboard = () => {
    switch (user?.role.toUpperCase()) {
      case "ADMIN":
        return <AdminDashboard />;
      case "TEACHER":
        return <TeacherDashboard />;
      case "STUDENT":
        return <StudentDashboard />;
      default:
        // Fallback for unknown roles or if role is missing, maybe show student view or error
        return <StudentDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
