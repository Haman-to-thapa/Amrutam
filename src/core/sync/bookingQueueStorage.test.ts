import {
    saveBookingQueue,
    loadBookingQueue,
    clearBookingQueue,
} from '@/core/sync/bookingQueueStorage';
import type { BookingQueueItem } from '@/core/sync/sync.types';

describe('bookingQueueStorage', () => {
    const mockItems: BookingQueueItem[] = [
        {
            id: 'item-1',
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
        },
    ];

    beforeEach(() => {
        clearBookingQueue();
    });

    it('returns empty array when no queue is stored', () => {
        expect(loadBookingQueue()).toEqual([]);
    });

    it('saves and loads booking queue items accurately', () => {
        saveBookingQueue(mockItems);
        const loaded = loadBookingQueue();

        expect(loaded).toHaveLength(1);
        expect(loaded[0].id).toBe('item-1');
        expect(loaded[0].idempotencyKey).toBe('idemp-1');
    });

    it('clears stored queue completely', () => {
        saveBookingQueue(mockItems);
        clearBookingQueue();

        expect(loadBookingQueue()).toEqual([]);
    });
});
