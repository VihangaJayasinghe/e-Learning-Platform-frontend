import React from "react";
import StudentDashboardTour from "../../components/tour/StudentDashboardTour";

const StudentDashboard: React.FC = () => {
    return (
        <>
            <StudentDashboardTour />
            {/* 
                Dashboard content cleared as per user request.
                The Tour component remains to guide the user to the Sidebar.
            */}
        </>
    );
};

export default StudentDashboard;
