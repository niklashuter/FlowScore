import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/profileApi";
import { removeToken } from "../../api/authApi";
import PasswordField from "../../components/ui/PasswordField";
import { changePassword } from "../../api/settingsApi";

function SettingsPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const [isChangingPassword, setIsChangingPassword] =
    useState(false);
    const [passwordError, setPasswordError] =
        useState("");
    const [passwordSuccess, setPasswordSuccess] =
        useState("");

    useEffect(() => {
        async function loadProfile() {
            setIsLoadingProfile(true);
            setProfileError("");

            try {
                const profile = await getProfile();
                setEmail(profile.email);
            } catch (error) {
                console.error("Failed to load profile:", error);
                setProfileError("Unable to load account information.");
            } finally {
                setIsLoadingProfile(false);
            }
        }

        loadProfile();
    }, []);

    function handleLogout() {
        removeToken();
        navigate("/login", { replace: true });
    }

    async function handleChangePassword() {
        setPasswordError("");
        setPasswordSuccess("");

        if (
            currentPassword.trim() === "" ||
            newPassword.trim() === "" ||
            confirmPassword.trim() === ""
        ) {
            setPasswordError("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setIsChangingPassword(true);

        try {
            await changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setPasswordSuccess(
                "Password changed successfully."
            );
        } catch (error) {
            console.error(error);

            setPasswordError(
                error instanceof Error
                    ? error.message
                    : "Unable to change password."
            );
        } finally {
            setIsChangingPassword(false);
        }
    }

    function togglePasswordVisibility() {
        setShowPasswords((previous) => !previous);
    }

    return(
        <div className="space-y-6">
            <PageTitle
                title="Settings"
                description="Manage your account and application preferences."
            />

            <Card>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Appearance
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Customize how FlowScore looks.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl bg-surface-light p-4">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Theme
                            </p>

                            <p className="mt-2 font-medium text-text-main">
                                Dark
                            </p>
                        </div>

                        <div className="rounded-xl bg-surface-light p-4">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Light Mode
                            </p>

                            <p className="mt-2 font-medium text-slate-500">
                                Coming in a future version
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Account
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Manage your account information.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {profileError && (
                            <p className="text-sm text-red-400">
                                {profileError}
                            </p>
                        )}

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="rounded-xl bg-surface-light p-4">
                                <p className="text-xs uppercase tracking-wide text-text-muted">
                                    Email
                                </p>

                                <p className="mt-2 font-medium text-text-main">
                                    {isLoadingProfile
                                        ? "Loading..."
                                        : email || "Not available"}
                                </p>
                            </div>

                           <div className="rounded-xl bg-surface-light p-4">
                                <p className="text-xs uppercase tracking-wide text-text-muted">
                                    Profile
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-4">
                                    <p className="text-sm text-text-muted">
                                        Manage your personal information.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/app/profile")}
                                        className="cursor-pointer font-medium text-primary transition-colors hover:text-primary-hover"
                                    >
                                        Open →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={handleLogout}
                            >
                                Log out
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Security
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Keep your account secure.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">

                        {/* Left column */}

                        <div className="space-y-6">
                            <PasswordField
                                id="new-password"
                                label="New Password"
                                placeholder="Enter a new password"
                                value={newPassword}
                                showPassword={showPasswords}
                                onChange={setNewPassword}
                                onToggleVisibility={togglePasswordVisibility}
                            />

                            <PasswordField
                                id="confirm-password"
                                label="Confirm New Password"
                                placeholder="Repeat your new password"
                                value={confirmPassword}
                                showPassword={showPasswords}
                                onChange={setConfirmPassword}
                                onToggleVisibility={togglePasswordVisibility}
                            />
                        </div>

                        {/* Right column */}

                        <div className="flex h-full flex-col">
                            <PasswordField
                                id="current-password"
                                label="Current Password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                showPassword={showPasswords}
                                onChange={setCurrentPassword}
                                onToggleVisibility={togglePasswordVisibility}
                            />

                            {passwordError && (
                                <p className="text-sm text-red-400">
                                    {passwordError}
                                </p>
                            )}

                            {passwordSuccess && (
                                <p className="text-sm text-green-400">
                                    {passwordSuccess}
                                </p>
                            )}

                            <div className="mt-auto flex justify-end">
                                <Button
                                    variant="primary"
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword
                                        ? "Changing..."
                                        : "Change Password"}
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            About
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Information about FlowScore.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl bg-surface-light p-4">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Version
                            </p>

                            <p className="mt-2 font-medium text-text-main">
                                FlowScore v1.0
                            </p>
                        </div>

                        <div className="rounded-xl bg-surface-light p-4">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Project
                            </p>

                            <p className="mt-2 text-sm text-text-muted">
                                Full-stack portfolio application for tracking recovery,
                                nutrition and training.
                            </p>
                        </div>

                        <div className="rounded-xl bg-surface-light p-4 sm:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Repository
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-4">
                                <p className="text-sm text-text-muted">
                                    View the source code on GitHub.
                                </p>

                                <a
                                    href="https://github.com/niklashuter/FlowScore"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="cursor-pointer font-medium text-primary transition-colors hover:text-primary-hover"
                                >
                                    Open →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Future Features
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Planned features for future versions.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl bg-surface-light p-4">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Delete Account
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Coming in a future version.
                            </p>
                        </div>

                        <div className="rounded-xl bg-surface-light p-4">
                            <p className="text-xs uppercase tracking-wide text-text-muted">
                                Data Export
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Coming in a future version.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default SettingsPage;