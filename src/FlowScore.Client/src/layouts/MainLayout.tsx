import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNavigation from "../components/MobileNavigation";

function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header/>

            <div className="flex">
                <Sidebar/>
                
                {/* Page content */}
                <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8">
                    <Outlet />
                </main>
            </div>

            <MobileNavigation />
        </div>
    );
}

export default MainLayout;