import React, { useState, useEffect } from "react";
import { getTeacherPayments } from "../../../services/api";
import { Loader2, DollarSign, Calendar, User, BookOpen } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

interface Payment {
    id: string;
    student: { username: string } | null;
    classId: string;
    className: string;
    yearMonth: string;
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    status: string;
    paymentDate: string;
}

const TeacherPayments: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPayments = async () => {
            try {
                // setLoading(true); // Removed from here, as it's already true initially
                const data = await getTeacherPayments();
                setPayments(data);
            } catch (err) {
                console.error("Failed to load payments", err);
                setError("Failed to load payment history.");
            } finally {
                setLoading(false);
            }
        };
        loadPayments();
    }, []);

    // Calculate total earnings
    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    // Prepare data for the graph
    const monthlyEarnings = payments.reduce((acc, payment) => {
        const month = payment.yearMonth;
        acc[month] = (acc[month] || 0) + payment.amount;
        return acc;
    }, {} as Record<string, number>);

    const graphData = Object.keys(monthlyEarnings)
        .sort() // Sort by date string YYYY-MM
        .map(month => ({
            name: month,
            amount: monthlyEarnings[month]
        }));

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                    <p className="font-bold text-gray-700 mb-1">{label}</p>
                    <p className="text-teal-600 font-black text-lg">
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-teal-600">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 font-sans bg-white min-h-screen">
            <header className="mb-10 border-b border-gray-100 pb-8">
                <h1 className="text-4xl font-black text-teal-900 tracking-tight flex items-center gap-4 mb-2">
                    <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
                        <DollarSign size={32} />
                    </div>
                    Earnings & Payments
                </h1>
                <p className="text-gray-500 font-medium ml-16">Track your revenue and payment history.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Stats Card */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-8 rounded-[30px] shadow-2xl shadow-teal-900/10 relative overflow-hidden text-white flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                    <p className="font-bold text-teal-100 uppercase tracking-widest text-xs mb-2 relative z-10">Total Earnings</p>
                    <h2 className="text-5xl font-black relative z-10 tracking-tight flex items-baseline gap-1">
                        ${totalEarnings.toFixed(2)}
                        <span className="text-xl text-teal-200 font-medium">USD</span>
                    </h2>
                </div>

                {/* Graph */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm h-[300px]">
                    <h3 className="text-gray-700 font-bold mb-4 ml-2">Monthly Earnings</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={graphData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdfa' }} />
                            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                {graphData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0d9488' : '#14b8a6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Payments Table */}
            <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-widest">Student</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-widest">Class</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-widest">Month</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-widest">Date</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-widest text-right">Amount</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-teal-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3 text-gray-900 font-bold">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                                                <User size={18} />
                                            </div>
                                            {payment.student?.username || "Unknown Student"}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <BookOpen size={16} className="text-gray-300" />
                                            {payment.className}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-black font-mono">
                                            {payment.yearMonth}
                                        </span>
                                    </td>
                                    <td className="p-6 text-gray-500 text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-300" />
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-black text-gray-900 text-lg">
                                        ${payment.amount.toFixed(2)}
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${payment.status === 'COMPLETED'
                                                ? 'bg-teal-100 text-teal-700'
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
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-medium">No payment history available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherPayments;
