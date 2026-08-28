import {
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';

import type { NetworkStatus } from '@/core/network/network.types';

export type NetworkState = NetworkStatus & {
    initialized: boolean;
};

const initialState: NetworkState = {
    isConnected: false,
    isInternetReachable: null,
    type: 'unknown',
    initialized: false,
};

export const networkSlice = createSlice({
    name: 'network',
    initialState,

    reducers: {
        setNetworkStatus(
            state,
            action: PayloadAction<NetworkStatus>,
        ) {
            state.isConnected = action.payload.isConnected;
            state.isInternetReachable = action.payload.isInternetReachable;
            state.type = action.payload.type;
            state.initialized = true;
        },
    },
});

export const { setNetworkStatus } = networkSlice.actions;

export default networkSlice.reducer;
