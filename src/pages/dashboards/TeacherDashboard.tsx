import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    Users,
    BookOpen,
    Settings,
    FileText,
    Video
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
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
                    Instructor Overview
                </div>
                <h2 className="text-4xl font-black text-gray-900">
                    Welcome back, {user?.username}!
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Manage your courses, students, and content.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 cursor-pointer">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-500">
                        <Video className="text-purple-600 group-hover:text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        My Courses
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Create and edit your course content, upload videos, and manage curriculum.
                    </p>
                </div>

                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 cursor-pointer">
                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-500">
                        <FileText className="text-pink-600 group-hover:text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Assignments
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Review student submissions and provide feedback on assignments.
                    </p>
                </div>

                {/* Common Card: Courses (View as Student) */}
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
                        Explore other courses and stay updated with the platform content.
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
        </>
    );
};

export default TeacherDashboard;
