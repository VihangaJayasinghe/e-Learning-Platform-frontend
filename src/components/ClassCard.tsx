import React from "react";
import { BookOpen, User } from "lucide-react";

export interface ClassData {
    id: string;
    className: string;
    description: string;
    instructorUsername: string;
    schedule: string;
    duration: string;
    monthlyPrice: number;
    status: string;
    averageRating?: number;
}

interface ClassCardProps {
    classData: ClassData;
    onClick: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onClick }) => {
    return (
        <div className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 flex flex-col h-full relative cursor-pointer" onClick={onClick}>
            <div className="h-56 bg-gray-100 relative overflow-hidden group-hover:h-52 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white flex items-center justify-center">
                    <BookOpen size={64} className="text-teal-100 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-teal-700 shadow-sm border border-white/50">
                        {classData.duration} Months
                    </span>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-teal-700 transition-colors" title={classData.className}>
                        {classData.className}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <User size={16} className="text-teal-500" />
                        <span>{classData.instructorUsername}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-8 leading-relaxed flex-1">
                    {classData.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                        <p className="text-xl font-black text-gray-900">${classData.monthlyPrice}<span className="text-sm text-gray-400 font-normal">/mo</span></p>
                    </div>
                    <button
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors shadow-lg active:scale-95"
                    >
                        View Class
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
