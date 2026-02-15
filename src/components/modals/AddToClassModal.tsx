import React, { useState, useEffect, useContext } from "react";
import { Loader2, X, Check, AlertCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { fetchClassesByInstructor, getClassById, addVideoToMonth } from "../../services/api";

interface AddToClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedVideoIds: string[];
    onSuccess: () => void;
}

interface ClassSummary {
    id: string;
    className: string;
}

interface MonthData {
    yearMonth: string;
    displayName: string;
}

const AddToClassModal: React.FC<AddToClassModalProps> = ({
    isOpen,
    onClose,
    selectedVideoIds,
    onSuccess,
}) => {
    const context = useContext(AuthContext);
    const user = context?.user;
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [months, setMonths] = useState<MonthData[]>([]);

    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedYearMonth, setSelectedYearMonth] = useState("");

    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingMonths, setLoadingMonths] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Load classes when modal opens
    useEffect(() => {
        if (isOpen && user?.username) {
            loadClasses();
        }
    }, [isOpen, user?.username]);

    // Load months when class is selected
    useEffect(() => {
        if (selectedClassId) {
            loadClassDetails(selectedClassId);
        } else {
            setMonths([]);
            setSelectedYearMonth("");
        }
    }, [selectedClassId]);

    const loadClasses = async () => {
        if (!user?.username) return;
        try {
            setLoadingClasses(true);
            setError("");
            const data = await fetchClassesByInstructor(user.username);
            // Ensure we map correctly regardless of API return type (id could be number or string)
            const mappedClasses = (Array.isArray(data) ? data : []).map((cls: any) => ({
                id: String(cls.id),
                className: cls.className
            }));
            setClasses(mappedClasses);
        } catch (err) {
            console.error("Failed to load classes", err);
            setError("Failed to load your classes.");
        } finally {
            setLoadingClasses(false);
        }
    };

    const loadClassDetails = async (classId: string) => {
        try {
            setLoadingMonths(true);
            // setError(""); // Don't clear error here to avoid flickering if class load failed
            const data = await getClassById(classId);
            if (data && Array.isArray(data.months)) {
                setMonths(data.months);
            } else {
                setMonths([]);
            }
        } catch (err) {
            console.error("Failed to load class details", err);
            setError("Failed to load months for the selected class.");
        } finally {
            setLoadingMonths(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassId || !selectedYearMonth || selectedVideoIds.length === 0) {
            setError("Please select a class, a month, and at least one video.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            // Process all videos concurrently
            await Promise.all(
                selectedVideoIds.map(videoId =>
                    addVideoToMonth(selectedClassId, selectedYearMonth, videoId)
                )
            );

            onSuccess();
            onClose();
            // Reset selection
            setSelectedClassId("");
            setSelectedYearMonth("");
        } catch (err: any) {
            console.error("Failed to add videos", err);
            setError(err.response?.data?.message || "Failed to add videos to the class.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Add to Class</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2 items-start">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="bg-teal-50 p-4 rounded-lg text-teal-800 text-sm flex items-center gap-2">
                        <Check size={18} />
                        You are adding <strong>{selectedVideoIds.length}</strong> video{selectedVideoIds.length !== 1 ? 's' : ''}.
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Select Class
                        </label>
                        {loadingClasses ? (
                            <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
                        ) : (
                            <div className="relative">
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white"
                                    required
                                >
                                    <option value="">-- Choose a Class --</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.className}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Select Month
                        </label>
                        {loadingMonths ? (
                            <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
                        ) : (
                            <select
                                value={selectedYearMonth}
                                onChange={(e) => setSelectedYearMonth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                required
                                disabled={!selectedClassId || months.length === 0}
                            >
                                <option value="">
                                    {!selectedClassId
                                        ? "-- Select Class First --"
                                        : months.length === 0
                                            ? "No months found"
                                            : "-- Choose a Month --"
                                    }
                                </option>
                                {months.map(month => (
                                    <option key={month.yearMonth} value={month.yearMonth}>
                                        {month.displayName} ({month.yearMonth})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedClassId || !selectedYearMonth}
                            className="flex-1 px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : "Add Videos"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToClassModal;
