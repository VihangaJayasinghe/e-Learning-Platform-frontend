import React from "react";

const StudentClasses: React.FC = () => {
    // Mock data
    const enrolledClasses = [
        { id: 1, title: "Introduction to React", teacher: "Mr. Smith", progress: 65 },
        { id: 2, title: "Web Design Fundamentals", teacher: "Ms. Johnson", progress: 30 },
    ];

    return (
        <div className="bg-white text-black min-h-full">
            <header className="mb-8">
                <h2 className="text-3xl font-bold">My Enrollments</h2>
                <p className="text-gray-500 mt-1">Continue learning where you left off</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledClasses.map((cls) => (
                    <div key={cls.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
                        <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                            Course Thumbnail
                        </div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-teal-600 transition-colors">{cls.title}</h3>
                        <p className="text-gray-500 text-sm mb-4">Instructor: {cls.teacher}</p>

                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{cls.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-teal-500 h-2 rounded-full"
                                    style={{ width: `${cls.progress}%` }}
                                />
                            </div>
                        </div>

                        <button className="w-full py-2 px-4 rounded-lg bg-black text-white hover:bg-gray-800 font-medium transition-colors">
                            Continue Learning
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentClasses;
