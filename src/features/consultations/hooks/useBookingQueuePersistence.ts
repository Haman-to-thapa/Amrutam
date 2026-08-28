import { useEffect } from 'react';

import {
    loadBookingQueue,
    saveBookingQueue,
} from '@/core/sync/bookingQueueStorage';

import {
    hydrateBookingQueue,
} from '@/store/slices/offlineQueueSlice';

import {
    useAppDispatch,
    useAppSelector,
} from '@/store/hooks';

export function useBookingQueuePersistence() {
    const dispatch = useAppDispatch();

    const bookings = useAppSelector(
        state => state.offlineQueue.bookings,
    );

    const hydrated = useAppSelector(
        state => state.offlineQueue.hydrated,
    );

    useEffect(() => {
        if (hydrated) {
            return;
        }

        dispatch(
            hydrateBookingQueue(
                loadBookingQueue(),
            ),
        );
    }, [dispatch, hydrated]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        saveBookingQueue(bookings);
    }, [bookings, hydrated]);
}
