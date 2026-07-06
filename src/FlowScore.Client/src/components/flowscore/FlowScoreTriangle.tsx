import TriangleSegment from "./TriangleSegment";
import FlowScoreCenter from "./FlowScoreCenter";

type FlowScoreTriangleProps = {
    recovery: number;
    nutrition: number;
    training: number;
};

type Point = {
    x: number;
    y: number;
};

function formatPoints(...points: Point[]) {
    return points.map((point) => `${point.x}, ${point.y}`).join(" ");
}

function FlowScoreTriangle({
    recovery,
    nutrition,
    training,
}: FlowScoreTriangleProps) {
    const flowScore = Math.round((recovery + nutrition + training) / 3);

    const triangleTopY = 30;
    const triangleMiddleY = 145;
    const triangleBottomY = 255;

    const centerX = 160;

    const halfTopWidth = 65;
    const halfBottomWidth = 130;

    const top: Point = {
        x: centerX,
        y: triangleTopY,
    };

    const centerLeft: Point = {
        x: centerX - halfTopWidth,
        y: triangleMiddleY,
    };

    const centerRight: Point = {
        x: centerX + halfTopWidth,
        y: triangleMiddleY,
    };

    const bottomLeft: Point = {
    x: centerX - halfBottomWidth,
    y: triangleBottomY,
    };

    const bottomRight: Point = {
        x: centerX + halfBottomWidth,
        y: triangleBottomY,
    };

    const bottomCenter: Point = {
        x: centerX,
        y: triangleBottomY,
    };

    // Text positions
    const recoveryValuePosition: Point = {
        x: top.x,
        y: top.y + 75,
    };

    const recoveryTitlePosition: Point = {
        x: top.x,
        y: top.y + 90,
    };

    const nutritionValuePosition: Point = {
        x: centerLeft.x,
        y: centerLeft.y + 70,
    };

    const nutritionTitlePosition: Point = {
        x: centerLeft.x,
        y: centerLeft.y + 85,
    };

    const trainingValuePosition: Point = {
        x: centerRight.x,
        y: centerRight.y + 70,
    };

    const trainingTitlePosition: Point = {
        x: centerRight.x,
        y: centerRight.y + 85,
    };

    const flowScoreLabelPosition: Point = {
    x: bottomCenter.x,
    y: centerLeft.y + 20,
    };

    const flowScoreValuePosition: Point = {
        x: bottomCenter.x,
        y: centerLeft.y + 55,
    };
    return(
        <div className="rounded-2xl border border-border bg-surface p-6">
            <svg
                viewBox="0 0 320 280"
                className="h-96 w-full"
                role="img"
                aria-label="FlowScore balance triangle"
            >

                {/* Recovery triangle */}
                <TriangleSegment
                    points={formatPoints(top, centerLeft, centerRight)}
                    title="Recovery"
                    value={recovery}
                    titlePosition={recoveryTitlePosition}
                    valuePosition={recoveryValuePosition}
                    score={recovery}
                />


                {/* Nutrition triangle */}
                <TriangleSegment
                    points={formatPoints(centerLeft, bottomLeft, bottomCenter)}
                    title="Nutrition"
                    value={nutrition}
                    titlePosition={nutritionTitlePosition}
                    valuePosition={nutritionValuePosition}
                    score={nutrition}
                />

                {/* Training triangle */}
                <TriangleSegment
                    points={formatPoints(centerRight, bottomCenter, bottomRight)}
                    title="Training"
                    value={training}
                    titlePosition={trainingTitlePosition}
                    valuePosition={trainingValuePosition}
                    score={training}
                />

                {/* FlowScore triangle */}
                <FlowScoreCenter
                    points={formatPoints(centerLeft, centerRight, bottomCenter)}
                    score={flowScore}
                    labelPosition={flowScoreLabelPosition}
                    scorePosition={flowScoreValuePosition}
                />
            </svg>
        </div>
    );
}

export default FlowScoreTriangle;