import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getTeacherAnalytics } from "../../services/api";
import {
    Users,
    BookOpen,
    Settings,
    Video,
    TrendingUp,
    DollarSign,
    Star,
    Clock,
    UserPlus,
    Loader2,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types based on the User's JSON
interface RecentEnrollment {
    studentName: string;
    courseTitle: string;
    enrolledAt: string;
}

interface TeacherAnalytics {
    totalEarnings: number;
    totalStudents: number;
    totalCourses: number;
    averageRating: number;
    recentEnrollments: RecentEnrollment[];
}

const TeacherDashboard: React.FC = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user } = context || {};

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const data = await getTeacherAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to load analytics", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (!context) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 font-sans bg-white min-h-screen text-gray-900">
            <header className="mb-10 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-widest mb-3">
                    <span className="w-8 h-[2px] bg-teal-600"></span>
                    Instructor Overview
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                            Welcome back, <span className="text-teal-600">{user?.username}</span>!
                        </h2>
                        <p className="text-gray-500 mt-2 text-lg font-medium">
                            Here's what's happening with your courses today.
                        </p>
                    </div>
                </div>
            </header>

            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Revenue Card */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 rounded-[30px] shadow-xl shadow-teal-900/10 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <DollarSign size={24} className="text-white" />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-teal-100 bg-black/20 px-2 py-1 rounded-full uppercase tracking-wide">
                                <TrendingUp size={10} className="mr-1" />
                                +12%
                            </span>
                        </div>
                        <h3 className="text-3xl font-black mb-1 tracking-tight">
                            ${analytics?.totalEarnings?.toLocaleString() || "0.00"}
                        </h3>
                        <p className="text-teal-100 text-sm font-medium tracking-wide">Total Earnings</p>
                    </div>
                </div>

                {/* Students Card */}
                <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group hover:border-teal-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                        {analytics?.totalStudents || 0}
                    </h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Students</p>
                </div>

                {/* Courses Card */}
                <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group hover:border-yellow-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                        {analytics?.totalCourses || 0}
                    </h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Active Courses</p>
                </div>

                {/* Rating Card */}
                <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group hover:border-orange-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Star size={24} fill="currentColor" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                        {analytics?.averageRating?.toFixed(1) || "0.0"}
                    </h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Average Rating</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Enrollments */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Recent Enrollments</h3>
                            <p className="text-gray-400 text-sm mt-1">Latest students joining your courses</p>
                        </div>
                        <button className="text-teal-600 text-sm font-bold hover:bg-teal-50 px-4 py-2 rounded-xl transition-colors">
                            View All
                        </button>
                    </div>

                    {!analytics?.recentEnrollments || analytics.recentEnrollments.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-[24px] border border-gray-100 border-dashed">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <UserPlus size={24} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No recent enrollments found.</p>
                            <p className="text-gray-400 text-sm mt-1">New students will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analytics.recentEnrollments.map((enrollment, index) => (
                                <div key={index} className="flex items-center p-4 hover:bg-teal-50/30 rounded-2xl transition-colors border border-gray-50 hover:border-teal-100 group">
                                    <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 rounded-2xl flex items-center justify-center font-black mr-4 shadow-sm group-hover:from-teal-100 group-hover:to-teal-200 group-hover:text-teal-700 transition-all">
                                        {enrollment.studentName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{enrollment.studentName}</h4>
                                        <p className="text-sm text-gray-500 mt-0.5">Enrolled in <span className="text-teal-600 font-bold">{enrollment.courseTitle}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            <Clock size={12} />
                                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-[30px] p-8 h-fit">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 px-1">Quick Actions</h3>

                    <div className="space-y-4">
                        <div
                            onClick={() => navigate("/dashboard/videos")}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all cursor-pointer flex items-center gap-4 active:scale-[0.98]"
                        >
                            <div className="p-3.5 bg-black text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Video size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Manage Videos</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Upload & Edit Content</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </div>

                        <div
                            onClick={() => navigate("/dashboard/classes")}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all cursor-pointer flex items-center gap-4 active:scale-[0.98]"
                        >
                            <div className="p-3.5 bg-teal-100 text-teal-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <BookOpen size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">My Classes</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Manage Courses</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </div>

                        <div
                            onClick={() => navigate("/dashboard/earnings")}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all cursor-pointer flex items-center gap-4 active:scale-[0.98]"
                        >
                            <div className="p-3.5 bg-green-100 text-green-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <DollarSign size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Earnings</h4>
                                <p className="text-xs text-gray-500 mt-0.5">View Payments</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </div>

                        <div
                            onClick={() => navigate("/profile")}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all cursor-pointer flex items-center gap-4 active:scale-[0.98]"
                        >
                            <div className="p-3.5 bg-yellow-100 text-yellow-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Settings size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Settings</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Profile & Security</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
