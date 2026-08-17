import { authorizedFetch } from "./apiClient";
import apiBaseUrl from "./config";

export type TrainingDay = {
    id: number;
    date: string;
    isRestDay: boolean;
};

export type UpdateTrainingDayRequest = {
    isRestDay: boolean;
};

const trainingDayApiUrl = `${apiBaseUrl}/TrainingDays`;

export async function getTrainingDayByDate(
    date: string
): Promise<TrainingDay | null> {
    const response = await authorizedFetch(
        `${trainingDayApiUrl}/by-date/${date}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to load training day.");
    }

    return response.json();
}

export async function updateTrainingDay(
    date: string,
    request: UpdateTrainingDayRequest
): Promise<TrainingDay> {
    const response = await authorizedFetch(
        `${trainingDayApiUrl}/by-date/${date}`,
        {
            method: "PUT",
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update training day.");
    }

    return response.json();
}