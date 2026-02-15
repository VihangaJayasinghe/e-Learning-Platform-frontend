import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassById, checkEnrollment, enrollStudent } from "../../../services/api";
import {
    Loader2,
    ArrowLeft,
    Star,
    Clock,
    Calendar,
    DollarSign,
    User,
    Lock,
    Unlock,
    BookOpen,
    PlayCircle
} from "lucide-react";

interface ClassDetailsData {
    id: string;
    className: string;
    description: string;
    teacher: {
        username: string;
        qualification: string | null;
        yearsOfExperience: number;
        subjectExpertise: string;
        bio: string;
    };
    monthlyPrice: number;
    startMonth: string;
    durationMonths: number;
    months: {
        yearMonth: string;
        displayName: string;
        released: boolean;
    }[];
    status: string;
    averageRating: number;
    totalReviews: number;
}

const StudentClassDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchClassDetails();
            checkEnrollmentStatus();
        }
    }, [id]);

    const fetchClassDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await getClassById(id);
            setClassData(data);
        } catch (err: any) {
            console.error("Failed to fetch class details", err);
            setError("Failed to load class details.");
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        if (!id) return;
        try {
            const enrolled = await checkEnrollment(id);
            setIsEnrolled(enrolled);
        } catch (err) {
            console.error("Failed to check enrollment", err);
        }
    };

    const handleEnroll = async () => {
        if (!id) return;
        try {
            setEnrollLoading(true);
            await enrollStudent(id);
            setIsEnrolled(true);
            alert("Successfully enrolled!");
        } catch (err: any) {
            console.error("Enrollment failed", err);
            alert(err.response?.data?.message || "Failed to enroll. Please try again.");
        } finally {
            setEnrollLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-purple-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-600 text-lg font-medium">{error || "Class not found"}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                {classData.status || "DRAFT"}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                                <Star fill="currentColor" size={16} />
                                <span className="font-bold text-gray-900">{(classData.averageRating || 0).toFixed(1)}</span>
                                <span className="text-gray-400 text-xs">({classData.totalReviews || 0} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">{classData.className}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">{classData.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                                    <p className="font-bold text-gray-900">{classData.durationMonths} Months</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Start Date</p>
                                    <p className="font-bold text-gray-900">{classData.startMonth}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Monthly Price</p>
                                    <p className="font-bold text-gray-900">${classData.monthlyPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Syllabus */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Syllabus</h2>
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded">
                                {(classData.months || []).length} Months
                            </span>
                        </div>

                        <div className="space-y-4">
                            {(classData.months || []).map((month, index) => (
                                <div
                                    key={index}
                                    className={`border border-gray-100 rounded-xl p-5 flex justify-between items-center transition-all ${isEnrolled ? "bg-white hover:border-purple-200 cursor-pointer" : "bg-gray-50/50"
                                        }`}
                                    onClick={() => {
                                        if (isEnrolled && month.released) {
                                            // Future: Expand logic or navigate to Month View
                                            // navigate(`/dashboard/classes/${id}/months/${month.yearMonth}`);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center font-bold shadow-sm transition-colors ${isEnrolled ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-white text-gray-400 border-gray-200"
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${isEnrolled ? "text-gray-900" : "text-gray-700"}`}>
                                                {month.displayName}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                {month.yearMonth}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isEnrolled ? (
                                            month.released ? (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    <Unlock size={14} /> Unlocked
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    <Lock size={14} /> Opening Soon
                                                </span>
                                            )
                                        ) : (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                <Lock size={14} />
                                                Locked
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Enrollment Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                        <div className="mb-6">
                            <span className="text-gray-500 text-sm font-medium">Total Price</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-gray-900">${classData.monthlyPrice}</span>
                                <span className="text-gray-500">/ month</span>
                            </div>
                        </div>

                        {isEnrolled ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                                    <CheckCircle size={18} />
                                    You are enrolled!
                                </div>
                                <button
                                    onClick={() => {/* Navigate to first month or similar */ }}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={20} /> Continue Learning
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrollLoading}
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {enrollLoading ? <Loader2 className="animate-spin" size={20} /> : "Enroll Now"}
                            </button>
                        )}

                        {!isEnrolled && (
                            <p className="text-xs text-center text-gray-400 mt-4">
                                30-day money-back guarantee
                            </p>
                        )}
                    </div>

                    {/* Instructor Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Instructor</p>
                                <h3 className="text-lg font-bold text-gray-900">{classData.teacher?.username || "Instructor"}</h3>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Experience</span>
                                <span className="text-sm font-medium text-gray-900">{classData.teacher?.yearsOfExperience || 0} years</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Expertise</span>
                                <span className="text-sm font-medium text-gray-900 text-right">{classData.teacher?.subjectExpertise || "General"}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 block mb-1">Bio</span>
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                    {classData.teacher?.bio || "No bio available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Missing icon import hack (CheckCircle)
const CheckCircle = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default StudentClassDetails;
