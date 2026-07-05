import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardPage from "../pages/app/DashboardPage";
import TodayPage from "../pages/app/TodayPage";
import HistoryPage from "../pages/app/HistoryPage";
import ProfilePage from "../pages/app/ProfilePage";
import SettingsPage from "../pages/app/SettingsPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                // Default Route
                <Route path="/" element={<Navigate to="/login" replace />} />

                // Authentication routes
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                //Protected Application routes
                // Protected application routes
                <Route path="/app" element={<MainLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="today" element={<TodayPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;