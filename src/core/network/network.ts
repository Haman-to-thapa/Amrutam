import NetInfo, {
    type NetInfoState,
} from '@react-native-community/netinfo';

import type { NetworkStatus } from './network.types';

function mapNetworkState(state: NetInfoState): NetworkStatus {
    return {
        isConnected: state.isConnected === true,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
    };
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
    const state = await NetInfo.fetch();

    return mapNetworkState(state);
}

export function subscribeToNetworkStatus(
    listener: (status: NetworkStatus) => void,
): () => void {
    return NetInfo.addEventListener(state => {
        listener(mapNetworkState(state));
    });
}