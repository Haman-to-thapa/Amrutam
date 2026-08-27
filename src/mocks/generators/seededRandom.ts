export function createSeededRandom(seed: number) {
    let state = seed >>> 0;

    function next(): number {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    }

    function integer(min: number, max: number): number {
        return Math.floor(next() * (max - min + 1)) + min;
    }

    function pick<T>(items: readonly T[]): T {
        return items[integer(0, items.length - 1)];
    }

    function boolean(probability = 0.5): boolean {
        return next() < probability;
    }

    return {
        next,
        integer,
        pick,
        boolean,
    };
}