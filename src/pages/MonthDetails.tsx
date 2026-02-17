import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getMonthVideos,
    getMonthDocuments,
    getQuizzesByClassAndMonth,
    getVideoById,
    getDocumentById,
    removeVideoFromMonth,
    deleteVideo,
    removeDocumentFromMonth,
    deleteDocument,
    deleteQuiz
} from "../services/api";
import {
    ArrowLeft,
    Video,
    FileText,
    HelpCircle,
    Loader2,
    PlayCircle,
    Plus,
    Trash2,
    Eye
} from "lucide-react";
import VideoFormModal from "../components/modals/VideoFormModal";
import DeleteVideoModal from "../components/modals/DeleteVideoModal";
import DocumentFormModal from "../components/modals/DocumentFormModal";
import DeleteDocumentModal from "../components/modals/DeleteDocumentModal";
import QuizFormModal from "../components/modals/QuizFormModal";
import DeleteQuizModal from "../components/modals/DeleteQuizModal";

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

const MonthDetails: React.FC = () => {
    const { classId, yearMonth } = useParams<{ classId: string; yearMonth: string }>();
    const navigate = useNavigate();

    const [videos, setVideos] = useState<VideoData[]>([]);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [quizzes, setQuizzes] = useState<QuizData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal States
    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
    const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

    const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
    const [isDeleteDocumentModalOpen, setIsDeleteDocumentModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

    const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
    const [isDeleteQuizModalOpen, setIsDeleteQuizModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

    const [actionLoading, setActionLoading] = useState(false);

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

    useEffect(() => {
        fetchData();
    }, [classId, yearMonth]);

    // -- DELETE HANDLERS --

    const confirmDeleteVideo = async (deleteFromStorage: boolean) => {
        if (!classId || !yearMonth || !videoToDelete) return;

        try {
            setActionLoading(true);
            await removeVideoFromMonth(classId, yearMonth, videoToDelete);
            if (deleteFromStorage) {
                await deleteVideo(videoToDelete);
            }
            fetchData();
            setIsDeleteVideoModalOpen(false);
            setVideoToDelete(null);
        } catch (err: any) {
            console.error("Failed to delete video", err);
            alert("Failed to delete video.");
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDeleteDocument = async (deleteFromStorage: boolean) => {
        if (!classId || !yearMonth || !documentToDelete) return;

        try {
            setActionLoading(true);
            await removeDocumentFromMonth(classId, yearMonth, documentToDelete);
            if (deleteFromStorage) {
                await deleteDocument(documentToDelete);
            }
            fetchData();
            setIsDeleteDocumentModalOpen(false);
            setDocumentToDelete(null);
        } catch (err: any) {
            console.error("Failed to delete document", err);
            alert("Failed to delete document.");
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDeleteQuiz = async () => {
        if (!quizToDelete) return;

        try {
            setActionLoading(true);
            await deleteQuiz(quizToDelete);
            fetchData();
            setIsDeleteQuizModalOpen(false);
            setQuizToDelete(null);
        } catch (err: any) {
            console.error("Failed to delete quiz", err);
            alert("Failed to delete quiz.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-teal-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
                <div className="text-red-600 text-lg font-bold">{error}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-gray-900">
            {/* Back Button */}
            <button
                onClick={() => navigate(`/dashboard/classes/${classId}`)}
                className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold mb-8 transition-colors group"
            >
                <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span>Back to Class</span>
            </button>

            {/* Header - Full Gradient with White Text */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-[32px] shadow-xl shadow-teal-900/10 overflow-hidden mb-12 p-8 md:p-12 relative">
                {/* Decorative Background Patterns */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 text-white">
                        <FileText size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                            Month Content <span className="opacity-90">{yearMonth}</span>
                        </h1>
                        <p className="text-teal-50 text-lg max-w-2xl font-medium leading-relaxed">
                            Manage and organize all learning materials for this month. Students will see exactly what you publish here.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- VIDEOS SECTION --- */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                                <Video size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Videos</h2>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-black">
                                {videos.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAddVideoModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-sm font-bold shadow-lg shadow-teal-200 hover:-translate-y-0.5"
                        >
                            <Plus size={18} /> Add New
                        </button>
                    </div>

                    {videos.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                            <Video className="text-gray-200 mb-3" size={48} />
                            <p className="text-gray-400 font-bold">No videos yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {videos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => navigate(`/video/${video.id}`)}
                                    className="group flex items-start justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all relative cursor-pointer"
                                >
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-teal-600 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                            <PlayCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate pr-8">
                                                {video.videoName}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 font-medium bg-white/50 p-1 rounded-md">
                                                {video.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoToDelete(video.id);
                                            setIsDeleteVideoModalOpen(true);
                                        }}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg absolute top-3 right-3 z-10"
                                        title="Delete Video"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- DOCUMENTS SECTION --- */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Docs</h2>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-black">
                                {documents.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAddDocumentModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-sm font-bold shadow-lg shadow-teal-200 hover:-translate-y-0.5"
                        >
                            <Plus size={18} /> Add New
                        </button>
                    </div>

                    {documents.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                            <FileText className="text-gray-200 mb-3" size={48} />
                            <p className="text-gray-400 font-bold">No documents</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(doc.cloudinaryUrl)}&embedded=false`, '_blank')}
                                    className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all relative cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-teal-600 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate">
                                                {doc.documentName}
                                            </h3>
                                            <p className="text-xs text-teal-600 mt-1 font-bold flex items-center gap-1">
                                                <Eye size={12} /> Click to View
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDocumentToDelete(doc.id);
                                            setIsDeleteDocumentModalOpen(true);
                                        }}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg z-10"
                                        title="Delete Document"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- QUIZZES SECTION --- */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                                <HelpCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Quizzes</h2>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-black">
                                {quizzes.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAddQuizModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-sm font-bold shadow-lg shadow-teal-200 hover:-translate-y-0.5"
                        >
                            <Plus size={18} /> Add New
                        </button>
                    </div>

                    {quizzes.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                            <HelpCircle className="text-gray-200 mb-3" size={48} />
                            <p className="text-gray-400 font-bold">No quizzes</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                                    className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all relative cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-teal-600 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                            <HelpCircle size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate">
                                                {quiz.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                {quiz.description}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setQuizToDelete(quiz.id);
                                            setIsDeleteQuizModalOpen(true);
                                        }}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg z-10"
                                        title="Delete Quiz"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* MODALS */}
            <VideoFormModal
                isOpen={isAddVideoModalOpen}
                onClose={() => setIsAddVideoModalOpen(false)}
                onSuccess={fetchData}
                classId={classId!}
                yearMonth={yearMonth!}
            />

            <DeleteVideoModal
                isOpen={isDeleteVideoModalOpen}
                onClose={() => {
                    setIsDeleteVideoModalOpen(false);
                    setVideoToDelete(null);
                }}
                onConfirm={confirmDeleteVideo}
                loading={actionLoading}
            />

            <DocumentFormModal
                isOpen={isAddDocumentModalOpen}
                onClose={() => setIsAddDocumentModalOpen(false)}
                onSuccess={fetchData}
                classId={classId!}
                yearMonth={yearMonth!}
            />

            <DeleteDocumentModal
                isOpen={isDeleteDocumentModalOpen}
                onClose={() => {
                    setIsDeleteDocumentModalOpen(false);
                    setDocumentToDelete(null);
                }}
                onConfirm={confirmDeleteDocument}
                loading={actionLoading}
            />

            <QuizFormModal
                isOpen={isAddQuizModalOpen}
                onClose={() => setIsAddQuizModalOpen(false)}
                onSuccess={fetchData}
                classId={classId!}
                yearMonth={yearMonth!}
            />

            <DeleteQuizModal
                isOpen={isDeleteQuizModalOpen}
                onClose={() => {
                    setIsDeleteQuizModalOpen(false);
                    setQuizToDelete(null);
                }}
                onConfirm={confirmDeleteQuiz}
                loading={actionLoading}
            />
        </div>
    );
};

export default MonthDetails;
