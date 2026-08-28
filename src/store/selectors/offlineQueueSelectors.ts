import type { RootState } from '@/store/rootReducer';

export const selectBookingQueue =
    (state: RootState) =>
        state.offlineQueue.bookings;

export const selectPendingBookingCount =
    (state: RootState) =>
        state.offlineQueue.bookings.filter(
            item =>
                item.status === 'pending' ||
                item.status === 'failed',
        ).length;

export const selectOfflineQueueHydrated =
    (state: RootState) =>
        state.offlineQueue.hydrated;
