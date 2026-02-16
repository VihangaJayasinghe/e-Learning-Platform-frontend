import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClasses, getAllTeachers } from "../../../services/api";
import { Search, Loader2, User } from "lucide-react";
import ClassCard from "../../../components/ClassCard";

interface Class {
    id: string;
    className: string;
    description: string;
    instructorUsername: string;
    schedule: string;
    duration: string;
    monthlyPrice: number;
    status: string;
    averageRating?: number;
}

interface Teacher {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    qualification: string;
    subjectExpertise: string;
    yearsOfExperience: number;
    profileImage?: string;
}

const StudentBrowse: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'classes' | 'teachers'>('classes');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        fetchData();
    }, [viewMode]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (viewMode === 'classes') {
                const data = await getAllClasses();
                // Filter active classes and ensure it's an array
                const activeClasses = Array.isArray(data) ? data.filter((c: any) => c.status === 'ACTIVE') : [];
                setClasses(activeClasses);
            } else {
                const data = await getAllTeachers();
                setTeachers(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = viewMode === 'classes'
        ? classes.filter(cls =>
            (cls.className || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cls.instructorUsername || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
        : teachers.filter(teacher =>
            (teacher.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (teacher.subjectExpertise || "").toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-gray-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        Browse {viewMode === 'classes' ? 'Classes' : 'Teachers'}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        {viewMode === 'classes'
                            ? "Discover courses to advance your skills"
                            : "Connect with expert instructors"}
                    </p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
                    <button
                        onClick={() => setViewMode('classes')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${viewMode === 'classes'
                            ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                            : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        Classes
                    </button>
                    <button
                        onClick={() => setViewMode('teachers')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${viewMode === 'teachers'
                            ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                            : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        Teachers
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-10 relative">
                <div className="relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={viewMode === 'classes' ? "Search for classes, topics..." : "Search for teachers, expertise..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm text-lg"
                    />
                    {/* Can add a filter button here later */}
                </div>
            </div>

            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <Loader2 className="animate-spin text-teal-600" size={48} />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 text-lg">Try adjusting your search terms</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {viewMode === 'classes' ? (
                        // Classes Grid
                        (filteredItems as Class[]).map((cls) => (
                            <ClassCard
                                key={cls.id}
                                classData={cls}
                                onClick={() => navigate(`/dashboard/browse/${cls.id}`)}
                            />
                        ))
                    ) : (
                        // Teachers Grid
                        (filteredItems as Teacher[]).map((teacher) => (
                            <div key={teacher.id} className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 flex flex-col relative h-full">
                                <div className="p-8 pb-0 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-gray-100 rounded-full mb-6 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                                        {teacher.profileImage ? (
                                            <img src={teacher.profileImage} alt={teacher.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} className="text-gray-300" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{teacher.username}</h3>
                                    <p className="text-teal-600 font-bold text-sm bg-teal-50 px-3 py-1 rounded-full mb-6">{teacher.subjectExpertise || "Instructor"}</p>
                                </div>

                                <div className="p-8 pt-0 flex-1 flex flex-col">
                                    <p className="text-gray-600 text-center text-sm line-clamp-3 mb-8 leading-relaxed">
                                        {teacher.bio || "No bio available."}
                                    </p>

                                    <div className="space-y-3 mb-8 bg-gray-50 p-5 rounded-2xl">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 font-medium">Experience</span>
                                            <span className="font-bold text-gray-900">{teacher.yearsOfExperience} years</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 font-medium">Qualification</span>
                                            <span className="font-bold text-gray-900 truncate max-w-[120px]" title={teacher.qualification}>{teacher.qualification || "N/A"}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/dashboard/teacher/${teacher.username}`)}
                                        className="w-full mt-auto bg-white border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:border-teal-600 hover:text-teal-600 transition-all active:scale-95"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentBrowse;
