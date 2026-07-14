import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import { useState } from "react";
import Input from "../ui/Input";
import SelectField from "../ui/SelectField";
import CardActionButton from "../ui/CardActionButton";

function MealsCard() {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [mealType, setMealType] = useState("breakfast");
    const [mealTime, setMealTime] = useState("08:00");

    const [mealDescription, setMealDescription] = useState("");
    const [editingMealId, setEditingMealId] = useState<number | null>(null);

    const [meals, setMeals] = useState([
        {
            id: 1,
            type: "Breakfast",
            description: "Oats, yogurt and berries",
            time: "08:00",
        },
        {
            id: 2,
            type: "Lunch",
            description: "Chicken rice bowl",
            time: "12:30",
        },
    ]);

    const mealTypeOptions = [
        { label: "Breakfast", value: "breakfast" },
        { label: "Lunch", value: "lunch" },
        { label: "Dinner", value: "dinner" },
        { label: "Snack", value: "snack" },
    ];

    const mealTimeOptions = [
        { label: "06:00", value: "06:00" },
        { label: "06:30", value: "06:30" },
        { label: "07:00", value: "07:00" },
        { label: "07:30", value: "07:30" },
        { label: "08:00", value: "08:00" },
        { label: "08:30", value: "08:30" },
        { label: "09:00", value: "09:00" },
        { label: "09:30", value: "09:30" },
        { label: "10:00", value: "10:00" },
    ];

    function resetMealForm() {
        setMealType("breakfast");
        setMealTime("08:00");
        setMealDescription("");
        setEditingMealId(null);
    }

    function handleSaveMeal() {
        const selectedMealType = mealTypeOptions.find(
            (option) => option.value === mealType
        );

        if (!selectedMealType || mealDescription.trim() === "") {
            return;
        }

        if (editingMealId !== null) {
            setMeals((currentMeals) =>
                currentMeals
                    .map((meal) =>
                        meal.id === editingMealId
                            ? {
                                ...meal,
                                type: selectedMealType.label,
                                description: mealDescription.trim(),
                                time: mealTime,
                            }
                            : meal
                    )
                    .sort((firstMeal, secondMeal) =>
                        firstMeal.time.localeCompare(secondMeal.time)
                    )
            );
        } else {
            const newMeal = {
                id: Date.now(),
                type: selectedMealType.label,
                description: mealDescription.trim(),
                time: mealTime,
            };

            setMeals((currentMeals) =>
                [...currentMeals, newMeal].sort((firstMeal, secondMeal) =>
                    firstMeal.time.localeCompare(secondMeal.time)
                )
            );
        }

        resetMealForm();
        setIsMealModalOpen(false);
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
        setMealTime(mealToEdit.time);
        setMealDescription(mealToEdit.description);
        setEditingMealId(mealToEdit.id);
        setIsMealModalOpen(true);
    }

    function handleDeleteMeal(mealId: number) {
        setMeals((currentMeals) =>
            currentMeals.filter((meal) => meal.id !== mealId)
        );
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

                <div className="grid gap-3 sm:grid-cols-2">
                    {meals.map((meal) => (
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
                                            {meal.time}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm text-text-muted">
                                        {meal.description}
                                    </p>
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
                    ))}
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
                        onChange={setMealType}
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