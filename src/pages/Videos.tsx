import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getVideosByUser } from "../services/api";
import { Loader2, Play, Video as VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddToClassModal from "../components/modals/AddToClassModal";
import VideoFormModal from "../components/modals/VideoFormModal";
import { Check, Plus, Upload } from "lucide-react";

interface VideoData {
    id: string;
    videoName: string;
    description: string;
    firebaseUrl: string;
    contentType: string;
    thumbnail?: string; // Assuming maybe in future?
}

const Videos: React.FC = () => {
    const context = useContext(AuthContext);
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Selection state
    const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
    const [isAddToClassModalOpen, setIsAddToClassModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Derived state from context
    const user = context?.user;

    useEffect(() => {
        const fetchVideos = async () => {
            if (!user?.username) return;
            try {
                setLoading(true);
                const data = await getVideosByUser(user.username);
                setVideos(data);
            } catch (err) {
                console.error("Failed to fetch videos", err);
                setError("Failed to load videos.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [user?.username]);

    const refreshVideos = async () => {
        if (!user?.username) return;
        try {
            setLoading(true); // Optional: show skeleton/loading
            const data = await getVideosByUser(user.username);
            setVideos(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    const toggleVideoSelection = (videoId: string) => {
        setSelectedVideoIds(prev =>
            prev.includes(videoId)
                ? prev.filter(id => id !== videoId)
                : [...prev, videoId]
        );
    };

    const handleClearSelection = () => {
        setSelectedVideoIds([]);
    };

    if (error) {
        return (
            <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <VideoIcon className="text-teal-600" /> My Videos
                </h1>

                <div className="flex items-center gap-3">
                    {selectedVideoIds.length === 0 && (
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Upload size={18} /> Upload Video
                        </button>
                    )}

                    {selectedVideoIds.length > 0 && (
                        <div className="flex items-center gap-3 animate-fadeIn">
                            <span className="text-sm font-semibold text-gray-500">
                                {selectedVideoIds.length} selected
                            </span>
                            <button
                                onClick={handleClearSelection}
                                className="px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsAddToClassModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                            >
                                <Plus size={18} /> Add to Class
                            </button>
                            <button
                                onClick={() => setIsAddToClassModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                            >
                                <Plus size={18} /> Add to Class
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {videos.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <VideoIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No videos yet</h3>
                    <h3 className="text-lg font-medium text-gray-900">No videos yet</h3>
                    <p className="text-gray-500 mt-1 mb-4">Videos you upload will appear here.</p>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        Upload your first video
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className={`group bg-white rounded-xl shadow-sm border transition-all cursor-pointer flex flex-col h-full relative ${selectedVideoIds.includes(video.id)
                                ? 'border-teal-500 ring-2 ring-teal-500 ring-offset-2'
                                : 'border-gray-100 hover:shadow-md'
                                }`}
                            onClick={() => {
                                if (selectedVideoIds.length > 0) {
                                    toggleVideoSelection(video.id);
                                } else {
                                    navigate(`/video/${video.id}`);
                                }
                            }}
                        >
                            {/* Checkbox Overlay */}
                            <div
                                className="absolute top-3 left-3 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleVideoSelection(video.id);
                                }}
                            >
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedVideoIds.includes(video.id)
                                    ? 'bg-teal-500 border-teal-500'
                                    : 'bg-white/80 border-gray-300 backdrop-blur-sm hover:border-teal-500'
                                    }`}>
                                    {selectedVideoIds.includes(video.id) && <Check size={14} className="text-white" />}
                                </div>
                            </div>


                            {/* Thumbnail Placeholder */}
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <Play className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-lg" size={48} fill="white" />
                                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
                                    Video
                                </span>
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                                    {video.videoName}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddToClassModal
                isOpen={isAddToClassModalOpen}
                onClose={() => setIsAddToClassModalOpen(false)}
                selectedVideoIds={selectedVideoIds}
                onSuccess={() => {
                    handleClearSelection();
                }}
            />

            <VideoFormModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={refreshVideos}
            />
        </div>
    );
};

export default Videos;
