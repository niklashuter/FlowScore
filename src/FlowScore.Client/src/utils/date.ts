export function getTodayDateString(): string {
    const currentDate = new Date();

    return [
        currentDate.getFullYear(),
        String(currentDate.getMonth() + 1).padStart(2, "0"),
        String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");
}