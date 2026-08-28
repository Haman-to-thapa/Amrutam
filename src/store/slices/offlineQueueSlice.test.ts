import offlineQueueReducer, {
    hydrateBookingQueue,
    enqueueBooking,
    updateBookingQueueItem,
    removeBookingQueueItem,
    clearFailedBookingQueue,
} from './offlineQueueSlice';
import type { BookingQueueItem } from '@/core/sync/sync.types';

describe('offlineQueueSlice', () => {
    const mockQueueItem: BookingQueueItem = {
        id: 'queue-1',
        idempotencyKey: 'idemp-1',
        request: {
            doctorId: 'doc-1',
            slotId: 'slot-1',
            patientName: 'Test Patient',
            mode: 'video',
            date: '2026-08-28',
            idempotencyKey: 'idemp-1',
        },
        status: 'pending',
        retryCount: 0,
        createdAt: '2026-08-28T10:00:00.000Z',
        updatedAt: '2026-08-28T10:00:00.000Z',
    };

    it('handles hydrateBookingQueue', () => {
        const state = offlineQueueReducer(
            { bookings: [], hydrated: false },
            hydrateBookingQueue([mockQueueItem]),
        );

        expect(state.hydrated).toBe(true);
        expect(state.bookings).toHaveLength(1);
        expect(state.bookings[0].id).toBe('queue-1');
    });

    it('enqueues a new booking without duplicates', () => {
        let state = offlineQueueReducer(
            { bookings: [], hydrated: true },
            enqueueBooking(mockQueueItem),
        );

        expect(state.bookings).toHaveLength(1);

        // Attempt duplicate enqueue with same idempotencyKey
        state = offlineQueueReducer(state, enqueueBooking(mockQueueItem));
        expect(state.bookings).toHaveLength(1);
    });

    it('updates a booking queue item status and retry count', () => {
        const state = offlineQueueReducer(
            { bookings: [mockQueueItem], hydrated: true },
            updateBookingQueueItem({
                id: 'queue-1',
                changes: { status: 'failed', retryCount: 1, lastError: 'NETWORK_TIMEOUT' },
            }),
        );

        expect(state.bookings[0].status).toBe('failed');
        expect(state.bookings[0].retryCount).toBe(1);
        expect(state.bookings[0].lastError).toBe('NETWORK_TIMEOUT');
    });

    it('removes a booking queue item', () => {
        const state = offlineQueueReducer(
            { bookings: [mockQueueItem], hydrated: true },
            removeBookingQueueItem('queue-1'),
        );

        expect(state.bookings).toHaveLength(0);
    });

    it('clears failed/conflict bookings from queue', () => {
        const failedItem: BookingQueueItem = {
            ...mockQueueItem,
            id: 'queue-2',
            idempotencyKey: 'idemp-2',
            status: 'failed',
        };

        const state = offlineQueueReducer(
            { bookings: [mockQueueItem, failedItem], hydrated: true },
            clearFailedBookingQueue(),
        );

        expect(state.bookings).toHaveLength(1);
        expect(state.bookings[0].id).toBe('queue-1');
    });
});
