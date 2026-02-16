import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    Shield,
    BookOpen,
    Settings,
    Users,
    AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    if (!context) {
        return null;
    }

    const { user } = context;

    return (
        <>
            <header className="mb-12">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
                    <span className="w-8 h-[2px] bg-blue-600"></span>
                    Admin Overview
                </div>
                <h2 className="text-4xl font-black text-gray-900">
                    Welcome back, {user?.username}!
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Manage the platform, users, and system settings.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    onClick={() => navigate("/dashboard/system-admin")}
                    className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-red-500 hover:shadow-2xl hover:shadow-red-100/50 transition-all duration-500 cursor-pointer"
                >
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
                        Manage system configurations, user permissions, and security logs.
                    </p>
                </div>

                <div
                    onClick={() => navigate("/dashboard/user-management")}
                    className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-500">
                        <Users className="text-blue-600 group-hover:text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        User Management
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        View and manage all registered users, both students and teachers.
                    </p>
                </div>

                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-500 cursor-pointer">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors duration-500">
                        <AlertCircle className="text-amber-600 group-hover:text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Platform Reports
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Access detailed reports on course enrollments and platform usage.
                    </p>
                </div>

                {/* Common Card: Courses */}
                <div
                    onClick={() => navigate("/dashboard/course-catalog")}
                    className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-500">
                        <BookOpen
                            className="text-emerald-600 group-hover:text-white"
                            size={28}
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Video Catalog
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Review and manage the video catalog available to students.
                    </p>
                </div>

                {/* New Card: Course Catalog */}
                <div
                    onClick={() => navigate("/dashboard/admin-courses")}
                    className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500">
                        <BookOpen
                            className="text-indigo-600 group-hover:text-white"
                            size={28}
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Course Catalog
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        View and manage all courses on the platform.
                    </p>
                </div>


                {/* New Card: Class Catalog */}
                <div
                    onClick={() => navigate("/dashboard/admin-classes")}
                    className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-500">
                        <div className="text-purple-600 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10v6" /><path d="M2 10l10-5 10 5-10 5z" /><path d="M12 12v9" /></svg>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Class Catalog
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        View and manage active classes and monthly schedules.
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
                        Update your details, change your password, and manage session settings.
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
