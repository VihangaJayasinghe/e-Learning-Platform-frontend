import React, { useState, useEffect } from "react";
import { getMyPayments, getClassById } from "../../../services/api";
import { Loader2, DollarSign, Calendar, BookOpen, CheckCircle, Clock } from "lucide-react";

interface Payment {
    id: string;
    classId: string;
    className: string;
    yearMonth: string;
    amount: number;
    status: string;
    paymentDate: string;
}

const StudentPayments: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const paymentsData = await getMyPayments();

                // Extract unique class IDs
                const uniqueClassIds = Array.from(new Set(paymentsData.map((p: any) => p.classId))) as string[];

                // Fetch class details map
                const classMap: Record<string, string> = {};
                await Promise.all(uniqueClassIds.map(async (classId) => {
                    try {
                        const classData = await getClassById(classId);
                        classMap[classId] = classData.className;
                    } catch (err) {
                        console.error(`Failed to fetch class name for ${classId}`, err);
                        classMap[classId] = "Unknown Class";
                    }
                }));

                // Enrich payments with class names
                const enrichedPayments = paymentsData.map((p: any) => ({
                    ...p,
                    className: p.className || classMap[p.classId] || "Unknown Class"
                }));

                setPayments(enrichedPayments);
            } catch (err) {
                console.error("Failed to load payments", err);
                setError("Failed to load payment history.");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const totalSpent = payments.reduce((sum, p) => p.status === 'COMPLETED' ? sum + p.amount : sum, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
                    <DollarSign size={32} />
                </div>
                My Payment History
            </h1>

            {/* Stats Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-sm">
                <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Total Spent</p>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-black text-gray-900">${totalSpent.toFixed(2)}</h2>
                    <span className="text-gray-400 font-medium">USD</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 border border-red-100 font-medium">
                    {error}
                </div>
            )}

            {/* Payments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {payments.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <DollarSign size={32} className="text-gray-300" />
                        </div>
                        <p className="font-medium">No payment history found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Class</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Month</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Amount</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:bg-teal-100 transition-colors">
                                                    <BookOpen size={20} />
                                                </div>
                                                <span className="font-bold text-gray-900">{payment.className || "Unknown Class"}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                                                {payment.yearMonth}
                                            </span>
                                        </td>
                                        <td className="p-5 text-gray-500 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                {new Date(payment.paymentDate).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right font-black text-gray-900">
                                            ${payment.amount.toFixed(2)}
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${payment.status === 'COMPLETED'
                                                ? 'bg-teal-100 text-teal-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {payment.status === 'COMPLETED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPayments;
