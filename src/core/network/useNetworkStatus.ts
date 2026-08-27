import { useEffect, useState } from 'react';

import {
    getNetworkStatus,
    subscribeToNetworkStatus,
} from './network';

import type { NetworkStatus } from './network.types';

const INITIAL_STATUS: NetworkStatus = {
    isConnected: false,
    isInternetReachable: null,
    type: 'unknown',
};

export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>(INITIAL_STATUS);

    useEffect(() => {
        let mounted = true;

        getNetworkStatus()
            .then(currentStatus => {
                if (mounted) {
                    setStatus(currentStatus);
                }
            })
            .catch(() => {
                if (mounted) {
                    setStatus(INITIAL_STATUS);
                }
            });

        const unsubscribe = subscribeToNetworkStatus(nextStatus => {
            if (mounted) {
                setStatus(nextStatus);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    return status;
}