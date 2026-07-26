import { getScoreColor } from "../../utils/scoreColor";

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

function TriangleSegment({
    points,
    title,
    value,
    titlePosition,
    valuePosition,
    score,
}: TriangleSegmentProps) {
    const scoreColor = getScoreColor(score);
    const segmentDividerColor = "#0f172a";

    return (
        <>
            <polygon
                points={points}
                className={scoreColor.fill}
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