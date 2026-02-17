import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentEnrollments } from "../../../services/api";
import {
    BookOpen,
    Loader2,
    User,
    Calendar,
    Search,
    Filter,
    Clock,
    Sparkles,
    ArrowRight,
    MoreVertical,
    X,
    CheckCircle
} from "lucide-react";

interface Class {
    id: string;
    className: string;
    description: string;
    instructorUsername: string;
    schedule: string;
    duration: string;
    price: string;
    status: string;
    teacher?: { username: string };
    startMonth?: string;
}

interface Enrollment {
    id: string;
    classEnrolled: Class;
    enrollmentDate: string;
    status: string;
}

const StudentClasses: React.FC = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Completed">("All");

    // Popup State
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const data = await getStudentEnrollments();
            if (Array.isArray(data)) {
                setEnrollments(data);
            } else {
                setEnrollments([]);
            }
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived state for filtering
    const filteredEnrollments = enrollments.filter(enrollment => {
        const cls = enrollment.classEnrolled;
        if (!cls) return false;

        const matchesSearch = cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === "All"
            ? true
            : enrollment.status.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    const handleCardClick = (cls: Class) => {
        setSelectedClass(cls);
    };

    const handleCloseModal = () => {
        setSelectedClass(null);
    };

    const handleContinueLearning = () => {
        if (selectedClass) {
            navigate(`/dashboard/browse/${selectedClass.id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-teal-600" size={32} />
                <p className="text-gray-400 text-sm font-medium tracking-wide">LOADING COURSES...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 min-h-screen bg-white p-6 sm:p-8 lg:p-12 font-sans relative">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-teal-900 tracking-tight">My Classes</h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Manage your learning progress. You have <span className="text-teal-600 font-bold">{enrollments.length}</span> active courses.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid - Wide Cards */}
            {filteredEnrollments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[30px] border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                        <BookOpen className="text-teal-500" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No courses found</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-xs text-center">
                        {searchQuery ? "Try adjusting your search terms." : "Start learning by exploring our catalog."}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => navigate('/dashboard/browse')}
                            className="mt-8 text-teal-600 font-bold text-sm hover:underline hover:text-teal-700 transition-colors"
                        >
                            Browse Catalog
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredEnrollments.map((enrollment, index) => {
                        const cls = enrollment.classEnrolled;
                        if (!cls) return null;

                        const instructorName = cls.instructorUsername || cls.teacher?.username || "Instructor";
                        const startDate = cls.schedule || cls.startMonth || "Flexible";

                        return (
                            <div
                                key={enrollment.id}
                                onClick={() => handleCardClick(cls)}
                                className="group bg-white rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 flex flex-row h-32 overflow-hidden cursor-pointer"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Left Icon Section */}
                                <div className="w-24 bg-gray-50 group-hover:bg-teal-50 transition-colors duration-300 flex items-center justify-center flex-shrink-0 border-r border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <BookOpen size={20} />
                                    </div>
                                </div>

                                {/* Right Content Section */}
                                <div className="flex-1 p-5 flex flex-col justify-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-teal-700 transition-colors mb-1">
                                            {cls.className}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-1 mb-3">{cls.description}</p>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User size={10} className="text-gray-400" />
                                            </div>
                                            <span className="text-gray-500 text-xs font-medium">{instructorName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Calendar size={10} className="text-gray-400" />
                                            </div>
                                            <span className="text-gray-500 text-xs font-medium">{startDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- CLASS DETAIL POPUP MODAL --- */}
            {selectedClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[30px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative border border-gray-100">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* Modal Header */}
                        <div className="bg-teal-50/50 p-8 text-center border-b border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-teal-600 flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">{selectedClass.className}</h2>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">{selectedClass.description}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <User className="text-teal-500 mb-2" size={20} />
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Instructor</span>
                                    <span className="text-sm font-bold text-gray-900">{selectedClass.instructorUsername || selectedClass.teacher?.username || "TBA"}</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <Clock className="text-teal-500 mb-2" size={20} />
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Duration</span>
                                    <span className="text-sm font-bold text-gray-900">{selectedClass.duration || "Self-Paced"}</span>
                                </div>
                            </div>

                            {/* Progress Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-900">Your Progress</span>
                                    <span className="text-sm font-bold text-teal-600">5%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500 w-[5%] rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Last accessed 2 days ago</p>
                            </div>

                            <button
                                onClick={handleContinueLearning}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-teal-200 flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                <span>Continue Learning</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>

                    </div>
                    {/* Backdrop Close Trigger */}
                    <div className="absolute inset-0 -z-10" onClick={handleCloseModal}></div>
                </div>
            )}

        </div>
    );
};

export default StudentClasses;
