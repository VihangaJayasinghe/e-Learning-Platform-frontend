import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { fetchClassesByInstructor } from "../../../services/api";
import { Loader2, AlertCircle } from "lucide-react";

interface ClassItem {
    id: number;
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    price: number;
    status: string;
    thumbnailUrl?: string;
}

const TeacherClasses: React.FC = () => {
    const context = useContext(AuthContext);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    if (!context) return null;
    const { user } = context;

    useEffect(() => {
        const loadClasses = async () => {
            if (user?.username) {
                try {
                    setLoading(true);
                    const data = await fetchClassesByInstructor(user.username);
                    // Ensure data is an array
                    setClasses(Array.isArray(data) ? data : []);
                } catch (err) {
                    console.error("Failed to fetch classes", err);
                    setError("Failed to load classes. Please try again later.");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadClasses();
    }, [user?.username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-teal-600">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-full">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">My Classes</h2>
                    <p className="text-gray-500 mt-1">Manage your courses and student enrollments</p>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-teal-100">
                    + Create New Class
                </button>
            </header>

            {classes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">You haven't created any classes yet.</p>
                    <button className="mt-4 text-teal-600 font-bold hover:underline">
                        Create your first class
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${cls.status === 'PUBLISHED'
                                        ? "bg-teal-100 text-teal-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}>
                                    {cls.status || 'DRAFT'}
                                </div>
                                <span className="text-xs text-gray-400 font-mono">ID: {cls.id}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors line-clamp-1" title={cls.title}>
                                {cls.title}
                            </h3>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                {cls.description || "No description provided."}
                            </p>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    {cls.category || "Uncategorized"}
                                </span>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    {cls.difficultyLevel || "All Levels"}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 px-4 rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium transition-colors">
                                    Edit
                                </button>
                                <button className="flex-1 py-2 px-4 rounded-lg bg-black text-white hover:bg-gray-800 font-medium transition-colors">
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherClasses;
