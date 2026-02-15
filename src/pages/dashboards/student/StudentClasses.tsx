import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentEnrollments } from "../../../services/api";
import { BookOpen, Loader2, User, Calendar } from "lucide-react";

interface Class {
    id: string;
    className: string;
    description: string;
    instructorUsername: string; // The backend might return 'teacher' object, need to check mapping
    schedule: string;
    duration: string;
    price: string;
    status: string;
    teacher?: { username: string }; // Handle nested teacher object
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
                console.error("Enrollment data is not an array:", data);
                setEnrollments([]);
            }
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                <p className="text-gray-500 mt-1">Access your enrolled courses</p>
            </div>

            {enrollments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No classes enrolled</h3>
                    <p className="text-gray-500 mt-1">You haven't enrolled in any classes yet.</p>
                    <button
                        onClick={() => navigate('/dashboard/browse')}
                        className="mt-4 text-purple-600 font-bold hover:underline"
                    >
                        Browse Classes
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => {
                        const cls = enrollment.classEnrolled;

                        // Defensive check: if class data is missing, skip rendering this card
                        if (!cls) {
                            console.warn("Enrollment found without class data:", enrollment);
                            return null;
                        }

                        // Handle potential data structure differences
                        const instructorName = cls.instructorUsername || cls.teacher?.username || "Instructor";
                        const startDate = cls.schedule || cls.startMonth || "TBA";

                        return (
                            <div key={enrollment.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col h-full">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                        <BookOpen size={48} className="text-indigo-200" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                                        {enrollment.status}
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
                                            <span>Instructor: <span className="font-medium text-gray-900">{instructorName}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={16} className="text-blue-500" />
                                            <span>Start: {startDate}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 mt-auto">
                                        <button
                                            onClick={() => navigate(`/dashboard/browse/${cls.id}`)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                        >
                                            Go to Class
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentClasses;
