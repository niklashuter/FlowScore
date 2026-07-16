import PageTitle from "../../components/ui/PageTitle";
import MorningCheckInCard from "../../components/today/MorningCheckInCard";
import MealsCard from "../../components/today/MealsCard";
import TrainingCard from "../../components/today/TrainingCard";
import TodayFlowScoreCard from "../../components/today/TodayFlowScoreCard";

function TodayPage(){
    return (
        <div className="space-y-6">
            <PageTitle
                title="Today"
                description="Track today's recovery, nutrition and training."
            />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <div className="space-y-6">
                    <MorningCheckInCard/>
                    <MealsCard />
                    <TrainingCard />
                </div>

                <TodayFlowScoreCard />
            </div>
        </div>
    );
}

export default TodayPage;