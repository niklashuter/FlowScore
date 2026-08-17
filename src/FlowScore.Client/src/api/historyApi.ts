import { authorizedFetch } from "./apiClient";
import apiBaseUrl from "./config";

const historyApiUrl = `${apiBaseUrl}/History`;

export type HistoryDayResponse = {
    date: string;
    flowScore: number;
    recoveryScore: number;
    nutritionScore: number;
    trainingScore: number;
    balanceValue: string;
};

export type HistoryRecovery = {
    sleepDurationHours: number;
    sleepQuality: string;
    morningFeeling: string;
};

export type HistoryMeal = {
    id: number;
    type: string;
    description: string;
    time: string;
    nutritionScore: number | null;
};

export type HistoryTrainingSession = {
    id: number;
    type: string;
    durationMinutes: number;
    intensity: string;
    score: number;
};

export type HistoryDayDetailsResponse = {
    date: string;
    flowScore: number;
    recoveryScore: number;
    nutritionScore: number;
    trainingScore: number;
    recovery: HistoryRecovery | null;
    meals: HistoryMeal[];
    trainingSessions: HistoryTrainingSession[];
    isRestDay: boolean;
};

export async function getHistory(
    days?: number,
    endDate?: string
): Promise<HistoryDayResponse[]> {
    const params = new URLSearchParams();

    if (days !== undefined) {
        params.set("days", days.toString());
    }

    if (endDate !== undefined) {
        params.set("endDate", endDate);
    }

    const queryString = params.toString();

    const endpoint = queryString
        ? `${historyApiUrl}?${queryString}`
        : historyApiUrl;

    const response = await authorizedFetch(endpoint);

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Failed to load history: ${response.status} ${errorBody}`
        );
    }

    return response.json();
}

export async function getHistoryDayDetails(
    date: string
): Promise<HistoryDayDetailsResponse> {
    const response = await authorizedFetch(
        `${historyApiUrl}/${date}`
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Failed to load history details: ${response.status} ${errorBody}`
        );
    }

    return response.json();
}