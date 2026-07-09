type ScoreProgressBarProps = {
    label: string;
    value: number;
};

function getProgressColorClass(value: number) {
    if (value < 60) {
        return "bg-red-500";
    }

    if (value < 70) {
        return "bg-orange-500";
    }

    if (value < 80) {
        return "bg-lime-400";
    }

    return "bg-green-500";
}

function ScoreProgressBar({
    label,
    value,
}: ScoreProgressBarProps) {
    const colorClass = getProgressColorClass(value);

    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-text-muted">{label}</span>
                <span className="font-medium text-text-main">{value}</span>
            </div>

            <div className="h-2 rounded-full bg-surface-light">
                <div
                    className={`h-2 rounded-full ${colorClass}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

export default ScoreProgressBar;