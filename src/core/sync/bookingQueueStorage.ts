import { storageService } from '@/core/storage/storage';
import type { BookingQueueItem } from './sync.types';

const BOOKING_QUEUE_KEY = 'offline_booking_queue';

export function saveBookingQueue(
    items: BookingQueueItem[],
): void {
    storageService.setJson(
        BOOKING_QUEUE_KEY,
        items,
    );
}

export function loadBookingQueue(): BookingQueueItem[] {
    return (
        storageService.getJson<BookingQueueItem[]>(
            BOOKING_QUEUE_KEY,
        ) ?? []
    );
}

export function clearBookingQueue(): void {
    storageService.remove(BOOKING_QUEUE_KEY);
}
