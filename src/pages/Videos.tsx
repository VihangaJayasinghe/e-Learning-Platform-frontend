import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getVideosByUser } from "../services/api";
import { Loader2, Play, Video as VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <VideoIcon className="text-teal-600" /> My Videos
            </h1>

            {videos.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <VideoIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No videos yet</h3>
                    <p className="text-gray-500 mt-1">Videos you upload will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => navigate(`/video/${video.id}`)}
                            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                        >
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
        </div>
    );
};

export default Videos;
