import { useEffect } from 'react';

import { startBookingSyncManager } from '@/core/sync/BookingSyncManager';

export function SyncBridge() {
    useEffect(() => {
        const stop = startBookingSyncManager();
        return stop;
    }, []);

    return null;
}
