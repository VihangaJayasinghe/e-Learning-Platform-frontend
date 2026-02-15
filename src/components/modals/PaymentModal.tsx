import React, { useState } from "react";
import { Loader2, X, CreditCard, Lock, CheckCircle } from "lucide-react";
import { initiatePayment, completePayment } from "../../services/api";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classId: string;
    className: string;
    yearMonth: string;
    amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    classId,
    className,
    yearMonth,
    amount
}) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
    const [error, setError] = useState("");

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError("");
            setStep('processing');

            // 1. Initiate Payment
            const payment = await initiatePayment(classId, yearMonth, amount);

            // 2. Simulate Stripe Processing (Mock)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Complete Payment
            await completePayment(payment.id);

            setStep('success');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error("Payment failed", err);
            setError(err.response?.data?.message || "Payment failed. Please try again.");
            setStep('confirm');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        <Lock size={20} className="text-teal-600" />
                        Secure Payment
                    </div>
                    <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    {step === 'processing' ? (
                        <div className="py-8 space-y-4">
                            <div className="relative mx-auto w-16 h-16">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                                <CreditCard className="absolute inset-0 m-auto text-teal-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Processing Payment...</h3>
                            <p className="text-gray-500">Please do not close this window.</p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
                            <p className="text-gray-500">You now have access to this content.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-left space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Class</p>
                                    <h3 className="font-bold text-gray-900">{className}</h3>
                                </div>
                                <div className="flex justify-between items-center py-4 border-y border-gray-100">
                                    <span className="text-gray-600">Month Access ({yearMonth})</span>
                                    <span className="text-xl font-bold text-gray-900">${amount.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                            >
                                <CreditCard size={18} />
                                Pay ${amount.toFixed(2)}
                            </button>

                            <p className="text-xs text-center text-gray-400">
                                <Lock size={12} className="inline mr-1" />
                                Payments are secure and encrypted.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
