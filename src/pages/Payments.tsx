import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherPayments from "./dashboards/teacher/TeacherPayments";
import StudentPayments from "./dashboards/student/StudentPayments";

const Payments: React.FC = () => {
    const context = useContext(AuthContext);

    if (!context || !context.user) {
        return null; // Or generic loading/unauthorized
    }

    const { user } = context;

    if (user.role === "TEACHER") {
        return <TeacherPayments />;
    }

    if (user.role === "STUDENT") {
        return <StudentPayments />;
    }

    return (
        <div className="p-8 text-center text-gray-500">
            Payment history is not available for this user role.
        </div>
    );
};

export default Payments;
