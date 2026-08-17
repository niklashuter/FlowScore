import { authorizedFetch } from "./apiClient";
import apiBaseUrl from "./config";

const profileApiUrl = `${apiBaseUrl}/Profile`;

export type Profile = {
    name: string;
    email: string;
    dateOfBirth: string | null;
    heightCm: number | null;
    weightKg: number | null;
    gender: string | null;
};

export type UpdateProfileRequest = {
    name: string;
    dateOfBirth: string | null;
    heightCm: number | null;
    weightKg: number | null;
    gender: string | null;
};

export async function getProfile(): Promise<Profile> {
    const response = await authorizedFetch(profileApiUrl);

    if (!response.ok) {
        throw new Error("Failed to load profile.");
    }

    return response.json();
}

export async function updateProfile(
    profile: UpdateProfileRequest
): Promise<Profile> {
    const response = await authorizedFetch(profileApiUrl, {
        method: "PUT",
        body: JSON.stringify(profile),
    });

    if (!response.ok) {
        throw new Error("Failed to update profile.");
    }

    return response.json();
}