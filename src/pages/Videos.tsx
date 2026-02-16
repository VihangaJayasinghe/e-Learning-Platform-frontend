import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getVideosByUser } from "../services/api";
import { Loader2, Play, Video as VideoIcon, Plus, Upload, Check, Search, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddToClassModal from "../components/modals/AddToClassModal";
import VideoFormModal from "../components/modals/VideoFormModal";

interface VideoData {
    id: string;
    videoName: string;
    description: string;
    firebaseUrl: string;
    contentType: string;
    thumbnail?: string;
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
    const [searchTerm, setSearchTerm] = useState("");

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
            setLoading(true);
            const data = await getVideosByUser(user.username);
            setVideos(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    const filteredVideos = videos.filter(video =>
        video.videoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-teal-600 bg-white">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500 bg-red-50 rounded-2xl m-6 border border-red-100">
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8 font-sans bg-white min-h-screen text-gray-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-teal-900 tracking-tight flex items-center gap-4 mb-2">
                        <div className="p-3 bg-teal-100 rounded-2xl text-teal-600 shadow-sm">
                            <Film size={32} strokeWidth={2.5} />
                        </div>
                        Video Library
                    </h1>
                    <p className="text-gray-500 font-medium ml-16">Manage and organize your course videos.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {selectedVideoIds.length === 0 ? (
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Upload size={20} strokeWidth={2.5} />
                            <span>Upload Video</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 bg-teal-50 p-2 pr-2 pl-4 rounded-xl border border-teal-100 animate-fadeIn">
                            <span className="text-sm font-bold text-teal-800 whitespace-nowrap">
                                {selectedVideoIds.length} selected
                            </span>
                            <div className="h-6 w-px bg-teal-200 mx-1"></div>
                            <button
                                onClick={handleClearSelection}
                                className="px-3 py-1.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsAddToClassModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                            >
                                <Plus size={18} strokeWidth={2.5} /> Add to Class
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search videos..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 sm:text-sm shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Area */}
            {videos.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group hover:border-teal-200 transition-colors">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                        <VideoIcon className="h-10 w-10 text-gray-300 group-hover:text-teal-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No videos uploaded yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upload your first video to start building your course library.</p>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-900/10"
                    >
                        Upload Video
                    </button>
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 font-medium">No videos match your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredVideos.map((video) => (
                        <div
                            key={video.id}
                            className={`group bg-white rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden ${selectedVideoIds.includes(video.id)
                                ? 'border-teal-500 ring-2 ring-teal-500 ring-offset-2 shadow-xl shadow-teal-900/10'
                                : 'border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:border-teal-100'
                                }`}
                            onClick={() => {
                                if (selectedVideoIds.length > 0) {
                                    toggleVideoSelection(video.id);
                                } else {
                                    navigate(`/video/${video.id}`);
                                }
                            }}
                        >
                            {/* Selection Checkbox */}
                            <div
                                className="absolute top-4 left-4 z-20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleVideoSelection(video.id);
                                }}
                            >
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${selectedVideoIds.includes(video.id)
                                    ? 'bg-teal-500 border-teal-500 shadow-md transform scale-100'
                                    : 'bg-white/90 border-gray-200 backdrop-blur-md hover:border-teal-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                                    }`}>
                                    {selectedVideoIds.includes(video.id) && <Check size={16} className="text-white" strokeWidth={3} />}
                                </div>
                            </div>


                            {/* Thumbnail */}
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                {/* Gradient Background / Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80" />

                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                        <Play className="text-white ml-1" size={24} fill="white" />
                                    </div>
                                </div>

                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md uppercase tracking-wider border border-white/10">
                                    Video
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                                    {video.videoName}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                                    {video.description || "No description provided."}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-wide text-[10px]">MP4</span>
                                    {/* Placeholder for duration or date if available in future */}
                                    <span>Ready</span>
                                </div>
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
