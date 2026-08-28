type PerformanceMetadata = Record<string, unknown>;

export type PerformanceTimer = {
    end: (
        metadata?: PerformanceMetadata,
    ) => void;
};

function now(): number {
    const perf = (globalThis as unknown as { performance?: { now?: () => number } }).performance;
    return typeof perf?.now === 'function'
        ? perf.now()
        : Date.now();
}

export const performanceMonitor = {
    start(
        name: string,
        metadata?: PerformanceMetadata,
    ): PerformanceTimer {
        const startedAt = now();

        if (__DEV__) {
            console.debug(
                `[PERF] START ${name}`,
                metadata ?? '',
            );
        }

        return {
            end(endMetadata) {
                const duration = now() - startedAt;

                if (__DEV__) {
                    console.debug(
                        `[PERF] END ${name}: ${duration.toFixed(
                            1,
                        )}ms`,
                        {
                            ...metadata,
                            ...endMetadata,
                        },
                    );
                }
            },
        };
    },
};
