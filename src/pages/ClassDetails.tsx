import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getClassById, extendClassDuration, updateClassStatus, deleteClass, releaseMonth, unreleaseMonth } from "../services/api";
import { Loader2, ArrowLeft, Star, Clock, Calendar, DollarSign, User, Edit, Plus, Trash2, Lock, Unlock } from "lucide-react";
import ClassFormModal from "../components/modals/CreateClassModal";
import { ClassStatus } from "../types";

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
    status: ClassStatus;
    averageRating: number;
    totalReviews: number;
}

const ClassDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!; // Assume context exists
    const [classData, setClassData] = useState<ClassDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [extendMonths, setExtendMonths] = useState(1);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [actionLoading, setActionLoading] = useState(false);


    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!classData || !id) return;

        // Confirmation for critical changes (e.g. archiving)
        if (newStatus === ClassStatus.ARCHIVED) {
            if (!window.confirm("Are you sure you want to ARCHIVE this class? It will be hidden from everyone.")) return;
        }

        try {
            setActionLoading(true);
            await updateClassStatus(id, newStatus);
            await fetchClassDetails();
            // alert(`Class status updated to ${newStatus}`);
        } catch (err: any) {
            console.error("Failed to update status", err);
            const errorMessage = err.response?.data?.message || "Failed to update status";
            alert(`${errorMessage} (Status: ${err.response?.status})`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleExtendDuration = async () => {
        if (!classData || !id) return;

        // Basic validation
        if (extendMonths < 1) {
            alert("Please enter a valid number of months (minimum 1).");
            return;
        }

        if (!window.confirm(`Are you sure you want to extend this class by ${extendMonths} month(s)?`)) return;

        try {
            setActionLoading(true);
            await extendClassDuration(id, extendMonths);
            await fetchClassDetails(); // Refresh data to show new duration
            setIsExtendModalOpen(false);
            setExtendMonths(1); // Reset form
            alert(`Class duration extended by ${extendMonths} month(s) successfully!`);
        } catch (err: any) {
            console.error("Failed to extend duration", err);
            const errorMessage = err.response?.data?.message || "Failed to extend duration";
            alert(`${errorMessage} (Status: ${err.response?.status})`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClass = async () => {
        if (!classData || !id) return;
        if (deleteConfirmation !== classData.className) return;

        try {
            setActionLoading(true);
            await deleteClass(id);
            navigate('/dashboard/classes');
        } catch (err: any) {
            console.error("Failed to delete class", err);
            alert(err.response?.data?.message || "Failed to delete class");
            setActionLoading(false);
        }
    };

    const handleToggleMonthStatus = async (yearMonth: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation
        if (!classData || !id) return;

        try {
            // Optimistic update or just reload
            // Let's reload to be safe and simple
            if (currentStatus) {
                await unreleaseMonth(id, yearMonth);
            } else {
                await releaseMonth(id, yearMonth);
            }
            await fetchClassDetails();
        } catch (err: any) {
            console.error("Failed to update month status", err);
            alert(err.response?.data?.message || "Failed to update month status");
        }
    };

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

    useEffect(() => {
        fetchClassDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) { // Removed !classData from this condition as it's handled below
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

    if (!classData) return null; // Handle case where classData is null after loading

    const isOwner = user?.username === classData.teacher.username;

    return (
        <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors group font-medium"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-teal-50 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    Back to Classes
                </button>

                {isOwner && (
                    <div className="flex items-center gap-3">
                        {/* Status Dropdown */}
                        <div className="relative">
                            <select
                                value={classData.status}
                                onChange={handleStatusChange}
                                disabled={actionLoading}
                                className={`appearance-none cursor-pointer pl-4 pr-10 py-2.5 rounded-xl font-bold text-sm shadow-sm border border-transparent focus:ring-2 focus:ring-teal-500 outline-none transition-all ${classData.status === ClassStatus.ACTIVE ? "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100" :
                                    classData.status === ClassStatus.INACTIVE ? "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100" :
                                        classData.status === ClassStatus.ARCHIVED ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200" :
                                            "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <option value={ClassStatus.DRAFT}>Draft</option>
                                <option value={ClassStatus.ACTIVE}>Active</option>
                                <option value={ClassStatus.INACTIVE}>Inactive</option>
                                <option value={ClassStatus.ARCHIVED}>Archived</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-70">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Class"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Header Card */}
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${classData.status === ClassStatus.ACTIVE ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {classData.status}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
                                    <Star fill="currentColor" size={14} />
                                    <span className="font-bold text-sm">{classData.averageRating.toFixed(1)}</span>
                                    <span className="text-yellow-600/60 text-xs">({classData.totalReviews})</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                {classData.className}
                            </h1>
                            {isOwner && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mt-2 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                                    title="Edit Class Details"
                                >
                                    <Edit size={24} />
                                </button>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-2xl">
                            {classData.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                                <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                                    <Clock size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</p>
                                    <p className="font-bold text-gray-900 text-lg">{classData.durationMonths} Months</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                                <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                                    <Calendar size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
                                    <p className="font-bold text-gray-900 text-lg">{classData.startMonth}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                                <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                                    <DollarSign size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Price</p>
                                    <p className="font-bold text-gray-900 text-lg">${classData.monthlyPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Syllabus */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                Syllabus
                                <span className="text-gray-300 text-lg font-normal">/ Timeline</span>
                            </h2>
                            {isOwner && (
                                <button
                                    onClick={() => setIsExtendModalOpen(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <Plus size={18} />
                                    <span>Extend Course</span>
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {classData.months.map((month, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/dashboard/classes/${id}/months/${month.yearMonth}`)}
                                    className="bg-white border border-gray-200 rounded-[24px] p-5 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-900/5 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-100 group-hover:bg-teal-500 transition-colors"></div>
                                    <div className="flex justify-between items-center pl-4">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-lg text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-teal-700 transition-colors">{month.displayName}</h4>
                                                <p className="text-sm text-gray-500 font-medium">Year-Month: <span className="font-mono text-gray-600">{month.yearMonth}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${month.released ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {month.released ? 'Published' : 'Locked'}
                                            </span>
                                            {isOwner && (
                                                <button
                                                    onClick={(e) => handleToggleMonthStatus(month.yearMonth, month.released, e)}
                                                    className={`p-3 rounded-xl transition-all ${month.released
                                                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                                        }`}
                                                    title={month.released ? "Unrelease Month" : "Release Month"}
                                                >
                                                    {month.released ? <Unlock size={18} /> : <Lock size={18} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Instructor Card */}
                    <div className="bg-gray-50 rounded-[30px] p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
                                <User size={32} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Instructor</p>
                                <h3 className="text-xl font-black text-gray-900">{classData.teacher.username}</h3>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Qualification</p>
                                <p className="text-gray-900 font-semibold">{classData.teacher.qualification || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                                <p className="text-gray-900 font-semibold">{classData.teacher.yearsOfExperience} years</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Expertise</p>
                                <p className="text-gray-900 font-semibold">{classData.teacher.subjectExpertise}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">About</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{classData.teacher.bio}</p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <ClassFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchClassDetails}
                initialData={classData ? {
                    className: classData.className,
                    description: classData.description,
                    monthlyPrice: classData.monthlyPrice,
                    startMonth: classData.startMonth,
                    durationMonths: classData.durationMonths
                } : undefined}
                classId={classData?.id}
            />
            {/* Extend Modal */}
            {
                isExtendModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-teal-500"></div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Extend Class</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">Add more months to the course content duration.</p>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                    Additional Months
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setExtendMonths(Math.max(1, extendMonths - 1))}
                                        className="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center font-black text-2xl text-teal-600">
                                        {extendMonths}
                                    </div>
                                    <button
                                        onClick={() => setExtendMonths(extendMonths + 1)}
                                        className="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsExtendModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExtendDuration}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 flex items-center justify-center transition-colors shadow-lg shadow-teal-200"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Extend"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md">
                        <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                            <div className="text-red-500 mb-4">
                                <Trash2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Class?</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                This action is permanent and cannot be undone. All data associated with this class will be lost.
                            </p>

                            <div className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <p className="text-sm text-red-800 mb-2 font-medium">
                                    Type <span className="font-black select-all">{classData?.className}</span> to confirm.
                                </p>
                                <input
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="Type class name"
                                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-medium placeholder-red-200"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setDeleteConfirmation("");
                                    }}
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteClass}
                                    disabled={actionLoading || deleteConfirmation !== classData?.className}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-colors"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Delete Forever"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ClassDetails;
