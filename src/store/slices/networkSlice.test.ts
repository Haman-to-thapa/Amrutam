import networkReducer, { setNetworkStatus } from './networkSlice';
import { selectIsOffline, selectIsConnected } from '../selectors/networkSelectors';
import type { RootState } from '../rootReducer';

describe('networkSlice & networkSelectors', () => {
    it('should handle setNetworkStatus', () => {
        const initialState = {
            isConnected: false,
            isInternetReachable: null,
            type: 'unknown' as const,
            initialized: false,
        };

        const state = networkReducer(
            initialState,
            setNetworkStatus({
                isConnected: true,
                isInternetReachable: true,
                type: 'wifi',
            }),
        );

        expect(state.isConnected).toBe(true);
        expect(state.isInternetReachable).toBe(true);
        expect(state.type).toBe('wifi');
        expect(state.initialized).toBe(true);
    });

    it('should correctly select isOffline state', () => {
        const mockStateOnline = {
            network: {
                isConnected: true,
                isInternetReachable: true,
                type: 'wifi',
                initialized: true,
            },
        } as RootState;

        expect(selectIsOffline(mockStateOnline)).toBe(false);
        expect(selectIsConnected(mockStateOnline)).toBe(true);

        const mockStateOffline = {
            network: {
                isConnected: false,
                isInternetReachable: false,
                type: 'none',
                initialized: true,
            },
        } as RootState;

        expect(selectIsOffline(mockStateOffline)).toBe(true);
    });
});
