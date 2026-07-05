import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    ChartColumn,
    User,
    Settings,
} from "lucide-react";
    
const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition-all duration-200"
        : "rounded-xl px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white";
    
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

function Sidebar() {
    return (
        <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-800 bg-slate-950">
            <div className="border-b border-slate-800 px-6 py-6">
                <h2 className="text-2xl font-bold text-cyan-400">
                    FlowScore
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Balance creates performance.
                </p>
            </div>

            <nav className="flex-1 px-4 py-6">
                <div className="flex flex-col gap-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={getNavLinkClass}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div className="border-t border-slate-800 px-6 py-4">
                <p className="text-xs text-slate-500">
                    FlowScore v1.0
                </p>
            </div>
        </aside>
    );
}

export default Sidebar;