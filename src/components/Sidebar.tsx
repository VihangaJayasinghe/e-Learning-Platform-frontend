import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Video,
    DollarSign,
    Search,
    CreditCard,
    Users,
    Settings,
    User as UserIcon,
    LogOut
} from "lucide-react";

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    action?: () => void;
}

const Sidebar: React.FC = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active label based on current path
    const getActiveLabel = () => {
        const path = location.pathname;
        if (path === "/dashboard") return "Dashboard";
        if (path.includes("/classes")) return "Classes";
        if (path.includes("/videos")) return "Videos";
        if (path.includes("/earnings")) return "Earnings";
        if (path.includes("/browse")) return "Browse";
        if (path.includes("/payments")) return "Payments";
        if (path.includes("/users")) return "Users";
        if (path.includes("/finance")) return "Finance";
        if (path.includes("/settings")) return "Settings";
        if (path.includes("/profile")) return "Profile";
        return "Dashboard";
    };

    const activeLabel = getActiveLabel();

    if (!context) {
        return null;
    }

    const { user, logout } = context;
    const role = user?.role.toUpperCase();

    const handleNavigation = (_label: string, path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    const getRoleItems = (): SidebarItem[] => {
        switch (role) {
            case "TEACHER":
                return [
                    { icon: LayoutDashboard, label: "Dashboard", action: () => handleNavigation("Dashboard", "/dashboard") },
                    { icon: BookOpen, label: "Classes", action: () => handleNavigation("Classes", "/dashboard/classes") },
                    { icon: Video, label: "Videos", action: () => handleNavigation("Videos", "/dashboard/videos") },
                    { icon: DollarSign, label: "Earnings", action: () => handleNavigation("Earnings", "/dashboard/earnings") },
                ];
            case "STUDENT":
                return [
                    { icon: BookOpen, label: "Classes", action: () => handleNavigation("Classes", "/dashboard/classes") },
                    { icon: Search, label: "Browse", action: () => handleNavigation("Browse", "/dashboard/browse") },
                    { icon: CreditCard, label: "Payments", action: () => handleNavigation("Payments", "/dashboard/payments") },
                ];
            case "ADMIN":
                return [
                    { icon: Users, label: "Users", action: () => handleNavigation("Users", "/dashboard/users") },
                    { icon: BookOpen, label: "Classes", action: () => handleNavigation("Classes", "/dashboard/classes") },
                    { icon: DollarSign, label: "Finance", action: () => handleNavigation("Finance", "/dashboard/finance") },
                ];
            default:
                return [];
        }
    };

    const mainItems = getRoleItems();

    const bottomItems: SidebarItem[] = [
        { icon: Settings, label: "Settings", action: () => handleNavigation("Settings") },
        { icon: UserIcon, label: "Profile", action: () => handleNavigation("Profile", "/profile") },
    ];

    const SidebarIcon = ({ item }: { item: SidebarItem; isBottom?: boolean }) => {
        const isActive = activeLabel === item.label;

        return (
            <div className="relative group flex justify-center w-full">
                {/* Selection Indicator (Left Border) */}
                {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-teal-500 rounded-r-md" />
                )}

                <button
                    onClick={item.action}
                    className={`p-3 transition-colors duration-200 relative
            ${isActive ? "text-teal-500" : "text-gray-400 hover:text-gray-100"}
          `}
                >
                    <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                </button>

                {/* Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                    {item.label}
                </div>
            </div>
        );
    };

    return (
        <aside className="w-16 bg-black flex flex-col items-center py-4 h-screen fixed left-0 top-0 border-r border-gray-800 z-50">
            {/* Top Logo / Menu */}
            {/*  <div className="mb-8 text-teal-500">
          <Menu size={28} /> 
      </div> */}

            {/* Main Items */}
            <div className="flex flex-col gap-2 w-full flex-1">
                {mainItems.map((item) => (
                    <SidebarIcon key={item.label} item={item} />
                ))}
            </div>

            {/* Bottom Items */}
            <div className="flex flex-col gap-2 w-full pb-4">
                {bottomItems.map((item) => (
                    <SidebarIcon key={item.label} item={item} isBottom />
                ))}

                {/* Logout (Special Case) */}
                <div className="relative group flex justify-center w-full">
                    <button
                        onClick={logout}
                        className="p-3 text-red-400/70 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={24} />
                    </button>
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                        Logout
                    </div>
                </div>

                {/* User Avatar (Small) */}
                <div className="mt-4 w-8 h-8 rounded-full bg-teal-900/50 flex items-center justify-center text-teal-500 text-xs font-bold border border-teal-500/30 cursor-default">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
