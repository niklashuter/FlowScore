import FlowScoreTriangle from "../flowscore/FlowScoreTriangle";
import type { HistoryDayDetailsResponse } from "../../api/historyApi";
import NutritionColumn from "./NutritionColumn";
import RecoveryColumn from "./RecoveryColumn";
import TrainingColumn from "./TrainingColumn";

type HistoryDetailGridProps = {
    details: HistoryDayDetailsResponse;
};

export default function HistoryDetailGrid({
    details,
}: HistoryDetailGridProps) {
    return (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr_0.8fr_2fr]">
            <RecoveryColumn
                recovery={details.recovery}
                score={details.recoveryScore}
            />

            <NutritionColumn
                meals={details.meals}
                score={details.nutritionScore}
            />

            <TrainingColumn
                trainingSessions={details.trainingSessions}
                isRestDay={details.isRestDay}
                score={details.trainingScore}
            />

            <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
                <h3 className="border-b border-border pb-3 text-lg font-semibold text-text-primary">
                    FlowScore
                </h3>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-[500px]">
                        <FlowScoreTriangle
                            recovery={details.recoveryScore}
                            nutrition={details.nutritionScore}
                            training={details.trainingScore}
                            flowScore={details.flowScore}
                            showContainer={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}