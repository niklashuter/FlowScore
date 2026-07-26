export type HistoryPeriod = 7 | 30 | undefined;

type PeriodSelectorProps = {
    selectedPeriod: HistoryPeriod;
    onPeriodChange: (period: HistoryPeriod) => void;
};

const periods: {
    label: string;
    value: HistoryPeriod;
}[] = [
    {
        label: "7 Days",
        value: 7,
    },
    {
        label: "30 Days",
        value: 30,
    },
    {
        label: "All Time",
        value: undefined,
    },
];

function PeriodSelector({
    selectedPeriod,
    onPeriodChange,
}: PeriodSelectorProps) {
    return (
        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1">
            {periods.map((period) => {
                const isActive =
                    selectedPeriod === period.value;

                return (
                    <button
                        key={period.label}
                        type="button"
                        onClick={() =>
                            onPeriodChange(period.value)
                        }
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-cyan-500 text-slate-950"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        {period.label}
                    </button>
                );
            })}
        </div>
    );
}

export default PeriodSelector;