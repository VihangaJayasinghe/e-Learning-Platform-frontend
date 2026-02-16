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
    Loader2
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
            <div className="flex items-center justify-center min-h-[500px] text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[500px] text-red-600 font-bold">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <header className="mb-8">
                <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-widest mb-2">
                    <span className="w-8 h-[2px] bg-teal-600"></span>
                    Instructor Overview
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900">
                            Welcome back, {user?.username}!
                        </h2>
                        <p className="text-gray-500 mt-2 text-lg">
                            Here's what's happening with your courses today.
                        </p>
                    </div>
                    {/* Date/Time could go here */}
                </div>
            </header>

            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} className="mr-1" />
                            Revenue
                        </span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">
                        ${analytics?.totalEarnings?.toLocaleString() || "0.00"}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Total Earnings</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">
                        {analytics?.totalStudents || 0}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Total Students</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">
                        {analytics?.totalCourses || 0}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Active Courses</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                            <Star size={24} fill="currentColor" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">
                        {analytics?.averageRating?.toFixed(1) || "0.0"}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Average Rating</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Recent Enrollments */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Recent Enrollments</h3>
                        <button className="text-teal-600 text-sm font-bold hover:underline">View All</button>
                    </div>

                    {!analytics?.recentEnrollments || analytics.recentEnrollments.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl">
                            <UserPlus size={48} className="mx-auto mb-3 text-gray-300" />
                            <p>No recent enrollments found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analytics.recentEnrollments.map((enrollment, index) => ( // Using index as fallback key if no ID
                                <div key={index} className="flex items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-gray-50 hover:border-gray-100">
                                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-4">
                                        {enrollment.studentName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{enrollment.studentName}</h4>
                                        <p className="text-sm text-gray-500">Enrolled in <span className="text-indigo-600 font-medium">{enrollment.courseTitle}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                            <Clock size={12} />
                                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions (Preserved from previous dashboard) */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Quick Actions</h3>

                    <div
                        onClick={() => navigate("/dashboard/videos")}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-100/50 transition-all cursor-pointer flex items-center gap-4"
                    >
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Video size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Manage Videos</h4>
                            <p className="text-xs text-gray-500">Upload & Edit Content</p>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate("/dashboard/classes")}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100/50 transition-all cursor-pointer flex items-center gap-4"
                    >
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">My Classes</h4>
                            <p className="text-xs text-gray-500">Manage Courses</p>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate("/dashboard/earnings")}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-500 hover:shadow-lg hover:shadow-green-100/50 transition-all cursor-pointer flex items-center gap-4"
                    >
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Earnings</h4>
                            <p className="text-xs text-gray-500">View Payments</p>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate("/profile")}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-100/50 transition-all cursor-pointer flex items-center gap-4"
                    >
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Settings</h4>
                            <p className="text-xs text-gray-500">Profile & Security</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherDashboard;
