
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassMonthVideos, getClassById } from "../services/api";
import { Loader2, ArrowLeft, PlayCircle } from "lucide-react";

interface Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
}

const ClassMonth: React.FC = () => {
    const { id, yearMonth } = useParams<{ id: string; yearMonth: string }>();
    const navigate = useNavigate();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [className, setClassName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !yearMonth) return;
            try {
                setLoading(true);
                // Fetch class name for context (optional but good for UX)
                const classData = await getClassById(id);
                setClassName(classData.className);

                const videosData = await getClassMonthVideos(id, yearMonth);
                setVideos(videosData);
            } catch (err: any) {
                console.error("Failed to fetch month videos", err);
                setError("Failed to load videos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, yearMonth]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-red-600 text-lg font-medium">{error}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(`/dashboard/classes/${id}`)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {className} - {yearMonth}
                    </h1>
                    <p className="text-gray-500">Video Content</p>
                </div>
            </div>

            {videos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                        <PlayCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No videos yet</h3>
                    <p className="text-gray-500">Content for this month hasn't been uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="relative aspect-video bg-gray-900">
                                {video.thumbnailUrl ? (
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white/20">
                                        <PlayCircle size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
                                        <PlayCircle size={32} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                    {video.duration}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{video.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassMonth;
