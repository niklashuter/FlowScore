import type { HistoryMeal } from "../../api/historyApi";
import { getScoreColor } from "../../utils/scoreColor";

type NutritionColumnProps = {
    meals: HistoryMeal[];
    score: number;
};

export default function NutritionColumn({
    meals,
    score,
}: NutritionColumnProps) {
    const scoreColor = getScoreColor(score);

    return (
        <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
            <h3 className="border-b border-border pb-3 text-lg font-semibold text-text-primary">
                Nutrition
            </h3>

            <div className="mt-5 flex-1">
                {meals.length > 0 ? (
                    <div className="space-y-4">
                        {meals.map((meal) => (
                            <MealEntry
                                key={meal.id}
                                meal={meal}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-muted">
                        No meals recorded.
                    </p>
                )}
            </div>

            <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">
                        Score
                    </span>

                    <span
                        className={`font-semibold ${scoreColor.text}`}
                    >
                        {score}
                    </span>
                </div>
            </div>
        </div>
    );
}

type MealEntryProps = {
    meal: HistoryMeal;
};

function MealEntry({
    meal,
}: MealEntryProps) {
    const mealScoreColor =
        meal.nutritionScore !== null
            ? getScoreColor(meal.nutritionScore)
            : null;

    return (
        <div className="space-y-1">
            <div className="flex items-start justify-between gap-3">
                <span className="font-medium text-text-primary">
                    {meal.type}
                </span>

                <span className="shrink-0 text-sm text-text-muted">
                    {formatTime(meal.time)}
                </span>
            </div>

            <p className="text-sm text-text-muted">
                {meal.description}
            </p>

            <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                    Meal score
                </span>

                {meal.nutritionScore !== null ? (
                    <span
                        className={`text-sm font-semibold ${
                            mealScoreColor?.text ?? ""
                        }`}
                    >
                        {meal.nutritionScore}
                    </span>
                ) : (
                    <span className="text-sm text-text-muted">
                        Pending
                    </span>
                )}
            </div>
        </div>
    );
}

function formatTime(time: string) {
    return time.slice(0, 5);
}