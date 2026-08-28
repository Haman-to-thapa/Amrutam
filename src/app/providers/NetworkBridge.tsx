import { useEffect } from 'react';
import {
    getNetworkStatus,
    subscribeToNetworkStatus,
} from '@/core/network/network';
import { useAppDispatch } from '@/store/hooks';
import { setNetworkStatus } from '@/store/slices/networkSlice';

export function NetworkBridge() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        let mounted = true;

        getNetworkStatus()
            .then(status => {
                if (mounted) {
                    dispatch(setNetworkStatus(status));
                }
            })
            .catch(() => {
                // Keep default state.
            });

        const unsubscribe = subscribeToNetworkStatus(status => {
            if (mounted) {
                dispatch(setNetworkStatus(status));
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [dispatch]);

    return null;
}
