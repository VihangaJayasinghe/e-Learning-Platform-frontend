import React, { useState } from "react";
import { Loader2, X, HelpCircle } from "lucide-react";
import { createQuiz } from "../../services/api";

interface QuizFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classId: string;
    yearMonth: string;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    classId,
    yearMonth
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const quizData = {
                quizTitle: title,
                description,
                classId,
                monthId: yearMonth, // Backend uses 'monthId'
                questions: [] // Initialize with empty questions
            };

            await createQuiz(quizData);
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error("Failed to create quiz", err);
            setError(err.response?.data?.message || "Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                            <HelpCircle size={24} />
                        </span>
                        Create New Quiz
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Quiz Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all outline-none font-medium"
                            placeholder="e.g. Week 1 Assessment"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all outline-none font-medium resize-none h-24"
                            placeholder="Briefly describe what this quiz checks..."
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim() || !description.trim()}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Quiz"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizFormModal;
