import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { fetchClassesByInstructor, updateClassStatus } from "../../../services/api";
import { Loader2, AlertCircle } from "lucide-react";
import ClassFormModal from "../../../components/modals/CreateClassModal";
import { useNavigate } from "react-router-dom";

interface ClassItem {
    id: number;
    className: string;
    description: string;
    monthlyPrice: number;
    startMonth: string;
    durationMonths: number;
    status: string;
    thumbnailUrl?: string;
}

const TeacherClasses: React.FC = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassItem | undefined>(undefined);

    if (!context) return null;
    const { user } = context;

    const loadClasses = async () => {
        if (user?.username) {
            try {
                // Keep loading state only for initial load if classes are empty
                if (classes.length === 0) setLoading(true);
                const data = await fetchClassesByInstructor(user.username);
                setClasses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch classes", err);
                setError("Failed to load classes. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStatusChange = async (classId: number, newStatus: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation(); // Prevent card click
        try {
            // Optimistic update
            setClasses(classes.map(cls => cls.id === classId ? { ...cls, status: newStatus } : cls));
            await updateClassStatus(classId.toString(), newStatus);
            // Optional: Show success toast
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure
            loadClasses();
            alert("Failed to update status");
        }
    };

    useEffect(() => {
        loadClasses();
    }, [user?.username]);

    const handleCreateClick = () => {
        setSelectedClass(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (cls: ClassItem) => {
        setSelectedClass(cls);
        setIsModalOpen(true);
    };

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
        <div className="bg-white min-h-screen p-8 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-teal-900 tracking-tight mb-2">My Classes</h1>
                    <p className="text-gray-500 font-medium">Manage your courses, track student progress, and update content.</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-teal-500/20 hover:shadow-2xl hover:shadow-teal-500/30 flex items-center gap-2 active:scale-95"
                >
                    <span className="text-xl leading-none mb-1">+</span> Create New Class
                </button>
            </header>

            {classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No classes created yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm text-center">Start your teaching journey by creating your first class today.</p>
                    <button
                        onClick={handleCreateClick}
                        className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all"
                    >
                        Create your first class
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {classes.map((cls) => (
                        <div key={cls.id} className="group bg-white rounded-[24px] border border-gray-200 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 flex flex-col overflow-hidden relative">
                            {/* Decorative Header */}
                            <div className="h-32 bg-gray-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-50 rounded-full blur-2xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

                                <div className="absolute top-6 right-6 z-10" onClick={(e) => e.stopPropagation()}>
                                    <select
                                        value={cls.status || 'DRAFT'}
                                        onChange={(e) => handleStatusChange(cls.id, e.target.value, e)}
                                        className={`appearance-none px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest border-none focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer shadow-sm transition-all ${cls.status === 'ACTIVE' ? "bg-teal-500 text-white" :
                                            cls.status === 'INACTIVE' ? "bg-yellow-400 text-yellow-900" :
                                                cls.status === 'ARCHIVED' ? "bg-gray-800 text-gray-200" :
                                                    "bg-white text-gray-500"
                                            }`}
                                    >

                                        <option value="DRAFT" hidden>Draft</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-8 -mt-12 relative z-10 flex flex-col flex-1">


                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Class ID: {cls.id}</span>

                                <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
                                    {cls.className}
                                </h3>

                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                                    {cls.description || "No description provided."}
                                </p>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Monthly</p>
                                            <p className="text-lg font-black text-gray-900">${cls.monthlyPrice}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 uppercase">Start</p>
                                            <p className="text-base font-bold text-gray-900">{cls.startMonth}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleEditClick(cls)}
                                            className="w-full py-3.5 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:border-teal-500 hover:text-teal-600 transition-all active:scale-95"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/classes/${cls.id}`)}
                                            className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ClassFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadClasses}
                initialData={selectedClass ? {
                    className: selectedClass.className,
                    description: selectedClass.description,
                    monthlyPrice: selectedClass.monthlyPrice,
                    startMonth: selectedClass.startMonth,
                    durationMonths: selectedClass.durationMonths
                } : undefined}
                classId={selectedClass ? selectedClass.id.toString() : undefined}
            />
        </div>
    );
};

export default TeacherClasses;
