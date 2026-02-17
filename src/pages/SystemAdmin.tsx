import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Server, Lock, Database, X } from "lucide-react";
import { getSystemStats, type SystemStats } from "../services/api";

const SystemAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);

    const handleServerStatusClick = async () => {
        setLoading(true);
        try {
            const data = await getSystemStats();
            setStats(data);
            setShowStatsModal(true);
        } catch (error) {
            console.error("Failed to fetch system stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 relative">
            {showStatsModal && stats && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-fadeIn">
                        <button
                            onClick={() => setShowStatsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Server size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">System Statistics</h3>
                                <p className="text-sm text-gray-500">Live platform metrics</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-600 font-medium">Total Courses</span>
                                <span className="text-2xl font-black text-gray-900">{stats.totalCourses}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-600 font-medium">Total Videos</span>
                                <span className="text-2xl font-black text-gray-900">{stats.totalVideos}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-600 font-medium">Total Instructors</span>
                                <span className="text-2xl font-black text-gray-900">{stats.totalInstructors}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-600 font-medium">Total Students</span>
                                <span className="text-2xl font-black text-gray-900">{stats.totalStudents}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

            <header className="mb-10">
                <div className="flex items-center gap-3 text-red-600 font-bold text-sm uppercase tracking-widest mb-3">
                    <span className="w-8 h-[2px] bg-red-600"></span>
                    System Administration
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                    System Configuration
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Manage core system settings, security protocols, and infrastructure.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Server Status Card */}
                <div
                    onClick={handleServerStatusClick}
                    className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all cursor-pointer group hover:border-blue-500"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Server size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Server Status</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-green-600">Operational</span>
                        {loading && <span className="text-xs text-gray-400 ml-2">Fetching stats...</span>}
                    </div>
                    <p className="text-gray-500 text-sm">
                        Click to view detailed system statistics and metrics.
                    </p>
                </div>

                {/* Security Settings Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 text-red-600">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Security Protocols</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Configure firewall rules, SSL certificates, and access policies.
                    </p>
                    <button className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                        View Settings →
                    </button>
                </div>

                {/* Database Management Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                        <Database size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Database</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Manage database connections, backups, and migrations.
                    </p>
                    <button className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                        Manage DB →
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                <Shield className="text-amber-600 shrink-0 mt-1" size={24} />
                <div>
                    <h4 className="font-bold text-amber-900 text-lg mb-1">Restricted Access Area</h4>
                    <p className="text-amber-700">
                        Changes made here can affect the entire platform. Please proceed with caution.
                        All actions are logged for security purposes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemAdmin;
