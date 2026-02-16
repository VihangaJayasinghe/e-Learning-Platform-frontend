import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Loader2, UserX, Trash2, Edit } from "lucide-react";
import { adminApi } from "../services/api";

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    lastPasswordChange: string | null;
    // formatting other fields as optional or explicitly handled if needed
    nic?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    mobile_number?: string | null;
    qualification?: string | null;
    yearsOfExperience?: number | null;
    subjectExpertise?: string | null;
    bio?: string | null;
    authProvider?: string | null;
}

const AllUsers: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [error, setError] = useState<string | null>(null);

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.get("/users");
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Search user by username
    const searchUser = async (username: string) => {
        if (!username.trim()) {
            fetchUsers(); // Reset to all users if search is empty
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.get(`/users/${username}`);
            // If the API returns a single object, wrap it in an array
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setUsers(data);
        } catch (err) {
            console.error("Error searching user:", err);
            setError("User not found or error occurred.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter users by role
    const filterByRole = async (role: string) => {
        if (role === "ALL") {
            fetchUsers();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.get(`/users/role/${role}`);
            // Assuming API returns a list for role filtering
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error filtering users:", err);
            setError("Failed to fetch users for this role.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Delete user
    const handleDelete = async (username: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        const secretKey = window.prompt("Please enter the secret key to confirm deletion:");
        if (!secretKey) {
            return; // User cancelled prompt
        }

        try {
            await adminApi.delete(`/users/${username}/${secretKey}`);
            // Remove user from state on success
            setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
            alert(`User "${username}" deleted successfully.`);
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user. Invalid secret key or server error.");
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchUser(searchTerm);
    };

    // Handle role change
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        setRoleFilter(newRole);
        filterByRole(newRole);
    };

    return (
        <div className="p-6">
            <button
                onClick={() => navigate("/dashboard/user-management")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to User Management</span>
            </button>

            <header className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                    All Users
                </h2>
                <p className="text-gray-500">
                    View and manage all registered users on the platform.
                </p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <button
                        type="submit"
                        className="absolute right-2 top-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={18} className="text-gray-500" />
                    <select
                        value={roleFilter}
                        onChange={handleRoleChange}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4">ID</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Last Password Change</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={32} />
                                        <span>Loading users...</span>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-red-500">
                                        <UserX className="mx-auto mb-2" size={32} />
                                        <span>{error}</span>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors text-sm text-gray-700">
                                        <td className="p-4 font-mono text-xs text-gray-400">{user.id}</td>
                                        <td className="p-4 font-bold text-gray-900">{user.username}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                                    user.role === 'TEACHER' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {user.lastPasswordChange ? new Date(user.lastPasswordChange).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => navigate(`/dashboard/user-management/update-user/${user.username}`)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.username)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
