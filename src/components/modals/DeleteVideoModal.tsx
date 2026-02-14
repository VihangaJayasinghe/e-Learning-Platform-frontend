import React, { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deleteFromStorage: boolean) => void;
    loading: boolean;
}

const DeleteVideoModal: React.FC<DeleteVideoModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [deleteFromStorage, setDeleteFromStorage] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
                <div className="flex items-center gap-3 text-amber-500 mb-4">
                    <AlertTriangle size={28} />
                    <h3 className="text-xl font-bold text-gray-900">Remove Video</h3>
                </div>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to remove this video from the month?
                </p>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={deleteFromStorage}
                                onChange={(e) => setDeleteFromStorage(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 mt-0.5"
                            />
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-gray-900 block">Delete permanently?</span>
                            <span className="text-gray-500">
                                This will delete the file from storage (Cloudinary) and cannot be undone.
                            </span>
                        </div>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(deleteFromStorage)}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteVideoModal;
