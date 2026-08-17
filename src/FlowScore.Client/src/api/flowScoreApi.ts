import { authorizedFetch } from "./apiClient";
import apiBaseUrl from "./config";

export type FlowScoreResult = {
    recoveryScore: number;
    nutritionScore: number;
    trainingScore: number;
    flowScore: number;
    balanceValue: string;
};

const flowScoreApiUrl = `${apiBaseUrl}/FlowScore`;

export async function getFlowScore(
    date?: string
): Promise<FlowScoreResult> {

    const endpoint = date
        ? `${flowScoreApiUrl}/${date}`
        : `${flowScoreApiUrl}/today`;

    const response = await authorizedFetch(endpoint);

    if (!response.ok) {
        throw new Error("Failed to load FlowScore.");
    }

    return response.json();
}