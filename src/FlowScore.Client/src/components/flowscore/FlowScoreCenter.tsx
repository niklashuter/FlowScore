type Point = {
    x: number;
    y: number;
};

type FlowScoreCenterProps = {
    points: string;
    score: number;
    labelPosition: Point;
    scorePosition: Point;
};

function getScoreFillClass(score: number) {
    if (score < 60) {
        return "fill-red-500/75";
    }

    if (score < 70) {
        return "fill-orange-500/75";
    }

    if (score < 80) {
        return "fill-lime-400/75";
    }

    return "fill-green-600/75";
}

function FlowScoreCenter({
    points,
    score,
    labelPosition,
    scorePosition,
}: FlowScoreCenterProps) {

    const fillClass = getScoreFillClass(score);
    const segmentDividerColor = "#0f172a";

    return (
        <>
            <polygon
                points={points}
                className={fillClass}
                stroke={segmentDividerColor}
                strokeWidth="4"
                strokeLinejoin="round"
            />

            <text
                x={scorePosition.x}
                y={scorePosition.y}
                textAnchor="middle"
                className="fill-white text-4xl font-bold"
            >
                {score}
            </text>

            <text
                x={labelPosition.x}
                y={labelPosition.y}
                textAnchor="middle"
                className="fill-white/80 text-xs"
            >
                FlowScore
            </text>
        </>
    );
}

export default FlowScoreCenter;