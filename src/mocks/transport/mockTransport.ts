import {
    type MockRequest,
    type MockResponse,
} from './mock.types';
import { mockConfig } from '@/mocks/config/mockConfig';
import { wait } from './mockDelay';

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shouldFail(): boolean {
    if (mockConfig.failureRate <= 0) {
        return false;
    }

    return Math.random() < mockConfig.failureRate;
}

export async function mockTransport<T>(
    request: MockRequest,
    handler: () => T | Promise<T>,
): Promise<MockResponse<T>> {
    const latency = randomBetween(
        mockConfig.latencyMs.min,
        mockConfig.latencyMs.max,
    );

    await wait(latency);

    if (shouldFail()) {
        throw new Error('MOCK_RANDOM_FAILURE');
    }

    const data = await handler();

    return {
        status: 200,
        data,
    };
}