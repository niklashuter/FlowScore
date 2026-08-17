import { authorizedFetch } from "./apiClient";
import apiBaseUrl from "./config";

export type Meal = {
    id: number;
    type: string;
    description: string;
    time: string;
    date: string;
    nutritionScore: number;
    nutritionFeedback: string;
};

export type CreateMealRequest = {
    type: string;
    description: string;
    time: string;
    date: string;
};

const mealsApiUrl = `${apiBaseUrl}/Meals`;

export async function getMealsByDate(date: string): Promise<Meal[]> {
    const response = await authorizedFetch(
        `${mealsApiUrl}/by-date/${date}`
    );

    if (!response.ok) {
        throw new Error("Failed to load meals.");
    }

    return response.json();
}

export async function createMeal(
    meal: CreateMealRequest
): Promise<Meal> {
    const response = await authorizedFetch(mealsApiUrl, {
        method: "POST",
        body: JSON.stringify(meal),
    });

    if (!response.ok) {
        throw new Error("Failed to create meal.");
    }

    return response.json();
}

export async function updateMeal(
    id: number,
    meal: CreateMealRequest
): Promise<void> {
    const response = await authorizedFetch(`${mealsApiUrl}/${id}`, {
        method: "PUT",
        body: JSON.stringify(meal),
    });

    if (!response.ok) {
        throw new Error("Failed to update meal.");
    }
}

export async function deleteMeal(id: number): Promise<void> {
    const response = await authorizedFetch(`${mealsApiUrl}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete meal.");
    }
}