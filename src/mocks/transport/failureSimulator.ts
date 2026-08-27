import { mockConfig, type MockFailureMode } from '@/mocks/config/mockConfig';

import {
    MockInvalidJsonError,
    MockRandomFailureError,
    MockSessionExpiredError,
} from './mockErrors';


export function getFailureMode(): MockFailureMode {
    if (!mockConfig.enabled) {
        return 'none';
    }

    if (mockConfig.failureMode !== 'none') {
        return mockConfig.failureMode;
    }

    if (
        mockConfig.failureRate > 0 &&
        Math.random() < mockConfig.failureRate
    ) {
        return 'random_failure';
    }

    return 'none';
}

export async function simulateFailure(
    mode: MockFailureMode,
): Promise<void> {
    switch (mode) {
        case 'timeout':
            await new Promise(() => { });
            return;

        case 'random_failure':
            throw new MockRandomFailureError();

        case 'session_expired':
            throw new MockSessionExpiredError();

        case 'invalid_json':
            throw new MockInvalidJsonError();

        case 'empty_response':
        case 'partial_response':
        case 'none':
            return;
    }
}