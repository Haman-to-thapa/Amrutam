import type { MockFailureMode } from '@/mocks/config/mockConfig';

export function simulateCollectionResponse<T>(
    data: T[],
    mode: MockFailureMode,
): T[] {
    switch (mode) {
        case 'empty_response':
            return [];

        case 'partial_response':
            return data.slice(
                0,
                Math.max(1, Math.floor(data.length / 2)),
            );

        default:
            return data;
    }
}