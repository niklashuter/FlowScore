import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { HistoryDayResponse } from "../../api/historyApi";
import { getScoreColor } from "../../utils/scoreColor";
import Card from "../ui/Card";
import FlowScoreTriangle from "../flowscore/FlowScoreTriangle";
import HistoryDetailGrid from "./HistoryDetailGrid";
import {
    getHistoryDayDetails,
    type HistoryDayDetailsResponse,
} from "../../api/historyApi";

type HistoryDayCardProps = {
    day: HistoryDayResponse;
};

function HistoryDayCard({
    day,
}: HistoryDayCardProps) {
    const [isExpanded, setIsExpanded] =
        useState(false);

    const formattedDate =
        new Intl.DateTimeFormat("en", {
            weekday: "long",
            month: "long",
            day: "numeric",
        }).format(new Date(day.date));

    const [details, setDetails] =
        useState<HistoryDayDetailsResponse | null>(null);

    const [loadingDetails, setLoadingDetails] =
        useState(false);

    const [detailsError, setDetailsError] =
        useState<string | null>(null);

    async function handleToggle() {
        if (!isExpanded && details === null) {
            setLoadingDetails(true);
            setDetailsError(null);

            try {
                const result = await getHistoryDayDetails(day.date);

                setDetails(result);
            } catch (error) {
                setDetailsError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load history details."
                );
            } finally {
                setLoadingDetails(false);
            }
        }

        setIsExpanded((currentValue) => !currentValue);
    }

    return (
        <div className="rounded-2xl border border-border bg-surface">
            <button
                type="button"
                onClick={handleToggle}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-surface-light"
            >
                <div>
                    <h3 className="font-semibold text-text-main">
                        {formattedDate}
                    </h3>

                    <p className="mt-1 text-sm text-text-muted">
                        FlowScore{" "}
                        <span
                            className={`font-semibold ${getScoreColor(
                                day.flowScore
                            ).text}`}
                        >
                            {day.flowScore}
                        </span>
                    </p>
                </div>

                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-text-muted" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-text-muted" />
                )}
            </button>
            {isExpanded && (
                <div className="border-t border-border p-6">
                    {loadingDetails && (
                        <p className="text-sm text-text-muted">
                            Loading details...
                        </p>
                    )}

                    {detailsError && (
                        <p className="text-sm text-red-400">
                            {detailsError}
                        </p>
                    )}

                    {!loadingDetails && !detailsError && details && (
                        <HistoryDetailGrid details={details} />
                    )}
                </div>
            )}
        </div>
    );
}

export default HistoryDayCard;