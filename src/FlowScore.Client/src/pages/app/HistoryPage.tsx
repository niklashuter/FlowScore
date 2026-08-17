import { useEffect, useState } from "react";
import PageTitle from "../../components/ui/PageTitle";
import PeriodSelector, {
    type HistoryPeriod,
} from "../../components/history/PeriodSelector";
import PerformanceSummary from "../../components/history/PerformanceSummary";
import FlowScoreHistoryCard from "../../components/flowscore/FlowScoreHistoryCard";
import {
    getHistory,
    type HistoryDayResponse,
} from "../../api/historyApi";
import HistoryDayCard from "../../components/history/HistoryDayCard";

function HistoryPage() {

    const [selectedPeriod, setSelectedPeriod] =
        useState<HistoryPeriod>(7);

    const [history, setHistory] =
        useState<HistoryDayResponse[]>([]);

    const [, setIsLoading] =
        useState(true);

    const [, setError] =
        useState("");

    useEffect(() => {

        async function loadHistory() {
            setIsLoading(true);
            setError("");

            try {
                const result =
                    await getHistory(selectedPeriod);

                setHistory(result);
            } catch {
                setError(
                    "Unable to load history."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadHistory();

    }, [selectedPeriod]);

    const chartData = [...history]
        .reverse()
        .map((day) => ({
            day: new Intl.DateTimeFormat("en", {
                day: "2-digit",
                month: "short",
            }).format(new Date(day.date)),
            score: day.flowScore,
        }));

    return (
        <div className="space-y-6">
            <PageTitle
                title="History"
                description="Review your long-term performance."
            />
            
            <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
            />

            <PerformanceSummary
                history={history}
            />

            <FlowScoreHistoryCard data={chartData} />

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-text-main">
                        Past Days
                    </h2>

                    <p className="mt-2 text-sm text-text-muted">
                        Review your scores from previous days.
                    </p>
                </div>

                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
                            <p className="text-sm text-text-muted">
                                No previous days are available yet.
                            </p>
                        </div>
                    ) : (
                        history.map((day) => (
                            <HistoryDayCard
                                key={day.date}
                                day={day}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default HistoryPage;