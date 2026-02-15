import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, ShieldCheck, UserCog, Loader2 } from "lucide-react";
import { adminApi } from "../services/api";

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await adminApi.get("/users");
                if (Array.isArray(response.data)) {
                    setUserCount(response.data.length);
                }
            } catch (error) {
                console.error("Failed to fetch user count:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCount();
    }, []);

    return (
        <div className="p-6">
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

            <header className="mb-10">
                <div className="flex items-center gap-3 text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">
                    <span className="w-8 h-[2px] bg-blue-600"></span>
                    User Administration
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                    User Management
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Manage students, teachers, and administrator accounts.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* All Users Card */}
                <div
                    onClick={() => navigate("/dashboard/user-management/all-users")}
                    className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                        <Users size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">All Users</h3>
                    <div className="flex items-center gap-2 mb-4">
                        {loading ? (
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        ) : (
                            <span className="text-3xl font-black text-gray-900">
                                {userCount !== null ? userCount.toLocaleString() : "..."}
                            </span>
                        )}
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Total registered users on the platform.
                    </p>
                </div>

                {/* Add User Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer group">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <UserPlus size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Add New User</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Manually create a new student or teacher account.
                    </p>
                    <button className="text-sm font-bold text-green-600 group-hover:text-green-700 transition-colors">
                        Create Account →
                    </button>
                </div>

                {/* Roles & Permissions Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Roles & Permissions</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Configure access levels for different user roles.
                    </p>
                    <button className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                        Manage Roles →
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg">Recent Users</h3>
                        <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="p-6 text-center text-gray-500 py-12">
                        <UserCog className="mx-auto text-gray-300 mb-3" size={48} />
                        <p>User list will be displayed here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
