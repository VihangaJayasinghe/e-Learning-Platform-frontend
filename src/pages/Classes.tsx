import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherClasses from "./dashboards/teacher/TeacherClasses";
import StudentClasses from "./dashboards/student/StudentClasses";

const Classes: React.FC = () => {
    const context = useContext(AuthContext);

    if (!context) {
        return null; // Or loading/error
    }

    const { user } = context;
    const role = user?.role.toUpperCase();

    if (role === "TEACHER") {
        return <TeacherClasses />;
    } else if (role === "STUDENT") {
        return <StudentClasses />;
    } else {
        // Fallback for Admin or others
        return <div className="p-8">Classes view for {role} is not implemented yet.</div>;
    }
};

export default Classes;
