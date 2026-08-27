import {
    type MockRequest,
    type MockResponse,
} from './mock.types';

import { mockConfig } from '@/mocks/config/mockConfig';
import { wait } from './mockDelay';
import {
    getFailureMode,
    simulateFailure,
} from './failureSimulator';

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function mockTransport<T>(
    request: MockRequest,
    handler: () => T | Promise<T>,
): Promise<MockResponse<T>> {
    if (!mockConfig.enabled) {
        return {
            status: 200,
            data: await handler(),
        };
    }

    const latency = randomBetween(
        mockConfig.latencyMs.min,
        mockConfig.latencyMs.max,
    );

    await wait(latency);

    const failureMode = getFailureMode();

    if (
        failureMode === 'timeout'
    ) {
        await wait(mockConfig.latencyMs.max * 5);

        throw new Error('MOCK_TIMEOUT');
    }


    await simulateFailure(failureMode);

    const data = await handler();

    return {
        status: 200,
        data,
    };
}