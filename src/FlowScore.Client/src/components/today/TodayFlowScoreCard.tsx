import FlowScoreTriangle from "../flowscore/FlowScoreTriangle";
import Card from "../ui/Card";

function TodayFlowScoreCard() {
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
                    recovery={82}
                    nutrition={75}
                    training={91}
                />
            </div>
        </Card>
    );
}

export default TodayFlowScoreCard;