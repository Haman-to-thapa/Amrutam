import {
    mockConfig,
    type MockFailureMode,
} from '@/mocks/config/mockConfig';

import type { PaginatedResult } from './pagination';

export function applyResponseMode<T>(
    response: PaginatedResult<T>,
): PaginatedResult<T> {
    const mode: MockFailureMode = mockConfig.failureMode;

    if (mode === 'empty_response') {
        return {
            ...response,
            data: [],
            hasNextPage: false,
        };
    }

    if (mode === 'partial_response') {
        const partialData = response.data.slice(
            0,
            Math.max(1, Math.ceil(response.data.length / 2)),
        );

        return {
            ...response,
            data: partialData,
        };
    }

    return response;
}