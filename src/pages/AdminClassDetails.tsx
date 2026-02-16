import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { getClassDetails, type Class } from "../services/api";

const AdminClassDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classDetails, setClassDetails] = useState<Class | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchClassDetails(id);
        }
    }, [id]);

    const fetchClassDetails = async (classId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClassDetails(classId);
            setClassDetails(data);
        } catch (err: any) {
            console.error("Error fetching class details:", err);
            setError("Failed to fetch class details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    if (error || !classDetails) {
        return (
            <div className="min-h-screen p-6 bg-gray-50">
                <button
                    onClick={() => navigate("/dashboard/admin-classes")}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Classes</span>
                </button>
                <div className="bg-red-50 text-red-600 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
                    <AlertCircle size={48} />
                    <h2 className="text-xl font-bold">Error Loading Class</h2>
                    <p>{error || "Class not found."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate("/dashboard/admin-classes")}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Classes</span>
            </button>

            <header className="mb-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-6 md:items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-widest">
                                <span className="w-6 h-[2px] bg-purple-600"></span>
                                {classDetails.status}
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">
                            {classDetails.className}
                        </h1>
                        <p className="text-gray-500 text-lg mb-4">
                            {classDetails.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                                Instructor: <span className="font-bold text-gray-900">{classDetails.instructorName}</span>
                            </div>
                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                                Price: <span className="font-bold text-gray-900">${classDetails.monthlyPrice}/mo</span>
                            </div>
                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                                Duration: <span className="font-bold text-gray-900">{classDetails.durationMonths} Months</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Start Month</div>
                        <div className="text-2xl font-bold text-gray-900">{classDetails.startMonth}</div>
                    </div>
                </div>
            </header>

            <h3 className="text-xl font-bold text-gray-900 mb-6 pl-2 border-l-4 border-purple-600">
                Monthly Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classDetails.months.map((month) => (
                    <div key={month.yearMonth} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg text-sm">
                                {month.displayName}
                            </span>
                            {month.released ? (
                                <div title="Released">
                                    <CheckCircle className="text-green-500" size={20} />
                                </div>
                            ) : (
                                <div title="Not Released">
                                    <XCircle className="text-gray-300" size={20} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                                <span className="text-gray-500">Videos</span>
                                <span className="font-bold text-gray-900">{month.videoIds.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                                <span className="text-gray-500">Quizzes</span>
                                <span className="font-bold text-gray-900">{month.quizIds.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                                <span className="text-gray-500">Documents</span>
                                <span className="font-bold text-gray-900">{month.documentIds.length}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 text-center">
                            {month.releaseDate ? `Released: ${new Date(month.releaseDate).toLocaleDateString()}` : "Scheduled"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminClassDetails;
