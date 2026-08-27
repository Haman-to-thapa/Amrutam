export type MockFailureMode =
    | 'none'
    | 'timeout'
    | 'random_failure'
    | 'empty_response'
    | 'partial_response'
    | 'invalid_json'
    | 'session_expired';

export const mockConfig = {
    enabled: __DEV__,

    latencyMs: {
        min: 200,
        max: 600,
    },

    failureRate: 0.15,

    failureMode: 'none' as MockFailureMode,
} as const;