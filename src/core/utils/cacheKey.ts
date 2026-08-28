export function createCacheKey(
    value: unknown,
): string {
    return JSON.stringify(value);
}
