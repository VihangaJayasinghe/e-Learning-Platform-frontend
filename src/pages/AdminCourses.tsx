import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { getAllCourses, deleteCourse, type Course } from "../services/api";

const AdminCourses: React.FC = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCourses();
            console.log("AdminCourses: API Data received:", data);

            if (Array.isArray(data)) {
                setCourses(data);
            } else if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
                // Handle Spring Data Page structure just in case
                console.log("AdminCourses: Detected Page structure, extracting content.");
                setCourses((data as any).content);
            } else {
                console.error("AdminCourses: Data is not an array:", data);
                // Attempt to wrap single object if it looks like a course
                if (data && (data as any).id && (data as any).courseTitle) {
                    setCourses([data as any]);
                } else {
                    setCourses([]);
                    setError("Received invalid data format from server. Check console for details.");
                }
            }
        } catch (err: any) {
            console.error("Error fetching courses:", err);
            setError(err.message || "Failed to fetch courses. Please try again.");
            setCourses([]); // Ensure courses is empty on error to prevent render crash
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) {
            return;
        }

        const secretKey = window.prompt("Please enter the secret key to confirm deletion:");
        if (!secretKey) {
            return;
        }

        try {
            await deleteCourse(id, secretKey);
            setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
            alert(`Course "${title}" deleted successfully.`);
        } catch (err: any) {
            console.error("Error deleting course:", err);
            alert("Failed to delete course. Invalid secret key or server error.");
        }
    };

    const filteredCourses = courses.filter(course =>
        (course.courseTitle && course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.instructorName && course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.subject && course.subject.toLowerCase().includes(searchTerm.toLowerCase()))
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
                <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-3">
                    <span className="w-8 h-[2px] bg-indigo-600"></span>
                    Course Management
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                    Course Catalog
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    View and manage all courses on the platform.
                </p>
            </header>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search courses, instructors, subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-indigo-600" size={48} />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center justify-center gap-3">
                    <AlertCircle size={24} />
                    <span className="font-medium">{error}</span>
                    <button
                        onClick={fetchCourses}
                        className="underline hover:text-red-800 ml-2"
                    >
                        Retry
                    </button>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                    <p className="text-gray-500">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <img
                                    src={course.thumbnailUrl || "https://via.placeholder.com/400x200?text=No+Image"}
                                    alt={course.courseTitle || "Course"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Course+Image";
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                    {course.level || "All Levels"}
                                </div>
                                {course.isFree && (
                                    <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                                        Free
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-1 rounded-md">
                                        {course.subject || "General"}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        ${course.price !== undefined ? course.price : "0.00"}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={course.courseTitle}>
                                    {course.courseTitle || "Untitled Course"}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                    {course.description || "No description available."}
                                </p>

                                <div className="flex items-center gap-3 mb-4 pt-4 border-t border-gray-50">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {(course.instructorName || "?").charAt(0)}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{course.instructorName || "Unknown Instructor"}</p>
                                        <p className="text-xs text-gray-500">Instructor</p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(course.id, course.courseTitle || "Untitled Course");
                                        }}
                                        className="ml-auto p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete Course"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <BookOpen size={14} />
                                        <span>{course.totalLessons || 0} Lessons</span>
                                    </div>
                                    <div>
                                        {course.estimatedHours || 0} Hours
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
