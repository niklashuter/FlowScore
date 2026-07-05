import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
            <Outlet />
        </main>
    );
}

export default AuthLayout;