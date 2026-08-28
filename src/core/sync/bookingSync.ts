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

export async function syncBookingQueue(): Promise<void> {
    const queue = loadBookingQueue();

    if (queue.length === 0) {
        return;
    }

    const updatedQueue: BookingQueueItem[] = [];

    for (const item of queue) {
        if (item.status === 'conflict') {
            updatedQueue.push(item);
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

                continue;
            }

            updatedQueue.push({
                ...syncingItem,
                status: 'failed',
                retryCount: syncingItem.retryCount + 1,
                lastError: message,
                updatedAt: new Date().toISOString(),
            });
        }
    }

    saveBookingQueue(updatedQueue);
}
