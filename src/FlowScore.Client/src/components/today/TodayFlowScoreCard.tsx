import FlowScoreTriangle from "../flowscore/FlowScoreTriangle";
import Card from "../ui/Card";
import { useEffect, useState } from "react";
import {
    getTodayFlowScore,
    type FlowScoreResult,
} from "../../api/flowScoreApi";

type TodayFlowScoreCardProps = {
    today: string;
    refreshKey: number;
};

function TodayFlowScoreCard({
    today,
    refreshKey,
}: TodayFlowScoreCardProps) {
    const [scores, setScores] =
        useState<FlowScoreResult | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFlowScore() {
            setIsLoading(true);
            setError("");

            try {
                const loadedScores =
                    await getTodayFlowScore();

                setScores(loadedScores);
            } catch (error) {
                console.error(
                    "Failed to load today's FlowScore:",
                    error
                );

                setError(
                    "Unable to load today's FlowScore."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadFlowScore();
    }, [refreshKey, today]);

    if (error) {
        return (
            <Card>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-text-main">
                        Today&apos;s FlowScore
                    </h2>

                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-text-main">
                        Today&apos;s FlowScore
                    </h2>

                    <p className="mt-2 text-sm text-text-muted">
                        Your score updates as recovery, nutrition and training data are added.
                    </p>
                </div>

                <FlowScoreTriangle
                    recovery={scores?.recoveryScore ?? 0}
                    nutrition={scores?.nutritionScore ?? 0}
                    training={scores?.trainingScore ?? 0}
                />
            </div>
        </Card>
    );
}

export default TodayFlowScoreCard;