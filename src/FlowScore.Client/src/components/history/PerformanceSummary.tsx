import type { HistoryDayResponse } from "../../api/historyApi";
import { getScoreColor } from "../../utils/scoreColor";

type PerformanceSummaryProps = {
    history: HistoryDayResponse[];
};

function calculateAverage(values: number[]) {

    if (values.length === 0) {
        return 0;
    }

    const total = values.reduce(
        (sum, value) => sum + value,
        0
    );

    return Math.round(total / values.length);
}

function SummaryCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    const scoreColor = getScoreColor(value);

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 sm:p-5">
            <p className="text-sm text-slate-400">
                {title}
            </p>

            <h2
                className={`mt-1 text-3xl font-bold sm:mt-2 ${scoreColor.text}`}
            >
                {value}
            </h2>

            <p className="text-xs text-slate-500 sm:mt-1">
                Average
            </p>
        </div>
    );
}

function PerformanceSummary({
    history,
}: PerformanceSummaryProps) {

    const flowScoreAverage = calculateAverage(
        history.map(day => day.flowScore)
    );

    const recoveryAverage = calculateAverage(
        history.map(day => day.recoveryScore)
    );

    const nutritionAverage = calculateAverage(
        history.map(day => day.nutritionScore)
    );

    const trainingAverage = calculateAverage(
        history.map(day => day.trainingScore)
    );

    return (

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <SummaryCard
                title="FlowScore"
                value={flowScoreAverage}
            />

            <SummaryCard
                title="Recovery"
                value={recoveryAverage}
            />

            <SummaryCard
                title="Nutrition"
                value={nutritionAverage}
            />

            <SummaryCard
                title="Training"
                value={trainingAverage}
            />
        </div>
    );
}

export default PerformanceSummary;