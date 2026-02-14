import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Loader2, Edit2, CheckCircle } from "lucide-react";
import { getQuizById, addQuestionToQuiz, updateQuestionInQuiz, deleteQuestionFromQuiz } from "../services/api";

interface Question {
    questionId?: string; // Optional for new questions
    id?: string; // Handle both id formats if backend varies
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
}

interface Quiz {
    id: string;
    quizTitle: string;
    description: string;
    questions: Question[];
    classId: string;
    monthId: string;
}

const QuizEditor: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<string[]>(["", "", "", ""]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchQuiz = async () => {
        if (!quizId) return;
        try {
            setLoading(true);
            const data = await getQuizById(quizId);
            setQuiz(data);
        } catch (err) {
            console.error("Failed to load quiz", err);
            setError("Failed to load quiz details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingQuestionId(null);
        setQuestionText("");
        setOptions(["", "", "", ""]);
        setCorrectAnswerIndex(0);
        setFormError("");
    };

    const handleEditClick = (question: Question) => {
        setIsEditing(true);
        // Provide fallback for ID access 
        setEditingQuestionId(question.questionId || question.id || null);
        setQuestionText(question.questionText);
        setOptions([...question.options]);
        setCorrectAnswerIndex(question.correctAnswerIndex);
        setFormError("");
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (questionId: string) => {
        if (!quizId || !confirm("Are you sure you want to delete this question?")) return;

        try {
            setLoading(true);
            await deleteQuestionFromQuiz(quizId, questionId);
            await fetchQuiz();
        } catch (err: any) {
            alert("Failed to delete question");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quizId) return;
        setFormError("");

        // Validation
        if (!questionText.trim()) {
            setFormError("Question text is required");
            return;
        }
        if (options.some(opt => !opt.trim())) {
            setFormError("All 4 options must be filled");
            return;
        }

        try {
            setSaving(true);
            const questionData = {
                questionText,
                options,
                correctAnswerIndex
            };

            if (editingQuestionId) {
                await updateQuestionInQuiz(quizId, editingQuestionId, questionData);
            } else {
                await addQuestionToQuiz(quizId, questionData);
            }

            await fetchQuiz();
            resetForm();
        } catch (err: any) {
            console.error(err);
            setFormError(err.response?.data?.message || "Failed to save question");
        } finally {
            setSaving(false);
        }
    };

    if (loading && !quiz) {
        return (
            <div className="flex items-center justify-center min-h-screen text-purple-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-red-600 text-lg font-medium">{error || "Quiz not found"}</div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/dashboard/classes/${quiz.classId}/months/${quiz.monthId}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={20} /> Back to Month
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{quiz.quizTitle}</h1>
                            <p className="text-gray-500 mt-2">{quiz.description}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                            {quiz.questions?.length || 0} Questions
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Question Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                {isEditing ? <Edit2 size={20} className="text-blue-500" /> : <Plus size={20} className="text-purple-500" />}
                                {isEditing ? "Edit Question" : "Add New Question"}
                            </h2>

                            <form onSubmit={handleSaveQuestion} className="space-y-4">
                                {formError && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                                        {formError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Question Text</label>
                                    <textarea
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-50 outline-none resize-none h-24"
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700">Options</label>
                                    {options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={correctAnswerIndex === idx}
                                                onChange={() => setCorrectAnswerIndex(idx)}
                                                className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                className={`flex-1 px-3 py-2 rounded-lg border ${correctAnswerIndex === idx ? 'border-purple-300 bg-purple-50' : 'border-gray-200'} focus:border-purple-500 outline-none text-sm`}
                                                placeholder={`Option ${idx + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <p className="text-xs text-gray-400 px-1">Select the radio button to mark correct answer.</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Question</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="lg:col-span-2 space-y-4">
                        {(!quiz.questions || quiz.questions.length === 0) ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No questions added yet.</p>
                                <p className="text-sm text-gray-400">Use the form to add your first question.</p>
                            </div>
                        ) : (
                            quiz.questions.map((q, idx) => (
                                <div
                                    key={q.questionId || q.id || idx}
                                    className={`bg-white p-6 rounded-2xl border transition-all ${editingQuestionId === (q.questionId || q.id) ? 'border-purple-500 ring-2 ring-purple-50 shadow-md' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                            <h3 className="font-bold text-gray-900 mt-1">{q.questionText}</h3>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEditClick(q)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick((q.questionId || q.id)!)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                                        {q.options.map((opt, optIdx) => (
                                            <div
                                                key={optIdx}
                                                className={`px-4 py-2 rounded-lg text-sm border flex items-center gap-2 ${optIdx === q.correctAnswerIndex ? 'bg-green-50 border-green-200 text-green-700 font-medium' : 'bg-gray-50 border-gray-100 text-gray-600'}`}
                                            >
                                                {optIdx === q.correctAnswerIndex ? <CheckCircle size={14} /> : <div className="w-3.5" />}
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizEditor;
