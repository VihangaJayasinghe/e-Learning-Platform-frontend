import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../src/images/edura_logo.png";
import { User, Bell } from "lucide-react";

const Header: React.FC = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-8 shadow-sm">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
                <img src={logo} alt="EDURA" className="w-10 h-10 object-contain" />
                <span className="font-bold text-2xl tracking-tight text-teal-900 hidden sm:block">EDURA</span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                {/* Notification Bell (Optional Placeholder) */}
                <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors rounded-full hover:bg-gray-50">
                    <Bell size={20} />
                </button>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200"></div>

                {/* User Profile */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate("/profile")}
                >
                    <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold shadow-sm group-hover:shadow-md group-hover:border-teal-200 transition-all">
                        {user?.username ? (
                            user.username.charAt(0).toUpperCase()
                        ) : (
                            <User size={18} />
                        )}
                    </div>
                    {/* User Name - Hidden on small mobile */}
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors leading-none mb-0.5">
                            {user?.username || "Guest"}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            {user?.role || "Student"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
