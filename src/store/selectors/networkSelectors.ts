import type { RootState } from '@/store/rootReducer';

export const selectIsConnected = (
    state: RootState,
) => state.network.isConnected;

export const selectIsInternetReachable = (
    state: RootState,
) => state.network.isInternetReachable;

export const selectIsOffline = (
    state: RootState,
) =>
    state.network.initialized &&
    (
        !state.network.isConnected ||
        state.network.isInternetReachable === false
    );
