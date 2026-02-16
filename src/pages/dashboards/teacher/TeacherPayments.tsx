import React, { useState, useEffect } from "react";
import { getTeacherPayments } from "../../../services/api";
import { Loader2, DollarSign, Calendar, User, BookOpen } from "lucide-react";

interface Payment {
    id: string;
    student: { username: string } | null;
    classId: string;
    className: string;
    yearMonth: string;
    amount: number;
    status: string;
    paymentDate: string;
}

const TeacherPayments: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const data = await getTeacherPayments();
                setPayments(data);
            } catch (err) {
                console.error("Failed to load payments", err);
                setError("Failed to load payment history.");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Calculate total earnings
    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="text-teal-600" size={32} />
                Earnings & Payments
            </h1>

            {/* Stats Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-sm">
                <p className="text-gray-500 font-medium mb-1">Total Earnings</p>
                <h2 className="text-4xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</h2>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600 text-sm">Student</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Class</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Month</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Date</th>
                                <th className="p-4 font-bold text-gray-600 text-sm text-right">Amount</th>
                                <th className="p-4 font-bold text-gray-600 text-sm text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <User size={16} />
                                            </div>
                                            {payment.student?.username || "Unknown Student"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={16} className="text-gray-400" />
                                            {payment.className}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                            {payment.yearMonth}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-900">
                                        ${payment.amount.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {payments.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No payments found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherPayments;
