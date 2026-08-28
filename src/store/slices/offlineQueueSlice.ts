import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { BookingQueueItem } from '@/core/sync/sync.types';

type OfflineQueueState = {
    bookings: BookingQueueItem[];
    hydrated: boolean;
};

const initialState: OfflineQueueState = {
    bookings: [],
    hydrated: false,
};

const offlineQueueSlice = createSlice({
    name: 'offlineQueue',

    initialState,

    reducers: {
        hydrateBookingQueue(
            state,
            action: PayloadAction<BookingQueueItem[]>,
        ) {
            state.bookings = action.payload;
            state.hydrated = true;
        },

        enqueueBooking(
            state,
            action: PayloadAction<BookingQueueItem>,
        ) {
            const exists = state.bookings.some(
                item =>
                    item.idempotencyKey ===
                    action.payload.idempotencyKey,
            );

            if (!exists) {
                state.bookings.push(action.payload);
            }
        },

        updateBookingQueueItem(
            state,
            action: PayloadAction<{
                id: string;
                changes: Partial<BookingQueueItem>;
            }>,
        ) {
            const item = state.bookings.find(
                queueItem =>
                    queueItem.id === action.payload.id,
            );

            if (!item) {
                return;
            }

            Object.assign(
                item,
                action.payload.changes,
            );
        },

        removeBookingQueueItem(
            state,
            action: PayloadAction<string>,
        ) {
            state.bookings = state.bookings.filter(
                item =>
                    item.id !== action.payload,
            );
        },

        clearFailedBookingQueue(
            state,
        ) {
            state.bookings = state.bookings.filter(
                item =>
                    item.status !== 'failed' &&
                    item.status !== 'conflict',
            );
        },
    },
});

export const {
    hydrateBookingQueue,
    enqueueBooking,
    updateBookingQueueItem,
    removeBookingQueueItem,
    clearFailedBookingQueue,
} = offlineQueueSlice.actions;

export default offlineQueueSlice.reducer;
