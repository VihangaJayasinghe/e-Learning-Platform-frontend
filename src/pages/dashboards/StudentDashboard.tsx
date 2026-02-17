import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    GraduationCap,
    BookOpen,
    Settings,
    Clock,
    Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentDashboardTour from "../../components/tour/StudentDashboardTour";

const StudentDashboard: React.FC = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    if (!context) {
        return null;
    }

    const { user } = context;

    return (
        <>
            <StudentDashboardTour />
            <header className="mb-12 tour-welcome">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
                    <span className="w-8 h-[2px] bg-blue-600"></span>
                    Student Overview
                </div>
                <h2 className="text-4xl font-black text-gray-900">
                    Welcome back, {user?.username}!
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Continue your learning journey and explore new topics.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 cursor-pointer tour-learning">
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

                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-500 cursor-pointer tour-activity">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-500">
                        <Clock className="text-teal-600 group-hover:text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Recent Activity
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Pick up exactly where you left off in your last session.
                    </p>
                </div>

                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-100/50 transition-all duration-500 cursor-pointer">
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors duration-500">
                        <Award className="text-yellow-600 group-hover:text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Achievements
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        View your earned badges and certificates of completion.
                    </p>
                </div>

                {/* Common Card: Courses */}
                <div className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 cursor-pointer tour-catalog">
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
                    className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 cursor-pointer tour-profile"
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

export default StudentDashboard;
