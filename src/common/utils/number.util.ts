export function parseRuNumber(value: unknown): number | null {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }
    if (typeof value !== "string") {
        return null;
    }

    const cleaned = value.replace(/\s+/g, "").replace(",", ".").trim();
    if (cleaned.length === 0) {
        return null;
    }

    const number = Number(cleaned);
    return Number.isFinite(number) ? number : null;
}

