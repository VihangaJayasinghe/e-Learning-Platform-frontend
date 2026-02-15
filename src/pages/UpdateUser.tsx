import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, User, Key } from "lucide-react";
import { adminApi } from "../services/api";

const UpdateUser: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        qualification: "",
        bio: "",
        role: "STUDENT" // Default, but will be overwritten
    });
    const [secretKey, setSecretKey] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Try to fetch specific user
                const response = await adminApi.get(`/users/${encodeURIComponent(username || "")}`);
                const data = response.data;
                // If api returns array (like search), take the first one
                const userData = Array.isArray(data) ? data[0] : data;

                if (userData) {
                    setFormData({
                        first_name: userData.first_name || "",
                        last_name: userData.last_name || "",
                        mobile_number: userData.mobile_number || "",
                        qualification: userData.qualification || "",
                        bio: userData.bio || "",
                        role: userData.role || "STUDENT"
                    });
                } else {
                    throw new Error("User not found via direct API.");
                }
            } catch (err) {
                console.warn("Direct fetch failed, trying fallback:", err);
                // Fallback: fetch all users and find
                try {
                    const response = await adminApi.get("/users");
                    if (Array.isArray(response.data)) {
                        const allUsers = response.data;
                        const foundUser = allUsers.find((u: any) => u.username === username);
                        if (foundUser) {
                            setFormData({
                                first_name: foundUser.first_name || "",
                                last_name: foundUser.last_name || "",
                                mobile_number: foundUser.mobile_number || "",
                                qualification: foundUser.qualification || "",
                                bio: foundUser.bio || "",
                                role: foundUser.role || "STUDENT"
                            });
                            setError(null);
                            return;
                        }
                    }
                } catch (fallbackErr) {
                    console.error("Fallback fetch also failed:", fallbackErr);
                }

                setError("Failed to fetch user details.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUser();
        }
    }, [username]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (!secretKey) {
            setError("Secret key is required to update user.");
            setSaving(false);
            return;
        }

        try {
            await adminApi.put(`/users/${encodeURIComponent(username || "")}/${secretKey}`, formData);
            alert("User updated successfully!");
            navigate("/dashboard/user-management/all-users");
        } catch (err: any) {
            console.error("Error updating user:", err);
            setError("Failed to update user. " + (err.response?.data?.message || "Invalid key or server error."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={() => navigate("/dashboard/user-management/all-users")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to All Users</span>
            </button>

            <header className="mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4 text-blue-600 mb-2">
                    <User size={32} />
                    <h2 className="text-3xl font-black text-gray-900">
                        Update User: <span className="text-blue-600">{username}</span>
                    </h2>
                </div>
                <p className="text-gray-500">
                    Edit user details. A valid secret key is required to save changes.
                </p>
            </header>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                        <input
                            type="text"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Qualification</label>
                        <input
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                        >
                            <option value="STUDENT">STUDENT</option>
                            <option value="TEACHER">TEACHER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                    <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                        <Key size={18} className="text-gray-500" />
                        Administrator Secret Key
                    </label>
                    <input
                        type="password"
                        placeholder="Enter secret key to confirm update"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Authorization is required to modify user accounts.
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Update User
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;
