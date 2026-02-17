import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeacherByUsername, fetchClassesByInstructor } from "../../../services/api";
import { Loader2, User, BookOpen, GraduationCap, ArrowLeft, Star } from "lucide-react";
import ClassCard from "../../../components/ClassCard";

interface Teacher {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    qualification: string;
    subjectExpertise: string;
    yearsOfExperience: number;
    profileImage?: string;
    email?: string;
}

interface Class {
    id: string;
    className: string;
    description: string;
    instructorUsername: string;
    schedule: string;
    duration: string;
    monthlyPrice: number;
    status: string;
}

const StudentTeacherProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!username) return;
            try {
                setLoading(true);
                // 1. Fetch Teacher Details
                const teacherData = await getTeacherByUsername(username);
                setTeacher(teacherData);

                // 2. Fetch Teacher's Classes (using username directly since we have it)
                const classesData = await fetchClassesByInstructor(username);
                // Filter active classes
                const activeClasses = Array.isArray(classesData)
                    ? classesData.filter((c: any) => c.status === 'ACTIVE')
                    : [];
                setClasses(activeClasses);

            } catch (error) {
                console.error("Failed to fetch teacher profile", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-teal-600" size={48} />
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-teal-600 font-bold hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-gray-900">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Browse</span>
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-12">
                <div className="h-32 bg-gradient-to-r from-teal-600 to-teal-400"></div>
                <div className="px-8 pb-8 md:px-12 md:pb-12 -mt-12 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 border border-gray-100 shadow-md flex-shrink-0">
                        <div className="w-full h-full bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                            {teacher.profileImage ? (
                                <img src={teacher.profileImage} alt={teacher.username} className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-gray-300" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 pt-4 md:pt-14">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2">{teacher.fullName || teacher.username}</h1>
                                <p className="text-xl text-teal-600 font-bold flex items-center gap-2">
                                    <GraduationCap size={24} />
                                    {teacher.subjectExpertise || "Instructor"}
                                </p>
                            </div>
                            {/* Can add 'Message' or 'Follow' buttons here later */}
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mb-6">
                            {teacher.bio || "No bio available for this instructor."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                    <Star size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                                    <p className="text-gray-900 font-bold">{teacher.yearsOfExperience} Years</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Qualification</p>
                                    <p className="text-gray-900 font-bold truncate max-w-[200px]" title={teacher.qualification}>{teacher.qualification || "N/A"}</p>
                                </div>
                            </div>
                            {/* Add more stats if available */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Classes Section */}
            <div>
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                        <BookOpen size={20} />
                    </div>
                    Classes by {teacher.username}
                </h2>

                {classes.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-[32px] border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-gray-300" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No active classes</h3>
                        <p className="text-gray-500 mt-1">This instructor hasn't listed any active classes yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {classes.map((cls) => (
                            <ClassCard
                                key={cls.id}
                                classData={cls}
                                onClick={() => navigate(`/dashboard/browse/${cls.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTeacherProfile;
