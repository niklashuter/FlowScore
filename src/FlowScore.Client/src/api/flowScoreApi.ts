export type FlowScoreResult = {
    recoveryScore: number;
    nutritionScore: number;
    trainingScore: number;
    flowScore: number;
};

const apiBaseUrl =
    "http://localhost:5243/api/FlowScore";

export async function getTodayFlowScore(): Promise<FlowScoreResult> {
    const response = await fetch(`${apiBaseUrl}/today`);

    if (!response.ok) {
        throw new Error("Failed to load today's FlowScore.");
    }

    return response.json();
}