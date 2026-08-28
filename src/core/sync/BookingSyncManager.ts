import {
    subscribeToNetworkStatus,
} from '@/core/network/network';

import { syncBookingQueue } from './bookingSync';

let unsubscribe: (() => void) | null = null;
let syncing = false;

export function startBookingSyncManager(): () => void {
    if (unsubscribe) {
        return () => {
            unsubscribe?.();
        };
    }

    unsubscribe = subscribeToNetworkStatus(status => {
        if (
            !status.isConnected ||
            status.isInternetReachable === false
        ) {
            return;
        }

        if (syncing) {
            return;
        }

        syncing = true;

        syncBookingQueue()
            .catch(() => {
                // Keep the queue intact.
            })
            .finally(() => {
                syncing = false;
            });
    });

    return () => {
        unsubscribe?.();
        unsubscribe = null;
    };
}
