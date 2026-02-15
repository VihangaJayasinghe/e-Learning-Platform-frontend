import React, { useState } from "react";
import { Loader2, X, Upload } from "lucide-react";
import { uploadVideo, addVideoToMonth } from "../../services/api";

interface VideoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classId: string;
    yearMonth: string;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    classId,
    yearMonth,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name || !description) {
            setError("Please fill in all fields and select a file.");
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

            // 2. Add video to the month
            await addVideoToMonth(classId, yearMonth, video.id);

            onSuccess();
            onClose();
            // Reset form
            setName("");
            setDescription("");
            setFile(null);
            setUploadProgress(0);
        } catch (err: any) {
            console.error("Failed to add video", err);
            setError(err.response?.data?.message || "Failed to add video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
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
