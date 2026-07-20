import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import CardActionButton from "../ui/CardActionButton";
import {
    createMeal,
    deleteMeal,
    getMealsByDate,
    updateMeal,
    type Meal,
} from "../../api/mealsApi";

type MealsCardProps = {
    onMealsChanged: () => void;
};

function MealsCard({
    onMealsChanged,
}: MealsCardProps) {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [mealType, setMealType] = useState("breakfast");
    const [mealTime, setMealTime] = useState("08:00");

    const [mealDescription, setMealDescription] = useState("");
    const [editingMealId, setEditingMealId] = useState<number | null>(null);

    const [meals, setMeals] = useState<Meal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const currentDate = new Date();

    const today = [
        currentDate.getFullYear(),
        String(currentDate.getMonth() + 1).padStart(2, "0"),
        String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    const mealTypeOptions = [
        { label: "Breakfast", value: "breakfast" },
        { label: "Lunch", value: "lunch" },
        { label: "Dinner", value: "dinner" },
        { label: "Snack", value: "snack" },
    ];

    const defaultMealTimes: Record<string, string> = {
        breakfast: "08:00",
        lunch: "12:00",
        dinner: "18:00",
        snack: "15:30",
    };

    const mealTimeOptions = Array.from(
        { length: 48 },
        (_, index) => {
            const totalMinutes = index * 30;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            const formattedTime = `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}`;

            return {
                label: formattedTime,
                value: formattedTime,
            };
        }
    );

    async function loadMeals() {
        setIsLoading(true);
        setError("");

        try {
            const loadedMeals = await getMealsByDate(today);

            setMeals(loadedMeals);
        } catch (error) {
            console.error("Failed to load meals:", error);

            setError("Unable to load meals.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadMeals();
    }, [today]);

    function resetMealForm() {
        setMealType("breakfast");
        setMealTime("08:00");
        setMealDescription("");
        setEditingMealId(null);
    }

    async function handleSaveMeal() {
        const selectedMealType = mealTypeOptions.find(
            (option) => option.value === mealType
        );

        if (!selectedMealType || mealDescription.trim() === "") {
            return;
        }

        const mealRequest = {
            type: selectedMealType.label,
            description: mealDescription.trim(),
            time: `${mealTime}:00`,
            date: today,
        };

        try {
            if (editingMealId !== null) {
                await updateMeal(editingMealId, mealRequest);
            } else {
                await createMeal(mealRequest);
            }

            await loadMeals();
            onMealsChanged();
            resetMealForm();
            setIsMealModalOpen(false);
        } catch (error) {
            console.error("Failed to save meal:", error);
            setError("Unable to save meal.");
        }
    }

    function handleEditMeal(mealId: number) {
        const mealToEdit = meals.find((meal) => meal.id === mealId);

        if (!mealToEdit) {
            return;
        }

        const matchingMealType = mealTypeOptions.find(
            (option) => option.label === mealToEdit.type
        );

        setMealType(matchingMealType?.value ?? "breakfast");
        setMealTime(mealToEdit.time.slice(0, 5));
        setMealDescription(mealToEdit.description);
        setEditingMealId(mealToEdit.id);
        setIsMealModalOpen(true);
    }

    async function handleDeleteMeal(mealId: number) {
        try {
            await deleteMeal(mealId);
            await loadMeals();
            onMealsChanged();
        } catch (error) {
            console.error("Failed to delete meal:", error);
            setError("Unable to delete meal.");
        }
    }

    return (
        <Card>
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-text-main">
                            Meals
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Add meals throughout the day to keep nutrition up to date.
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            resetMealForm();
                            setIsMealModalOpen(true);
                        }}
                    >
                        Add Meal
                    </Button>
                </div>

                {error && (
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                    {isLoading ? (
                        <p className="text-sm text-text-muted">
                            Loading meals...
                        </p>
                    ) : meals.length === 0 ? (
                        <p className="text-sm text-text-muted">
                            No meals have been added for today.
                        </p>
                    ) : (
                        meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="rounded-xl bg-surface-light p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-text-main">
                                                {meal.type}
                                            </p>

                                            <span className="text-xs text-text-muted">
                                                {meal.time.slice(0, 5)}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-text-muted">
                                            {meal.description}
                                        </p>

                                        <div className="mt-3 space-y-2">
                                            <p className="text-sm font-medium text-text-main">
                                                Nutrition Score: {meal.nutritionScore}/100
                                            </p>

                                            <p className="whitespace-pre-line text-sm leading-6 text-text-muted">
                                                {meal.nutritionFeedback}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <CardActionButton
                                            onClick={() => handleEditMeal(meal.id)}
                                        >
                                            Edit
                                        </CardActionButton>

                                        <CardActionButton
                                            variant="danger"
                                            onClick={() => handleDeleteMeal(meal.id)}
                                        >
                                            Delete
                                        </CardActionButton>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={isMealModalOpen}
                title={editingMealId !== null ? "Edit Meal" : "Add Meal"}
                onClose={() => setIsMealModalOpen(false)}
            >
                <div className="space-y-5">
                    <SelectField
                        label="Meal Type"
                        value={mealType}
                        options={mealTypeOptions}
                        onChange={(value) => {
                            setMealType(value);
                            setMealTime(defaultMealTimes[value] ?? "08:00");
                        }}
                    />

                    <SelectField
                        label="Time"
                        value={mealTime}
                        options={mealTimeOptions}
                        onChange={setMealTime}
                    />

                    <div className="space-y-2">
                        <label
                            htmlFor="meal-description"
                            className="text-sm font-medium text-text-main"
                        >
                            Description
                        </label>

                        <Input
                            id="meal-description"
                            type="text"
                            placeholder="What did you eat?"
                            value={mealDescription}
                            onChange={(event) => setMealDescription(event.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                resetMealForm();
                                setIsMealModalOpen(false);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSaveMeal}
                            disabled={mealDescription.trim() === ""}
                        >
                            {editingMealId !== null ? "Save Changes" : "Add Meal"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
}

export default MealsCard;