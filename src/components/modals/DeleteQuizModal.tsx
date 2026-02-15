import React from "react";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

const DeleteQuizModal: React.FC<DeleteQuizModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl transform transition-all">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Quiz?</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Are you sure you want to delete this quiz? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteQuizModal;
