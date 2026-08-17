import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import FlowScoreTriangle from "../../components/flowscore/FlowScoreTriangle";
import ScoreProgressBar from "../../components/flowscore/ScoreProgressBar";
import ScoreSummaryCard from "../../components/flowscore/ScoreSummaryCard";
import Badge from "../../components/ui/Badge";
import QuickStat from "../../components/flowscore/QuickStat";
import FlowScoreHistoryCard from "../../components/flowscore/FlowScoreHistoryCard";
import FlowScoreExplanation from "../../components/flowscore/FlowScoreExplanation";
import { useEffect, useState } from "react";
import {
    getFlowScore,
    type FlowScoreResult,
} from "../../api/flowScoreApi";
import {
    getHistory,
    type HistoryDayResponse,
} from "../../api/historyApi";

function DashboardPage(){
    const [scores, setScores] =
        useState<FlowScoreResult | null>(null);

    const [, setIsLoading] = useState(true);

    const [, setError] = useState("");

    const [history, setHistory] =
    useState<HistoryDayResponse[]>([]);

    useEffect(() => {
        async function loadFlowScore() {
            setIsLoading(true);
            setError("");

            try {
                const loadedScores =
                    await getFlowScore();

                setScores(loadedScores);

                const loadedHistory =
                    await getHistory(7);

                setHistory(loadedHistory);
            } catch (error) {
                console.error(
                    "Failed to load dashboard FlowScore:",
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
    }, []);
    
    const scoreEntries = [
        {
            label: "Recovery",
            value: scores?.recoveryScore ?? 0,
            description: "Sleep and recovery readiness.",
        },
        {
            label: "Nutrition",
            value: scores?.nutritionScore ?? 0,
            description: "Fuel quality and daily consistency.",
        },
        {
            label: "Training",
            value: scores?.trainingScore ?? 0,
            description: "Movement, intensity and activity level.",
        },
    ];

    const recovery = scoreEntries.find(
        (score) => score.label === "Recovery"
    )!.value;

    const nutrition = scoreEntries.find(
        (score) => score.label === "Nutrition"
    )!.value;

    const training = scoreEntries.find(
        (score) => score.label === "Training"
    )!.value;

    const flowScore = scores?.flowScore ?? 0;

    const strongestArea = scoreEntries.reduce((highest, current) =>
        current.value > highest.value ? current : highest
    );

    const weakestArea = scoreEntries.reduce((lowest, current) =>
        current.value < lowest.value ? current : lowest
    );

    const quickStats = [
        {
            label: "FlowScore",
            value: flowScore,
        },
        {
            label: "Best Area",
            value: strongestArea.label,
        },
        {
            label: "Needs Focus",
            value: weakestArea.label,
        },
        {
            label: "Balance",
            value: scores?.balanceValue ?? "-",
        },
    ];

    const formattedDate = new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "numeric",
    }).format(new Date());

    const historyData = [...history]
        .reverse()
        .map((day) => ({
            day: new Intl.DateTimeFormat("en", {
                weekday: "short",
            }).format(new Date(day.date)),
            score: day.flowScore,
        }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
                <PageTitle
                    title="Dashboard"
                    description="Your daily performance overview."
                />

                <Badge>{formattedDate}</Badge>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <Card>
                    <FlowScoreTriangle
                        recovery={recovery}
                        nutrition={nutrition}
                        training={training}
                        flowScore={flowScore}
                    />

                    <FlowScoreExplanation />
                </Card> 

                <Card>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-text-main">
                                Todays Focus
                            </h2>

                            <p className="mt-2 leading-relaxed text-text-muted">
                                <>
                                    Your strongest area today is{" "}
                                    <span className="font-medium text-text-main">
                                        {strongestArea.label}
                                    </span>.
                                    {" "}
                                    <span className="font-medium text-text-main">
                                        {weakestArea.label}
                                    </span>
                                    {" "}has the biggest opportunity for improvement.
                                </>
                            </p>
                        </div>

                        <div className="space-y-5">
                            {scoreEntries.map((score) => (
                                <ScoreProgressBar
                                    key={score.label}
                                    label={score.label}
                                    value={score.value}
                                />
                            ))}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-text-main">
                                Today's Stats
                            </h3>

                            {quickStats.map((stat) => (
                                <QuickStat
                                    key={stat.label}
                                    label={stat.label}
                                    value={stat.value}
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {scoreEntries.map((card) => (
                    <ScoreSummaryCard
                        key={card.label}
                        label={card.label}
                        value={card.value}
                        description={card.description}
                    />
                ))}
            </div>
            <FlowScoreHistoryCard data={historyData} />
        </div>
    );
}

export default DashboardPage;