import {
    createBooking,
} from '@/mocks/repositories';

import {
    loadBookingQueue,
    saveBookingQueue,
} from './bookingQueueStorage';

import type {
    BookingQueueItem,
} from './sync.types';

function isRetryableError(
    error: unknown,
): boolean {
    if (!(error instanceof Error)) {
        return true;
    }

    return ![
        'BOOKING_CONFLICT',
        'SLOT_EXPIRED',
        'SLOT_UNAVAILABLE',
        'DOCTOR_NOT_FOUND',
        'SLOT_NOT_FOUND',
    ].includes(error.message);
}

export type BookingSyncResult = {
    synced: number;
    failed: number;
    conflicts: number;
};

export async function syncBookingQueue(): Promise<BookingSyncResult> {
    const queue = loadBookingQueue();

    if (queue.length === 0) {
        return { synced: 0, failed: 0, conflicts: 0 };
    }

    let synced = 0;
    let failed = 0;
    let conflicts = 0;
    const updatedQueue: BookingQueueItem[] = [];

    for (const item of queue) {
        if (item.status === 'conflict') {
            updatedQueue.push(item);
            conflicts += 1;
            continue;
        }

        const syncingItem: BookingQueueItem = {
            ...item,
            status: 'syncing',
            updatedAt: new Date().toISOString(),
        };

        try {
            await createBooking(
                syncingItem.request,
            );

            // Successfully synchronized:
            // Do not keep it in the pending queue.
            synced += 1;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unknown sync error';

            if (!isRetryableError(error)) {
                updatedQueue.push({
                    ...syncingItem,
                    status: 'conflict',
                    lastError: message,
                    updatedAt: new Date().toISOString(),
                });
                conflicts += 1;

                continue;
            }

            updatedQueue.push({
                ...syncingItem,
                status: 'failed',
                retryCount: syncingItem.retryCount + 1,
                lastError: message,
                updatedAt: new Date().toISOString(),
            });
            failed += 1;
        }
    }

    saveBookingQueue(updatedQueue);

    return {
        synced,
        failed,
        conflicts,
    };
}

