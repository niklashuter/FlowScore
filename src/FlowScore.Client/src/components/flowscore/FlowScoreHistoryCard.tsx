type HistoryPoint = {
    day: string;
    score: number;
};

type FlowScoreHistoryCardProps = {
    data: HistoryPoint[];
}

const chartWidth = 560;
const chartHeight = 230;
const padding = 24;

function getYPosition(score: number) {
    const maxScore = 100;
    const minScore = 0;

    return (
        padding +
        ((maxScore - score) / (maxScore - minScore)) *
            (chartHeight - padding * 2)
    );
}

function calculateChartPoints(data: HistoryPoint[]) {
    return data.map((point, index) => {
        const x =
            padding +
            (index / (data.length - 1)) * (chartWidth - padding * 2);

        const y = getYPosition(point.score);

        return {
            ...point,
            x,
            y,
        };
    });
}

function FlowScoreHistoryCard({ data }: FlowScoreHistoryCardProps) {
    const chartPoints = calculateChartPoints(data);
    const polylinePoints = chartPoints
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

    const areaPoints = [
        `${chartPoints[0].x},${chartHeight - padding}`,
        ...chartPoints.map((point) => `${point.x},${point.y}`),
        `${chartPoints[chartPoints.length - 1].x},${chartHeight - padding}`,
    ].join(" ");

    const gridLines = [100, 80, 60, 40];
    const targetScore = 70;

    return (
        <div className="rounded-2xl border border-border bg-surface p-6">
            <div>
                <h2 className="text-xl font-semibold text-text-main">
                    FlowScore History
                </h2>

                <p className="mt-2 text-sm text-text-muted">
                    Your FlowScore trend over the last seven days.
                </p>

                <div className="mt-6">
                    <svg
                        viewBox="0 0 620 230"
                        className="h-72 w-full"
                        role="img"
                        aria-label="FlowScore trend over the last seven days"
                    >
                        {gridLines.map((score) => (
                            <g key={score}>
                                <line
                                    x1={padding}
                                    y1={getYPosition(score)}
                                    x2={chartWidth - padding}
                                    y2={getYPosition(score)}
                                    className="stroke-surface-light"
                                    strokeWidth="1"
                                />

                                <text
                                    x={0}
                                    y={getYPosition(score) + 4}
                                    className="fill-text-muted text-[10px]"
                                >
                                    {score}
                                </text>
                            </g>
                        ))}

                        <line
                            x1={padding}
                            y1={getYPosition(targetScore)}
                            x2={chartWidth - padding}
                            y2={getYPosition(targetScore)}
                            className="stroke-lime-400"
                            strokeWidth="2.5"
                            strokeDasharray="8 6"
                        />

                        <text
                            x={chartWidth - 18}
                            y={getYPosition(targetScore) + 4}
                            textAnchor="start"
                            className="fill-lime-400 text-xs font-semibold"
                        >
                            Target 70
                        </text>

                        <polygon
                            points={areaPoints}
                            className="fill-primary/10"
                        />

                        <polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {chartPoints.map((point) => (
                            <g key={point.day}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="3.5"
                                    className="fill-primary"
                                />

                                <text
                                    x={point.x}
                                    y={point.y - 10}
                                    textAnchor="middle"
                                    className="fill-white text-xs font-semibold"
                                >
                                    {point.score}
                                </text>

                                <text
                                    x={point.x}
                                    y={chartHeight - 6}
                                    textAnchor="middle"
                                    className="fill-text-muted text-xs"
                                >
                                    {point.day}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default FlowScoreHistoryCard;