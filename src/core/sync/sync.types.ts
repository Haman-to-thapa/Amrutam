import type {
    CreateBookingRequest,
} from '@/features/consultations/types/consultation.types';

export type BookingQueueStatus =
    | 'pending'
    | 'syncing'
    | 'failed'
    | 'conflict';

export type BookingQueueItem = {
    id: string;
    idempotencyKey: string;
    request: CreateBookingRequest;
    status: BookingQueueStatus;
    retryCount: number;
    createdAt: string;
    updatedAt: string;
    lastError?: string;
};
