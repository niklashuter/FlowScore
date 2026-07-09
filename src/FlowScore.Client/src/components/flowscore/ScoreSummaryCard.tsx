type ScoreSummaryCardProps = {
    label: string;
    value: number;
    description: string;
};

function ScoreSummaryCard({
    label,
    value,
    description,
}: ScoreSummaryCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold text-text-main">
                {value}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {description}
            </p>
        </div>
    );
}

export default ScoreSummaryCard;