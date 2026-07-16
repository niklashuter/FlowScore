export type TrainingSession = {
    id: number;
    type: string;
    durationMinutes: number;
    intensity: string;
    date: string;
};

export type CreateTrainingSessionRequest = {
    type: string;
    durationMinutes: number;
    intensity: string;
    date: string;
};

const apiBaseUrl =
    "http://localhost:5243/api/TrainingSessions";

export async function getTrainingSessionsByDate(
    date: string
): Promise<TrainingSession[]> {
    const response = await fetch(
        `${apiBaseUrl}/by-date/${date}`
    );

    if (!response.ok) {
        throw new Error("Failed to load training sessions.");
    }

    return response.json();
}

export async function createTrainingSession(
    trainingSession: CreateTrainingSessionRequest
): Promise<TrainingSession> {
    const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingSession),
    });

    if (!response.ok) {
        throw new Error("Failed to create training session.");
    }

    return response.json();
}

export async function updateTrainingSession(
    id: number,
    trainingSession: CreateTrainingSessionRequest
): Promise<void> {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingSession),
    });

    if (!response.ok) {
        throw new Error("Failed to update training session.");
    }
}

export async function deleteTrainingSession(
    id: number
): Promise<void> {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete training session.");
    }
}