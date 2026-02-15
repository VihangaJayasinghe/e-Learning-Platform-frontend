import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassById, checkEnrollment, enrollStudent, createReview, getApprovedClassReviews, getClassReviewStats } from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import {
    Loader2,
    ArrowLeft,
    Star,
    Clock,
    Calendar,
    DollarSign,
    User,
    Lock,
    Unlock,
    PlayCircle,
    CheckCircle
} from "lucide-react";

interface ClassDetailsData {
    id: string;
    className: string;
    description: string;
    teacher: {
        username: string;
        qualification: string | null;
        yearsOfExperience: number;
        subjectExpertise: string;
        bio: string;
    };
    monthlyPrice: number;
    startMonth: string;
    durationMonths: number;
    months: {
        yearMonth: string;
        displayName: string;
        released: boolean;
    }[];
    status: string;
    averageRating: number;
    totalReviews: number;
}

const StudentClassDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);

    // Simulate Payment State with LocalStorage
    const [paidMonths, setPaidMonths] = useState<Set<string>>(() => {
        const saved = localStorage.getItem(`paid_months_${id}`);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [payingMonth, setPayingMonth] = useState<string | null>(null);

    // Review State
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const authContext = React.useContext(AuthContext); // Use context safely
    const user = authContext?.user;

    useEffect(() => {
        if (id) {
            fetchClassDetails();
            checkEnrollmentStatus();
            fetchReviews();
        }
    }, [id]);

    // Save to local storage whenever paidMonths changes
    useEffect(() => {
        if (id) {
            localStorage.setItem(`paid_months_${id}`, JSON.stringify(Array.from(paidMonths)));
        }
    }, [paidMonths, id]);

    const fetchClassDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await getClassById(id);
            setClassData(data);
        } catch (err: any) {
            console.error("Failed to fetch class details", err);
            setError("Failed to load class details.");
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        if (!id) return;
        try {
            const enrolled = await checkEnrollment(id);
            setIsEnrolled(enrolled);
        } catch (err) {
            console.error("Failed to check enrollment", err);
        }
    };

    const fetchReviews = async () => {
        if (!id) return;
        try {
            const [reviewsData, statsData] = await Promise.all([
                getApprovedClassReviews(id),
                getClassReviewStats(id)
            ]);
            setReviews(reviewsData);
            setStats(statsData);
        } catch (err) {
            console.error("Failed to load reviews", err);
        }
    };

    const handleEnroll = async () => {
        if (!id) return;
        try {
            setEnrollLoading(true);
            await enrollStudent(id);
            setIsEnrolled(true);
            alert("Successfully enrolled!");
        } catch (err: any) {
            console.error("Enrollment failed", err);
            alert(err.response?.data?.message || "Failed to enroll. Please try again.");
        } finally {
            setEnrollLoading(false);
        }
    };

    const handlePay = (yearMonth: string) => {
        setPayingMonth(yearMonth);
        // Simulate API call
        setTimeout(() => {
            setPaidMonths(prev => {
                const newSet = new Set(prev);
                newSet.add(yearMonth);
                return newSet;
            });
            setPayingMonth(null);
            alert(`Payment successful for ${yearMonth}! Content unlocked.`);
        }, 1500);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !user) return;

        try {
            setReviewSubmitting(true);
            await createReview({
                studentId: user.id,
                studentName: user.username,
                targetId: id,
                targetType: "CLASS",
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            setShowReviewModal(false);
            setReviewForm({ rating: 5, comment: "" });
            alert("Review submitted successfully! It will be visible after approval.");
            fetchReviews(); // Refresh list
        } catch (err: any) {
            console.error("Failed to submit review", err);
            alert("Failed to submit review. Please try again.");
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-purple-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-600 text-lg font-medium">{error || "Class not found"}</div>
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
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                {classData.status || "DRAFT"}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                                <Star fill="currentColor" size={16} />
                                <span className="font-bold text-gray-900">{(classData.averageRating || 0).toFixed(1)}</span>
                                <span className="text-gray-400 text-xs">({classData.totalReviews || 0} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">{classData.className}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">{classData.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                                    <p className="font-bold text-gray-900">{classData.durationMonths} Months</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Start Date</p>
                                    <p className="font-bold text-gray-900">{classData.startMonth}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Monthly Price</p>
                                    <p className="font-bold text-gray-900">${classData.monthlyPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Syllabus */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Syllabus</h2>
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded">
                                {(classData.months || []).length} Months
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-4">
                                {(classData.months || []).map((month, index) => {
                                    const isPaid = paidMonths.has(month.yearMonth); // Check if paid

                                    return (
                                        <div
                                            key={index}
                                            className={`border border-gray-100 rounded-xl p-5 flex justify-between items-center transition-all ${(isEnrolled && isPaid && month.released) ? "bg-white hover:border-purple-200 cursor-pointer shadow-sm" : "bg-gray-50/50"
                                                }`}
                                            onClick={() => {
                                                if (isEnrolled && isPaid && month.released) {
                                                    navigate(`/dashboard/browse/${id}/months/${month.yearMonth}`);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center font-bold shadow-sm transition-colors ${(isEnrolled && isPaid) ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-white text-gray-400 border-gray-200"
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${(isEnrolled && isPaid) ? "text-gray-900" : "text-gray-700"}`}>
                                                        {month.displayName}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                        {month.yearMonth}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isEnrolled ? (
                                                    isPaid ? (
                                                        month.released ? (
                                                            <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                                <Unlock size={14} /> Unlocked
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                                <Lock size={14} /> Opening Soon
                                                            </span>
                                                        )
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePay(month.yearMonth);
                                                            }}
                                                            disabled={payingMonth === month.yearMonth}
                                                            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
                                                        >
                                                            {payingMonth === month.yearMonth ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                                                            Pay to Unlock
                                                        </button>
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                        <Lock size={14} />
                                                        Locked
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h2>
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Star fill="currentColor" size={20} />
                                    <span className="font-bold text-xl text-gray-900">{(stats?.averageRating || classData.averageRating || 0).toFixed(1)}</span>
                                    <span className="text-gray-400">({reviews.length} reviews)</span>
                                </div>
                            </div>
                            {isEnrolled && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-100 transition-colors"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    No reviews yet. Be the first to review!
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                                    {review.studentName?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{review.studentName}</h4>
                                                    <div className="flex text-yellow-500 text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-500" : "text-gray-300"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed pl-13">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Enrollment Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                        <div className="mb-6">
                            <span className="text-gray-500 text-sm font-medium">Total Price</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-gray-900">${classData.monthlyPrice}</span>
                                <span className="text-gray-500">/ month</span>
                            </div>
                        </div>

                        {isEnrolled ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                                    <CheckCircle size={18} />
                                    You are enrolled!
                                </div>
                                <button
                                    onClick={() => {
                                        // Navigate to first released month if available
                                        const firstReleased = classData.months?.find(m => m.released);
                                        if (firstReleased) {
                                            navigate(`/dashboard/browse/${id}/months/${firstReleased.yearMonth}`);
                                        }
                                    }}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={20} /> Continue Learning
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrollLoading}
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {enrollLoading ? <Loader2 className="animate-spin" size={20} /> : "Enroll Now"}
                            </button>
                        )}

                        {!isEnrolled && (
                            <p className="text-xs text-center text-gray-400 mt-4">
                                30-day money-back guarantee
                            </p>
                        )}
                    </div>

                    {/* Instructor Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Instructor</p>
                                <h3 className="text-lg font-bold text-gray-900">{classData.teacher?.username || "Instructor"}</h3>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Experience</span>
                                <span className="text-sm font-medium text-gray-900">{classData.teacher?.yearsOfExperience || 0} years</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Expertise</span>
                                <span className="text-sm font-medium text-gray-900 text-right">{classData.teacher?.subjectExpertise || "General"}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 block mb-1">Bio</span>
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                    {classData.teacher?.bio || "No bio available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={32}
                                                fill={star <= reviewForm.rating ? "currentColor" : "none"}
                                                className={star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-50 outline-none resize-none h-32"
                                    placeholder="What did you think about this class?"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={reviewSubmitting}
                                    className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {reviewSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentClassDetails;
