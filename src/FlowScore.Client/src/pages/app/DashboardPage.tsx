import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import FlowScoreTriangle from "../../components/flowscore/FlowScoreTriangle";
import ScoreProgressBar from "../../components/flowscore/ScoreProgressBar";
import ScoreSummaryCard from "../../components/flowscore/ScoreSummaryCard";
import Badge from "../../components/ui/Badge";
import QuickStat from "../../components/flowscore/QuickStat";
import FlowScoreHistoryCard from "../../components/flowscore/FlowScoreHistoryCard";

function DashboardPage(){
    
    const scoreEntries = [
        {
            label: "Recovery",
            value: 82,
            description: "Sleep and recovery readiness.",
        },
        {
            label: "Nutrition",
            value: 75,
            description: "Fuel quality and daily consistency.",
        },
        {
            label: "Training",
            value: 91,
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

    const strongestArea = scoreEntries.reduce((highest, current) =>
        current.value > highest.value ? current : highest
    );

    const weakestArea = scoreEntries.reduce((lowest, current) =>
        current.value < lowest.value ? current : lowest
    );

    const quickStats = [
        {
            label: "FlowScore",
            value: Math.round((recovery + nutrition + training) / 3),
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
            value: "Good",
        },
    ];

    const historyData = [
        { day: "Mon", score: 72 },
        { day: "Tue", score: 76 },
        { day: "Wed", score: 70 },
        { day: "Thu", score: 81 },
        { day: "Fri", score: 84 },
        { day: "Sat", score: 78 },
        { day: "Sun", score: 83 },
    ];

    const formattedDate = new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "numeric",
    }).format(new Date());

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
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
                    />
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