type QuickStatProps = {
    label: string;
    value: string | number;
};

function QuickStat({
    label,
    value,
}: QuickStatProps) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-surface-light px-4 py-3">
            <span className="text-sm text-text-muted">
                {label}
            </span>

            <span className="text-lg font-bold text-text-main">
                {value}
            </span>
        </div>
    );
}

export default QuickStat;