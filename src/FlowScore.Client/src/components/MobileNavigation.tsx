import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    ChartColumn,
    User,
    Settings,
} from "lucide-react";

const navigationItems = [
    {
        label: "Dashboard",
        path: "/app/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Today",
        path: "/app/today",
        icon: CalendarDays,
    },
    {
        label: "History",
        path: "/app/history",
        icon: ChartColumn,
    },
    {
        label: "Profile",
        path: "/app/profile",
        icon: User,
    },
    {
        label: "Settings",
        path: "/app/settings",
        icon: Settings,
    },
];

function MobileNavigation() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950 lg:hidden">
            <div className="grid grid-cols-5">
                {navigationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center gap-1 py-3 text-xs transition ${
                                    isActive
                                        ? "text-cyan-400"
                                        : "text-slate-400"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}

export default MobileNavigation;