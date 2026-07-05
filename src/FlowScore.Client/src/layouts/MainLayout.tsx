import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header/>

            <div className="flex">
                <Sidebar/>
                
                {/* Page content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;