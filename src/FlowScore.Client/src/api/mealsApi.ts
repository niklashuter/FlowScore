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

const apiBaseUrl = "http://localhost:5243/api/Meals";

export async function getMealsByDate(date: string): Promise<Meal[]> {
    const response = await fetch(`${apiBaseUrl}/by-date/${date}`);

    if (!response.ok) {
        throw new Error("Failed to load meals.");
    }

    return response.json();
}

export async function createMeal(
    meal: CreateMealRequest
): Promise<Meal> {
    const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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
    const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(meal),
    });

    if (!response.ok) {
        throw new Error("Failed to update meal.");
    }
}

export async function deleteMeal(id: number): Promise<void> {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete meal.");
    }
}