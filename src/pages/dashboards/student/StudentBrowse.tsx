import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClasses } from "../../../services/api";
import { Search, Loader2, BookOpen, User, Calendar } from "lucide-react";

interface Class {
    id: string;
    className: string;
    description: string;
    instructorUsername: string;
    schedule: string;
    duration: string;
    price: string;
    status: string;
}

const StudentBrowse: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await getAllClasses();
            // Filter only active classes if needed, or show all
            setClasses(data);
        } catch (error) {
            console.error("Failed to fetch classes", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter(cls => {
        const query = searchQuery.toLowerCase();
        return (
            (cls.className || "").toLowerCase().includes(query) ||
            (cls.description || "").toLowerCase().includes(query) ||
            (cls.instructorUsername || "").toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Browse Classes</h1>
                    <p className="text-gray-500 mt-1">Discover and enroll in new courses</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for classes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-50 outline-none transition-all"
                    />
                </div>
            </div>

            {filteredClasses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No classes found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search terms</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col h-full">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                { /* Placeholder for class image/banner */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <BookOpen size={48} className="text-purple-200" />
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-700 shadow-sm">
                                    {cls.status}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={cls.className}>
                                    {cls.className}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                                    {cls.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User size={16} className="text-purple-500" />
                                        <span>Instructor: <span className="font-medium text-gray-900">{cls.instructorUsername}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-blue-500" />
                                        <span>Schedule: {cls.schedule}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                    <div>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Price</span>
                                        <div className="text-lg font-black text-gray-900">{cls.price}</div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/dashboard/browse/${cls.id}`)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-200 transition-all active:scale-95"
                                    >
                                        View Details
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

export default StudentBrowse;
