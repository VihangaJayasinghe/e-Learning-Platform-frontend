import React, { useState, useEffect, useContext } from "react";
import { Loader2, X, Upload } from "lucide-react";
import { uploadVideo, addVideoToMonth, fetchClassesByInstructor, getClassById } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

interface VideoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classId?: string;
    yearMonth?: string;
}

interface ClassSummary {
    id: string;
    className: string;
}

interface MonthData {
    yearMonth: string;
    displayName: string;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    classId,
    yearMonth,
}) => {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");

    // Optional Class Linking State
    const [shouldAddToClass, setShouldAddToClass] = useState(false);
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [months, setMonths] = useState<MonthData[]>([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedYearMonth, setSelectedYearMonth] = useState("");
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingMonths, setLoadingMonths] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setName("");
            setDescription("");
            setFile(null);
            setUploadProgress(0);
            setError("");
            setShouldAddToClass(false);
            setSelectedClassId("");
            setSelectedYearMonth("");

            // If classId is not provided, load classes for potential selection
            if (!classId && user?.username) {
                loadClasses();
            }
        }
    }, [isOpen, classId, user?.username]);

    // Load months when selectedClassId changes (and we are in generic mode)
    useEffect(() => {
        if (!classId && selectedClassId) {
            loadClassDetails(selectedClassId);
        } else {
            setMonths([]);
            if (!classId) setSelectedYearMonth("");
        }
    }, [selectedClassId, classId]);

    const loadClasses = async () => {
        if (!user?.username) return;
        try {
            setLoadingClasses(true);
            const data = await fetchClassesByInstructor(user.username);
            const mappedClasses = (Array.isArray(data) ? data : []).map((cls: any) => ({
                id: String(cls.id),
                className: cls.className
            }));
            setClasses(mappedClasses);
        } catch (err) {
            console.error("Failed to load classes", err);
        } finally {
            setLoadingClasses(false);
        }
    };

    const loadClassDetails = async (cId: string) => {
        try {
            setLoadingMonths(true);
            const data = await getClassById(cId);
            if (data && Array.isArray(data.months)) {
                setMonths(data.months);
            }
        } catch (err) {
            console.error("Failed to load class details", err);
        } finally {
            setLoadingMonths(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name || !description) {
            setError("Please fill in all fields and select a file.");
            return;
        }

        // Validation for optional class adding
        if (!classId && shouldAddToClass && (!selectedClassId || !selectedYearMonth)) {
            setError("Please select a class and month, or uncheck 'Add to Class'.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // 1. Upload the video
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", name);
            formData.append("description", description);

            const video = await uploadVideo(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });

            // 2. Add video to the month (if applicable)
            // Use props if available, otherwise use selected state if enabled
            const targetClassId = classId || (shouldAddToClass ? selectedClassId : null);
            const targetYearMonth = yearMonth || (shouldAddToClass ? selectedYearMonth : null);

            if (targetClassId && targetYearMonth) {
                await addVideoToMonth(targetClassId, targetYearMonth, video.id);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Failed to add video", err);
            setError(err.response?.data?.message || "Failed to add video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Add New Video</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="w-full mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${uploadProgress === 100 ? 'bg-teal-500 animate-pulse' : 'bg-teal-600'}`}
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className={`text-sm mt-2 text-center font-semibold transition-colors ${uploadProgress === 100 ? 'text-teal-600 animate-pulse' : 'text-gray-700'}`}>
                                {uploadProgress < 100
                                    ? `${uploadProgress}% Uploaded`
                                    : "Processing video... This may take a moment."}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Video Title
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Introduction to Calculus"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe the video content..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Video File
                        </label>
                        <div className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-colors ${file ? 'bg-teal-50 border-teal-200' : 'hover:bg-gray-50'}`}>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer block">
                                <div className="flex flex-col items-center gap-2">
                                    <Upload size={32} className={file ? "text-teal-600" : "text-gray-400"} />
                                    {file ? (
                                        <p className="text-sm font-medium text-teal-700 truncate max-w-[250px]">
                                            {file.name}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-700">Click to upload video</p>
                                            <p className="text-xs text-gray-400 uppercase">MP4, WebM up to 100MB</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Optional Class Linking Section */}
                    {!classId && (
                        <div className="pt-2 border-t border-gray-100 mt-4">
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="addToClass"
                                    checked={shouldAddToClass}
                                    onChange={(e) => setShouldAddToClass(e.target.checked)}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <label htmlFor="addToClass" className="text-sm font-bold text-gray-700">
                                    Add to a Class (Optional)
                                </label>
                            </div>

                            {shouldAddToClass && (
                                <div className="space-y-4 animate-fadeIn pl-2 border-l-2 border-gray-100 ml-1">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class</label>
                                        {loadingClasses ? (
                                            <div className="h-10 bg-gray-100 rounded animate-pulse" />
                                        ) : (
                                            <select
                                                value={selectedClassId}
                                                onChange={(e) => setSelectedClassId(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                            >
                                                <option value="">Select Class</option>
                                                {classes.map(c => (
                                                    <option key={c.id} value={c.id}>{c.className}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Month</label>
                                        {loadingMonths ? (
                                            <div className="h-10 bg-gray-100 rounded animate-pulse" />
                                        ) : (
                                            <select
                                                value={selectedYearMonth}
                                                onChange={(e) => setSelectedYearMonth(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none disabled:bg-gray-50"
                                                disabled={!selectedClassId}
                                            >
                                                <option value="">Select Month</option>
                                                {months.map(m => (
                                                    <option key={m.yearMonth} value={m.yearMonth}>{m.displayName}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Upload Video"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VideoFormModal;
