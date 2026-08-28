import type {
    CreateBookingRequest,
} from '@/features/consultations/types/consultation.types';

import type { BookingQueueItem } from './sync.types';

export function createBookingQueueItem(
    request: CreateBookingRequest,
): BookingQueueItem {
    const now = new Date().toISOString();

    return {
        id: `booking-queue-${request.idempotencyKey ?? Date.now()}`,
        idempotencyKey: request.idempotencyKey ?? `key-${Date.now()}`,
        request,
        status: 'pending',
        retryCount: 0,
        createdAt: now,
        updatedAt: now,
    };
}
