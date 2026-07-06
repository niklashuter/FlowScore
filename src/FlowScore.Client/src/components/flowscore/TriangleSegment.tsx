type Point = {
    x: number;
    y: number;
};

type TriangleSegmentProps = {
    points: string;
    title: string;
    value: number;
    titlePosition: Point;
    valuePosition: Point;
    score: number;
};

function getSegmentFillClass(score: number) {
    if (score < 60) {
        return "fill-red-500/55";
    }

    if (score < 70) {
        return "fill-orange-500/55";
    }

    if (score < 80) {
        return "fill-lime-400/55";
    }

    return "fill-green-600/55";
}

function TriangleSegment({
    points,
    title,
    value,
    titlePosition,
    valuePosition,
    score,
}: TriangleSegmentProps) {
    const fillClass = getSegmentFillClass(score);
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
                x={valuePosition.x}
                y={valuePosition.y}
                textAnchor="middle"
                className="fill-white text-2xl font-bold"
            >
                {value}
            </text>

            <text
                x={titlePosition.x}
                y={titlePosition.y}
                textAnchor="middle"
                className="fill-white/80 text-xs"
            >
                {title}
            </text> 
        </>
    );
} 

export default TriangleSegment;