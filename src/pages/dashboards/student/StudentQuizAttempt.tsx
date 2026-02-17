import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getQuizForStudent,
    startQuizAttempt,
    submitQuizAnswer,
    completeQuizAttempt,
    getStudentQuizResult
} from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import {
    Loader2,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Play,
    Award,
    Clock,
    AlertCircle,
    ChevronRight,
    HelpCircle
} from "lucide-react";

interface Question {
    questionId: string;
    questionText: string;
    options: string[];
    // correctAnswerIndex is hidden for students
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    durationMinutes?: number;
}

interface QuizResult {
    id: string;
    scorePercentage: number;
    correctAnswers: number;
    totalQuestions: number;
    passed?: boolean; // May not be in backend, calculated on frontend
    completedAt: string;
}

const StudentQuizAttempt: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext) || {};

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Quiz State
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (quizId && user) {
            fetchQuizData();
        }
    }, [quizId, user]);

    const fetchQuizData = async () => {
        if (!quizId || !user) return;
        try {
            setLoading(true);

            // 1. Check if already completed
            try {
                const result = await getStudentQuizResult(quizId, user.id);
                if (result) {
                    setQuizResult(result);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // Ignore 404, means not taken yet
            }

            // 2. Load Quiz
            const data = await getQuizForStudent(quizId);
            setQuiz(data);
        } catch (err: any) {
            console.error("Failed to load quiz", err);
            setError("Failed to load quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = async () => {
        console.log("Starting quiz with user:", user);
        if (!quiz || !user) {
            console.error("Missing quiz or user data", { quiz, user });
            return;
        }
        try {
            setIsSubmitting(true);
            const attempt = await startQuizAttempt(quiz.id, user.id, user.username);
            setAttemptId(attempt.id);
            setHasStarted(true);
        } catch (err) {
            console.error("Failed to start quiz", err);
            alert("Failed to start quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!attemptId || !quiz || selectedAnswer === null) return;

        try {
            setIsSubmitting(true);
            const question = quiz.questions[currentQuestionIndex];

            // Submit answer to backend
            console.log("Submitting answer:", { attemptId, questionId: question.questionId, selectedAnswer });
            await submitQuizAnswer(attemptId, question.questionId, selectedAnswer);

            // If last question, complete quiz
            if (currentQuestionIndex >= (quiz?.questions?.length || 0) - 1) {
                console.log("Finishing quiz...");
                await finishQuiz();
            } else {
                // Next question
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
            }
        } catch (err) {
            console.error("Failed to submit answer", err);
            alert("Failed to submit answer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const finishQuiz = async () => {
        if (!attemptId) return;
        try {
            await completeQuizAttempt(attemptId);
            // Result usually contains score, etc.
            // If the backend returns the result object directly or the attempt object with result fields
            // Let's assume it returns the Attempt object which might have a 'score' field now, 
            // OR we might need to fetch the result separately if the return type is different.
            // Based on API naming `completeQuizAttempt` returns `QuizAttempt`.
            // Let's re-fetch the clean result object to be safe/consistent.

            const cleanResult = await getStudentQuizResult(quizId!, user!.id);
            setQuizResult(cleanResult);
        } catch (err) {
            console.error("Failed to complete quiz", err);
            alert("Failed to complete quiz.");
        }
    };

    const calculateProgress = () => {
        if (!quiz) return 0;
        return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !quiz) {
        // If we have a result but no quiz data (shouldn't happen if logic is correct, but safe fallback)
        if (quizResult) {
            // Render Result View (see below)
        } else {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <div className="text-red-600 text-lg font-medium">{error || "Quiz not found"}</div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} /> Go Back
                    </button>
                </div>
            );
        }
    }

    // VIEW 1: Quiz Result (Already Taken)
    if (quizResult) {
        // Calculate percentage if not provided
        const percentage = Math.round(quizResult.scorePercentage);
        const isPassed = percentage >= 50; // Simple pass/fail logic

        return (
            <div className="max-w-2xl mx-auto p-6 pt-12">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
                    <div className={`p-10 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
                        {isPassed ? (
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Award size={48} />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <XCircle size={48} />
                            </div>
                        )}

                        <h1 className={`text-3xl font-black mb-2 ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
                            {isPassed ? "Quiz Completed!" : "Quiz Completed"}
                        </h1>
                        <p className={`text-lg font-medium ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {isPassed ? "Great job! You've mastered this topic." : "Keep practicing, you'll get it next time!"}
                        </p>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Score</p>
                                <p className="text-4xl font-black text-gray-900">{quizResult.correctAnswers}/{quizResult.totalQuestions}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Percentage</p>
                                <p className={`text-4xl font-black ${isPassed ? 'text-green-600' : 'text-red-500'}`}>{percentage}%</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={20} /> Back to Content
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VIEW 2: Start Screen
    if (!hasStarted) {
        return (
            <div className="max-w-3xl mx-auto p-6 pt-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-8"
                >
                    <ArrowLeft size={20} /> Cancel
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-10 text-white">
                        <h1 className="text-3xl font-black mb-4">{quiz?.title}</h1>
                        <p className="text-teal-100 text-lg leading-relaxed opacity-90">{quiz?.description}</p>
                    </div>

                    <div className="p-10">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-bold text-sm">
                                <HelpCircle size={18} />
                                {quiz?.questions?.length || 0} Questions
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-bold text-sm">
                                <Clock size={18} />
                                ~{(quiz?.questions?.length || 0) * 2} Minutes
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-10 flex gap-4">
                            <AlertCircle className="text-yellow-600 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-yellow-800 mb-1">Before you start</h4>
                                <p className="text-sm text-yellow-700 leading-relaxed">
                                    Once you start the quiz, you cannot pause the timer. Make sure you have a stable internet connection.
                                    You can't change your answer once submitted.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleStartQuiz}
                            disabled={isSubmitting}
                            className="w-full py-5 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-200 active:scale-95 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Play size={24} fill="currentColor" />}
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VIEW 3: Active Quiz Question
    const question = quiz?.questions[currentQuestionIndex];

    return (
        <div className="max-w-3xl mx-auto p-6 pt-12">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {quiz?.questions?.length || 0}</span>
                    <span>{Math.round(calculateProgress())}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-teal-600 transition-all duration-500 ease-out"
                        style={{ width: `${calculateProgress()}%` }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-10 flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                        {question?.questionText}
                    </h2>

                    <div className="space-y-4">
                        {question?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(index)}
                                className={`w-full p-5 rounded-xl text-left font-medium transition-all flex justify-between items-center group ${selectedAnswer === index
                                    ? "bg-teal-50 border-2 border-teal-500 text-teal-900 shadow-md"
                                    : "bg-white border-2 border-gray-100 text-gray-600 hover:border-teal-200 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${selectedAnswer === index
                                        ? "bg-teal-500 border-teal-500 text-white"
                                        : "bg-gray-100 border-gray-200 text-gray-400 group-hover:border-teal-300 group-hover:text-teal-500"
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    {option}
                                </span>
                                {selectedAnswer === index && (
                                    <CheckCircle className="text-teal-600" size={24} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null || isSubmitting}
                        className="py-3 px-8 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50 disabled:shadow-none active:scale-95 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {currentQuestionIndex === (quiz?.questions?.length || 0) - 1 ? "Finish Quiz" : "Next Question"}
                                {currentQuestionIndex !== (quiz?.questions?.length || 0) - 1 && <ChevronRight size={20} />}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};



export default StudentQuizAttempt;
