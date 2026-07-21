import PageTitle from "../../components/ui/PageTitle";
import MorningCheckInCard from "../../components/today/MorningCheckInCard";
import MealsCard from "../../components/today/MealsCard";
import TrainingCard from "../../components/today/TrainingCard";
import TodayFlowScoreCard from "../../components/today/TodayFlowScoreCard";
import { useEffect, useState } from "react";
import { getTodayDateString } from "../../utils/date";

function TodayPage(){
    const [flowScoreRefreshKey, setFlowScoreRefreshKey] =
        useState(0);

    const [today, setToday] = useState(
        getTodayDateString()
    );

    function refreshFlowScore() {
        setFlowScoreRefreshKey(
            (currentKey) => currentKey + 1
        );
    }

    useEffect(() => {
        const now = new Date();

        const nextMidnight = new Date(now);

        nextMidnight.setHours(24, 0, 0, 0);

        const millisecondsUntilMidnight =
            nextMidnight.getTime() - now.getTime();

        const timeout = window.setTimeout(() => {
            console.log("Day changed");
            setToday(getTodayDateString());
        }, millisecondsUntilMidnight);

        return () => window.clearTimeout(timeout);
    }, [today]);

    return (
        <div className="space-y-6">
            <PageTitle
                title="Today"
                description="Track today's recovery, nutrition and training."
            />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <div className="space-y-6">
                    <MorningCheckInCard
                        today={today}
                        onRecoveryChanged={refreshFlowScore}
                    />
                    <MealsCard
                        today={today}
                        onMealsChanged={refreshFlowScore}
                    />
                    <TrainingCard
                        today={today}
                        onTrainingChanged={refreshFlowScore}
                    />
                </div>

                <TodayFlowScoreCard
                    today={today}
                    refreshKey={flowScoreRefreshKey}
                />
            </div>
        </div>
    );
}

export default TodayPage;