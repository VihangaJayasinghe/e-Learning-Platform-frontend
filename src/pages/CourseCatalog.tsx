import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Trash2, Loader2, FileVideo, Video } from "lucide-react";
import { adminApi } from "../services/api";

interface VideoData {
    id: string;
    videoName: string;
    description: string;
    firebaseUrl: string;
    fileName: string;
    fileSize: number;
    contentType: string;
    uploadDate: string;
    uploadedBy: string;
}

const CourseCatalog: React.FC = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchUploader, setSearchUploader] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // Fetch all videos
    const fetchVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.get("/videos");
            setVideos(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching videos:", err);
            setError("Failed to fetch videos. Please try again.");
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    // Search videos by uploader
    const searchByUploader = async (username: string) => {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            fetchVideos(); // Reset if empty
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Try server-side search first
            const response = await adminApi.get(`/uploadedBy/${encodeURIComponent(trimmedUsername)}`);
            setVideos(Array.isArray(response.data) ? response.data : []);
        } catch (err: any) {
            console.warn("Server-side search failed, falling back to client-side filtering:", err);

            // Fallback: Fetch all videos and filter client-side
            try {
                const response = await adminApi.get("/videos");
                if (Array.isArray(response.data)) {
                    const allVideos = response.data as VideoData[];
                    const filteredVideos = allVideos.filter(v =>
                        v.uploadedBy && v.uploadedBy.toLowerCase() === trimmedUsername.toLowerCase()
                    );
                    setVideos(filteredVideos);

                    if (filteredVideos.length === 0) {
                        // If still no videos found after fallback
                        if (err.response && err.response.status === 404) {
                            // The original 404 might have been correct (no user), or endpoint missing.
                            // But since we filtered all videos and found nothing, result is empty.
                            setError(null);
                        } else {
                            // Keep original error if it wasn't a 404? 
                            // Getting "No static resource" usually means 404. 
                            // If we successfully fetched /videos but found no matches, that's not an error.
                            setError(null);
                        }
                    }
                } else {
                    throw new Error("Failed to fetch video list for fallback");
                }
            } catch (fallbackErr) {
                console.error("Fallback search also failed:", fallbackErr);
                setError("Failed to search videos. Server returned error.");
                setVideos([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete video
    const handleDelete = async (id: string, videoName: string) => {
        if (!window.confirm(`Are you sure you want to delete video "${videoName}"?`)) {
            return;
        }

        const secretKey = window.prompt("Please enter the secret key to confirm deletion:");
        if (!secretKey) {
            return;
        }

        try {
            // Note: The URL pattern provided was /videos/{id}/{key}
            // However, typical REST might use headers or body. Following the prompt's URL pattern.
            await adminApi.delete(`/videos/${id}/${secretKey}`);

            // Remove from state
            setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
            alert(`Video "${videoName}" deleted successfully.`);
        } catch (err) {
            console.error("Error deleting video:", err);
            alert("Failed to delete video. Invalid secret key or server error.");
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchByUploader(searchUploader);
    };

    // Helper to format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="p-6">
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

            <header className="mb-10">
                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">
                    <span className="w-8 h-[2px] bg-emerald-600"></span>
                    Course Management
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                    Video Catalog
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Manage uploaded learning materials and videos.
                </p>
            </header>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md flex gap-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by uploader username..."
                            value={searchUploader}
                            onChange={(e) => setSearchUploader(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                        Search
                    </button>
                    {searchUploader && (
                        <button
                            type="button"
                            onClick={() => { setSearchUploader(""); fetchVideos(); }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            Reset
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4">Video Info</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">File Specs</th>
                                <th className="p-4">Uploaded By</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={32} />
                                        <span>Loading videos...</span>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-red-500">
                                        <Video className="mx-auto mb-2" size={32} />
                                        <span>{error}</span>
                                    </td>
                                </tr>
                            ) : videos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        <BookOpen className="mx-auto mb-2 text-gray-300" size={32} />
                                        <span>No videos found.</span>
                                    </td>
                                </tr>
                            ) : (
                                videos.map((video) => (
                                    <tr key={video.id} className="hover:bg-emerald-50/30 transition-colors text-sm text-gray-700">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                                                    <FileVideo size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{video.videoName}</div>
                                                    <div className="text-xs text-gray-400 font-mono truncate max-w-[150px]">{video.fileName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs truncate" title={video.description}>
                                            {video.description}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="text-xs text-gray-500">{formatFileSize(video.fileSize)}</div>
                                            <div className="text-[10px] text-gray-400 uppercase">{video.contentType.split('/')[1] || video.contentType}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold">
                                                {video.uploadedBy}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {new Date(video.uploadDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(video.id, video.videoName)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Video"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseCatalog;
