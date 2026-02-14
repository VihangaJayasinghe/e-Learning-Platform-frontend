import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { createClass, updateClass } from "../../services/api";

interface ClassFormData {
    className: string;
    description: string;
    monthlyPrice: number;
    startMonth: string;
    durationMonths: number;
}

interface ClassFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: ClassFormData;
    classId?: string; // If present, we are in Edit mode
}

const ClassFormModal: React.FC<ClassFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData,
    classId,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<ClassFormData>({
        className: "",
        description: "",
        monthlyPrice: 0,
        startMonth: "",
        durationMonths: 1,
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                className: initialData.className || "",
                description: initialData.description || "",
                monthlyPrice: initialData.monthlyPrice || 0,
                startMonth: initialData.startMonth || "",
                durationMonths: initialData.durationMonths || 1,
            });
        } else if (isOpen && !initialData) {
            // Reset form for create mode
            setFormData({
                className: "",
                description: "",
                monthlyPrice: 0,
                startMonth: "",
                durationMonths: 1,
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const isEditMode = !!classId;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "monthlyPrice" || name === "durationMonths" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEditMode && classId) {
                await updateClass(classId, formData);
            } else {
                await createClass(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Failed to save class:", err);
            setError(
                err.response?.data?.message || "Failed to save class. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                        {isEditMode ? "Edit Class" : "Create New Class"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Class Name
                        </label>
                        <input
                            type="text"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Advanced Physics"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Deep dive into Quantum Mechanics"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Start Month
                            </label>
                            <input
                                type="month"
                                name="startMonth"
                                value={formData.startMonth}
                                onChange={handleChange}
                                required
                                disabled={isEditMode}
                                className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Duration (Months)
                            </label>
                            <input
                                type="number"
                                name="durationMonths"
                                value={formData.durationMonths}
                                onChange={handleChange}
                                min="1"
                                required
                                disabled={isEditMode}
                                className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Monthly Price ($)
                        </label>
                        <input
                            type="number"
                            name="monthlyPrice"
                            value={formData.monthlyPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (isEditMode ? "Update Class" : "Create Class")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassFormModal;
