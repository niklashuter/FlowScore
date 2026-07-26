export function getScoreColor(score: number) {
    if (score < 60) {
        return {
            fill: "fill-red-500/55",
            text: "text-red-500",
        };
    }

    if (score < 70) {
        return {
            fill: "fill-orange-500/55",
            text: "text-orange-500",
        };
    }

    if (score < 80) {
        return {
            fill: "fill-lime-400/55",
            text: "text-lime-400",
        };
    }

    return {
        fill: "fill-green-600/55",
        text: "text-green-600",
    };
}