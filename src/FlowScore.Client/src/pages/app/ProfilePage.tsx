import { useEffect, useState } from "react";
import ProfileField from "../../components/profile/ProfileField";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
    getProfile,
    updateProfile,
    type Profile,
    type UpdateProfileRequest,
} from "../../api/profileApi";
import SelectField from "../../components/ui/SelectField";

function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] =
        useState<UpdateProfileRequest | null>(null);

    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            setError("");

            try {
                const loadedProfile = await getProfile();
                setProfile(loadedProfile);
            } catch (error) {
                console.error("Failed to load profile:", error);
                setError("Unable to load profile.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, []);

    function formatDate(date: string | null) {
        if (!date) {
            return "Not provided";
        }

        return new Intl.DateTimeFormat("de-CH").format(
            new Date(`${date}T00:00:00`)
        );
    }

    function handleEdit() {
        if (!profile) {
            return;
        }

        setFormData({
            name: profile.name,
            dateOfBirth: profile.dateOfBirth,
            heightCm: profile.heightCm,
            weightKg: profile.weightKg,
            gender: profile.gender,
        });

        setIsEditing(true);
    }

    function handleCancel() {
        setIsEditing(false);
        setFormData(null);
        setError("");
    }

    async function handleSave() {
        if (!formData) {
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const updatedProfile = await updateProfile(formData);

            setProfile(updatedProfile);
            setIsEditing(false);
            setFormData(null);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setError("Unable to update profile.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageTitle
                title="Profile"
                description="View and manage your personal information."
            />

            <Card>
                <div className="space-y-6">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-text-main">
                                Personal Information
                            </h2>

                            <p className="mt-2 text-sm text-text-muted">
                                Keep your profile details up to date.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            {isEditing && (
                                <Button
                                    variant="secondary"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                variant={isEditing ? "primary" : "secondary"}
                                disabled={isSaving}
                                onClick={isEditing ? handleSave : handleEdit}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : isEditing
                                        ? "Save"
                                        : "Edit"}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {isLoading && (
                        <p className="text-sm text-text-muted">
                            Loading profile...
                        </p>
                    )}

                    {!isLoading && profile && (
                        <>
                            {isEditing && formData ? (
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="profile-name"
                                            className="text-sm font-medium text-text-main"
                                        >
                                            Name
                                        </label>

                                        <input
                                            id="profile-name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(event) =>
                                                setFormData({
                                                    ...formData,
                                                    name: event.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-text-main outline-none transition focus:border-cyan-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="profile-email"
                                            className="text-sm font-medium text-slate-500"
                                        >
                                            Email
                                        </label>

                                        <input
                                            id="profile-email"
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="profile-date-of-birth"
                                            className="text-sm font-medium text-text-main"
                                        >
                                            Date of Birth
                                        </label>

                                        <input
                                            id="profile-date-of-birth"
                                            type="date"
                                            value={formData.dateOfBirth ?? ""}
                                            onChange={(event) =>
                                                setFormData({
                                                    ...formData,
                                                    dateOfBirth:
                                                        event.target.value || null,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-text-main outline-none transition focus:border-cyan-400"
                                        />
                                    </div>

                                    <SelectField
                                        className="!h-12"
                                        label="Gender"
                                        value={formData.gender ?? ""}
                                        options={[
                                            {
                                                label: "Not provided",
                                                value: "",
                                            },
                                            {
                                                label: "Male",
                                                value: "Male",
                                            },
                                            {
                                                label: "Female",
                                                value: "Female",
                                            },
                                            {
                                                label: "Other",
                                                value: "Other",
                                            },
                                            {
                                                label: "Prefer not to say",
                                                value: "Prefer not to say",
                                            },
                                        ]}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                gender: value || null,
                                            })
                                        }
                                    />

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="profile-height"
                                            className="text-sm font-medium text-text-main"
                                        >
                                            Height (cm)
                                        </label>

                                        <input
                                            id="profile-height"
                                            type="number"
                                            min="0"
                                            value={formData.heightCm ?? ""}
                                            onChange={(event) =>
                                                setFormData({
                                                    ...formData,
                                                    heightCm:
                                                        event.target.value === ""
                                                            ? null
                                                            : Number(event.target.value),
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-text-main outline-none transition focus:border-cyan-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="profile-weight"
                                            className="text-sm font-medium text-text-main"
                                        >
                                            Weight (kg)
                                        </label>

                                        <input
                                            id="profile-weight"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={formData.weightKg ?? ""}
                                            onChange={(event) =>
                                                setFormData({
                                                    ...formData,
                                                    weightKg:
                                                        event.target.value === ""
                                                            ? null
                                                            : Number(event.target.value),
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-text-main outline-none transition focus:border-cyan-400"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <ProfileField
                                        label="Name"
                                        value={profile.name || "Not provided"}
                                    />

                                    <ProfileField
                                        label="Email"
                                        value={profile.email}
                                        disabled
                                    />

                                    <ProfileField
                                        label="Date of Birth"
                                        value={formatDate(profile.dateOfBirth)}
                                    />

                                    <ProfileField
                                        label="Gender"
                                        value={profile.gender || "Not provided"}
                                    />

                                    <ProfileField
                                        label="Height"
                                        value={
                                            profile.heightCm !== null
                                                ? `${profile.heightCm} cm`
                                                : "Not provided"
                                        }
                                    />

                                    <ProfileField
                                        label="Weight"
                                        value={
                                            profile.weightKg !== null
                                                ? `${profile.weightKg} kg`
                                                : "Not provided"
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default ProfilePage;