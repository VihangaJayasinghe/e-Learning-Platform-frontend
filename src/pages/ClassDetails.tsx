import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassById } from "../services/api";
import { Loader2, ArrowLeft, Star, Clock, Calendar, DollarSign, User } from "lucide-react";

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

const ClassDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

        fetchClassDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
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
        <div className="min-h-screen bg-gray-50 p-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Classes
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${classData.status === 'PUBLISHED' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {classData.status}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star fill="currentColor" size={20} />
                                <span className="font-bold text-lg">{classData.averageRating.toFixed(1)}</span>
                                <span className="text-gray-400 text-sm">({classData.totalReviews} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{classData.className}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed">{classData.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="font-bold text-gray-900">{classData.durationMonths} Months</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Start Date</p>
                                    <p className="font-bold text-gray-900">{classData.startMonth}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Monthly Price</p>
                                    <p className="font-bold text-gray-900">${classData.monthlyPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Syllabus */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Syllabus</h2>
                        <div className="space-y-4">
                            {classData.months.map((month, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-teal-500 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{month.displayName}</h4>
                                                <p className="text-sm text-gray-500">Year-Month: {month.yearMonth}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${month.released ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {month.released ? 'Released' : 'Locked'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Instructor Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                <User size={32} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Instructor</p>
                                <h3 className="text-xl font-bold text-gray-900">{classData.teacher.username}</h3>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-sm font-bold text-gray-700">Qualification</p>
                                <p className="text-gray-600">{classData.teacher.qualification || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">Experience</p>
                                <p className="text-gray-600">{classData.teacher.yearsOfExperience} years</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">Expertise</p>
                                <p className="text-gray-600">{classData.teacher.subjectExpertise}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">Bio</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{classData.teacher.bio}</p>
                            </div>
                        </div>

                        <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                            Contact Instructor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetails;
