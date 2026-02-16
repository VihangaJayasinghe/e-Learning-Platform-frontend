import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Loader2, AlertCircle, Calendar, GraduationCap, Trash2 } from "lucide-react";
import { getAllClasses, deleteClass, type Class } from "../services/api";

const AdminClasses: React.FC = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllClasses();
            if (Array.isArray(data)) {
                setClasses(data);
            } else {
                setClasses([]);
                console.error("Data is not an array:", data);
            }
        } catch (err: any) {
            console.error("Error fetching classes:", err);
            setError("Failed to fetch classes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete class "${name}"?`)) {
            return;
        }

        const secretKey = window.prompt("Please enter the secret key to confirm deletion:");
        if (!secretKey) {
            return;
        }

        try {
            await deleteClass(id, secretKey);
            setClasses(prev => prev.filter(c => c.id !== id));
            alert(`Class "${name}" deleted successfully.`);
        } catch (err: any) {
            console.error("Error deleting class:", err);
            alert("Failed to delete class. Invalid secret key or server error.");
        }
    };

    const filteredClasses = classes.filter(cls =>
        (cls.className && cls.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cls.instructorName && cls.instructorName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

            <header className="mb-10">
                <div className="flex items-center gap-3 text-purple-600 font-bold text-sm uppercase tracking-widest mb-3">
                    <span className="w-8 h-[2px] bg-purple-600"></span>
                    Class Management
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                    Class Catalog
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    View and manage all active classes and their schedules.
                </p>
            </header>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search classes or instructors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-purple-600" size={48} />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center justify-center gap-3">
                    <AlertCircle size={24} />
                    <span className="font-medium">{error}</span>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
                    <p className="text-gray-500">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => navigate(`/dashboard/admin-classes/${cls.id}`)}
                            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-purple-500 relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <GraduationCap size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {cls.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={cls.className}>
                                {cls.className}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                {cls.description}
                            </p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>Starts: {cls.startMonth}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>Duration: {cls.durationMonths} Months</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {(cls.instructorName || "?").charAt(0)}
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-medium text-gray-900">{cls.instructorName || "Unknown"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg text-purple-600">
                                        ${cls.monthlyPrice}<span className="text-xs text-gray-400 font-normal">/mo</span>
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(cls.id, cls.className);
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete Class"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminClasses;
