import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getMonthVideos,
    getMonthDocuments,
    getQuizzesByClassAndMonth,
    getVideoById,
    getDocumentById
} from "../../../services/api";
import {
    ArrowLeft,
    Video,
    FileText,
    HelpCircle,
    Loader2,
    PlayCircle,
    Eye
} from "lucide-react";

interface VideoData {
    id: string;
    videoName: string;
    description: string;
    firebaseUrl: string;
    contentType: string;
}

interface DocumentData {
    id: string;
    documentName: string;
    description: string;
    cloudinaryUrl: string;
    contentType: string;
}

interface QuizData {
    id: string;
    title: string;
    description: string;
}

const StudentMonthDetails: React.FC = () => {
    // Note: The route param is 'id' from App.tsx (browse/:id/months/:yearMonth), but api expects classId. 
    // We should map id -> classId usage.
    const { id: classId, yearMonth } = useParams<{ id: string; yearMonth: string }>();
    const navigate = useNavigate();

    const [videos, setVideos] = useState<VideoData[]>([]);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [quizzes, setQuizzes] = useState<QuizData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'videos' | 'documents' | 'quizzes'>('videos');

    useEffect(() => {
        fetchData();
    }, [classId, yearMonth]);

    const fetchData = async () => {
        if (!classId || !yearMonth) return;

        try {
            setLoading(true);

            // 1. Fetch Lists of IDs and Quizzes
            const [videoIds, documentIds, quizzesData] = await Promise.all([
                getMonthVideos(classId, yearMonth),
                getMonthDocuments(classId, yearMonth),
                getQuizzesByClassAndMonth(classId, yearMonth)
            ]);

            // 2. Fetch Details for Videos
            const videoPromises = videoIds.map((id: string) => getVideoById(id));
            const videoDetails = await Promise.all(videoPromises);
            setVideos(videoDetails);

            // 3. Fetch Details for Documents
            const documentPromises = documentIds.map((id: string) => getDocumentById(id));
            const documentDetails = await Promise.all(documentPromises);
            setDocuments(documentDetails);

            setQuizzes(quizzesData);

        } catch (err: any) {
            console.error("Failed to fetch month details", err);
            setError("Failed to load month content.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px] text-purple-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
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
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(`/dashboard/browse/${classId}`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
                >
                    <ArrowLeft size={20} /> Back to Class
                </button>
                <h1 className="text-3xl font-black text-gray-900">
                    Content for <span className="text-purple-600">{yearMonth}</span>
                </h1>
                <p className="text-gray-500 mt-2">Access your learning materials for this month.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('videos')}
                    className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'videos'
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                >
                    <Video size={18} /> Videos <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{videos.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'documents'
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                >
                    <FileText size={18} /> Documents <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{documents.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('quizzes')}
                    className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'quizzes'
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                >
                    <HelpCircle size={18} /> Quizzes <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{quizzes.length}</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <div key={video.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                                <div className="aspect-video bg-gray-100 relative items-center justify-center flex">
                                    <PlayCircle size={48} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{video.videoName}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{video.description}</p>
                                    <a
                                        href={video.firebaseUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm hover:underline"
                                    >
                                        <PlayCircle size={16} /> Watch Now
                                    </a>
                                </div>
                            </div>
                        ))}
                        {videos.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                No videos available for this month.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-blue-50 transition-all flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{doc.documentName}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{doc.description}</p>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={`https://docs.google.com/viewer?url=${encodeURIComponent(doc.cloudinaryUrl)}&embedded=false`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                        >
                                            <Eye size={16} /> View
                                        </a>
                                        {/* Optional Download button if needed */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {documents.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                No documents available for this month.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'quizzes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-purple-50 transition-all flex items-start gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <HelpCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{quiz.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{quiz.description}</p>
                                    <button
                                        onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-purple-200"
                                    >
                                        Attempt Quiz
                                    </button>
                                </div>
                            </div>
                        ))}
                        {quizzes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                No quizzes available for this month.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMonthDetails;
