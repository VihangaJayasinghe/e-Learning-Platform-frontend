import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

const DashboardIndex: React.FC = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("DashboardIndex must be used within an AuthProvider");
    }

    const { user } = context;

    switch (user?.role.toUpperCase()) {
        case "ADMIN":
            return <AdminDashboard />;
        case "TEACHER":
            return <TeacherDashboard />;
        case "STUDENT":
            return <StudentDashboard />;
        default:
            return <StudentDashboard />;
    }
};

export default DashboardIndex;
