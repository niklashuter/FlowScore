export type RecoveryEntry = {
    id: number;
    sleepDurationHours: number;
    sleepQuality: string;
    morningFeeling: string;
    date: string;
};

export type CreateRecoveryEntryRequest = {
    sleepDurationHours: number;
    sleepQuality: string;
    morningFeeling: string;
    date: string;
};

const apiBaseUrl =
    "http://localhost:5243/api/RecoveryEntries";

export async function getRecoveryEntryByDate(
    date: string
): Promise<RecoveryEntry | null> {

    const response = await fetch(
        `${apiBaseUrl}/by-date/${date}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            "Failed to load recovery entry."
        );
    }

    return response.json();
}

export async function createRecoveryEntry(
    recoveryEntry: CreateRecoveryEntryRequest
): Promise<RecoveryEntry> {

    const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recoveryEntry),
    });

    if (!response.ok) {
        throw new Error(
            "Failed to create recovery entry."
        );
    }

    return response.json();
}

export async function updateRecoveryEntry(
    id: number,
    recoveryEntry: CreateRecoveryEntryRequest
): Promise<void> {

    const response = await fetch(
        `${apiBaseUrl}/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recoveryEntry),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to update recovery entry."
        );
    }
}