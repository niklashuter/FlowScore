import flowScoreLogo from "../assets/logo.svg";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../api/authApi";

function Header() {
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate("/login", { replace: true });
    }

    return (
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6 lg:h-24 lg:px-10">
            <div className="flex items-center gap-3 lg:gap-5">
                <img
                    src={flowScoreLogo}
                    alt="FlowScore logo"
                    className="h-10 w-10 lg:h-14 lg:w-14"
                />

                <h1 className="text-xl font-bold tracking-tight text-cyan-400 sm:text-2xl lg:text-3xl">
                    FlowScore
                </h1>
            </div>

            <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl p-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:px-4 sm:py-2.5"
            >
                <LogOut size={19} />
                <span className="hidden sm:inline">Log out</span>
            </button>
        </header>
    );
}

export default Header;