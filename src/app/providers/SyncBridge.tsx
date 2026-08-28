import { useEffect } from 'react';

import { startBookingSyncManager } from '@/core/sync/bookingSyncManager';
import { bookingApi } from '@/features/consultations/api/bookingApi';
import { useAppDispatch } from '@/store/hooks';

export function SyncBridge() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const stop = startBookingSyncManager(result => {
            if (result.synced > 0) {
                dispatch(
                    bookingApi.util.invalidateTags([
                        {
                            type: 'Booking',
                            id: 'LIST',
                        },
                    ]),
                );
            }
        });

        return stop;
    }, [dispatch]);

    return null;
}

