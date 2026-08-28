import type { RootState } from '@/store/rootReducer';

export const selectSyncingCount = (
    state: RootState,
) =>
    state.offlineQueue.bookings.filter(
        item => item.status === 'syncing',
    ).length;

export const selectFailedSyncCount = (
    state: RootState,
) =>
    state.offlineQueue.bookings.filter(
        item => item.status === 'failed',
    ).length;

export const selectConflictCount = (
    state: RootState,
) =>
    state.offlineQueue.bookings.filter(
        item => item.status === 'conflict',
    ).length;

export const selectPendingSyncCount = (
    state: RootState,
) =>
    state.offlineQueue.bookings.filter(
        item => item.status === 'pending',
    ).length;
