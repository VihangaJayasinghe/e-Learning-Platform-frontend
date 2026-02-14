import React from "react";

const TeacherClasses: React.FC = () => {
    // Mock data for now
    const classes = [
        { id: 1, title: "Introduction to React", students: 25, active: true },
        { id: 2, title: "Advanced JavaScript", students: 18, active: true },
        { id: 3, title: "CSS Mastery", students: 30, active: false },
    ];

    return (
        <div className="bg-white text-black min-h-full">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">My Classes</h2>
                    <p className="text-gray-500 mt-1">Manage your courses and student enrollments</p>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    + Create New Class
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-3 h-3 rounded-full ${cls.active ? "bg-teal-500" : "bg-gray-400"}`} />
                            <span className="text-sm text-gray-400">ID: {cls.id}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{cls.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-6">
                            <span>{cls.students} Students Enrolled</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 px-4 rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium transition-colors">
                                Edit
                            </button>
                            <button className="flex-1 py-2 px-4 rounded-lg bg-black text-white hover:bg-gray-800 font-medium transition-colors">
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClasses;
