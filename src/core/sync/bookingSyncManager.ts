import {
    subscribeToNetworkStatus,
} from '@/core/network/network';

import { syncBookingQueue, type BookingSyncResult } from './bookingSync';

let unsubscribe: (() => void) | null = null;
let syncing = false;

export function startBookingSyncManager(
    onSyncComplete?: (result: BookingSyncResult) => void,
): () => void {
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
            .then(result => {
                onSyncComplete?.(result);
            })
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

