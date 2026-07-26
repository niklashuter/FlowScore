import type { HistoryTrainingSession } from "../../api/historyApi";
import { getScoreColor } from "../../utils/scoreColor";

type TrainingColumnProps = {
    trainingSessions: HistoryTrainingSession[];
    isRestDay: boolean;
    score: number;
};

export default function TrainingColumn({
    trainingSessions,
    isRestDay,
    score,
}: TrainingColumnProps) {
    const scoreColor = getScoreColor(score);

    return (
        <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
            <h3 className="border-b border-border pb-3 text-lg font-semibold text-text-primary">
                Training
            </h3>

            <div className="mt-5 flex-1">
                {isRestDay ? (
                    <p className="font-medium text-text-primary">
                        Rest day
                    </p>
                ) : trainingSessions.length > 0 ? (
                    <div className="space-y-4">
                        {trainingSessions.map((session) => (
                            <TrainingEntry
                                key={session.id}
                                session={session}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-muted">
                        No training recorded.
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

type TrainingEntryProps = {
    session: HistoryTrainingSession;
};

function TrainingEntry({
    session,
}: TrainingEntryProps) {
    const scoreColor = getScoreColor(session.score);

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">
                    {session.type}
                </span>

                <span className="text-sm text-text-muted">
                    {session.durationMinutes} min
                </span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                    {session.intensity}
                </span>

                <span
                    className={`text-sm font-semibold ${scoreColor.text}`}
                >
                    {session.score}
                </span>
            </div>
        </div>
    );
}