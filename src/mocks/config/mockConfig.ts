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
        min: 50,
        max: 150,
    },

    failureRate: 0,

    failureMode: 'none' as MockFailureMode,
} as const;