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

    const confirmDeleteVideo = async (deleteFromStorage: boolean) => {
        if (!classId || !yearMonth || !videoToDelete) return;

        try {
            setActionLoading(true);
            // 1. Remove from month (always)
            await removeVideoFromMonth(classId, yearMonth, videoToDelete);

            // 2. Delete from storage (if requested)
            if (deleteFromStorage) {
                await deleteVideo(videoToDelete);
            }

            fetchData(); // Refresh data
            setIsDeleteVideoModalOpen(false);
            setVideoToDelete(null);
        } catch (err: any) {
            console.error("Failed to delete video", err);
            alert("Failed to delete video.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = (videoId: string) => {
        setVideoToDelete(videoId);
        setIsDeleteVideoModalOpen(true);
    };

    const confirmDeleteDocument = async (deleteFromStorage: boolean) => {
        if (!classId || !yearMonth || !documentToDelete) return;

        try {
            setActionLoading(true);
            // 1. Remove from month
            await removeDocumentFromMonth(classId, yearMonth, documentToDelete);

            // 2. Delete from storage (if requested)
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

    const handleDeleteDocumentClick = (documentId: string) => {
        setDocumentToDelete(documentId);
        setIsDeleteDocumentModalOpen(true);
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

    const handleDeleteQuizClick = (quizId: string) => {
        setQuizToDelete(quizId);
        setIsDeleteQuizModalOpen(true);
    };

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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/dashboard/classes/${classId}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={20} /> Back to Class
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Content for <span className="text-teal-600">{yearMonth}</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Access all materials released for this month.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Videos Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                    <Video size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Videos</h2>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                                    {videos.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsAddVideoModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>

                        {videos.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No videos available.</p>
                        ) : (
                            <div className="space-y-4">
                                {videos.map((video) => (
                                    <div key={video.id} className="group border border-gray-100 rounded-xl p-4 hover:border-red-200 hover:shadow-sm transition-all relative">
                                        <div className="flex justify-between items-start mb-2 pr-8">
                                            <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                                                {video.videoName}
                                            </h3>
                                            <PlayCircle size={20} className="text-gray-300 group-hover:text-red-500" />
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{video.description}</p>
                                        <button
                                            onClick={() => {
                                                console.log("Navigating to video:", video.id);
                                                navigate(`/video/${video.id}`);
                                            }}
                                            className="text-xs font-bold text-red-600 hover:underline"
                                        >
                                            Watch Video
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(video.id)}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition-colors"
                                            title="Remove Video"
                                            disabled={actionLoading}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Documents Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                                    {documents.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsAddDocumentModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>

                        {documents.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No documents available.</p>
                        ) : (
                            <div className="space-y-4">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all relative">
                                        <div className="flex-1 pr-12">
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {doc.documentName}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">{doc.description}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={`https://docs.google.com/viewer?url=${encodeURIComponent(doc.cloudinaryUrl)}&embedded=false`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors text-sm font-medium"
                                                title="View Document"
                                            >
                                                <Eye size={16} />
                                                View
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteDocumentClick(doc.id)}
                                            className="absolute top-4 right-12 mr-2 text-gray-300 hover:text-red-600 transition-colors"
                                            title="Remove Document"
                                            disabled={actionLoading}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quizzes Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                    <HelpCircle size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Quizzes</h2>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                                    {quizzes.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsAddQuizModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-bold"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>

                        {quizzes.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No quizzes available.</p>
                        ) : (
                            <div className="space-y-4">
                                {quizzes.map((quiz) => (
                                    <div key={quiz.id} className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all relative">
                                        <div className="flex-1 pr-12">
                                            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                                                {quiz.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">{quiz.description}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="text-xs font-bold text-purple-600 hover:underline"
                                                onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuizClick(quiz.id)}
                                                className="text-gray-300 hover:text-red-600 transition-colors"
                                                title="Remove Quiz"
                                                disabled={actionLoading}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

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
