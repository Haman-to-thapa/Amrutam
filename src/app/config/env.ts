const ENVIRONMENT = 'development';

export const env = {
    environment: ENVIRONMENT,
    apiBaseUrl: 'https://example.invalid/api',
    apiTimeoutMs: 10000,
} as const;