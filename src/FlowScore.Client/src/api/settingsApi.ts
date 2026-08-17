import { authorizedFetch } from "./apiClient";
import apiBaseUrl from "./config";

const settingsApiUrl = `${apiBaseUrl}/Settings`;

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
};

export async function changePassword(
    request: ChangePasswordRequest
): Promise<void> {
    const response = await authorizedFetch(
        `${settingsApiUrl}/password`,
        {
            method: "PUT",
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        const errorMessage =
            Array.isArray(errorData) && errorData.length > 0
                ? errorData
                    .map((error) => error.description)
                    .join(" ")
                : "Failed to change password.";

        throw new Error(errorMessage);
    }
}