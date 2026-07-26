const apiBaseUrl =
    "http://localhost:5243/api/History";

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
    days?: number
): Promise<HistoryDayResponse[]> {
    const endpoint = days !== undefined
        ? `${apiBaseUrl}?days=${days}`
        : apiBaseUrl;

    const response = await fetch(endpoint);

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
    const response = await fetch(
        `${apiBaseUrl}/${date}`
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Failed to load history details: ${response.status} ${errorBody}`
        );
    }

    return response.json();
}