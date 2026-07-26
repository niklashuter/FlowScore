export type FlowScoreResult = {
    recoveryScore: number;
    nutritionScore: number;
    trainingScore: number;
    flowScore: number;
    balanceValue: string;
};

const apiBaseUrl =
    "http://localhost:5243/api/FlowScore";

export async function getFlowScore(
    date?: string
): Promise<FlowScoreResult> {

    const endpoint = date
        ? `${apiBaseUrl}/${date}`
        : `${apiBaseUrl}/today`;

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error("Failed to load FlowScore.");
    }

    return response.json();
}