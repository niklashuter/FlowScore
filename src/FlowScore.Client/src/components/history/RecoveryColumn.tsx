import type { HistoryRecovery } from "../../api/historyApi";
import { getScoreColor } from "../../utils/scoreColor";

type RecoveryColumnProps = {
    recovery: HistoryRecovery | null;
    score: number;
};

export default function RecoveryColumn({
    recovery,
    score,
}: RecoveryColumnProps) {
    const scoreColor = getScoreColor(score);

    return (
        <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
            <h3 className="border-b border-border pb-3 text-lg font-semibold text-text-primary">
                Recovery
            </h3>

            <div className="mt-5 flex-1">
                {recovery ? (
                    <>
                        <InfoRow
                            label="Duration"
                            value={`${recovery.sleepDurationHours} h`}
                        />

                        <InfoRow
                            label="Quality"
                            value={recovery.sleepQuality}
                        />

                        <InfoRow
                            label="Feeling"
                            value={recovery.morningFeeling}
                        />
                    </>
                ) : (
                    <p className="text-sm text-text-muted">
                        No recovery data available.
                    </p>
                )}
            </div>

            <div className="border-t border-border pt-4">
                <InfoRow
                    label="Score"
                    value={score.toString()}
                    valueClassName={scoreColor.text}
                />
            </div>
        </div>
    );
}

type InfoRowProps = {
    label: string;
    value: string;
    valueClassName?: string;
};

function InfoRow({
    label,
    value,
    valueClassName,
}: InfoRowProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="font-medium text-text-primary">
                {label}
            </span>

            <span
                className={`font-medium text-text-muted ${
                    valueClassName ?? ""
                }`}
            >
                {value}
            </span>
        </div>
    );
}